<template>
  <div class="q-pa-md">
    <q-header elevated>
      <q-toolbar class="bg-black text-white">
        <q-toolbar-title class="text-center">
          <strong>Exorcism</strong>
        </q-toolbar-title>
      </q-toolbar>
      <q-toolbar class="bg-black text-white">
        <q-toolbar-title class="text-center">
          <q-btn-group push>
            <q-btn
              push
              icon="skip_previous"
              @click="previous"
            />
            <q-btn
              push
              icon="cloud_download"
              class="q-mr-xs"
              @click="download"
              :loading="downloadLoading"
            >
              <template v-slot:loading>
                <q-spinner-hourglass />
              </template>
            </q-btn>
            <q-btn
              push
              icon="skip_next"
              @click="next"
            />
          </q-btn-group>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <div class="q-col-gutter-md row items-start">
      <div
        class="col-6"
        v-for="image in images"
        :key="image"
      >
        <q-img
          :ratio="16/9"
          :src="`file://${imagePath(image)}`"
        >
          <div class="absolute-bottom text-subtitle1 text-center q-pa-xs">
            <q-btn-group push>
              <q-btn
                push
                icon="wallpaper"
                @click="set(image)"
              >
                <Tooltip text="Set" />
              </q-btn>
              <q-btn
                push
                icon="folder"
              >
                <Tooltip text="Open" />
              </q-btn>
              <q-btn
                push
                icon="delete"
                @click="deleteImage(image)"
              >
                <Tooltip text="Delete" />
              </q-btn>
            </q-btn-group>
          </div>
        </q-img>
      </div>
    </div>
  </div>
</template>

<script>
import Tooltip from 'src/components/Tooltip.vue'
import { setInterval } from 'timers'
const imageDownloader = require('image-downloader')
const wallpaper = require('wallpaper')
const fs = require('fs')

export default {
  name: 'PageIndex',
  data: () => ({
    source: 'https://source.unsplash.com/random/1920x1080',
    images: [],
    DOWNLOAD_NEW_IMAGE_INTERVAL: 60000 * 10,
    CHANGE_WALLPAPER_INTERVAL: 60000 * 10,
    MAX_WALLPAPER_COUNT: 100,
    downloadLoading: false
  }),
  components: {
    Tooltip
  },
  mounted () {
    this.images = this.getDownloadedImages()
    setInterval(this.download, this.DOWNLOAD_NEW_IMAGE_INTERVAL)
    setInterval(this.next, this.CHANGE_WALLPAPER_INTERVAL)
    this.$q.electron.ipcRenderer.on('action', (event, args) => {
      switch (args) {
        case 'new':
          this.download().then(this.set)
          break
        case 'next':
          this.next()
          break
        case 'previous':
          this.previous()
          break
        case 'delete':
          this.getCurrentWallpaper().then((img) => {
            this.deleteImage(img).then((res) => { this.next() })
          })
          break
      }
    })
  },
  methods: {
    async deleteImage (image) {
      const index = this.images.indexOf(image)
      if (index > -1) {
        const path = this.imagePath(image)
        fs.unlink(path, (error) => {
          if (error) {
            this.$q.notify({
              color: 'negative',
              message: 'Oops, could not delete wallpaper :('
            })
          } else {
            this.images.splice(index, 1)
            return image
          }
        })
      } else {
        this.$q.notify({
          color: 'negative',
          message: 'Can not delete a non-Exorcism wallpaper'
        })
      }
    },
    async next () {
      let path = await wallpaper.get()
      let imageName = this.imageNameFromPath(path)
      let index = this.images.indexOf(imageName)
      if (index > -1) {
        index = (index + 1) % this.images.length
      } else {
        index = Math.floor(Math.random() * this.images.length)
      }
      await wallpaper.set(this.imagePath(this.images[index]))
    },
    async previous () {
      let path = await wallpaper.get()
      let imageName = this.imageNameFromPath(path)
      let index = this.images.indexOf(imageName)
      if (index > -1) {
        index = (index + this.images.length - 1) % this.images.length
      } else {
        index = Math.floor(Math.random() * this.images.length)
      }
      await wallpaper.set(this.imagePath(this.images[index]))
    },
    async download () {
      if (this.images.length < this.MAX_WALLPAPER_COUNT) {
        try {
          this.downloadLoading = true
          let path = this.imagePath()
          const image = await imageDownloader.image({ url: this.source, dest: path })
          const imageName = image.filename.replace(/^.*[\\/]/, '')
          this.images.push(imageName)
          this.downloadLoading = false
          return imageName
        } catch (error) {
          this.$q.notify({ color: 'negative', message: 'Oops, could not download new wallpaper :(' })
        }
      }
    },
    async set (image) {
      const path = this.imagePath(image)
      await wallpaper.set(path)
    },
    async getCurrentWallpaper () {
      const current = await wallpaper.get()
      return this.imageNameFromPath(current)
    },
    imageNameFromPath (path) {
      return path.replace(/^.*[\\/]/, '')
    }
  }
}
</script>
