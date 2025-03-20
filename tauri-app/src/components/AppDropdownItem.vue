<template>
    <li class="menu_item" @click.stop="handleSelect">
        <span class="menu_item_span">
            <span>{{ item.text }}</span>
            <span style="display:flex; justify-content: flex-end;" v-if="item.items && item.items.length > 0">
                <AppIcon iconName="ChevronRight" class="text-dark" />
            </span>
            <span style="display:flex; justify-content: flex-end;" v-else-if="item.check" class="size-16 text-dark">
                <AppIcon iconName="Check" />
            </span>
            <span v-if="item.cmd !== ''" class="text-dark">{{ item.cmd }}</span>
        </span>

        <ul class="details_menu_items" v-if="item.items && item.items.length > 0">
            <template v-for="subItem in item.items" :key="subItem.id">
                <AppDropdownItem :item="subItem" @select="subItem.action" />
            </template>
        </ul>
    </li>
    <hr v-if="item.separator" class="separator-x">


</template>
<script lang="ts" setup>

import AppIcon from './AppIcon.vue';
const emit = defineEmits(['select'])
const props = defineProps({
    item:{type:Object,required:true,}
})

const handleSelect = () => emit("select")
</script>
<style>
.menu_item {
    position: relative;
}

.menu_item_span {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr auto;
}

.details_menu_items {
    position: absolute;
    top: -3px;
    left: 190px;
    background: var(--bg-toolbar);
    z-index: 1;
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    user-select: none;
    width: 200px;
}

.details_menu_items li {
    display: none;
}

.details_menu li:hover .details_menu_items li {
    display: block;
}
</style>