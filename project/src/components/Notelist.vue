<template>
  <div id="notelist">
    <div id="note" v-for="i in 50">
      <div class="note-content">
        <h4>Welcome note {{ i }}</h4>
        <p class="note-description">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti,
          fugiat! Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          Corrupti, fugiat!
        </p>
        <span>Jan 25, 2025</span>
      </div>
      <div class="note-trash">
        <i class="fa-solid fa-trash-can"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Notelist",
};
</script>
<style>
#notelist {
  /* border: 1px solid red; */
  margin-top: 0.5rem;
  height: calc(100vh - 150px);
  overflow-y: auto;
}

#note {
  margin: 0 0.2rem 0.2rem 0.2rem;
  border-radius: 5px;
  padding: 0.5rem;
  display: grid;
  grid-template-columns: 200px auto;
  transition: 0.3s ease;
}
#note:hover .note-trash {
  opacity: 1;
  pointer-events: auto;
}
#note:hover {
  background: #f4f4f5;
  cursor: pointer;
}
.note-description {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.note-trash {
  display: flex;
  margin:auto;
  opacity: 0; 
  transition: opacity 0.3s ease; 
  pointer-events: none;
}
.note-trash i {
  color: var(--red);
}
.note-trash i:hover {
  cursor: pointer;
}
</style>
