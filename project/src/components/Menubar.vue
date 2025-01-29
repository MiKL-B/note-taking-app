<template>
  <ul id="menubar">
    <li class="menubar-item">
      <span class="menubar-sub-label">
        <i class="fa-solid fa-file-lines"></i>
        <span>All notes</span>
      </span>
      <span class="text-grey">0</span>
    </li>
    <li class="menubar-item">
      <span class="menubar-sub-label">
        <div class="color-circle bg-red"></div>
        <span>Todo</span>
      </span>
      <span class="text-grey">0</span>
    </li>
    <li class="menubar-item">
      <span class="menubar-sub-label">
        <div class="color-circle bg-yellow"></div>
        <span>In progress</span>
      </span>
      <span class="text-grey">0</span>
    </li>
    <li class="menubar-item">
      <span class="menubar-sub-label">
        <div class="color-circle bg-green"></div>
        <span>Finished</span>
      </span>
      <span class="text-grey">0</span>
    </li>
    <li class="menubar-item">
      <span class="menubar-sub-label">
        <i class="fa-solid fa-trash-can"></i>
        <span>Trash</span>
      </span>
      <span class="text-grey">0</span>
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
          :class="tag.selected ? 'tag-selected' : ''"
          @click="selectTag(tag)"
          class="menubar-sub-item"
          v-for="tag in tags"
        >
          <span class="menubar-sub-label">
            <i class="fa-solid fa-tag" :style="{ color: tag.color }"></i>
            <span>{{ tag.name }}</span>
          </span>
          <div class="tag-trash">
            <i class="fa-solid fa-trash-can" @click="deleteTag(tag)"></i>
          </div>
          <span class="text-grey">0</span>
        </li>
      </ul>
    </div>
  </ul>
</template>

<script>
export default {
  name: "Menubar",
  props: ["tags"],
  data() {
    return {
      showDetails: false,
      colors: ["blue", "red", "yellow", "purple", "green"],
    };
  },

  methods: {
    addTag() {
      let tag = {
        id: Date.now(),
        name: "New tag",
        color: this.getColor(),
        selected: false,
      };
      this.tags.push(tag);
    },
    selectTag(tag) {
      this.$emit("select-tag", tag);
    },
    deleteTag(tag) {
      this.$emit("delete-tag", tag);
    },
    getColor() {
      let randomID = Math.floor(Math.random() * this.colors.length);
      return `var(--${this.colors[randomID]})`;
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

summary::after {
  content: "▼";
  position: absolute;
  right: 0.5rem;
  color: var(--grey);
}

details[open] summary::after {
  content: "▲";
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
.tag-selected {
  background: #e4e4e7;
}
</style>
