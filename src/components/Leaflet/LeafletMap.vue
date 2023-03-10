<template>
  <div :class="['leaflet-container', $slots.rightWrapper ? 'pattern--resize' : 'pattern--normal']">

    <LeftRight 
      :leftSize="leftSize" 
      :minLeft="0.35" 
      :maxLeft="0.65" 
      :initPadding="0" 
      style="padding: 0"
      :haveRight="Boolean($slots.rightWrapper)">

      <div class="leaflet__leftwrapper" ref="mapcontent" slot="leftWrapper">
        <slot name="leftWrapper"></slot>

        <div class="leaflet-center" ref="leafletref"></div>

        <!-- 右上角控制器 -->
        <div class="leaflet-control-container">
          <div class="left_top_control bg" v-show="control.show">

            <div class="row" @click="startMeasureControl">
              <IconBtn icon="iconfont icon-ceju" title="距离测量"></IconBtn>
            </div>
            <div class="row" @click="startDrawControl">
              <IconBtn icon="iconfont icon-caijiweizhi" title="采集位置"></IconBtn>
            </div>
            <div class="row">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <IconBtn icon="el-icon-view" title="显示控制"></IconBtn>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-checkbox-group v-model="control.selectList" @change="controlChange">
                    <div class="custom-drop-row" v-for="item in control.list" :key="item.key">
                      <el-checkbox :label="item.key">
                        {{ item.name }}
                      </el-checkbox>
                    </div>
                  </el-checkbox-group>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="row">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <IconBtn icon="el-icon-map-location" title="地图来源"></IconBtn>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-radio-group v-model="control.acctiveMap" @change="mapSourceChange">
                    <div class="custom-drop-row" v-for="item in control.mapSourceList" :key="item.key">
                      <el-radio :label="item.key">
                        {{ item.name }}
                      </el-radio>
                    </div>
                  </el-radio-group>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div :class="control.show ? 'functionopen' : 'functionclose'" class="right_top_btn"
            @click="control.show = !control.show">
            <i class="el-icon-menu"></i>
          </div>
        </div>

        <!-- 左上角查询 -->
        <MapSearch v-if="control.searchSwitch" ref="mapsearch" :area="bottomaddress.active"></MapSearch>

        <MapPopup ref="addressCollect" :minWidth="250" :offset="[0, -20]">
          <div class="address_popup">
            <li><span>经度:</span><span>{{ address.result.lng }}</span></li>
            <li><span>纬度:</span><span>{{ address.result.lat }}</span></li>
            <li><span>地址:</span><span>{{ address.result.address }}</span></li>
          </div>
        </MapPopup>

        <div class="leaflet-bottom-address" v-show="control.bottomSwitch"><span>{{ bottomaddress.format }}</span></div>
      </div>

      <!-- 分割 -->
      <template slot="rightWrapper">
        <slot name="rightWrapper"></slot>
      </template>

    </LeftRight>

    <slot></slot>
  </div>
</template>
<script>
  import L from './leaflet'
  import LeftRight from '../Layout/LeftRight.vue'
  import MapSearch from './components/MapSearch.vue'
  import MapPopup from './components/MapPopup.vue'
  import DrawTool from './util/drawcenter'
  import mapmixin from './mapmixin'
  import {
    leafletMapIcon
  } from './maputils'
  export default {
    name: 'LeafletMap',
    components: {
      MapSearch,
      MapPopup,
      LeftRight
    },
    mixins: [mapmixin],
    props: {
      leftSize: {
        type: Number,
        default: 0.55
      },

      propOptions: {
        type: Object,
        default: function () {
          return {}
        }
      },

      center: {
        type: Array,
        default: () => {
          return [30.266597, 120.152585]
        }
      }

    },
    data() {
      return {
        mapInstance: null,

        waitForInit: null,

        promiseResolve: null,
      }
    },
    computed: {

      formatOptions() {
        return Object.assign({
          minZoom: 3,
          maxZoom: 18,
          zoom: 10,
          tapTolerance: 25,
          zoomControl: false,
          attributionControl: false,
          crs: L.CRS.EPSG3857,
          center: this.center
        }, this.propOptions)
      }
    },
    methods: {

      /**
       * 
       * 生成地图的
       * 
       */
      generateMap() {
        this.mapInstance = L.map(this.$refs['leafletref'], this.formatOptions)

        this.mapSourceChange()

        this.addControOnMap()
        this.reflashMap()
        this.promiseResolve(this.mapInstance)
        this.$emit('ready', this.mapInstance)
      },

      addControOnMap() {
        // 测距
        this.polylineMeasure = new L.Polyline.Measure(this.mapInstance)

        // 生成好绘图工具箱
        this.drawToolInstane = new DrawTool(this.mapInstance, this.handleDrawCallBack)

        // 坐标采集的框框
        this.addressPopup = this.$refs['addressCollect'].init(this.mapInstance)

        this.startListerCenter(this.closeSingle)

        if (this.control.selectList) {
          this.control.selectList.forEach(item => {
            this.changeCurrentControl(item, true)
          })
        }
      },

      fitBounds(bounds) {
        this.mapInstance.fitBounds(bounds)
      },

      fitLayerBounds(layer) {
        if (!layer) return
        const bounds = layer.getBounds()
        this.mapInstance.fitBounds(bounds)
      },

      addNewMarker({
        lat,
        lng,
        type = 'default',
        options = {}
      }) {
        if (!this.mapInstance) return
        const formatOptions = Object.assign({}, {
          icon: leafletMapIcon[type]
        }, options)
        return L.marker([lat, lng], formatOptions).addTo(this.mapInstance)
      },

      removeMarker(marker) {
        if (!this.mapInstance || !marker) return
        this.mapInstance.removeLayer(marker)
      },

      setView(marker, zoom) {
        this.mapInstance && this.mapInstance.setView(marker.getLatLng(), zoom)
      },

      reflashMap() {
        if (this.mapInstance) this.mapInstance.invalidateSize()
      },


      distoryMap() {
        if (this.mapInstance) this.mapInstance.remove()
      },

    },
    beforeCreate() {

    },
    created() {
      this.waitForInit = new Promise((resolve => {
        this.promiseResolve = resolve;
      }))
    },
    beforeMount() {

    },
    mounted() {
      this.generateMap()
      this.addControOnMap()

      this.observerInstance = new ResizeObserver(() => this.reflashMap())
      this.observerInstance.observe(this.$refs['mapcontent'])
    },

    beforeDestroy() {
      this.drawToolInstane.destroy()
      if (this.observerInstance) {
        this.observerInstance.unobserve(this.$refs['mapcontent'])
        this.observerInstance = null
      }
      this.distoryMap()
    },

    activated() {
      this.reflashMap()
    },
  }
</script>
<style lang="scss">
  .custom-drop-row {
    padding: 0 8px;
    height: 24px;
    display: flex;
    align-items: center;

    &.no-data {
      text-align: center
    }
  }

  .custom-drop-view {
    padding: 0 3px;
  }

  .custom-view-row {
    padding: 0 8px;
    line-height: 30px;

    li {
      display: flex;
      align-items: center;
      cursor: pointer;

      .view-name {
        width: calc(100% - 100px);
        flex-grow: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .view-btn {
        display: none;

        .el-tag {
          margin-left: 10px;
          cursor: pointer;
        }
      }

      &:hover {
        .view-btn {
          display: flex;
          align-items: center
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  @import './scss/leaflet-custom.scss';

  .leaflet-container {
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 12px;
    background-color: var(--color-white);
  }

  .leaflet-center {
    height: 100%;
    width: 100%;
  }
</style>