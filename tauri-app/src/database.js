import Database from "@tauri-apps/plugin-sql";
import { join, desktopDir } from "@tauri-apps/api/path";
const fileName = "database.db";
const desktopPath = await desktopDir();
const folderPath = await join(desktopPath, fileName);

class DatabaseService {
  constructor() {}
  async connectToDatabase() {
    try {
      return await Database.load("sqlite:" + folderPath);
    } catch (error) {
      console.error("Error connecting to database:", error);
      throw error;
    }
  }
  // -------------------------------------------------------------------------
  async initializeDatabase() {
    await this.createTables();
    await this.getStatus();
    // await this.resetDatabase()
  }
  // -------------------------------------------------------------------------
  async resetDatabase() {
    await this.dropTables();
    await this.createTables();
  }
  // -------------------------------------------------------------------------
  async createTables() {
    await this.createTableStatus();
    await this.createStatus();
    await this.showTables("Status");
    await this.createTableTags();
    await this.showTables("Tags");
    await this.createTableNote();
    await this.showTables("Note");
    await this.createTableNoteTags();
    await this.showTables("note_tags");
  }
  // -------------------------------------------------------------------------
  async dropTables() {
    const db = await this.connectToDatabase();

    await db.execute("DROP TABLE note_tags");
    await db.execute("DROP TABLE Note");
    await db.execute("DROP TABLE Tags");
    await db.execute("DROP TABLE Status");
  }
  // -------------------------------------------------------------------------
  async showTables(table) {
    const db = await this.connectToDatabase();
    const query = `
      pragma table_info(${table});`;
    const rows = await db.select(query);
    console.log("Table", table, rows);
  }
  // -------------------------------------------------------------------------
  async executeQuery(query, params) {
    try {
      const db = await this.connectToDatabase();
      return await db.execute(query, params);
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  }
  // -------------------------------------------------------------------------
  async createTableNote() {
    const db = await this.connectToDatabase();
    const query = `
      CREATE TABLE IF NOT EXISTS Note(
      note_ID INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      timestamp TIMESTAMP,
      createdDate DATE,
      updatedDate DATE,
      isSaved BOOL,
      status_ID INTEGER NOT NULL,
      content TEXT,
      pinned BOOL,
      important BOOL,
      FOREIGN KEY(status_ID) REFERENCES Status(status_ID));`;
    await db.execute(query);
  }
  // -------------------------------------------------------------------------
  async createNote(name="", content="") {
    console.log(name,content)
    try {
      const db = await this.connectToDatabase();

      if (name === "") {
        const countQuery = "SELECT COUNT(*) AS count FROM Note";
        const countResult = await db.select(countQuery);
        const currentCount = countResult[0].count;
        name = `Note ${currentCount + 1}`;
      }

      const query = `
        INSERT INTO Note (name,timestamp,createdDate,updatedDate,isSaved,status_ID,content,pinned,important)
        VALUES
        (?,?,?,?,?,?,?,?,?);`;
      let params = [
        name,
        Date.now(),
        new Date().toLocaleString("fr-FR"),
        new Date().toLocaleString("fr-FR"),
        1,
        1,
        content,
        0,
        0,
      ];
      await db.execute(query, params);
    } catch (error) {
      console.error("Error inserting data:", error);
      throw error;
    }
  }
  // -------------------------------------------------------------------------
  async duplicateNote(note) {
    try {
      const db = await this.connectToDatabase();
      const query = `
        INSERT INTO Note (name, timestamp,createdDate,updatedDate,isSaved,status_ID,content,pinned,important)
        VALUES (?,?,?,?,?,?,?,?,?);`;
      let noteName = note.name + " - Copy";
      let params = [
        noteName,
        Date.now(),
        new Date().toLocaleString("fr-FR"),
        new Date().toLocaleString("fr-FR"),
        note.isSaved,
        note.status_ID,
        note.content,
        note.pinned,
        note.important,
      ];
      await db.execute(query, params);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // -------------------------------------------------------------------------
  async updateNote(note) {
    console.log("updated note", note);
    try {
      const db = await this.connectToDatabase();
      const query = `
        UPDATE Note SET
        name = $1,
        timestamp = $2,
        updatedDate = $3,
        isSaved = $4,
        status_ID = $5,
        content = $6,
        pinned = $7,
        important = $8
        WHERE note_ID = $9;`;

      let params = [
        note.name,
        note.timestamp,
        new Date().toLocaleString("fr-FR"),
        note.isSaved,
        note.status_ID,
        note.content,
        note.pinned,
        note.important,
        note.note_ID,
      ];
      await db.execute(query, params);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // -------------------------------------------------------------------------
  async deleteNote(note) {
    console.log("deleted note", note);
    try {
      const db = await this.connectToDatabase();
      const query = "DELETE FROM Note WHERE note_ID = $1;";
      let params = [note.note_ID];
      await db.execute(query, params);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // -------------------------------------------------------------------------
  async getNotes() {
    try {
      const db = await this.connectToDatabase();
      const query = "SELECT * FROM Note;";
      const result = await db.select(query);
      console.log("notes", result);
      return result;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
  // -------------------------------------------------------------------------
  async getLastNote() {
    try {
      const db = await this.connectToDatabase();
      const query = `SELECT * FROM Note ORDER BY note_ID DESC LIMIT 1;`;
      const result = await db.select(query);
      return result[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // -------------------------------------------------------------------------
  async createTableStatus() {
    const db = await this.connectToDatabase();
    let sql = `
      CREATE TABLE IF NOT EXISTS Status(
      status_ID INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT);`;
    await db.execute(sql);
  }
  // -------------------------------------------------------------------------
  async createStatus() {
    try {
      const db = await this.connectToDatabase();
      const [rows] = await db.select("SELECT COUNT(*) AS count FROM Status");
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
      await db.execute(query);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // -------------------------------------------------------------------------
  async getStatus() {
    try {
      const db = await this.connectToDatabase();
      const result = await db.select("SELECT * FROM Status;");
      console.log("getStatus", result);
      return result;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
  // -------------------------------------------------------------------------
  async createTableTags() {
    try {
      const db = await this.connectToDatabase();
      const query = `
        CREATE TABLE IF NOT EXISTS Tags(
        tags_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        color TEXT);`;
      await db.execute(query);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // -------------------------------------------------------------------------
  async createTag(tag) {
    try {
      const db = await this.connectToDatabase();
      const query = `
        INSERT INTO Tags (name, color)
        VALUES (?,?);`;
      let params = [tag.name, "blue"];
      await db.execute(query, params);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // -------------------------------------------------------------------------
  async updateTag(tag) {
    try {
      const db = await this.connectToDatabase();
      const query = `
        UPDATE Tags SET
        name = $1,
        color = $2
        WHERE tags_ID = $3;`;
      let params = [tag.name, tag.color, tag.id];
      await db.execute(query, params);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // -------------------------------------------------------------------------
  async deleteTag(tag) {
    try {
      const db = await this.connectToDatabase();
      const query = `DELETE FROM Tags WHERE tags_ID = $1;`;
      let params = [tag.id];
      await db.execute(query, params);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // -------------------------------------------------------------------------
  async getTags() {
    try {
      const db = await this.connectToDatabase();
      const result = await db.select("SELECT * FROM Tags;");
      return result;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
  // -------------------------------------------------------------------------
  async createTableNoteTags() {
    const db = await this.connectToDatabase();
    const query = `
      CREATE TABLE IF NOT EXISTS note_tags(
      note_ID,
      tags_ID,
      FOREIGN KEY(note_ID) REFERENCES Note(note_ID),
      FOREIGN KEY(tags_ID) REFERENCES Tags(tags_ID));`;
    await db.execute(query);
  }
  // -------------------------------------------------------------------------
}
export default new DatabaseService();
