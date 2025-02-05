<template>
  <div id="notebar" @wheel.prevent="handleScroll">
    <select name="" id="">
      <option value="" disabled selected>{{$t('font')}}</option>
      <option value="">Arial</option>
      <option value="">Time New Roman</option>
      <option value="">Roboto</option>
      <option value="">Ubuntu</option>
    </select>
    <select name="" id="">
      <option value="" disabled selected>{{$t('font_size')}}</option>
      <option value="">12</option>
      <option value="">14</option>
      <option value="">16</option>
      <option value="">18</option>
    </select>
    <span class="separator-y"></span>
    <button class="bt-symbol" title="Bold">
      <Bold />
    </button>
    <button class="bt-symbol" title="Italic">
      <Italic />
    </button>
    <button class="bt-symbol" title="Underline">
      <Underline />
    </button>
    <input type="color" />
    <span class="separator-y"></span>
    <button class="bt-symbol" title="Align left">
      <AlignLeft />
    </button>
    <button class="bt-symbol" title="Align center">
      <AlignCenter />
    </button>
    <button class="bt-symbol" title="Align right">
      <AlignRight />
    </button>
    <button class="bt-symbol" title="Align justify">
      <AlignJustify />
    </button>
  </div>
</template>

<script>
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-vue-next";
export default {
  name: "Notebar",
  components: {
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
  },
  data() {
    return {};
  },
  methods: {
    handleScroll(event) {
      const scrollSpeed = 0.2;
      const deltaY = event.deltaY * scrollSpeed;

      const notebar = this.$el;

      notebar.scrollBy({
        top: deltaY,
        left: 0,
        behavior: "smooth",
      });
    },
  },
};
</script>

<style scoped>
#notebar {
  border-bottom: var(--border);
  padding: 0.2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
  height: 42px;
  overflow-y: auto;
}
</style>
