<template>
  <div id="notelist">
    <span id="notelist-nonotes" v-if="notes.length <= 0">{{
      $t("create_first_note")
    }}</span>
    <div
      id="note-container"
      v-for="note in notes"
      :class="note.selected ? 'note-selected' : ''"
      @click="selectNote(note)"
    >
      <div id="note">
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
            :style="`background: var(--${tag.color})`"
            >{{ tag.name }}</span
          >
        </div>
        <p class="note-content">
          {{ note.content }}
        </p>
        <span>{{ note.date }}</span>
      </div>
      <Trash2 width="20" class="note-trash" @click="deleteNote(note)" />
    </div>
  </div>
</template>

<script>
import { Trash2 } from "lucide-vue-next";
export default {
  name: "Notelist",
  props: ["notes"],
  components: {
    Trash2,
  },

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
#note-container {
  display: grid;
  grid-template-columns: 200px auto;
  align-items: center;
  padding: 1rem 0.5rem;
  border-bottom: var(--border);
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
  color: var(--dark);
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
  display: flex;
}

#note-container:hover {
  background: #f4f4f5;
  cursor: pointer;
}
.note-trash {
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  color: var(--red);
  margin:auto;
}

.note-trash:hover {
  cursor: pointer;
}
</style>
