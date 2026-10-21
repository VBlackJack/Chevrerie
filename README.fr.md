# Le Mystère de la Chèvrerie

> English version: [README.md](README.md)

Un petit jeu d'enquête en pointer-cliquer, dessiné à la main en SVG, à jouer dans un
navigateur sur ordinateur. Une chèvre championne a disparu d'une chèvrerie des Monts du
Lyonnais, le matin du concours. Il faut enquêter, ramasser les indices, les rapprocher
dans le carnet, puis remplir les deux tableaux de déduction.

## Jouer

Ouvrir `index.html` dans un navigateur récent (Chrome, Edge, Firefox). Rien à installer,
pas de serveur. La partie est sauvegardée automatiquement dans le navigateur.

Durée : environ 45 minutes à 1 h 15. Les polices viennent de Google Fonts quand la
connexion est disponible, avec une police de secours sinon.

## Structure

```
index.html            page et ordre des scripts
css/style.css         mise en page, panneaux, animations
locales/fr.js         tous les textes du jeu (français)
js/config.js          constantes
js/i18n.js            résolution des clés, répliques
js/art/kit.js         formes dessinées, personnages, chèvres
js/scenes/            décors et zones cliquables
js/data/              indices, déductions, personnages, objectifs d'aide
js/game.js            état, moteur de scripts, règles
js/ui.js              couche DOM
```

## Licence

Apache License 2.0. Copyright 2026 Julien Bombled.
