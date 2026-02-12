// Service worker per gestire eventi di background

const defaultRecordingState = {
  isRecording: false,
  tabId: null,
  actions: []
};

// Stato globale della registrazione (tenuto in memoria ma sincronizzato con storage.session)
let recordingState = { ...defaultRecordingState };
let recordingStateLoaded = false;

function loadRecordingState(callback) {
  chrome.storage.session.get(['recordingState'], (result) => {
    recordingState = result.recordingState || { ...defaultRecordingState };
    recordingStateLoaded = true;
    callback(recordingState);
  });
}

function saveRecordingState(state, callback) {
  recordingState = { ...state };
  chrome.storage.session.set({ recordingState }, () => {
    if (callback) {
      callback();
    }
  });
}

function ensureRecordingStateLoaded(callback) {
  if (recordingStateLoaded) {
    callback(recordingState);
    return;
  }
  loadRecordingState(callback);
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('Web Automation Recorder installato');
  
  // Inizializza storage se necessario
  chrome.storage.local.get(['automations'], (result) => {
    if (!result.automations) {
      chrome.storage.local.set({ automations: [] });
    }
  });

  chrome.storage.session.get(['recordingState'], (result) => {
    if (!result.recordingState) {
      chrome.storage.session.set({ recordingState: { ...defaultRecordingState } });
    }
  });
});

chrome.runtime.onStartup.addListener(() => {
  loadRecordingState(() => {});
});

// Also load once when the worker is evaluated.
ensureRecordingStateLoaded(() => {});

// Gestisci messaggi da content script e popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getAutomations') {
    chrome.storage.local.get(['automations'], (result) => {
      sendResponse({ automations: result.automations || [] });
    });
    return true;
  }
  
  if (request.action === 'getRecordingState') {
    ensureRecordingStateLoaded((state) => {
      sendResponse(state);
    });
    return true;
  }
  
  if (request.action === 'setRecordingState') {
    const nextState = { ...recordingState, ...request.state };
    saveRecordingState(nextState, () => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.action === 'addAction') {
    const senderTabId = sender && sender.tab ? sender.tab.id : null;
    const canAccept = recordingState.isRecording && senderTabId !== null && senderTabId === recordingState.tabId;

    if (canAccept) {
      const updatedState = {
        ...recordingState,
        actions: [...recordingState.actions, request.actionData]
      };
      saveRecordingState(updatedState, () => {
        sendResponse({ success: true });
      });
    } else {
      sendResponse({ success: false });
    }
    return true;
  }
  
  if (request.action === 'clearActions') {
    const updatedState = { ...recordingState, actions: [] };
    saveRecordingState(updatedState, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});
