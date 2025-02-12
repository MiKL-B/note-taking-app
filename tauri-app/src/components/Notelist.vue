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
          <!-- <Lock class="size-16 text-dark"/> -->
          <span style="color: var(--red)" v-if="note.important">!</span>
          <Pin v-if="note.pinned" class="size-16 text-dark" />
          <div
            style="padding: 0 0.3rem"
            class="color-circle"
            :class="`bg-${note.color}`"
          ></div>
          <span id="note-title-name" :style="note.selected ? '': 'color:var(--dark)'">
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
        <span class="note-date">{{ note.date }}</span>
      </div>
      <Trash2 width="20" class="note-trash" @click="deleteNote(note)" />
    </div>
  </div>
</template>

<script>
import { Pin, Trash2, Lock } from "lucide-vue-next";
export default {
  name: "Notelist",
  props: ["notes"],
  components: {
    Pin,
    Trash2,
    Lock,
  },
  data() {
    return {};
  },
  mounted() {},
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
  overflow-y: auto;
}
#note-container {
  display: grid;
  grid-template-columns: 200px auto;
  align-items: center;
  padding: 0.75rem 0.5rem;
  position: relative;
  border-bottom: var(--border);
}

.note-selected {
  background: var(--bg-note-selected);
}

#note-container:hover .note-trash {
  opacity: 1;
  pointer-events: auto;
}
#note-container:hover .icon-grip {
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
  color: var(--text-color-notelist);
  margin-bottom: 0.2rem;
}
#note-title-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 200px;
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
  background: var(--bg-note-selected);
  cursor: pointer;
}
.note-trash {
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  color: var(--red);
  margin: auto;
}
.note-date {
  color: var(--text-color-notelist);
  font-size: 14px;
}
.note-trash:hover {
  cursor: pointer;
}
</style>
