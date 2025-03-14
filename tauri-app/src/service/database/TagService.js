import DatabaseService from "./DatabaseService.js";
class TagService {
	constructor() {
		this.dbService = new DatabaseService();
	}
	async createTableTag() {
		try {
			const query = `
	      CREATE TABLE IF NOT EXISTS Tag(
	      tag_ID INTEGER PRIMARY KEY AUTOINCREMENT,
	      name TEXT UNIQUE,
	      color TEXT);`;
			await this.dbService.executeQuery(query);
		} catch (error) {
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	async dropTableTag() {
		try {
			await this.dbService.executeQuery("DROP TABLE IF EXISTS Tag");
			return {
				success: true,
				message: "Table Note dropped successfully.",
			};
		} catch (error) {
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	async createTag(name,color="blue") {
		try {
			const query = `
	      INSERT OR IGNORE INTO Tag (name, color)
	      VALUES (?,?);`;
			let params = [name, color];
			await this.dbService.executeQuery(query, params);
		} catch (error) {
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	async insertTag(tag) {
		try {
			const query = `
	      INSERT OR IGNORE INTO Tag (name, color)
	      VALUES (?,?);`;
			let params = [tag.name, tag.color];
			await this.dbService.executeQuery(query, params);
		} catch (error) {
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	async updateTag(tag) {
		try {
			const query = `
	      UPDATE Tag SET
	      name = $1,
	      color = $2
	      WHERE tag_ID = $3;`;
			let params = [tag.name, tag.color, tag.tag_ID];
			await this.dbService.executeQuery(query, params);
		} catch (error) {
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	async deleteTag(tag) {
		try {
			const query = `DELETE FROM Tag WHERE tag_ID = $1;`;
			let params = [tag.tag_ID];
			await this.dbService.executeQuery(query, params);
		} catch (error) {
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	async getTags() {
		try {
			const query = `SELECT * FROM Tag;`;
			const result = await this.dbService.selectQuery(query);
			return result;
		} catch (error) {
			throw error;
		}
	}
	// -------------------------------------------------------------------------
}
export default new TagService();
