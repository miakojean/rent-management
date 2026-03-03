How to make our request workflow. 

For the request we define CRUD (create, read, update, delete)

let's for the first one:

### post request.

- 1 We have to ensure that data is valid according our validator module
- 2 If data is valid we store the object in the database and we send a succes status
- 3 if data is not valid we send an error message and bad status request.