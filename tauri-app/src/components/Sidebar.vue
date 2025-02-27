<template>
  <ul id="sidebar">
    <!-- notes -->
    <li
      class="sidebar-item justify-between"
      @click="selectFilter('allnotes')"
      :class="{ filterselected: selectedFilter === 'allnotes' }"
    >
      <span class="flex align-center gap-4 ">
        <File class="size-16 text-dark" />
        <span>{{ $t("allnotes") }}</span>
      </span>
      <span class="text-dark">{{ counters.allNotes }}</span>
    </li>
    <!-- folder -->
    <!-- <SidebarTreeView v-if="tree !== null" :node="tree"/> -->

    <!-- others -->
    <li
      class="sidebar-item justify-between"
      @click="selectFilter(item.label)"
      :class="{ filterselected: selectedFilter === item.label }"
      v-for="item in computedItems"
    >
      <span class="flex align-center gap-4">
        <div
          v-if="item.icon === null"
          class="color-circle"
          :class="`bg-${item.color}`"
        ></div>
        <component v-else :is="item.icon" class="size-16 text-dark"></component>
        <span>{{ $t(item.label) }}</span>
      </span>
      <span class="text-dark">{{ item.count }}</span>
    </li>
    <!-- tags -->
    <li class="sidebar-item justify-between" @click="toggleTagsMenu">
      <span class="flex align-center gap-4">
        <Tags class="size-16 text-dark" />
        <span>Tags</span>
      </span>
      <span>
        <ChevronDown v-if="!tagsMenu" class="text-dark size-16" />
        <ChevronUp v-else class="text-dark size-16" />
      </span>
    </li>
    <ul v-if="tagsMenu">
      <li
        id="sidebar-tag"
        @click="selectFilter(tag.name)"
        :class="{ filterselected: selectedFilter === tag.name }"
        class="sidebar-sub-item"
        v-for="tag in tags"
      >
        <span class="flex align-center gap-4">
          <MenuDropdown
            title=""
            :icon="tagIcon"
            :styleIcon="`color: var(--${tag.color})`"
          >
            <template v-slot:content>
              <li
                class="flex gap-4 align-center"
                v-for="color in colors"
                @click="setColor(tag, color)"
              >
                <div class="color-circle" :class="`bg-${color}`"></div>
                <span>{{ color }}</span>
              </li>
            </template>
          </MenuDropdown>

          <input
            class="sidebar-input-tag"
            type="text"
            v-model="tag.name"
            @input="updateTagName(tag)"
          />
          <Trash2 width="20" class="tag-trash" @click="deleteTag(tag)" />
        </span>
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
  Folder,
} from "lucide-vue-next";
import MenuDropdown from "./MenuDropdown.vue";
// import SidebarTreeView from "./SidebarTreeView.vue";
export default {
  name: "Sidebar",
  props: {
    tags: Array,
    tree: Object,
    counters: {
      type: Object,
      default: () => ({
        allNotes: 0,
        pinned: 0,
        important: 0,
        today: 0,
        todo: 0,
        inProgress: 0,
        finished: 0,
        archived: 0,
      }),
    },
  },
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
    FileWarning,
    ChevronDown,
    ChevronUp,
    Folder,
    MenuDropdown,
    // SidebarTreeView,
  },
  data() {
    return {
      showDetails: false,
      noteCounters: {},
      selectedFilter: "allnotes",
      colors: [
        "brown",
        "red",
        "orange",
        "yellow",
        "green",
        "cyan",
        "blue",
        "purple",
        "pink",
      ],
      tagsMenu: false,
      tagIcon: Tag,
    };
  },

  computed: {
    computedItems() {
      return [
        {
          label: "pinned",
          count: this.counters.pinned,
          icon: Pin,
        },
        {
          label: "important",
          count: this.counters.important,
          icon: FileWarning,
        },
        {
          label: "today",
          count: this.counters.today,
          icon: Calendar,
        },
        {
          label: "todo",
          count: this.counters.todo,
          icon: null,
          color: "red",
        },
        {
          label: "inprogress",
          count: this.counters.inProgress,
          icon: null,
          color: "yellow",
        },
        {
          label: "finished",
          count: this.counters.finished,
          icon: null,
          color: "green",
        },
        {
          label: "archived",
          count: this.counters.archived,
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
<style>
#sidebar {
  height: calc(100vh - 66px);
  overflow-y: auto;
  background: var(--bg-sidebar);
  color: var(--text-color-sidebar);
  border-right: var(--border);

}

.sidebar-item {
  list-style: none;
  display: flex;
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

.sidebar-item:hover,
.sidebar-sub-item:hover {
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
</style>
