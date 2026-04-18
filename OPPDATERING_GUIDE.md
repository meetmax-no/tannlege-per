# 📝 Hvordan oppdatere priser og åpningstider

Denne nettsiden leser priser og åpningstider fra JSON-filer, slik at du enkelt kan oppdatere dem uten å måtte endre React-koden.

## 📍 Hvor finner jeg filene?

Filene ligger i `/app/frontend/public/data/`:
- **Priser:** `/app/frontend/public/data/priser.json`
- **Åpningstider:** `/app/frontend/public/data/apningstider.json`

## 💰 Oppdatere Priser

Åpne filen `priser.json` og rediger innholdet:

```json
{
  "prisliste": [
    {
      "kategori": "Undersøkelse og kontroll",
      "tjenester": [
        { "tjeneste": "Ordinær kontroll", "pris": "Fra kr 950,-" },
        { "tjeneste": "Akutt konsultasjon", "pris": "Fra kr 1.200,-" }
      ]
    }
  ]
}
```

### Legge til ny kategori:
```json
{
  "kategori": "Ny kategori navn",
  "tjenester": [
    { "tjeneste": "Tjeneste 1", "pris": "Fra kr 1.500,-" },
    { "tjeneste": "Tjeneste 2", "pris": "Fra kr 2.000,-" }
  ]
}
```

### Legge til ny tjeneste i eksisterende kategori:
Bare legg til en ny linje under `"tjenester"`:
```json
{ "tjeneste": "Ny tjeneste", "pris": "Fra kr 3.000,-" }
```

## 🕐 Oppdatere Åpningstider

Åpne filen `apningstider.json` og rediger tidene:

```json
{
  "apningstider": [
    { "dag": "Mandag", "tid": "08:00 - 16:00" },
    { "dag": "Tirsdag", "tid": "08:00 - 16:00" },
    { "dag": "Onsdag", "tid": "08:00 - 16:00" },
    { "dag": "Torsdag", "tid": "08:00 - 16:00" },
    { "dag": "Fredag", "tid": "08:00 - 15:00" },
    { "dag": "Lørdag", "tid": "Stengt" },
    { "dag": "Søndag", "tid": "Stengt" }
  ]
}
```

### Endre åpningstider:
Bare endre `"tid"` verdien:
```json
{ "dag": "Mandag", "tid": "09:00 - 17:00" }
```

## ⚠️ Viktig å huske:

1. **JSON format:** Pass på at kommaer og klammer er riktige
2. **Encoding:** Bruk UTF-8 encoding (for å støtte norske tegn: æ, ø, å)
3. **Test lokalt:** Etter endring, åpne nettsiden i nettleseren for å sjekke at alt ser riktig ut
4. **Deploy på nytt:** Etter endringer må du deploye nettsiden på nytt for at endringene skal vises i produksjon

## 🚀 Deploy etter endringer:

1. Lagre endringene i JSON-filene
2. I Emergent dashboard, klikk på "Deploy" igjen
3. Venter 3-5 minutter
4. Sjekk at endringene vises på den live nettsiden

## 🆘 Hvis noe går galt:

- **Nettsiden viser "Laster priser...":** JSON-filen har sannsynligvis feil format. Bruk en JSON validator (jsonlint.com)
- **Priser vises ikke:** Sjekk at filnavnet er riktig (`priser.json` og `apningstider.json`)
- **Rare tegn vises:** Filene må være UTF-8 encoded

## 📞 Trenger du hjelp?

Kontakt utvikleren eller bruk en JSON validator for å sjekke om formatet er riktig.
