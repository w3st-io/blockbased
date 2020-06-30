<template>
	<popper trigger="clickToOpen" :options="popperOptions">
		<button
			slot="reference"
			class="btn btn-sm dropdown-toggle"
			:class="'btn-'+ BSColor"
		>{{ btnName }}</button>

		<div class="p-1 bg-dark border border-secondary shadow rounded z-index">
			<a
				v-for="(listItem, index) in list"
				:key="index"
				class="dropdown-item bg-dark text-light"
			>{{ listItem }}</a>
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
			list: { type: Array, required: true },
		},

		data: function() {
			return {
				popperOptions: {
					placement: 'bottom',
					modifiers: { offset: { offset: '0px, 5px' } }
				}
			}
		},

		created: function() {
			
		},

		methods: {
			log() {
				console.log('%%% [COMPONENT] dropDownMenuBtn %%%')
				console.log('list:', this.list)
			}
		}
	}
</script>

<style>
	.z-index { z-index: 1000; }
</style>