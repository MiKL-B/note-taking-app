<template>
  <ul id="sidebar">
    <li
      class="sidebar-item"
      @click="selectFilter('allnotes')"
      :class="{ filterselected: selectedFilter === 'allnotes' }"
    >
      <span class="sidebar-sub-label">
        <File />
        <span>All notes</span>
      </span>
      <span class="text-grey">{{ countAllNotes }}</span>
    </li>
    <li
      class="sidebar-item"
      @click="selectFilter('todo')"
      :class="{ filterselected: selectedFilter === 'todo' }"
    >
      <span class="sidebar-sub-label">
        <div class="color-circle bg-red"></div>
        <span>Todo</span>
      </span>
      <span class="text-grey">{{ countTodo }}</span>
    </li>
    <li
      class="sidebar-item"
      @click="selectFilter('inprogress')"
      :class="{ filterselected: selectedFilter === 'inprogress' }"
    >
      <span class="sidebar-sub-label">
        <div class="color-circle bg-yellow"></div>
        <span>In progress</span>
      </span>
      <span class="text-grey">{{ countInProgress }}</span>
    </li>
    <li
      class="sidebar-item"
      @click="selectFilter('finished')"
      :class="{ filterselected: selectedFilter === 'finished' }"
    >
      <span class="sidebar-sub-label">
        <div class="color-circle bg-green"></div>
        <span>Finished</span>
      </span>
      <span class="text-grey">{{ countFinished }}</span>
    </li>
    <li
      class="sidebar-item"
      @click="selectFilter('archived')"
      :class="{ filterselected: selectedFilter === 'archived' }"
    >
      <span class="sidebar-sub-label">
        <Archive />
        <span>Archived</span>
      </span>
      <span class="text-grey">{{ countArchived }}</span>
    </li>
    <li class="sidebar-item sidebar-label">
      <span class="sidebar-sub-label">
        <Tags />
        <span>Tags</span>
      </span>
      <span id="sidebar-tags-btn" @click="addTag"><Plus /></span>
    </li>
    <div id="sidebar-container-list">
      <ul id="sidebar-tags-list">
        <li
          id="sidebar-tag"
          @click="selectFilter(tag.name)"
          :class="{ filterselected: selectedFilter === tag.name }"
          class="sidebar-sub-item"
          v-for="tag in tags"
        >
          <span class="sidebar-sub-label">
            <details class="toolbar-details">
              <summary>
                <Tag :style="`color: var(--${tag.color}`" />
              </summary>
              <ul class="toolbar-menu">
                <li
                  class="flex gap-4 align-center"
                  v-for="color in colors"
                  @click="setColor(tag, color)"
                >
                  <div class="color-circle" :class="`bg-${color}`"></div>
                  <span>{{ color }}</span>
                </li>
              </ul>
            </details>
            <input
              class="sidebar-input-tag"
              type="text"
              v-model="tag.name"
              @input="updateTagName(tag)"
            />
          </span>

          <Trash2 class="tag-trash" @click="deleteTag(tag)" />
        </li>
      </ul>
    </div>
  </ul>
</template>

<script>
import { File, Archive, Tags, Tag, Plus, Trash2 } from "lucide-vue-next";
export default {
  name: "Sidebar",
  props: [
    "tags",
    "countAllNotes",
    "countTodo",
    "countInProgress",
    "countFinished",
    "countArchived",
  ],
  components: {
    File,
    Archive,
    Tags,
    Tag,
    Plus,
    Trash2,
  },
  data() {
    return {
      showDetails: false,
      noteCounters: {},
      selectedFilter: "allnotes",
      colors: ["blue", "red", "yellow", "green", "purple"],
    };
  },

  methods: {
    selectFilter(filter) {
      this.selectedFilter = filter;
      this.$emit("select-filter", filter);
    },
    setColor(tag, color) {
      this.$emit("set-color", tag, color);
    },
    addTag() {
      let tag = {
        id: Date.now(),
        name: this.generateIncrementedName("New tag"),
        color: "blue",
        selected: false,
      };
      this.tags.push(tag);
    },
    generateIncrementedName(baseTitle) {
      if (!this.noteCounters[baseTitle]) {
        this.noteCounters[baseTitle] = 1;
      } else {
        this.noteCounters[baseTitle] += 1;
      }
      return `${baseTitle} ${this.noteCounters[baseTitle]}`;
    },

    deleteTag(tag) {
      this.$emit("delete-tag", tag);
    },
    updateTagName(tag) {
      this.$emit("update-tag-name", { ...tag });
    },
  },
};
</script>
<style scoped>
#sidebar {
  padding: 0 0 0.5rem 0;
  height: calc(100vh - 95px);
  overflow-y: hidden;
}

.sidebar-item {
  list-style: none;
  display: flex;
  justify-content: space-between;
  position: relative;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 0.5rem;
  transition: 0.3s ease;
}

.sidebar-item i,
.sidebar-item div {
  width: 16px;
  height: 16px;
}
.sidebar-label {
  display: flex;
  justify-content: space-between;
  padding-right: 0.1rem;
}

.sidebar-sub-label {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.sidebar-item:hover,
.sidebar-sub-item:hover,
#sidebar-tags-btn:hover {
  background: #e4e4e7;
  cursor: pointer;
}
.sidebar-label:hover {
  background: var(--lightgrey);
}
.sidebar-sub-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.7rem 0.5rem 0.7rem 2rem;
}

#sidebar-container-list {
  position: relative;
  height: calc(100vh - 355px);
}
#sidebar-tags-list {
  overflow: auto;
  width: 100%;
  position: absolute;
  bottom: 0;
  top: 0;
}
#sidebar-tags-btn {
  height: 24px;
  width: 24px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
#sidebar-tag {
  transition: 0.3s ease;
}
#sidebar-tag:hover .tag-trash {
  opacity: 1;
  pointer-events: auto;
}
.tag-trash {
  display: flex;
  justify-content: space-between;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}
.tag-trash  {
  color: var(--red);
}
.tag-trash:hover {
  cursor: pointer;
}
.tag-selected,
.filterselected {
  background: #e4e4e7;
}
.sidebar-input-tag {
  background: none;
  border: none;
  box-shadow: none;
  width: 90%;
  padding: 0;
  height: 50%;
}
</style>
