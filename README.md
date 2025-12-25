# Scan2Pay Merchant Portal

The Scan2Pay Merchant Portal is a React-based web application designed for merchants to manage their transactions, profile, and support requests. It specifically facilitates the instant selling of USDT/USDC for INR.

## Features

-   **Merchant Login:** Secure login via Google, GitHub, LinkedIn, Facebook, Email OTP, and Phone OTP.
-   **Dashboard:** Overview of merchant activities and real-time currency rates.
-   **Profile Management:** View and manage merchant profile details.
-   **Transaction History:** Track all deposit and withdrawal transactions.
-   **Support:** Access help and support resources.
-   **Responsive Design:** Fully responsive UI built with Tailwind CSS and Shadcn UI components.
-   **PWA Support:** Installable as a Progressive Web App.

## Tech Stack

-   **Frontend Framework:** [React](https://react.dev/) with [Vite](https://vitejs.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & [Redux Persist](https://github.com/rt2zz/redux-persist)
-   **Routing:** [React Router](https://reactrouter.com/)
-   **HTTP Client:** [Axios](https://axios-http.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Icons:** [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
-   **UI Components:** Custom components inspired by [Shadcn UI](https://ui.shadcn.com/) (Dialog, Button, Input, OTP Input, etc.)

## Prerequisites

Ensure you have the following installed on your machine:

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Setup Instructions

1.  **Clone the repository** (if applicable) or navigate to the project directory:

    ```bash
    cd merchant
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

## Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/merchant/` (or the port specified in your terminal).

## Building for Production

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

-   `src/components`: Reusable UI components (buttons, dialogs, inputs) and feature-specific components (login, common).
-   `src/hooks`: Custom React hooks (e.g., `useShowError`, `useShowSuccess`).
-   `src/screens`: Page components (Login, Dashboard, Profile, etc.).
-   `src/store`: Redux store configuration and slices.
-   `src/lib`: Utility functions (e.g., `cn` for class merging).
-   `public`: Static assets (images, icons).
