# Le Mystère de la Chèvrerie

> Version française : [README.fr.md](README.fr.md)

A small point-and-click detective game, hand-drawn in SVG, played in a desktop browser.
A champion goat disappeared from a farm in the Monts du Lyonnais on the morning of the
county contest. Investigate, collect clues, link them in the notebook, and fill in the
two deduction boards.

## Play

Open `index.html` in a recent browser (Chrome, Edge, Firefox). No installation, no
server. Progress is saved automatically in the browser.

Playing time: about 45 minutes to 1 hour 15. Fonts load from Google Fonts when online,
with a serif fallback offline.

## Structure

```
index.html            page and script order
css/style.css         layout, panels, animations
locales/fr.js         every player-facing text (French)
js/config.js          constants
js/i18n.js            key lookup, dialogue lines
js/art/kit.js         hand-drawn shapes, people, goats
js/scenes/            scene drawings and hotspots
js/data/              clues, deductions, characters, hint goals
js/game.js            state, script runner, rules
js/ui.js              DOM layer
```

## License

Apache License 2.0. Copyright 2026 Julien Bombled.
