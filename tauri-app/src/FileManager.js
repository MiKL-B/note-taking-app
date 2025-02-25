import { join, desktopDir } from "@tauri-apps/api/path";

export default async function getFilePath(fileName,folderName) {
     const desktopPath = await desktopDir();
     const folderPath = await join(desktopPath, folderName);
     const filePath = await join(folderPath, fileName);
     return filePath;
}
