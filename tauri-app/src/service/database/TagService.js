import DatabaseService from "./DatabaseService.js";

class TagService {
	constructor() {
		this.dbService = new DatabaseService();
	}
	// async createTableTags() {
	//   try {
	//     const db = await this.connectToDatabase();
	//     const query = `
	//       CREATE TABLE IF NOT EXISTS Tags(
	//       tags_ID INTEGER PRIMARY KEY AUTOINCREMENT,
	//       name TEXT UNIQUE,
	//       color TEXT);`;
	//     await db.execute(query);
	//   } catch (error) {
	//     console.log(error);
	//     throw error;
	//   }
	// }
	// -------------------------------------------------------------------------
	// async createTag(tagName) {
	//   try {
	//     const db = await this.connectToDatabase();
	//     const query = `
	//       INSERT OR IGNORE INTO Tags (name, color)
	//       VALUES (?,?);`;
	//     let params = [tagName, "blue"];
	//     await db.execute(query, params);
	//   } catch (error) {
	//     console.log(error);
	//     throw error;
	//   }
	// }
	// -------------------------------------------------------------------------
	// async updateTag(tag) {
	//   try {
	//     const db = await this.connectToDatabase();
	//     const query = `
	//       UPDATE Tags SET
	//       name = $1,
	//       color = $2
	//       WHERE tags_ID = $3;`;
	//     let params = [tag.name, tag.color, tag.tags_ID];
	//     await db.execute(query, params);
	//   } catch (error) {
	//     console.log(error);
	//     throw error;
	//   }
	// }
	// -------------------------------------------------------------------------
	// async deleteTag(tag) {
	//   try {
	//     const db = await this.connectToDatabase();
	//     const query = `DELETE FROM Tags WHERE tags_ID = $1;`;
	//     let params = [tag.tags_ID];
	//     await db.execute(query, params);
	//   } catch (error) {
	//     console.log(error);
	//     throw error;
	//   }
	// }
	// -------------------------------------------------------------------------
	// async getTags() {
	//   try {
	//     const db = await this.connectToDatabase();
	//     const result = await db.select("SELECT * FROM Tags;");
	//     console.log("tags",result)
	//     return result;
	//   } catch (error) {
	//     console.error("Error fetching data:", error);
	//     throw error;
	//   }
	// }
	// -------------------------------------------------------------------------
	// async createTableNoteTags() {
	//   const db = await this.connectToDatabase();
	//   const query = `
	//     CREATE TABLE IF NOT EXISTS note_tags(
	//     note_ID,
	//     tags_ID,
	//     PRIMARY KEY (note_ID, tags_ID),
	//     FOREIGN KEY(note_ID) REFERENCES Note(note_ID) ON DELETE CASCADE,
	//     FOREIGN KEY(tags_ID) REFERENCES Tags(tags_ID) ON DELETE CASCADE);`;
	//   await db.execute(query);
	// }
	// -------------------------------------------------------------------------
	// async createTagNote(note,tag){
	//   try{
	//     const db = await this.connectToDatabase();
	//     const query = `
	//     INSERT INTO note_tags (note_ID,tags_ID)
	//     VALUES (?,?)
	//     ON CONFLICT(note_ID, tags_ID) DO NOTHING;`;
	//     let params = [note.note_ID,tag.tags_ID]
	//     await db.execute(query,params);
	//   }
	//   catch(error){
	//     console.log(error);
	//     throw error;
	//   }
	// }
	// -------------------------------------------------------------------------
	// async getNoteTags(){
	//    try {
	//     const db = await this.connectToDatabase();
	//     const query = `
	//       SELECT N.note_ID, T.name, T.color FROM note_tags as NT
	//       INNER JOIN Note as N ON (N.note_ID = NT.note_ID)
	//       INNER JOIN Tags as T ON (T.tags_ID = NT.tags_ID);
	//     ;`;

	//     const result = await db.select(query);
	//     console.log("note_tags",result)
	//     return result;
	//   } catch (error) {
	//     console.error("Error fetching data:", error);
	//     throw error;
	//   }
	// }
	// -------------------------------------------------------------------------
}
export default new TagService();