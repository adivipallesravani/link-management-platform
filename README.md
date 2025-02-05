









Mini Link Management Platform:-

Overview

This is a web application that allows users to create, manage, and analyze shortened URLs. The platform includes advanced link distribution, analytics, and account management features.

Live Demo:-link-management-platform-frontend.vercel.app

Credentials:-email:xyz@gmail.com,password:xyz123

Features

1. URL Shortening

Users can shorten long URLs.

Each shortened URL is unique.

Users can set expiration dates for links.

2. User Management

User registration and login using email and password.

Secure password hashing using encryption.

Account settings:

Update profile (name & email, logs out if email is changed).

Delete account (removes all associated links and data).

3. Dashboard

Users can view their list of shortened URLs with:

Original URL

Shortened URL

Click analytics

Options to edit or delete links.

4. Click Tracking

Tracks metadata for each click:

Timestamp

IP Address

User agent (browser & OS)

5. Link Management

Users can edit the original URL or alias.

Users can delete individual links.

6. Analytics

Detailed analytics including:

Device type (mobile, desktop, tablet)

Browser details

7. Responsive Design

The platform is fully responsive on desktop and mobile devices.

8. Pagination

Implemented pagination in links and analytics.

Tech Stack:-

Frontend:-

React

Vanilla CSS (modular)

Backend:-

Node.js with Express

MongoDB

Hosting

Vercel

API's to check in postman:-

1. Register User
URL: POST -http://localhost:5000/auth/register

2. Login User
URL: POST -http://localhost:5000/auth/login
now you will get the token.


3. Get User Details (Protected)
URL: GET -http://localhost:5000/user-details
Headers:
Authorization: Bearer <your_jwt_token>

4. Update User Details (Protected)
URL: PUT -http://localhost:5000/auth/update-user
Headers:
Authorization: Bearer <your_jwt_token>

5. Delete User Account (Protected)
URL: DELETE -http://localhost:5000/auth/delete-user
Headers:
Authorization: Bearer <your_jwt_token>

6. Create Short Link
URL: POST -http://localhost:5000/api/create
Headers:give original link,remarks and if require expiration
Authorization: Bearer <your_jwt_token>

7. Get All Links
URL: GET -http://localhost:5000/api/links
Headers:
Authorization: Bearer <your_jwt_token>

8. Update Link
URL: PUT -http://localhost:5000/links/<shortLinkId>
Headers:
Authorization: Bearer <your_jwt_token>

9. Delete Link
URL: DELETE- http://localhost:5000/api/links/:id (id should be link id)
Headers:
Authorization: Bearer <your_jwt_token>

10. pagination 
URL:GET-http://localhost:5000/api/links?page=1&limit=7
Headers:
Authorization: Bearer <your_jwt_token>

11. analytics 
URL:GET-http://localhost:5000/analytics
Headers:
Authorization: Bearer <your_jwt_token>

12. clicks summary
URL:GET-http://localhost:5000/analytics/analytics-summary
Headers:
Authorization: Bearer <your_jwt_token>

Setup Instructions

Prerequisites

Node.js installed

MongoDB instance (local/cloud)

Backend Setup

Clone the backend repository:

git clone <backend-repo-url>
cd backend

Install dependencies:

npm install

Create a .env file and add:

MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>

Start the backend server:

npm start

Frontend Setup

Clone the frontend repository:

git clone <frontend-repo-url>
cd frontend

Install dependencies:

npm install

Create a .env file and add:

REACT_APP_API_URL=<backend-url>

Start the frontend server:

npm start

Validations & Security

Uses JWT authentication.

Passwords are securely hashed before storing.

Proper error handling in backend and frontend.

Form validations implemented.

API responses include appropriate error messages.

Project Structure

/mini-link-management-platform
│── backend
│   ├── models
│   ├── routes
│   ├── controllers
│   ├── middleware
│   ├── utils
│   ├── .env
│   ├── server.js
│── frontend
│   ├── src
│   │   ├── components
│   │   ├── Auth
│   │   
│   │   ├── styles
│   ├── .env
│   ├── App.js





