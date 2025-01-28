<template>
  <ul id="menubar">
    <li class="menu-item">
      <i class="fa-solid fa-file-lines"></i>
      <span>All notes</span>
    </li>
    <details>
      <summary>
        <i class="fa-solid fa-list-check"></i>
        <span>Status</span>
      </summary>
      <ul>
        <li class="sub-item">
          <div class="color-circle bg-red"></div>
          <span>Todo</span>
        </li>
        <li class="sub-item">
          <div class="color-circle bg-yellow"></div>
          <span>In progress</span>
        </li>
        <li class="sub-item">
          <div class="color-circle bg-green"></div>
          <span>Finished</span>
        </li>
      </ul>
    </details>
    <details>
      <summary>
        <i class="fa-solid fa-tags"></i>
        <span>Tags</span>
      </summary>
      <ul>
        <li class="sub-item">
          <i class="fa-solid fa-tag"></i>
          <span>Tag</span>
        </li>
      </ul>
    </details>
    <li class="menu-item">
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
.menu-item {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  padding-left: 1rem;
}

li {
  padding: 0.5rem;
}
li:hover {
  background: #e4e4e7;
  cursor: pointer;
}

details {
  cursor: pointer;
}

summary:hover {
  background: #e4e4e7;
}

summary {
  list-style: none;
  position: relative;
  display: flex;
  align-items: center;
  gap:0.2rem;
  padding: 0.5rem 0.5rem 0.5rem 1rem;
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
.sub-item {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.5rem 0.5rem 0.5rem 2rem;
}
.color-circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.bg-red {
  background: var(--red);
}
.bg-yellow {
  background: var(--yellow);
}
.bg-green {
  background: var(--green);
}
</style>
