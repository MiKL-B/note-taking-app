<template>
  <div
    id="notification"
    v-if="showNotification"
    :style="`background:var(--${color})`"
  >
    {{ message }}
  </div>
</template>

<script>
export default {
  name: "Notification",
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
  data() {
    return {
    //   showNotification: false,
    //   timerId: null,
    };
  },
  watch: {
    // active(newValue) {
    //   if (newValue) {
    //     this.show();
    //   }
    // },
  },
  methods: {
    // show() {
    //   this.showNotification = true;
    //   const duration = 2000;
    //   this.timerId = setTimeout(() => {
    //     this.showNotification = false;
    //   }, duration);
    // },
  },
//   beforeDestroy() {
//     clearTimeout(this.timerId);
//   },
};
</script>

<style>
#notification {
  border-radius: 5px;
  color: white;
  position: absolute;
  bottom: 30px;
  right: 0;
  width: 400px;
  height: 75px;
  z-index: 5;
  margin: 0.5rem;
  padding: 0.5rem;
}
</style>
