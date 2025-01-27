<template>
  <div id="notelist">
    <div v-for="i in 50">
      {{ i }}
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
</style>
