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

## 2026-11-03 – v2.2 (Fotos separat skalieren, Abstand/Rand optional)
- Nutzer-Feedback: Pinch veränderte beide Fotos (= Ansicht-Zoom). Gewünscht: jedes Foto separat in der Vorschau skalieren.
- Neu: `edit.scale` (Größe je Foto, 1 = Originalpixel), `sdims()` = Endgröße × scale; alle Layouts nutzen sdims.
  Frei-Modus nutzt ebenfalls `edit.scale` (früher `free.s`).
- Gesten-Regel beim 2. Finger: beide Finger auf demselben Foto → `ptransform` (nur dieses Foto skalieren, Drehen erst ab 10°,
  Einrasten 0/90°, im Frei-Modus zusätzlich verschieben); sonst → Ansicht-Pinch. `view.lock` verhindert Springen.
- Editor: Regler „Größe in der Collage“ 10–400 %. Liste zeigt „· 300 %“.
- Abstand/Rand: nicht mehr gespeichert (Start immer 0), Regler in zugeklapptem `<details>` „optional“.
- Tests: sep.js (10, Touch per CDP: nur Foto 1 wächst, nur Foto 2 schrumpft, keine versehentliche Drehung,
  Finger auf zwei Fotos = Ansicht-Zoom, Rückgängig), free.js, v2.js – alle grün.

## 2026-11-10 – v3.0 (Ebenen / Überlagern) – Checkpoint 1
- Nutzer: Bilder überlagern mit Ebenen-Panel, Deckkraft/Mischmodi, weiche Übergänge (Maske), „Morphing“ = Standbild-Mischen,
  Größe per Anfasser (Ecken/Kanten) + zwei Finger, Leinwand wächst mit. Plan: /root/.claude/plans/scalable-plotting-biscuit.md
- Umsetzung im Modus „Frei / Ebenen“ (Wert bleibt 'free'):
  - `it.layer = {name, opacity, blend, visible, locked, feather, mask}`; Verzerrung `free.sx/sy`; `state.place` daneben/darüber.
  - `draw()`: Ebenen auf transparent, Hintergrund zuletzt (`destination-over`) → Mischmodi wie Photoshop; `drawPlaced()`;
    Masken/weiche Kante über Kachel-Hilfscanvas (`drawMaskedLayer`, 2048er Kacheln, `featherPass`).
  - Masken im Koordinatensystem des Originalfotos (max. 2048 px), Pinsel über `layerMatrix()` (DOMMatrix) → folgt Verschieben/Drehen/
    Verzerren/Zuschneiden; Rückgängig über 256er-Kachel-Patches (nur Alpha, Tausch-Prinzip, `maskSetVersion`).
  - 8 Anfasser + Dreh-Griff (`fresize`/`fhandle`), Einrasten 100 %/0°/90°; Ebenen-Panel (oben = vorne, ≡ ziehen, Auge, Schloss);
    Werkzeuge: Deckkraft, 16 Mischmodi, weiche Kante, Pinsel verbergen/zurückholen, Maske umkehren/löschen, Verzerrung aufheben,
    „Auf Ebene darunter einpassen“, Umbenennen, Duplizieren, Löschen.
  - Gefundene Bugs: Klasse `sel` doppelt belegt (Ebenen-Zeile sprang an den Seitenanfang) → `cur`; Anfasser am Rand abgeschnitten
    → Innenabstand 40 px im Ebenen-Modus; Zoom-Leiste verdeckte Eck-Anfasser → Leiste unter die Vorschau verschoben.
- Tests: layers.js (35, Pixel-genaue Mischmodi, Masken + Rückgängig, Anfasser per Touch, Pinsel-Gesten, Panel, Download = Vorschau),
  big.js (6000×4000 maskiert + weiche Kante exportiert, 30 MP in 1,7 s), v2/free/sep – alle grün.
- Offen: Performance-Caches (darunter/darüber-Zwischenbilder) noch nicht umgesetzt; Pinsel ~44 ms/Strich bei 30 MP am Desktop.

## 2026-11-10 – v3.0 final (Review-Runde mit 3 Agenten)
- Touch/UX (7 Funde): gezoomt greift ein Finger nur die ausgewählte Ebene (sonst Ansicht verschieben), Zwei-Finger-Zoom einer Ebene
  nur auf der ausgewählten; Pinsel auf gesperrter Ebene malt (Sperre = nur Lage), auf ausgeblendeter Ebene Hinweis statt Ebene darunter
  zu verschieben; kleine Ebenen: Anfasser im Inneren → verschieben; Tipp-Zittern-Schwelle 10 px; kein Rahmen für ausgeblendete Ebene;
  Vollbild scrollbar, Werkzeug/Pinsel oben in den Werkzeugen; Werkzeug springt bei Ebenenwechsel auf „Bewegen“; Innenabstand 26 px < 400 px Breite.
- Performance/Speicher: Masken-Rückgängig mit `base`-Versatz und `trimMaskLogs()` (Budget 96 MB, ältere Schritte verfallen, URLs freigegeben)
  – vorher 249 MB nach 200 Strichen; Hilfs-Canvas nur so groß wie nötig, wächst nur, nach Export freigegeben (Vorschau 115 → 36 ms);
  `select()` färbt nur noch die Zeile um (1,8 → 0,04 ms); Fotoliste im Ebenen-Modus nicht mehr doppelt gezeichnet.
- Korrektheit: Rückgängig/Umkehren/Löschen/Duplizieren/… während eines Pinselstrichs verwerfen den Strich (`abortPaint`) statt die Maske
  zu beschädigen; leere Striche/„Zurückholen“ ohne Maske legen keine Maske an; Speicherengpass schaltet Masken nicht mehr dauerhaft ab,
  Export wirft dann und versucht kleiner (`strict`); verzerrte Ebenen in der Vorschau aus dem Original (nicht unscharf);
  zweiter Finger: kurzer Tupfer verworfen, längerer Strich bleibt.
- Verifiziert durch Agenten: Maskenausrichtung bei rot90/Spiegeln/Ausschnitt/Winkel/freier Drehung/Verzerrung (Vorschau + Export),
  keine Kachel-Nähte, Zufalls-Stresstest Rückgängig/Wiederholen (≈1500 Operationen) ohne Abweichung.
- Bekannte Grenzen: weiche Kante blendet den äußeren Rahmen aus (bei im Editor schräg gestelltem Foto nicht exakt die Fotokante);
  Antippen ignoriert per Maske verborgene Bereiche; Ebenen/Masken werden beim Neuladen nicht gespeichert.

## 2026-11-23 – v3.1 (Best-Fit, Format, Dreifach-Tippen)
- Nutzer: Best-Fit im freien Modus (möglichst wenig Hintergrund, Pixel sparen), adaptiv bei Größe/Verschieben, gängige Formate;
  Editor per 3× Tippen. Rückfragen: Auto-Schalter (nachrücken/einordnen) · lückenlos skalieren erlaubt · schmale Ränder statt Beschnitt.
- Algorithmus `packTree()`: Slicing-Baum (nebeneinander = gleiche Höhe, übereinander = gleiche Breite) → immer lückenloses Rechteck.
  Intervall-DP über die Reihenfolge, Kandidaten je Intervall nach log(Seitenverhältnis) gebinnt (64/36/20 Bins je nach n),
  Bewertung = Abweichung der Flächenanteile von Wunschanteilen (Summen S1/S2 der Log-Abweichungen, kombinierbar ohne Neuberechnung)
  + 40·(ln(A/R))². `applyFit()`: Maßstab so, dass größtes Foto = 100 % (kein Hochrechnen). n=16 in ~30 ms.
- Auto-Modus in `commit()` (`autoArrange()`): Größenänderung → `layer.fitW *= (s/s0)²`; nur verschoben → an nächsten Platz einordnen;
  dann neu anordnen. Formatwahl polstert die Leinwand in `computeFreeLayout()`. +/− im Auto-Modus ±15 %.
- `handleTap()`: Tipp-Zähler (350 ms/30 px): 1× auswählen/bearbeiten, 2× Ansicht zoomen, 3× Editor sofort.
- Tests fit.js (17): lückenlos (Füllgrad 100 %), kein Hochrechnen, Formate 2:3/1:1/16:9/9:16/4:5 exakt (Füllgrad 90–100 %),
  Vergrößern → Anteil 19 → 51 %, Ziehen → Einordnen + Rückgängig, Best-Fit jetzt, 3×/2× Tippen (frei + Collage); Regression grün.

## 2026-11-23 – v3.1 Review-Fixes (Best-Fit)
- Agent prüfte packTree gegen Brute-Force (900+ Fälle, Summenmathematik exakt) und 12 Szenarien. Behoben:
  einzelnes Mini-Foto machte alles winzig + Clamp → Überlappung (jetzt robuste Dichte, Ausreißer dürfen hochgerechnet werden);
  1-px-Hintergrundlinie (Größe wird im Auto-Modus gerundet wie die Kanten); gesperrte Ebenen bleiben stehen;
  Einordnen nur nach echtem Loslassen (`fitDropped`), „Neu anordnen“/Duplizieren vertauschen nichts mehr;
  Größe +/−/Pinch: Wunschanteil wird schrittweise erhöht, bis sich sichtbar etwas ändert, sonst unverändert (kein leerer Rückgängig-Schritt);
  Wurzel-Kandidaten nach Endbewertung (inkl. Format) → deutlich bessere Formatfüllung (z. B. 1:1 89 → 95 %, 16:9 93 → 99 %);
  Format exakt inkl. Rand und ganzzahlig; „Auf Ebene darunter einpassen“ sperrt die Ebene im Auto-Modus;
  3× Tippen nur auf demselben Foto; bei neuen Fotos/Formatwechsel kurze Reihenfolge-Optimierung (80 ms); Panel nur bei Reihenfolgeänderung neu.
- Tests: fit.js (17, echtes Touch-Ziehen), layers/v2/free/sep, Agent-Skripte t1–t12 – alle grün.

## 2026-11-25 – v3.2 (Auto-Best-Fit mit festen Größen)
- Nutzer: Bei aktivem Best-Fit dürfen andere Bilder nicht kleiner werden, nur um Lücken zu vermeiden; eigene Größen respektieren.
- Neu: Auto-Best-Fit packt nur noch Positionen bei festen Größen: `skylinePack()` (links-oben-bündig) über viele Breiten
  + gespiegelt (spaltenweise), Kosten = Leinwandfläche inkl. Formatrand (`packCost`); Reihenfolge-Suche bei neuen Fotos/
  Größen/Format (60 ms), Ziehen ordnet ein (ohne Suche). „Best-Fit jetzt“ = gründlichere Suche (300 ms), Größen bleiben.
  Lückenlose Baum-Anordnung nur noch per Knopf „Lückenlos (Größen angleichen)“ (`gaplessNow`). Gewichte (fitW) entfallen im Auto-Modus.
- Tests fit2.js (15): Größen bleiben 100 %, keine Überlappung, Formate exakt, Vergrößern/Verkleinern eines Fotos ändert nur dieses,
  Ziehen ordnet ein, Best-Fit jetzt, Lückenlos = 100 %, danach bleiben Größen fest; packRects n=20 < 1 ms.
  fit.js prüft noch das alte (verworfene) lückenlose Auto-Verhalten – nur noch die Tipp-Tests darin sind gültig.

## 2026-11-27 – v4.0 (Kompakte Oberfläche, Gedrückt halten, Favoriten)
- Nutzer: kompakter & logisch gruppiert, Bild per Gedrückt-halten bearbeiten, Favoriten für bearbeitete Fotos (dauerhaft).
  Rückfragen: App-Stil mit Reitern · Favorit = fertig bearbeitetes Foto (z. B. ausgeschnittenes Gesicht) · Halten+Loslassen = Editor ·
  gespeichert wird das fertige Ergebnis.
- Oberfläche: Leiste oben (＋ Fotos = #drop, ★ Favoriten + Zähler, ↶ ↷, ⬇ Speichern), `<main id="previewPanel">` mit klebender
  Vorschau (.stage, am Handy oben stehend, 42 % Höhe) und Reitern Anordnung | Bild | Fotos/Ebenen | Export (`setTab`, gemerkt).
  Bild-Reiter gruppiert: Kopf (Name = umbenennen, ✎ ★ ⧉ 🗑 ✕) · Größe & Lage · Überlagern · Maske. Vollbild = ganzes main.
  Alle Element-IDs beibehalten → Logik unverändert. Dreh-Griff klappt unter das Foto, wenn oben kein Platz ist.
- Gedrückt halten: Collage 450 ms → loslassen = Editor, ziehen = tauschen (auch Maus); Frei 500 ms → loslassen = Editor, ziehen = verschieben.
- Favoriten: IndexedDB 'fotoMergeFavorites'/'favs'; `renderFinished()` (Editor-Bearbeitung + Maske/weiche Kante → PNG, sonst JPEG 95 %,
  Originalauflösung, max. 8192 px/40 MP), Vorschaubild 200 px; Dialog #favDlg (antippen = einfügen über addFiles, ✕ = löschen);
  `navigator.storage.persist()`. Kurzmeldungen über `toast()`.
- Tests: ui3.js (17: Halten→Editor in Collage & Frei, Halten+Ziehen, Favorit 1:1 = 800×800 JPEG, bleibt nach Neuladen, Einfügen,
  Löschen, Schnell-Speichern, Reiter, kein Überlauf bei 360/412 px); alle älteren Tests reiter-fähig gemacht (Helfer öffnet den
  passenden Reiter vor Klicks) – v2/free/sep/layers/fit2/big grün.

## 2026-11-27 – v4.0.1 (Review-Fixes Oberfläche & Favoriten)
- Agent-Review (Pixel 7, 360×640/560, 640×360, Desktop) – behoben: Vollbild nur teilbreit (`align-items: stretch`); Vollbild verdeckte
  Leiste mit ↶/↷ (Vollbild beginnt jetzt unter der Leiste); Meldungen hinter offenen Dialogen (Toast wandert in den offenen Dialog);
  transparente PNGs wurden schwarz (Transparenz wird am Inhalt erkannt → WebP, sonst JPEG); Tastenkürzel wirkten hinter dem
  Favoriten-Dialog; Zurück-Taste beendete Vollbild nicht (alter Fehler: `history` war das Rückgängig-Array → `window.history`);
  Querformat-Kleinhandys: Werkzeuge unerreichbar (Vorschau dort nicht klebend, Mindesthöhe ≤ 45 %); Halten+Ziehen mit nur
  einem Foto/gezoomt blockierte Scrollen/Verschieben; doppeltes ★ speicherte doppelt; Favoriten-Kacheln per Tastatur; ★ speichert,
  was man sieht (Maske nur im Modus Frei); Hinweis, wenn Browser-Speicher nicht verfügbar ist.
- Verbesserungen: Reiter springt nur bei echtem Antippen auf „Foto“; Halten im Modus Frei 600 ms (langsames Tippen wählt nur aus);
  klebende Reiter im Vollbild; Beschriftungen verständlicher (Foto, Speichern, Nebeneinander …, „Dicht anordnen“, „Lückenlos füllen“,
  „An Foto darunter anpassen“, Name mit ✎); Vorschaubild direkt aus der Render-Canvas; „n eingefügt“ im Favoriten-Dialog;
  Reiter per Pfeiltasten; ⬇ während des Exports gesperrt.
- Tests: fixes4.js (11 gezielte Prüfungen), ui3/v2/free/sep/layers/fit2/big – alle grün.
