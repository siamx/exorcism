const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')

export default async ({ Vue }) => {
  Vue.mixin({
    computed: {
      configDir () {
        return this.$q.electron.remote.app.getPath('userData')
      },
      downloadsDir () {
        const downloadsPath = path.resolve(this.configDir, 'Downloads')
        mkdirp(downloadsPath, (error) => {
          if (error) {
            this.$q.notify({ color: 'negative', message: 'Oops, could not create downloads directory :(' })
          }
        })
        return downloadsPath
      }
    },
    methods: {
      getDownloadedImages () {
        let images = fs.readdirSync(this.downloadsDir)
        let uniqueImages = [...new Set(images)]
        return uniqueImages
      },
      imagePath (imageName) {
        const timeStamp = Date.now() + '.jpg'
        return path.resolve(this.downloadsDir, imageName || timeStamp)
      }
    }
  })
}
