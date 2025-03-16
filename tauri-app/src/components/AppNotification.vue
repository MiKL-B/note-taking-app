<template>
  <div
    v-if="showNotification"
    id="notification"
    :style="`background:var(--${color})`"
  >
    <span v-if="color === 'green'">
      <AppIcon iconName="CircleCheck" />
    </span>
    <span v-else-if="color === 'yellow'">
      <AppIcon iconName="Info" />
    </span>
    <span v-else-if="color === 'red'">
      <AppIcon iconName="TriangleAlert" />
    </span>
    {{ message }}
  </div>
</template>

<script>
import AppIcon from "./AppIcon.vue";
export default {
  name: "AppNotification",
  components: {
    AppIcon,
  },
  props: {
    showNotification: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "",
    },
  },
};
</script>

<style>
#notification {
  display: flex;
  align-items: center;
  border-radius: 5px;
  color: white;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 400px;
  gap: 0.5rem;
  z-index: 5;
  margin: 0.5rem;
  padding: 1rem;
}
</style>
