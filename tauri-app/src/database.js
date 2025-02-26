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
  async createTableNote() {
    const db = await this.connectToDatabase();
    let sql = `
      CREATE TABLE IF NOT EXISTS Note(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      timestamp TIMESTAMP,
      createdDate DATE,
      updatedDate DATE,
      isSaved BOOL,
      status TEXT,
      color TEXT,
      content TEXT,
      tags TEXT,
      pinned BOOL,
      important BOOL);
    `;
    await db.execute(sql);
  }
  // -------------------------------------------------------------------------
  async initializeDatabase() {
    const db = await this.connectToDatabase();
    // Créer la table 'test' si elle n'existe pas

    // await db.execute("DROP TABLE  Note")
    await this.createTableNote();
    // Ajoutez d'autres tables ici si nécessaire
  }
  // -------------------------------------------------------------------------
  async createNote() {
    try {
      const db = await this.connectToDatabase();
      const countQuery = "SELECT COUNT(*) AS count FROM Note";
      const countResult = await db.select(countQuery);
      const currentCount = countResult[0].count;

      const name = `Note ${currentCount + 1}`;

      const query = `
        INSERT INTO Note (name, timestamp,createdDate,updatedDate,isSaved,status,color,content,tags,pinned,important)
        VALUES
        (?,?,?,?,?,?,?,?,?,?,?);
      `;
      await db.execute(query, [
        name,
        Date.now(),
        new Date().toLocaleString("fr-FR"),
        new Date().toLocaleString("fr-FR"),
        1,
        "todo",
        "red",
        "",
        "",
        0,
        0,
      ]);
    } catch (error) {
      console.error("Error inserting data:", error);
      throw error;
    }
  }
  // -------------------------------------------------------------------------
  async updateNote(note) {
    try {
      const db = await this.connectToDatabase();
      const query = `
        UPDATE Note SET
        name = $1,
        timestamp = $2,
        updatedDate = $3,
        isSaved = $4,
        status = $5,
        color = $6,
        content = $7,
        tags = $8,
        pinned = $9,
        important = $10
        WHERE id = $11;
      `;
    
      let params = [
        note.name,
        note.timestamp,
        new Date().toLocaleString("fr-FR"),
        note.isSaved,
        note.status,
        note.color,
        note.content,
        note.tags,
        note.pinned,
        note.important,
        note.id,
      ];
      await db.execute(query, params);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // -------------------------------------------------------------------------
  async deleteNote(note) {
    try {
      const db = await this.connectToDatabase();
      const query = "DELETE FROM Note WHERE id = $1;";
      await db.execute(query, [note.id]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // -------------------------------------------------------------------------
  async getNotes() {
    try {
      const db = await this.connectToDatabase();
      const result = await db.select("SELECT * FROM Note;");
      return result;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
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
}
export default new DatabaseService();
