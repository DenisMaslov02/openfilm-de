# Deutsche Oberfläche (`de`): Aufbau und Übersetzungsregeln

## Wo die deutschen Texte liegen

| Bereich | Datei | Englische Vorlage |
|---|---|---|
| Studio (Editor) | `packages/openfilm/studio/ui/src/i18n/de.ts` | `en.ts` daneben |
| Desktop-Chat | `apps/desktop/chat/src/i18n/locales/de.ts` | `en-US.ts` daneben |
| Menüleiste, Update-Dialoge, Installationsfenster, Systembenachrichtigungen | `apps/desktop/src/i18n/*.mjs`, jeweils der Block `de:` | Block `en:` derselben Datei |
| Skill-Karten der Anleitung | `packages/openfilm/manual/*/openfilm.json`, Feld `de` | Feld `en` |
| „Was ist neu“ | `packages/openfilm/studio/ui/src/lib/whats-new.ts`, Block `"de"` | Block `"en"` |

Die Sprache wählt man in Studio unter **Einstellungen › Allgemein › Sprache**. Ohne Auswahl gilt die Systemsprache: `de-DE`, `de-AT` und `de-CH` werden alle zu `de`. Der Desktop-Chat, die Menüleiste und die Dialoge übernehmen die Wahl von Studio. Fehlt ein Text auf Deutsch, erscheint er auf Englisch.

## Einen neuen Text hinzufügen

1. Den Text mit seinem Pfad in die englische Tabelle (`en.ts` bzw. `en-US.ts`) eintragen und im Code mit `t('bereich.name')` verwenden.
2. Denselben Pfad in `de.ts` eintragen, übersetzt nach den Regeln unten.
3. `pnpm test` ausführen. Diese Tests prüfen:
   - `studio/ui/src/lib/i18n-languages.test.ts`: Jeder englische Pfad hat einen deutschen Text, es gibt keine überzähligen Pfade, Platzhalter, Dateinamen und Befehle sind gleich, und die Systemsprache wird erkannt.
   - `apps/desktop/src/chat-i18n.test.mjs`: dasselbe für den Chat.
   - `apps/desktop/src/menu.test.mjs` und `turn-notices.test.mjs`: Menü, Dialoge und Benachrichtigungen.
   - `studio/ui/src/lib/whats-new.test.ts`: Hinweise zum Release in jeder Sprache.

## Ton und Form

- **Du-Form**, freundlich und sachlich: „Klicke auf …“, „Wähle …“, „Dein Projekt“.
- **Buttons und Menüpunkte im Infinitiv**: „Speichern“, „Abbrechen“, „Projekt öffnen“.
- **Meldungen als einfache, ganze Sätze**, ohne Behördendeutsch: „Projekte konnten nicht geladen werden.“, „Erneut versuchen“.
- **Kurz halten:** Ein kurzes Label (englisch bis 20 Zeichen) wird höchstens etwa 1,4-mal so lang. Sonst ein kürzeres Wort wählen, denn deutsche Wörter brechen schlecht um.

## Unverändert lassen

- Platzhalter genau so, wie sie im Englischen stehen: `{n}`, `{name}`, `{app}`, `{error}` …; die Stellung im Satz darf sich ändern.
- `${FILES}` steht für den Dateimanager („Datei-Explorer“, „Finder“ oder „Dateimanager“) und `${TRASH}` für „Papierkorb“, beide **ohne Artikel**. Den Artikel schreibt der Satz selbst: „in den ${TRASH} verschieben“.
- Marken- und Dienstnamen, Dateiformate und Codecs, Befehle (`openfilm look`), Dateinamen (`film.html`), URLs, Tastenkürzel (⌘, ⌥, ⇧, Ctrl, Esc), Einheiten (s, fps, px, MB), `\n` sowie Zeichen wie `…`, `·`, `›`, `→`.
- Nicht übersetzt werden außerdem die Anweisungen für die Agenten (`agent-prompt.md`, `SKILL.md`, `manual/**/*.md`), Projekt- und Filmdateien und alle Schlüssel und IDs.

Anführungszeichen im deutschen Text: „…“.

## Glossar

| Englisch | Deutsch |
|---|---|
| project / film / clip | Projekt / Film / Clip |
| the edit (view) / timeline / track / playhead | Schnitt / Zeitleiste / Spur / Abspielposition |
| canvas, board / node | Leinwand / Element |
| page / layer / inspector / stage, viewer | Seite / Ebene / Inspektor / Vorschau |
| library / media / media pool | Bibliothek / Medien / Medienpool |
| transition / effect / motion / template | Übergang / Effekt / Animation / Vorlage |
| caption, subtitle / transcript | Untertitel / Transkript |
| voice / voice-over | Stimme / Sprecherstimme |
| frame / keyframe / fade in, out / crop / preset | Bild, Einzelbild / Keyframe / Einblenden, Ausblenden / Zuschneiden / Voreinstellung |
| export / draft (for an editing app) / render | Export, exportieren / Entwurf / rendern |
| agent / turn / conversation / skill / prompt | Agent / Durchlauf / Unterhaltung / Skill / Prompt |
| model / provider / service / key | Modell / Anbieter / Dienst / Schlüssel, API-Schlüssel |
| balance, credits | Guthaben |
| settings / general / advanced | Einstellungen / Allgemein / Erweitert |
| trash / history / restore / undo / redo | Papierkorb / Verlauf / wiederherstellen / Rückgängig / Wiederholen |
| reveal in … / copy (suffix) / untitled | Im … zeigen / Kopie / Ohne Titel |

## Bekannte Lücken

- Die Namen der Bibliotheksinhalte (Sounds, Musik, Sticker, Effekte, Vorlagen; `packages/openfilm/library/*.json`) haben noch kein `de`. Sie erscheinen auf Englisch.
- Einige Texte stehen direkt im Code statt in den Tabellen. Sie sind deshalb in keiner Sprache übersetzt, zum Beispiel der Dialog beim Schließen eines Tabs mit laufendem Agenten (`apps/desktop/src/main.mjs`), die Fehlerseite `apps/desktop/src/failed.html` und einzelne Fehlermeldungen vom Server und von den Agenten.
- „PNG Sequenz“ im Export setzt der Code aus „PNG“, einem Leerzeichen und `exportCenter.sequence` zusammen. Ein Bindestrich wäre nur mit einer Code-Änderung möglich.
- Schmale Leisten: Die Tab-Leiste des Inspektors ist 360 px breit. Deshalb heißen dort „Adjust“ und „Advanced“ auf Deutsch „Bild“ und „Mehr“, mit „Anpassen“ und „Erweitert“ wäre die Leiste übergelaufen.
- Geprüft wurden bei 1280 × 800 der Editor, das App-Menü, alle Einstellungsseiten, der Export-Dialog, das Kontextmenü eines Clips, die Ebenen und die Leinwand. Nicht im Browser geprüft wurden die Projektliste, die Medienbibliothek und der Chat der Desktop-App.
- `community-library.mjs` verlangt für Community-Einträge die Namen in den fünf ursprünglichen Sprachen. `de` ist dort absichtlich nicht Pflicht, sonst würden alle bestehenden Einträge abgelehnt.
