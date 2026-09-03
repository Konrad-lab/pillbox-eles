# Pillbox Health Finder - Agent Documentation

## Project Overview

Modern, premium, responsive website for Pillbox - a Hungarian health-focused vending machine network.

## Environment Setup

- Framework: TanStack Start with React
- Styling: Tailwind CSS
- Data Source: Google Sheets API
- Build: Vite
- Package Manager: Bun

## Build Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Data Integration

- Google Sheets API integration with service account credentials
- Data cached for 15 minutes on server
- Google Sheet ID stored in SHEET_ID_2 environment variable
- Google Sheet ID stored in SHEET_ID_3 environment variable 
- Google Sheet ID stored in SHEET_ID_4 environment variable 
- Credentials stored in GOOGLE_SERVICE_ACCOUNT_JSON environment variable

## Environment Variables

- GOOGLE_SERVICE_ACCOUNT_JSON - Service account credentials for Google Sheets API
- SHEET_ID_2 - Google Sheet ID for Kiskunfélegyháza machine data
- SHEET_ID_3 - Google Sheet ID for Budaörs machine data
- SHEET_ID_4 - Google Sheet ID for all of the items with descriptions

## Project Structure

- `/src/lib/sheets.server.ts` - Google Sheets API integration
- `/src/lib/pillboxSheet.server.ts` - Pillbox-specific data loading and caching
- `/src/data/machineSource.ts` - Data source management
- `/src/data/mockMachines.ts` - Mock machine data
- `/src/data/mockProducts.ts` - Mock product data
- `/src/data/types.ts` - TypeScript type definitions
- `/src/routes/` - TanStack Start routes
- `/src/components/` - React components

## Key Features

- Interactive map of Hungary with machine locations
- Machine detail pages with product listings
- Product categories instead of shelf numbering
- Real-time data from Google Sheets (15-minute cache)
- Mobile-first responsive design
- Glassmorphism and modern animations

## Machine Locations

- Kiskunfélegyháza: Ficsór József u. 1, 6100
- Budaörs: Hollósy Cukrászat

## Deployment

- Hosted on Vercel
- Environment variables configured in Vercel dashboard
