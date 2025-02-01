<template>
  <div
    id="markdown-container"
    v-if="isPreviewMode"
    v-html="getMarkdownHtml"
  ></div>
  <textarea
    v-else
    placeholder="Enter text here..."
    v-model="markdownText"
  ></textarea>
</template>

<script>
import { marked } from "marked";
export default {
  name: "MarkdownEditor",
  props: {
    initialMarkdown: {
      type: String,
      default: "",
    },
    isPreviewMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      markdownText: this.initialMarkdown,
    };
  },
  computed: {
    getMarkdownHtml() {
      return marked(this.markdownText, { sanitize: true });
    },
  },
};
</script>

