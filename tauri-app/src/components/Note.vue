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
			<div>
				<textarea @click="getPositionCursor" id="textContent" :placeholder="$t('enter_text_here')"
					v-model="selectedNote.content" @scroll="syncScroll('div1')" spellcheck="false" :style="dynamicStyle"
					@input="markAsModified" ref="div1"></textarea>
			</div>

			<hr class="separator-column" />
			<div id="markdown-container" v-html="getMarkdownHtml" ref="div2" @scroll="syncScroll('div2')"></div>
		</div>
		<div id="oneView" v-show="!showBoth">
			<div v-show="!isPreviewMode">
				<textarea @click="getPositionCursor" id="textContent" :placeholder="$t('enter_text_here')"
					v-model="selectedNote.content" spellcheck="false" :style="dynamicStyle" @input="markAsModified"
					ref="editor"></textarea>
			</div>
			<div v-show="isPreviewMode" id="markdown-container" class="oneViewMarkdown" v-html="getMarkdownHtml"></div>
		</div>
		<NoteStatusbar :characterCount="getCharacterNoteCount" :wordCount="getWordNoteCount" />
	</div>
</template>

<script>
import AppIcon from "./AppIcon.vue";
import { marked } from "marked";
import DOMPurify from "dompurify";
import NoteStatusbar from "./NoteStatusbar.vue";
import NoteStatusColor from './NoteStatusColor.vue';
export default {
	name: "Note",
	props: ["selectedNote", "isPreviewMode", "showBoth", "notes"],
	emits: ["delete-note-tag", "mark-as-modified", "get-position-cursor"],
	components: {
		NoteStatusbar,
		AppIcon,
		NoteStatusColor
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
		getPositionCursor(e) {
			this.$emit("get-position-cursor", e.target.selectionStart);
		},
		deleteNoteTag(tag) {
			this.$emit("delete-note-tag", tag);
		},
		markAsModified(e) {
			this.$emit("mark-as-modified", e.target.selectionStart);
		},

		syncScroll(source) {
			const div1 = this.$refs.div1;
			const div2 = this.$refs.div2;

			if (source === "div1") {
				div2.scrollTop = div1.scrollTop;
			} else {
				div1.scrollTop = div2.scrollTop;
			}
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

#oneView {
	height: calc(100vh - 200px);
}

#oneView div {
	height: 100%;
}

#bothColumns div {
	height: 100%;
}

.delete-tag-btn {
	cursor: pointer;
	color: var(--dark2);
}

.markdown-header {
	color: var(--blue);
}

.markdown-list {
	color: var(--pink);
}

.markdown-link {
	color: var(--green);
}

.markdown-emphasis {
	color: rgba(221, 160, 221, 0.4);
	/* Couleur pour l'emphase */
}

.markdown-strong {
	color: rgba(255, 160, 122, 0.4);
	/* Couleur pour le gras */
}
</style>
