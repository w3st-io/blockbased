<template>
	<div class="container">
		<div class="row mt-3">
			<div class="col-8 mb-3 card card-body bg-dark">
				<div class="row">
					<div class="col-4 bg-warning">
						<h3 class="text-light">username here</h3>
						<img
							:src="image"
							alt="Profile Image Not Available"
							class="w-100"
						>
					</div>

					<div class="col-8 bg-danger"></div>
				</div>
			</div>
			<div class="col-4">
				<div class="card card-body bg-dark">
					<h1 class="h5 text-light">Score</h1>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data: function() {
		return {
			image: require('../../assets/images/DefaultProfileImg.png')
		}
	},
}
</script>