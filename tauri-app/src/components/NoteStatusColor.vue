<template>
    <div class="note_status_color color-circle" :class="`bg-${getStatusColor(status_ID)}`"></div>
</template>

<script lang="ts" setup>
const props = defineProps({
    status_ID:{
        type:Number,
        required:true,
        default:1,
    }
});
const getStatusColor = (status_ID:number) => {
    let color = "";
    switch (status_ID) {
        case 1:
            color = "red";
            break;
        case 2:
            color = "yellow";
            break;
        case 3:
            color = "green";
            break;
        case 4:
            color = "grey";
            break;
    }
    return color;
};
</script>

<style>
.note_status_color {
    margin: auto 0;
    min-width: 10px;
    height: 10px;
}
</style>