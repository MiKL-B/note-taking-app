import DatabaseService from "./DatabaseService.js";

class StatusService {
	constructor() {
		this.dbService = new DatabaseService();
	}
	async createTableStatus() {
		let sql = `
      CREATE TABLE IF NOT EXISTS Status(
      status_ID INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT);`;
		await this.dbService.executeQuery(sql);
	}
	// -------------------------------------------------------------------------
	async createStatus() {
		try {
			const [rows] = await this.dbService.selectQuery(
				"SELECT COUNT(*) AS count FROM Status",
			);
			if (rows.count > 0) {
				return;
			}
			const query = `
        INSERT INTO Status (name)
        VALUES
        ("todo"),
        ("inprogress"),
        ("finished"),
        ("archived");
      `;
			await this.dbService.executeQuery(query);
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	async getStatus() {
		try {
			const result = await this.dbService.selectQuery("SELECT * FROM Status;");
			console.log("getStatus()", result);
			return result;
		} catch (error) {
			console.error("Error fetching data:", error);
			throw error;
		}
	}
	// -------------------------------------------------------------------------
}

export default new StatusService();
