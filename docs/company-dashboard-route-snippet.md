# Route integration snippet

The installer creates:

- `views/CompanyEngineerDashboardPage.tsx`
- `data/companyDashboard.ts`
- `services/companyDashboardEngine.ts`
- `types/companyDashboard.ts`

Add the page to your router/navigation using whichever route structure TechSubbies currently uses.

Example:

```tsx
import CompanyEngineerDashboardPage from "./views/CompanyEngineerDashboardPage";

{
  path: "/company/engineers",
  element: <CompanyEngineerDashboardPage />,
}
```

Suggested navigation label:

```ts
{
  label: "Company dashboard",
  path: "/company/engineers",
}
```