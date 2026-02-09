let isRecording = false;
let lastPointerDown = null;

// Listener per messaggi dal popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startRecording') {
    startRecording();
    sendResponse({ success: true });
  } else if (request.action === 'stopRecording') {
    stopRecording();
    sendResponse({ success: true });
  } else if (request.action === 'playRecording') {
    playRecording(request.actions).then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      console.error('Errore riproduzione:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true; // Mantiene il canale aperto per risposta asincrona
  }
});

// Inizia registrazione
function startRecording() {
  isRecording = true;
  
  // Aggiungi event listeners
  document.addEventListener('click', handleClick, true);
  document.addEventListener('pointerdown', handlePointerDown, true);
  document.addEventListener('keydown', handleKeydown, true);
  document.addEventListener('input', handleInput, true);
  document.addEventListener('change', handleChange, true);
  document.addEventListener('submit', handleSubmit, true);
  
  console.log('Registrazione iniziata');
}

// Ferma registrazione
function stopRecording() {
  isRecording = false;
  
  // Rimuovi event listeners
  document.removeEventListener('click', handleClick, true);
  document.removeEventListener('pointerdown', handlePointerDown, true);
  document.removeEventListener('keydown', handleKeydown, true);
  document.removeEventListener('input', handleInput, true);
  document.removeEventListener('change', handleChange, true);
  document.removeEventListener('submit', handleSubmit, true);
  
  console.log('Registrazione fermata');
}

// Gestisce click
function handleClick(event) {
  if (!isRecording) return;
  
  const target = getEventTarget(event);
  if (!target) return;
  const selector = getDeepSelector(target);
  
  // Ignora click su elementi dell'estensione
  if (target.closest('[data-automation-recorder]')) {
    return;
  }
  
  if (shouldSkipClick(selector)) {
    return;
  }
  
  const action = {
    type: 'click',
    selector: selector,
    tagName: target.tagName,
    text: (target.textContent || '').substring(0, 50),
    timestamp: Date.now()
  };
  
  // Invia al background
  recordAction(action);
  
  console.log('Click registrato:', action);
}

function handlePointerDown(event) {
  if (!isRecording) return;
  
  const target = getEventTarget(event);
  if (!target) return;
  
  if (target.closest('[data-automation-recorder]')) {
    return;
  }
  
  const selector = getDeepSelector(target);
  lastPointerDown = { selector, timestamp: Date.now() };
  
  const action = {
    type: 'pointerdown',
    selector: selector,
    tagName: target.tagName,
    text: (target.textContent || '').substring(0, 50),
    timestamp: Date.now()
  };
  
  recordAction(action);
  console.log('Pointerdown registrato:', action);
}

function handleKeydown(event) {
  if (!isRecording) return;
  
  if (event.key !== 'Enter' && event.key !== ' ') {
    return;
  }
  
  const target = getEventTarget(event);
  if (!target) return;
  
  if (target.closest('[data-automation-recorder]')) {
    return;
  }
  
  const selector = getDeepSelector(target);
  
  const action = {
    type: 'keydown',
    selector: selector,
    key: event.key,
    tagName: target.tagName,
    timestamp: Date.now()
  };
  
  recordAction(action);
  console.log('Keydown registrato:', action);
}

// Gestisce input
let lastInputAction = null;
function handleInput(event) {
  if (!isRecording) return;
  
  const target = getEventTarget(event);
  if (!target) return;
  const selector = getDeepSelector(target);
  
  const action = {
    type: 'input',
    selector: selector,
    value: target.value,
    inputType: target.type,
    timestamp: Date.now()
  };
  
  // Debounce: aggiorna l'ultima azione se è sullo stesso elemento
  if (lastInputAction && lastInputAction.selector === selector) {
    lastInputAction = action;
  } else {
    lastInputAction = action;
    // Invia al background dopo un breve delay per evitare troppi messaggi
    setTimeout(() => {
      if (lastInputAction && lastInputAction.selector === selector) {
        recordAction(lastInputAction);
        console.log('Input registrato:', lastInputAction);
        lastInputAction = null;
      }
    }, 500);
  }
}

// Gestisce change (per select, checkbox, radio)
function handleChange(event) {
  if (!isRecording) return;
  
  const target = getEventTarget(event);
  if (!target) return;
  const selector = getDeepSelector(target);
  
  let value;
  if (target.type === 'checkbox' || target.type === 'radio') {
    value = target.checked;
  } else if (target.tagName === 'SELECT') {
    value = target.value;
  } else {
    value = target.value;
  }
  
  const action = {
    type: 'change',
    selector: selector,
    value: value,
    inputType: target.type,
    tagName: target.tagName,
    timestamp: Date.now()
  };
  
  // Invia al background
  recordAction(action);
  
  console.log('Change registrato:', action);
}

// Gestisce submit
function handleSubmit(event) {
  if (!isRecording) return;
  
  const target = getEventTarget(event);
  if (!target) return;
  const selector = getDeepSelector(target);
  
  const action = {
    type: 'submit',
    selector: selector,
    timestamp: Date.now()
  };
  
  // Invia al background
  recordAction(action);
  
  console.log('Submit registrato:', action);
}

function getEventTarget(event) {
  if (event.composedPath) {
    const path = event.composedPath();
    const element = path.find(node => node && node.nodeType === Node.ELEMENT_NODE);
    if (element) {
      return element;
    }
  }
  return event.target && event.target.nodeType === Node.ELEMENT_NODE ? event.target : null;
}

function shouldSkipClick(selector) {
  if (!lastPointerDown) return false;
  const timeDiff = Date.now() - lastPointerDown.timestamp;
  if (timeDiff > 500) {
    lastPointerDown = null;
    return false;
  }
  const shouldSkip = lastPointerDown.selector === selector;
  if (shouldSkip) {
    lastPointerDown = null;
  }
  return shouldSkip;
}

function recordAction(action) {
  chrome.runtime.sendMessage({
    action: 'addAction',
    actionData: action
  });
}

function getDeepSelector(element) {
  const parts = [];
  let current = element;
  
  while (current) {
    const root = current.getRootNode();
    const selector = getUniqueSelector(current, root);
    parts.unshift(selector);
    
    if (root instanceof ShadowRoot) {
      current = root.host;
    } else {
      break;
    }
  }
  
  return parts.join(' >>> ');
}

// Genera un selettore unico per l'elemento
function getUniqueSelector(element, root = document) {
  // Prova con ID
  if (element.id) {
    return `#${element.id}`;
  }
  
  // Prova con name
  if (element.name) {
    return `${element.tagName.toLowerCase()}[name="${element.name}"]`;
  }
  
  // Prova con classe unica
  if (element.className && typeof element.className === 'string') {
    const classes = element.className.trim().split(/\s+/).join('.');
    if (classes) {
      const selector = `${element.tagName.toLowerCase()}.${classes}`;
      if (root.querySelectorAll(selector).length === 1) {
        return selector;
      }
    }
  }
  
  // Usa nth-of-type come fallback
  let path = [];
  let current = element;
  
  while (current && current.tagName) {
    let selector = current.tagName.toLowerCase();
    
    if (current.id) {
      path.unshift(`#${current.id}`);
      break;
    }
    
    // Aggiungi nth-of-type se necessario (piu' stabile di nth-child con nodi di testo)
    let sibling = current;
    let nth = 1;
    while (sibling.previousElementSibling) {
      sibling = sibling.previousElementSibling;
      if (sibling.tagName === current.tagName) {
        nth++;
      }
    }
    
    if (nth > 1 || current.nextElementSibling) {
      selector += `:nth-of-type(${nth})`;
    }
    
    path.unshift(selector);
    current = current.parentElement;
    
    // Limita la profondità
    if (path.length > 5) break;
  }
  
  return path.join(' > ');
}

// Riproduci azioni registrate
async function playRecording(actions) {
  console.log('Inizio riproduzione di', actions.length, 'azioni');
  
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    console.log(`Esecuzione azione ${i + 1}/${actions.length}:`, action);
    
    try {
      await executeAction(action);
      // Pausa tra le azioni
      await sleep(300);
    } catch (error) {
      console.error('Errore esecuzione azione:', error, action);
      throw error;
    }
  }
  
  console.log('Riproduzione completata');
}

// Esegue una singola azione
async function executeAction(action) {
  const element = querySelectorDeep(action.selector);
  
  if (!element) {
    throw new Error(`Elemento non trovato: ${action.selector}`);
  }
  
  // Scrolla l'elemento nella vista
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  await sleep(200);
  
  switch (action.type) {
    case 'click':
      element.click();
      break;
      
    case 'pointerdown':
      element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      element.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      element.click();
      break;
      
    case 'keydown':
      element.dispatchEvent(new KeyboardEvent('keydown', { key: action.key, bubbles: true }));
      if (action.key === 'Enter' || action.key === ' ') {
        element.click();
      }
      break;
      
    case 'input':
      element.focus();
      element.value = action.value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      break;
      
    case 'change':
      if (action.inputType === 'checkbox' || action.inputType === 'radio') {
        element.checked = action.value;
      } else {
        element.value = action.value;
      }
      element.dispatchEvent(new Event('change', { bubbles: true }));
      break;
      
    case 'submit':
      element.submit();
      break;
      
    default:
      console.warn('Tipo di azione non riconosciuto:', action.type);
  }
}

function querySelectorDeep(selector) {
  const parts = selector.split(' >>> ');
  let root = document;
  let element = null;
  
  for (let index = 0; index < parts.length; index++) {
    element = root.querySelector(parts[index]);
    if (!element) {
      return null;
    }
    
    if (index < parts.length - 1) {
      root = element.shadowRoot;
      if (!root) {
        return null;
      }
    }
  }
  
  return element;
}

// Utility: sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Evidenzia elemento durante la riproduzione (opzionale)
function highlightElement(element) {
  const originalOutline = element.style.outline;
  element.style.outline = '3px solid #ff0000';
  
  setTimeout(() => {
    element.style.outline = originalOutline;
  }, 500);
}
