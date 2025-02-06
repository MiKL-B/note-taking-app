<template>
  <ul id="sidebar">
    <!-- all notes -->
    <li
      class="sidebar-item"
      @click="selectFilter('allnotes')"
      :class="{ filterselected: selectedFilter === 'allnotes' }"
    >
      <span class="sidebar-sub-label">
        <File class="size-16" />
        <span>{{ $t("allnotes") }}</span>
      </span>
      <span class="text-dark">{{ countAllNotes }}</span>
    </li>
    <!-- pinned -->
    <li
      class="sidebar-item"
      @click="selectFilter('pinned')"
      :class="{ filterselected: selectedFilter === 'pinned' }"
    >
      <span class="sidebar-sub-label">
        <Pin class="size-16" />
        <span>{{ $t("pinned") }}</span>
      </span>
      <span class="text-dark">{{ countPinned }}</span>
    </li>
    <!-- important -->
    <li
      class="sidebar-item"
      @click="selectFilter('important')"
      :class="{ filterselected: selectedFilter === 'important' }"
    >
      <span class="sidebar-sub-label">
        <FileWarning class="size-16"/>
        <span>{{ $t("important") }}</span>
      </span>
      <span class="text-dark">{{ countImportant }}</span>
    </li>
    <!-- today -->
    <li
      class="sidebar-item"
      @click="selectFilter('today')"
      :class="{ filterselected: selectedFilter === 'today' }"
    >
      <span class="sidebar-sub-label">
        <Calendar class="size-16" />
        <span>{{ $t("today") }}</span>
      </span>
      <span class="text-dark">{{ countToday }}</span>
    </li>
    <!-- todo -->
    <li
      class="sidebar-item"
      @click="selectFilter('todo')"
      :class="{ filterselected: selectedFilter === 'todo' }"
    >
      <span class="sidebar-sub-label">
        <div class="color-circle bg-red"></div>
        <span>{{ $t("todo") }}</span>
      </span>
      <span class="text-dark">{{ countTodo }}</span>
    </li>
    <!-- inprogress -->
    <li
      class="sidebar-item"
      @click="selectFilter('inprogress')"
      :class="{ filterselected: selectedFilter === 'inprogress' }"
    >
      <span class="sidebar-sub-label">
        <div class="color-circle bg-yellow"></div>
        <span>{{ $t("inprogress") }}</span>
      </span>
      <span class="text-dark">{{ countInProgress }}</span>
    </li>
    <!-- finished -->
    <li
      class="sidebar-item"
      @click="selectFilter('finished')"
      :class="{ filterselected: selectedFilter === 'finished' }"
    >
      <span class="sidebar-sub-label">
        <div class="color-circle bg-green"></div>
        <span>{{ $t("finished") }}</span>
      </span>
      <span class="text-dark">{{ countFinished }}</span>
    </li>
    <!-- archived -->
    <li
      class="sidebar-item"
      @click="selectFilter('archived')"
      :class="{ filterselected: selectedFilter === 'archived' }"
    >
      <span class="sidebar-sub-label">
        <Archive class="size-16" />
        <span>{{ $t("archived") }}</span>
      </span>
      <span class="text-dark">{{ countArchived }}</span>
    </li>
    <!-- tags -->
    <li class="sidebar-item sidebar-label">
      <span class="sidebar-sub-label">
        <Tags class="size-16" />
        <span>Tags</span>
      </span>
      <span id="sidebar-tags-btn" @click="addTag"
        ><Plus class="text-dark size-16"
      /></span>
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
                <Tag :style="`color: var(--${tag.color}`" class="size-16" />
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
import {
  File,
  Archive,
  Tags,
  Tag,
  Plus,
  Trash2,
  Pin,
  Calendar,
  FileWarning
} from "lucide-vue-next";
export default {
  name: "Sidebar",
  props: [
    "tags",
    "countAllNotes",
    "countTodo",
    "countInProgress",
    "countFinished",
    "countArchived",
    "countPinned",
    "countToday",
    "countImportant",
  ],
  emits: ["select-filter", "set-color", "delete-tag", "update-tag-name"],
  components: {
    File,
    Archive,
    Tags,
    Tag,
    Plus,
    Trash2,
    Pin,
    Calendar,
    FileWarning
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
        name: this.generateIncrementedName("Tag"),
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
  height: calc(100vh - 65px);
  overflow-y: hidden;
  background: var(--bg-sidebar);
  color:var(--text-color-sidebar);
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
  background:var(--bg-hover-sidebar);
  cursor: pointer;
}
.sidebar-label:hover {
  background:none;
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
  width: 24px;
  justify-content: space-between;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}
.tag-trash {
  color: var(--red);
}
.tag-trash:hover {
  cursor: pointer;
}
.tag-selected,
.filterselected {
  background: var(--bg-selected-sidebar);
}
.sidebar-input-tag {
  background: none;
  border: none;
  box-shadow: none;
  width: 90%;
  padding: 0;
  height: 50%;
  color:var(--text-color-sidebar);
}

</style>
