# US Open Pool Tracker

Mobile-first public tracker for the 2026 U.S. Open family pool and broader entrant field.

## What it does

- Pulls live U.S. Open scoring from ESPN event `401811952`
- Shows a Francoeur Family view and an Overall Pool view
- Includes first-round ESPN tee times and 1st/10th tee starts
- Applies the pool bench rules:
  - 4 starters and 2 bench golfers per entrant
  - 1 missed cut promotes bench 1
  - 2 missed cuts promotes bench 2
  - 3 missed cuts eliminates the entry after Friday
- Provides a read-only public interface suitable for Vercel deployment

## Spreadsheet import

When the Excel file is ready, run:

```sh
npm run import:pool -- "/path/to/pool.xlsx"
```

The importer accepts either combined columns:

- `Entrant`
- `Group` with `Family` or `Overall`
- `Starters` with four names separated by commas, semicolons, or line breaks
- `Bench` with two names separated by commas, semicolons, or line breaks

Or split columns:

- `Entrant`
- `Group`
- `Starter 1`, `Starter 2`, `Starter 3`, `Starter 4`
- `Bench 1`, `Bench 2`

The script writes the app data to `src/data/poolEntries.ts`.

## Local commands

```sh
npm run dev
npm run build
npm run preview
```
