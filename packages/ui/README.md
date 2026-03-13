# packages/ui — Bibliothèque de composants UI partagés

## Rôle

Composants React réutilisables partagés entre les applications du monorepo.  
Garantit une cohérence visuelle et évite la duplication de composants.

## Contenu prévu

- Composants de base : `Button`, `Input`, `Modal`, `Card`, `Badge`
- Composants de mise en page : `Layout`, `Header`, `Footer`, `Sidebar`
- Composants de formulaire : `Form`, `Select`, `Checkbox`

## Utilisé par

- `apps/web`

## Stack

- React + TypeScript strict
- Tailwind CSS (si retenu)
- Tests unitaires via Vitest

## Structure interne prévue

```
packages/ui/
├── src/
│   ├── components/      # Composants exportés
│   └── index.ts         # Point d'entrée du package
├── tsconfig.json
└── package.json
```

## DEP concerné

DEP-0135
