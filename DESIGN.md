# Design

## Concept

**L'obturateur.** Le logo, un anneau de 30 lames, devient un diaphragme en volume. Au chargement, les lames arrivent dispersées et s'assemblent. Au défilement, elles pivotent sur leur axe et l'anneau grandit jusqu'à ce que son trou remplisse l'écran : on passe à travers le logo pour entrer dans le travail. C'est le seul moment spectaculaire du site, tout le reste reste calme.

Noir, blanc, verre. Aucune couleur d'accent : la hiérarchie tient au contraste, à la taille, au flou.

## Palette

Définie dans `src/app/globals.css`, basculée par la classe `.dark`. Sombre par défaut, clair au choix (mémorisé).

| Rôle | Sombre | Clair |
| --- | --- | --- |
| Fond | `#000000` | `#f1f1f1` |
| Encre | `#ffffff` | `#000000` |
| Texte secondaire | `#8f8f8f` | `#666666` |
| Texte discret | `#4d4d4d` | `#a6a6a6` |
| Verre | blanc 4,5 → 8,5 %, flou 24 px, saturation 180 % | blanc 55 → 80 % |
| Lames 3D | métal clair `#f2f2f2` | métal noir `#151515` |

Un grain fixe et deux halos lents donnent au verre quelque chose à flouter.

## Typographie

- **Bricolage Grotesque** (titres, chiffres des widgets) : axes `opsz` 96 et `wdth` 92, approche `-0.032em`, interligne 0,94. Utilitaire `display`.
- **Geist** (texte, interface) : 17 px, interligne 1,55.

## Logo

Géométrie dans `src/lib/logo.ts`, partagée par :

- la scène WebGL du hero (`aperture-scene.tsx`), en métal poli éclairé par un studio calculé localement (aucun HDR téléchargé) ;
- le SVG du header, qui tourne avec la progression du défilement ;
- la version animée en vague (mobile, mouvement réduit, absence de WebGL) ;
- le cadran de l'horloge (30 index), les pictogrammes de services, le filigrane du contact ;
- le favicon, l'icône Apple et l'image Open Graph.

## Motion

- Courbe unique `cubic-bezier(0.22, 1, 0.36, 1)`.
- Hero : lames qui s'assemblent, mots qui montent derrière un masque, ouverture du diaphragme au défilement.
- Projets : pile de cartes collantes, chaque carte recule quand la suivante se pose. Captures inclinables au pointeur avec reflet.
- Navigation : la capture d'un projet se transforme en héros de l'étude de cas (`ViewTransition` de React, `transitionTypes` de `next/link`), glissement vers la gauche en avançant, vers la droite en revenant.
- Thème : le nouveau thème s'ouvre en cercle depuis le bouton cliqué.
- Titres de section révélés mot à mot, une seule fois. Bento qui apparaît en cascade.
- Parcours : une ligne se trace au défilement et allume chaque étape.
- CV (`/cv`) : nom révélé lettre par lettre, chiffres qui comptent, sommaire collant qui suit la lecture, frise d'expérience tracée au défilement, halo qui suit le pointeur sur le verre, aperçu A4 qui s'incline. Barre de progression en haut de page.
- `prefers-reduced-motion` coupe les animations et remplace la scène 3D par le logo SVG.

## Widgets

Horloge de Marseille avec statut (heures ouvrées 9 h – 19 h, lundi – vendredi), radar de localisation, délai de première réponse, orbite de la stack (pause au survol), faits, services. Palette de commandes `⌘K` / `Ctrl K` : sections, projets, thème, langue, copie de l'email, liens.

## Structure

Hero, projets (pile de cinq cartes), atelier (bento de widgets), parcours, retours (carrousel à glisser si nécessaire), contact, footer. Le français est l'URL par défaut (`/`), l'anglais vit sous `/en`. Tout le texte éditable est dans `content/`.

## CV PDF

Généré par `@react-pdf/renderer` (`src/lib/cv-document.tsx`, servi par `/api/cv`). Une page A4, mêmes règles que le site : noir, blanc, gris, logo en tête. Bricolage Grotesque (instance figée opsz 96, wdth 92, 600) et Geist sont embarquées en TTF dans `src/assets/fonts/` (licence OFL) et incluses dans la trace de `/api/cv` via `outputFileTracingIncludes`.
