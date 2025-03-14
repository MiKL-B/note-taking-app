<template>
    <button :disabled="!canCreateNote" @click="createNote" :title="$t('create_note')">
        <AppIcon iconName="Plus" class="size-16" />
    </button>
</template>

<script>
import AppIcon from './AppIcon.vue';
export default {
    name: "NoteCreator",
    components: { AppIcon },
    props: ["canCreateNote"],
    emits: ["create-note"],
    methods: {
        createNote() {
            this.$emit("create-note");
        },
    }
}
</script>