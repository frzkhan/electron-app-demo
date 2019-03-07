<template>
	<section class="container">
		<button type="button" @click="open" name="button">Open</button>
		<span v-if="progress">{{progress}} %</span>
		<video-player class="video-player-box"
			ref="videoPlayer"
			:options="playerOptions"
			:playsinline="true">
		</video-player>
	</section>

</template>

<script>
import fs from 'fs'
const {dialog} = require('electron').remote
const { ipcRenderer } = require('electron')
import { videoPlayer } from 'vue-video-player'
export default {
	components: {
		videoPlayer
	},
	data: function () {
		return {
			progress: 0,
			playerOptions: {
				// videojs options
				muted: true,
				language: 'en',
				playbackRates: [0.7, 1.0, 1.5, 2.0],
				sources: [{
					type: "video/mp4",
					src: null
				}]
			}
		}
	},
	computed: {
		player() {
			return this.$refs.videoPlayer.player
		}
	},
	mounted () {
		ipcRenderer.on('video:convert:complete', (event, filename) => {
			this.playerOptions.sources[0].src = filename
		})
		ipcRenderer.on('video:convert:progress', (event, progress) => {
			console.log(progress);
			this.progress = Math.round(progress.percent)
		})
	},
	methods: {
		open() {
			dialog.showOpenDialog({
				properties: [ 'openFile' ]
			}, (filePaths) => {
				console.log(filePaths);
				ipcRenderer.send('video:convert', filePaths)
			})
		}
	}
}
</script>

<style scoped>

</style>
