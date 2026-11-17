# Sottocosto Oggi — Publisher

Interfaccia statica sperimentale per anteprime di offerte Amazon. **Non usare questa pagina per pubblicare direttamente su Telegram.**

## Avviso di sicurezza (2026-11)

Una versione precedente di `index.html` conteneva un token Telegram bot nel codice JavaScript pubblico. Il token **deve essere revocato e rigenerato tramite @BotFather**; rimuoverlo dal branch corrente non lo elimina dalla cronologia Git né ne impedisce l'utilizzo.

1. Aprire @BotFather su Telegram e revocare il token del bot interessato.
2. Creare un nuovo token e salvarlo esclusivamente in GitHub Actions Secrets o in un gestore segreti server-side.
3. Verificare i permessi del bot nel canale e le pubblicazioni non autorizzate.
4. Non mettere token, chiavi Anthropic o credenziali Amazon nel JavaScript servito al browser.

## Architettura consigliata

- Frontend pubblico: anteprima e ricerca senza credenziali.
- Backend autenticato: validazione dati prodotto, autorizzazione operatore, chiamate Telegram e gestione segreti.
- Bot automatico: repository separato `sottocosto-oggi-bot` con credenziali in GitHub Secrets.
- Prezzi: usare dati verificabili da API autorizzate; non trattare risultati generati da AI come prezzi certificati.

**Stato:** pubblicazione diretta dal frontend disabilitata fino all'implementazione di un backend autenticato. La parte di ricerca Claude via browser/proxy è legacy e non deve ricevere chiavi API.
