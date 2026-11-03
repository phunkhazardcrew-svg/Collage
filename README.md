# Foto-Merge

Eine einzelne HTML-Datei (`index.html`), die mehrere Fotos zu einem Bild zusammenfügt –
**ohne etwas abzuschneiden** und **ohne Auflösungsverlust**.

## Benutzung
1. `index.html` im Browser öffnen (Doppelklick genügt, keine Installation, kein Internet nötig).
2. Fotos per Klick, Drag & Drop oder Strg+V hinzufügen.
3. Layout wählen, ggf. Reihenfolge mit ↑/↓ ändern.
4. „Bild herunterladen“.

## Auf dem Android-Handy installieren
Die App läuft über **GitHub Pages** und ist eine installierbare Web-App (PWA): eigenes Symbol, Vollbild, offline nutzbar.

**Einmalig GitHub Pages einschalten** (am PC oder im Handy-Browser):
1. https://github.com/phunkhazardcrew-svg/Collage/settings/pages öffnen.
2. *Build and deployment* → *Source*: **Deploy from a branch**.
3. *Branch*: `claude/foto-merge-app-3x75rr` (bzw. `main`, falls vorhanden), Ordner **/ (root)** → **Save**.
4. 1–2 Minuten warten. Adresse: **https://phunkhazardcrew-svg.github.io/Collage/**

**Auf dem Handy:**
1. Die Adresse oben in **Chrome** öffnen.
2. Menü **⋮** → **„App installieren“** (bzw. „Zum Startbildschirm hinzufügen“) → **Installieren**.
3. Fertig – „Foto-Merge“ erscheint als App-Symbol und funktioniert auch ohne Internet.

Fertige Bilder landen über „Bild herunterladen“ im Ordner *Downloads* (in Google Fotos unter *Bibliothek → Download*),
oder über „Teilen / in Galerie speichern …“ direkt in Google Fotos, WhatsApp usw.

## Prinzip
- Standard: Jedes Foto bleibt in **Originalpixeln**; die Pixel addieren sich, die Leinwand wächst.
  Beispiel: 4000×3000 + 3000×4000 nebeneinander → 7000×4000 px.
- Haben die Fotos unterschiedliche Formate, bleiben freie Ecken **schwarz** (Farbe änderbar).
- Optional „angleichen“: Bilder auf gleiche Höhe/Breite bringen – es wird nur auf das größte
  Bild hoch-, nie herunterskaliert; nichts wird beschnitten.
- Layouts: nebeneinander, untereinander, Raster (Zeilen), Raster (Spalten); Abstand, Rand, Ausrichtung.
- Export: JPEG / PNG (verlustfrei) / WebP; „Original“ = volle Auflösung.
- Alles läuft lokal im Browser, nichts wird hochgeladen.

## Bearbeiten, Zoomen, Sortieren (ab v2.0)
- **Foto bearbeiten:** Foto in der Vorschau antippen oder ✎ in der Liste.
  - ↺/↻ 90° drehen, ⇆/⇅ spiegeln – verlustfrei, Pixel bleiben exakt erhalten.
  - **Begradigen:** frei drehen (−45° … +45°, 0,1°-Schritte). Nichts wird abgeschnitten, die Ecken werden Hintergrund (schwarz).
  - **Ausschnitt** (freiwillig): Ganzes Foto (Standard), Frei, 1:1, 4:3, 3:4, 16:9, 9:16 – Ecken ziehen, Rahmen verschieben.
- **Vorschau-Zoom:** zwei Finger / Mausrad / Doppeltipp, Knöpfe −, +, 1:1 (Originalpixel), Einpassen, Vollbild.
- **Sortieren:** ≡-Griff in der Liste ziehen, oder in der Vorschau gedrückt halten & auf ein anderes Foto ziehen (tauscht).
- **Rückgängig / Wiederholen:** ↶ ↷ oben in der Vorschau (Strg+Z / Strg+Y).
- Einstellungen (Layout, Abstand, Format …) werden im Browser gemerkt.

## Grenzen
Browser begrenzen die Canvas-Größe (Desktop ca. 268 MP / 32767 px Kante, iPhone/iPad deutlich weniger,
WebP max. 16383 px Kante). Ist das Ergebnis größer, verkleinert die App automatisch und zeigt einen Hinweis.
