<template>
	<section>
		<table class="table table-sm table-bordered table-striped table-dark">
			<thead>
				<tr>
					<th>Cat Id</th>
					<th>Title</th>
					<th>Owner Email</th>
					<th>Owner Username</th>
					<th>Created At</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="block in blocks" :key="block._id">
					<td>{{ block.cat_id }}</td>
					<td>{{ block.title }}</td>
					<td>{{ block.user.email }}</td>
					<td>{{ block.user.username }}</td>
					<td>{{ block.createdAt }}</td>
					<td class="text-center">
						<button
							@click="deleteBlock(block._id)"
							class="btn btn-danger"
						>Delete</button>
					</td>
				</tr>
			</tbody>
		</table>
		
		<!-- [AELRTS] -->
		<div v-if="error" class="m-0 mt-3 alert alert-danger">{{ error }}</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import ABlockService from '@services/administration/BlockService'

	// [EXPORT] //
	export default {
		data: function() {
			return {
				blocks: {},
				error: '',
			}
		},

		created: async function() {
			// Get Blocks //
			await this.getBlocks()

			// [LOG] //
			//this.log()
		},

		methods: {
			async getBlocks() {
				// Get Blocks //
				try { this.blocks = await ABlockService.s_readAllAll(100, 0) }
				catch(e) { this.error = e }
			},

			async deleteBlock(block_id) {
				// Delete Block //
				try { await ABlockService.s_delete(block_id) }
				catch(e) { this.error = e }
				
				// Refresh Table //
				this.getBlocks()
			},

			log() {
				console.log('%%% [COMPONENT] Admin BlocksTable %%%')
				console.log('blocks:', this.blocks)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>