<template>
	<div id="note">
		<Check v-if="note.isSaved" class="note-saved size-16" />
		<h4 class="note-title">
			<span style="color: var(--red)" v-if="note.important">!</span>
			<Pin v-if="note.pinned" class="size-16 text-dark" />
			<div
				style="padding: 0 0.3rem"
				class="color-circle"
				:class="`bg-${getStatusColor(note.status_ID)}`"
			></div>

			<span
				id="note-title-name"
				:style="note.selected ? '' : 'color:var(--dark)'"
			>
				{{ note.name }}
			</span>
		</h4>
		<div class="notelist-tag">
			<span
				class="tag"
				v-for="tag in tags"
				:style="`background: var(--${tag.color})`"
				>{{ tag.name }}</span
			>
		</div>
		<p class="note-content">
			{{ note.content }}
		</p>
		<div class="note-dates">
			<span class="note-date">{{ note.createdDate }}</span>
			<span class="note-date">{{ note.updatedDate }}</span>
		</div>
	</div>
	<Trash2 width="20" class="note-trash" @click="deleteNote(note)" />
</template>
<script>
import { Check, Trash2, Pin } from "lucide-vue-next";
export default {
	name: "NoteElement",
	props: ["note"],
	emits: ["delete-note"],
	components: {
		Check,
		Trash2,
		Pin,
	},
	data() {
		return {
			tags: [],
		};
	},

	methods: {
		getStatusColor(status_ID) {
			let color = "";
			switch (status_ID) {
				case 1:
					color = "red";
					break;
				case 2:
					color = "yellow";
					break;
				case 3:
					color = "green";
					break;
				case 4:
					color = "grey";
					break;
			}
			return color;
		},
		deleteNote(note) {
			this.$emit("delete-note", note);
		},
	},
};
</script>
<style>
.note-content {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	color: var(--dark);
}
.note-saved {
	color: var(--green);
	position: absolute;
	right: 0.5rem;
	top: 0.5rem;
}
.note-title {
	display: flex;
	align-items: center;
	gap: 0.2rem;
	color: var(--text-color-notelist);
	margin-bottom: 0.2rem;
}
#note-title-name {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 200px;
}
.notelist-tag {
	display: flex;
	flex-wrap: wrap;
	gap: 0.2rem;
}
.note-trash {
	opacity: 0;
	transition: opacity 0.3s ease;
	pointer-events: none;
	color: var(--red);
	margin: auto;
}
.note-dates {
	display: flex;
	flex-direction: column;
}
.note-date {
	color: var(--text-color-notelist);
	font-size: 12px;
	font-style: italic;
}
.note-trash:hover {
	cursor: pointer;
}
</style>
