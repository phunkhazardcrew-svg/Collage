# Chronik / Checkpoints

## 2026-11-03 – v1.0
- Anforderungen (Nutzer):
  1. Fotos zusammenfügen wie Collage, aber **nichts abschneiden**.
  2. Pixel beider Bilder addieren sich, das Bild wächst.
  3. Freie Ecken bei ungleichen Formaten → **schwarz**.
  4. **Auflösung beider Bilder muss erhalten bleiben.**
- Umsetzung: `index.html` (Vanilla JS, Canvas, keine Abhängigkeiten).
  - Layout-Engine `computeLayout()`: rechnet in Haupt-/Querachse, Spalten-Layouts durch Achsentausch.
  - Standard `equalize=false` → Originalpixel; Hintergrund `#000000`.
  - Export: `canvasUsable()` prüft, ob der Browser die Canvasgröße wirklich anlegt; sonst Retry mit 75 %.
- Tests: Playwright (Chromium) – 400×300 + 200×500 → 600×500, Ecke schwarz, Farben korrekt, alle Layouts fehlerfrei.
- Review: unabhängiger Review-Agent.

## 2026-11-03 – v1.1 (Review-Fixes)
- Warnungen (unlesbare Datei, verkleinerter Export) wurden sofort überschrieben → `notice`-Mechanik in `doRender`.
- „Angleichen“ im Raster hat kurze Zeilen/Spalten extrem hochskaliert → Gruppen-Streckung entfernt; Ausrichtung bleibt dann sichtbar.
- Paralleler Export möglich / Einstellungen während Export gemischt → `exporting`-Flag + eingefrorene Einstellungen.
- Export: try/catch + Canvas-Speicher freigeben; Dateiname in Ortszeit; Label „transparent (PNG/WebP)“; Eingabe >20 korrigiert;
  „Alle entfernen“ verwirft noch ladende Dateien; toter Code entfernt.
- Alle Tests (eigene + Review-Skripte) grün, keine JS-Fehler.

## 2026-11-03 – v1.2 (Handy / PWA)
- Nutzer: Android, Installation über GitHub Pages (Repo ist bereits öffentlich).
- Neu: `manifest.webmanifest`, `sw.js` (Netzwerk-zuerst, Offline-Fallback; bei Änderungen `VERSION` erhöhen), `icons/`.
- „Teilen / in Galerie speichern …“-Button (Web Share API, nur wo unterstützt; Fallback Download).
- Handy-Layout: Fotos → Vorschau → Anordnung → Export; Touch-Text in der Auswahlfläche.
- Tests (Pixel-7-Emulation, http): keine Installability-Fehler, offline lauffähig, 4000×3000 + 3000×4000 → 7000×4000.
- Offen: Nutzer muss GitHub Pages einmalig in den Repo-Einstellungen aktivieren (siehe README).
