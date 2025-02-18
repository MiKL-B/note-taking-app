<template>
  <div
    id="notelist"
    @contextmenu.prevent="showContextMenuOnNotelist"
    @click="showMenu = false"
  >
    <span id="notelist-nonotes" v-if="notes.length <= 0">{{
      $t("create_first_note")
    }}</span>

    <div
      id="note-container"
      v-for="note in notes"
      :class="note.selected ? 'note-selected' : ''"
      @click.stop="selectNote(note)"
      @contextmenu.prevent="showContextMenu($event, note)"
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
          <span
            id="note-title-name"
            :style="note.selected ? '' : 'color:var(--dark)'"
          >
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
    <!-- context to move -->
    <div v-if="showMenu" class="context" :style="menuStyle">
      <ul class="context-menu">
        <li @click="createNote" class="flex align-center gap-4">
          <Plus class="text-dark size-16" />
          {{ $t("create_note") }}
        </li>
        <li
          @click="duplicateNote"
          class="flex align-center gap-4"
          :class="selectedNote ? '' : 'disabled'"
        >
          <CopyPlus class="size-16" :class="selectedNote ? 'text-dark' : ''" />
          {{ $t("duplicate_note") }}
        </li>
        <hr class="separator-x" />
        <li
          @click="togglePinNote"
          class="flex align-center gap-4"
          :class="selectedNote ? '' : 'disabled'"
        >
          <PinOff
            v-if="isPinned"
            class="size-16"
            :class="selectedNote ? 'text-dark' : ''"
          />
          <Pin
            v-else
            class="size-16"
            :class="selectedNote ? 'text-dark' : ''"
          />
          {{ isPinned ? $t("unpin_note") : $t("pin_note") }}
        </li>
        <hr class="separator-x" />
        <li
          @click="deleteNoteContext"
          class="flex align-center gap-4"
          :class="selectedNote ? '' : 'disabled'"
        >
          <Trash2 class="size-16" :class="selectedNote ? 'text-red' : ''" />
          {{ $t("delete_note") }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Pin, PinOff, Trash2, Lock, Plus, CopyPlus } from "lucide-vue-next";
export default {
  name: "Notelist",
  props: ["notes", "isPinned", "selectedNote"],
  emits: [
    "select-note",
    "delete-note",
    "create-note",
    "duplicate-note",
    "toggle-pin-note",
  ],
  components: {
    Pin,
    PinOff,
    Trash2,
    Lock,
    Plus,
    CopyPlus,
  },
  data() {
    return {
      showMenu: false,
      menuStyle: {
        left: "0px",
        top: "0px",
      },
    };
  },
  // TODO
  mounted() {
    document.addEventListener("click", this.closeMenu);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.closeMenu);
  },
  methods: {
    selectNote(note) {
      this.$emit("select-note", note);
      this.showMenu = false;
    },
    deleteNote(note) {
      this.$emit("delete-note", note);
    },
    deleteNoteContext() {
      if (this.selectedNote) {
        this.deleteNote(this.selectedNote);
      }
    },
    createNote() {
      this.$emit("create-note");
    },
    duplicateNote() {
      this.$emit("duplicate-note");
    },
    togglePinNote() {
      this.$emit("toggle-pin-note");
    },

    // to move
    showContextMenu(event, note) {
      this.menuStyle = {
        left: `${event.clientX}px`,
        top: `${event.clientY}px`,
      };
      this.showMenu = true;
      this.selectNote(note);
    },
    showContextMenuOnNotelist(event) {
      this.menuStyle = {
        left: `${event.clientX}px`,
        top: `${event.clientY}px`,
      };
      this.showMenu = true;
    },
    closeMenu() {
      this.showMenu = false;
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

.context {
  background-color: var(--bg-toolbar);
  position: absolute;
  z-index: 1;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  min-width: 100px;
  user-select: none;
}
.context-menu li {
  list-style-type: none;
  padding: 0.2rem 0.5rem;
  margin: 0.2rem;
  border-radius: 5px;
  cursor: pointer;
}
.context-menu li:hover {
  background: var(--bg-hover-toolbar);
  cursor: pointer;
}
</style>
