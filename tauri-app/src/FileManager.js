import { join, desktopDir } from "@tauri-apps/api/path";

export default async function getFilePath(fileName, folderName) {
     const desktopPath = await desktopDir();
     const folderPath = await join(desktopPath, folderName);
     const filePath = await join(folderPath, fileName);
     return filePath;
}
// console.log(this.items)
// this.notes = this.items;
// let note = new DataNote();
// let uuid = this.uniqueId(10);
// note.name = "Note-" + uuid;
// note.path = await getFilePath(note.name, "vault");
// const filePath = await getFilePath("data.json", "vault");
// try {
//   const content = await readTextFile(filePath);
//   const existingNotes = JSON.parse(content);
//   existingNotes.push(note);
//   const jsonData = JSON.stringify(existingNotes, null, 4);
//   await writeTextFile(filePath, jsonData);
// } catch (error) {
//   console.log(error);
// }
// await this.readJSONNotes();
// // await this.readJSONNotes();
// // this.createFile(note);
// // this.updateFile(note);
// // this.showNotification(
// //   this.$t("note_created", { note_name: note.name }),
// //   "green",
// // );
// this.setDelayCreationNote();
// let file = { ...note };
// file.name += ".txt";
// console.log("saveFile", note);
// await this.createFile(note)
// let folderName = "vault";
// if (isDuplicated) {
//   folderName = await join("vault", file.folder);
// }
// let oldPathName = note.oldPath.replace(/\\/g, "/").split("/").pop();
// let newPathName = file.name.replace(/\\/g, "/").split("/").pop();
// const oldPathFile = await getFilePath(oldPathName, "vault");
// const newPathFile = await getFilePath(newPathName, "vault");

// console.log("old", oldPathFile);
// console.log("new", newPathFile);
// let newNote = { ...note };
// newNote.name = note.name;
// let filePath = oldPathFile;
// if (oldPathName !== newPathName) {
//   filePath = newPathFile;
//   // await this.createFile(newNote);
//   await remove(oldPathFile);
//   note.oldPath = newPathFile;
// } else {
//   await readTextFile(filePath);
//   await writeTextFile(filePath, file.content);
// }

// try {
//   let existingFile = await exists(filePath);

//   note.updatedDate = new Date().toLocaleString("fr-FR");
//   await readTextFile(filePath);
//   await writeTextFile(filePath, file.content);
//   this.showNotification(
//     this.$t("note_saved", { note_name: note.name }),
//     "green",
//   );
//   console.log("file updated");
// } catch (error) {
//   this.showNotification(error, "red");
//   console.log("DEBUG", error);
// }
// await remove(note.path);
// let file = {
//   name: note.name + ".txt",
// };
// async updateFile(file: Note) {
//    let folderName = "vault";
//    const desktopPath = await desktopDir();
//    const folderPath = await join(desktopPath, folderName);
//    const filePath = await join(folderPath, file.name + ".txt");
//  },
// async createFile(file: Note) {
//   let folderName = "vault";
//   const desktopPath = await desktopDir();
//   const folderPath = await join(desktopPath, folderName);
//   const filePath = await join(folderPath, file.name + ".txt");
//   try {
//     await writeTextFile(filePath, file.content);
//     file.folder = folderPath.replace(/\\/g, "/").split("/").pop();
//     file.path = filePath;
//     file.oldPath = filePath;
//   } catch (error) {
//     console.log("DEBUG", error);
//   }
// },
// async readJSONNotes() {
//   const filePath = await getFilePath("data.json", "vault");
//   try {
//     const content = await readTextFile(filePath);
//     this.notes = JSON.parse(content);
//   } catch (error) {
//     console.log(error);
//   }
// },
