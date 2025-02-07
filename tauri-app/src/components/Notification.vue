<template>
  <div v-if="showNotification" id="notification" :style="`background:var(--${color})`">
    <span v-if="color === 'green'">
      <CircleCheck />
    </span>
    <span v-else-if="color === 'yellow'">
      <Info />
    </span>
    <span v-else-if="color === 'red'">
      <TriangleAlert />
    </span>
    {{ message }}
  </div>
</template>

<script>
import { CircleCheck, Info, TriangleAlert } from "lucide-vue-next";
export default {
  name: "Notification",
  components: {
    CircleCheck,
    Info,
    TriangleAlert,
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
