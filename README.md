# Foto-Merge

Eine einzelne HTML-Datei (`index.html`), die mehrere Fotos zu einem Bild zusammenfügt –
**ohne etwas abzuschneiden** und **ohne Auflösungsverlust**.

## Benutzung
1. `index.html` im Browser öffnen (Doppelklick genügt, keine Installation, kein Internet nötig).
2. Fotos per Klick, Drag & Drop oder Strg+V hinzufügen.
3. Layout wählen, ggf. Reihenfolge mit ↑/↓ ändern.
4. „Bild herunterladen“.

## Prinzip
- Standard: Jedes Foto bleibt in **Originalpixeln**; die Pixel addieren sich, die Leinwand wächst.
  Beispiel: 4000×3000 + 3000×4000 nebeneinander → 7000×4000 px.
- Haben die Fotos unterschiedliche Formate, bleiben freie Ecken **schwarz** (Farbe änderbar).
- Optional „angleichen“: Bilder auf gleiche Höhe/Breite bringen – es wird nur auf das größte
  Bild hoch-, nie herunterskaliert; nichts wird beschnitten.
- Layouts: nebeneinander, untereinander, Raster (Zeilen), Raster (Spalten); Abstand, Rand, Ausrichtung.
- Export: JPEG / PNG (verlustfrei) / WebP; „Original“ = volle Auflösung.
- Alles läuft lokal im Browser, nichts wird hochgeladen.

## Grenzen
Browser begrenzen die Canvas-Größe (Desktop ca. 268 MP / 32767 px Kante, iPhone/iPad deutlich weniger,
WebP max. 16383 px Kante). Ist das Ergebnis größer, verkleinert die App automatisch und zeigt einen Hinweis.
