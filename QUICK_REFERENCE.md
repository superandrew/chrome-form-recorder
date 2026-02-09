# 🚀 Quick Reference - Pubblicazione su GitHub

## 📦 Comandi rapidi per pubblicare

### Opzione 1: Prima pubblicazione (nuovo repository)

```bash
# 1. Vai nella cartella del progetto
cd chrome-automation

# 2. Inizializza Git
git init

# 3. Aggiungi tutti i file
git add .

# 4. Primo commit
git commit -m "Initial commit: Chrome Automation Recorder v1.0"

# 5. Crea il repository su GitHub (vai su github.com)
# Poi esegui (sostituisci TUO-USERNAME):
git remote add origin https://github.com/TUO-USERNAME/chrome-automation-recorder.git

# 6. Pusha su GitHub
git branch -M main
git push -u origin main
```

### Opzione 2: Aggiornamenti futuri

```bash
# 1. Verifica le modifiche
git status

# 2. Aggiungi tutti i file modificati
git add .

# 3. Crea commit con messaggio descrittivo
git commit -m "Fix: descrizione della modifica"

# 4. Pusha su GitHub
git push
```

## 🎯 Checklist pre-pubblicazione

Apri `README.md` e sostituisci:
- [ ] `TUO-USERNAME` → il tuo username GitHub
- [ ] `@tuotwitter` → il tuo handle social (o rimuovi)
- [ ] Aggiungi il tuo nome nella sezione Autore

Apri `GITHUB_GUIDE.md` e sostituisci:
- [ ] `TUO-USERNAME` → il tuo username GitHub

Apri `CONTRIBUTING.md` e sostituisci:
- [ ] `TUO-USERNAME` → il tuo username GitHub

Apri `CHANGELOG.md` e sostituisci:
- [ ] `TUO-USERNAME` → il tuo username GitHub

Verifica:
- [ ] L'estensione funziona correttamente
- [ ] Tutti i file sono presenti
- [ ] `.gitignore` è configurato
- [ ] `LICENSE` è presente

## 📝 File importanti

```
chrome-automation/
├── .github/
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md       # Template per segnalare bug
│       └── feature_request.md  # Template per richiedere feature
├── .gitignore                  # File da ignorare
├── CHANGELOG.md                # Storia delle versioni
├── CONTRIBUTING.md             # Come contribuire
├── GITHUB_GUIDE.md             # Guida dettagliata GitHub
├── LICENSE                     # Licenza MIT
├── README.md                   # Documentazione principale
├── manifest.json               # Configurazione estensione
├── popup.html                  # Interfaccia popup
├── popup.js                    # Logica popup
├── content.js                  # Script nelle pagine
├── background.js               # Service worker
├── styles.css                  # Stili
├── icon16.png                  # Icone estensione
├── icon48.png
├── icon128.png
└── test-page.html              # Pagina di test
```

## 🔗 Link utili dopo la pubblicazione

Sostituisci `TUO-USERNAME` con il tuo username:

- Repository: `https://github.com/TUO-USERNAME/chrome-automation-recorder`
- Issues: `https://github.com/TUO-USERNAME/chrome-automation-recorder/issues`
- Releases: `https://github.com/TUO-USERNAME/chrome-automation-recorder/releases`
- Clone HTTPS: `https://github.com/TUO-USERNAME/chrome-automation-recorder.git`
- Clone SSH: `git@github.com:TUO-USERNAME/chrome-automation-recorder.git`

## 🎨 Aggiungere screenshot (opzionale ma consigliato)

```bash
# 1. Crea cartella screenshots
mkdir screenshots

# 2. Fai screenshot dell'estensione e salvali in screenshots/

# 3. Aggiungili al repository
git add screenshots/
git commit -m "Add: screenshot dell'estensione"
git push
```

Nel README.md, sostituisci:
```markdown
![Demo](https://via.placeholder.com/800x400/dc3545/ffffff?text=Screenshot+Demo)
```

con:
```markdown
![Popup Interface](screenshots/popup.png)
![Recording Demo](screenshots/recording.png)
```

## 🏷️ Creare una release v1.0

1. Vai su `https://github.com/TUO-USERNAME/chrome-automation-recorder`
2. Clicca "Releases" → "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: `Version 1.0.0 - Initial Release`
5. Description:
   ```markdown
   ## 🎉 Prima release ufficiale di Chrome Automation Recorder!

   ### ✨ Funzionalità
   - Registrazione automazioni web
   - Riproduzione con un click
   - Gestione automazioni salvate
   - Interfaccia intuitiva

   ### 📦 Installazione
   Vedi il [README](https://github.com/TUO-USERNAME/chrome-automation-recorder#readme)
   ```
6. Clicca "Publish release"

## ⚙️ Configurazione Git (prima volta)

```bash
# Configura nome
git config --global user.name "Il Tuo Nome"

# Configura email (usa quella di GitHub)
git config --global user.email "tua-email@esempio.com"

# Verifica configurazione
git config --list
```

## 🆘 Risoluzione problemi comuni

### Errore: "fatal: not a git repository"
```bash
git init
```

### Errore: "Updates were rejected"
```bash
git pull origin main --rebase
git push
```

### Reset ultimo commit (se hai sbagliato)
```bash
git reset --soft HEAD~1  # Mantiene le modifiche
git reset --hard HEAD~1  # Elimina le modifiche
```

### Vedere cronologia commit
```bash
git log --oneline
```

### Annullare modifiche non committate
```bash
git checkout -- nome-file  # Singolo file
git checkout -- .          # Tutti i file
```

---

💡 **Tip**: Salva questo file come riferimento rapido!
