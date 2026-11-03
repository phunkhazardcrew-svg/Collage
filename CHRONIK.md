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

## 2026-11-03 – v2.0 (Zoom, Drehen, Ausschnitt, Sortieren)
- Nutzerwunsch: ins Foto zoomen + drehen, mehr Funktionen. Rückfragen beantwortet:
  Zoom = Vorschau-Zoom **und** optionaler Ausschnitt; Drehen = 90°/Spiegeln **und** frei; Extra = Sortieren per Ziehen.
- Datenmodell: `item.edit = {rot, flipH, flipV, crop{u0,v0,u1,v1}, angle}`; Pipeline Original → 90° → Spiegeln → Ausschnitt → freie Drehung.
  `cropToSource()` rechnet den Ausschnitt ins Original zurück, `dims()` liefert die Endgröße, `drawItem()` zeichnet alles mit einer Transformation (kein Zwischenbild → speicherschonend).
- Vorschau: eigene Zoom/Pan-Engine (`view`), Gesten-Zustandsautomat (Tippen, Doppeltipp, Pinch, Scroll-Emulation, Long-Press-Tauschen), hochauflösendes Nachrendern beim Zoomen (max. 4096 px / 12 MP).
- Performance: je Foto eine ≤2048-px-Kopie für die Vorschau; Export immer aus dem Original.
- Rückgängig/Wiederholen (100 Schritte), Einstellungen in localStorage, Vollbild-Vorschau.
- Tests (v2.js): Pixel-exakt bei 0° und 90°, Ausschnitt 1:1, Winkel-Bounding-Box, Ecken-Ziehen, Rad-Zoom, Tauschen per Ziehen, Listen-Sortierung, Einstellungen bleiben – alle grün.
- Review: 3 parallele Agenten (Geometrie/Export, Gesten/Mobil, Code-Qualität/Performance).

## 2026-11-03 – v2.1 (Frei-Modus + Review-Fixes)
- Nutzer: Fotos in der Vorschau einzeln drehen & zoomen, um sie zueinander auszurichten; Zwei-Finger-Zoom statt nur Ausschneiden.
- Neues Layout `free`: `item.free = {cx, cy, s, a}` (Mittelpunkt in Ausgabepixeln, Skalierung, Winkel°).
  `computeFreeLayout()` → Hülle aller gedrehten Fotos = Leinwand (Ursprung auf ganze Pixel → ungedrehte 100-%-Fotos pixelgenau).
  Gesten: Tippen = Auswahl, Ziehen = verschieben, 2 Finger auf Foto = drehen+zoomen+verschieben, Griff = drehen+skalieren (Einrasten 0/90°),
  2 Finger daneben = Ansicht zoomen. `view.lock` hält den Maßstab während einer Bewegung fest.
  Werkzeuge: Größe ±1 %, Winkel ±0,1°, 90°, Ebenen, durchscheinend obenauf, Pfeiltasten (1/10 px). Rückgängig enthält die freien Lagen.
- Editor: Pinch/Mausrad zoomt den Ausschnitt (`zoomCrop`), Seitenverhältnis wird gemerkt (`edit.ak`).
- Review-Fixes (3 Agenten): Export blockiert nicht mehr (rAF+setTimeout), Blob-URLs beim Kürzen der Historie freigeben,
  Vorschau-Kopien 1280 px, Fotos nacheinander laden mit Fortschritt, maxZoom an Vorschau-Auflösung gekoppelt,
  Tippen+Pinch öffnet keinen Editor mehr, nach Pinch mit einem Finger weiter verschieben, kein Seiten-Scroll im Vollbild,
  Zurück-Taste beendet Vollbild, Schwung beim Scrollen durch die Vorschau, Ecken-Ziehen an Bildrand kollabiert nicht mehr,
  1:1-Ausschnitt exakt quadratisch, größere Touch-Knöpfe, Resize nur bei Breitenänderung, `overflow-anchor: none`
  (Bugfix: Scroll-Anchoring ließ Foto beim Ziehen springen), Service Worker mit no-cache/Timeout.
- Tests: v2.js (16) + free.js (13, echte Touch-Gesten per CDP) + pwa.js – alle grün, keine JS-Fehler.
