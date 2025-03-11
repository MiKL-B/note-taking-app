import DatabaseService from "./DatabaseService.js";
import NoteService from "./NoteService.js";
import StatusService from "./StatusService.js";

const databaseService = new DatabaseService();

export default async function initializeDatabase() {
	await databaseService.connectToDatabase();
	await createTables();
}

async function createTables() {
	await NoteService.createTableNote();
	await StatusService.createTableStatus();
}
