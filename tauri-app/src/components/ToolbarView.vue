<template>
	<MenuDropdown :title="$t('view')" btn="toolbar-btn">
		<template v-slot:content>
			<li
				@click="selectView(view)"
				v-for="view in views"
				class="flex align-center gap-4"
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
	emits: ["select-view"],
	data() {
		return {
			currentView: localStorage.getItem("view") || "default",
			views: ["default", "kanban"], // kanban, schedule, drawing
		};
	},
	mounted() {
		this.selectView(this.currentView);
	},
	methods: {
		selectView(newView) {
			this.currentView = newView;
			localStorage.setItem("view", this.currentView);
			this.$emit("select-view",this.currentView)
		},
	},
};
</script>
