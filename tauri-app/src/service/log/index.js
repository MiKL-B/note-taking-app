import { writeTextFile, mkdir, exists } from "@tauri-apps/plugin-fs";
import { join, appLocalDataDir } from "@tauri-apps/api/path";

let filePath;
// -------------------------------------------------------------------------
function generateLogFileName() {
    const now = new Date().toLocaleString("fr-FR");
    const fileName = now.replace(/[\s\/:]/g, "-").replace(/[^\w\-]/g, "");
    return `log_${fileName}.log`;
}
// -------------------------------------------------------------------------
export async function initLogFile() {
    const folderName = "logs";
    const appPath = await appLocalDataDir();
    const folderPath = await join(appPath, folderName);
    filePath = await join(folderPath, generateLogFileName());

    try {
        let existingFolder = await exists(folderPath);
        if (!existingFolder) {
            await mkdir(folderPath);
        }
        await writeTextFile(filePath, "");
    } catch (error) {
        console.log(error);
    }
}
// -------------------------------------------------------------------------
export async function writeLog(message) {
    if (!filePath) {
        await initLogFile();
    }
    const timestamp = new Date().toLocaleString("fr-FR");
    const logMessage = `${timestamp} - ${message}\n`;
    try {
        await writeTextFile(filePath, logMessage, { append: true });
    } catch (err) {
        console.error("Error writing to log file:", err);
    }
}
// -------------------------------------------------------------------------