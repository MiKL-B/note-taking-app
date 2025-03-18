<template>
    <button :disabled="!canCreateNote" @click="createNote" :title="$t('create_note')">
        <AppIcon iconName="Plus" />
    </button>
</template>


<script lang="ts" setup>
import AppIcon from './AppIcon.vue';
const props = defineProps({
    canCreateNote: {
        type: Boolean,
        default: true,
        required: true,
    }
})
const emit = defineEmits(["create-note"])
const createNote = () => emit("create-note")
</script>