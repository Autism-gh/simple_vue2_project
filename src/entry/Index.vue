<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
    </div>

    <SystemLoading></SystemLoading>
  </div>
</template>
<script>
  import SystemLoading from '@/components/Loading/SystemLoading.vue'
  import {
    AppMain,
    Navbar,
    Sidebar,
    TagsView
  } from './app'
  import ResizeMixin from './mixin/ResizeHandler'
  import {
    mapState
  } from 'vuex'
  export default {
    name: 'appIndex',
    components: {
      AppMain,
      Navbar,
      Sidebar,
      TagsView,
      SystemLoading
    },
    mixins: [ResizeMixin],
    computed: {
      ...mapState({
        sidebar: state => state.app.sidebar,
        device: state => state.app.device,
        showSettings: state => state.settings.showSettings,
        needTagsView: state => state.settings.tagsView,
        fixedHeader: state => state.settings.fixedHeader
      }),
      classObj() {
        return {
          hideSidebar: !this.sidebar.opened,
          openSidebar: this.sidebar.opened,
          withoutAnimation: this.sidebar.withoutAnimation,
          mobile: this.device === 'mobile'
        }
      }
    },
    methods: {
      handleClickOutside() {
        this.$store.dispatch('app/closeSideBar', {
          withoutAnimation: false
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "./scss/sidebar.scss";
</style>
<style lang="scss" scoped>
  .app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1000;
    width: calc(100% - #{var(--side-bar-width)});
    transition: width 0.28s;
    padding-right: 0 !important;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>