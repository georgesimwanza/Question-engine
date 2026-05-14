# 📋 Engine Forms

A Google Forms-inspired web application built with Next.js 16, MongoDB, and NextAuth.js. Users can create custom forms, share them via link, collect responses, and export results to Excel.

---

## ✨ Features

- **Authentication** — Register and login with username/password via NextAuth.js (JWT sessions)
- **Form Builder** — Create forms with multiple question types: short answer, paragraph, multiple choice, checkboxes, dropdown, date, time, and linear scale
- **Form Sharing** — Share a public link for others to fill out your form
- **Response Collection** — Responses are saved with respondent name, email, and timestamp
- **Excel Export** — Download all responses as a `.xlsx` file directly in the browser
- **Route Protection** — All pages and API routes are protected via middleware; unauthenticated users are redirected to login

---

## 🗂️ Project Structure

```
src/
├── middleware.ts                  # Route protection (NextAuth JWT)
├── app/
│   ├── layout.tsx                 # Root layout with SessionProvider
│   ├── page.tsx                   # Root page — redirects based on session
│   ├── providers.tsx              # Client-side SessionProvider wrapper
│   ├── AuthPage/
│   │   └── page.tsx               # Login & Register page
│   ├── landing/
│   │   └── page.tsx               # Dashboard / landing page
│   ├── forms/
│   │   └── page.tsx               # Form builder
│   ├── Fill_out/
│   │   └── [formId]/
│   │       └── page.tsx           # Public form fill-out page
│   ├── responses/
│   │   └── [formId]/
│   │       └── page.tsx           # View responses + download Excel
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   │   └── route.ts           # NextAuth handler
│   │   ├── register/
│   │   │   └── route.ts           # User registration
│   │   ├── forms/
│   │   │   ├── route.ts           # GET all forms / POST create form
│   │   │   └── [formId]/
│   │   │       └── route.ts       # GET form by ID
│   │   └── responses/
│   │       ├── route.ts           # POST submit response
│   │       └── [formId]/
│   │           ├── route.ts       # GET responses for a form
│   │           └── export/
│   │               └── route.ts   # GET export responses as Excel
│   └── lib/
│       ├── authOptions.ts         # NextAuth configuration
│       ├── connect.ts             # MongoDB connection
│       └── requireAuth.ts         # Reusable auth guard for API routes
├── models/
│   ├── User.ts                    # User mongoose model
│   ├── Form.ts                    # Form mongoose model
│   └── Responce.ts                # Response mongoose model
└── types/
    └── next-auth.d.ts             # NextAuth type extensions
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <https://github.com/georgesimwanza/Question-engine>
cd my-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root of `my-app/`:

```dotenv
MONGODB_URL=mongodb://127.0.0.1:27017/Engine
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000
```

To generate a secure `NEXTAUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Authentication

- Built with **NextAuth.js** using the Credentials provider
- Sessions are stored as **JWT tokens**
- All routes except `/AuthPage`, `/api/auth`, and `/api/register` require authentication
- Middleware at `src/middleware.ts` handles route protection

---

## 📝 Question Types

| Type | Description |
|---|---|
| Short answer | Single line text input |
| Paragraph | Multi-line text input |
| Multiple choice | Single selection radio buttons |
| Checkboxes | Multiple selection checkboxes |
| Dropdown | Select from a dropdown list |
| Date | Date picker |
| Time | Time picker |
| Linear scale | 1–5 numeric scale |

---

## 📊 Responses & Export

- Each response is saved with the respondent's **name**, **email**, and **user ID**
- View all responses at `/responses/[formId]`
- Download all responses as an Excel file via the **Download Excel** button
- Export is powered by **ExcelJS** (no vulnerable dependencies)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | Full-stack React framework |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database |
| NextAuth.js | Authentication |
| bcryptjs | Password hashing |
| ExcelJS | Excel file generation |
| CSS Modules | Component styling |

---

