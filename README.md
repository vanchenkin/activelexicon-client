# ActiveLexicon

Мобильное приложение на React Native для расширения активного словарного запаса.

## Предварительные требования

- Node.js (рекомендуется LTS версия)
- npm
- Expo CLI

## Установка

```bash
git clone [адрес-репозитория]
cd activelexicon
npm install
npx expo start
```

## Настройка окружения

```bash
cp .env.example .env
```

Отредактируйте файл `.env` для настройки API.

## Структура проекта

```
activelexicon/
├── app/                   # Маршруты приложения Expo Router
│   ├── (tabs)/            # Экраны с вкладками
│   ├── _layout.tsx        # Корневой макет для навигации
├── assets/                # Статические ресурсы (изображения, шрифты)
├── components/            # Многоразовые UI компоненты
├── context/               # Провайдеры React Context
├── constants/             # Константы приложения
├── hooks/                 # Пользовательские React хуки
├── services/              # API и сервисы данных
├── types/                 # Определения типов TypeScript
├── utils/                 # Служебные функции
```

## Доступные скрипты

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