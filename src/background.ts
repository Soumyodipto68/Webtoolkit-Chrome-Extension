chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== 'CSS_ELEMENT_SELECTED') {
    return
  }

  chrome.runtime.sendMessage(message)
  sendResponse({ success: true })
})