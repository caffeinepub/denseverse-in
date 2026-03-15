# denseverse.in

## Current State
- Storefront with 12 hardcoded watches in `src/frontend/src/data/watches.ts`
- Empty Motoko backend (`actor {}`)
- No admin panel, no way to manage products without rebuilding

## Requested Changes (Diff)

### Add
- Admin login page at `/admin` (Internet Identity via authorization component)
- Admin dashboard to list all watches with edit/delete actions
- Add new watch form (name, brand, category, price, description, specs fields)
- Edit watch form (pre-filled with existing data)
- Backend: Watch CRUD stable storage (create, read, update, delete)
- Frontend reads watches from backend instead of hardcoded data
- Seed initial 12 watches into backend on first load if empty

### Modify
- `App.tsx`: fetch watches from backend canister instead of static file
- Navigation: add subtle "Admin" link in footer

### Remove
- Static `watches.ts` data array (replaced by backend storage)

## Implementation Plan
1. Add `authorization` Caffeine component
2. Generate Motoko backend with Watch type and CRUD functions, plus seeding
3. Frontend: create AdminPage with login gate, watch list, add/edit/delete forms
4. Update storefront to fetch watches from backend
5. Add route for /admin
