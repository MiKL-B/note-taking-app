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
	    console.log(error);
	    throw error;
	  }
	}
	// -------------------------------------------------------------------------
	async createTag(tagName) {
	  try {
	    const query = `
	      INSERT OR IGNORE INTO Tag (name, color)
	      VALUES (?,?);`;
	    let params = [tagName, "blue"];
	    await this.dbService.executeQuery(query,params);
	  } catch (error) {
	    console.log(error);
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
	    let params = [tag.name, tag.color, tag.tags_ID];
	    await this.dbService.executeQuery(query, params);
	  } catch (error) {
	    console.log(error);
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
	    console.log(error);
	    throw error;
	  }
	}
	// -------------------------------------------------------------------------
	async getTags() {
	  try {
	  	const query = `SELECT * FROM Tag;`;
	  	const result = await this.dbService.selectQuery(query)
	  	console.table("getTags()", result);
	  	return result;
	  } catch (error) {
	    console.error("Error fetching data:", error);
	    throw error;
	  }
	}
	// -------------------------------------------------------------------------
	
}
export default new TagService();