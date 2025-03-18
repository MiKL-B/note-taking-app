<template>
  <div class="details" ref="dropdown">
    <span @click="toggleDropdown" :class="btn">
      {{ title }}
      <AppIcon v-if="title === ''" :iconName="icon" :style="styleIcon" />
    </span>
    <ul class="details_menu" v-if="isOpen" @click="toggleDropdown">
      <slot name="content"></slot>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import AppIcon from './AppIcon.vue';

let isOpen = ref(false);
const dropdown = ref();
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  btn: {
    type: String,
    default: ""
  },
  icon: {
    type: String,
    default: ""
  },
  styleIcon: {
    type: String,
    default: ""
  }
})
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
})
onBeforeUnmount(()=>{
  document.removeEventListener("click", handleClickOutside);
})
const handleClickOutside = (event: MouseEvent) => {
  if (isOpen && dropdown.value && !dropdown.value.contains(event.target)) {
    isOpen.value = false;
  }
}
const toggleDropdown = () =>{
  isOpen.value = !isOpen.value;
}
</script>
<style>
.details {
  display: flex;
  position: relative;
}

.details_menu {
  background-color: var(--bg-toolbar);
  position: absolute;
  z-index: 1;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  user-select: none;
  top: 33px;
  width: 200px;
}

.details_menu li {
  list-style-type: none;
  padding: 0.2rem 0.5rem;
  margin: 0.2rem;
  border-radius: 5px;
  cursor: pointer;
}

.details_menu li:hover {
  background: var(--bg-hover-toolbar);
  cursor: pointer;
}

.details_menu li:hover hr {
  background: none;
  cursor: default;
}

.details_menu p {
  padding: 0.2rem 0.5rem;
  margin: 0.2rem;
  display: flex;
  font-weight: 600;
}

summary {
  list-style-type: none;
}
</style>
