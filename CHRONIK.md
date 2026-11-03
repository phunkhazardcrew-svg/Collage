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
