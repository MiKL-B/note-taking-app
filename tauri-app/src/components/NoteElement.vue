<template>
	<div id="note">
		<AppIcon iconName="Check" v-if="note.isSaved" class="note_saved size-16" />
		<h4 class="note_title">
			<span style="color: var(--red)" v-if="note.important">!</span>
			<AppIcon iconName="Pin" v-if="note.pinned" class="text-dark size-16" />
			<NoteStatusColor :status_ID="note.status_ID" />
			<span class="note_title_name" :style="note.selected ? '' : 'color:var(--dark)'">
				{{ note.name }}
			</span>
		</h4>
		<div class="note_tags">
			<span v-for="tag in noteTags" :style="`background: var(--${tag.color})`" class="tag">
				{{ tag.name }}
			</span>
		</div>
		<p class="note_content">
			{{ note.content }}
		</p>
		<div class="note_dates">
			<span class="note_date">{{ timestamp }}</span>
		</div>
	</div>
	<span v-if="note.deleted === 0" @click="deleteNote(note)" >
		<AppIcon iconName="Trash2" class="note_trash size-20"  />
	</span>
	<span v-else @click="restoreNote(note)">
		<AppIcon iconName="RotateCcw" style="width:20px" class="note_restore size-20"  />
	</span>
	
</template>

<script lang="ts" setup>
import AppIcon from "./AppIcon.vue";
import NoteStatusColor from "./NoteStatusColor.vue";
import { ref, onMounted, computed } from 'vue';
const props = defineProps(['note'])
const emit = defineEmits(['delete-note', 'restore-note'])
let timestamp = ref("");
onMounted(() => {
	timestamp.value = new Date(props.note.timestamp).toLocaleString("fr-FR");
})
const noteTags = computed(() => {
	if (props.note.tags === "") return []
	return JSON.parse(props.note.tags)
})

const deleteNote = (note) => { emit('delete-note', note) }
const restoreNote = (note) => { emit('restore-note', note) }
</script>

<style>
.note_saved {
	color: var(--green);
	position: absolute;
	right: 0.5rem;
	top: 0.5rem;
}
.note_title {
	display: flex;
	align-items: center;
	gap: 0.2rem;
	color: var(--text-color-notelist);
	margin-bottom: 0.2rem;
}

.note_title_name {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 200px;
}
.note_tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.2rem;
}

.note_content {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	color: var(--dark);
}

.note_dates {
	display: flex;
	flex-direction: column;
}

.note_date {
	color: var(--text-color-notelist);
	font-size: 12px;
	font-style: italic;
}

.note_trash {
	color: var(--red);
}
.note_restore {
	color: var(--green);
}

.note_trash,
.note_restore {
	opacity: 0;
	transition: opacity 0.3s ease;
	pointer-events: none;
	margin: auto;
}

.note_trash:hover,
.note_restore:hover {
	cursor: pointer;
}

</style>
