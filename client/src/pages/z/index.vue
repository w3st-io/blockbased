<template>
	<div class="container">
		<div class="row">
			<section class="my-3">
				<h3 class="text-white">Create Comment</h3>
			</section>

			<div id="" class="w-100 card card-body bg-dark">
				<!-- Editor -->
				<ckeditor
					:editor="editor"
					:config="editorConfig"
					v-model="editorData"
				></ckeditor>

				<!-- Create Button -->
				<button class="w-100 my-3 btn btn-info">Create Comment</button>

				<p v-html="editorData" class="text-white"></p>
			</div>
		</div>
	</div>
</template>

<script>
	// [Import] //
	import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

	// [EXPORT] //
	export default {
		data: function() {
			return {
				editor: ClassicEditor,
				editorData: '<p>Content of the editor.</p>',
				editorConfig: {}
			}
		},

		created: function() {},

		methods: {},
	}
</script>