<template>
	<BContainer class="my-3">
		<BCard bg-variant="dark" text-variant="light">
			<h1>Hours and Contact</h1>
			<HoursAndContact />
		</BCard>
	</BContainer>
</template>

<script>
import HoursAndContact from '../../components/company/HoursAndContact'

export default {
	components: {
		HoursAndContact
	}
}
</script>