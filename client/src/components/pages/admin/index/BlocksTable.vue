<template>
	<table class="my-3 table table-dark table-striped">
		<thead>
			<tr>
				<th>Col 1</th>
				<th>Col 2</th>
			</tr>
		</thead>
		<tbody>
			<tr></tr>
		</tbody>
	</table>
</template>

<script>
	// [IMPORT] Personal //
	import ABlockServices from '@services/administration/BlockService'

	export default {
		data: function() {
			return {
				blocks: {},
				error: '',
			}
		},

		created: async function() {
			// Get Blocks //
			try {
			this.blocks = await ABlockServices.getAllBlocks(100, 0)
			}
			catch(e) { this.error = e }

			// [LOG] //
			this.log()
		},

		methods: {
			log() {
				console.log('%%% [COMPONENT] Admin BlocksTable %%%')
				console.log('blocks:', this.blocks)
			},
		},
	}
</script>