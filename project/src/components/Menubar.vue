<template>
  <ul id="menubar">
    <li class="menubar-item">
      <i class="fa-solid fa-file-lines"></i>
      <span>All notes</span>
    </li>
    <li class="menubar-item">
      <div class="color-circle bg-red"></div>
      <span>Todo</span>
    </li>
    <li class="menubar-item">
      <div class="color-circle bg-yellow"></div>
      <span>In progress</span>
    </li>
    <li class="menubar-item">
      <div class="color-circle bg-green"></div>
      <span>Finished</span>
    </li>
    <li class="menubar-item">
      <i class="fa-solid fa-trash-can"></i>
      <span>Trash</span>
    </li>
    <div id="details-tags">
      <details>
        <summary class="menubar-item">
          <i class="fa-solid fa-tags"></i>
          <span>Tags</span>
        </summary>
        <ul id="tags-list">
          <li class="menubar-sub-item" v-for="tag in tags">
            <i class="fa-solid fa-tag"></i>
            <span>{{tag}}</span>
          </li>
        </ul>
      </details>
      <span id="details-tags-btn" @click="addTag"><i class="fa-solid fa-plus"></i></span>
    </div>
    
  </ul>
</template>

<script>
export default {
  name: "Menubar",
  data(){
    return{
      tags:[]
    }
  },
  methods:{
    addTag(){
      this.tags.push("New tag")
    }
  }
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
#tags-list{
  max-height:650px;
  overflow: auto;
  width:100%;
  padding:0;
}
#details-tags {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}
#details-tags details {
  flex-grow: 1;
}
#details-tags-btn {
  padding: 0.6rem 0.5rem;
  cursor: pointer;
  height:42px;
}
#details-tags-btn:hover {
  background: #e4e4e7;
}
</style>
