<template>
    <div class="popup-wrapper">
        <div class="popup-close" @click="close" v-show="customClose">
            <i class="el-icon-close"></i>
        </div>
        <slot></slot>
    </div>
</template>

<script>
import L from 'leaflet'
export default {
    name: 'MapPopup',
    data () {
        return {
            visible: false,

            mapInstance: null,

            popopInstance: null,

            currentMarker: null
        }
    },
    props: {
        className: {
            type: String,
            default: 'custom-popup'
        },
        maxWidth: {             // 最大像素
            type: Number,
            default: 300
        },
        minWidth: {             // 最小像素
            type: Number,
            default: 200
        },
        autoPan: {              //  地图平移仍然打开
            type: Boolean,
            default: true
        },
        keepInView: {           //  防止用户在屏幕打开时弹出屏幕上的弹出窗口 将其设置为true.
            type: Boolean,
            default: false
        },
        autoClose: {            // 如果在打开另一个弹窗时，是否自动关闭之前的弹窗.
            type: Boolean,
            default: true
        },
        closeOnClick: {
            type: Boolean,
            default: false
        },
        closeOnMove: {
            type: Boolean,
            default: false
        },
        customClose: {
            type: Boolean,
            default: true
        },
        closeButton: {
            type: Boolean,
            default: false
        },
        offset: {
            type: Array,
            default: () => {
                return [0, 0]
            }
        }
    },
    methods: {
        init(map) {
            this.mapInstance = map
            this.popopInstance = L.popup({
                className: this.className,
                maxWidth: this.maxWidth,
                minWidth: this.minWidth,
                autoPan: this.autoPan,
                keepInView: this.keepInView,
                autoClose: this.autoClose,
                closeButton: this.closeButton,
                closeOnClick: this.closeOnClick,
                offset: this.offset
            })
            .setLatLng([30.1956,120.2073])
            .setContent(this.$el);

            return this.popopInstance;
        },
        open(marker) {
            if(marker instanceof L.Marker) {
                this.visible = true
                this.removeListener()
                marker.on('disappear',this.close)

                if(this.closeOnMove) {
                    marker.on('move',this.positionChangedListener)
                }

                this.currentMarker = marker
                this.popopInstance.setLatLng(marker.getLatLng()).openOn(this.mapInstance)
            } else if (marker instanceof L.LatLng) {
                this.visible = true
                this.popopInstance.setLatLng(marker).openOn(this.mapInstance)
            }
        },
        removeListener() {
            if (this.currentMarker) {
                this.currentMarker.off('disappear',this.close)
                this.currentMarker.off('move',this.positionChangedListener)
                this.currentMarker = null
            }
        },
        positionChangedListener(e) {
            if (this.visible) {
                this.popopInstance.setLatLng(e.latlng)
            }
        },
        close() {
            this.mapInstance.closePopup(this.popopInstance)
        }
    },
    beforeDestroy() {
        this.removeListener()
    }
}
</script>

<style lang="scss" scoped>
.popup-wrapper {
    position: relative;

    .popup-close {
        position: absolute;
        right: 0;
        top: 0;
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        cursor: pointer;
        z-index: 10;
    }
}
</style>

