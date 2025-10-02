# my.coco

Message Analytics & Personality Insights - A web application for analyzing CSV message logs and generating AI-powered personality profiles.

## Features

- **CSV Upload**: Drag-and-drop or click to upload message logs
- **Participant Analysis**: View comprehensive statistics for all participants
- **Personality Profiles**: AI-generated insights including:
  - Communication style and traits
  - Response patterns and engagement levels
  - Message frequency and timing patterns
  - Sentiment analysis
  - Interactive visualizations (hourly activity, message length distribution, activity trends)
- **Error Handling**: Robust validation for invalid files, missing fields, duplicates, and empty data
- **Responsive Design**: Mobile-ready with clean, professional UI
- **Modern Tech Stack**: React, TypeScript, Tailwind CSS, Recharts

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## CSV Format

The application expects CSV files with the following format:

```csv
timestamp,sender,message
2024-01-15T09:30:00,Alice,Hello everyone!
2024-01-15T09:35:00,Bob,Hi Alice!
```

- **timestamp**: ISO 8601 format (e.g., 2024-01-15T14:30:00)
- **sender**: Name of the message sender
- **message**: Content of the message

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (triadic color palette)
- **Charts**: Recharts
- **CSV Parsing**: PapaParse
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)

