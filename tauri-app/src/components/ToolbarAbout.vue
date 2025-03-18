<template>
	<AppDropdown :title="$t('about')" btn="toolbar_btn">
		<template v-slot:content>
			<li @click="onSubMenuClick('opennotedemo')">
				{{ $t("opennotedemo") }}
			</li>
			<hr class="separator-x" />
			<li>
				<a href="https://github.com/MiKL-B/note-taking-app" target="_blank">{{
					$t("website")
				}}</a>
			</li>
			<li @click="displayAbout">
				{{ $t("developer") }}
			</li>
		</template>
	</AppDropdown>
</template>

<script lang="ts" setup>
import AppDropdown from "./AppDropdown.vue";
const emit = defineEmits(["action-clicked", 'display-about'])
const onSubMenuClick = (action: string) => emit("action-clicked", action)
const displayAbout = () => emit("display-about");
</script>
