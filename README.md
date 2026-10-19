# Mathis Bricman — Portfolio

Site personnel d’un développeur web à Marseille. Français par défaut (`/`), anglais sous `/en`.

## Installation

```bash
npm install
npm run dev
```

Le site est sur [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm run lint
```

## Modifier le contenu

Tout le texte éditable est dans `content/`, sans toucher aux composants.

| Fichier | Rôle |
| --- | --- |
| `content/projects.ts` | Identité (nom, email, liens) et fiches des projets (slug, année, URL, stack) |
| `content/fr.ts` | Tous les textes français |
| `content/en.ts` | Tous les textes anglais |
| `content/types.ts` | Contrat TypeScript entre les deux langues |

Le CV en ligne est sur `/cv` (anglais : `/en/cv`). Le PDF se télécharge depuis cette page, ou via `/api/cv`. Les textes sont dans `cv` de `content/fr.ts` et `content/en.ts`.

Les visuels de projets sont de vraies captures des sites (1440 × 900) dans `public/projects/`. Pour les refaire : `powershell -File scripts/capture-projects.ps1` (Chrome ou Edge requis). Pour ajouter un projet : une entrée dans `content/projects.ts`, son texte dans `cases` de `fr.ts` et `en.ts`, et une ligne dans le script de capture.

## Variables d’environnement

Copier `.env.example` vers `.env.local`.

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL canonique, sans slash final |
| `RESEND_API_KEY` | Clé API Resend |
| `CONTACT_FROM_EMAIL` | Expéditeur vérifié dans Resend |
| `CONTACT_TO_EMAIL` | Boîte qui reçoit les messages |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Domaine Plausible. Vide = pas de script |
| `NEXT_PUBLIC_PLAUSIBLE_SRC` | URL du script Plausible |

Sans clé Resend, le formulaire répond une erreur et propose d’écrire à l’adresse du profil. Un champ caché sert de honeypot. Cinq envois maximum par adresse IP toutes les dix minutes.

## Déploiement (GitHub Actions → VPS OVH)

Un `push` sur `main` lance **CI** (lint + build), puis **Deploy VPS** si CI est vert.

Le site n’est plus un export statique : Next.js tourne avec PM2 sur le VPS, nginx fait reverse proxy vers `127.0.0.1:3000`.

Secrets (environnement GitHub `portfolio`) :

- `VPS_HOST`, `VPS_USER`, `VPS_PATH`, `VPS_PORT`, `VPS_SSH_KEY_B64`
- optionnel : `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` (formulaire)

Ne pas modifier les MX OVH. L’ancien dossier `dist/` n’est plus servi une fois nginx basculé.

## Checklist de mise en production

- [ ] Vérifier les années et la stack de chaque projet dans `content/projects.ts`
- [ ] Remplacer les trois témoignages par de vraies citations clients
- [ ] Vérifier l’email, GitHub et LinkedIn dans `content/projects.ts`
- [ ] Renseigner `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`
- [ ] Fixer `NEXT_PUBLIC_SITE_URL` sur le domaine final
- [ ] Tester le formulaire en production (succès, email invalide, honeypot)
- [ ] Décider si Plausible est branché
- [ ] Lancer un passage Lighthouse mobile et desktop (cible ≥ 90)
- [ ] Vérifier le contraste du thème clair et du thème sombre
- [ ] Confirmer que `prefers-reduced-motion` coupe les animations et remplace le logo 3D par sa version SVG
