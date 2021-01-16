<template>
	<BInputGroup size="sm">
		<BInputGroupPrepend class="ml-auto bg-dark">
			<BInputGroupText class="text-light border-light bg-dark">
				limit:
			</BInputGroupText>
		</BInputGroupPrepend>
		<BFormInput
			v-model="limit"
			:value="limit"
			type="text"
			variant="dark"
			placeholder="limit"
			border-variant="secondary"
			class="border-light text-center text-light bg-dark"
			style="max-width: 50px;"
		/>
		<BInputGroupAppend>
			<BButton
			variant="outline-light"
			class="bg-primary font-weight-bold"
			@click="newLimit()"
			>⟳</BButton>
		</BInputGroupAppend>
	</BInputGroup>
</template>

<script>
	export default {
		props: {
			limit: {
				type: Number,
				required: true,
			}
		},

		methods: {
			newLimit() { this.$emit('new-limit') }
		},
	}
</script>