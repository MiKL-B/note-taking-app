interface Tag {
  name: string;
  color: string;
}

export default class DataNote {
  id:number;
  name: string;
  timestamp:number;
  createdDate :string;
  updatedDate: string;
  isSaved:number;
  status :string;
  color :string;
  content:string;
  tags: Tag[];
  selected:number;
  pinned :number;
  important :number;
  constructor(
      id: number = Date.now(),
      name: string = "Note",
      timestamp: number = Date.now(),
      createdDate: string = new Date().toLocaleString("fr-FR"),
      updatedDate: string = new Date().toLocaleString("fr-FR"),
      isSaved:1,
      status: string = "todo",
      color: string = "red",
      content: string = "",
      tags: Tag[] = [],
      selected: number = 0,
      pinned: number = 0,
      important: number = 0,
  ) {
      this.id = id;
      this.name = name;
      this.timestamp = timestamp;
      this.createdDate = createdDate;
      this.updatedDate = updatedDate;
      this.isSaved = isSaved;
      this.status = status;
      this.color = color;
      this.content = content;
      this.tags = tags;
      this.selected = selected;
      this.pinned = pinned;
      this.important = important;
  }
}
