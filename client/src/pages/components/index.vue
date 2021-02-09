<template>
	<BContainer class="my-5">
		<BCard bg-variant="white">
			<BRow>
				<BCol cols="12">
					<h1 class="text-center text-primary">Components Examples</h1>
				</BCol>

				<BCol cols="12" sm="4">
					<RouterLink to="/components/bcarousel">
						<BButton class="w-100 mb-3">BCarousel</BButton>
					</RouterLink>
					<RouterLink to="/components/conveyor">
						<BButton class="w-100 mb-3">Conveyor</BButton>
					</RouterLink>
					<RouterLink to="/components/get-quote">
						<BButton class="w-100 mb-3">Get Quote</BButton>
					</RouterLink>
					<RouterLink to="/components/parallax">
						<BButton class="w-100 mb-3">Parallax</BButton>
					</RouterLink>
				</BCol>
			</BRow>
		</BCard>
	</BContainer>
</template>