# DemoVerse - B2B SaaS Discovery Marketplace

DemoVerse is a premium B2B SaaS Discovery Marketplace built with Next.js. Users can explore software categories, compare platform specs side-by-side, check ratings, request or view demo videos, and chat with a Google Gemini-powered AI Matchmaker chatbot.

## Tech Stack

* **Frontend/Backend**: Next.js 14 (App Router)
* **Database**: SQLite with Prisma ORM
* **Auth**: NextAuth.js v5 (Credentials provider)
* **AI Engine**: Google Gemini API (`gemini-2.5-flash`)
* **Styling**: Tailwind CSS & Lucide Icons

---

## Getting Started

### 1. Environment Setup

Create or configure the `.env` file in the root directory:

```env
DATABASE_URL="file:./demoverse.db"
NEXTAUTH_SECRET="e9a263d91cfcb7ef910075d9bbd1f977c050dcfb6f9a0c4f8ab91bf41de03e67"
AUTH_SECRET="e9a263d91cfcb7ef910075d9bbd1f977c050dcfb6f9a0c4f8ab91bf41de03e67"
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Generate Prisma Client

To compile the database client mappings, run:

```bash
npx prisma generate
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Database Management & Access

This project uses an local SQLite database stored at `prisma/demoverse.db`. You can access and manage this database in a few different ways:

### 1. Prisma Studio (GUI)
The easiest way to view, search, and edit database records is using **Prisma Studio**, an interactive database browser.

Run the following command in your terminal:
```bash
npm run db:studio
# or
npx prisma studio
```
This will automatically launch the interface at [http://localhost:5555](http://localhost:5555).

### 2. Database Seeds & Resets
* **Reseed the Database**: If you need to populate default dummy data (users, SaaS platforms, features, reviews), run:
  ```bash
  npm run seed
  ```
* **Reset Database**: To wipe the database clean, rebuild the tables, and seed it fresh:
  ```bash
  npm run db:reset
  ```

### 3. Standard SQLite Viewer
Since the database is a standard SQLite file, you can also open it in visual tools like:
* [DB Browser for SQLite](https://sqlitebrowser.org/)
* SQLite extensions inside your IDE
