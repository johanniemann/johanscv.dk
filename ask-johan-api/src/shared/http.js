export function sendAnswer(res, status, answer) {
  return res.status(status).json({ answer })
}

export function setNoStore(res) {
  res.setHeader('Cache-Control', 'no-store')
}

export function getRequestIp(req) {
  return req.ip || req.socket?.remoteAddress || 'unknown'
}
