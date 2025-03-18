<template>
    <input type="text" :value="modelValue" @input="handleSearch" :placeholder="$t('filter_note_by_name')" />
</template>


<script lang="ts" setup>
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const handleSearch = (event: InputEvent) => {
    const inputElement = event.target as HTMLInputElement;
    emit('update:modelValue', inputElement.value);
};
</script>