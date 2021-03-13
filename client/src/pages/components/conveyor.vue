<template>
	<BContainer fluid class="my-3">
		<BRow>
			<Conveyor
				:images="PageData.cnt1.r1.c1.images"
				:totalOnLg="4"
				class="bg-light"
			/>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT] //
	import Conveyor from '@/components/display/Conveyor'
	import PageData from '@/defaults/pages/components/conveyor'

	export default {
		components: {
			Conveyor,
		},

		data() {
			return {
				PageData: PageData
			}
		},
	}
</script>