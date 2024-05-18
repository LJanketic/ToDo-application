
# ToDo Application

This is the server repository of a simple Todo application server.
Postman collection can be found in project files.

## Note: This is the final version of the server which utilizes the sms-service
In further development, the service is removed along with its config and .env variables

## Secrets

```
PORT=8080= # Backend port 
FRONTEND_URI=http://localhost:3000 # Frontend uri to connect
SMS_FROM=  # SMS sender phone number
SMS_DESTINATION=  # SMS destination phone number
SMS_HOSTNAME=  # SMS service provider hostname
SMS_KEY=  # API key for sending SMS notifications

DB_HOST=localhost  # Database host
DB_USER=user  # Database username
DB_PASSWORD=testpwd123  # Database password
DB_NAME=todo_database  # Database name
DB_PORT=5432  # Database port
```

## Setup

- Clone the repository
- Run `npm install`
- Run `docker-compose up -d`
- Run `npm run start:dev`

Now your server is up and running, and the database is set up trough docker.

## API Routes
```
Get all todos
Route: GET /api/todos
Description: Retrieves all todos from the database. Takes optional parameter for sorting.
Response: Array of todo objects.
```
```
Get todo by ID
Route: GET /api/todos/:id
Description: Retrieves a todo by its ID.
Response: Todo object.
```
```
Create todo
Route: POST /api/todos
Description: Creates a new todo.
Request Body: Todo object.
Response: Created todo object.
```
```
Update todo
Route: PATCH /api/todos/:id
Description: Updates a todo by its ID.
Request Body: Todo object with updated fields.
Response: Updated todo object.
```
```
Delete todo
Route: DELETE /api/todos/:id
Description: Deletes a todo by its ID.
Response: Success message.
```
