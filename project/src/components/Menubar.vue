<template>
  <ul id="menubar">
    <li class="menubar-item">
      <i class="fa-solid fa-file-lines"></i>
      <span>All notes</span>
    </li>
    <details>
      <summary class="menubar-item">
        <i class="fa-solid fa-list-check"></i>
        <span>Status</span>
      </summary>
      <ul>
        <li class="menubar-sub-item">
          <div class="color-circle bg-red"></div>
          <span>Todo</span>
        </li>
        <li class="menubar-sub-item">
          <div class="color-circle bg-yellow"></div>
          <span>In progress</span>
        </li>
        <li class="menubar-sub-item">
          <div class="color-circle bg-green"></div>
          <span>Finished</span>
        </li>
      </ul>
    </details>
    <details>
      <summary class="menubar-item">
        <i class="fa-solid fa-tags"></i>
        <span>Tags</span>
      </summary>
      <ul>
        <li class="menubar-sub-item">
          <i class="fa-solid fa-tag"></i>
          <span>Tag</span>
        </li>
      </ul>
    </details>
    <li class="menubar-item">
      <i class="fa-solid fa-trash-can"></i>
      <span>Trash</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: "Menubar",
};
</script>
<style scoped>
#menubar {
  padding: 0 0 0.5rem 0;
  height: calc(100vh - 95px);
  overflow-y: auto;
}
.menubar-item {
  list-style: none;
  display: flex;
  position: relative;
  align-items: center;
  gap: 0.2rem;
  padding: 0.7rem 0.5rem;
}
.menubar-item:hover,
.menubar-sub-item:hover {
  background: #e4e4e7;
  cursor: pointer;
}
.menubar-sub-item {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.5rem 0.5rem 0.5rem 2rem;
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

</style>
