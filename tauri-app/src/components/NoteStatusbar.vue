<template>
  <div id="statusbar">
    <span v-if="characterCount !== 0"
      >{{ $t("characters") }}: {{ characterCount.toString() }}</span
    >
    <span v-if="wordCount !== 0">{{ $t("words") }}: {{ wordCount.toString() }}</span>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  characterCount:{
    type:Number,
    default:0,
    required:true,
  },
  wordCount:{
    type:Number,
    default:0,
    required:true,
  }
})
</script>
<style>
#statusbar {
  position: fixed;
  width: 100%;
  bottom: 0;
  height: 30px;
  padding-left: 0.5rem;
  color: var(--text-color-statusbar);
  display: flex;
  gap: 1rem;
  user-select: none;
  align-items: center;
  border-top: var(--border);
}
</style>
