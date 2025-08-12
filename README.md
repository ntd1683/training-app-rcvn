# Training-App

A web application to manage users and products, designed for admin.

## Features

- User management (create, update, delete, list)
- Product management (create, update, delete, list)
- Role and permission management (update, delete, list)
- Role-based access (admin, editor)
- Responsive website interface

## Tech Stack

- **Frontend:** React.js (Vite)
- **Backend:** Laravel (RESTful API, Sail)

## Getting Started

### Prerequisites

- Node.js & npm
- PHP & Composer
- Docker (for Laravel Sail)
- MySQL or compatible database

### Installation

#### Backend (Laravel API with Sail)

```bash
cd training-app
cp .env.example .env
./vendor/bin/sail up -d
./vendor/bin/sail artisan key:generate
./vendor/bin/sail artisan migrate
```

#### Frontend (React.js with Vite)

```bash
cd frontend
npm install
npm run dev
```

## Usage

- Access the React app in your browser (usually at http://localhost:3000).
- Access the Laravel API (usually at http://localhost:80).
- Login as admin or editor to manage users and products.

## License

MIT