import DatabaseService from "./DatabaseService.js";

class NoteTagService {
	constructor() {
		this.dbService = new DatabaseService();
	}
	// -------------------------------------------------------------------------
	async createTableNoteTag() {
		try {
			const query = `
	    CREATE TABLE IF NOT EXISTS note_tag(
	    note_ID,
	    tag_ID,
	    PRIMARY KEY (note_ID, tag_ID),
	    FOREIGN KEY(note_ID) REFERENCES Note(note_ID) ON DELETE CASCADE,
	    FOREIGN KEY(tag_ID) REFERENCES Tag(tag_ID) ON DELETE CASCADE);`;
			await this.dbService.executeQuery(query);
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	async createNoteTag(note, tag) {
		try {
			const query = `
	    INSERT INTO note_tag (note_ID,tag_ID)
	    VALUES (?,?)
	    ON CONFLICT(note_ID, tag_ID) DO NOTHING;`;
			let params = [note.note_ID, tag.tag_ID];
			await this.dbService.executeQuery(query, params);
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	async deleteNoteTag(note,tag) {
		try{
			const query = `DELETE FROM note_tag WHERE note_ID = $1 AND tag_ID = $2;`;
			let params = [note.note_ID,tag.tag_ID];
			await this.dbService.executeQuery(query,params)
		}
		catch(error){
			console.log(error);
			throw error;
		}
	}
	// -------------------------------------------------------------------------
	async getNoteTags() {
		try {
			const query = `
	      SELECT N.note_ID, T.tag_ID, T.name, T.color FROM note_tag as NT
	      INNER JOIN Note as N ON (N.note_ID = NT.note_ID)
	      INNER JOIN Tag as T ON (T.tag_ID = NT.tag_ID);`;
	
			const result = await this.dbService.selectQuery(query);
			console.table("getNoteTags()", result);
			return result;
		} catch (error) {
			console.error("Error fetching data:", error);
			throw error;
		}
	}
	// -------------------------------------------------------------------------
}

export default new NoteTagService();
