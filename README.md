# Sottocosto Oggi — Dashboard privata

Dashboard responsive in sola lettura: stato dei cicli, ultime pubblicazioni,
punteggi e invii da riconciliare. I dati arrivano esclusivamente da `/api/status`
sulla stessa origine. Nessun token, AI, proxy di terzi o pubblicazione dal browser.

Il backend è `dashboard.py` nella PR #1 di `sottocosto-oggi-bot`.
Servire questo checkout come DASHBOARD_DIR tramite quel backend, dietro HTTPS,
con credenziali dedicate impostate sul server. Non inserire password o chiavi
nei file statici. GitHub Pages da solo non può fornire i dati privati.
Vedere `OPERATIONS.md` nel bot per ambiente, database, proxy e attivazione.

La pubblicazione manuale apre il workflow GitHub protetto dall'ambiente
`telegram-publishing`, con input verificati dall'operatore. La dashboard non ha
endpoint di scrittura. I prezzi mostrati risalgono al momento della pubblicazione;
il punteggio non garantisce un minimo storico del mercato.

## Credenziale Telegram compromessa

Il token della precedente versione pubblica deve essere revocato tramite
BotFather e sostituito nei Secrets. La rimozione dal codice non revoca il token
né lo elimina dalla cronologia Git. Controllare anche gli accessi al canale.

## Verifica

`node --check dashboard.js` verifica la sintassi. I test del backend nella PR del
bot controllano autenticazione, HTTPS, metodi vietati e mancata esposizione di
errori interni. Le stringhe dei prodotti vengono inserite solo con textContent;
nessun HTML proveniente dai dati viene interpretato.
