<template>
  <div v-if="showMenu" class="context-menu" :style="menuStyle">
    <ul>
      <slot name="content"></slot>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ContextMenu",

  data() {
    return {
      showMenu: false,
      menuStyle: {
        left: "0px",
        top: "0px",
      },
    };
  },
  mounted() {
    document.addEventListener("click", this.closeMenu);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.closeMenu);
  },
  methods: {
    showContextMenu(event) {
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
.context-menu {
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
