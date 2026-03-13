# apps/api — Serveur back-end (API REST)

## Rôle

API REST principale de depaneurIA.  
Gère la logique métier, l'accès à la base de données et les intégrations externes (OpenAI, etc.).

## Stack prévue

- **Runtime** : Node.js (version minimale définie dans DEP-0125)
- **Framework** : Express ou Fastify (décision à venir)
- **Langage** : TypeScript strict
- **Base de données** : PostgreSQL via Prisma (décision à venir)
- **Authentification** : JWT ou sessions (décision à venir)

## Structure interne prévue

```
apps/api/
├── src/
│   ├── routes/          # Définitions des routes HTTP
│   ├── controllers/     # Logique de traitement des requêtes
│   ├── services/        # Logique métier
│   ├── repositories/    # Accès aux données (Prisma)
│   ├── middlewares/     # Middlewares Express/Fastify
│   └── lib/             # Utilitaires locaux
├── prisma/
│   └── schema.prisma    # Schéma de base de données
├── .env.example         # Variables d'environnement requises
├── tsconfig.json
└── package.json
```

## Dépendances partagées utilisées

- `packages/types` — types TypeScript partagés
- `packages/utils` — fonctions utilitaires communes

## DEP concerné

DEP-0134
