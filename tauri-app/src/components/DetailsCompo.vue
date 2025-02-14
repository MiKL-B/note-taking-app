<template>
  <div class="details" ref="dropdown">
    <span @click="toggleDropdown" :class="btn">
      {{ title }}
      <component
        v-if="title === ''"
        :is="icon"
        class="size-16"
        :style="styleIcon"
      ></component>
    </span>
    <ul class="details-menu" v-if="isOpen" @click="toggleDropdown">
      <slot name="content"></slot>
    </ul>
  </div>
</template>

<script>
export default {
  name: "DetailsCompo",
  props: ["title", "btn", "icon", "styleIcon"],

  data() {
    return {
      isOpen: false,
      selectedOption: null,
    };
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    handleClickOutside(event) {
      if (this.isOpen && !this.$refs.dropdown.contains(event.target)) {
        this.isOpen = false;
      }
    },
  },
};
</script>
<style>
.details {
  display: flex;
  position: relative;
}
.details-menu {
  background-color: var(--bg-toolbar);
  position: absolute;
  z-index: 1;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  user-select: none;
  top: 33px;
  width: 200px;
}
.details-menu li {
  list-style-type: none;
  padding: 0.2rem 0.5rem;
  margin: 0.2rem;
  border-radius: 5px;
  cursor: pointer;
}
.details-menu li:hover {
  background: var(--bg-hover-toolbar);
  cursor: pointer;
}
summary {
  list-style-type: none;
}
</style>
