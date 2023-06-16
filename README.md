# SurrealDB Test
## Setting Up SurrealDB
### Follow the installation guide at https://surrealdb.com/docs/installation for your OS
After installing SurrealDB, start the server with:</br>
`surreal start --log trace --user root --pass root memory`

## Setting Up Backend
Open a new terminal</br>
Navigate to the root directory of the backend project</br>
Install backend dependencies</br>
`npm install`

## Running Backend
Make sure you are in the root directory of the backend project<br>
Start the backend server<br>
`npm run start`

## Setting Up Frontend
Open a new terminal</br>
Navigate to the frontend directory inside the project</br>
`cd frontend`
Install frontend dependencies<br>
`npm install`

## Running Frontend
Navigate to the frontend directory<br>
`cd frontend`
Start the frontend server<br>
`npm run start`

## Now, both backend and frontend servers should be running. 
You can use the web application in your browser to interact with the database through the backend API.

## Usage
With both the backend and frontend servers running, you can use the web application in your browser to interact with the database through the backend API. The application should allow you to register, login, create posts, like posts, and comment on posts.
