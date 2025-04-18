# ActiveLexicon

Приложение React Native Expo для изучения языков и расширения словарного запаса.

## Начало работы

### Предварительные требования

- Node.js (рекомендуется LTS версия)
- npm
- Expo CLI

### Установка

1. Клонирование репозитория
   ```bash
   git clone [адрес-репозитория]
   cd activelexicon
   ```

2. Установка зависимостей
   ```bash
   npm install
   ```

3. Запуск сервера разработки
   ```bash
   npx expo start
   ```

## Настройка окружения

Скопируйте файл `.env.example` в `.env` и настройте переменные окружения:

```bash
cp .env.example .env
```

Отредактируйте файл `.env` с вашей конфигурацией API.

## Структура проекта

```
activelexicon/
├── app/                   # Маршруты приложения Expo Router
│   ├── (tabs)/            # Экраны с вкладками
│   ├── _layout.tsx        # Корневой макет для навигации
│
├── assets/                # Статические ресурсы (изображения, шрифты)
│
├── components/            # Многоразовые UI компоненты
│
├── context/               # Провайдеры React Context
│   ├── AuthContext.tsx    # Контекст аутентификации
│   └── QueryContext.tsx   # Контекст React Query
│
├── constants/             # Константы приложения
│
├── hooks/                 # Пользовательские React хуки
│
├── services/              # API и сервисы данных
│
├── types/                 # Определения типов TypeScript
│
├── utils/                 # Служебные функции
│
├── .env                   # Переменные окружения (не в git)
├── .env.example           # Пример переменных окружения
├── app.json               # Конфигурация Expo
├── babel.config.js        # Конфигурация Babel
├── tsconfig.json          # Конфигурация TypeScript
└── package.json           # Зависимости и скрипты проекта
```

## Разработка

### Доступные скрипты

- `npm start`: Запуск сервера разработки Expo
- `npm run android`: Запуск приложения на Android
- `npm run ios`: Запуск приложения на iOS
- `npm run web`: Запуск приложения в браузере
- `npm run lint`: Запуск ESLint

## Технологии

- [React Native](https://reactnative.dev/) - Фреймворк для мобильной разработки
- [Expo](https://expo.dev/) - Инструментарий для React Native
- [TypeScript](https://www.typescriptlang.org/) - Типизированный JavaScript
- [React Query](https://tanstack.com/query) - Управление запросами и состоянием
- [Axios](https://axios-http.com/) - HTTP клиент