import { extractCssInfo } from './cssUtils'

chrome.runtime.onMessage.addListener(
  (message, _sender, sendResponse) => {
    if (message.type !== 'SCAN_CSS') {
      return
    }

    try {
      const data = extractCssInfo()

      sendResponse({
        success: true,
        data,
      })
    } catch {
      sendResponse({
        success: false,
        error: 'Failed to extract CSS information.',
      })
    }

    return true
  }
)