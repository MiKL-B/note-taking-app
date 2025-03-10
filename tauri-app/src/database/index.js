import DatabaseService from "./DatabaseService";
import NoteService from "./NoteService";
import StatusService from "./StatusService";

const databaseService = new DatabaseService();

export default async function initializeDatabase() {
	await databaseService.connectToDatabase();
	await createTables();
}

async function createTables() {
	await NoteService.createTableNote();
	await StatusService.createTableStatus();
}
