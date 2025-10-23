
# Airbnb Clone - Full Stack Application

A modern, full-stack Airbnb clone built with React, TypeScript, Node.js, and Express. This project demonstrates a complete vacation rental platform with property listings, search functionality, user authentication, and booking management.

![Airbnb Clone](https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80)

## 🌟 Features

### Frontend
- **Modern UI/UX**: Airbnb-inspired design with Tailwind CSS
- **Advanced Search**: Location-based search with autocomplete
- **Date Range Picker**: Dual calendar for check-in/check-out selection
- **Guest Management**: Adults, children, infants, and pets selection
- **Category Filters**: Beachfront, Cabins, Villas, Apartments, Luxury, Budget, Mountain
- **Property Listings**: 28+ diverse properties across 8 US cities
- **Responsive Design**: Mobile-first approach with full responsiveness
- **Image Galleries**: High-quality property images from Unsplash

### Backend
- **RESTful API**: Clean API architecture with Express.js
- **Mock Data Mode**: Run without database setup using production-ready mock data
- **Authentication**: JWT-based user authentication
- **Filtering & Search**: Advanced query parameters for property filtering
- **CORS Enabled**: Secure cross-origin resource sharing

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Zustand** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **React DatePicker** - Date selection component
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** (optional) - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**


## 🔑 Key Features Explained

### Search Functionality

The search bar includes:
- **Location Search**: Autocomplete dropdown with 8 major US cities
- **Date Selection**: Range picker with 2-month view
- **Guest Selector**: Separate counters for adults, children, infants, and pets
- **Real-time Filtering**: Instant results without page reload

### Property Filters

Pre-defined category filters:
- **All**: Show all properties
- **Beachfront**: Properties with beach access
- **Cabins**: Mountain cabins and lodges
- **Villas**: Luxury villas
- **Apartments**: Urban apartments
- **Luxury**: Properties over $500/night
- **Budget**: Properties under $300/night
- **Mountain**: Properties with mountain views

### Mock Data

The application includes 38 diverse properties:
- 8 cities: Malibu, Brooklyn, Austin, Aspen, Miami Beach, San Francisco, Honolulu, Scottsdale
- Price range: $120 - $2200 per night
- Property types: Villa, Apartment, Cabin, House, Loft, Condo, Penthouse
- All properties have unique images and descriptions

## 🧪 API Endpoints

### Listings

```
GET    /api/listings              # Get all listings with filters
GET    /api/listings/:id          # Get single listing
POST   /api/listings              # Create listing (auth required)
PUT    /api/listings/:id          # Update listing (auth required)
DELETE /api/listings/:id          # Delete listing (auth required)
```

### Authentication

```
POST   /api/auth/register         # Register new user
POST   /api/auth/login            # Login user
GET    /api/auth/me               # Get current user (auth required)
```

### Bookings

```
GET    /api/bookings              # Get user bookings (auth required)
POST   /api/bookings              # Create booking (auth required)
GET    /api/bookings/:id          # Get booking details (auth required)
DELETE /api/bookings/:id          # Cancel booking (auth required)
```

### Query Parameters for Listings

```
?city=Malibu              # Filter by city
?propertyType=Villa       # Filter by property type
?minPrice=200            # Minimum price
?maxPrice=1000           # Maximum price
?guests=4                # Minimum guest capacity
?bedrooms=2              # Number of bedrooms
?bathrooms=2             # Number of bathrooms
?amenities=Pool,WiFi     # Required amenities
?page=1                  # Pagination
?limit=20                # Results per page
```








