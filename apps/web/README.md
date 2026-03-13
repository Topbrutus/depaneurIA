# apps/web — Interface utilisateur (Front-end)

## Rôle

Application web client de depaneurIA.  
Permet aux clients, dépanneurs et livreurs d'accéder au service via un navigateur.

## Stack prévue

- **Framework** : Next.js (React)
- **Langage** : TypeScript strict
- **Style** : Tailwind CSS (décision à venir)
- **Gestion d'état** : à décider (Zustand ou React Query selon les besoins)

## Structure interne prévue

```
apps/web/
├── public/              # Fichiers statiques
├── src/
│   ├── app/             # Routes (App Router Next.js)
│   ├── components/      # Composants UI locaux
│   ├── hooks/           # Hooks React locaux
│   └── lib/             # Utilitaires locaux
├── .env.example         # Variables d'environnement requises
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Dépendances partagées utilisées

- `packages/ui` — composants UI réutilisables
- `packages/types` — types TypeScript partagés
- `packages/utils` — fonctions utilitaires communes

## DEP concerné

DEP-0134
