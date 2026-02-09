# Changelog

Tutti i cambiamenti importanti a questo progetto saranno documentati in questo file.

Il formato è basato su [Keep a Changelog](https://keepachangelog.com/it/1.0.0/),
e questo progetto aderisce al [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Supporto per drag & drop
- Export/import automazioni in JSON
- Variabili personalizzabili nelle automazioni
- Editor visuale delle automazioni
- Gestione pause personalizzabili tra azioni

---

## [1.0.0] - 2026-02-09

### Added
- ✨ Registrazione di azioni utente (click, input, change, submit)
- ▶ Riproduzione automazioni con un click
- 💾 Salvataggio automazioni con nomi personalizzati
- 🎯 Automazioni specifiche per dominio
- 📝 Gestione lista automazioni (visualizza, esegui, elimina)
- 🎨 Interfaccia popup intuitiva con bottoni REC/STOP/PLAY
- 📂 Storage locale delle automazioni
- 🔍 Generazione intelligente di selettori CSS
- ⏱️ Pause automatiche tra azioni durante la riproduzione
- 📋 Pagina di test per provare l'estensione

### Features principali
- Bottone REC rosso con animazione durante la registrazione
- Bottone STOP per fermare la registrazione
- Bottone PLAY per eseguire l'ultima automazione
- Form di salvataggio con nome personalizzato
- Lista automazioni filtrata per URL corrente
- Indicatori di stato visivi
- Icone dell'estensione

### Technical
- Manifest V3 per Chrome Extensions
- Content script per interazione con pagine web
- Service worker per gestione eventi background
- Chrome Storage API per persistenza dati
- Event listeners per catturare interazioni utente

---

## Note sulle versioni

### Schema di versionamento

- **Major version (X.0.0)**: Cambiamenti incompatibili con versioni precedenti
- **Minor version (0.X.0)**: Nuove funzionalità retrocompatibili
- **Patch version (0.0.X)**: Bug fix retrocompatibili

### Tipi di cambiamenti

- `Added` - Nuove funzionalità
- `Changed` - Modifiche a funzionalità esistenti
- `Deprecated` - Funzionalità che saranno rimosse
- `Removed` - Funzionalità rimosse
- `Fixed` - Bug fix
- `Security` - Fix di vulnerabilità

---

[Unreleased]: https://github.com/TUO-USERNAME/chrome-automation-recorder/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/TUO-USERNAME/chrome-automation-recorder/releases/tag/v1.0.0
