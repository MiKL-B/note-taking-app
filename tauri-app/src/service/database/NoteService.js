import DatabaseService from "./DatabaseService.js";
class NoteService {
	constructor() {
		this.dbService = new DatabaseService();
	}
	async createTableNote() {
		try {
			const query = `
      CREATE TABLE IF NOT EXISTS Note(
      note_ID INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      timestamp TIMESTAMP,
      isSaved BOOL,
      status_ID INTEGER NOT NULL,
      content TEXT,
      pinned BOOL,
      important BOOL,
      selected BOOL,
      deleted BOOL,
	  tags TEXT,
      FOREIGN KEY(status_ID) REFERENCES Status(status_ID));`;
			await this.dbService.executeQuery(query);
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	async dropTableNote() {
		try {
			await this.dbService.executeQuery("DROP TABLE IF EXISTS Note;");
		} catch (error) {
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	async createNote(data) {
		let name = (data && data.name) || "";
		let content = (data && data.content) || "";
		let timestamp = (data && data.timestamp) || Date.now();
		let isSaved = (data && data.isSaved) || 1;
		let status_ID = (data && data.status_ID) || 1;
		let pinned = (data && data.pinned) || 0;
		let important = (data && data.important) || 0;
		let selected = (data && data.selected) || 0;
		let deleted = (data && data.deleted) || 0;
		let tags = (data && data.tags) || "";

		try {
			if (name === "") {
				const countQuery = "SELECT COUNT(*) AS count FROM Note";
				const countResult =
					await this.dbService.selectQuery(countQuery);
				const currentCount = countResult[0].count;
				name = `Note ${currentCount + 1}`;
			}

			const query = `
		INSERT INTO Note (name,timestamp,isSaved,status_ID,content,pinned,important,selected,deleted,tags)
		VALUES
		(?,?,?,?,?,?,?,?,?,?);`;

			let params = [
				name,
				timestamp,
				isSaved,
				status_ID,
				content,
				pinned,
				important,
				selected,
				deleted,
				tags,
			];
			await this.dbService.executeQuery(query, params);
		} catch (error) {
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	async duplicateNote(note) {
		try {
			const query = `
        INSERT INTO Note (name,timestamp,isSaved,status_ID,content,pinned,important,selected,deleted,tags)
        VALUES (?,?,?,?,?,?,?,?,?,?);`;
			let noteName = note.name + " - Copy";
			let selected = 0;
			let deleted = 0;
			let params = [
				noteName,
				Date.now(),
				note.isSaved,
				note.status_ID,
				note.content,
				note.pinned,
				note.important,
				selected,
				deleted,
				note.tags,
			];
			await this.dbService.executeQuery(query, params);
		} catch (error) {
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	async updateNote(note) {
		try {
			const query = `
        UPDATE Note SET
        name = $1,
        timestamp = $2,
        isSaved = $3,
        status_ID = $4,
        content = $5,
        pinned = $6,
        important = $7,
        selected = $8,
        deleted = $9,
		tags = $10
        WHERE note_ID = $11;`;

			let params = [
				note.name,
				note.timestamp,
				note.isSaved,
				note.status_ID,
				note.content,
				note.pinned,
				note.important,
				note.selected,
				note.deleted,
				note.tags,
				note.note_ID,
			];
			await this.dbService.executeQuery(query, params);
		} catch (error) {
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	async moveToTrash(note) {
		try {
			const query = "update Note SET deleted = 1 WHERE note_ID = $1;";
			let params = [note.note_ID];
			await this.dbService.executeQuery(query, params);
		} catch (error) {
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	async restoreNote(note) {
		try {
			const query = "update Note SET deleted = 0 WHERE note_ID = $1;";
			let params = [note.note_ID];
			await this.dbService.executeQuery(query, params);
		} catch (error) {
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	async deleteNotePermanent(note) {
		try {
			const query = "DELETE FROM Note WHERE note_ID = $1;";
			let params = [note.note_ID];
			await this.dbService.executeQuery(query, params);
		} catch (error) {
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	async unselectNotes() {
		try {
			const query = `UPDATE Note SET selected = 0 WHERE selected = 1;`;
			await this.dbService.executeQuery(query);
		} catch (error) {
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	async selectNote(note) {
		try {
			const query = `UPDATE Note SET selected = 1 WHERE note_ID = $1;`;
			let params = [note.note_ID];
			await this.dbService.executeQuery(query, params);
		} catch (error) {
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	async getNotes() {
		try {
			const query = "SELECT * FROM Note;";
			const result = await this.dbService.selectQuery(query);
			return result;
		} catch (error) {
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	async getLastNote() {
		try {
			const query = `SELECT * FROM Note ORDER BY note_ID DESC LIMIT 1;`;
			const result = await this.dbService.selectQuery(query);
			return result[0];
		} catch (error) {
			throw error;
		}
	}
	// -------------------------------------------------------------------------
}
export default new NoteService();
