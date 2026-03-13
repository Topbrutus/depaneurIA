# packages/types — Types TypeScript partagés

## Rôle

Définitions de types TypeScript communes à toutes les applications du monorepo.  
Assure la cohérence des contrats entre le front-end (`apps/web`) et le back-end (`apps/api`).

## Contenu prévu

- Types de domaine : `Order`, `User`, `Product`, `Address`, `DeliveryZone`
- Types d'API : payloads de requête/réponse
- Enums partagés : `OrderStatus`, `UserRole`, `PaymentMethod`

## Utilisé par

- `apps/web`
- `apps/api`

## Structure interne prévue

```
packages/types/
├── src/
│   ├── domain/          # Types métier
│   ├── api/             # Contrats d'API
│   └── index.ts         # Point d'entrée du package
├── tsconfig.json
└── package.json
```

## DEP concerné

DEP-0135
