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
  async createTableNote() {
    const db = await this.connectToDatabase();
    let sql = `
      CREATE TABLE IF NOT EXISTS Note(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      timestamp TIMESTAMP,
      createdDate DATE,
      updatedDate DATE,
      status TEXT,
      color TEXT,
      content TEXT,
      tags TEXT,
      selected BOOL,
      pinned BOOL,
      important BOOL);
    `;
    await db.execute(sql);
  }
  async initializeDatabase() {
    const db = await this.connectToDatabase();
    // Créer la table 'test' si elle n'existe pas

    // await db.execute("DROP TABLE  Note")
    await this.createTableNote();
    // Ajoutez d'autres tables ici si nécessaire
  }
  async insertData() {
    try {
      const db = await this.connectToDatabase();
      const countQuery = "SELECT COUNT(*) AS count FROM Note";
      const countResult = await db.select(countQuery);
      const currentCount = countResult[0].count;

      const name = `Note ${currentCount + 1}`;

      const query = `
        INSERT INTO Note (name, timestamp,createdDate,updatedDate,status,color,content,tags,selected,pinned,important)
        VALUES
        (?,?,?,?,?,?,?,?,?,?,?);
      `;
      await db.execute(query, [
        name,
        Date.now(),
        new Date().toLocaleString("fr-FR"),
        new Date().toLocaleString("fr-FR"),
        "todo",
        "red",
        "",
        "",
        0,
        0,
        0
      ]);
      console.log("inserted");
    } catch (error) {
      console.error("Error inserting data:", error);
      throw error;
    }
  }

  async fetchData() {
    try {
      const db = await this.connectToDatabase();
      const result = await db.select("SELECT * FROM Note");
      return result;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
  async executeQuery(query, params) {
    try {
      const db = await this.connectToDatabase();
      return await db.execute(query, params);
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  }
}
export default new DatabaseService();
