export async function withTimeout(promise, timeoutMs) {
  let timeoutId = null
  try {
    const timeoutPromise = new Promise((_resolve, reject) => {
      timeoutId = setTimeout(() => {
        const timeoutError = new Error('Request timed out')
        timeoutError.name = 'TimeoutError'
        reject(timeoutError)
      }, timeoutMs)
    })
    return await Promise.race([promise, timeoutPromise])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}
