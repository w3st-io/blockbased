<template>
	<div class="w-100 btn-group btn-group-toggle" data-toggle="buttons">
		<!-- For Each Passed Item in Tabs Array -->
		<label
			v-for="(tab, index) in tabs" :key="index"
			:class="{ active: activeTab == tab.name }"
			
			class="btn btn-outline-primary"
		>
			<input @click="toggleActive(index)" type="radio" autocomplete="off">
			{{ tab.name }}
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
	import { EventBus } from '../../main'

	// [EXPORT] //
	export default {
		props: {
			tabs: {
				type: Array,
				required: true
			},
			emitName: {
				type: String,
				required: true
			}
		},

		data: function() { return { activeTab: '', } },

		created: function() {
			this.activeTab = this.tabs[0].name
			EventBus.$emit(this.emitName, this.activeTab)
		},

		methods: {
			toggleActive(index) {
				this.activeTab = this.tabs[index].name
				EventBus.$emit(this.emitName, this.activeTab)
			}
		}
	}
</script>