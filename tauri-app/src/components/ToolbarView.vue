<template>
	<MenuDropdown :title="$t('view')" btn="toolbar-btn">
		<template v-slot:content>
			<li
				@click="selectView(view)"
				v-for="view in views"
				class="flex align-center gap-4"
				:class="{
					disabled: !distractionFree && view === 'distraction_free',
				}"
			>
				<Check v-if="view === currentView" class="size-16 text-dark" />
				{{ $t(view) }}
			</li>
		</template>
	</MenuDropdown>
</template>

<script>
import { Check } from "lucide-vue-next";
import MenuDropdown from "./MenuDropdown.vue";

export default {
	name: "ToolbarView",
	components: {
		Check,
		MenuDropdown,
	},
	props: ["distractionFree"],
	emits: ["select-view"],
	data() {
		return {
			currentView: localStorage.getItem("view") || "default",
			views: [
				"default",
				"distraction_free",
				"kanban",
				"schedule",
				"drawing",
			],
		};
	},
	mounted() {
		this.selectView(this.currentView);
	},
	methods: {
		selectView(newView) {
			if (!this.distractionFree && newView === 'distraction_free') {
				return;
			}
			this.currentView = newView;
			localStorage.setItem("view", this.currentView);
			this.$emit("select-view", this.currentView);
		},
	},
};
</script>
