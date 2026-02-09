let isRecording = false;
let recordedActions = [];
let currentTab = null;

// Elementi DOM
const recordBtn = document.getElementById('recordBtn');
const stopBtn = document.getElementById('stopBtn');
const playBtn = document.getElementById('playBtn');
const saveSection = document.getElementById('saveSection');
const automationName = document.getElementById('automationName');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const automationsList = document.getElementById('automationsList');
const status = document.getElementById('status');
const currentUrl = document.getElementById('currentUrl');

// Inizializzazione
chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
  currentTab = tabs[0];
  currentUrl.textContent = currentTab.url;
  
  // Recupera lo stato della registrazione dal background
  chrome.runtime.sendMessage({ action: 'getRecordingState' }, (state) => {
    if (state && state.isRecording && state.tabId === currentTab.id) {
      // La registrazione è in corso
      isRecording = true;
      recordedActions = state.actions || [];
      
      recordBtn.disabled = true;
      recordBtn.classList.add('recording');
      stopBtn.disabled = false;
      
      showStatus(`🔴 Registrazione in corso... (${recordedActions.length} azioni)`, 'info');
    }
  });
  
  loadAutomations();
});

// Event listeners
recordBtn.addEventListener('click', startRecording);
stopBtn.addEventListener('click', stopRecording);
playBtn.addEventListener('click', playLastRecording);
saveBtn.addEventListener('click', saveAutomation);
cancelBtn.addEventListener('click', cancelSave);

// Inizia registrazione
async function startRecording() {
  isRecording = true;
  recordedActions = [];
  
  // Salva lo stato nel background
  chrome.runtime.sendMessage({
    action: 'setRecordingState',
    state: {
      isRecording: true,
      tabId: currentTab.id,
      actions: []
    }
  });
  
  recordBtn.disabled = true;
  recordBtn.classList.add('recording');
  stopBtn.disabled = false;
  playBtn.disabled = true;
  
  // Invia messaggio al content script per iniziare la registrazione
  chrome.tabs.sendMessage(currentTab.id, { action: 'startRecording' });
  
  showStatus('🔴 Registrazione in corso...', 'info');
}

// Ferma registrazione
function stopRecording() {
  isRecording = false;
  
  // Recupera le azioni dal background
  chrome.runtime.sendMessage({ action: 'getRecordingState' }, (state) => {
    recordedActions = state.actions || [];
    
    // Resetta lo stato nel background
    chrome.runtime.sendMessage({
      action: 'setRecordingState',
      state: {
        isRecording: false,
        tabId: null,
        actions: []
      }
    });
    
    recordBtn.disabled = false;
    recordBtn.classList.remove('recording');
    stopBtn.disabled = true;
    
    // Invia messaggio al content script per fermare la registrazione
    chrome.tabs.sendMessage(currentTab.id, { action: 'stopRecording' });
    
    if (recordedActions.length > 0) {
      playBtn.disabled = false;
      saveSection.style.display = 'block';
      showStatus(`✓ Registrate ${recordedActions.length} azioni`, 'success');
    } else {
      showStatus('Nessuna azione registrata', 'error');
    }
  });
}

// Riproduci ultima registrazione
async function playLastRecording() {
  if (recordedActions.length === 0) {
    showStatus('Nessuna azione da riprodurre', 'error');
    return;
  }
  
  playBtn.disabled = true;
  showStatus('▶ Riproduzione in corso...', 'info');
  
  chrome.tabs.sendMessage(currentTab.id, {
    action: 'playRecording',
    actions: recordedActions
  }, (response) => {
    playBtn.disabled = false;
    if (response && response.success) {
      showStatus('✓ Automazione completata', 'success');
    } else {
      showStatus('✗ Errore durante la riproduzione', 'error');
    }
  });
}

// Salva automazione
async function saveAutomation() {
  const name = automationName.value.trim();
  
  if (!name) {
    showStatus('Inserisci un nome per l\'automazione', 'error');
    return;
  }
  
  if (recordedActions.length === 0) {
    showStatus('Nessuna azione da salvare', 'error');
    return;
  }
  
  const automation = {
    id: Date.now(),
    name: name,
    url: currentTab.url,
    actions: recordedActions,
    createdAt: new Date().toISOString()
  };
  
  // Recupera automazioni esistenti
  chrome.storage.local.get(['automations'], (result) => {
    const automations = result.automations || [];
    automations.push(automation);
    
    chrome.storage.local.set({ automations }, () => {
      showStatus('✓ Automazione salvata', 'success');
      automationName.value = '';
      saveSection.style.display = 'none';
      recordedActions = [];
      playBtn.disabled = true;
      loadAutomations();
    });
  });
}

// Annulla salvataggio
function cancelSave() {
  automationName.value = '';
  saveSection.style.display = 'none';
  recordedActions = [];
  playBtn.disabled = true;
}

// Carica automazioni salvate
function loadAutomations() {
  chrome.storage.local.get(['automations'], (result) => {
    const automations = result.automations || [];
    
    if (automations.length === 0) {
      automationsList.innerHTML = '<p class="empty-message">Nessuna automazione registrata</p>';
      return;
    }
    
    // Filtra automazioni per URL corrente
    const relevantAutomations = automations.filter(auto => {
      const autoUrl = new URL(auto.url);
      const currentUrlObj = new URL(currentTab.url);
      return autoUrl.origin === currentUrlObj.origin;
    });
    
    automationsList.innerHTML = '';
    
    if (relevantAutomations.length === 0) {
      automationsList.innerHTML = '<p class="empty-message">Nessuna automazione per questo sito</p>';
    } else {
      relevantAutomations.forEach(auto => {
        const item = createAutomationItem(auto);
        automationsList.appendChild(item);
      });
    }
  });
}

// Crea elemento automazione
function createAutomationItem(automation) {
  const div = document.createElement('div');
  div.className = 'automation-item';
  
  const date = new Date(automation.createdAt).toLocaleDateString('it-IT');
  
  div.innerHTML = `
    <div class="automation-info">
      <div class="automation-name">${automation.name}</div>
      <div class="automation-url">${automation.url}</div>
      <div class="automation-meta">${automation.actions.length} azioni • ${date}</div>
    </div>
    <div class="automation-actions">
      <button class="btn-small btn-run" data-id="${automation.id}">▶ Esegui</button>
      <button class="btn-small btn-delete" data-id="${automation.id}">🗑</button>
    </div>
  `;
  
  // Event listeners
  div.querySelector('.btn-run').addEventListener('click', () => runAutomation(automation));
  div.querySelector('.btn-delete').addEventListener('click', () => deleteAutomation(automation.id));
  
  return div;
}

// Esegui automazione salvata
async function runAutomation(automation) {
  showStatus('▶ Esecuzione automazione...', 'info');
  
  chrome.tabs.sendMessage(currentTab.id, {
    action: 'playRecording',
    actions: automation.actions
  }, (response) => {
    if (response && response.success) {
      showStatus(`✓ "${automation.name}" completata`, 'success');
    } else {
      showStatus('✗ Errore durante l\'esecuzione', 'error');
    }
  });
}

// Elimina automazione
function deleteAutomation(id) {
  if (!confirm('Vuoi eliminare questa automazione?')) {
    return;
  }
  
  chrome.storage.local.get(['automations'], (result) => {
    const automations = result.automations || [];
    const filtered = automations.filter(auto => auto.id !== id);
    
    chrome.storage.local.set({ automations: filtered }, () => {
      showStatus('✓ Automazione eliminata', 'success');
      loadAutomations();
    });
  });
}

// Mostra messaggio di stato
function showStatus(message, type) {
  status.textContent = message;
  status.className = `status ${type}`;
  status.style.display = 'block';
  
  setTimeout(() => {
    status.style.display = 'none';
  }, 3000);
}
