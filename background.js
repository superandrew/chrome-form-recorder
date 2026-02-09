// Service worker per gestire eventi di background

// Stato globale della registrazione
let recordingState = {
  isRecording: false,
  tabId: null,
  actions: []
};

chrome.runtime.onInstalled.addListener(() => {
  console.log('Web Automation Recorder installato');
  
  // Inizializza storage se necessario
  chrome.storage.local.get(['automations'], (result) => {
    if (!result.automations) {
      chrome.storage.local.set({ automations: [] });
    }
  });
});

// Gestisci messaggi da content script e popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getAutomations') {
    chrome.storage.local.get(['automations'], (result) => {
      sendResponse({ automations: result.automations || [] });
    });
    return true;
  }
  
  if (request.action === 'getRecordingState') {
    sendResponse(recordingState);
    return true;
  }
  
  if (request.action === 'setRecordingState') {
    recordingState = { ...recordingState, ...request.state };
    sendResponse({ success: true });
    return true;
  }
  
  if (request.action === 'addAction') {
    if (recordingState.isRecording && sender.tab.id === recordingState.tabId) {
      recordingState.actions.push(request.actionData);
    }
    return true;
  }
  
  if (request.action === 'clearActions') {
    recordingState.actions = [];
    sendResponse({ success: true });
    return true;
  }
});
