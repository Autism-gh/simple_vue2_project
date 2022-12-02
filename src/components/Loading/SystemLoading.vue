<template>
  <div
    v-show="loading.show"
    :class="['app-loading',
        loading.modal ? 'loading--modal' : '',
        loading.fixed ? 'loading--fixed' : 'loading--default',
    ]">
    <img src="~@/assets/images/common/default-loading.gif"/>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'SystemLoading',
  components: {  },
  props: {  },
  data () {
    return {
     
    }
  },
  computed: {
    ...mapState('app', ['loading'])
  },
  watch: {
    'loading.show': function(newVal) {
      if (!newVal) {
        this.handleClearTimeOut()
        return
      }
      this.timer = setTimeout(() => {
        this.$store.commit('app/TOGGLE_LOADING', false)
      }, this.loading.timeout)
    }
  },
  methods: {
    handleClearTimeOut() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.$store.commit('app/TOGGLE_LOADING', {
        fixed: false,
        timeout: 30 * 1000, // 超时时间
        modal: false, // 遮罩
        show: false // 状态
      })
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
    this.handleClearTimeOut()
  },
}
</script>
<style lang="scss" scoped>
.app-loading {
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;

    &.loading--fixed {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
    }

    &.loading--default {
        position: absolute;
        width: calc(100% - #{var(--side-bar-width)});
        height: 100%;
        bottom: 0;
        right: 0;
        margin-bottom: 80px;
    }

    &.loading--modal {
        background-color: rgba(0,0,0,0.3);
    }

    .loading-content {
        height: 100%;
        width: max-content;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
