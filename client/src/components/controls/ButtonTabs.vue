<template>
	<div class="w-100 btn-group btn-group-toggle">
		<!-- For Each Passed Item in Tabs Array -->
		<label
			v-for="(tab, index) in tabs" :key="index"
			:class="{ active: activeTab == tab }"
			class="btn btn-outline-primary"
		>
			<input @click="toggler(index)" type="radio" autocomplete="off">
			{{ tab }}
		</label>
	</div>
</template>

<script>
	/**
	 * this component takes in 2 properties,
	 * 1) the list of tabs
	 * 2) what the emit is going to be called
	 */
	// [IMPORT] Personal //
	import { EventBus } from '@main'

	// [EXPORT] //
	export default {
		props: {
			tabs: { type: Array, required: true, },
			emitName: { type: String, required: true, },
		},

		data: function() {
			return {
				activeTab: '',
			}
		},

		created: function() {
			// Set Active Tab //
			this.activeTab = this.tabs[0]

			// [EMIT-EVENTBUS] //
			EventBus.$emit(this.emitName, this.activeTab)
		},

		methods: {
			toggler(index) {
				this.activeTab = this.tabs[index]
				EventBus.$emit(this.emitName, this.activeTab)
			}
		}
	}
</script>