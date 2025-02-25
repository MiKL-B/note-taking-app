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
  status :string;
  color :string;
  content:string;
  tags: Tag[];
  selected:boolean;
  pinned :boolean;
  important :boolean;
  constructor(
      id: number = Date.now(),
      name: string = "Note",
      timestamp: number = Date.now(),
      createdDate: string = new Date().toLocaleString("fr-FR"),
      updatedDate: string = new Date().toLocaleString("fr-FR"),
      status: string = "todo",
      color: string = "red",
      content: string = "",
      tags: Tag[] = [],
      selected: boolean = false,
      pinned: boolean = false,
      important: boolean = false,
  ) {
      this.id = id;
      this.name = name;
      this.timestamp = timestamp;
      this.createdDate = createdDate;
      this.updatedDate = updatedDate;
      this.status = status;
      this.color = color;
      this.content = content;
      this.tags = tags;
      this.selected = selected;
      this.pinned = pinned;
      this.important = important;
  }
}
