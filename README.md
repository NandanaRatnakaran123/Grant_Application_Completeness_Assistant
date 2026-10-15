# Grant Application Completeness Assistant

An AI-assisted web application that helps grant reviewers evaluate whether an application addresses the requirements specified in grant guidelines. The application uses Google Gemini to generate requirement-level assessments and highlight supporting evidence for human review.

## Features

- **Document Upload:** Upload grant guidelines and application documents for assessment.
- **AI-Assisted Assessment:** Use Google Gemini to compare application content against grant requirements.
- **Requirement-Level Results:** Review findings for individual requirements.
- **Evidence Review:** Examine supporting evidence to help verify assessment results.
- **Human Review:** Review and validate AI-generated findings before making decisions.
- **Error Handling:** Receive feedback when document uploads or assessment requests fail.

## Technology Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS

**Backend**
- Node.js
- Express.js
- Multer
- Google Gemini API
- `@google/genai`

## Project Structure

```text
grant-assistant/
├── Client/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── Server/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- A Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/NandanaRatnakaran123/Grant_Application_Completeness_Assistant.git
cd Grant_Application_Completeness_Assistant
```

### 2. Configure the Backend

Open a terminal in the backend directory:

```bash
cd Server
npm install
```

Create a `.env` file inside `Server/` with the following configuration:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash-lite
```

Replace `your_gemini_api_key` with your own Gemini API key. Keep this key private and never commit your `.env` file to GitHub.

Start the backend using the development script configured in `Server/package.json`:

```bash
npm run dev
```

The backend is configured to run on port `5000` in the local development environment.

### 3. Configure the Frontend

Open a second terminal in the project root:

```bash
cd Client
npm install
npm run dev
```

Open the local URL displayed in the terminal by Vite.

Keep the backend running while using the frontend.

## How to Use

1. Open the application in your browser.
2. Upload the grant guideline document.
3. Upload the grant application document.
4. Run the assessment.
5. Review the requirement-level findings and supporting evidence.
6. Verify the findings against the original documents before relying on the results.

## API Endpoints

The backend exposes the following API endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/documents/upload` | Upload a document for processing |
| POST | `/api/assessments` | Request an assessment |

The frontend communicates with the backend through the configured API base URL. In local development, this is:

```text
http://localhost:5000/api
```

The Gemini API key is used by the backend and must not be exposed in frontend code.

## Project Status

This project is a prototype demonstrating how AI can assist with grant application completeness review while keeping human verification part of the process.

## Notes

- AI-generated assessments should be verified against the original documents.
- The Gemini API key is configured through server-side environment variables and must not be committed to version control.