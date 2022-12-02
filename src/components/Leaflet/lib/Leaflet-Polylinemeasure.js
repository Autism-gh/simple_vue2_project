'use strict';
import L from 'leaflet'

const controlColor = 'red'

const factory  =function (L) {
    'use strict';
    L.Polyline.Measure = L.Draw.Polyline.extend({
        options: {
            touchIcon: new L.DivIcon({
                iconSize: new L.Point(8, 8),
                className: 'leaflet-div-icon leaflet-editing-icon leaflet-touch-icon'
            })
        },
        addHooks: function() {
            L.Draw.Polyline.prototype.addHooks.call(this),
            this.options.shapeOptions.color = controlColor,
            this.options.shapeOptions.opacity = .8,
            this.options.shapeOptions.weight = 3,
            this._map && (this._markerGroup = new L.LayerGroup, this._map.addLayer(this._markerGroup), this._nodeGroup = new L.FeatureGroup, this._map.addLayer(this._nodeGroup), this._markers = [], this._map.on("click", this._onClick, this), this._startShape())
        },
        removeHooks: function() {
            L.Draw.Polyline.prototype.removeHooks.call(this),
            this._clearHideErrorTimeout(),
            this._map.off("pointermove", this._onMouseMove, this).off("mousemove", this._onMouseMove, this).off("click", this._onClick, this),
            this._clearGuides(),
            this._container.style.cursor = "",
            this._removeShape()
        },
        _startShape: function() {
            this._drawing = !0,
            this._nodeGroup.clearLayers(),
            this._poly = new L.Polyline([], this.options.shapeOptions),
            this._poly._onClick = function() {},
            this._container.style.cursor = "crosshair",
            this._updateTooltip(),
            this._map.on("pointermove", this._onMouseMove, this).on("mousemove", this._onMouseMove, this)
        },
        _finishShape: function() {
            var path = this._poly.getLatLngs()
            var i = new L.Polyline(path, this._poly.options),
            n = new L.DivIcon({
                html: "<i title='移除' class='leaflet-layer_close el-icon-close'></i>",
                iconAnchor: [26, 8],
                className: "measure-close"
            }),
            r = new L.Marker(path[path.length - 1], {
                icon: n
            });
            r.on("click",
            function() {
                i.remove()
            });
            var o = this._nodeGroup.getLayers()[this._nodeGroup.getLayers().length - 1];
            if (o) {
                var s = o.getTooltip().getContent(),
                a = "公里";
                s.indexOf("米") >= 0 && (a = "米");
                var l = "总长：<span class='leaflet-measure-total'>" + s.split(" ")[0] + "</span>" + a;
                o.getTooltip().setContent(l)
            }
            this._nodeGroup.addLayer(r),
            this._drawing = !1,
            this._cleanUpShape(),
            this._clearGuides(),
            this._updateTooltip(),
            this._map.off("pointermove", this._onMouseMove, this).off("mousemove", this._onMouseMove, this),
            this._container.style.cursor = "",
            i._nodeGroup = this._nodeGroup,
            i.addTo(this._map),
            i.on("remove",
            function() {
                i._nodeGroup.clearLayers()
            }),
            this.disable()
        },
        _cancelDrawing: function(e) {
            L.Draw.Polyline.prototype._cancelDrawing.call(this, e),
            this._nodeGroup.clearLayers()
        },
        addVertex: function(e, i) {
            this._markers.length > 0 && this._markers[this._markers.length - 1].remove(),
            L.Draw.Polyline.prototype.addVertex.call(this, e, i);
            var n = this._markers.length > 1 ? this._getMeasurementString() : "起点";
            n.indexOf("km") >= 0 ? n = n.split(" ")[0] + " 公里": n.indexOf("m") >= 0 && (n = n.split(" ")[0] + " 米"),
            this._addMeasureNode(e, n)
        },
        _addMeasureNode: function(e, i) {
            var n = new L.CircleMarker(e, {
                radius: 4,
                color: "#ff0000",
                fillColor: controlColor,
                weight: 2,
                fillOpacity: 1
            });
            this._nodeGroup.addLayer(n),
            n.bindTooltip(i, {
                permanent: !0,
                direction: "right",
                offset: new L.Point(2, 0),
                className: "leaflet-measure-icon"
            }).openTooltip()
        },
        _removeShape: function() {
            this._poly && (this._map.removeLayer(this._poly), delete this._poly, this._markers.splice(0), this._markerGroup.clearLayers())
        },
        _onClick: function() {
            this._drawing || (this._removeShape(), this._startShape())
        },
        _getTooltipText: function() {
            var e, i, n = this.options.showLength;
            return 0 === this._markers.length ? e = {
                text: L.drawLocal.measure.handlers.polyline.tooltip.start
            }: (i = n ? this._getMeasurementString() : "", e = 1 === this._markers.length ? {
                text: L.drawLocal.measure.handlers.polyline.tooltip.cont,
                subtext: i
            }: {
                text: L.drawLocal.measure.handlers.polyline.tooltip.end,
                subtext: i
            }),
            this._drawing || (e.text = ""),
            e
        }
    }),
    L.Control.MeasureControl = L.Control.extend({
        statics: {
            TITLE: "测距"
        },
        options: {
            position: "topleft",
            handler: {}
        },
        toggle: function() {
            this.handler.enabled() ? this.handler.disable.call(this.handler) : this.handler.enable.call(this.handler)
        },
        onAdd: function(e) {
            var i = null,
            n = "leaflet-control-draw";
            return this._container = L.DomUtil.create("div", "leaflet-bar"),
            this.handler = new L.Polyline.Measure(e, this.options.handler),
            this.handler.on("enabled",
            function() {
                this.enabled = !0,
                L.DomUtil.addClass(this._container, "enabled")
            },
            this),
            this.handler.on("disabled",
            function() {
                delete this.enabled,
                L.DomUtil.removeClass(this._container, "enabled")
            },
            this),
            i = L.DomUtil.create("a", n + "-measure", this._container),
            i.href = "#",
            i.title = L.Control.MeasureControl.TITLE,
            L.DomEvenL.addListener(i, "click", L.DomEvenL.stopPropagation).addListener(i, "click", L.DomEvenL.preventDefault).addListener(i, "click", this.toggle, this),
            this._container
        }
    }),
    L.drawLocal.measure = {
        handlers: {
            polyline: {
                error: '<strong>错误:</strong> 图形边界不能交叉！',
                tooltip: {
                    start: '单击确定起点',
                    cont: '单击确定地点，双击结束',
                    end: '单击确定地点，双击结束'
                }
            }
        }
    },
    L.Map.mergeOptions({
        measureControl: !1
    }),
    L.Map.addInitHook(function() {
        this.options.measureControl && (this.measureControl = L.Control.measureControl().addTo(this))
    }),
    L.Control.measureControl = function(e) {
        return new L.Control.MeasureControl(e)
    }
}
export default factory(L);
