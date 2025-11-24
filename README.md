# UI Assessment - Pokédex

## What I built
- **Server-side search with debounce**: The list and pagination talk directly to the GraphQL API using `where` regex filtering; typing waits ~350ms before firing requests to avoid spamming the backend.
- **Pagination that remembers state**: Page + search live in the URL (`page`, `search`) so deep links and back/forward keep your place; closing the details modal preserves them.
- **Detail modal via routing**: `/pokemon/:id` opens an Ant Design modal on top of the list; supports deep linking and keeps list context intact.
- **JSS everywhere, no CSS files**: Styling lives in `tss` definitions per component; body styles set via `useGlobalBodyStyles`.
- **Resilient states**: Loading, error, and empty cases are handled with friendly random empty messages.
- **Tests**: Jest + RTL cover list render, navigation, and debounced search; `yarn test --runInBand` passes.

## Why these choices
- Used **server-side search** to satisfy senior requirements and reduce client filtering costs; regex is escaped and case-insensitive to avoid API errors.
- Kept **state in the URL** so refreshes and shared links behave like a real app (no hidden local state).
- Added **debounce** to keep the search snappy while avoiding unnecessary API calls.
- Used **AntD modal** so I could have a solid, accessible dialog right away without rebuilding everything myself.
- Centralized **body theming in code** to satisfy the “JSS only” rule and keep global look consistent.

---

## Getting Started

### Leveraging Open API GraphQL

In this assessment you will utilize a Pokémon open API (GraphQL). This will demonstrate your knowledge and aptitude with GraphQL, which ReliaQuest heavily leverages.

**Resources:**

- [API Docs](https://pokeapi.co/docs/graphql) (with [interactive playground](https://graphql.pokeapi.co/v1beta2/console))
- [Apollo Docs](https://www.apollographql.com/docs/react/)
- [React Docs](https://reactjs.org/docs/getting-started.html)
- [React Router Docs](https://reactrouter.com/home)

---

## App-Wide Requirements

1. **Must use JSS for all styling** - No CSS files. The `<PokemonListPage />` component (`src/screens/PokemonListPage.tsx`) already demonstrates this pattern using the `tss` function from `src/tss.ts`. All styling contexts are already provided and implemented for you.

2. **Must use TypeScript for all files** - Proper typing throughout with minimal use of `any`.

3. **All components must handle loading, error, and empty states appropriately** - App should not break in unexpected empty or error states.

---

## Core Requirements

### 1 - List Page

Expand the existing list page with the following features. You will need to retrieve data from the `useGetPokemons` hook (`src/hooks/useGetPokemons.ts`) where the GraphQL query is defined.

1. Create list items that display:

   - Pokémon name
   - Pokémon number
   - Pokémon type(s)
   - Pokémon image (available through the API)

2. Each list item should have a hover effect

3. Show a proper loading state while data is being fetched

### 2 - Search Functionality

Implement search functionality so users can quickly find Pokémon.

1. Add a search input box that filters the list of Pokémon

2. Search should be **case insensitive**

3. Only Pokémon matching the search should be displayed

4. Show appropriate messaging when no results are found

5. **For Entry- and Mid-Level Engineers:** Searching will be **client-side only** (filter the results you already have). Please do not implement server-side searching, as you are being evaluated on your ability to manipulate a data set.

6. **For Senior Engineers:** See "Additional Senior Requirements" below - you will implement **server-side search** instead.

### 3 - Dialog for Pokémon Details

When a user clicks on a Pokémon, show a dialog/modal with detailed information.

1. **Route-dependent modal:** The dialog should open based on the route using `react-router` (already set up in the app). For example: `/pokemon/25`. This also means the page should support deep linking--if you copy a link to a details dialog, you should be able to paste that link in the address bar and get to the same details dialog.

2. **Open on top of the list:** The dialog should overlay the list page, whether you clicked a list item or pasted a link to the details page.

3. **Fetch detailed data:** Use GET_POKEMON_DETAILS query to fetch details for a single Pokémon

4. **Handle states:** Properly handle loading and error states for the detail fetch.

5. **Display choice:** What additional details you display and how you lay them out is up to you.

6. **You may use a component library** for the dialog/modal (e.g., [Ant Design Modal](https://ant.design/components/modal)) so you don't have to build one from scratch.

### 4 - Testing Requirements

This assessment includes a testing component using Jest and React Testing Library, found in PokemonListPage.test.tsx. You can run it with `yarn test`

All three tests should pass when submitting.

## Additional Requirements for Senior Engineers

Senior candidates must complete all entry/mid-level requirements AND the following:

### 1. Pagination

Implement pagination for the Pokémon list:

- Add pagination controls (Previous/Next buttons, page numbers, or similar UI)
- Load Pokémon in chunks rather than all 151 at once (e.g., 20 per page)
- The GraphQL API supports pagination with the `first` and `offset` parameters
- Maintain pagination state when navigating to and from the detail modal
- Search functionality should work with pagination

### 2. Server-Side Search

Replace the client-side search with server-side search:

- Update your GraphQL query to perform searching on the backend
- Use the API documentation and interactive playground to test your query
- Implement debouncing for the search input to avoid excessive API calls while typing
- Show a loading indicator while search results are being fetched
- Search should work in conjunction with pagination

---

## How to run
1. `yarn install` (or `npm install`)
2. `yarn dev` to run locally
3. `yarn test --runInBand` to run Jest/RTL suite
4. `npm run lint -- --fix` to verify TypeScript + ESLint

## Files worth noting
- `src/hooks/useGetPokemons.ts` — GraphQL queries, server-side search + pagination helpers.
- `src/hooks/useDebouncedValue.ts` — tiny debounce hook for search input.
- `src/hooks/useGlobalBodyStyles.ts` — applies global body styling (no CSS files).
- `src/screens/PokemonListPage.tsx` — search, pagination, list UI, empty/error/loading handling.
- `src/screens/PokemonDetailsPage.tsx` — route-driven modal overlay with Pokémon details.
- `src/constants/messages.ts` — randomized empty-state quips.

———

## Submission

When you're ready to submit:

1. Ensure all tests pass
2. Ensure the app runs without errors
3. Follow the submission instructions provided by your recruiter

Good luck!
