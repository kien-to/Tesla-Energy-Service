# Tesla Energy Site Planner

A web application for configuring and visualizing industrial battery site layouts. Users can select battery types and quantities, view cost/energy/land summaries, and see an auto-generated 2D site layout.

## Tech Stack

- **Frontend**: React 19 + Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: SCSS Modules
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js >= 18
- npm

### Install & Run

```bash
npm install
make dev
```

The app runs on [http://localhost:8000](http://localhost:8000).

### Available Commands

| Command      | Description                          |
| ------------ | ------------------------------------ |
| `make dev`   | Start dev server with hot reload     |
| `make build` | Production build                     |
| `make serve` | Build and start production server    |
| `make test`  | Run unit tests (Jest)                |
| `make lint`  | Run ESLint                           |
| `make clean` | Remove build artifacts               |

## Battery Catalog

| Device       | Dimensions  | Energy  | Cost      |
| ------------ | ----------- | ------- | --------- |
| Megapack XL  | 40ft x 10ft | 4 MWh   | $120,000  |
| Megapack 2   | 30ft x 10ft | 3 MWh   | $80,000   |
| Megapack     | 30ft x 10ft | 2 MWh   | $50,000   |
| PowerPack    | 10ft x 10ft | 1 MWh   | $10,000   |
| Transformer  | 10ft x 10ft | -0.5 MWh | $10,000 |

> 1 transformer is required for every 2 batteries. Site layouts are constrained to 100ft max width.

## Deployment

The app is hosted on Vercel at [https://tesla-energy-service.vercel.app](https://tesla-energy-service.vercel.app).

To deploy after making changes:

```bash
npx vercel build --prod
npx vercel --prebuilt --prod
```

This builds locally and uploads the output to Vercel, avoiding remote build issues.

## Features

- Configure battery quantities with live cost/energy/land summaries
- Auto-generated 2D site layout with color-coded devices
- Session save/load that persists across cache clears (URL-encoded state)
- Responsive dark-themed UI
