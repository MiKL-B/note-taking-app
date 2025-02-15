interface Tag {
  name: string;
  color: string;
}

export default class Note {
  name: string;
  id:number;
  timestamp:number;
  date :string;
  status :string;
  color :string;
  content:string;
  tags: Tag[];
  selected:boolean;
  pinned :boolean;
  important :boolean;
  constructor(
      name: string,
      id: number = Date.now(),
      timestamp: number = Date.now(),
      date: string = Date.now().toLocaleString("fr-FR"),
      status: string = "todo",
      color: string = "red",
      content: string = "",
      tags: Tag[] = [],
      selected: boolean = false,
      pinned: boolean = false,
      important: boolean = false
  ) {
      this.name = name;
      this.id = id;
      this.timestamp = timestamp;
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
