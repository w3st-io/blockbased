<template>
	<div class="container">
		<section class="row my-3">
			<h3 class="text-white">Create Comment</h3>
		</section>

		<!-- Create Comment Component -->
		<create-comment />
	</div>
</template>

<script>
	// [IMPORT] Personal //
	import CreateComment from '../../components/controls/inputs/CreateComment'

	// [EXPORT] //
	export default {
		components: {
			CreateComment
		},
	}
</script>