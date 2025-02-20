# Implemented
- CRUD Notes and tags
- Search by name
- Sort asc-desc, date, clear sort
- Filter by status, tags, today, pin / unpin, important
- Open
- Save
- Export, import
- Change status note
- Duplicate note
- Pin / unpin note
- Important note
- View sidebar, notelist (distraction-free mode)
- Change theme in the settings window
- Change language in the settings window
- Change font in the settings window
- Change font size in the settings window
- Toggle preview markdown
- View both text / markdown
- Notifications (just information)
- Add context menu
- Folders and subfolders (push as notes for the moment)
- Create treeview for folders, subfolders as well as files
---

# Fixed
- fix width input name note (column note)
- set ellipsis note name (column notelist)
- fix position notification
- position layout container
- height home window
- remove minimize settings window
- open details
- settings font mounted ?
- open close same button details
- details sidebar color
- sidebar overflow y
- sort does not work
- color markdown in dark mode
- filter today sidebar 
- emits and listen data from settings window
---

# Improved 
- confirm before deleting note
- Improve Style markdown
- insert: other elements like date, image...
- Add menu item about info project and link github 
- remove open note demo mounted and move in file menu 
---

# To fix
- multiple tags notebar list
---

# To improve
- Improve textarea impossible ? --> change to a contenteditable true ?
- Improve save functionnality
- insert: heading ... at the right place
- insert: Audio and video
- Context menu 
- Manage permissions for treeview
- Add menu item documentation
---

# To Implement
- Create a vault like obsidian to store notes in the AppLocalData (data of the app)
- For example "Thoth notes"
- Find this path to write and read notes (files)
- When some actions like changing note selected, save the previous note selected with an alert
- "Save as..." can save a note on the desktop
- Format the header of the notes in order to retrieve the status, tags ...
- Add a sub menu item in "File" to create a vault
- Allow permissions according to the actions (create dir, create file, read dir, read file)
- BaseDirectory.AppLocalData with permissions, allow to create in C:\Users\{Username}\AppData\Local\Thoth
- find the path for MacOs et Linux
- Review the different functions for new, new folder, open ...
- "new folder" (vault) with a confirm and input for the folder name otherwise thoth notes
- "save" must be moved in "save as"
- "new note" create a note and create file in the folder
- can create many folders (vault) ?
- Allow save delete etc for files, (note = file)

- View kanban, schedule, drawing
- App branding
- Accessibility (title..)
- Export PDF
- Export import settings
- Print
- Set settings auto export pdf when saving note

- Lock files / folders 
- Debug with log files
- Create alert, confirm, modal
