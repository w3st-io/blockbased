<template>
	<popper trigger="clickToOpen" :options="popperOptions">
		<button
			slot="reference"
			class="btn btn-sm dropdown-toggle"
			:class="'btn-'+ BSColor"
		>{{ btnName }}</button>

		<div class="p-1 bg-dark border border-secondary shadow rounded z-index">
			<a class="dropdown-item bg-dark text-light">
				Action
			</a>
			<a class="dropdown-item bg-dark text-light">
				Another action
			</a>
			<a class="dropdown-item bg-dark text-light">
				Something else here
			</a>
		</div>
	</popper>
</template>
 
<script>
	// [IMPORT] // 
	import 'vue-popperjs/dist/vue-popper.css';
	import popper from 'vue-popperjs';
 
	// [EXPORT] //
	export default {
		components: { popper },

		props: {
			btnName: { type: String, default: 'DDMB' },
			BSColor: { type: String, default: 'light' },
		},

		data: function() {
			return {
				popperOptions: {
					placement: 'bottom',
					modifiers: { offset: { offset: '0px, 5px' } }
				}
			}
		},
	}
</script>

<style>
	.z-index { z-index: 1000; }
</style>