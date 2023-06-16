# friend-finder-backend
Backend of the MERN stack.

# Setup for local development.
1. Pull project's main branch.
2. Setup a mongodb cluster. Free tier should do. Copy the url it gives you for later.
3. Create a .env file at the top level. Same level as this README.md file.
4. Add a variable SERVER_PORT. SERVER_PORT can be any valid port. 5000 is default.
5. Add a variable MONGODB_URI. Paste the url from step 2 into the variables value.
6. Add a variable JWT_SECRET_TOKEN. Come up with a string of random characters for the value. 
6. run ```npm install```
7. run ```node server.js``` or ```npx nodemon server.js``` for hot reloads.

Your .env file should look like 
```
MONGODB_URI=mongodb+srv://mongodb.net/?retryWrites=true&w=majority #your real url. Not this fake url
SERVER_PORT=5000
JWT_SECRET_TOKEN=YOUR_SECRET_TOKEN
```
