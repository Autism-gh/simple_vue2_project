'use strict';

import L from 'leaflet'
const factory  = function (L) {
    'use strict';
    // Leaflet.RotatedMarker

    // save these original methods before they are overwritten

    var proto_initIcon = L.Marker.prototype._initIcon;
    var proto_setPos = L.Marker.prototype._setPos;

    var oldIE = L.DomUtil.TRANSFORM === 'msTransform';

    L.Marker.addInitHook(function () {
        var iconOptions = this.options.icon && this.options.icon.options;
        var iconAnchor = iconOptions && this.options.icon.options.iconAnchor;
        if (iconAnchor) {
            iconAnchor = iconAnchor[0] + 'px ' + iconAnchor[1] + 'px';
        }
        this.options.rotationOrigin = this.options.rotationOrigin || iconAnchor || 'center center';
        this.options.rotationAngle = this.options.rotationAngle || 0;

        // Ensure marker keeps rotated during dragging
        this.on('drag', function (e) {
            e.target._applyRotation();
        });
    });

    L.Marker.include({
        _initIcon: function _initIcon() {
            proto_initIcon.call(this);
        },

        _setPos: function _setPos(pos) {
            proto_setPos.call(this, pos);
            this._applyRotation();
        },

        _applyRotation: function _applyRotation() {
            if (this.options.rotationAngle) {
                this._icon.style[L.DomUtil.TRANSFORM + 'Origin'] = this.options.rotationOrigin;

                if (oldIE) {
                    // for IE 9, use the 2D rotation
                    this._icon.style[L.DomUtil.TRANSFORM] = 'rotate(' + this.options.rotationAngle + 'deg)';
                } else {
                    // for modern browsers, prefer the 3D accelerated version
                    this._icon.style[L.DomUtil.TRANSFORM] += ' rotateZ(' + this.options.rotationAngle + 'deg)';
                }
            }
        },

        setRotationAngle: function setRotationAngle(angle) {
            this.options.rotationAngle = angle;
            this.update();
            return this;
        },

        setRotationOrigin: function setRotationOrigin(origin) {
            this.options.rotationOrigin = origin;
            this.update();
            return this;
        }
    });

    var ollb = L.latLngBounds;
    var olb = L.bounds;

    // hardcore dirty hack WTF fix for leaflet/markercluster fail in prod builds

    // Marker cluster seems to think Leaflet.latLngBounds clone the bounds if bounds param is a leaflet llbound
    // it does not and return unitialized llbounds in prod build
    L.latLngBounds = function (bounds) {
        var r = ollb.apply(undefined, arguments) || ollb();
        if (!r._northEast || !r._southWest) {
            Object.keys(bounds).map(function (k) {
                return r[k] = bounds[k];
            }); //should clone
        }
        return r;
    };
    // same for screen bounds
    L.bounds = function (bounds) {
        var r = olb.apply(undefined, arguments) || olb();
        if (!r.min || !r.max) {
            Object.keys(bounds).map(function (k) {
                return r[k] = bounds[k];
            });
        }
        return r;
    };
}
export default factory(L);

