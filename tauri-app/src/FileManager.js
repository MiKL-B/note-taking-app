import { join, desktopDir } from "@tauri-apps/api/path";

let folderName = "vault";
export default async function getFilePath(fileName) {
     const desktopPath = await desktopDir();
     const folderPath = await join(desktopPath, folderName);
     const filePath = await join(folderPath, fileName);
     return filePath;
}
