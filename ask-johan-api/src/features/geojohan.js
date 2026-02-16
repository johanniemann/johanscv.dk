import { AUTH_REQUIRED_MESSAGE, getBearerToken, verifyJwtToken } from './auth.js'
import { sendAnswer, setNoStore, getRequestIp } from '../shared/http.js'

export function createGeoJohanMapsKeyHandler({ jwtSecret, mapsApiKey, authSecurity }) {
  return async function geoJohanMapsKeyHandler(req, res) {
    setNoStore(res)
    const requestIp = getRequestIp(req)
    if (await authSecurity.isLimited('maps key auth check', requestIp, res)) {
      return
    }

    const bearerToken = getBearerToken(req)
    if (!bearerToken) {
      await authSecurity.recordFailure('maps key missing bearer', requestIp)
      return sendAnswer(res, 401, AUTH_REQUIRED_MESSAGE)
    }

    const tokenPayload = verifyJwtToken(bearerToken, jwtSecret)
    if (!tokenPayload) {
      await authSecurity.recordFailure('maps key invalid bearer', requestIp)
      return sendAnswer(res, 401, 'Access denied. Invalid or expired token.')
    }
    if (!(await authSecurity.clearFailures('maps key clear', requestIp, res))) {
      return
    }

    if (!mapsApiKey) {
      return sendAnswer(res, 503, 'GeoJohan maps is temporarily unavailable.')
    }

    return res.json({
      mapsApiKey
    })
  }
}
