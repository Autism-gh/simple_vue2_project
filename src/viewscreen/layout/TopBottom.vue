<template>
  <div class="screen-Layout">
    <div class="screen-header">
        <slot name="header"></slot>
    </div>
    <div class="screen-content">
        <div class="range-layout--25">
            <slot name="left"></slot>
        </div>

        <div class="range-layout--50">
            <slot name="center"></slot>
        </div>

        <div class="range-layout--25">
            <slot name="right"></slot>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TopBottom',
  components: {  },
  props: {  },
  data () {
    return {
     
    }
  },
  computed: {

  },
  methods: {

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
<style lang="scss" scoped horizontalvw>
@import '../scss/common.scss';

.screen-Layout {
    .screen-header {
        height: 100px;
        width: 100%;
    }

    .screen-content {
        height: calc(100% - 100px);
        width: 100%;
        display: flex;
        flex-direction: row;
    }
}
</style>
