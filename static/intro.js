

                         ╔════════════════════════════╤═════════════════════════════╗
                         ║                            │                             ║
                         ║         Welcome to         │        Bienvenue dans       ║
                         ║                          ──┴──                           ║
                         ║                                                          ║
                         ║     ███████         █                   █                ║
                         ║    █░░░░░░░█                                      ██     ║
                         ║    █       ░ █ ██  ██  █ ██ ██    ███  ██  █ ██  █░░█    ║
                         ║    █   █████ ░█░░█ ░█  ░█░░█░░█  █░░░█  █  ░█░░█ ████    ║
                         ║    █   ░░░░█  █  ░  █   █  █  █  █   █  █   █  ░ █░░░    ║
                         ║    ░███████░ ███   ███ ███ ░ ███ ░███░ ███ ███   ░██     ║
                         ║     ░░░░░░░  ░░░   ░░░ ░░░   ░░░  ░░░  ░░░ ░░░    ░░     ║
                         ║                                                          ║
                         ╚══════════════════════════════════════════════════════════╝


                         ┌────────────────────────────┬─────────────────────────────┐
                         │ Press the down arrow       │ Appuyez sur la flèche vers  │
                         │ or scroll down for         │ le bas ou défilez vers le   │
                         │ instructions.              │ bas pour les instructions.  │
                         └────────────────────────────┴─────────────────────────────┘




──────────────────────────────────────────────────────┬─────────────────────────────────────────────────────
                                                      │
Grimoire is an experimental software dedicated to     │   Grimoire est un logiciel expérimental dédié
the exploration of possible new encounters between    │   à l'exploration de nouvelles rencontres possibles
animation, music, drawing, programming, audiovisual   │   entre l'animation, la musique, le dessin, la
performance, writing, and hypertextuality.            │   programmation informatique, la performance
                                                      │   audiovisuelle, l'écriture et l'hypertextualité.
With Grimoire, artists can learn to live code         │
generative art or music and create interactive        │   Avec Grimoire, les artistes peuvent apprendre
systems that will run natively on the web.            │   la programmation "in vivo" afin de créer de l'art
                                                      │   génératif visuel ou sonore ainsi que des systèmes
Grimoire takes inspiration in the early beginnings    │   interactifs.
of personal computing in order to revive the spirit   │
of freedom, invention, and community that             │   Grimoire s'inspire des tout premiers débuts de
characterized them.                                   │   l'ordinateur personnel afin de raviver l'esprit
                                                      │   de liberté, d'invention et de communauté dont ils
The software is currently in Pre-alpha state, so      │   étaient porteurs.
expect limited functionality and a lot of bugs.       │
                                                      │   Le logiciel est présentement en phase pré-alpha.
                                                      │   Attendez-vous à des fonctionnalités limitées
                                                      │   et à de nombreux bugs.
                                                      │
══════════════════════════════════════════════════════╪══════════════════════════════════════════════════════
                                                      │
Getting Around In Grimoire                            │   S'orienter dans Grimoire
                                                      │
2. Live Coding                                        │   1. La programmation "in vivo".
                                                      │
Grimoire is firstly a live coding environment. It     │   Grimoire est tout d'abord un environnement de
allows you to write and modify programs as they are   │   programmation "in vivo" (de l'anglais "live
running.                                              │   coding"). Il permet ainsi d'écrire et de modifier
                                                      │   des programmes informatiques pendant même que
For example, the background animation that you can    │   ceux-ci sont exécutés.
see behind this text can be changed for another one   │
on the fly, by changing the backgroundAnimation       │   Par exemple, l'animation qui est affichée en fond
variable. Below are a few lines of code, pre-written  │   d'écran derrière ce texte peut être remplacée par
for you, that will allow you to change this           │   une autre en temps réel, en changeant la valeur
animation. To execute any of those lines, click on    │   de la variable backgroundAnimation. Pour exécuter
the line you wish to run, and press Shift-Return.     │   une des lignes de code ci-dessous, cliquez d'abord
                                                      │   sur la ligne voulue et ensuite appuyez sur
Finally, if you set backgroundAnimation to null, no   │   Shift-Entrée.
animation will be displayed.                          │
                                                      │   Finalement, si vous donnez à la variable
                                                      │   backgroundAnimation la valeur null, aucune
                                                      │   animation ne sera affichée.
                                                      │
══════════════════════════════════════════════════════╧══════════════════════════════════════════════════════

backgroundAnimation = swirl;
backgroundAnimation = radialSwirl;
backgroundAnimation = smokySpiral;
backgroundAnimation = expandingUniverse;
backgroundAnimation = brokenTerrain;
backgroundAnimation = globe;
backgroundAnimation = null;

──────────────────────────────────────────────────────┬──────────────────────────────────────────────────────
                                                      │
The first official release of Grimoire                │   La première version officielle de Grimoire
will be all about letting you create your own         │   vous permettra de créer vos propres animations
animations and your own programs (and your own        │   et programmes (et vos propres sons, une fois que
sounds, once the audio component is functional),      │   la composante audio sera fonctionnelle), plutôt
rather than modifying pre-existing material like      │   que de modifier du matériel préexistant comme
in this early demonstration.                          │   c’est le cas dans cette première démonstration.
                                                      │
══════════════════════════════════════════════════════╪══════════════════════════════════════════════════════
                                                      │
Getting Around In Grimoire                            │   S'orienter dans Grimoire
                                                      │
2. Painting                                           │   2. La peinture
                                                      │
Another main component of Grimoire is the ability     │   Une autre composante importante dans Grimoire
to paint pixel art and then interact with the         │   est la possibilité de peindre des oeuvres en "pixel
paintings programmatically. To activate the painting  │   art". Pour activer les outils de peinture, appuyez
tools, simply press the ESC key. The ESC key allows   │   sur la touche ESC (Escape). La touche ESC permet
you to toggle between 3 different modes of Grimoire.  │   de changer le mode dans lequel se trouve Grimoire.
The 3 modes are editing, painting, and terminal.      │   Grimoire possède 3 modes distincts: édition de
The terminal is simply one line at the bottom of the  │   texte, peinture et terminal. Le terminal est
screen that allows to input commands without          │   simplement une ligne qui apparaît au bas de l'écran
altering the text file currently displayed in the     │   et qui permet d'exécuter des commandes sans changer
editor.                                               │   le texte qui se trouve dans les pages de code.
                                                      │
When you are in painting mode, a collection           │   Lorsque vous êtes en mode peinture, une collection
of patterns with which you can paint is displayed     │   de motifs avec lesquels peindre apparaît au bas
at the bottom of the screen.                          │   de l'écran.
                                                      │
Here are a few hotkeys to help you get the most out   │   Voici quelques raccourcis clavier pour vous aider
of the painting tools:                                │   à tirer le meilleur parti des outils de peinture :
                                                      │
- Hold SHIFT while painting with the mouse to erase   │   - Maintenez SHIFT tout en peignant avec la souris
  instead of paint.                                   │     pour effacer au lieu de peindre.
- Press B to change the brush shape.                  │   - Appuyez sur B pour changer la forme du pinceau.
- Press T to change the type of brush used. Each      │   - Appuyez sur T pour changer le type de pinceau
  type contains several similar brush shapes.         │     utilisé. Chaque type contient plusieurs formes
- Press P to change the scale of the pattern.         │     de pinceau similaires.
  The scale will toggle between 1, 2, and 4.          │   - Appuyez sur P pour modifier l'échelle du motif.
- Press M to toggle between 3 different painting      │     L'échelle basculera entre 1, 2 et 4.
  modes : Normal, Add, and Substract.                 │   - Appuyez sur M pour basculer entre 3 modes de
                                                      │     peinture différents : Normal, Addition et
                                                      │     Soustraction.
                                                      │
══════════════════════════════════════════════════════╧══════════════════════════════════════════════════════
