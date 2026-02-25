const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000
const DEFAULT_MAX_ITEMS = 6

export class InsufficientSpotifyDataError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InsufficientSpotifyDataError'
    this.code = 'INSUFFICIENT_SPOTIFY_DATA'
  }
}

export function buildSpotifyDashboardSnapshot({
  recentlyPlayedItems = [],
  artistsById = {},
  maxItems = DEFAULT_MAX_ITEMS,
  now = new Date()
}) {
  const plays = normalizePlays(recentlyPlayedItems)
  if (!plays.length) {
    throw new InsufficientSpotifyDataError('There are no recent Spotify plays available for the dashboard yet.')
  }

  const limit = normalizeMaxItems(maxItems)
  const normalizedNow = normalizeNow(now)
  const weeklyWindowStart = new Date(normalizedNow.getTime() - ONE_WEEK_MS)
  const weeklyPlays = plays.filter((play) => play.playedAtMs >= weeklyWindowStart.getTime())
  const weekSource = weeklyPlays.length ? weeklyPlays : plays

  const tracks = buildTopTracks(weekSource, limit)
  const albums = buildTopAlbums(plays, limit)
  const artists = buildTopArtists(weekSource, artistsById, limit)

  return {
    snapshotTimestamp: normalizedNow.toISOString(),
    weeklyWindowStartTimestamp: weeklyWindowStart.toISOString(),
    periodFallbackUsed: !weeklyPlays.length,
    lists: {
      tracks,
      albums,
      artists
    }
  }
}

function buildTopTracks(plays, limit) {
  const byTrack = new Map()
  for (const play of plays) {
    const existing = byTrack.get(play.trackKey)
    if (!existing) {
      byTrack.set(play.trackKey, {
        key: play.trackKey,
        title: play.trackName,
        subtitle: play.artistNames.join(', '),
        imageUrl: play.albumImageUrl,
        spotifyUrl: play.trackExternalUrl,
        previewUrl: play.trackPreviewUrl,
        playCount: 1,
        firstSeenIndex: play.playOrderIndex
      })
      continue
    }

    existing.playCount += 1
    existing.firstSeenIndex = Math.min(existing.firstSeenIndex, play.playOrderIndex)
    if (!existing.imageUrl && play.albumImageUrl) {
      existing.imageUrl = play.albumImageUrl
    }
    if (!existing.spotifyUrl && play.trackExternalUrl) {
      existing.spotifyUrl = play.trackExternalUrl
    }
    if (!existing.previewUrl && play.trackPreviewUrl) {
      existing.previewUrl = play.trackPreviewUrl
    }
  }

  return toRankedItems(byTrack, limit)
}

function buildTopAlbums(plays, limit) {
  const byAlbum = new Map()
  for (const play of plays) {
    const existing = byAlbum.get(play.albumKey)
    if (!existing) {
      byAlbum.set(play.albumKey, {
        key: play.albumKey,
        title: play.albumName,
        subtitle: play.artistNames[0] || 'Unknown artist',
        imageUrl: play.albumImageUrl,
        spotifyUrl: play.albumExternalUrl,
        previewUrl: play.trackPreviewUrl,
        playCount: 1,
        firstSeenIndex: play.playOrderIndex
      })
      continue
    }

    existing.playCount += 1
    existing.firstSeenIndex = Math.min(existing.firstSeenIndex, play.playOrderIndex)
    if (!existing.imageUrl && play.albumImageUrl) {
      existing.imageUrl = play.albumImageUrl
    }
    if (!existing.spotifyUrl && play.albumExternalUrl) {
      existing.spotifyUrl = play.albumExternalUrl
    }
    if (!existing.previewUrl && play.trackPreviewUrl) {
      existing.previewUrl = play.trackPreviewUrl
    }
  }

  return toRankedItems(byAlbum, limit)
}

function buildTopArtists(plays, artistsById, limit) {
  const byArtist = new Map()
  for (const play of plays) {
    const artistId = play.primaryArtistId || `artist:${(play.artistNames[0] || '').toLowerCase()}`
    const existing = byArtist.get(artistId)
    if (!existing) {
      byArtist.set(artistId, {
        key: artistId,
        title: play.artistNames[0] || 'Unknown artist',
        subtitle: '',
        imageUrl: '',
        spotifyUrl: play.primaryArtistExternalUrl,
        previewUrl: play.trackPreviewUrl,
        playCount: 1,
        firstSeenIndex: play.playOrderIndex
      })
      continue
    }

    existing.playCount += 1
    existing.firstSeenIndex = Math.min(existing.firstSeenIndex, play.playOrderIndex)
    if (!existing.spotifyUrl && play.primaryArtistExternalUrl) {
      existing.spotifyUrl = play.primaryArtistExternalUrl
    }
    if (!existing.previewUrl && play.trackPreviewUrl) {
      existing.previewUrl = play.trackPreviewUrl
    }
  }

  for (const [artistId, entry] of byArtist.entries()) {
    const artistMeta = artistsById[artistId]
    if (!artistMeta) continue

    if (artistMeta.name) {
      entry.title = artistMeta.name
    }
    if (artistMeta.imageUrl) {
      entry.imageUrl = artistMeta.imageUrl
    }
    if (artistMeta.externalUrl && !entry.spotifyUrl) {
      entry.spotifyUrl = artistMeta.externalUrl
    }
  }

  return toRankedItems(byArtist, limit)
}

function toRankedItems(collection, limit) {
  return [...collection.values()]
    .sort((a, b) => b.playCount - a.playCount || a.firstSeenIndex - b.firstSeenIndex || a.title.localeCompare(b.title))
    .slice(0, limit)
    .map((item, index) => ({
      id: item.key,
      rank: index + 1,
      title: item.title,
      subtitle: item.subtitle,
      imageUrl: item.imageUrl,
      spotifyUrl: item.spotifyUrl,
      previewUrl: item.previewUrl || '',
      playCount: item.playCount
    }))
}

function normalizePlays(items) {
  if (!Array.isArray(items)) return []

  const plays = []
  for (const [index, item] of items.entries()) {
    const track = item?.track
    if (!track || typeof track !== 'object') continue

    const playedAt = normalizeLabel(item?.played_at)
    const playedAtMs = parseTimestamp(playedAt)
    const trackId = normalizeLabel(track.id)
    const trackName = normalizeLabel(track.name, 'Unknown track')
    const trackExternalUrl = normalizeLabel(track?.external_urls?.spotify)
    const trackPreviewUrl = normalizeLabel(track?.preview_url)

    const artistNames = Array.isArray(track.artists)
      ? track.artists.map((artist) => normalizeLabel(artist?.name)).filter(Boolean)
      : []
    const primaryArtistId = normalizeLabel(track.artists?.[0]?.id)
    const primaryArtistExternalUrl = normalizeLabel(track.artists?.[0]?.external_urls?.spotify)

    const albumId = normalizeLabel(track.album?.id)
    const albumName = normalizeLabel(track.album?.name, 'Unknown album')
    const albumExternalUrl = normalizeLabel(track.album?.external_urls?.spotify)
    const albumImageUrl = normalizeImage(track.album?.images)

    const trackKey = trackId || `track:${trackName.toLowerCase()}|${artistNames.join('|').toLowerCase()}`
    const albumKey = albumId || `album:${albumName.toLowerCase()}|${(artistNames[0] || '').toLowerCase()}`

    plays.push({
      playOrderIndex: index,
      playedAt,
      playedAtMs,
      trackKey,
      trackName,
      trackExternalUrl,
      trackPreviewUrl,
      artistNames: artistNames.length ? artistNames : ['Unknown artist'],
      primaryArtistId,
      primaryArtistExternalUrl,
      albumKey,
      albumName,
      albumExternalUrl,
      albumImageUrl
    })
  }

  return plays
}

function normalizeMaxItems(value) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_MAX_ITEMS
  return Math.min(8, Math.floor(parsed))
}

function normalizeNow(now) {
  if (now instanceof Date && Number.isFinite(now.getTime())) return now
  return new Date()
}

function parseTimestamp(value) {
  const timestamp = Date.parse(String(value || '').trim())
  if (!Number.isFinite(timestamp)) return 0
  return timestamp
}

function normalizeLabel(value, fallback = '') {
  const text = String(value || '').trim()
  return text || fallback
}

function normalizeImage(images) {
  if (!Array.isArray(images)) return ''
  for (const image of images) {
    const url = String(image?.url || '').trim()
    if (url) return url
  }
  return ''
}
