let isRecording = false;

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
  document.removeEventListener('input', handleInput, true);
  document.removeEventListener('change', handleChange, true);
  document.removeEventListener('submit', handleSubmit, true);
  
  console.log('Registrazione fermata');
}

// Gestisce click
function handleClick(event) {
  if (!isRecording) return;
  
  const target = event.target;
  const selector = getUniqueSelector(target);
  
  // Ignora click su elementi dell'estensione
  if (target.closest('[data-automation-recorder]')) {
    return;
  }
  
  const action = {
    type: 'click',
    selector: selector,
    tagName: target.tagName,
    text: target.textContent.substring(0, 50),
    timestamp: Date.now()
  };
  
  // Invia al background
  chrome.runtime.sendMessage({
    action: 'addAction',
    actionData: action
  });
  
  console.log('Click registrato:', action);
}

// Gestisce input
let lastInputAction = null;
function handleInput(event) {
  if (!isRecording) return;
  
  const target = event.target;
  const selector = getUniqueSelector(target);
  
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
        chrome.runtime.sendMessage({
          action: 'addAction',
          actionData: lastInputAction
        });
        console.log('Input registrato:', lastInputAction);
        lastInputAction = null;
      }
    }, 500);
  }
}

// Gestisce change (per select, checkbox, radio)
function handleChange(event) {
  if (!isRecording) return;
  
  const target = event.target;
  const selector = getUniqueSelector(target);
  
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
  chrome.runtime.sendMessage({
    action: 'addAction',
    actionData: action
  });
  
  console.log('Change registrato:', action);
}

// Gestisce submit
function handleSubmit(event) {
  if (!isRecording) return;
  
  const target = event.target;
  const selector = getUniqueSelector(target);
  
  const action = {
    type: 'submit',
    selector: selector,
    timestamp: Date.now()
  };
  
  // Invia al background
  chrome.runtime.sendMessage({
    action: 'addAction',
    actionData: action
  });
  
  console.log('Submit registrato:', action);
}

// Genera un selettore unico per l'elemento
function getUniqueSelector(element) {
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
      if (document.querySelectorAll(selector).length === 1) {
        return selector;
      }
    }
  }
  
  // Usa nth-child come fallback
  let path = [];
  let current = element;
  
  while (current && current.tagName) {
    let selector = current.tagName.toLowerCase();
    
    if (current.id) {
      path.unshift(`#${current.id}`);
      break;
    }
    
    // Aggiungi nth-child se necessario
    let sibling = current;
    let nth = 1;
    while (sibling.previousElementSibling) {
      sibling = sibling.previousElementSibling;
      if (sibling.tagName === current.tagName) {
        nth++;
      }
    }
    
    if (nth > 1 || current.nextElementSibling) {
      selector += `:nth-child(${nth})`;
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
  const element = document.querySelector(action.selector);
  
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
