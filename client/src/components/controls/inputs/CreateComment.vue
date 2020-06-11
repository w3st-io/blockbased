<template>
	<div class="p-3 row border border-secondary bg-dark rounded">
		<!-- Editor -->
		<editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
			<div class="mb-2 w-100">
				<button
					class="mr-1 btn btn-secondary"
					:class="{ 'is-active': isActive.bold() }"
					@click="commands.bold"
				>Bold</button>

				<button
					class="m-1 btn btn-secondary"
					:class="{ 'is-active': isActive.italic() }"
					@click="commands.italic"
				>Italic</button>

				<button
					class="m-1 btn btn-secondary"
					:class="{ 'is-active': isActive.strike() }"
					@click="commands.strike"
				>Strike</button>

				<button
					class="m-1 btn btn-secondary"
					:class="{ 'is-active': isActive.underline() }"
					@click="commands.underline"
				>Underline</button>

				<button
					class="m-1 btn btn-secondary"
					:class="{ 'is-active': isActive.code() }"
					@click="commands.code"
				>Code</button>

				<button
					class="m-1 btn btn-secondary"
					:class="{ 'is-active': isActive.paragraph() }"
					@click="commands.paragraph"
				>p</button>

				<button
					class="m-1 btn btn-secondary"
					:class="{ 'is-active': isActive.heading({ level: 1 }) }"
					@click="commands.heading({ level: 1 })"
				>H1</button>

				<button
					class="m-1 btn btn-secondary"
					:class="{ 'is-active': isActive.heading({ level: 2 }) }"
					@click="commands.heading({ level: 2 })"
				>H2</button>

				<button
					class="m-1 btn btn-secondary"
					:class="{ 'is-active': isActive.heading({ level: 3 }) }"
					@click="commands.heading({ level: 3 })"
				>H3</button>

				<button
					class="m-1 btn btn-secondary"
					:class="{ 'is-active': isActive.bullet_list() }"
					@click="commands.bullet_list"
				>UL</button>

				<button
					class="m-1 btn btn-secondary"
					:class="{ 'is-active': isActive.ordered_list() }"
					@click="commands.ordered_list"
				>OL</button>

				<button
					class="m-1 btn btn-secondary"
					:class="{ 'is-active': isActive.blockquote() }"
					@click="commands.blockquote"
				>Quote</button>

				<button
					class="m-1 btn btn-secondary"
					:class="{ 'is-active': isActive.code_block() }"
					@click="commands.code_block"
				>Code</button>

				<button
					class="m-1 btn btn-secondary"
					@click="commands.horizontal_rule"
				>Hr</button>

				<button
					class="m-1 btn btn-secondary"
					@click="commands.undo"
				>Undo</button>

				<button
					class="ml-1 btn btn-secondary"
					@click="commands.redo"
				>Redo</button>
			</div>
		</editor-menu-bar>

		<!-- Text Area -->
		<editor-content class="w-100 mb-3 p-1 border border-info rounded bg-light" :editor="editor" />
	
	
		<button class="w-100 btn btn-info">Create Comment</button>
	</div>
</template>

<script>
	// [IMPORT] //
	import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
	import {
		Blockquote,
		CodeBlock,
		HardBreak,
		Heading,
		HorizontalRule,
		OrderedList,
		BulletList,
		ListItem,
		TodoItem,
		TodoList,
		Bold,
		Code,
		Italic,
		Link,
		Strike,
		Underline,
		History,
	} from 'tiptap-extensions'

	// [EXPORT] //
	export default {
		components: {
			EditorContent,
			EditorMenuBar,
		},

		data: function() {
			return {
				editor: new Editor({
					extensions: [
						new Blockquote(),
						new BulletList(),
						new CodeBlock(),
						new HardBreak(),
						new Heading({ levels: [1, 2, 3] }),
						new HorizontalRule(),
						new ListItem(),
						new OrderedList(),
						new TodoItem(),
						new TodoList(),
						new Link(),
						new Bold(),
						new Code(),
						new Italic(),
						new Strike(),
						new Underline(),
						new History(),
					],

					content: `<h2>Type Here</h2>`,
				}),
			}
		},

		beforeDestroy() { this.editor.destroy() },
	}
</script>