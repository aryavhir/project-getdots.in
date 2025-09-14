# Overview

Getdots is a search interface application built with React, TypeScript, and Vite. The application provides a sleek, animated search experience that allows users to search through different types of content including people, files, and folders. The interface features a modern design with smooth animations, dynamic filtering, and a responsive layout that adapts based on search interactions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The application follows a component-based React architecture with TypeScript for type safety:

- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: CSS modules with custom animations and transitions
- **State Management**: React hooks (useState, useEffect, useRef) for local component state
- **UI Components**: Modular component structure with a main SearchInterface component
- **Icons**: React Icons library for consistent iconography

## Component Structure

- **App Component**: Root component that renders the main SearchInterface
- **SearchInterface**: Main search component handling user interactions, filtering, and results display
- **Global Styles**: CSS reset and base styling for consistent cross-browser appearance

## Search Functionality

The search system uses a JSON-based data structure with:
- **Static Data**: Mock data stored in searchData.json containing people, files, and folders
- **Real-time Filtering**: Client-side search filtering based on user input
- **Category Filtering**: Tab-based filtering for different content types (All, Files, People, etc.)
- **Advanced Filters**: Toggle-based filters for granular content control

## Animation System

The interface uses CSS transitions and transforms for smooth user experience:
- **Search Bar Animation**: Transforms from center position to upper position when expanded
- **Loading States**: Animated transitions during search operations
- **Result Display**: Smooth fade-in animations for search results

## TypeScript Configuration

Strict TypeScript setup with:
- **Modern ES Modules**: ESNext module system with bundler resolution
- **Strict Type Checking**: Full strict mode enabled for type safety
- **Build Optimization**: Separate configs for app and node environments

# External Dependencies

## Core Framework Dependencies
- **React 19.1.1**: Latest React version for component architecture
- **React DOM 19.1.1**: DOM rendering library
- **TypeScript 5.8.3**: Static type checking and modern JavaScript features

## Development Tools
- **Vite 7.1.2**: Fast build tool and development server
- **ESLint**: Code linting with TypeScript and React-specific rules
- **@vitejs/plugin-react**: Vite plugin for React support with fast refresh

## UI Libraries
- **React Icons 5.5.0**: Icon library for consistent UI elements

## Build Configuration
- **Vite Server**: Configured to run on port 5000 with host binding for network access
- **TypeScript Compiler**: Project references setup for optimal build performance
- **ESLint**: Modern flat config with React hooks and refresh plugins

## Asset Management
- **Static Assets**: Favicon and images served through Vite's asset pipeline
- **External Images**: Unsplash integration for user avatars and profile images

The application is designed as a frontend-only solution with mock data, making it suitable for demonstration purposes or as a foundation for integration with backend services.