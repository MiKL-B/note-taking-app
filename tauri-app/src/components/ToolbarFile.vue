<template>
	<MenuDropdown :title="$t('file')" btn="toolbar-btn">
		<template v-slot:content>
			<li
				v-for="item in menuItems"
				:key="item"
				@click="onSubMenuClick(item)"
			>
				{{ $t(item) }}
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
				"newnote",
				"opennote",
				"openfolder",
				"save",
				"saveas",
				"exportjson",
				"importjson",
				"exit",
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
