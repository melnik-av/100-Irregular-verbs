# 📚 Irregular Verbs — Web App

Мобильное веб-приложение для изучения 100 неправильных английских глаголов.  
Работает в браузере, оптимизировано для телефона. Деплой на Vercel за 2 минуты.

## Три режима

| Режим | Описание |
|-------|----------|
| 🃏 Карточки | Переворачивайте карточки, отмечайте «знаю / не знаю» |
| ⚡ Тест | Выберите правильную форму (V2 или V3) из 4 вариантов |
| ✏️ Письмо | Введите V2 и V3 вручную |

---

## 🚀 Деплой на Vercel

### Шаг 1 — Загрузить на GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/ВАШ_АККАУНТ/irregular-verbs.git
git push -u origin main
```

### Шаг 2 — Подключить Vercel

1. Зайдите на [vercel.com](https://vercel.com) → **Add New Project**
2. Выберите ваш репозиторий `irregular-verbs`
3. Настройки оставьте как есть (Vercel сам определит Vite)
4. Нажмите **Deploy**

Через ~30 секунд приложение будет доступно по ссылке вида `irregular-verbs.vercel.app`

---

## 💻 Локальный запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:5173](http://localhost:5173)

---

## Структура

```
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx          # все экраны
    └── data/
        └── verbs.js     # 100 глаголов
```
