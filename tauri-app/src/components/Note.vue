<template>
	<div class="column-note-content">
		<div id="column-note-title">
			<NoteStatusColor :status_ID="selectedNote.status_ID" />
			<input id="input-note-name" type="text" v-model="selectedNote.name" :placeholder="$t('note_name_here')" />
		</div>
		<div class="note-tag-list">
			<span v-for="tag in noteTags" :style="`background: var(--${tag.color})`" class="tag">
				{{ tag.name }}
				<span class="delete-tag-btn" @click="deleteNoteTag(tag)">
					<AppIcon iconName="X" class="size-16" />
				</span>
			</span>
		</div>

		<div id="bothColumns" v-show="showBoth">
			<codemirror ref="myCodeMirror" v-model="selectedNote.content" @change="markAsModified"
				:style="{ height: 'calc(100vh - 200px);' }"></codemirror>

			<hr class="separator-column" />
			<div id="markdown-container" v-html="getMarkdownHtml"></div>
		</div>
		<div id="oneView" v-show="!showBoth">
			<div v-show="!isPreviewMode">
				<codemirror ref="myCodeMirror" v-model="selectedNote.content"
					:style="{ height: 'calc(100vh - 200px);' }" @change="markAsModified">
				</codemirror>
			</div>
			<div v-show="isPreviewMode" id="markdown-container" class="oneViewMarkdown" v-html="getMarkdownHtml"></div>
		</div>
		<NoteStatusbar :characterCount="getCharacterNoteCount" :wordCount="getWordNoteCount" />
	</div>
</template>

<script>
import { Codemirror } from 'vue-codemirror'
import AppIcon from "./AppIcon.vue";
import { marked } from "marked";
import DOMPurify from "dompurify";
import NoteStatusbar from "./NoteStatusbar.vue";
import NoteStatusColor from './NoteStatusColor.vue';
export default {
	name: "Note",
	props: ["selectedNote", "isPreviewMode", "showBoth", "notes"],
	emits: ["delete-note-tag", "mark-as-modified"],
	components: {
		NoteStatusbar,
		AppIcon,
		NoteStatusColor,
		Codemirror,
	},
	data() {
		return {
			font: localStorage.getItem("font") || "Inter",
			fontSize: localStorage.getItem("font-size") || 16,
		};
	},

	computed: {
		noteTags() {
			if (this.selectedNote.tags === "") return [];
			return JSON.parse(this.selectedNote.tags)
		},
		dynamicStyle() {
			return {
				fontSize: this.fontSize + "px",
				fontFamily: this.font,
			};
		},
		getMarkdownHtml() {
			let options = {
				async: false,
				extensions: null,
				hooks: null,
				pedantic: false,
				silent: false,
				tokenizer: null,
				walkTokens: null,
				gfm: true,
				sanitize: true,
				tables: true,
				breaks: true,
				smartLists: true,
				smartypants: false,
			};
			const renderer = new marked.Renderer();

			renderer.link = (token) => {
				return `<a href="${token.href}" title="${token.title}" target="_blank">${token.text}</a>`;
			};

			marked.use({ renderer });

			let dirtyHTML = marked(this.selectedNote.content, options);
			return DOMPurify.sanitize(dirtyHTML);
		},

		getCharacterNoteCount() {
			const selectedNote = this.notes.find((note) => note.selected);
			return selectedNote ? selectedNote.content.length : "";
		},
		getWordNoteCount() {
			const selectedNote = this.notes.find((note) => note.selected);
			return selectedNote
				? selectedNote.content.split(" ").length - 1
				: "";
		},
	},

	methods: {

		deleteNoteTag(tag) {
			this.$emit("delete-note-tag", tag);
		},
		markAsModified() {

			this.$emit("mark-as-modified");
		},
	},
};
</script>

<style>
.column-note-content {
	background: var(--bg-note);
	color: var(--text-color-note);
	min-width: 50%;
}

#column-note-title {
	display: flex;
	padding: 0 0.2rem;
	width: 100%;
}

#input-note-name {
	width: 100%;
	border: none;
	box-shadow: none;
	font-size: 20px;
}

.note-tag-list {
	flex-wrap: wrap;
	overflow-y: scroll;
	max-height: 26px;
	height: 26px;
	display: flex;
	gap: 0.2rem;
	padding-left: 0.2rem;
}

#bothColumns {
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	height: calc(100vh - 200px);
}

.separator-column {
	border-left: none;
	border-right: 1px solid var(--grey);
	height: 100%;
	margin: 0 1rem;
}

.cm-focused {
	outline: none !important;
}

.cm-activeLine,
.cm-gutter {
	background: var(--activeLine) !important;
}

.cm-lineNumbers {
	color: var(--lineNumbers) !important;
}

.cm-activeLineGutter {
	background: none !important;
}

#bothColumns .cm-editor {
	min-width: 200px;
	max-width: 900px;
}

#oneView .cm-editor {
	width: calc(100% - 2px);
}

.cm-line {
	overflow-wrap: break-word;
	word-wrap: break-word;
}

.delete-tag-btn {
	cursor: pointer;
	color: var(--dark2);
}
</style>
