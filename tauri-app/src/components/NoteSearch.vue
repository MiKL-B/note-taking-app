<template>
    <input type="text" :value="modelValue" @input="handleSearch" :placeholder="$t('filter_note_by_name')" />
</template>

<script>
export default {
    name: "NoteSearch",
    props: ["modelValue"],
    emits: ['update:modelValue'],
    methods: {
        handleSearch() {
            this.$emit('update:modelValue', event.target.value)
        }
    }
}
</script>