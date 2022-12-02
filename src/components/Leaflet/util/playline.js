
import L from '@/components/Leaflet/leaflet'
import { leafletMapIcon } from '@/components/Leaflet/maputils'
import { isNumber, isObject } from '@/util/common/type-check'

class TrackLine {
    constructor(map, playedCallBack = null, markClickCallBack = null, lineClickCallBack = null) {
        // 地图实例
        this.mapInstance = map

        this.activePolyline = null
        this.activeOptions = {
            weight: 8,
            opacity: 1,
            color: '#0000ff'
        }

        this.playedPolyline = null
        this.playedOptions = {
            weight: 8,
            opacity: 1,
            color: 'red'
        }

        this.pointList = []

        this.activeDecorator = null

        this.activeMarker = null

        this.featureGroup = null

        this.pointFeatureGroup = null

        this.maxLength = 0

        this.activePoint = 0

        this.playedSpeed = 1

        this.isDrawed = false

        this.playTimer = null

        this.isPlaying = false

        this.playedCallBack = playedCallBack

        this.markClickCallBack = markClickCallBack

        this.lineClickCallBack = lineClickCallBack


        this.listeners = {}
    }


    
    on(name, listener) {
        if (typeof listener === 'function') {
            const handlers = this.listeners[name] = this.listeners[name] || []
            handlers.push(listener)
        }
    }

    off(name, listener) {
        if (typeof listener === 'function') {
            const handlers = this.listeners[name] || []
            this.listeners[name] = handlers.filter(handler => handler !== listener)
        }
    }

    trigger(name, payload) {
        if (Object.prototype.hasOwnProperty.call(this.listeners, name)) {
            const listeners = this.listeners[name] || []
            for (const handler of listeners) {
                handler(payload)
            }
        }
    }


    /**
     * 创建好线，起点终点
     * @param {经纬度列表} latlng 
     */
    create(list) {
        if(!list || !list.length) return

        const latlngList = list.map(item => [+item.lat, +item.lng])
        // const latlngList = [[30.263167, 120.206937], [30.741194, 120.750761], [31.216861, 121.470365], [31.310771,120.574979]]
        this.maxLength = latlngList.length

        this.pointList = list

        const startLatlng = latlngList[0]
        const endLatlng = latlngList[latlngList.length - 1]

        // 起点终点
        const startMarker = new L.Marker(startLatlng, { icon: leafletMapIcon['start'] })
        const endMarker = new L.Marker(endLatlng, { icon: leafletMapIcon['end'] })

        this.featureGroup = new L.FeatureGroup([startMarker, endMarker])
        this.mapInstance.addLayer(this.featureGroup)
        
        // 轨迹线
        this.activePolyline = L.polyline(latlngList, this.activeOptions).addTo(this.mapInstance)

        // 已经播放的线
        this.playedPolyline = L.polyline([], this.playedOptions).addTo(this.mapInstance)

        this.pointFeatureGroup = new L.LayerGroup.Collision({ margin: 5 }).addTo(this.mapInstance)

        // this.pointFeatureGroup = L.canvasIconLayer({}).addTo(this.mapInstance);

        list.forEach((item, index) => {
            const { lat, lng, dire } = item
            // const icon = L.divIcon({className: 'leaflet-arrow-icon el-icon-caret-top'});
            const icon = leafletMapIcon['arrow']
            const marker = new L.Marker([lat, lng], { zIndexOffset: 1000, rotationAngle: dire, icon: icon })
            marker.pointIndex = index
            
            marker.on('click', (e) => {
                const { pointIndex } = e.target
                // 开始播放了把点放上去
                this.jumpOnCurrentStep(pointIndex)

                // jump 中已经存在 避免触发两次
                // if(this.lineClickCallBack) {
                //     this.lineClickCallBack(pointIndex, e.target)
                //     console.log('click')
                // }
            })
            this.pointFeatureGroup.addLayer(marker)
        })

        this.activeMarker = new L.Marker(startLatlng, {
            icon: leafletMapIcon['online'],
            rotationAngle: 0,
            zIndexOffset: 1000
        })

        this.activeMarker.on('click', (e) => {
            if(this.markClickCallBack) {
                this.markClickCallBack(this.activePoint, e.target)
            }
        })

        this.isDrawed = true

        this.activePolyline && this.mapInstance.fitBounds(this.activePolyline.getBounds())

        this.trigger('ready', { target: this })
    }


    clear() {
        if(this.featureGroup) {
            this.featureGroup.clearLayers()
            this.featureGroup = null
        }

        if(this.activePolyline) {
            this.mapInstance.removeLayer(this.activePolyline)
            this.activePolyline = null
        }

        if(this.playedPolyline) {
            this.mapInstance.removeLayer(this.playedPolyline)
            this.playedPolyline = null
        }
        
        if(this.activeDecorator) {
            this.mapInstance.removeLayer(this.activeDecorator)
            this.activeDecorator = null
        }

        if(this.activeMarker) {
            this.mapInstance.removeLayer(this.activeMarker)
            this.activeMarker = null
        }

        if(this.pointFeatureGroup) {
            this.pointFeatureGroup.clearLayers()
            this.pointFeatureGroup.remove()
            this.pointFeatureGroup = null
        }

        this.pause()

        this.isDrawed = false

        this.isPlaying = false
        
        this.pointList = []

        this.activePoint = 0
    }

    /**
     * 
     * 播放过的操作
     * 
     */
    setPlayedStyle(options) {
        if(!options || !isObject(options)) return
        if(this.playedPolyline) {
            this.playedPolyline.setStyle(options)
            Object.assign(this.playedOptions, options)
        }
    }


    /**
     * 
     * 箭头线条
     * 
     */
    setPolylinePatterns(patterns) {
        if(!patterns) return

        if(this.activeDecorator) {
            this.activeDecorator.setPatterns(patterns)
        }
    }



    /**
     * 
     * 线操作
     * 
     */
    setPolylineStyle(options) {
        if(!options || !isObject(options)) return
        if(this.activePolyline) {
            this.activePolyline.setStyle(options)
            Object.assign(this.activeOptions, options)
        }
    }


    /**
     * 方向  经纬度   图标  透明度
     * dire, latlng, icon, opacity
     * 点操作
     * 
     */

    start() {
        if(!this.isDrawed) return

        // 开始播放了把点放上去
        if(!this.mapInstance.hasLayer(this.activeMarker)) {
            this.activeMarker && this.activeMarker.addTo(this.mapInstance)
        }
        this.startSpeedPlay(this.playedSpeed)

        this.trigger('start', { target: this })
    }

    pause() {
        if(this.playTimer) {
            clearInterval(this.playTimer)
            this.playTimer = null
        } 
        this.isPlaying = false

        this.trigger('pause', { target: this })
    }

    stop() {
        this.pause()

        this.activePoint = 0
        this.playedPolyline.setLatLngs([])
        this.changMarkerPosition(0)
        
        if(this.mapInstance.hasLayer(this.activeMarker)) {
            this.mapInstance.removeLayer(this.activeMarker)
        }

        this.trigger('stop', { target: this })
    }

    speedUp() {
        if(!this.isDrawed) return
        const activeSpeed = this.playedSpeed - 1
        if(activeSpeed < 0) {
            console.log('播放速度最大了已经')
            return
        }

        if(this.isPlaying) {
            this.startSpeedPlay(activeSpeed)
        } else {
            this.playedSpeed = activeSpeed
        }
    }

    speedDown() {
        if(!this.isDrawed) return
        const activeSpeed = this.playedSpeed + 1
        if(activeSpeed > 10) {
            console.log('播放速度最慢了已经')
            return
        }

        if(this.isPlaying) {
            this.startSpeedPlay(activeSpeed)
        } else {
            this.playedSpeed = activeSpeed
        }
    }

    setSpeed(speed) {
        if(this.isPlaying) {
            this.startSpeedPlay(speed)
        } else {
            this.playedSpeed = speed
        }
    }

    /**
     * 越大越快
     * @param {1 ~ 10} speed 
     * @returns 
     */
    startSpeedPlay(speed) {
        if(!isNumber(speed)) return
        speed = 1 - (0.1 * (speed - 1))
        this.pause()

        this.isPlaying = true
        this.playTimer = setInterval(this.handleMarkerRun.bind(this), 1000 * speed)
    }

    setMarkerStyle({ dire, latlng, icon, opacity }) {
        if(!this.activeMarker) return
        if(icon) {
            this.activeMarker.setIcon(icon)
        }
        if(latlng) {
            this.activeMarker.setLatLng(latlng)
        }
        if(dire) {
            this.activeMarker.setRotationAngle(dire)
        }
        if(opacity) {
            this.activeMarker.setOpacity(opacity)
        }
    }


    handleMarkerRun() {
        // 播完了
        if(this.activePoint + 1 > this.maxLength - 1) {
            this.activePoint = 0
            this.stop()
            this.trigger('over', { target: this })
        } else {
            this.changMarkerPosition(this.activePoint)
            this.activePoint++
        }
    }


    jumpOnCurrentStep(index) {
        if(!this.mapInstance.hasLayer(this.activeMarker)) {
            this.activeMarker && this.activeMarker.addTo(this.mapInstance)
        }
        this.activePoint = index
        const playedList = this.pointList.slice(0, index)
        this.playedPolyline.setLatLngs(playedList)
        this.changMarkerPosition(index, true)
    }


    changMarkerPosition(step, formJump = false) {
        if(!this.activeMarker) return    
        
        const activePoint = this.pointList[step]
        const { dire, lat, lng, icon } = activePoint
        const latlng = [lat, lng]

        if(lat && lng) {
            this.activeMarker.setLatLng(latlng)
        }
        if(dire) {
            this.activeMarker.setRotationAngle(dire)
        }
        if(icon) {
            const markIcon = leafletMapIcon[icon]
            this.activeMarker.setIcon(markIcon)
        }

        // 跳跃过来的就要特别对待了
        this.playedPolyline.addLatLng(latlng)
    
        
        // 如果车抛出了视角之外的话，把他拽回来
        const bounds = this.mapInstance.getBounds()
        if(!bounds.contains(this.activeMarker.getLatLng())) {
            this.mapInstance.panTo(latlng, {
                animate: true,
            })
        }

        this.trigger('run', { target: this })

        if(this.playedCallBack) {
            this.playedCallBack(step)
        }

        if(formJump) {
            // console.log('formJump')
            this.lineClickCallBack && this.lineClickCallBack(this.activePoint, this.activeMarker)
        }
    }

    destroy() {
        this.clear()
    }
}


export default TrackLine