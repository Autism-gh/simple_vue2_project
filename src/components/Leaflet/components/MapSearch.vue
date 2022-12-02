<template>
  <div class="leaflet-search-container" v-click-outside="handleCloseMenu">
    <div class="address bg" @click="search.show = !search.show">
      <span>{{ search.value.name }}</span>
      <i :class="[search.show? ' el-icon-arrow-up' : 'el-icon-arrow-down']"></i>
    </div>

    <el-collapse-transition>
      <div class="address-content bg" v-show="search.show">
        <div class="address-row">
          <div class="title">常用城市</div>
          <div class="content">
            <span class="city" v-for="item in search.common" :key="item.city_code" @click="handleChangeHot(item)">
              {{ item.chinese_name }}
            </span>
          </div>
        </div>
        <div class="address-row">
          <div class="title">选择城市</div>
          <div class="content">
            <el-cascader @visible-change="hanleRememberState" @change="handleChangeCenter" style="width: 100%"
              placeholder="试试搜索：杭州" :props="{ expandTrigger: 'hover' }" :options="search.list" v-model="search.active"
              filterable>
            </el-cascader>
          </div>
        </div>

      </div>
    </el-collapse-transition>

    <div class="search">
      <el-input v-model="address.value" :style="`width: ${ address.width }`" placeholder="请输入关键字"
        @focus="address.width = '250px'" @blur="address.width = '110px'" clearable>
      </el-input>
      <el-button type="primary" icon="el-icon-search"></el-button>

      <el-collapse-transition>
        <div class="search-content bg" v-show="address.value && address.show">
          <ul class="no-data" v-if="!address.list.length">未查询到数据</ul>
          <ul v-else>
            <li v-for="item in address.list" :key="item.id" @click.stop="changeViewCenter(item)">
              <div class="name">{{ item.name }}</div>
              <el-tag type="success">{{ item.city }}</el-tag>
            </li>
          </ul>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>
<script>
  import L from '../leaflet'
  import {
    provinceAndCityData,
  } from "element-china-area-data"
  import {
    hotCityList
  } from '../util/hotcity'
  import {
    getPoiByAddressOrderGaode,
    getCurrentRangeCenter
  } from '@/util/map/mapGaodeWebApi'

  export default {
    name: 'MapSearch',
    components: {},
    props: {
      area: {
        type: [String, Array],
        default: ''
      }
    },
    data() {
      return {

        search: {
          povershow: false,

          active: [],
          value: {},
          list: provinceAndCityData,
          common: hotCityList,
          show: false,
        },

        address: {
          list: [],
          value: '',
          width: '110px',
          show: false
        },

        mapInstance: null,

        featureGroup: null
      }
    },
    computed: {

    },
    watch: {
      'address.value': function (newVal) {
        this.address.show = true
        this.getSearchLoactionList(newVal)
      },

      'area': function (newVal) {
        if (!newVal || Array.isArray(newVal)) return
        this.search.value = {
          name: newVal
        }
      }
    },
    methods: {
      hanleRememberState(state) {
        this.search.povershow = state
      },

      handleCloseMenu() {
        if (this.search.povershow) return
        this.search.show = false
      },

      init(map) {
        this.mapInstance = map
        this.featureGroup = new L.FeatureGroup().addTo(this.mapInstance)
      },

      changeViewCenter({
        latlng
      }) {
        this.setCurrentView([latlng[1], latlng[0]], 16)
        this.address.show = false
      },


      getSearchLoactionList(query) {
        if (query !== '') {
          setTimeout(async () => {
            const result = await getPoiByAddressOrderGaode({
              keywords: query
            })
            this.address.list = Array.isArray(result) ? result : []
          }, 200);
        } else {
          this.address.list = [];
        }
      },

      async handleChangeCenter(data) {
        const querycode = data[data.length - 1]
        const result = await getCurrentRangeCenter({
          keywords: querycode
        })

        if (!result) {
          this.$warning('获取中心位置失败')
          return
        }

        const {
          adcode,
          center,
          citycode,
          name
        } = result

        const lnglat = center.split(',')
        this.handleChangeHot({
          chinese_name: name,
          city_code: adcode,
          large_code: citycode,
          center: lnglat
        })
      },

      handleChangeHot(item) {
        const {
          chinese_name,
          center,
          city_code
        } = item
        this.search.value = {
          name: chinese_name,
          code: city_code,
          center: center
        }
        // console.log('center', center)
        if (center && center.length) {
          this.setCurrentView(center)
        }
        this.search.show = false
      },

      setCurrentView(latlng, zoom = 10) {
        const fromat = [latlng[1], latlng[0]]
        this.mapInstance && this.mapInstance.setView(L.latLng(fromat), zoom)
      },

      cleanLayer() {
        if (this.featureGroup) {
          this.featureGroup.clearLayers()
          this.featureGroup.remove()
          this.featureGroup = null
        }
      },
    },
    beforeCreate() {

    },
    created() {

    },
    beforeMount() {

    },
    mounted() {
      this.search.value = {
        name: this.area
      }
    },
    beforeDestroy() {
      this.cleanLayer()
    },
  }
</script>
<style lang="scss">
  .leaflet-search-container {

    .el-tabs__content {
      height: calc(100% - 50px);
      padding: 0 !important;
    }

    .search {
      .el-input {
        .el-input__inner {
          line-height: 28px;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
      }

      .el-button {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
</style>

<style lang="scss" scoped>
  .leaflet-search-container {
    position: absolute;
    left: var(--default-padding);
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

    .address {
      position: relative;
      height: max-content;
      width: max-content;
      height: 28px;
      padding: 0 8px;
      cursor: pointer;
      display: flex;
      align-items: center;

      i {
        font-size: 16px;
        margin-left: 5px;
      }
    }

    .address-content {
      position: absolute;
      width: 350px;
      top: 40px;
      z-index: 100;
      padding: 5px 10px 10px 10px;

      .city {
        cursor: pointer;
        line-height: 24px;
        color: var(--color-text-secondary);
        margin-right: var(--default-padding);
      }

      .address-row {

        .title {
          line-height: 30px;
        }
      }
    }

    .search {
      display: flex;
      align-items: center;
      position: relative;
      height: max-content;
      width: max-content;
      margin-left: var(--default-padding);


      .search-content {
        position: absolute;
        top: 35px;
        left: 0;
        width: 100%;
        padding: 10px 0;
        max-height: 200px;
        overflow-y: auto;
        width: 250px;

        .no-data {
          text-align: center;
        }

        li {
          padding: 5px 17px;
          display: flex;
          align-items: center;

          .name {
            width: calc(100% - 50px);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          &:hover {
            cursor: pointer;
            background-color: var(--color-primary);
            color: #FFFFFF;
          }
        }
      }
    }
  }
</style>