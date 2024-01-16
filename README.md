# Edopla (MERN Stack)

* * *

## About Edopla

Welcome to Edopla, where your cravings become our mission! At Edopla, we take pride in
being more than just a food delivery platform; we are a community that connects local
vendors and customers, fostering a vibrant local economy.
<br />
<br />
Our platform serves as a bridge, linking local businesses directly to customers. By doing
so, we empower local vendors, offering them a larger share of the sale revenue compared to
our competitors. We believe in supporting the backbone of our communities, and Edopla is
dedicated to ensuring that local businesses thrive.
<br />
<br />
For our valued customers, Edopla goes beyond convenience; it's about affordability. We
charge a minimal service fee, allowing you to enjoy your favorite meals without breaking
the bank. Your satisfaction is at the heart of our mission, and we strive to make your
dining experience not only delicious but also accessible.
<br />
<br />
Join us on this journey as we revolutionize the way you discover and enjoy local flavors.
Order, pick up, and savor the taste of community with Edopla!

* * *

## Usage

- This application can be accessed at: [Edopla](https://edopla.onrender.com/)
- Suggested browser: Chrome or Firefox
- Suggested theme: Dark theme

### Prerequisites for Locally Running Edopla

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- .env files (provided on request)

### Running the application

1. Clone the repository
2. Navigate to the root directory of the repository 
3. Run `./edopla-script.sh` to execute the script
4. Enter `start` to run the application
5. Enter the ENV and DEBUG arguments
6. Open a browser and navigate to `localhost:3000`

*The frontend will be running on `localhost:3000`*
<br />
*The backend will be running on `localhost:5000`*

### Stopping the application

Given the application is running:
1. Navigate to the root directory of the repository
2. Run `./edopla-script.sh` to execute the script
3. Enter `stop` to stop the application

### Testing the backend

1. Run the application (as described above)
2. Enter the backend container by running `docker exec -it edopla-backend bash`
2. Run `npm test` to run all tests or `npm run {test filename}` to run the tests in a specific file

* * *

## Features

### Frontend

- #### `Material-UI Integration`: Material-UI components are used for a consistent and visually appealing design.

- #### `Animation`: React Spring is included for animation effects in the UI.

- #### `Intersection Observer`: React Intersection Observer is employed for handling elements visibility in the viewport.

- #### `Protected Routes`: React Router is used for protected routes, ensuring that only authenticated users can access certain pages.

- #### `Address Autocomplete`: Google Places API is used for address autocomplete, allowing users to easily enter their address.

- #### `OAuth Authentication`: Google & GitHub OAuth can be used for authentication, allowing users to sign in with third-party accounts.

### Backend

- #### `Authentication`: Bcrypt is included for password hashing

- #### `Session Management`: Express Session is used for managing user sessions.

- #### `Middleware`: CORS middleware is integrated, allowing cross-origin resource sharing.

- #### `Logging`: Morgan is be used for logging HTTP requests.

### Development and Testing

- #### `TypeScript`: Both frontend and backend are implemented using TypeScript

- #### `Linting`: ESLint is configured for linting code, ensuring code quality.

- #### `Testing`: Jest and Supertest are set up for automated testing of backend APIs.

### Build and Deployment

- #### `Webpack`: Webpack is configured for building the frontend application.

- #### `Scripting`: A bash script is included for running the application.

* * *

## Dependencies

| Frontend Dependency              | Version        | Backend Dependency               | Version    |
| -------------------------------- | -------------- | -------------------------------- | ---------- |
| @emotion/react                   | ^11.11.1       | @types/bcrypt                    | ^5.0.0     |
| @emotion/styled                  | ^11.11.0       | @types/connect-mongo             | ^3.1.3     |
| @mui/icons-material              | ^5.15.0        | @types/cors                      | ^2.8.17    |
| @mui/joy                         | ^5.0.0-beta.18 | @types/express                   | ^4.17.17   |
| @mui/system                      | ^5.15.3        | @types/express-session           | ^1.17.10   |
| @types/react                     | ^18.2.45       | @types/morgan                    | ^1.9.5     |
| @types/react-dom                 | ^18.2.18       | @types/supertest                 | ^2.0.16    |
| react                            | ^18.2.0        | @typescript-eslint/eslint-plugin | ^6.4.1     |
| react-dom                        | ^18.2.0        | @typescript-eslint/parser        | ^6.4.1     |
| react-intersection-observer      | ^9.5.3         | eslint                           | ^8.48.0    |
| react-router-dom                 | ^6.16.0        | jest                             | ^29.7.0    |
| react-scripts                    | 5.0.1          | nodemon                          | ^3.0.1     |
| react-spring                     | ^9.7.3         | ts-jest                          | ^29.1.1    |
| typescript                       | ^4.9.5         | typescript                       | ^5.2.2     |
| web-vitals                       | ^2.1.4         | bcrypt                           | ^5.1.1     |
| @react-google-maps/api           | ^2.19.2        | connect-mongo                    | ^5.1.0     |
| @react-oauth/google              | ^0.12.1        | cors                             | ^2.8.5     |
|                                  |                | express                          | ^4.18.2    |
|                                  |                | express-session                  | ^1.17.3    |
|                                  |                | mongoose                         | ^7.4.5     |
|                                  |                | morgan                           | ^1.10.0    |

* * *

## File structure

### `backend/` - Contains the backend application code

- #### `@types/` - Contains all the typescript definitions for the backend

- #### `src/` - Contains the source code for the backend

    - ##### `controllers/` - Contains callback functions code called by each route

    - ##### `errors/` - Contains custom error classes

    - ##### `middleware/` - Contains middleware functions that are called before each route

    - ##### `models/` - Contains code for all data models

    - ##### `routes/` - Contains HTTP to URL path associations for each unique url

    - ##### `tests/` - Contains all the Jest unit test code for the backend

    - ##### `utils/` - Contains utility functions used throughout the backend

    - ##### `app.ts` - Initializes the express backend application

    - ##### `server.ts` - Initializes the server for the backend

- #### `.eslintrc.json` - This is a configuration file for eslint linter

- #### `Dockerfile` - Commands for building a docker image for the backend

- #### `jest.config.js` - Configuration file for Jest testing framework

- #### `package.json` - Defines npm behaviors and packages for the backend

- #### `tsconfig.json` - Configuration settings for compiling TypeScript code in the backend

### `frontend/` - Contains the frontend application code

- #### `public/` - Contains static files of the frontend

- #### `src/` - Contains the source code for the frontend
    
    - ##### `components/` - Contains all the react components for the frontend
    
    - ##### `errors/` - Contains custom error classes and error handling code

    - ##### `images/` - Contains all the images used in the frontend

    - ##### `models/` - Contains code for all data models

    - ##### `navigation/` - Contains all the code for the navigation bar

    - ##### `network/` - Contains all the code for the network requests to the backend

    - ##### `pages/` - Contains all the code for the different pages of the frontend

    - ##### `routes/` - Contains all the code for the different routes of the application

    - ##### `styles/` - Contains all the styling files for the frontend

    - ##### `utils/` - Contains utility functions used throughout the frontend
    
    - ##### `App.tsx` - Initializes the react frontend application
    
    - ##### `index.tsx` - Renders the react app by rendering App.js

- #### `Dockerfile` - Commands for building a docker image for the frontend

- #### `package.json` - Defines npm behaviors and packages for the frontend


- #### `tsconfig.json` - Configuration settings for compiling TypeScript code in the frontend

- #### `webpack.config.ts` - Configuration settings for webpack

### `docker-compose.yml` - Defines configurations for the docker containers

### `edopla-script.sh` - Script to either run or stop the docker containers

### `README.md` - This file!

### `upcoming.md` - Details the upcoming features and changes to be made

* * *

## Contact the Developer

- <b>Gmail</b>: saad.bhatti.cs@gmail.com
- <b>Phone</b>: +1 (781) 692-9561
- [LinkedIn](https://www.linkedin.com/in/saad-bhatti/)
- [GitHub](https://github.com/saad-bhatti)
- [Devloper's website](https://saad-bhatti.github.io/)

* * *