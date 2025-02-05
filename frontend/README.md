# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


Mini Link Management Platform

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





