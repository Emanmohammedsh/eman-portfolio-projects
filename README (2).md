# Portfolio Projects

Three full-stack projects built to demonstrate practical software engineering skills — UI design, AI integration, authentication systems, and retrieval-augmented generation (RAG).

Built by **Eman** — Cybersecurity Engineering student, exploring full-stack development.

---

## 1. Smart Task Manager
`smart-task-manager.html`

A daily task list that doesn't just store what you type — it reads your tasks and reorders them by what actually matters today, with one click.

**The benefit:** Brings together a working UI, persistent state, and an AI integration layer that reasons about unstructured text and returns structured data the interface can render.

**Difficulty:** Medium

**Stack:** HTML · CSS · Vanilla JS · Claude API · Persistent storage · FLIP animation

**Try it:** open `smart-task-manager.html` in any browser.

---

## 2. Authentication System
`auth-system-demo.jsx` + `auth-system-firebase-integration/`

A complete sign in / sign up system with Google and Apple OAuth, password strength validation, and a secure forgot-password flow.

**The benefit:** Covers the full auth lifecycle — session state, OAuth, validation, and error handling — the same patterns used in production apps.

**Difficulty:** Medium

**Stack:** React · Tailwind · Firebase Authentication (Google, Apple, Email/Password)

**Two parts:**
- `auth-system-demo.jsx` — a polished, working UI with a mock backend (runs standalone, no setup needed to preview)
- `auth-system-firebase-integration/` — the real, production-ready Firebase wiring (`firebaseConfig.js`, `AuthContext.jsx`, `ProtectedRoute.jsx`) plus a setup guide in `FIREBASE-SETUP.md`

---

## 3. RAG Chatbot — Ask Your Documents
`rag-chatbot.html`

Upload a PDF or text file and ask it questions directly. The app finds the most relevant passages first, then asks an LLM to answer using only what's actually in the document — with the exact sources shown for every answer.

**The benefit:** Combines four skills in one project — document processing, retrieval over unstructured data, working with language models, and building a complete interface end-to-end.

**Difficulty:** Hard

**Stack:** PDF.js · custom chunking pipeline · TF-IDF + cosine similarity retrieval · Claude API

**Try it:** open `rag-chatbot.html` in any browser, upload a PDF or text file, and start asking questions.

---

## License
MIT — see `LICENSE`.
