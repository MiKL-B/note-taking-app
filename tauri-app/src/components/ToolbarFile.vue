<template>
	<MenuDropdown :title="$t('file')" btn="toolbar-btn">
		<template v-slot:content>
			<li
				class="flex justify-between"
				v-for="item in menuItems"
				:key="item"
				@click="onSubMenuClick(item.label)"
			>
				<span>
					{{ $t(item.label) }}
				</span>
				<span class="text-dark">{{ item.cmd }}</span>
			</li>
		</template>
	</MenuDropdown>
</template>
<script>
import MenuDropdown from "./MenuDropdown.vue";

export default {
	name: "ToolbarFile",
	components: {
		MenuDropdown,
	},
	emits: ["action-clicked"],
	data() {
		return {
			menuItems: [
				{
					label: "newnote",
					cmd: "Ctrl + N",
				},
				{
					label: "opennote",
					cmd: "",
				},
				{
					label: "openfolder",
					cmd: "",
				},
				{
					label: "save",
					cmd: "Ctrl + S",
				},
				{
					label: "saveas",
					cmd: "",
				},
				{
					label: "exportjson",
					cmd: "",
				},
				{
					label: "importjson",
					cmd: "",
				},
				{
					label: "exit",
					cmd: "Ctrl + Q",
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
