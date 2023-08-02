# ThirdHometask

⦁	Your task is to create a NodeJS application with TypeScript that will have few REST endpoints. No need to wire it with Frontend part that you did in task #2.

⦁	Endpoints functionality should reflect your work on the frontend side - users can add, edit and remove notes, archive and unarchive them.

⦁	As an option you can use ⦁	NestJS instead of NodeJS/Express with TypeScript.

List of endpoints should look like this:

Query type 	Endpoint	Action

POST	/notes	Create a note object.

DELETE	/notes/:id	Remove item.

PATCH	/notes/:id	Edit item.

GET	/notes/:id	Retrieve item.

GET	/notes	Get all notes.

GET	/notes/stats	Get aggregated data statistics. You don’t have to mock this data. You need to calculate it based on notes objects you have.
 

⦁	Store data in memory as a mocked object. Prepopulate it with 7 notes and use it by default as an initial state so that they are returned when you call an endpoint. You can use the same object structure as in 

the frontend using following columns: [“Name”, “Date”, “Category”, “Content”] and also additional columns if needed.

⦁	Use the ⦁	Postman application to check that your endpoints work correctly.

⦁	Add validation to each endpoint so that no one can add more properties or miss one. E.g. if you expect { name: <string>, age: <integer> }, there should be no way to send another shape of the object or its 

data type. You can use ⦁	Yup for that purpose.
