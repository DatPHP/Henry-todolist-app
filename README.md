# Henry Todo App

A modern Todo List application built with Next.js and TailwindCSS.

## Features

- **Full-stack Task Management**: Add, delete, and mark tasks as completed.
- **Calendar Integration**: Visualize your tasks on a responsive monthly calendar.
- **JWT Authentication**: Secure user registration and login system.
- **Improved Navigation**: Easy switching between login and registration pages.
- **Responsive UI**: Optimized for both desktop and mobile devices.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Frontend**: [React](https://reactjs.org/), [TailwindCSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: JWT via [jose](https://github.com/panva/jose)
- **Data Fetching**: [SWR](https://swr.vercel.app/)

## Live Demo

[https://henry-todolist-app.vercel.app](https://henry-todolist-app.vercel.app)

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DatPHP/Henry-todolist-app
   cd Henry-todolist-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add your database connection string:
   ```env
   DATABASE_URL="your_postgresql_url"
   JWT_SECRET="your_jwt_secret"
   ```

4. **Initialize Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
