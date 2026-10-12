# Kredit-figyelő

Claude státuszsor-mod: folyamatosan mutatja az 5 órás és heti felhasználási keret állását (%), a nullázódás idejét (Budapest idő) és a beszélgetés kontextusának telítettségét. 90% fölött figyelmeztető értesítést dob.

Példa: `5ó 42% (↺ 18:30) · Hét 13% (↺ okt. 15. 09:00) · Kontextus 37%`

## Telepítés

```
/plugin install kredit-figyelo --marketplace aranylap-collab/kredit-figyelo
```

A kérdésre `y` (marketplace hozzáadása), majd a scope-nál Enter (user = minden új sessionben aktív).
