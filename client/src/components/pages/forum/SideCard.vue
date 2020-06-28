<template>
	<div class="card bg-dark border-secondary box-shadow">
		<img
			:src="image"
			class="d-block w-100 card-img-top"
		>
		<div class="card-body">
		<p class="card-text text-light">
			Text here
		</p>
		<div class="d-flex justify-content-between align-items-center">
			<div class="btn-group">
				<button class="btn btn-sm btn-outline-light">View</button>
				<button class="btn btn-sm btn-outline-light">Edit</button>
			</div>
			<small class="text-muted">9 mins</small>
		</div>
		</div>
	</div>
</template>

<script>
	// [IMPORT] Personal //
	import image from '@assets/images/placeholder.jpg'

	// [EXPORT] //
	export default {
		data: function() {
			return {
				image,
			}
		}
	}
</script>