<template>
	<BContainer fluid class="my-5">
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
	import PageData from '../../defaults/pages/components/conveyor'
	import Conveyor from '../../components/display/Conveyor'

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