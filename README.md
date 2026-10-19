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

## Déploiement sur Vercel

1. Pousser le dépôt sur GitHub.
2. [vercel.com/new](https://vercel.com/new) → importer le dépôt. Framework : Next.js. Aucune commande de build à changer.
3. Ajouter les variables de `.env.example` dans **Settings → Environment Variables**.
4. Dans Resend, vérifier le domaine d’envoi et utiliser cette adresse dans `CONTACT_FROM_EMAIL`.
5. Déployer, ouvrir `/`, `/en`, une page projet, et envoyer un message de test.
6. Brancher le domaine (`bricman-mathis.fr`) et mettre à jour `NEXT_PUBLIC_SITE_URL`.
7. Si Plausible est utilisé, créer le site avec le même domaine. Pas de bannière cookies : Plausible ne dépose pas de cookie.

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
