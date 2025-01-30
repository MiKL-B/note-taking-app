<template>
  <div id="notelist">
    <span id="notelist-nonotes" v-if="notes.length <= 0"
      >Create your first note!</span
    >
    <div
      id="note-container"
      v-for="note in notes"
      :class="note.selected ? 'note-selected' : ''"
    >
      <div id="note" @click="selectNote(note)">
        <div class="note-content">
          <h4 class="note-title">
            <div class="color-circle" :class="`bg-${note.color}`"></div>
            <span>
              {{ note.name }}
            </span>
          </h4>
          <div class="notelist-tag">
            <span
              class="tag"
              v-for="tag in note.tags"
              :style="` background: var(--${tag.color} `"
              >{{ tag.name }}</span
            >
          </div>
          <p class="note-content">
            {{ note.content }}
          </p>
          <span>{{ note.date }}</span>
        </div>
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
  },
};
</script>
<style>
#notelist {
  height: calc(100vh - 150px);
  overflow-y: auto;
}

#note {
  padding: 1rem 0.5rem;
  display: grid;
  grid-template-columns: 200px auto;

}
.note-selected {
  background: #f4f4f5;
}

#note-container:hover .note-trash {
  opacity: 1;
  pointer-events: auto;
}

.note-content {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.note-title {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}
.notelist-tag {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
}
#notelist-nonotes {
  padding: 0.5rem;
  color: var(--grey);
  user-select: none;
}
#note-container {
  display: flex;
  align-items: center;
  transition: 0.3s ease;
  border-bottom: var(--border);
}
#note-container:hover {
  background: #f4f4f5;
  cursor: pointer;
}
.note-trash {
  display: flex;
  justify-content: space-between;
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
</style>
