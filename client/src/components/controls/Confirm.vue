<template>
	<div class="overlay h-100 w-100 position-fixed">
		<div class="overlay-content w-100 position-relative text-center">
			<BCard
				no-body
				bg-variant="dark"
				text-variant="white"
				border-variant="secondary"
				class="m-auto text-center"
				style="max-width: 300px;"
			>
				<BCardHeader>
					<h1 class="mt-2 float-left h6">{{ header }}</h1>
					<BButton
						size="sm"
						variant="outline-secondary"
						class="float-right"
					>X</BButton>
				</BCardHeader>

				<BCardBody>
					<BButton size="lg" variant="outline-danger" class="m-1">
						Yes
					</BButton>

					<BButton size="lg" variant="outline-secondary" class="m-1">
						No
					</BButton>
				</BCardBody>
			</BCard>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		header: {
			type: String,
			default: 'Are you sure?'
		}
	}
}
</script>

<style>
	.overlay {
		z-index: 2000;
		top: 0;
		left: 0;
		background-color: rgb(0, 0, 0);
		background-color: rgba(0, 0, 0, 0.6);
	}

	.overlay-content { top: 25%; }
</style>