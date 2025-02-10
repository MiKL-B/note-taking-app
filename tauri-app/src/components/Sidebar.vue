<template>
  <ul id="sidebar">
    <li
      class="sidebar-item"
      @click="selectFilter(item.label)"
      :class="{ filterselected: selectedFilter === item.label }"
      v-for="item in computedItems"
    >
      <span class="sidebar-sub-label">
        <div
          v-if="item.icon === null"
          class="color-circle"
          :class="`bg-${item.color}`"
        ></div>
        <component v-else :is="item.icon" class="size-16"></component>
        <span>{{ $t(item.label) }}</span>
      </span>
      <span class="text-dark">{{ item.count }}</span>
    </li>

    <!-- tags -->
    <li class="sidebar-item" @click="toggleTagsMenu">
      <span class="sidebar-sub-label">
        <Tags class="size-16" />
        <span>Tags</span>
      </span>
      <span>
        <ChevronDown v-if="!tagsMenu" class="text-dark size-16" />
        <ChevronUp v-else class="text-dark size-16" />
      </span>
    </li>
    <ul v-if="tagsMenu" class="test">
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

        <Trash2 width="20" class="tag-trash" @click="deleteTag(tag)" />
      </li>
    </ul>
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
  FileWarning,
  ChevronDown,
  ChevronUp,
} from "lucide-vue-next";
export default {
  name: "Sidebar",
  props: {
    tags: Array,
    countAllNotes: {
      type: Number,
      default: 0,
    },
    countTodo: {
      type: Number,
      default: 0,
    },
    countInProgress: {
      type: Number,
      default: 0,
    },
    countFinished: {
      type: Number,
      default: 0,
    },
    countArchived: {
      type: Number,
      default: 0,
    },
    countPinned: {
      type: Number,
      default: 0,
    },
    countToday: {
      type: Number,
      default: 0,
    },
    countImportant: {
      type: Number,
      default: 0,
    },
  },
  emits: [
    "select-filter",
    "set-color",
    "add-tag",
    "delete-tag",
    "update-tag-name",
  ],
  components: {
    File,
    Archive,
    Tags,
    Tag,
    Plus,
    Trash2,
    Pin,
    Calendar,
    FileWarning,
    ChevronDown,
    ChevronUp,
  },
  data() {
    return {
      showDetails: false,
      noteCounters: {},
      selectedFilter: "allnotes",
      colors: ["blue", "red", "yellow", "green", "purple"],
      tagsMenu: false,
    };
  },
  computed: {
    computedItems() {
      return [
        {
          label: "allnotes",
          count: this.countAllNotes,
          icon: File,
        },
        {
          label: "pinned",
          count: this.countPinned,
          icon: Pin,
        },
        {
          label: "important",
          count: this.countImportant,
          icon: FileWarning,
        },
        {
          label: "today",
          count: this.countToday,
          icon: Calendar,
        },
        {
          label: "todo",
          count: this.countTodo,
          icon: null,
          color: "red",
        },
        {
          label: "inprogress",
          count: this.countInProgress,
          icon: null,
          color: "yellow",
        },
        {
          label: "finished",
          count: this.countFinished,
          icon: null,
          color: "green",
        },
        {
          label: "archived",
          count: this.countArchived,
          icon: Archive,
        },
      ];
    },
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
      this.$emit("add-tag");
    },
    deleteTag(tag) {
      this.$emit("delete-tag", tag);
    },
    updateTagName(tag) {
      this.$emit("update-tag-name", { ...tag });
    },
    toggleTagsMenu() {
      this.tagsMenu = !this.tagsMenu;
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
  color: var(--text-color-sidebar);
  border-right: var(--border);
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
  background: var(--bg-hover-sidebar);
  cursor: pointer;
}
.sidebar-label:hover {
  background: none;
}
.sidebar-sub-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.7rem 0.5rem 0.7rem 2rem;
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

  color: var(--text-color-sidebar);
}

.test{
  height: calc(100% - 375px);
  overflow-y: scroll;
}
</style>
