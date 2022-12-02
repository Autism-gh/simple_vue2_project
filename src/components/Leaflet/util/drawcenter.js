import L from '@/components/Leaflet/leaflet'

import { leafletMapIcon } from '@/components/Leaflet/maputils'

/**
 * 
 * 一个画图的处理器
 * 
 */

class DrawTool {
    constructor(map, callBack) {
        // 地图实例
        this.mapInstance = map

        this.drawControl = null

        this.featureGroup = null

        this.callBack = callBack

        this.activeDrawer = null
        // 开启状态
        this.enable = false
        // 图形已存在
        this.isDrawed = false
        // 类型
        this.type = null
        // 配置信息
        this.options = null
    }

    create(type = true) {
        this.enable = true

        // 存储可编辑图层
        this.featureGroup = new L.FeatureGroup()
        this.mapInstance.addLayer(this.featureGroup)
        
        this.addfeatureGroup()

        this.drawControl = {
            Circle : new L.Draw.Circle(this.mapInstance, {shapeOptions: { weight:3, fillOpacity:0.35 }}),

            Rectangle : new L.Draw.Rectangle(this.mapInstance, {metric:'km',showArea:true,shapeOptions: {weight:3,fillOpacity:0.35}}),

            Polygon: new L.Draw.Polygon(this.mapInstance, {showArea:true,showLength:true, allowIntersection:false,shapeOptions:{weight:3,fillOpacity:0.35}}),

            Polyline: new L.Draw.Polyline(this.mapInstance, {showLength:true, allowIntersection:false,shapeOptions:{weight:4,fillOpacity:0.35}}),

            Marker: new L.Draw.Marker(this.mapInstance, {icon: leafletMapIcon['default'],  shapeOptions: {weight:3,fillOpacity:0.35}}),

            Measure: new L.Polyline.Measure(this.mapInstance),

            Edit: new L.EditToolbar.Edit(this.mapInstance, {featureGroup: this.featureGroup}),

            Delete: new L.EditToolbar.Delete(this.mapInstance, {featureGroup: this.featureGroup})
        }
        

        if(type) {
            this.mapInstance.on(L.Draw.Event.CREATED, (event) => {
                const { layer } = event
                this.isDrawed = true
                if(this.callBack) {
                    this.callBack(event)
                } else {
                    this.featureGroup.addLayer(layer)
                    this.edit()
                }
            })
        }
    }

    addfeatureGroup() {
        if(!this.featureGroup) {
            // 存储可编辑图层
            this.featureGroup = new L.FeatureGroup()
            this.mapInstance.addLayer(this.featureGroup)
        }
    }

    addLayer({ layer, type, options }) {
        this.type = type
        // 清空已有
        if(this.isDrawed) {
            this.clear()
        }

        if(options) this.options = options

        if(layer) {
            this.isDrawed = true
            this.featureGroup.addLayer(layer)
            const bounds = this.featureGroup.getBounds()
            this.mapInstance && this.mapInstance.fitBounds(bounds)
        }
    }

    /**
     * polyline, polygon, circle, rectangle, marker, circlemarker
     * @param {*} type 
     */
    draw(type, options) {
        this.type = type
        this.options = options

        // 清空已有
        if(this.isDrawed) {
            this.clear()
        }

        // 停止绘画
        this.stopDraw()
        
        this.activeDrawer = this.drawControl[type]

        if(this.activeDrawer) {
            if(options) this.activeDrawer.setOptions(options)
            this.activeDrawer.enable()
        }
    }

    reDraw() {
        this.stopDraw()
        this.stopEdit()
        this.clear()
        this.draw(this.type)
    }

    // 都停下来仅次于销毁了
    clearAll() {
        this.stopDraw()
        this.stopEdit()
        this.clear()
    }

    stopDraw() {
        if(this.activeDrawer) this.activeDrawer.disable()
    }

    edit() {
        this.drawControl && this.drawControl.Edit.enable()
    }

    stopEdit() {
        this.isDrawed = false
        this.drawControl && this.drawControl.Edit.disable()
    }

    save() {
        this.drawControl && this.drawControl.Edit.save()
    }

    clear() {
        if(this.featureGroup) this.featureGroup.clearLayers()
        this.isDrawed = false
    }

    getLayer() {
        if(!this.featureGroup) return
        const layers = this.featureGroup.getLayers()
        return layers[0]
    }

    getParmas() {
        if(!this.featureGroup) return
        const currentLayer = this.featureGroup.getLayers()[0]

        if(!currentLayer) return
        let parmas = null
        if(this.type === 'Circle') {
            parmas = {
                latlng: currentLayer.getLatLng(),
                radius: currentLayer.getRadius()
            }
        }

        if(this.type === 'Marker') {
            parmas = {
                latlng: currentLayer.getLatLng()
            }
        }

        if(['Polyline', 'Polygon', 'Rectangle'].includes(this.type)) {
            parmas = {
                latlng: currentLayer.getLatLngs()
            }
        }

        return parmas
    }

    destroy() {
        this.stopDraw()
        this.stopEdit()
        if(this.featureGroup) {
            this.featureGroup.clearLayers()
            this.featureGroup.remove()
        }
        this.mapInstance.off('click', L.Draw.Event.CREATED);
        this.enable = false
    }
}


export default DrawTool