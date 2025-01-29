<template>
  <div id="notelist">
    <div
      id="note"
      :class="note.selected ? 'note-selected' : ''"
      @click="selectNote(note)"
      v-for="note in notes"
    >
      <div class="note-content">
        <h4 class="note-title">
          <div class="color-circle" :class="getColorNoteStatus(note)"></div>
          {{ note.name }}
        </h4>
        <span class="tag" :style="`background:var(--${randomTagColor()})`">tag</span>
        <p class="note-content">
          {{ note.content }}
        </p>
        <span>{{ note.date }}</span>
      </div>
      <div class="note-trash">
        <i class="fa-solid fa-trash-can" @click="deleteNote(note)"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Notelist",
  props: ["notes"],
  methods: {
    selectNote(note) {
      this.$emit("select-note", note);
    },
    deleteNote(note) {
      this.$emit("delete-note", note);
    },
    getColorNoteStatus(note) {
      let color = "bg-";
      switch (note.status) {
        case "todo":
          color += "red";
          break;
        case "inprogress":
          color += "yellow";
          break;
        case "finished":
          color += "green";
          break;
        default:
          color += "red";
          break;
      }
      return color;
    },
    randomTagColor(){
      let colors = ["blue","red","yellow","purple","green"]
      let randomID = Math.floor(Math.random() * colors.length)
      return colors[randomID]
    }
  },
};
</script>
<style>
#notelist {
  margin-top: 0.5rem;
  height: calc(100vh - 150px);
  overflow-y: auto;
}

#note {
  margin: 0 0.2rem 0.2rem 0.2rem;
  border-radius: 5px;
  padding: 0.5rem;
  display: grid;
  grid-template-columns: 200px auto;
  transition: 0.3s ease;
}
.note-selected {
  background: #f4f4f5;
}
#note:hover .note-trash {
  opacity: 1;
  pointer-events: auto;
}
#note:hover {
  background: #f4f4f5;
  cursor: pointer;
}
.note-content {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.note-trash {
  display: flex;
  margin: auto;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}
.note-trash i {
  color: var(--red);
}
.note-trash i:hover {
  cursor: pointer;
}
.note-title {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}
</style>
