<template>
	<BContainer class="mt-3">
		<BCard bg-variant="dark" class="text-light">
			{{ pageData }}
		</BCard>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import pageService from '../../../services/PageService'

	export default {
		data: function() {
			return {
				pageData: {},
			}
		},

		created: async function() {
			this.pageData = await pageService.s_user_activity(undefined, 5, 10)
		}
	}
</script>