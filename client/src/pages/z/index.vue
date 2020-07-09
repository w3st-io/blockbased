<template>
	<div class="my-4 container bg-danger">
		<div class="row bg-primary">
			<div class="col-6">
				<div class="bg-warning">
					Testing
					<br>
					sdfsdf
				</div>
			</div>
			<div class="col-6">
				<div class="bg-warning">
					Testing
					<br>
					sdfsd
				</div>
			</div>
		</div>

		<div class="bg-secondary p-5">
			<div class="bg-warning border border-secondary">sdfsd</div>
		</div>
	</div>
</template>

<script>
	// [Import] //
	import ClassicEditor from '@ckeditor/ckeditor5-build-classic'


	// [EXPORT] //
	export default {
		data: function() {
			return {
				editor: ClassicEditor,
				editorData: '<p>Content of the editor.</p>',
				editorConfig: {
					//toolbar: [ 'bold', 'italic', '-', 'link' ]
				}
			}
		},
	}
</script>