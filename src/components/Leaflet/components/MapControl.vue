<template>
  <div class="leaflet-control-container">
    <div class="control-row bg" v-show="show">
      <div class="row" v-for="item in control" :key="item.key">
        <i :class="item.icon"></i>
      </div>
    </div>
    <div class="box-btn" @click="show = !show">
      <i class="el-icon-menu"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MapControl',
  components: {  },
  props: {  },
  data () {
    return {
      control: [
        { name: '我的视野', key: 'view', icon: 'el-icon-aim' },
        { name: '距离测量', key: 'measure', icon: 'el-icon-sugar' },
        { name: '采集位置', key: 'position', icon: 'el-icon-map-location' },
        { name: '显示控制', key: 'control', icon: 'el-icon-view' },
      ],

      show: true
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
<style lang="scss" scoped>
.leaflet-control-container {
  position: absolute;
  right: var(--default-padding);
  top: var(--default-padding);
  z-index: 1000;
  font-size: 12px;
  display: flex;
  flex-direction: row;

  .bg {
    background-color: var(--color-white);
    box-shadow: var(--box-shadow-base);
    border-radius: 4px;
  }

  .control-row {
    display: flex;
    margin-right: var(--default-padding);

    .row {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      cursor: pointer;
      border: solid 1px var(--border-color-base);


      i {
        font-size: 16px;
      }
    }
  }

  .box-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    font-size: 18px;
    background-color: var(--color-primary);
    color: #FFFFFF;
    border-radius: 4px;
    cursor: pointer;
  }
}
</style>
