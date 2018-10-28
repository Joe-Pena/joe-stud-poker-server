# Stud Poker MongoDB API

This is the API used in conjuction with the Stud Poker Client.

https://stud-poker-server.herokuapp.com/

# Endpoints

*/api/users

  GET: Making a GET request to /api/users will return the number of users in the site, <b>NOT</b> the user information. An active JWT bearer token is required to access.

  POST: Make a POST request to create a new user. In the JSON body, the following information is required:

    "username": "YOUR_USERNAME",
    "email": "YOUR_EMAIL",
    "password": "YOUR_PASSWORD"

  Once the password is received, it is salted, hashed, and stored securely in the database.

*/api/users/:id

  PUT: Update user information by making a PUT request. A valid JWT bearer token is required aswell as a valid user id in the request parameters. The JSON body can have the following properties:

    "username": "UPDATE_USERNAME",
    "email": "UPDATE_EMAIL"

  DELETE: Delete your own account by sending a DELETE request to the /api/users/:id, where your user id is the in the request parameters. The id in the parameter MUST match your own account's id.
