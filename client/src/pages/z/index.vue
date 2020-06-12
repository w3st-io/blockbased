<template>
	<div class="container">
		<div class="row">
			<section class="my-3">
				<h3 class="text-white">Create Comment</h3>
			</section>

			<div id="" class="w-100">
				<!-- Editor -->
				<ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>

				<!-- Save Button -->
				<p class="my-3 text-white">
					Output Data:<br>
					{{ editorData }}
					</p>
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
				editorConfig: {
						// The configuration of the editor.
				}
			}
		},

		created: function() {
		},

		methods: {
		
		}
	}
</script>