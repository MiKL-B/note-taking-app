<template>
	<div class="column-note-content">
		<div id="column-note-title">
			<div
				style="margin: auto 0"
				class="color-circle"
				:class="`bg-${getStatusColor(selectedNote.status_ID)}`"
			></div>
			<input
				id="input-note-name"
				type="text"
				v-model="selectedNote.name"
				:placeholder="$t('note_name_here')"
			/>
		</div>
		<div class="note-tag-list">
			<span
				class="tag"
				v-for="tag in selectedNote.tags"
				:style="`background: var(--${tag.color})`"
				>{{ tag.name }}
				<span class="delete-tag-btn" @click="deleteTagNote(tag)"
					><X class="size-16" />
				</span>
			</span>
		</div>
		<div id="bothColumns" v-show="showBoth">
			<div>
				<textarea
					:placeholder="$t('enter_text_here')"
					v-model="selectedNote.content"
					ref="div1"
					@scroll="syncScroll('div1')"
					spellcheck="false"
					:style="dynamicStyle"
					@input="markAsModified"
				></textarea>
			</div>
			<hr class="separator-column" />
			<div
				id="markdown-container"
				v-html="getMarkdownHtml"
				ref="div2"
				@scroll="syncScroll('div2')"
			></div>
		</div>
		<div id="oneView" v-show="!showBoth">
			<div v-show="!isPreviewMode">
				<textarea
					:placeholder="$t('enter_text_here')"
					v-model="selectedNote.content"
					spellcheck="false"
					:style="dynamicStyle"
					@input="markAsModified"
				></textarea>
			</div>
			<div
				v-show="isPreviewMode"
				id="markdown-container"
				class="oneViewMarkdown"
				v-html="getMarkdownHtml"
			></div>
		</div>
		<NoteStatusbar
			:characterCount="getCharacterNoteCount"
			:wordCount="getWordNoteCount"
		/>
	</div>
</template>

<script>
import { X } from "lucide-vue-next";
import { marked } from "marked";
import DOMPurify from "dompurify";
import NoteStatusbar from "./NoteStatusbar.vue";
export default {
	name: "Note",
	props: ["selectedNote", "isPreviewMode", "showBoth", "notes"],
	emits: ["delete-tag-note", "mark-as-modified"],
	components: {
		NoteStatusbar,
		X,
	},
	data() {
		return {
			font: localStorage.getItem("font") || "Inter",
			fontSize: localStorage.getItem("font-size") || 16,
		};
	},
	computed: {
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
		deleteTagNote(tag) {
			this.$emit("delete-tag-note", tag);
		},
		markAsModified() {
			this.$emit("mark-as-modified");
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
</style>
