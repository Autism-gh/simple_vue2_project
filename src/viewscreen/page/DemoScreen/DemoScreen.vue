<template>
    <TopBottom class="demoscreen">
        <template slot="header">
            <div class="demoscreen__header">
                我是标题头
            </div>
        </template>
        <template slot="left">
            <div class="demoscreen__left">
                我是标题头
            </div>
        </template>
        <template slot="center">
            <div class="demoscreen__center">
                我是标题头
            </div>
        </template>
        <template slot="right">
            <div class="demoscreen__right">
                我是标题头
            </div>
        </template>

    </TopBottom>
</template>
<script>
import TopBottom from '../../layout/TopBottom.vue'
export default {
  name: 'DemoScreen',
  components: { TopBottom },
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
<style lang="scss" scoped  horizontalvw>
.demoscreen {
    &__header {
        position: relative;
        height: 100%;
        display: flex;
        font-size: 40px;
        align-items: center;
        justify-content: center;
    }
    &__left {   
        position: relative;
        height: 100%;
        display: flex;
        font-size: 30px;
        align-items: center;
        justify-content: center;
    }
    &__center {
        position: relative;
        height: 100%;
        display: flex;
        font-size: 50px;
        align-items: center;
        justify-content: center;
    }
    &__right {
        position: relative;
        height: 100%;
        display: flex;
        font-size: 30px;
        align-items: center;
        justify-content: center;
    }
}
</style>
