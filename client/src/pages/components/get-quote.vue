<template>
	<BContainer class="my-5">
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