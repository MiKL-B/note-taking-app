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
// let note = new DataNote();
// this.items.forEach((item) => {
//   note = { ...item };
// });

// let name = this.selectedNote.name + " - " + Date.now().toString();
// let status = this.selectedNote.status;
// let color = this.selectedNote.color;
// let content = this.selectedNote.content;
// // let folder = this.selectedNote.folder;
// let tags = [];
// this.selectedNote.tags.forEach((tag) => {
//   let tagCopy = {
//     id: tag.id,
//     name: tag.name,
//     color: tag.color,
//     selected: false,
//   };
//   tags.push(tagCopy);
// });
// let note = new DataNote(name);
// note.status = status;
// note.color = color;
// note.content = content;
// note.tags = tags;
// // note.folder = folder;
// this.notes.push(note);
// async createFolder() {
//   let folderName = "vault";
//   const desktopPath = await desktopDir();
//   const folderPath = await join(desktopPath, folderName);
//   try {
//     let existingFolder = await exists(folderPath);

//     if (!existingFolder) {
//       await mkdir(folderPath);
//     }

//     // await this.readContentFolder(folderPath);
//   } catch (error) {
//     this.showNotification(error, "red");
//     console.log("DEBUG", error);
//   }
// },

// async readContentFolder(filePath: string) {
//    let options: object = {
//      recursive: true,
//    };

//    let entries = await readDir(filePath, options);
//    let newArr = [];
//    for (const entry of entries) {
//      const pathEntry = await join(filePath, entry.name);
//      if (entry.isFile) {
//        try {
//          const fileContent = await readTextFile(pathEntry);
//          const metadata = await stat(pathEntry);

//          let dateMetadata = metadata.mtime.toLocaleString("fr-FR");
//          let birthTime = metadata.birthtime.toLocaleString("fr-FR");
//          let timeStampMetadata = metadata.mtime.getTime();
//          let noteName = entry.name.substring(0, entry.name.lastIndexOf("."));
//          let note = new DataNote();
//          note.name = noteName;
//          note.content = fileContent;
//          note.oldPath = pathEntry;
//          note.path = pathEntry;
//          note.folder = filePath.replace(/\\/g, "/").split("/").pop();
//          note.createdDate = birthTime;
//          note.id = metadata.uid;
//          note.timestamp = timeStampMetadata;
//          this.notes.push(note);
//        } catch (error) {
//          console.log("DEBUG", error);
//          this.showNotification(error, "red");
//        }
//      } else if (entry.isDirectory) {
//        await this.readContentFolder(pathEntry);
//      }
//    }
//  },
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // async readContentFolder(path: string) {
    //   console.log(
    //     "BEGIN [METHODS] async readContentFolder(path: string)",
    //     path,
    //   );
    //   let options: object = {
    //     recursive: true,
    //   };

    //   const entries = await readDir(path, options);
    //   let tree = {
    //     name: path.replace(/\\/g, "/").split("/").pop() || "root",
    //     path: path,
    //     isDirectory: true,
    //     children: [],
    //   };

    //   for (const entry of entries) {
    //     const filePath = await join(path, entry.name);
    //     let node = {
    //       name: entry.name,
    //       path: filePath,
    //       isDirectory: entry.isDirectory,
    //       children: [],
    //     };

    //     if (entry.isFile) {
    //       try {
    //         const fileContent = await readTextFile(filePath);
    //         let noteName = entry.name.substring(0, entry.name.lastIndexOf("."));
    //         let note = new DataNote(noteName);
    //         note.content = fileContent;
    //         this.notes.push(note);
    //       } catch (error) {
    //         console.log("DEBUG", error);
    //         this.showNotification(error, "red");
    //       }
    //     } else if (entry.isDirectory) {
    //       let arr = await this.readContentFolder(filePath);
    //       node.children = arr.children;
    //     }
    //     tree.children.push(node);
    //   }
    //   console.log("END [METHODS] async readContentFolder(path: string)", path);
    //   return tree;
    // },
