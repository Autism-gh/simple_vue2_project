<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      
    }
  },
  provide() {
    return {
      pageReload: this.reload
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  },

  methods: {
    reload(){
      const route = this.$route
      const { fullPath, path, name, meta, meta: { title } } = route
      const parmas = {fullPath, meta, name, path, title}

      this.$store.dispatch('tagsView/delCachedView', parmas).then(() => {
          const { fullPath } = parmas
          this.$nextTick(() => {
              this.$router.replace({
                  path: '/redirect' + fullPath
              })
          })
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;

  background-color: var(--app-main);
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
    height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    margin-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
