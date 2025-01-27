<template>
  <div id="notebar">
    
      <select name="" id="">
        <option value="">Normal</option>
        <option value="">Heading 1</option>
        <option value="">Heading 2</option>
        <option value="">Heading 3</option>
      </select>
      <select name="" id="">
        <option value="">Arial</option>
        <option value="">Time New Roman</option>
        <option value="">Roboto</option>
        <option value="">Ubuntu</option>
      </select>
      <select name="" id="">
        <option value="">12</option>
        <option value="">14</option>
        <option value="">16</option>
        <option value="">18</option>
      </select>
      <span class="separator-y"></span>
      <button class="bt-symbol">B</button>
      <button class="bt-symbol">I</button>
      <button class="bt-symbol">U</button>
      <span class="separator-y"></span>
      <button class="bt-symbol">
        <i class="fa-solid fa-align-left"></i>
      </button>
      <button class="bt-symbol">
        <i class="fa-solid fa-align-center"></i>
      </button>
      <button class="bt-symbol">
        <i class="fa-solid fa-align-right"></i>
      </button>
      <button class="bt-symbol">
        <i class="fa-solid fa-align-justify"></i>
      </button>
      <span class="separator-y"></span>
      <button>

        <i class="fa-solid fa-eye"></i>
      </button>


  </div>
</template>

<script>
export default {
  name: "Notebar",
  components: {},
 
};
</script>

<style>
#notebar {
  border-bottom: var(--border);
  padding: 0.2rem;
  display: flex;
  flex-wrap: wrap;
  gap:0.2rem;
}

</style>
