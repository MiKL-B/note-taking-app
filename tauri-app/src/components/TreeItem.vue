<template>
  <li class="sidebar-item justify-between" @click="toggle">
    <span class="flex align-center gap-4">
      <div v-if="node.isDirectory">
        <FolderOpen v-if="isOpen" class="text-dark size-16" />
        <FolderOpen
          v-else-if="node.children && node.children.length === 0"
          class="text-dark size-16"
        />
        <Folder v-else class="text-dark size-16" />
      </div>
      <File v-else class="text-dark size-16" />
      <span class="tree-item-ellipsis" :title="node.name">{{ node.name }}</span>
    </span>
    <span v-if="node.isDirectory">
      <ChevronDown v-if="!isOpen" class="text-dark size-16" />
      <ChevronUp v-else class="text-dark size-16" />
    </span>
  </li>
  <ul v-if="isOpen && node.children && node.children.length > 0">
    <li class="tree-children">
      <TreeItem
        v-for="(child, index) in sortedChildren"
        :key="index"
        :node="child"
      />
    </li>
  </ul>
</template>

<script>
import {
  Folder,
  FolderOpen,
  File,
  ChevronDown,
  ChevronUp,
} from "lucide-vue-next";

export default {
  name: "TreeItem",
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  components: {
    Folder,
    FolderOpen,
    File,
    ChevronDown,
    ChevronUp,
  },
  data() {
    return {
      isOpen: false,
      folerIcon: Folder,
    };
  },
  computed: {
    isFolder() {
      return this.node.children && this.node.children.length > 0;
    },
    sortedChildren() {
      if (!this.node.children) {
        return [];
      }
      return [...this.node.children].sort((a, b) => {
        const isAFolder = a.children && a.children.length > 0;
        const isBFolder = b.children && b.children.length > 0;

        if (isAFolder && !isBFolder) {
          return -1;
        } else if (!isAFolder && isBFolder) {
          return 1;
        } else {
          return 0;
        }
      });
    },
  },
  methods: {
    toggle() {
      if (this.isFolder) {
        this.isOpen = !this.isOpen;
      }
    },
  },
};
</script>

<style scoped>
.tree-item {
  margin-left: 0.5rem;
  user-select: none;
}

.tree-children {
  padding-left: 0.5rem;
  user-select: none;
  border-left:var(--border);
}
.tree-item-ellipsis{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 120px;
}
</style>
