# AI Development Rules

This document outlines the technology stack and development guidelines for this application. Following these rules ensures consistency, maintainability, and simplicity.

## Tech Stack

This is a modern web application built with the following technologies:

-   **Framework:** React (v19) with Vite for a fast development experience.
-   **Language:** TypeScript for type safety and improved developer experience.
-   **Styling:** Tailwind CSS is used exclusively for all styling. All styles are applied via utility classes defined in the `index.html` script tag.
-   **Icons:** `lucide-react` is the designated icon library for all vector icons.
-   **State Management:** Local component state is managed with React Hooks (`useState`, `useEffect`). There is no global state management library.
-   **Data Persistence:** User progress and data are persisted in the browser's `localStorage`.
-   **Build Tool:** Vite handles the development server, bundling, and build process.
-   **Image Generation:** The app dynamically generates images using the Pollinations.ai API.

## Development Rules & Library Usage

1.  **Styling:**
    -   **ONLY** use Tailwind CSS for styling. Do not add custom CSS files or other styling libraries (like Styled Components, Emotion, etc.).
    -   Leverage the existing `tailwind.config` object in `index.html` for any custom theme extensions.

2.  **Components:**
    -   Create new components in the `src/components/` directory.
    -   Keep components small, focused, and reusable. Each component must have its own file.
    -   Use functional components with React Hooks.

3.  **Icons:**
    -   All icons **MUST** come from the `lucide-react` package. Do not add other icon libraries or use SVGs directly.

4.  **State Management:**
    -   For local state, use `useState` and `useReducer`.
    -   For cross-component state, use prop drilling for simple cases or React's Context API for more complex scenarios.
    -   Do **not** add external state management libraries like Redux, Zustand, or MobX.

5.  **Dependencies:**
    -   Before adding a new npm package, evaluate if the required functionality can be achieved with the existing dependencies or native browser APIs.
    -   Keep the `package.json` clean and lean.

6.  **Code Style:**
    -   Follow existing code patterns and formatting.
    -   Write clear, readable, and self-documenting code. Use TypeScript to define clear types and interfaces, storing them in `types.ts`.