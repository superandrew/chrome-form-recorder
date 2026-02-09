# 🤖 Web Automation Recorder

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=google-chrome)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-1.0-orange)

Estensione Chrome per registrare e riprodurre automazioni su pagine web in modo semplice e intuitivo.

## ✨ Caratteristiche principali

- ⏺ **Registrazione**: Cattura click, input di testo, selezioni e submit
- ▶ **Riproduzione**: Esegui automazioni registrate con un click
- 💾 **Salvataggio**: Salva automazioni con nomi personalizzati
- 🎯 **Specifiche per URL**: Le automazioni sono associate al sito in cui sono state create
- 📝 **Gestione**: Visualizza, esegui ed elimina automazioni salvate

## 🚀 Quick Start

```bash
# 1. Clona il repository
git clone https://github.com/TUO-USERNAME/chrome-automation-recorder.git

# 2. Apri Chrome e vai su chrome://extensions/

# 3. Attiva "Modalità sviluppatore"

# 4. Clicca "Carica estensione non pacchettizzata"

# 5. Seleziona la cartella del progetto
```

Fatto! Ora puoi iniziare a registrare le tue automazioni.

## 🚀 Installazione

1. Scarica o clona questa cartella
2. Apri Chrome e vai a `chrome://extensions/`
3. Attiva la "Modalità sviluppatore" (toggle in alto a destra)
4. Clicca "Carica estensione non pacchettizzata"
5. Seleziona la cartella `chrome-automation`
6. L'estensione è ora installata!

**Nota**: Attualmente le icone non sono incluse. L'estensione funziona comunque, ma vedrai placeholder per le icone. Puoi creare icone PNG (16x16, 48x48, 128x128) chiamate `icon16.png`, `icon48.png`, `icon128.png` nella cartella principale.

## 📖 Come usare

### Registrare un'automazione

1. Apri la pagina web dove vuoi creare l'automazione (es. `pippo.it/compila`)
2. Clicca sull'icona dell'estensione
3. Premi il bottone **REC** rosso
4. Esegui le azioni che vuoi automatizzare:
   - Click su pulsanti e link
   - Inserimento testo in campi
   - Selezione da dropdown
   - Checkbox e radio button
   - Submit di form
5. Premi **STOP** quando hai finito
6. Dai un nome all'automazione (es. "Compilazione form ordini")
7. Clicca **Salva Automazione**

### Eseguire un'automazione

**Opzione 1 - Dalla lista:**
1. Apri la pagina web corretta
2. Apri l'estensione
3. Trova l'automazione nella lista
4. Clicca **▶ Esegui**

**Opzione 2 - Ultima registrazione:**
1. Dopo aver registrato, clicca **PLAY** per testare subito

### Eliminare un'automazione

1. Apri l'estensione
2. Trova l'automazione nella lista
3. Clicca sul bottone **🗑**
4. Conferma l'eliminazione

## 🎨 Interfaccia

- **Bottone REC rosso**: Inizia la registrazione (pulsa durante la registrazione)
- **Bottone STOP**: Ferma la registrazione
- **Bottone PLAY verde**: Esegui l'ultima automazione registrata
- **Lista automazioni**: Mostra solo le automazioni per il sito corrente

## ⚙️ Funzionamento tecnico

### File principali

- **manifest.json**: Configurazione dell'estensione
- **popup.html/js**: Interfaccia utente
- **content.js**: Script iniettato nelle pagine per registrare/riprodurre azioni
- **background.js**: Service worker per gestione eventi
- **styles.css**: Stili dell'interfaccia

### Azioni supportate

| Tipo | Descrizione | Esempio |
|------|-------------|---------|
| `click` | Click su elementi | Pulsanti, link, checkbox |
| `input` | Inserimento testo | Campi input, textarea |
| `change` | Cambio valore | Select, radio, checkbox |
| `submit` | Invio form | Form submit |

### Selettori

L'estensione genera selettori CSS per identificare gli elementi, in ordine di preferenza:

1. ID (`#elemento`)
2. Name (`input[name="campo"]`)
3. Classe unica (`.classe`)
4. Percorso con nth-child (`div > form > input:nth-child(2)`)

## 🔧 Personalizzazione

### Modificare il ritardo tra azioni

Nel file `content.js`, modifica questa riga (default 300ms):

```javascript
await sleep(300); // Cambia il valore in millisecondi
```

### Aggiungere nuovi tipi di azioni

1. Aggiungi un event listener in `startRecording()`:
```javascript
document.addEventListener('nuovoevento', handleNuovoEvento, true);
```

2. Crea la funzione handler:
```javascript
function handleNuovoEvento(event) {
  // Logica di registrazione
}
```

3. Aggiungi il caso in `executeAction()`:
```javascript
case 'nuovoevento':
  // Logica di esecuzione
  break;
```

## ⚠️ Limitazioni

- Le automazioni potrebbero non funzionare se la struttura della pagina cambia
- Alcuni elementi dinamici (caricati dopo) potrebbero non essere trovati
- I CAPTCHA e contenuti protetti non possono essere automatizzati
- Le azioni in iframe potrebbero non essere registrate

## 🐛 Risoluzione problemi

### L'automazione non si esegue

- Verifica di essere sulla stessa pagina dove l'hai registrata
- Controlla che la struttura della pagina non sia cambiata
- Apri la console (F12) per vedere eventuali errori

### Elementi non trovati

- La pagina potrebbe aver cambiato struttura
- Prova a registrare di nuovo l'automazione
- Usa ID o name sugli elementi HTML per selettori più stabili

### La registrazione non cattura alcune azioni

- Alcuni elementi custom potrebbero non emettere eventi standard
- Verifica che gli elementi siano interattivi (non disabled)

## 📝 Esempi d'uso

**1. Compilazione form ordini**
- Campo cliente → inserisci "Azienda XYZ"
- Dropdown prodotto → seleziona "Prodotto A"
- Quantità → inserisci "10"
- Pulsante "Invia ordine" → click

**2. Approvazione reperibilità**
- Checkbox "Confermo disponibilità" → check
- Campo note → inserisci "Disponibile weekend"
- Pulsante "Approva" → click

**3. Login rapido**
- Campo username → inserisci username
- Campo password → inserisci password
- Pulsante "Accedi" → click

## 🔒 Privacy e sicurezza

- Tutte le automazioni sono salvate localmente nel browser
- Nessun dato viene inviato a server esterni
- Le password inserite vengono salvate in chiaro - attenzione!
- Non usare per dati sensibili

## 📄 Licenza

Questo progetto è fornito "as-is" per uso personale e didattico.

## 🤝 Contributi

I contributi sono benvenuti! Se vuoi contribuire:

1. Fai un fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Committa le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Pusha sul branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 🐛 Segnalazione Bug

Se trovi un bug, apri una [Issue](https://github.com/TUO-USERNAME/chrome-automation-recorder/issues) descrivendo:
- Cosa stavi facendo
- Cosa ti aspettavi
- Cosa è successo invece
- Screenshot se possibile

## 📞 Supporto

Per problemi o domande:
- Apri una [Issue](https://github.com/TUO-USERNAME/chrome-automation-recorder/issues)
- Consulta la documentazione nel README
- Controlla la console Chrome (F12) per eventuali errori

## 📝 Roadmap

- [ ] Supporto per drag & drop
- [ ] Export/import automazioni
- [ ] Variabili personalizzabili
- [ ] Editor visuale delle automazioni
- [ ] Supporto per iframe
- [ ] Gestione pause personalizzabili

## 👨‍💻 Autore

Il tuo nome - [@tuotwitter](https://twitter.com/tuotwitter)

Repository: [https://github.com/TUO-USERNAME/chrome-automation-recorder](https://github.com/TUO-USERNAME/chrome-automation-recorder)

## 📄 Licenza

Questo progetto è sotto licenza MIT - vedi il file [LICENSE](LICENSE) per i dettagli.

## 🙏 Riconoscimenti

- Grazie a tutti i contributori
- Ispirato dalla necessità di automatizzare task ripetitivi sul web
