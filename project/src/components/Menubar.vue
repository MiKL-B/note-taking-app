<template>
  <ul id="menubar">
    <li
      class="menubar-item"
      @click="selectFilter('allnotes')"
      :class="{ filterselected: selectedFilter === 'allnotes' }"
    >
      <span class="menubar-sub-label">
        <i class="fa-solid fa-file-lines"></i>
        <span>All notes</span>
      </span>
      <span class="text-grey">{{ countAllNotes }}</span>
    </li>
    <li
      class="menubar-item"
      @click="selectFilter('todo')"
      :class="{ filterselected: selectedFilter === 'todo' }"
    >
      <span class="menubar-sub-label">
        <div class="color-circle bg-red"></div>
        <span>Todo</span>
      </span>
      <span class="text-grey">{{ countTodo }}</span>
    </li>
    <li
      class="menubar-item"
      @click="selectFilter('inprogress')"
      :class="{ filterselected: selectedFilter === 'inprogress' }"
    >
      <span class="menubar-sub-label">
        <div class="color-circle bg-yellow"></div>
        <span>In progress</span>
      </span>
      <span class="text-grey">{{ countInProgress }}</span>
    </li>
    <li
      class="menubar-item"
      @click="selectFilter('finished')"
      :class="{ filterselected: selectedFilter === 'finished' }"
    >
      <span class="menubar-sub-label">
        <div class="color-circle bg-green"></div>
        <span>Finished</span>
      </span>
      <span class="text-grey">{{ countFinished }}</span>
    </li>
    <li
      class="menubar-item"
      @click="selectFilter('archived')"
      :class="{ filterselected: selectedFilter === 'archived' }"
    >
      <span class="menubar-sub-label">
        <i class="fa-solid fa-box-archive"></i>
        <span>Archived</span>
      </span>
      <span class="text-grey">{{ countArchived }}</span>
    </li>
    <li class="menubar-item menubar-label">
      <span class="menubar-sub-label">
        <i class="fa-solid fa-tags"></i>
        <span>Tags</span>
      </span>
      <span id="menubar-tags-btn" @click="addTag"
        ><i class="fa-solid fa-plus"></i
      ></span>
    </li>
    <div id="menubar-container-list">
      <ul id="menubar-tags-list">
        <li
          id="menubar-tag"
          @click="selectFilter(tag.name)"
          :class="{ filterselected: selectedFilter === tag.name }"
          class="menubar-sub-item"
          v-for="tag in tags"
        >
          <span class="menubar-sub-label">
            <details class="toolbar-details">
              <summary>
                <i
                  class="fa-solid fa-tag"
                  :style="`color: var(--${tag.color}`"
                ></i>
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
              class="menubar-input-tag"
              type="text"
              v-model="tag.name"
              @input="updateTagName(tag)"
            />
          </span>
          <div class="tag-trash">
            <i class="fa-solid fa-trash-can" @click="deleteTag(tag)"></i>
          </div>
        </li>
      </ul>
    </div>
  </ul>
</template>

<script>
export default {
  name: "Menubar",
  props: [
    "tags",
    "countAllNotes",
    "countTodo",
    "countInProgress",
    "countFinished",
    "countArchived",
  ],
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
    // selectTag(tag) {
    //   this.$emit("select-tag", tag);
    // },
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
#menubar {
  padding: 0 0 0.5rem 0;
  height: calc(100vh - 95px);
  overflow-y: hidden;
}

.menubar-item {
  list-style: none;
  display: flex;
  justify-content: space-between;
  position: relative;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 0.5rem;
  transition: 0.3s ease;
}

.menubar-item i,
.menubar-item div {
  width: 16px;
  height: 16px;
}
.menubar-label {
  display: flex;
  justify-content: space-between;
  padding-right: 0.1rem;
}

.menubar-sub-label {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.menubar-item:hover,
.menubar-sub-item:hover,
#menubar-tags-btn:hover {
  background: #e4e4e7;
  cursor: pointer;
}
.menubar-label:hover {
  background: var(--lightgrey);
}
.menubar-sub-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.7rem 0.5rem 0.7rem 2rem;
}

#menubar-container-list {
  position: relative;
  height: calc(100vh - 355px);
}
#menubar-tags-list {
  overflow: auto;
  width: 100%;
  position: absolute;
  bottom: 0;
  top: 0;
}
#menubar-tags-btn {
  height: 24px;
  width: 24px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
#menubar-tag {
  transition: 0.3s ease;
}
#menubar-tag:hover .tag-trash {
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
.tag-trash i {
  color: var(--red);
}
.tag-trash i:hover {
  cursor: pointer;
}
.tag-selected,
.filterselected {
  background: #e4e4e7;
}
.menubar-input-tag {
  background: none;
  border: none;
  box-shadow: none;
  width: 90%;
  padding: 0;
  height: 50%;
}
</style>
