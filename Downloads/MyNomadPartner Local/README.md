# MyNomad - AI-Powered Travel Management Platform

## Local Development Setup

### Prerequisites
- Node.js (v20 or later)
- PostgreSQL (v15 or later)
- Google API Key for Gemini AI

### Environment Variables
Create a `.env` file in the root directory with the following variables:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/mynomad
PGHOST=localhost
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=mynomad

# Google API
GOOGLE_API_KEY=your_google_api_key
```

### Database Setup
1. Create a PostgreSQL database:
```bash
createdb mynomad
```

2. Push the database schema:
```bash
npm run db:push
```

### Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd mynomad
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Google Cloud Deployment

### Prerequisites
1. Install Google Cloud CLI
2. Initialize Google Cloud project:
```bash
gcloud init
```

### Deployment Steps
1. Set up environment variables in Google Cloud:
```bash
gcloud secrets create mynomad-secrets --data-file=.env
```

2. Deploy to Cloud Run:
```bash
gcloud run deploy mynomad \
  --source . \
  --platform managed \
  --region your-preferred-region \
  --allow-unauthenticated \
  --set-secrets="/app/.env=mynomad-secrets:latest"
```

3. Set up Cloud SQL (PostgreSQL):
- Create a PostgreSQL instance in Google Cloud SQL
- Update the `DATABASE_URL` in your secrets to point to your Cloud SQL instance
- Enable the Cloud SQL Admin API
- Add the Cloud SQL instance connection to your Cloud Run service

### Additional Configuration
- Set up a custom domain (optional)
- Configure SSL certificates
- Set up monitoring and logging

## Features
- AI-powered travel companion using Google's Gemini AI
- Smart packing list generator
- Travel journal with AI memory categorization
- Language translation and local customs guide
- Personalized travel recommendations
- Real-time collaboration features

## Support
For any issues or questions, please open an issue in the repository.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
