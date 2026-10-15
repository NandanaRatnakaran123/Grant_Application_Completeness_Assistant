# Grant Application Completeness Assistant

An AI-assisted web application that helps reviewers assess whether a grant application addresses the requirements described in grant guidelines. It highlights requirement-level evidence and supports human review of the assessment.

## Features

- **Document upload:** Upload guideline and application documents through the application.
- **AI-assisted assessment:** Uses the Google Gemini API to evaluate application content against grant requirements.
- **Requirement-level results:** Displays assessment results for individual requirements.
- **Evidence review:** Presents supporting text to help reviewers verify the assessment.
- **Human review controls:** Supports confirming, correcting, or rejecting assessment results.
- **Error handling:** Displays errors when document uploads or assessment requests fail.

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- Multer for handling document uploads
- Google Gemini API using the `@google/genai` SDK

## Project Structure

```text
grant-assistant/
├── client/                 # React frontend
│   ├── src/
│   ├── package.json
│   └── ...
├── Server/                 # Express backend
│   ├── routes/
│   ├── services/
│   ├── .env                # Local environment variables
│   ├── server.js
│   └── package.json
├── .gitignore
└── README.md
```

*The structure above is illustrative. Adjust the filenames if your actual project differs.*

## Prerequisites

- Node.js and npm
- A Google Gemini API key
- Git (optional)

## Getting Started

### 1. Clone or download the project

If the project is hosted in a Git repository:

```bash
git clone <YOUR_REPOSITORY_URL>
cd grant-assistant
```

Alternatively, open your downloaded project folder in your code editor.

### 2. Configure the backend

Open a terminal in the `Server` directory:

```bash
cd Server
npm install
```

Create a `.env` file inside `Server/` with the following variables:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash-lite
```

Replace `your_gemini_api_key` with your own API key. Never publish your real API key or commit the `.env` file.

Start the backend using the script defined in `Server/package.json`. For example, if your project has a `dev` script:

```bash
npm run dev
```

The backend should start on port `5000`, if configured as in this project.

### 3. Configure the frontend

Open a second terminal in the project root:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal, typically `http://localhost:5173`.

Keep both the frontend and backend running while testing the application.

## How to Use

1. Open the application in your browser.
2. Upload the grant guideline document.
3. Upload the grant application document.
4. Start the assessment.
5. Review the requirement-level results and supporting evidence.
6. Use the available review controls to confirm, correct, or reject results.
7. Independently verify important findings against the original documents.

## API Configuration

The frontend communicates with the backend through the configured API base URL:

```text
http://localhost:5000/api
```

The assessment endpoint is:

```text
POST /api/assessments
```

It accepts `guidelineText` and `applicationText` in the request body and returns the assessment result.

The document upload endpoint is:

```text
POST /api/documents/upload
```

The backend is responsible for communicating with the Gemini API. The Gemini API key must remain on the backend and must not be exposed in frontend code.

## Limitations and Responsible Use

- AI-generated assessments may be incomplete, incorrect, or misleading.
- Supporting evidence and requirement matches must be checked against the original documents.
- The application is an assistance tool, not a substitute for grant reviewers or official eligibility decisions.
- Results depend on document extraction quality, the supplied guidelines, and the AI model's output.
- The application should not be used to make final funding decisions without appropriate human review.

## Security

- Store API credentials in server-side environment variables.
- Exclude `.env` files from version control.
- Do not upload confidential grant documents to services unless their use is authorized and consistent with applicable privacy requirements.
- Validate uploaded files and enforce appropriate file size and type limits.

## Development Status

This project is intended as a prototype for AI-assisted grant application completeness review. Features and behavior may change during development.

## License

No license has been specified yet. Add an appropriate license before distributing the project publicly.
