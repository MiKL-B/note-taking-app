<template>
	<AppDropdown :title="$t('view')" btn="toolbar_btn">
		<template v-slot:content>
			<li
				@click="selectView(view)"
				v-for="view in views"
				class="flex align-center gap-4"
				:class="{
					disabled: !distractionFree && view === 'distraction_free',
				}"
			>
				<AppIcon
					iconName="Check"
					v-if="view === currentView"
					class="size-16 text-dark"
				/>
				{{ $t(view) }}
			</li>
		</template>
	</AppDropdown>
</template>

<script>
import AppIcon from "./AppIcon.vue";
import AppDropdown from "./AppDropdown.vue";

export default {
	name: "ToolbarView",
	components: {
		AppIcon,
		AppDropdown,
	},
	props: ["distractionFree"],
	emits: ["select-view"],
	data() {
		return {
			currentView: localStorage.getItem("view") || "default",
			views: ["default", "distraction_free"], // kanban,schedule,drawing
		};
	},
	mounted() {
		this.selectView(this.currentView);
	},
	methods: {
		selectView(newView) {
			if (!this.distractionFree && newView === "distraction_free") {
				return;
			}
			this.currentView = newView;
			localStorage.setItem("view", this.currentView);
			this.$emit("select-view", this.currentView);
		},
	},
};
</script>
