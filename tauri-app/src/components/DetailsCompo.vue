<template>
  <details class="toolbar-details" :title="title" @click="handleClickOnDetails">
    <summary :class="btn">
      <slot name="header"></slot>
    </summary>

    <ul class="details-menu">
      <slot name="content"></slot>
    </ul>
  </details>
</template>

<script>
export default {
  name: "DetailsCompo",
  props: ["title", "btn"],
  mounted() {
    document.addEventListener("click", this.closeDetails);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.closeDetails);
  },
  methods: {
    handleClickOnDetails() {
      let detailsOpened = document.querySelectorAll(".toolbar-details");
      for (const item of detailsOpened) {
        if (this != item) {
          item.removeAttribute("open");
        }
      }
    },
    closeDetails(event) {
      if (!event.target.closest("details")) {
        let detailsOpened = document.querySelectorAll(".toolbar-details");
        detailsOpened.forEach((item) => {
          item.removeAttribute("open");
        });
      }
    },
  },
};
</script>
<style>
.details-menu {
  background-color: var(--bg-toolbar);
  position: absolute;
  z-index: 1;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  min-width: 100px;
  user-select: none;
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
</style>
