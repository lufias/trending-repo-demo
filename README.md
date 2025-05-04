# Trending Repositories Demo

A modern React application showcasing trending GitHub repositories for past 10 days with advanced features and optimizations.

**Live Demo:** [https://zingy-tanuki-bc4883.netlify.app/](https://zingy-tanuki-bc4883.netlify.app/)

## 🚀 Core Technologies

- **Vite** - Next-generation frontend build tooling for blazing fast development
- **React** - A JavaScript library for building user interfaces
- **TypeScript** - Type-safe development experience
- **Redux** - Predictable state manager for JavaScript apps
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **SASS** - Professional-grade CSS extension language
- **Font Awesome** - Comprehensive icon library for modern web applications
- **Vitest** - Testing framework
- **ESLint** - Code quality and style enforcement

## ✨ Key Features

### Performance Optimizations

- **Virtual Scrolling** - Efficiently render large lists of repositories
- **Lazy Loading** - Code splitting and dynamic imports for faster initial load
- **Rate Limit Handling** - Smart handling of API rate limits with fallback strategies

### Architecture & Structure

- **Master Layout** - Consistent application layout with reusable components
- **Routing** - Client-side routing with React Router
- **Pagination** - Efficient data pagination for better user experience
- **State Management** - Centralized state management using Redux for predictable data flow

## 🛠️ Getting Started

1. Clone the repository

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Run tests:

   ```bash
   npm run test
   ```

## 📦 Project Structure

```
src/
├── assets/         # Static assets and images
├── components/     # Reusable UI components
│   ├── Trending/  # Trending repositories specific components
│   ├── Layout.tsx # Master layout component
│   └── Toast.tsx  # Notification component
├── config/        # Configuration files
├── store/         # State management
├── test/          # Test files
├── views/         # Main application views
│   ├── Trending.tsx
│   └── Settings.tsx
├── App.tsx        # Root component
├── App.scss       # Global styles
├── fontawesome.ts # Font Awesome configuration
├── index.scss     # Entry point styles
└── main.tsx       # Application entry point
```

## 📝 License

MIT