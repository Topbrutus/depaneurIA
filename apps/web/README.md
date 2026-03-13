# apps/web — Parcours client local (Vite + React)

Front client minimal pour depaneurIA. Objectif : tester localement l’inscription, la connexion, le profil et les adresses sans dépendance backend.

## Scripts utiles

- `pnpm dev:web` — démarre le front Vite.
- `pnpm --filter @depaneuria/web build` — build + typecheck.
- `pnpm --filter @depaneuria/web lint` — lint.

## Parcours V1 gelé

- Routes : `/signup`, `/login`, `/profile`, `/addresses`, `/` (boutique placeholder), `/404`.
- Stockage local (localStorage) du profil (nom, téléphone, notes) et des adresses multiples avec choix d’adresse par défaut.
- Validations : téléphone 10–15 chiffres, adresse complète, zone desservie (75/92/93/94) + messages d’erreur dédiés.
- Connexion par téléphone avec redirection vers la boutique et session locale réutilisable.
- Réinitialisation locale possible (reset session ou suppression de compte).
