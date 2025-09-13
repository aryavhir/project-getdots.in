# Overview

This is a React-based search interface application called "getdots.in" built with modern web technologies. The application provides a clean, intuitive search interface that allows users to search through various types of content including people, files, and folders. It features a tabbed interface with filtering capabilities and displays search results in an organized, visually appealing format.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Framework
The application is built using React 19.1.1 with TypeScript for type safety and better developer experience. The choice of React provides component-based architecture enabling reusable UI elements and efficient state management.

## Build Tool and Development
Vite is used as the build tool and development server, offering fast hot module replacement (HMR) and optimized builds. This choice provides faster development cycles compared to traditional bundlers like Webpack.

## Component Structure
The application follows a modular component architecture with:
- `App.tsx` as the main application wrapper
- `SearchInterface.tsx` as the primary search component
- Component-specific CSS files for styling isolation
- Centralized data management through JSON files

## State Management
Local component state is managed using React's built-in `useState` hooks. The application maintains state for:
- Search query input
- Active tab selection
- Filter toggle states
- Search results filtering

## Data Architecture
Search data is stored in a static JSON file (`searchData.json`) containing structured data for people, files, and folders. Each data type includes relevant metadata like avatars, status information, file locations, and timestamps.

## Styling Approach
The application uses vanilla CSS with component-specific stylesheets, providing full control over styling without additional dependencies. The design follows modern UI patterns with clean layouts, proper spacing, and responsive design principles.

## Code Quality Tools
ESLint is configured with TypeScript-specific rules and React hooks linting to maintain code quality and catch potential issues during development.

# External Dependencies

## Core Dependencies
- **React 19.1.1**: Frontend framework for building user interfaces
- **React DOM 19.1.1**: DOM rendering library for React
- **React Icons 5.5.0**: Icon library providing consistent iconography (IoSearch, IoSettings, Bs* icons)

## Development Dependencies
- **Vite 7.1.2**: Build tool and development server
- **TypeScript 5.8.3**: Static type checking and enhanced developer experience
- **ESLint**: Code linting and quality enforcement
- **@vitejs/plugin-react**: Vite plugin for React support

## External Assets
- **Unsplash Images**: Used for user avatars in the people data via direct URLs
- The application relies on external image hosting for profile pictures

## Browser APIs
- Standard DOM APIs for user interaction and component rendering
- No additional external services or APIs are currently integrated

The architecture is designed to be simple and maintainable while providing a solid foundation for future enhancements such as backend integration, real-time search, or additional data sources.