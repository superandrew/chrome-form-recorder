# 📘 Guida: Come pubblicare su GitHub

Questa guida ti aiuta a pubblicare l'estensione Chrome su GitHub passo dopo passo.

## Prerequisiti

- Account GitHub (crea uno su [github.com](https://github.com) se non ce l'hai)
- Git installato sul tuo computer ([scarica qui](https://git-scm.com/downloads))

## Metodo 1: Interfaccia Web GitHub (più semplice)

### Passo 1: Crea un nuovo repository

1. Vai su [github.com](https://github.com) ed effettua il login
2. Clicca sul pulsante **"+"** in alto a destra e seleziona **"New repository"**
3. Compila i campi:
   - **Repository name**: `chrome-automation-recorder` (o il nome che preferisci)
   - **Description**: `Estensione Chrome per registrare e riprodurre automazioni web`
   - **Public/Private**: Scegli se vuoi che sia pubblico o privato
   - ⚠️ **NON** selezionare "Add a README file" (ne abbiamo già uno)
   - ⚠️ **NON** aggiungere .gitignore (ne abbiamo già uno)
   - Licenza: Puoi selezionare "MIT License" oppure lasciare "None" (ne abbiamo già uno)
4. Clicca **"Create repository"**

### Passo 2: Carica i file

GitHub ti mostrerà una pagina con le istruzioni. Segui questi passi:

#### Opzione A: Usando Git (linea di comando)

Apri il terminale/prompt dei comandi nella cartella del progetto e esegui:

```bash
# Inizializza il repository Git
git init

# Aggiungi tutti i file
git add .

# Crea il primo commit
git commit -m "Initial commit: Chrome Automation Recorder v1.2"

# Collega al repository GitHub (sostituisci TUO-USERNAME con il tuo username)
git remote add origin https://github.com/TUO-USERNAME/chrome-automation-recorder.git

# Carica i file su GitHub
git branch -M main
git push -u origin main
```

#### Opzione B: Usando GitHub Desktop (interfaccia grafica)

1. Scarica [GitHub Desktop](https://desktop.github.com/)
2. Apri GitHub Desktop e fai login
3. File → Add Local Repository
4. Seleziona la cartella `chrome-automation`
5. Clicca "Publish repository"
6. Conferma il nome e clicca "Publish repository"

#### Opzione C: Upload manuale via web

1. Nella pagina del repository GitHub, clicca "uploading an existing file"
2. Trascina tutti i file della cartella `chrome-automation`
3. Scrivi un messaggio di commit: "Initial commit"
4. Clicca "Commit changes"

---

## Metodo 2: Git dalla linea di comando (più professionale)

### Configurazione iniziale (solo la prima volta)

```bash
# Configura il tuo nome
git config --global user.name "Tuo Nome"

# Configura la tua email (usa la stessa di GitHub)
git config --global user.email "tua-email@esempio.com"
```

### Pubblicazione del progetto

```bash
# 1. Entra nella cartella del progetto
cd /percorso/alla/cartella/chrome-automation

# 2. Inizializza Git
git init

# 3. Aggiungi tutti i file
git add .

# 4. Verifica cosa verrà committato
git status

# 5. Crea il primo commit
git commit -m "Initial commit: Chrome Automation Recorder v1.2"

# 6. Crea il repository su GitHub (vai su github.com e crealo come spiegato sopra)

# 7. Collega il repository locale a GitHub
git remote add origin https://github.com/TUO-USERNAME/chrome-automation-recorder.git

# 8. Rinomina il branch principale
git branch -M main

# 9. Carica tutto su GitHub
git push -u origin main
```

---

## 🔄 Workflow per aggiornamenti futuri

Quando modifichi il codice:

```bash
# 1. Verifica le modifiche
git status

# 2. Aggiungi i file modificati
git add .

# 3. Crea un commit con un messaggio descrittivo
git commit -m "Descrizione delle modifiche"

# 4. Carica su GitHub
git push
```

### Esempi di messaggi di commit

```bash
git commit -m "Fix: Risolto bug nella registrazione dei checkbox"
git commit -m "Feature: Aggiunto supporto per drag & drop"
git commit -m "Docs: Aggiornato README con nuove istruzioni"
git commit -m "Style: Migliorato design del popup"
```

---

## 🏷️ Creare una release/versione

Per creare una versione ufficiale (es. v1.2.0):

1. Vai sul tuo repository GitHub
2. Clicca su **"Releases"** → **"Create a new release"**
3. Clicca **"Choose a tag"** e scrivi `v1.2.0`
4. **Release title**: `Version 1.2.0 - Smart Replay & Diagnostics`
5. **Description**: Descrivi le funzionalità principali
6. Opzionale: Carica un file ZIP dell'estensione
7. Clicca **"Publish release"**

---

## 📝 Personalizzare il README

Prima di pubblicare, modifica il file `README.md` e sostituisci:

- `TUO-USERNAME` con il tuo username GitHub
- `@tuotwitter` con il tuo handle Twitter (o rimuovi)
- Aggiungi screenshot reali dell'estensione
- Aggiungi il tuo nome nella sezione Autore

---

## 🖼️ Aggiungere screenshot

1. Fai screenshot dell'estensione in azione
2. Crea una cartella `screenshots` nel progetto
3. Salva le immagini: `screenshot-1.png`, `screenshot-2.png`, etc.
4. Nel README.md, sostituisci:
   ```markdown
   ![Demo](https://via.placeholder.com/800x400/dc3545/ffffff?text=Screenshot+Demo)
   ```
   con:
   ```markdown
   ![Demo](screenshots/screenshot-1.png)
   ```

---

## ✅ Checklist prima della pubblicazione

- [ ] Hai testato che l'estensione funzioni correttamente
- [ ] Hai aggiornato il README con il tuo username GitHub
- [ ] Hai aggiunto screenshot (opzionale ma consigliato)
- [ ] Hai verificato che `.gitignore` sia presente
- [ ] Il file `LICENSE` è presente
- [ ] La versione nel `manifest.json` è corretta (attuale: `1.2`)
- [ ] In popup è visibile `v1.2 • c:...` su una pagina `https://`

---

## 🆘 Problemi comuni

### "Permission denied (publickey)"

Se usi HTTPS, GitHub potrebbe chiederti username e password. Usa invece un **Personal Access Token**:

1. GitHub → Settings → Developer settings → Personal access tokens → Generate new token
2. Seleziona `repo` scope
3. Copia il token
4. Usalo come password quando Git te lo chiede

### "Updates were rejected because the remote contains work"

```bash
git pull origin main --rebase
git push
```

### Vedere la cronologia dei commit

```bash
git log --oneline
```

---

## 📚 Risorse utili

- [GitHub Docs](https://docs.github.com)
- [Git Tutorial](https://git-scm.com/docs/gittutorial)
- [GitHub Desktop](https://desktop.github.com/)
- [Visual Studio Code con Git](https://code.visualstudio.com/docs/sourcecontrol/overview)

---

## 🎯 Passi successivi

Dopo aver pubblicato su GitHub:

1. Aggiungi un file `CONTRIBUTING.md` per chi vuole contribuire
2. Crea un `CHANGELOG.md` per tracciare le modifiche tra versioni
3. Aggiungi badge nel README (build status, downloads, etc.)
4. Considera di pubblicare l'estensione sul Chrome Web Store
5. Condividi il repository sui social media!

---

**Buona pubblicazione! 🚀**
