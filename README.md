# 🌟 NovaSupport AI — Modern Full-Stack AI Customer Support Agent

[![React](https://img.shields.io/badge/Frontend-React%2019-61dafb?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?logo=node.js)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2F%20Mongoose-47a248?logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A modern, full-stack, enterprise-grade **AI-Powered Customer Support Platform** with an intelligent knowledge base retrieval engine, automated deflection, human agent escalation queue, admin analytics dashboard, and dark/light modes.

---

## 📸 Key Features

### 1. 🤖 Premium Customer Chat Interface
- **Knowledge Base RAG Retrieval**: Answers customer questions accurately using verified documentation (Shipping, Returns, Orders, Billing, Account Security, Troubleshooting).
- **Confidence Scoring & Citations**: Displays exact confidence levels (`Knowledge Base Verified`) with expandable reference drawer for full transparency.
- **Micro-Interactions & Rich Formatting**: Markdown responses (bolding, lists, code), typing indicators, animated online status pills, and suggested prompt chips.
- **Message Feedback**: Customer thumbs-up (👍) and thumbs-down (👎) reactions track article effectiveness and automatically offer human handoff on low satisfaction.
- **CSAT Rating & Confetti**: Interactive 5-star satisfaction rating widget with celebratory particle animations (`canvas-confetti`).

### 2. 🛡️ Human Escalation & Live Agent Handoff
- **Intelligent Trigger Detection**: Automatically detects customer frustration, negative sentiment, legal keywords, repeated unhelpful feedback, or low confidence to suggest and initiate human handoff.
- **Direct Manual Escalation**: Customers can click *"Talk to Human"* at any point to request live assistance.
- **Live Ticket Lifecycle**: Generates unique tracking tickets (e.g., `#TICK-902515`), assigns priority levels (`Urgent`, `High`, `Medium`), and routes into the admin queue.
- **Real-Time Polling & Agent Reply**: When an admin/agent responds in the dashboard, their message instantly appears in the customer's chat with a distinct **Human Agent** badge.

### 3. 📊 Executive Admin Dashboard
- **Analytics Overview**: Live metrics tracking Total Conversations, Automated Deflection Rate (~88%), Open Escalation Tickets, Average CSAT (4.8/5.0), and Knowledge Base Category Distribution.
- **Live Escalations Queue**: Filterable and searchable ticket management table with priority tags, status switcher, agent claim action, live transcript viewer, customer direct reply form, and resolution notes.
- **Knowledge Base (FAQ) Manager**: Complete CRUD interface for creating, editing, categorizing, tagging, and deleting support articles with helpfulness counters.
- **AI Sandbox & Semantic Tester**: Live evaluation playground to test test queries against the knowledge base, viewing match percentages and retrieved ranking.
- **System Settings**: Switch between **Google Gemini**, **OpenAI GPT-4o Mini**, and **Smart Local AI**, configure API keys, adjust the semantic confidence threshold slider, and customize system persona prompts.

### 4. 🌓 Dark & Light Modes
- Curated color palettes with glassmorphism, glowing accents, Inter and Outfit typography, and persistent user preference in `localStorage`.

---

## 🏗️ Architecture

```
ai-customer-support/
├── backend/
│   ├── src/
│   │   ├── config/             # Environment & resilient MongoDB connection
│   │   ├── models/             # Mongoose schemas: Conversation, Message, Faq, Ticket, Setting
│   │   ├── services/           # KnowledgeBaseService (NLP), EscalationService, LLMService, AnalyticsService
│   │   ├── controllers/        # Chat, FAQ, Ticket, Analytics, Settings controllers
│   │   ├── routes/             # RESTful API route definitions
│   │   ├── data/               # Rich seed database (10+ realistic FAQs and demo tickets)
│   │   └── server.js           # Express app bootstrap with graceful startup
│   ├── tests/                  # Automated integration tests (node:test)
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/           # ChatWindow, ChatMessage, ChatInput, QuickPrompts, EscalationModal, FeedbackModal
│   │   │   ├── admin/          # AdminLayout, DashboardOverview, EscalationQueue, FaqManager, BotSandbox, SettingsModal
│   │   │   └── common/         # ThemeToggle
│   │   ├── context/            # ThemeContext (dark/light mode)
│   │   ├── services/           # API client (fetch)
│   │   ├── styles/             # Curated design system in index.css
│   │   ├── App.jsx             # Root layout with chat/admin toggle
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── index.html
│   └── package.json
└── README.md
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or later (`node -v`)
- **npm**: v9.0.0 or later
- **MongoDB**: Local MongoDB daemon or MongoDB Atlas URI (Note: The backend also has automatic zero-dependency in-memory fallback support!).

### 1. Clone & Install Dependencies

```bash
# In the project directory:
cd ai-customer-support

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in `ai-customer-support/backend/.env`:

```env
PORT=5000

# MongoDB URI (Atlas or local)
MONGODB_URI=mongodb://127.0.0.1:27017/ai_customer_support
USE_IN_MEMORY_DB=false

# Active LLM Provider: 'mock' (default), 'gemini', or 'openai'
LLM_PROVIDER=mock

# Google Gemini API (Optional)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# OpenAI API (Optional)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# Semantic Confidence Threshold
CONFIDENCE_THRESHOLD=0.65
```

> 💡 **Zero Config Required**: If no `GEMINI_API_KEY` or `OPENAI_API_KEY` is provided, NovaSupport runs seamlessly using its built-in **Smart Local AI Engine**, ensuring the platform works immediately out-of-the-box!

### 3. Run the Backend & Frontend

Open two terminal windows:

**Terminal 1 (Backend Server):**
```bash
cd ai-customer-support/backend
npm start
# 🚀 Running on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd ai-customer-support/frontend
npm run dev
# 🌐 Running on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser!

---

## 🧪 Automated Testing

The backend includes a comprehensive test suite using Node's native test runner (`node:test`):

```bash
cd ai-customer-support/backend
npm test
```

### Test Coverage:
- ✔ Database connection and automated database seeding
- ✔ Knowledge Base lexical search, tokenization, and stopword filtering
- ✔ Sentiment analysis and human escalation keyword triggers
- ✔ Escalation ticket creation, agent assignment, and resolution lifecycle

---

## 📡 API Reference

### Chat & Sessions
- `POST /api/chat/session`: Initialize or resume customer conversation session.
- `POST /api/chat/message`: Send customer message; triggers knowledge retrieval and LLM response.
- `GET /api/chat/history/:sessionId`: Retrieve full message transcript for a session.
- `POST /api/chat/message/:messageId/rate`: Record helpful / unhelpful feedback.
- `POST /api/chat/escalate`: Manually trigger escalation to a human agent.
- `POST /api/chat/feedback`: Submit 1-5 star CSAT score with notes.
- `GET /api/chat/sessions`: List past customer conversations for sidebar history.

### Knowledge Base & FAQs
- `GET /api/faqs`: List FAQs (supports category and search filters).
- `POST /api/faqs`: Create a new verified knowledge article.
- `PUT /api/faqs/:id`: Update article question, answer, category, or keywords.
- `DELETE /api/faqs/:id`: Remove an article from knowledge base.
- `POST /api/faqs/test-match`: Test query similarity against the knowledge base.

### Human Escalations & Tickets
- `GET /api/tickets`: List escalation tickets (filter by `status` or `priority`).
- `GET /api/tickets/:id`: Get ticket details and full customer chat transcript.
- `POST /api/tickets/:id/assign`: Assign ticket to an active agent.
- `POST /api/tickets/:id/reply`: Human agent sends a live reply directly into the customer's chat.
- `POST /api/tickets/:id/resolve`: Mark ticket resolved with closing notes.

### Analytics & System Settings
- `GET /api/analytics/overview`: Overall metrics (conversations, deflection, CSAT, categories).
- `GET /api/settings`: Retrieve current LLM configuration and thresholds.
- `POST /api/settings`: Update active provider, API keys, and system prompts.

---

## 🛡️ Security & Reliability

- **API Keys**: Stored in environment variables and never logged or exposed to the client.
- **Fail-Safe LLM Fallback**: If an external LLM API experiences rate limits, network timeouts, or quota issues, the system smoothly falls back to local knowledge retrieval without dropping chats.
- **Database Resilience**: Supports local MongoDB, MongoDB Atlas connection strings, and automated in-memory MongoDB fallback.
