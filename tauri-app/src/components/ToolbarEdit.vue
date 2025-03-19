<template>
	<AppDropdown :title="$t('edit')" btn="toolbar_btn">
		<template v-slot:content>
			<li class="flex justify-between" v-for="item in menuItems" :key="item" @click="onSubMenuClick(item.label)">
				<span>
					{{ $t(item.label) }}
				</span>
				<span class="text-dark">{{ item.cmd }}</span>
			</li>
		</template>
	</AppDropdown>
</template>
<script>
import AppDropdown from "./AppDropdown.vue";

export default {
	name: "ToolbarEdit",
	components: {
		AppDropdown,
	},
	emits: ["action-clicked"],
	data() {
		return {
			menuItems: [
				{
					label: "undo",
					cmd: "Ctrl + Z",
				},
				{
					label: "redo",
					cmd: "Ctrl + Y",
				},
				{
					label: "cut",
					cmd: "Ctrl + X",
				},
				{
					label: "copy",
					cmd: "Ctrl + C",
				},
				{
					label: "paste",
					cmd: "Ctrl + V",
				},
				{
					label: "select_all",
					cmd: "Ctrl + A",
				},
			],
		};
	},
	methods: {
		onSubMenuClick(action) {
			this.$emit("action-clicked", action);
		},
	},
};
</script>
<style></style>
