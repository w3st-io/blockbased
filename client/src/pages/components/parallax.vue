<template>
	<div>
		<!-- Parallax Image Above -->
		<Parallax :imgURL="PageData.image" />

		<BContainer class="my-3">
			<BCard bg-variant="white" class="text-center">
				<a href="/" class="m-auto text-center">
					<BButton variant="primary" class="m-auto text-center">
						Return Home
					</BButton>
				</a>
			</BCard>
		</BContainer>
	</div>
</template>

<script>
	import PageData from '../../defaults/pages/components/parallax'
	import Parallax from '../../components/display/Parallax'

	export default {
		components: {
			Parallax,
		},

		data() {
			return {
				PageData: PageData,
			}
		},
	}
</script>