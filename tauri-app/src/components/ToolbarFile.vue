<template>
	<DetailsCompo :title="$t('file')" btn="toolbar-btn">
		<template v-slot:content>
			<li
				v-for="item in menuItems"
				:key="item"
				@click="onSubMenuClick(item)"
			>
				{{ $t(item) }}
			</li>
		</template>
	</DetailsCompo>
</template>
<script>
import DetailsCompo from "./DetailsCompo.vue";

export default {
	name: "ToolbarFile",
	components: {
		DetailsCompo,
	},
	emits: ["action-clicked"],
	data() {
		return {
			menuItems: [
				"newnote",
				"opennote",
				"openfolder",
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
