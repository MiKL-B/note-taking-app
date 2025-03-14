import DatabaseService from "./DatabaseService.js";
import NoteService from "./NoteService.js";
import StatusService from "./StatusService.js";
import TagService from "./TagService.js";

const databaseService = new DatabaseService();

export default async function initializeDatabase() {
	await databaseService.connectToDatabase();
	// await dropTables();
	await createTables();
	await StatusService.createStatus();
}
async function dropTables() {
	await TagService.dropTableTag();
	await StatusService.dropTableStatus();
	await NoteService.dropTableNote();
}
async function createTables() {
	await NoteService.createTableNote();
	await StatusService.createTableStatus();
	await TagService.createTableTag();
}
