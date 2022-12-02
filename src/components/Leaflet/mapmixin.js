import L from './leaflet'

import {
    getArrayDifference
} from '@/util/common/common'
import {
    getAddressByLnglat
} from '@/util/map/mapGaodeWebApi'
import {
    acctiveMap,
    timmeMap
} from './maputils'

import _ from 'lodash'

import { addNewView, getViewList, setViewDefault, removeView } from '@/axios/app/map'
import { isString } from '@/util/common/type-check'

export default {
    data() {
        return {
            scaleLayer: null,

            polylineMeasure: null,

            drawToolInstane: null,

            minimapLayer: null,

            trafficLayer: null,

            addressPopup: null,

            address: {
                popup: null,
                marker: null,
                result: {}
            },

            control: {
                searchSwitch: true,
                bottomSwitch: false,

                show: true,
                list: [{
                        name: '地址搜索',
                        key: 'search_control'
                    },
                    {
                        name: '中心地址',
                        key: 'center_address'
                    },
                    {
                        name: '比例尺',
                        key: 'scale_control'
                    },
                    //   { name: '级别工具', key: 'zoom_control' },
                    {
                        name: '鹰眼工具',
                        key: 'mini_control'
                    },
                    {
                        name: '路况',
                        key: 'traffic_control'
                    }
                ],
                oldselect: ['search_control', 'center_address', 'scale_control'],
                selectList: ['search_control', 'center_address', 'scale_control'],
                map: []
            },

            view: {
                value: '',
                list: []
            },

            bottomaddress: {
                format: '',
                active: '',
                detail: {}
            },
        }
    },

    computed: {
        closeSingle() {
            const { searchSwitch, bottomSwitch } = this.control
            return !searchSwitch && !bottomSwitch
        }  
    },

    watch: {
        closeSingle(newVal) {
            this.startListerCenter(newVal)
        }
    },

    methods: {
        controlChange(value) {
            const different = getArrayDifference(value, this.control.oldselect)
            different.forEach(item => {
                // 老的里面有就是移除的 反之就是新加的
                if (this.control.oldselect.includes(item)) {
                    this.changeCurrentControl(item, false)
                } else {
                    this.changeCurrentControl(item, true)
                }
            })
            this.control.oldselect = [...value]
        },

        changeCurrentControl(type, state) {
            switch (type) {
                case 'search_control':
                    this.startSearchControl(state)
                    break;
                case 'center_address':
                    this.startCenterLatlng(state)
                    break;
                case 'scale_control':
                    this.changeScaleControl(state)
                    break;
                case 'mini_control':
                    this.changeMiniMapLayer(state)
                    break;
                case 'traffic_control':
                    this.changeTrafficLayer(state)
                    break;
            }
        },



        /**
         * 
         * 搜索功能控制器 -----------------------
         * 
         */
        async startSearchControl(state) {
            this.control.searchSwitch = state
            await this.$nextTick()
            if (state) {
                this.$refs['mapsearch'].init(this.mapInstance)
            }
        },


        /**
         * 中心经纬度开关控制器 ------------------
         */
        startCenterLatlng(state) {
            this.control.bottomSwitch = state
        },
        


        /**
         * 位置采集功能 ----------------------------
         */
        startDrawControl() {
            if (!this.drawToolInstane.enable) {
                this.drawToolInstane.create()
            }
            this.clearPopupMarker()
            this.drawToolInstane.draw('Marker')
        },

        clearPopupMarker() {
            if (this.address.marker) this.mapInstance.removeLayer(this.address.marker)
            this.mapInstance.off("popupclose")
        },

        async handleDrawCallBack(event) {
            const {
                layer,
                layer: {
                    _latlng: {
                        lng,
                        lat
                    }
                }
            } = event
            this.address.marker = layer.addTo(this.mapInstance)
            this.$refs['addressCollect'].open(layer)
            const {
                formatted_address
            } = await getAddressByLnglat({
                lng,
                lat
            })
            this.address.result = {
                lng,
                lat,
                address: formatted_address
            }
            await this.$nextTick()

            this.mapInstance.on("popupclose", (e) => {
                if(e.popup == this.addressPopup) {
                    this.clearPopupMarker()
                }
            })

            this.drawToolInstane.destroy()
        },



        /**
         * 测距工具开关 -----------------------------
         */
        startMeasureControl() {
            if (!this.polylineMeasure) return
            if (this.polylineMeasure._enabled) {
                this.polylineMeasure.disable()
            } else {
                this.polylineMeasure.enable()
            }
        },



        /**
         * 比例尺开关 --------------------------------------
         */
        changeScaleControl(type) {
            if (type) {
                if (this.scaleLayer) {
                    this.scaleLayer.addTo(this.mapInstance)
                } else {
                    this.scaleLayer = new L.Control.Scale({
                        imperial: false
                    })
                }
            } else {
                this.scaleLayer && this.scaleLayer.remove()
            }
        },


        /**
         * 鹰眼地图 -----------------------------------------
         * @param {*} type 
         */
        changeMiniMapLayer(type) {
            if (type) {
                if (!this.minimapLayer) {
                    const titleLayer = L.tileLayer.chinaProvider(acctiveMap, {
                        maxZoom: 13,
                        minZoom: 3
                    })
                    this.minimapLayer = L.control.minimap(titleLayer, {
                        position: "bottomright",
                        toggleDisplay: true,
                        collapsedWidth: 20,
                        collapsedHeight: 20,
                        minimized: true,
                        aimingRectOptions: {
                            color: "#ff1100",
                            weight: 2
                        },
                        shadowRectOptions: {
                            color: "#0000AA",
                            weight: 1,
                            opacity: 0,
                            fillOpacity: 0
                        }
                    }).addTo(this.mapInstance)
                } else {
                    this.minimapLayer.addTo(this.mapInstance)
                }
            } else {
                this.minimapLayer && this.minimapLayer.remove()
            }
        },


        /**
         * 路况 --------------------------------------------
         * @param {} type 
         */
        changeTrafficLayer(type) {
            if (type) {
                if (!this.trafficLayer) {
                    this.trafficLayer = L.tileLayer.chinaProvider(timmeMap, {
                        maxZoom: 18,
                        minZoom: 3
                    }).addTo(this.mapInstance)
                } else {
                    this.trafficLayer.addTo(this.mapInstance)
                }
            } else {
                this.trafficLayer && this.trafficLayer.remove()
            }
        },

        /**
         * 视野得增删改查
         * @returns 
         */
        async getVisuaFieldCenter() {
            const result = await getViewList()  
            if(!result || !result.state || !result.data || !result.data?.length) {
                this.view.list = []
                return
            }
            const active = result?.data.find(item => item.is_default)
            this.view.list = result.data || []
            this.changeCurrentView(active)
        },

        async setVisuaFieldDefault({ _id }) {
            const result = await setViewDefault({ id: _id })
            if(!result || !result.state) {
                this.$warning(result.message || '设置失败')
                return
            }
            this.$success('设置成功')
            this.getVisuaFieldCenter()
        },

        async removeVisuaField({ _id }) {
            const result = await removeView({ id: _id })
            if(!result || !result.state) {
                this.$warning(result.message || '删除失败')
                return
            }
            this.$success('删除成功')
            this.getVisuaFieldCenter()
        },

        async addNewVisuaField() {
            if(!this.view.value) {
                this.$warning('请输入视野名称')
                return
            }
            const zoom = this.mapInstance.getZoom()
            const center = this.mapInstance.getCenter()
            const { lat, lng } = center
            const parmas = {
                class: 'visual_field',
                data: {
                    name: this.view.value,
                    zoom: zoom.toString(),
                    center: {
                        __type: 'GeoPoint',
                        latitude: lat.toString(),
                        longitude: lng.toString(),
                    },
                    is_default: 0
                }
            }
            const formatParmas = JSON.stringify(parmas)
            const result = await addNewView(formatParmas)
            if(!result || !result.status) {
                this.$warning(result.message || '添加失败')
                return
            }

            this.view.value = ''
            this.getVisuaFieldCenter()
        },

        changeCurrentView(item) {
            if(!item) return
            const { zoom, center } = item
            this.mapInstance && this.mapInstance.setView([center[1], center[0]], zoom)
        },


        /**
         * 开始监听中心点地址
         */
        startListerCenter(state) {
            if(!this.mapInstance) return
            if (state) {
                this.bottomaddress = { format: '', active: '' }
                this.mapInstance.off('zoomend', this.changeCenterAddress)
                this.mapInstance.off('moveend', this.changeCenterAddress)
            } else {
                this.changeCenterAddress()
                this.mapInstance.on('zoomend', this.changeCenterAddress)
                this.mapInstance.on('moveend', this.changeCenterAddress)
            }
        },
        
        checkAddress(value) {
            return value && isString(value)
        },

        changeCenterAddress: _.debounce(async function() {
            if(!this.mapInstance) return
            const zoom = this.mapInstance?.getZoom()
            const center = this.mapInstance?.getCenter()
            const {
                lat,
                lng
            } = center
            const address = await getAddressByLnglat({
                lng,
                lat
            })
            const {
                formatted_address,
                addressComponent: {
                    country,
                    province,
                    city,
                    district,
                    township
                }
            } = address
            let format = []

            if (zoom < 5) {
                this.checkAddress(country) && format.push(country)
            } else if (zoom >= 5 && zoom < 10) {
                this.checkAddress(province) && format.push(province)
                this.checkAddress(city) && format.push(city)
            } else if (zoom >= 10 && zoom < 14) {
                this.checkAddress(province) && format.push(province)
                this.checkAddress(city) && format.push(city)
                this.checkAddress(district) && format.push(district)
                this.checkAddress(township) && format.push(township)
            } else if (zoom >= 14) {
                this.checkAddress(formatted_address) && format.push(formatted_address)
            }

            this.bottomaddress = {format: format.join('-'), active: city || township}
        }, 500)

    },

    mounted () {
        this.getVisuaFieldCenter()
    }
}