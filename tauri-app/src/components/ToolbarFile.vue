<template>
	<AppDropdown :title="$t('file')" btn="toolbar_btn">
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
	</AppDropdown>
</template>
<script>
import AppDropdown from "./AppDropdown.vue";

export default {
	name: "ToolbarFile",
	components: {
		AppDropdown,
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
					label: "duplicate_note",
					cmd: "Ctrl + D",
				},
				{
					label: "save",
					cmd: "Ctrl + S",
				},
				// {
				// 	label:"exportpdf",
				// 	cmd:"",
				// },
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
