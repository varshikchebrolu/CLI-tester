# Setup Assistant

An AI-powered setup assistant that reads technical documents (PDFs, DOCX, Google Docs) and automatically executes the setup steps described in them. Give it an installation guide or setup document, and it will parse the instructions, run the commands on your machine, handle errors with AI-suggested fixes, and produce a summary report.

## How It Works

1. **Document Ingestion** — Accepts a local file (PDF, DOCX, TXT, CSV) or a Google Drive/Docs URL
2. **AI Parsing** — Uses Google Gemini to interpret the document and extract numbered setup steps with shell commands
3. **Automated Execution** — Runs each command in a persistent shell session, streaming output in real-time
4. **Error Recovery** — If a command fails, the AI suggests a fix and retries automatically (up to 2 retries)
5. **Results Report** — Generates an HTML summary of all executed commands with statuses and outputs

## Architecture

```
├── setup_assistant/          # Python backend
│   ├── cli.py               # Typer CLI entry point
│   ├── core.py              # SetupAssistant class (AI + command execution)
│   └── helpers.py           # Google Drive integration, parsing utilities
├── setup-assistant-ui/       # React frontend (Vite + MUI)
│   └── src/components/      # Chat UI, file upload, streaming display
├── main.py                  # FastAPI server (SSE streaming endpoints)
└── pyproject.toml           # Python project config & dependencies
```

## Tech Stack

**Backend:**
- Python 3.10+
- FastAPI + SSE (Server-Sent Events) for real-time streaming
- Google Gemini 2.5 Pro (via `google-genai`)
- Google Drive API for remote document fetching
- Typer for CLI interface

**Frontend:**
- React 19 + TypeScript
- Material UI (MUI)
- Vite
- Axios + EventSource for SSE streaming

## Setup

### Prerequisites

- Python 3.10+
- Node.js 18+ (for the frontend)
- A Google Cloud project with Drive API enabled
- A Google Gemini API key

### Backend

```bash
# Clone the repo
git clone https://github.com/varshikchebrolu/CLI-tester.git
cd CLI-tester

# Create virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -e .

# Create .env file with your secrets
cat <<EOF > .env
GITHUB_TOKEN=your_github_pat_here
GOOGLE_API_KEY=your_gemini_api_key_here
EOF
```

### Frontend

```bash
cd setup-assistant-ui
yarn install
yarn dev
```

### Running the API Server

```bash
uvicorn main:app --reload --port 8000
```

## Usage

### CLI

```bash
# From a local file
setup-assistant --path ./guide.pdf

# From a Google Drive URL
setup-assistant --url "https://docs.google.com/document/d/FILE_ID/edit"
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/run?filePath=...` | Stream setup execution from a local file path |
| GET | `/run?fileUrl=...` | Stream setup execution from a Google Drive URL |
| POST | `/upload` | Upload a document file |
| GET | `/upload_stream?filename=...` | Stream execution for a previously uploaded file |

All streaming endpoints return Server-Sent Events (SSE) with event types:
- `initial` — AI's parsed interpretation of the document
- `command` — Command execution progress and output
- `command_error` — Failed command details
- `retry_suggestion` — AI-suggested fix for a failed command
- `done` — Execution complete

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GOOGLE_API_KEY` | Google Gemini API key for AI features |
| `GITHUB_TOKEN` | GitHub PAT for fetching credentials from a private repo |

## Supported Document Types

- PDF (`.pdf`)
- Word documents (`.docx`)
- Plain text (`.txt`)
- CSV (`.csv`)
- Google Docs (via URL)
- Google Drive files (via URL)

## Author

Varshik Chebrolu
