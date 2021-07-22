<template>
	<BContainer class="my-3">
		<BRow>
			<BCard bg-variant="dark">
				<GetQuote />
			</BCard>
		</BRow>
	</BContainer>
</template>

<script>
	import GetQuote from '@/components/company/GetQuote'

	export default {
		components: {
			GetQuote,
		},
	}
</script>