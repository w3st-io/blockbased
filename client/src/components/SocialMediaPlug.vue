<template>
	<div class="text-center">
		<a :href="defaultData.facebookLink" class="text-light">
			<FacebookIcon :size="size" class="mr-3" />
		</a>

		<a :href="defaultData.instagramLink" class="text-light">
			<InstagramIcon :size="size" class="mr-3" />
		</a>

		<a :href="defaultData.youtubeLink" class="text-light">
			<YoutubeIcon :size="size" class="" />
		</a>
	</div>
</template>

<script>
	import defaultData from '../defaults/companyInfo'
	import { FacebookIcon, InstagramIcon, YoutubeIcon } from 'vue-feather-icons'

	export default {
		props: {
			size: {
				type: String,
				default: "24",
			}
		},

		components: {
			FacebookIcon,
			InstagramIcon,
			YoutubeIcon
		},
		
		data() {
			return {
				defaultData: defaultData,
			}
		},
	}
</script>