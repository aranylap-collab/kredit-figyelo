# Kredit-figyelő

Claude mod: folyamatosan mutatja az 5 órás és heti felhasználási keret állását (%), a nullázódás idejét (Budapest idő) és a beszélgetés kontextusának telítettségét.

- **Sáv a prompt fölött:** színes címkék – 70% alatt zöld, 70–90% között narancs, 90% fölött piros ⚠ jellel.
- **Státuszsor:** ugyanez tömören.
- **Értesítés:** 90% fölött figyelmeztető felugró üzenet.

Példa: `5 óra 42% (↺ 18:30)` `Hét 13% (↺ okt. 15. 09:00)` `Kontextus 37%`

## Telepítés

```
/plugin install kredit-figyelo --marketplace aranylap-collab/kredit-figyelo
```

A kérdésre `y` (marketplace hozzáadása), majd a scope-nál Enter (user = minden új sessionben aktív).

Forrás: https://github.com/aranylap-collab/kredit-figyelo
