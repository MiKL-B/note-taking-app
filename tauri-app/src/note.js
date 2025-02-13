export default class Note {
  constructor(
    name,
    id = Date.now(),
    date = new Date().toLocaleString("fr-FR"),
    status = "todo",
    color = "red",
    content = "",
    tags = [],
    selected = false,
    pinned = false,
    important = false
  ) {
    this.name = name;
    this.id = id;
    this.date = date;
    this.status = status;
    this.color = color;
    this.content = content;
    this.tags = tags;
    this.selected = selected;
    this.pinned = pinned;
    this.important = important;
  }
}
