<template>
  <div
    id="notelist"
    @contextmenu.prevent="getPositionMenu"
    @click="showMenu = false"
  >
    <span id="notelist-nonotes" v-if="notes.length <= 0">{{
      $t("create_first_note")
    }}</span>

    <div
      class="note-container"
      v-for="note in notes"
      :class="note.selected ? 'note-selected' : ''"
      @click.stop="selectNote(note)"
      @contextmenu.prevent="showContextMenu($event, note)"
    >
      <NoteElement
        :note="note"
        @delete-note="deleteNote"
        @restore-note="restoreNote"
      />
    </div>
    <!-- context to move -->

    <div v-if="showMenu" class="context" :style="menuStyle">
      <ul class="context-menu">
        <li @click="createNote" class="flex align-center gap-4">
          <AppIcon iconName="Plus" class="text-dark size-16" />
          {{ $t("newnote") }}
        </li>
        <li
          v-if="selectedNote.deleted === 0"
          @click="duplicateNote"
          class="flex align-center gap-4"
          :class="selectedNote ? '' : 'disabled'"
        >
          <AppIcon
            iconName="CopyPlus"
            class="size-16"
            :class="selectedNote ? 'text-dark' : ''"
          />
          {{ $t("duplicate_note") }}
        </li>
        <hr v-if="selectedNote.deleted === 0" class="separator-x" />
        <li
          v-if="selectedNote.deleted === 0"
          @click="togglePinNote"
          class="flex align-center gap-4"
          :class="selectedNote ? '' : 'disabled'"
        >
          <AppIcon
            iconName="PinOff"
            v-if="isPinned"
            class="size-16"
            :class="selectedNote ? 'text-dark' : ''"
          />
          <AppIcon
            iconName="Pin"
            v-else
            class="size-16"
            :class="selectedNote ? 'text-dark' : ''"
          />
          {{ isPinned ? $t("unpin_note") : $t("pin_note") }}
        </li>
        <hr class="separator-x" />
        <li
          v-if="selectedNote.deleted === 0"
          @click="deleteNoteContext"
          class="flex align-center gap-4"
          :class="selectedNote ? '' : 'disabled'"
        >
          <AppIcon
            iconName="Trash2"
            class="size-16"
            :class="selectedNote ? 'text-red' : ''"
          />
          {{ $t("move_to_trash") }}
        </li>
        <li
          v-else
          @click="restoreNoteContext"
          class="flex align-center gap-4"
          :class="selectedNote ? '' : 'disabled'"
        >
          <AppIcon
            iconName="RotateCcw"
            class="size-16"
            :class="selectedNote ? 'text-green' : ''"
          />

          {{ $t("restore_note") }}
        </li>
        <li
          @click="deleteNotePermanentContext"
          class="flex align-center gap-4"
          :class="selectedNote ? '' : 'disabled'"
        >
          <AppIcon
            iconName="Trash2"
            class="size-16"
            :class="selectedNote ? 'text-red' : ''"
          />
          {{ $t("delete_note_permanent") }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import NoteElement from "./NoteElement.vue";
import AppIcon from "./AppIcon.vue";

export default {
  name: "Notelist",
  props: ["notes", "selectedNote", "isPinned"],
  emits: [
    "select-note",
    "delete-note",
    "restore-note",
    "delete-note-permanent",
    "create-note",
    "duplicate-note",
    "toggle-pin-note",
  ],
  components: {
    NoteElement,
    AppIcon,
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

  async mounted() {
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
    restoreNote(note) {
      this.$emit("restore-note", note);
    },
    restoreNoteContext() {
      if (this.selectedNote) {
        this.restoreNote(this.selectedNote);
      }
    },
    deleteNotePermanent(note) {
      this.$emit("delete-note-permanent", note);
    },
    deleteNotePermanentContext() {
      if (this.selectedNote) {
        this.deleteNotePermanent(this.selectedNote);
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
    getPositionMenu(event){
      let menuHeight = 140;
      let posY = event.clientY;
      if (window.innerHeight - posY < menuHeight) {
        posY -= menuHeight; 
      }
      this.menuStyle = {
        left: `${event.clientX}px`,
        top: `${posY}px`,
      };
      this.showMenu = true;
    },
    showContextMenu(event, note) {
      this.getPositionMenu(event);
      this.selectNote(note);
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
.note-container {
  display: grid;
  grid-template-columns: 200px auto;
  align-items: center;
  padding: 0.75rem 0.5rem;
  position: relative;
  border-bottom: var(--border);
}
.note-container:hover {
  background: var(--bg-note-container-hover);
  cursor: pointer;
}
.note-selected,
.note-selected:hover {
  background: var(--bg-note-selected);
  cursor: pointer;
}

.note-container:hover .note_trash {
  opacity: 1;
  pointer-events: auto;
}
.note-container:hover .note_restore {
  opacity: 1;
  pointer-events: auto;
}

#notelist-nonotes {
  padding: 0.5rem;
  color: var(--grey);
  user-select: none;
  display: flex;
}

.context {
  background-color: var(--bg-toolbar);
  position: absolute;
  z-index: 1;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  min-width: 100px;
  user-select: none;
  min-height:100px;
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
