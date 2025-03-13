import Database from "@tauri-apps/plugin-sql";
import { join, appLocalDataDir } from "@tauri-apps/api/path";

const fileName = "database.db";

export default class DatabaseService {
	constructor() {
		this.db = null;
	}
	// -------------------------------------------------------------------------
	async connectToDatabase() {
		try {
			const appPath = await appLocalDataDir();
			const folderPath = await join(appPath, fileName);
			this.db = await Database.load("sqlite:" + folderPath);
		} catch (error) {
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	async executeQuery(query, params) {
		try {
			if (!this.db) {
				await this.connectToDatabase();
			}
			return await this.db.execute(query, params);
		} catch (error) {
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	async selectQuery(query, params) {
		try {
			if (!this.db) {
				await this.connectToDatabase();
			}
			return await this.db.select(query, params);
		} catch (error) {
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	// async showTables(table) {
	//   const query = `
	//     pragma table_info(${table});`;
	//   const rows = await this.db.select(query);
	//   console.log("Table", table, rows);
	// }
}
