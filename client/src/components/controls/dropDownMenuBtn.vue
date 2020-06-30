<template>
	<popper trigger="clickToToggle" :options="popperOptions">
		<button
			slot="reference"
			class="btn btn-sm dropdown-toggle"
			:class="'btn-'+ BSColor"
		>{{ btnName }}</button>

		<div class="p-1 bg-dark border border-secondary shadow rounded z-index">
			<a
				v-for="(listItem, index) in list"
				:key="index"
				@click="emit(listItem, _id)"
				class="dropdown-item bg-dark text-light"
			>{{ listItem }}</a>
		</div>
	</popper>
</template>
 
<script>
	// [IMPORT] // 
	import 'vue-popperjs/dist/vue-popper.css';
	import popper from 'vue-popperjs';

	// [IMPORT] Personal //
	import { EventBus } from '@main'
 
	// [EXPORT] //
	export default {
		components: { popper },

		props: {
			_id: {type: String, required: true, },
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
			// [LOG] //
			//this.log()
		},

		methods: {
			emit(listItem, _id) {
				EventBus.$emit(listItem, _id)
			},

			log() {
				console.log('%%% [COMPONENT] dropDownMenuBtn %%%')
				console.log('_id:', this._id)
				console.log('btnName:', this.btnName)
				console.log('BSColor:', this.BSColor)
				console.log('list:', this.list)
			}
		}
	}
</script>

<style>
	.z-index { z-index: 1000; }
</style>