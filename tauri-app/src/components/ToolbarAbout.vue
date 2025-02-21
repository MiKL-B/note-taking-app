<template>
	<DetailsCompo :title="$t('about')" btn="toolbar-btn">
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
	</DetailsCompo>
</template>

<script>
import DetailsCompo from "./DetailsCompo.vue";

export default {
	name: "ToolbarAbout",
		emits:["action-clicked"],
	components:{
		DetailsCompo
	},
	methods: {
		onSubMenuClick(action) {
			this.$emit("action-clicked", action);
		},
		displayAbout() {
			let msg = `Thoth 0.1.0\r\n${this.$t("developed")}`;
			alert(msg + " Becquer Michaël.");
		},
	},
};
</script>
