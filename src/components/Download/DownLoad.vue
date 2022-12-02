<template>
  <div class="download-container" :style="`width: ${ this.width }`">
    <div class="in-download" v-show="downloading">
      <el-progress 
        :text-inside="true" 
        :stroke-width="strokeWdith" 
        :percentage="percentage">
      </el-progress>
    </div>
    <div class="out-download" v-show="!downloading" @click="handleDownloadClick">
        <template v-if="$slots.default">
          <slot></slot>
        </template>
        <template v-else>
          <i class="el-icon-download"></i>
        </template>
        <span v-show="downloadStep === 'success'" class="margin--l text--success">(成功)</span>
        <span v-show="downloadStep === 'error'" class="margin--l text--danger">(失败)</span>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'DownLoad',
  components: {  },
  props: {  
    width: {
      type: String,
      default: '80px'
    },

    href: {
      type: String,
      default: ''
    },

    text: {
      type: String,
      default: 'download'
    },

    strokeWdith: {
      type: Number,
      default: 16
    },

    /**
     * 这个值暂时不要动，后续如果要改说一下
     */
    from: {
      type: String,
      default: 'axios'
    },

    outSideEvent: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      percentage: 0,

      downloading: false,

      downloadStep: 'default',

      outSideData: {
        from: '',
        href: '',
        text: ''
      }
    }
  },

  watch: {
    href() {
      this.clearProgress()
    }
  },
  
  computed: {
    formatUrl() {
      return this.outSideEvent ? this.outSideData?.href : this.href
    },

    formatText() {
      return this.outSideEvent ? this.outSideData?.text : this.text
    },

    formatFrom() {
      return this.outSideEvent ? this.outSideData?.from : this.from
    }
  },

  methods: {
    clearProgress(state = 'default') {
      this.percentage = 0
      this.downloading = false
      this.downloadStep = state
    },

    getBolbFromAxios(url, callBack) {
      return axios({
        url: url,
        method: 'get',
        responseType: 'blob',
        onDownloadProgress(progress){
          callBack(progress)
        }
      })
    },

    callBackProgress(progress) {
      if(!progress) return
      const { total, loaded } = progress
      const downProgress = Math.floor((loaded / total) * 100)
      this.percentage = downProgress
      this.downloadStep = 'doing'
    },  
    
    async donwloadFromLoack() {
      this.downloading = true

      try {
        const result = await this.getBolbFromAxios(this.formatUrl, this.callBackProgress)
        if(!result || result.status !== 200) {
          this.clearProgress('error')
          return
        }

        const blob = result.data
        let downLoadUrl = window.URL.createObjectURL(new Blob([blob], { type: 'video/mp4' }));
        let linkInstance = document.createElement('a');
        linkInstance.download = this.formatText;
        linkInstance.href = downLoadUrl;
        linkInstance.style.display = 'none';
        document.body.appendChild(linkInstance);
        linkInstance.click();
        linkInstance.remove();
        this.clearProgress('success')
        this.$emit('success')
      } catch (error) {
        this.clearProgress('error')
      }
    },

    handleDownloadClick() {
      if(this.outSideEvent) {
        this.$emit('click')
        return
      }
      this.handleDownloadEvent()
    },

    handleDownloadEvent() {
      switch (this.formatFrom) {
        case 'axios':
          this.donwloadFromLoack()
          break;
      }
    },

    startDownload(data) {
      if(!data || !data?.href) return
      const { from, href, text } = data
      Object.assign(this.outSideData, {
        from: from || 'axios',
        href: href,
        text: text || 'download'
      })
      this.handleDownloadEvent()
    }
  },
  beforeCreate () {

  },
  created () {

  },
  beforeMount () {

  },
  mounted () {

  },
  beforeDestroy() {

  },
}
</script>
<style lang="scss">
.download-container {
  .el-progress {
    height: 100%;
    display: flex;
    align-items: center;
  }
}
</style>
<style lang="scss" scoped>
.download-container {
  position: relative;
  width: 100%;
  height: 100%;
  
  .in-download {
    width: 100%;
    height: 100%;
  }

  .out-download {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .download-custom {
    cursor: pointer;
  }
}
</style>
