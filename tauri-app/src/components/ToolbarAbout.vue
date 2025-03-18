<template>
	<AppDropdown :title="$t('about')" btn="toolbar-btn">
		<template v-slot:content>
			<li @click="onSubMenuClick('opennotedemo')">
				{{ $t("opennotedemo") }}
			</li>
			<hr class="separator-x" />
			<li>
				<a href="https://github.com/MiKL-B/" target="_blank">{{
					$t("website")
				}}</a>
			</li>
			<li @click="displayAbout">
				{{ $t("developer") }}
			</li>
		</template>
	</AppDropdown>
</template>

<script>
import AppDropdown from "./AppDropdown.vue";

export default {
	name: "ToolbarAbout",
		emits:["action-clicked","display-about"],
	components:{
		AppDropdown
	},
	methods: {
		onSubMenuClick(action) {
			this.$emit("action-clicked", action);
		},
		displayAbout() {
			this.$emit("display-about")
		},
	},
};
</script>
