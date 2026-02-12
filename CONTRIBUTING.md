# 🤝 Contribuire a Chrome Automation Recorder

Grazie per il tuo interesse nel contribuire! Questo documento fornisce linee guida per contribuire al progetto.

## 📋 Come contribuire

### Segnalare bug

1. Controlla se il bug è già stato segnalato nelle [Issues](https://github.com/TUO-USERNAME/chrome-automation-recorder/issues)
2. Se non esiste, crea una nuova issue usando il template "Bug Report"
3. Fornisci più dettagli possibili: passi per riprodurre, screenshot, log della console

### Suggerire nuove funzionalità

1. Controlla le [Issues](https://github.com/TUO-USERNAME/chrome-automation-recorder/issues) esistenti
2. Crea una nuova issue usando il template "Feature Request"
3. Spiega il problema che la feature risolverebbe
4. Descrivi la soluzione proposta

### Contribuire al codice

#### Setup del progetto

```bash
# 1. Fai un fork del repository su GitHub

# 2. Clona il tuo fork
git clone https://github.com/TUO-USERNAME/chrome-automation-recorder.git
cd chrome-automation-recorder

# 3. Aggiungi il repository originale come remote
git remote add upstream https://github.com/OWNER-ORIGINALE/chrome-automation-recorder.git

# 4. Carica l'estensione in Chrome per testarla
# Vai su chrome://extensions/
# Attiva "Modalità sviluppatore"
# Clicca "Carica estensione non pacchettizzata"
# Seleziona la cartella del progetto
```

#### Workflow di sviluppo

```bash
# 1. Crea un branch per la tua feature
git checkout -b feature/nome-feature

# 2. Fai le modifiche necessarie

# 3. Testa le modifiche
# - Ricarica l'estensione in chrome://extensions/
# - Testa su diverse pagine web
# - Verifica che non ci siano errori nella console

# 4. Committa le modifiche
git add .
git commit -m "Add: descrizione chiara delle modifiche"

# 5. Pusha sul tuo fork
git push origin feature/nome-feature

# 6. Crea una Pull Request su GitHub
```

## 📝 Linee guida per il codice

### Style Guide

- **JavaScript**: Usa ES6+ syntax
- **Indentazione**: 2 spazi
- **Nomi variabili**: camelCase
- **Nomi costanti**: UPPER_CASE
- **Commenti**: Scrivi commenti chiari in italiano

### Esempio di codice ben formattato

```javascript
// Buono ✅
function getUniqueSelector(element) {
  // Controlla se l'elemento ha un ID
  if (element.id) {
    return `#${element.id}`;
  }
  
  // Altrimenti usa il name attribute
  if (element.name) {
    return `${element.tagName.toLowerCase()}[name="${element.name}"]`;
  }
  
  return null;
}

// Da evitare ❌
function getsel(el){
if(el.id){return '#'+el.id}
if(el.name){return el.tagName.toLowerCase()+'[name="'+el.name+'"]'}
return null
}
```

### Struttura dei commit

Usa prefissi chiari nei messaggi di commit:

- `Add:` - Nuove funzionalità
- `Fix:` - Correzioni di bug
- `Update:` - Modifiche a funzionalità esistenti
- `Remove:` - Rimozione di codice
- `Docs:` - Modifiche alla documentazione
- `Style:` - Modifiche di stile/formattazione
- `Refactor:` - Refactoring del codice
- `Test:` - Aggiunta o modifica di test

Esempi:
```
Add: supporto per drag & drop elementi
Fix: risolto bug nella registrazione checkbox
Update: migliorato algoritmo di selezione elementi
Docs: aggiornato README con nuove istruzioni
```

## 🧪 Testing

Prima di creare una Pull Request, assicurati di:

- [ ] Testare l'estensione su almeno 3 siti web diversi
- [ ] Verificare che la registrazione funzioni correttamente
- [ ] Verificare che la riproduzione funzioni correttamente
- [ ] Controllare che non ci siano errori nella console (F12)
- [ ] Testare su Chrome aggiornato all'ultima versione
- [ ] Verificare che il codice sia ben commentato

## 🎯 Aree dove contribuire

Cerca issues con i seguenti label:

- `good first issue` - Ottimo per iniziare
- `help wanted` - Abbiamo bisogno di aiuto
- `enhancement` - Nuove funzionalità da implementare
- `bug` - Bug da risolvere

## 📖 Risorse utili

- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [Chrome Extensions API Reference](https://developer.chrome.com/docs/extensions/reference/)
- [DOM Events](https://developer.mozilla.org/en-US/docs/Web/Events)
- [CSS Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)

## 📜 Code of Conduct

- Sii rispettoso e inclusivo
- Accetta critiche costruttive
- Concentrati su ciò che è meglio per la community
- Mostra empatia verso gli altri membri

## ❓ Domande?

Se hai domande o dubbi:

1. Controlla il [README.md](README.md)
2. Cerca nelle [Issues](https://github.com/TUO-USERNAME/chrome-automation-recorder/issues)
3. Crea una nuova issue con le tue domande

## 🎉 Riconoscimenti

Tutti i contributori saranno aggiunti alla sezione "Contributors" del README.

Grazie per aver contribuito! 🙏

## 🧭 Note di debug (v1.2+)

Quando segnali o risolvi bug su replay/recording, includi sempre:

- Versione popup (es. `v1.2`)
- Content build (es. `c:2026-02-12.3`)
- Stato opzioni replay: `Smart wait`, `Timeout`, `Verbose logs`
- Estratto log console con prefisso `[Automation][verbose]`

### Checklist test minima per PR

- [ ] Registrazione + stop salva almeno 1 azione su sito statico
- [ ] Replay funziona su almeno 1 SPA
- [ ] Nessun replay duplicato in pagine con iframe
- [ ] Build visibile nel popup (`vX.Y • c:...`)
