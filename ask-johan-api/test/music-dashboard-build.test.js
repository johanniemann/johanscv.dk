import assert from 'node:assert/strict'
import test from 'node:test'
import { buildSpotifyDashboardSnapshot, InsufficientSpotifyDataError } from '../src/features/music-dashboard-build.js'

test('buildSpotifyDashboardSnapshot builds dashboard lists with track/album/artist cards', () => {
  const snapshot = buildSpotifyDashboardSnapshot({
    recentlyPlayedItems: buildFixtureRecentlyPlayed(),
    artistsById: buildFixtureArtists(),
    now: new Date('2026-02-24T10:00:00.000Z')
  })

  assert.equal(snapshot.periodFallbackUsed, false)
  assert.equal(snapshot.lists.tracks.length, 4)
  assert.equal(snapshot.lists.albums.length, 4)
  assert.equal(snapshot.lists.artists.length, 4)

  assert.equal(snapshot.lists.tracks[0].title, 'Night Train')
  assert.equal(snapshot.lists.albums[0].title, 'Signals')
  assert.equal(snapshot.lists.artists[0].title, 'The North')
  assert.equal(snapshot.lists.artists[0].imageUrl, 'https://cdn.example/artist-art1.jpg')
})

test('buildSpotifyDashboardSnapshot falls back to all recent plays when no events are inside weekly window', () => {
  const oldOnlyItems = buildFixtureRecentlyPlayed().map((item) => ({
    ...item,
    played_at: '2026-01-01T00:00:00.000Z'
  }))

  const snapshot = buildSpotifyDashboardSnapshot({
    recentlyPlayedItems: oldOnlyItems,
    artistsById: buildFixtureArtists(),
    now: new Date('2026-02-24T10:00:00.000Z')
  })

  assert.equal(snapshot.periodFallbackUsed, true)
  assert.equal(snapshot.lists.tracks.length, 4)
})

test('buildSpotifyDashboardSnapshot throws InsufficientSpotifyDataError for empty data', () => {
  assert.throws(
    () =>
      buildSpotifyDashboardSnapshot({
        recentlyPlayedItems: [],
        artistsById: {}
      }),
    InsufficientSpotifyDataError
  )
})

function buildFixtureArtists() {
  return {
    art1: {
      id: 'art1',
      name: 'The North',
      imageUrl: 'https://cdn.example/artist-art1.jpg',
      externalUrl: 'https://open.spotify.com/artist/art1'
    },
    art2: {
      id: 'art2',
      name: 'Signals Duo',
      imageUrl: 'https://cdn.example/artist-art2.jpg',
      externalUrl: 'https://open.spotify.com/artist/art2'
    },
    art3: {
      id: 'art3',
      name: 'City Echo',
      imageUrl: 'https://cdn.example/artist-art3.jpg',
      externalUrl: 'https://open.spotify.com/artist/art3'
    },
    art4: {
      id: 'art4',
      name: 'Orbit',
      imageUrl: 'https://cdn.example/artist-art4.jpg',
      externalUrl: 'https://open.spotify.com/artist/art4'
    }
  }
}

function buildFixtureRecentlyPlayed() {
  return [
    play({
      playedAt: '2026-02-23T20:01:00.000Z',
      trackId: 'tr1',
      trackName: 'Night Train',
      albumId: 'al1',
      albumName: 'Signals',
      artistId: 'art1',
      artistName: 'The North'
    }),
    play({
      playedAt: '2026-02-23T19:54:00.000Z',
      trackId: 'tr2',
      trackName: 'Glass River',
      albumId: 'al2',
      albumName: 'Riverline',
      artistId: 'art2',
      artistName: 'Signals Duo'
    }),
    play({
      playedAt: '2026-02-23T19:47:00.000Z',
      trackId: 'tr3',
      trackName: 'Skyline Drift',
      albumId: 'al3',
      albumName: 'Skyline',
      artistId: 'art3',
      artistName: 'City Echo'
    }),
    play({
      playedAt: '2026-02-23T19:32:00.000Z',
      trackId: 'tr4',
      trackName: 'Signals Again',
      albumId: 'al1',
      albumName: 'Signals',
      artistId: 'art1',
      artistName: 'The North'
    }),
    play({
      playedAt: '2026-02-23T19:12:00.000Z',
      trackId: 'tr5',
      trackName: 'Orbit Pulse',
      albumId: 'al4',
      albumName: 'Orbit',
      artistId: 'art4',
      artistName: 'Orbit'
    }),
    play({
      playedAt: '2026-02-20T09:12:00.000Z',
      trackId: 'tr1',
      trackName: 'Night Train',
      albumId: 'al1',
      albumName: 'Signals',
      artistId: 'art1',
      artistName: 'The North'
    }),
    play({
      playedAt: '2026-02-20T08:42:00.000Z',
      trackId: 'tr2',
      trackName: 'Glass River',
      albumId: 'al2',
      albumName: 'Riverline',
      artistId: 'art2',
      artistName: 'Signals Duo'
    })
  ]
}

function play({ playedAt, trackId, trackName, albumId, albumName, artistId, artistName }) {
  return {
    played_at: playedAt,
    track: {
      id: trackId,
      name: trackName,
      external_urls: {
        spotify: `https://open.spotify.com/track/${trackId}`
      },
      album: {
        id: albumId,
        name: albumName,
        external_urls: {
          spotify: `https://open.spotify.com/album/${albumId}`
        },
        images: [{ url: `https://cdn.example/${albumId}.jpg` }]
      },
      artists: [
        {
          id: artistId,
          name: artistName,
          external_urls: {
            spotify: `https://open.spotify.com/artist/${artistId}`
          }
        }
      ]
    }
  }
}
