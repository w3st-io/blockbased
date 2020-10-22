<template>
	<section :class="'alert alert-' + BSColor">
		<div class="d-flex justify-content-center">
			<div v-if="!message" class="spinner-grow"></div>
		</div>
		<span v-if="message">{{ message }}</span>
	</section>
</template>

<script>
	export default {
		props: {
			BSColor: {
				type: String,
				required: false,
				default: 'primary'
			},

			message: {
				type: String,
				required: false,
			},
		},
	}
</script>