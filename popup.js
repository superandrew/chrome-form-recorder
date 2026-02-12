let isRecording = false;
let recordedActions = [];
let currentTab = null;
let verboseLogsEnabled = false;
let smartWaitEnabled = true;
let actionTimeoutMs = 8000;

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
const buildVersion = document.getElementById('buildVersion');
const stateLabel = document.getElementById('stateLabel');
const automationCount = document.getElementById('automationCount');
const container = document.querySelector('.container');
const verboseLogsToggle = document.getElementById('verboseLogsToggle');
const smartWaitToggle = document.getElementById('smartWaitToggle');
const actionTimeoutInput = document.getElementById('actionTimeoutMs');

const STATE_LABELS = {
  idle: 'Idle',
  recording: 'Recording',
  saved: 'Saved',
  playing: 'Playing',
  error: 'Errore'
};

// Inizializzazione rapida
const manifest = chrome.runtime.getManifest();
if (buildVersion && manifest && manifest.version) {
  buildVersion.textContent = `v${manifest.version}`;
}

// Inizializzazione dati
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  currentTab = tabs[0];
  if (!currentTab) return;
  
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
      
      setUiState('recording');
      showStatus(`🔴 Registrazione in corso... (${recordedActions.length} azioni)`, 'info');
    } else {
      setUiState('idle');
    }
  });
  
  loadAutomations();
  loadPreferences();
  loadContentBuildInfo();
});

// Event listeners
recordBtn.addEventListener('click', startRecording);
stopBtn.addEventListener('click', stopRecording);
playBtn.addEventListener('click', playLastRecording);
saveBtn.addEventListener('click', saveAutomation);
cancelBtn.addEventListener('click', cancelSave);
if (verboseLogsToggle) {
  verboseLogsToggle.addEventListener('change', handleVerboseLogsToggle);
}
if (smartWaitToggle) {
  smartWaitToggle.addEventListener('change', handleSmartWaitToggle);
}
if (actionTimeoutInput) {
  actionTimeoutInput.addEventListener('change', handleActionTimeoutChange);
}

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
  setUiState('recording');
  
  // Invia messaggio al content script per iniziare la registrazione
  chrome.tabs.sendMessage(currentTab.id, { action: 'startRecording' }, () => {
    if (chrome.runtime.lastError) {
      showStatus('Impossibile avviare la registrazione su questa pagina', 'error');
      isRecording = false;
      recordBtn.disabled = false;
      recordBtn.classList.remove('recording');
      stopBtn.disabled = true;
      setUiState('error');
    }
  });
  
  showStatus('🔴 Registrazione in corso...', 'info');
}

// Ferma registrazione
function stopRecording() {
  isRecording = false;

  // Prima ferma il content script (che fa anche flush degli input in debounce).
  chrome.tabs.sendMessage(currentTab.id, { action: 'stopRecording' }, () => {
    // Ignora eventuali lastError: in quel caso salviamo comunque stato UI.

    // Attendi un attimo per permettere al background di ricevere le ultime azioni.
    setTimeout(() => {
      // Recupera le azioni dal background
      chrome.runtime.sendMessage({ action: 'getRecordingState' }, (state) => {
        recordedActions = state.actions || [];

        // Ora resetta lo stato nel background
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

        if (recordedActions.length > 0) {
          playBtn.disabled = false;
          saveSection.style.display = 'block';
          setUiState('saved');
          showStatus(`✓ Registrate ${recordedActions.length} azioni`, 'success');
        } else {
          setUiState('idle');
          showStatus('Nessuna azione registrata', 'error');
        }
      });
    }, 650);
  });
}

// Riproduci ultima registrazione
async function playLastRecording() {
  if (recordedActions.length === 0) {
    showStatus('Nessuna azione da riprodurre', 'error');
    return;
  }
  
  playBtn.disabled = true;
  setUiState('playing');
  showStatus('▶ Riproduzione in corso...', 'info');
  
  chrome.tabs.sendMessage(currentTab.id, {
    action: 'playRecording',
    actions: recordedActions,
    options: {
      verboseLogs: verboseLogsEnabled,
      smartWait: smartWaitEnabled,
      actionTimeoutMs
    }
  }, (response) => {
    playBtn.disabled = false;
    if (response && response.success) {
      setUiState('idle');
      showStatus('✓ Automazione completata', 'success');
    } else {
      setUiState('error');
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
      setUiState('idle');
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
  setUiState('idle');
}

// Carica automazioni salvate
function loadAutomations() {
  chrome.storage.local.get(['automations'], (result) => {
    const automations = result.automations || [];
    
    if (automationCount) {
      automationCount.textContent = automations.length.toString();
    }
    
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
  setUiState('playing');
  
  chrome.tabs.sendMessage(currentTab.id, {
    action: 'playRecording',
    actions: automation.actions,
    options: {
      verboseLogs: verboseLogsEnabled,
      smartWait: smartWaitEnabled,
      actionTimeoutMs
    }
  }, (response) => {
    if (response && response.success) {
      setUiState('idle');
      showStatus(`✓ "${automation.name}" completata`, 'success');
    } else {
      setUiState('error');
      showStatus('✗ Errore durante l\'esecuzione', 'error');
    }
  });
}

function loadPreferences() {
  chrome.storage.local.get(['verboseLogsEnabled', 'smartWaitEnabled', 'actionTimeoutMs'], (result) => {
    verboseLogsEnabled = Boolean(result.verboseLogsEnabled);
    smartWaitEnabled = result.smartWaitEnabled !== false;
    actionTimeoutMs = clampTimeoutMs(result.actionTimeoutMs);

    if (verboseLogsToggle) {
      verboseLogsToggle.checked = verboseLogsEnabled;
    }
    if (smartWaitToggle) {
      smartWaitToggle.checked = smartWaitEnabled;
    }
    if (actionTimeoutInput) {
      actionTimeoutInput.value = String(actionTimeoutMs);
    }
  });
}

function handleVerboseLogsToggle(event) {
  verboseLogsEnabled = Boolean(event.target.checked);
  chrome.storage.local.set({ verboseLogsEnabled });
}

function handleSmartWaitToggle(event) {
  smartWaitEnabled = Boolean(event.target.checked);
  chrome.storage.local.set({ smartWaitEnabled });
}

function handleActionTimeoutChange(event) {
  actionTimeoutMs = clampTimeoutMs(event.target.value);
  if (actionTimeoutInput) {
    actionTimeoutInput.value = String(actionTimeoutMs);
  }
  chrome.storage.local.set({ actionTimeoutMs });
}

function clampTimeoutMs(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 8000;
  return Math.min(30000, Math.max(1000, Math.round(parsed)));
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
  
  if (type === 'error') {
    setUiState('error');
  }
  
  setTimeout(() => {
    status.style.display = 'none';
  }, 3000);
}

function setUiState(state) {
  if (!container) return;
  container.classList.remove('state-idle', 'state-recording', 'state-saved', 'state-playing', 'state-error');
  container.classList.add(`state-${state}`);
  container.dataset.state = state;
  
  if (stateLabel && STATE_LABELS[state]) {
    stateLabel.textContent = STATE_LABELS[state];
  }
}

function loadContentBuildInfo() {
  if (!currentTab || !buildVersion) return;

  const manifest = chrome.runtime.getManifest();
  const extVersion = manifest && manifest.version ? `v${manifest.version}` : '';
  buildVersion.textContent = `${extVersion} • c:n/a`;

  chrome.tabs.sendMessage(currentTab.id, { action: 'getBuildInfo' }, (response) => {
    if (chrome.runtime.lastError) {
      buildVersion.title = `Content build non disponibile: ${chrome.runtime.lastError.message}`;
      return;
    }

    if (!response || !response.build) {
      buildVersion.title = 'Content build non disponibile su questa pagina';
      return;
    }

    buildVersion.textContent = `${extVersion} • c:${response.build}`;
    buildVersion.title = `topFrame=${response.topFrame} | ${response.href}`;
  });
}
