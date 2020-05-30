<template>
	<div class="container">
		<div class="m-3 row">
			<div class="col-12 col-md-9">
				<topics class="m-0" />
			</div>
			<div class="col-12 col-md-3">
				<topics class="m-0" />
			</div>
		</div>
	</div>
</template>

<script>
	import Topics from '../components/Topics'

	export default {
		components: {
			Topics
		},

		data: function() {
			return {

			}
		}
	}
</script>