# Rate Limiter Frontend (Angular)

## Live Deployment

- Netlify: https://rat3limiter.netlify.app

---

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+

---

## Run Locally

### 1) Install

```bash
npm install
```

### 2) Set API base URL (local)

Edit:

**`src/environments/environment.ts`**

```ts
export const environment = {
  production: false,
  apiBaseUrl: "http://localhost:8080/api/v1",
};
```

### 3) Start

```bash
npm start
```

Open:

- http://localhost:4200

---

Update your scripts:

**`package.json`**

```json
{
  "scripts": {
    "start": "ng serve",
    "prebuild": "node ./scripts/generate-env.js",
    "build": "ng build",
    "test": "ng test"
  }
}
```

### 3) Netlify build settings

- Build command: `npm run build`
- Publish directory: `dist/<your-angular-project-name>`

---

## Tests

### Unit tests

```bash
npm test
```

### E2E tests (Cypress)

Terminal A:

```bash
npm start
```

Terminal B:

```bash
npx cypress open
# or headless:
npx cypress run
```
