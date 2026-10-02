chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => { if (message.type === 'readPage') sendResponse({text: document.body?.innerText ?? '', url: location.href}); return true; });
