# fullstack Article Platform 🚀

Полнофункциональная платформа для публикации и обсуждения статей

📌 О проекте
Это Fullstack-приложение, позволяющее:
Авторам – публиковать и редактировать статьи.
Пользователям – читать статьи и оставлять комментарии.
Администраторам – управлять пользователями (бан, роли) и контентом.
Проект активно разрабатывается и использует современные технологии.


🛠 Технологии
Backend
C# (ASP.NET Core)
PostgreSQL + миграции для удобного управления БД
REST API

Frontend
Next.js (SSR/SSG)
React + Redux (управление состоянием)
Адаптивный UI (Tailwind CSS)

⚙️ Основные функции
✅ Регистрация и авторизация (JWT)
✅ CRUD для статей и комментариев
✅ Ролевая модель (User, Author, Admin)
✅ Админ-панель (управление пользователями/контентом)
✅ Динамическая загрузка контента

🚀 Запуск проекта
bash
# Клонировать репозиторий
git clone https://github.com/ваш-username/fullstack-Article.git

# Backend (C#)
cd backend
dotnet restore
dotnet run

# Frontend (Next.js)
cd frontend
npm install
npm run dev
