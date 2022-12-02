<template>
    <div ref="flexContainer" 
        :class="['flex-container', 
        { hasBorder, hasShadow }, 
        `${ horizontal.topmost }-screen`,
        isDraging ? 'no-select': '']">
        <div class="left-wrapper" 
            v-if="checkLeftWrapper" 
            v-show="!vertical.leftmost"
            :style="leftWrapperStyle">

            <div class="disable-task" v-show="leftDis"></div>

            <div class="left-top">
                <slot name="leftWrapper"></slot>
            </div>
            <div class="left-bottom" v-show="$slots.leftBottom">
                <slot name="leftBottom"></slot>
            </div>
        </div>

        <div class="right-wrapper" :style="rightWrapperStyle">
            <div class="right-wrapper__top" 
                v-if="checkLTopWrapper"
                v-show="horizontal.topmost !== 'top'" 
                :style="topWrapperStyle">
                <div class="disable-task" v-show="rightTopDis"></div>
                <div class="wapper-content">
                    <slot name="rightTop"></slot>
                </div>
            </div>
            <div class="right-wrapper__bottom"
                v-if="checkLBottomWrapper"
                v-show="horizontal.topmost !== 'bottom'"
                :style="bottomWrapperStyle">
                <div class="disable-task" v-show="rightBottomDis"></div>
                <slot name="rightBottom"></slot>
            </div>
        </div>


        <div class="bar-slider left-right" 
            v-if="checkLeftWrapper"
            :style="leftHandleStyle" 
            @mousedown="handleVerticalMove">
            
            <div class="bar-control">
                <div class="bar-button">
                    <div class="bar-icon" @click.stop="handleHiddenLeft" 
                        @mouseover="vertical.canDrag = false" 
                        @mouseout="vertical.canDrag = true">
                        <i :class="vertical.leftmost ? 'el-icon-caret-right' : 'el-icon-caret-left'"></i>
                    </div>
                </div>
                <div class="bar-handler vertical"></div>
            </div>
            
        </div>

        <div class="bar-slider top-bottom" 
            v-if="checkLBottomWrapper && checkLTopWrapper"
            :style="topHandleStyle"
            @mousedown="handleHorizontalMove">
            
            <div class="bar-control">
                <div class="bar-button">
                    <div class="bar-icon" 
                        v-show="horizontal.topmost === 'center' || horizontal.topmost === 'top'" 
                        @click.stop="handleHiddenBottom"
                        @mouseover="horizontal.canDrag = false" 
                        @mouseout="horizontal.canDrag = true">
                        <i class="el-icon-caret-bottom"></i>
                    </div>
                    <div class="bar-icon"  
                        v-show="horizontal.topmost === 'center' || horizontal.topmost === 'bottom'"  
                        @click.stop="handleHiddenTop"
                        @mouseover="horizontal.canDrag = false" 
                        @mouseout="horizontal.canDrag = true">
                        <i class="el-icon-caret-top"></i>
                    </div>
                </div>
                <div class="bar-handler horizontal"></div>
            </div>
        </div>

        <div v-show="vertical.barShow" class="move-bar vertical" :style="leftBarStyle"></div>
        <div v-show="horizontal.barShow" class="move-bar horizontal" :style="topBarStyle"></div>

        <slot></slot>
    </div>
</template>
<script>
import { isString } from '@/util/common/type-check'
export default {
    name: 'flexContainer2',
    components: {  },
    props: {  
        leftSize: {
            type: Number,
            default: 320
        },

        /**
         *  大于 0 代表像素值
         *  小于 0 代表百分比系数
         */
        maxLeft: {
            type: Number,
            default: 0.5
        },

         /**
         *  大于 0 代表像素值
         *  小于 0 代表百分比系数
         */
        minLeft: {
            type: Number,
            default: 240
        },

        topSize: {
            type: Number,
            default: 120
        },

         /**
         *  大于 0 代表像素值
         *  小于 0 代表百分比系数
         */
        maxTop: {
            type: Number,
            default: 0.6
        },
         /**
         *  大于 0 代表像素值
         *  小于 0 代表百分比系数
         */
        minTop: {
            type: Number,
            default: 120
        },

        hasBorder: {
            type: Boolean,
            default: true
        },

        hasShadow: {
            type: Boolean,
            default: false
        },

        leftDis: {
            type: Boolean,
            default: false
        },

        rightTopDis: {
            type: Boolean,
            default: false
        },

        rightBottomDis: {
            type: Boolean,
            default: false
        },

        initPadding: {
            type: Number,
            default: 8
        },

        // 是否伴随移动
        moveFollow: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            isDraging: false,

            vertical: {
                barShow: false,
                leftmost: false,
                canDrag: true,
                mouseX: 0,
                left: 0
            },

            horizontal: {
                barShow: false,
                fromBottom: true,
                canDrag: true,
                topmost: 'center',
                donwY: 0,
                mouseY: 0,
                top: 0
            },
            
            flexContainer: {
                x: 0,
                y: 0,
                height: 0,
                width: 0
            }
        }
    },

    watch: {
        
    },

    computed: {
        checkLeftWrapper() {
            return this.$slots.leftWrapper
        },
        
        checkLTopWrapper() {
            return this.$slots.rightTop
        },

        checkLBottomWrapper() {
            return this.$slots.rightBottom
        },

        /**
         * 标量
         */
        maxLeftNumber() {
            const { width } = this.flexContainer
            return this.maxLeft > 1 ? this.maxLeft : Math.floor(width * this.maxLeft) 
        },
        minLeftNumber() {
            const { width } = this.flexContainer
            return this.minLeft > 1 ? this.minLeft : Math.floor(width * this.minLeft)
        },
        leftNumber() {
            const { width } = this.flexContainer
            return this.leftSize > 1 ? this.leftSize : Math.floor(width * this.leftSize)
        },

        maxTopNumber() {
            const { height } = this.flexContainer
            return this.maxTop > 1 ? this.maxTop : Math.floor(height * this.maxTop)
        },
        minTopNumber() {
            const { height } = this.flexContainer
            return this.minTop > 1 ? this.minTop : Math.floor(height * this.minTop)
        },
        topNumber() {
            const { height } = this.flexContainer
            return this.topSize > 1 ? this.topSize : Math.floor(height * this.topSize)
        },

        
        formatleftSize() {
            if(!this.checkLeftWrapper) return 0
            const { left  } = this.vertical

            let baseValue = this.leftNumber || this.minLeftNumber
            let formatLeft

            if(this.moveFollow) {
                formatLeft = this.leftBarX || baseValue
            } else {
                formatLeft = left || baseValue
            }
            return formatLeft
        },

        leftWrapperStyle() {
            const { leftmost } = this.vertical
            if(leftmost) {
                return `width: 0px;`
            } else {
                return `width: ${ this.formatleftSize }px`
            }
        },

        rightWrapperStyle() {
            const { leftmost } = this.vertical
            if(leftmost) {
                return 'width: 100%;'
            } else {
                return `width: calc(100% - ${ this.formatleftSize }px)`
            }
            
        },
        
        leftHandleStyle() {
            const { leftmost } = this.vertical
            // 在最左边
            if(leftmost) {
                return `left: 0px;`
            } else {
                return `left: ${this.formatleftSize + this.initPadding}px;`
            }
        },
        
        leftBarStyle() {
            if(this.moveFollow) {
                return `left: ${ this.leftBarX + this.initPadding }px`
            } else {
                return `left: ${ this.leftBarX }px`
            }
        },

        leftBarX() {
            const { mouseX } = this.vertical
            const { x } = this.flexContainer
            let activeX = mouseX - x
            if(activeX) {
                if(activeX < this.minLeftNumber) {
                    activeX = this.minLeftNumber
                }
                if(activeX > this.maxLeftNumber) {
                    activeX = this.maxLeftNumber
                }
            } else {
                activeX = this.leftNumber || this.minLeftNumber
            }
            return activeX
        },


        formattopSize() {
            if(!this.checkLTopWrapper) return 0
            const { top } = this.horizontal
            let formatTop = top || this.topNumber || this.minTopNumber
            return formatTop
        },


        topWrapperStyle() {
            if (!this.checkLBottomWrapper) return 'height: 100%'

            const { topmost } = this.horizontal
            if(topmost === 'top') {
                return `height: 0px;`
            } else if(topmost === 'bottom') {
                return `height: 100%`
            } else {
                return `height: ${this.formattopSize}px;`
            }
        },

        bottomWrapperStyle() {
            if(!this.checkLTopWrapper) return 'height: 100%'

            const { topmost } = this.horizontal
            if(topmost === 'top') {
                return `height: 100%;`
            } else if(topmost === 'bottom') {
                return `height: 0;`
            } else {
                return `height: calc(100% - ${this.formattopSize}px - ${ this.initPadding }px);`
            }
        },

        formatHandleStyle() {
            if(isString(this.formattopSize)) {
                return this.formattopSize
            } else {
                return `${ this.formattopSize + this.initPadding }px`
            }
        },

        topHandleStyle() {
            const { topmost } = this.horizontal
            const { leftmost } = this.vertical

            const width = leftmost ? 'width: 100%' : `width: calc( 100% - ${this.formatleftSize }px - ${ this.initPadding }px);`
            if(topmost === 'top') {
                return `${ width } top: 0px;`
            } else if(topmost === 'bottom') {
                return `${ width } bottom: 0`
            } else {
                return `top: ${this.formatHandleStyle}; ${ width } `
            }
        },

        topBarStyle() {
            return `width: calc( 100% - ${this.formatleftSize }px - ${ this.initPadding }px); top: ${ this.topBarY }px;`
        },


        topBarY() {
            const { mouseY } = this.horizontal
            const { y } = this.flexContainer
            let activeY = mouseY - y

            if(activeY) {
                if(activeY < this.minTopNumber) {
                    activeY = this.minTopNumber
                } 
                if(activeY > this.maxTopNumber) {
                    activeY = this.maxTopNumber
                }
            } else {
                activeY = this.topNumber || this.minTopNumber
            }
            return activeY
        }
    },
    methods: {
        handleHiddenLeft() {
            this.vertical.leftmost = !this.vertical.leftmost
        },

        handleHiddenBottom() {
            const { topmost } = this.horizontal
            if(topmost === 'center') {
                this.horizontal.topmost = 'bottom'
            } else {
                this.horizontal.topmost = 'center'
            }
        },

        handleHiddenTop() {
            const { topmost } = this.horizontal
            if(topmost === 'center') {
                this.horizontal.topmost = 'top'
            } else {
                this.horizontal.topmost = 'center'
            }
        },


        /**
         * 左右移动
         * @param {*} e 
         */
        handleVerticalMove(e) {
            const { canDrag, leftmost } = this.vertical
            if(!canDrag || leftmost) return
            this.isDraging = true

            if(!this.moveFollow) {
                this.vertical.mouseX = e.clientX 
            }

            this.getFlexContanerRect()
            this.vertical.barShow = true
            window.addEventListener('mousemove', this.leftMove)
            window.addEventListener('mouseup', this.leftUp)
        },

        leftMove(e) {
            this.vertical.mouseX = e.clientX
        },

        leftUp() {
            this.vertical.barShow = false
            this.vertical.left = this.leftBarX - this.initPadding
            window.removeEventListener('mousemove', this.leftMove)
            window.removeEventListener('mouseup', this.leftUp)
            this.isDraging = false
        },

        /**
         * 
         * 上下移动
         * 
         */

        handleHorizontalMove(e) {
            const { canDrag, topmost } = this.horizontal
            if(!canDrag || topmost !== 'center') return

            this.isDraging = true
            this.horizontal.donwY = e.clientY
            this.horizontal.mouseY = e.clientY 
            this.getFlexContanerRect()
            this.horizontal.barShow = true
            window.addEventListener('mousemove', this.rightMove)
            window.addEventListener('mouseup', this.rightUp)
        },
        rightMove(e) {
            this.horizontal.mouseY = e.clientY 
        },
        rightUp(e) {
            const { donwY } = this.horizontal
            const upY = e.clientY
            this.horizontal.fromBottom = upY < donwY
            this.horizontal.barShow = false
            const { height } = this.flexContainer
            this.horizontal.top = this.topBarY - this.initPadding
            if(top >= (height - this.initPadding)) {   // 触底
                this.horizontal.top = '100%'
            } else if(top < (0 + this.initPadding)) {  // 顶
                this.horizontal.top = 0
            } 
            // this.horizontal.top = top
            window.removeEventListener('mousemove', this.rightMove)
            window.removeEventListener('mouseup', this.rightUp)
            this.isDraging = false
        },


        getFlexContanerRect() {
            const $flexInstance = this.$refs['flexContainer']
            const { x, y, width, height } = $flexInstance?.getBoundingClientRect()
            Object.assign(this.flexContainer, { x, y, height, width })
        },
    },
    beforeCreate () {

    },
    created () {

    },
    beforeMount () {

    },
    mounted () {
        this.getFlexContanerRect()
    },
    beforeDestroy() {

    },
}
</script>
<style lang="scss" scoped>
.flex-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    user-select: auto;
    padding: var(--default-padding);


    .disable-task {
        z-index: 10;
        background: transparent;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.05);
    }

    .wapper-content {
        height: 100%;
        width: 100%;
        overflow: hidden;
    }

    .left-wrapper {
        position: relative;
        height: 100%;
        border-radius: 4px;
        background-color: var(--color-white);
        margin-right: var(--default-padding);
        display: flex;
        flex-direction: column;

        .left-top {
            position: relative;
            width: 100%;
            flex-grow: 1;
            height: calc(100% - 300px);
        }

        .left-bottom {
            position: relative;
            width: 100%;
        }
    }

    .right-wrapper {
        position: relative;
        height: 100%;
        border-radius: 4px;
        flex: 1;
        overflow: hidden;
    }
    
    .right-wrapper__top {   
        position: relative;
        width: 100%;
        padding: var(--default-padding);
        background-color: var(--color-white);
    }   

    .right-wrapper__bottom {
        position: relative;
        width: 100%;
        // height: 0;
        flex: 1;
        background-color: var(--color-white);
    }


    &.hasBorder {
        .left-wrapper, .right-wrapper__top, .right-wrapper__bottom {
            border: solid 1px var(--border-color-base);
        }
    }

    &.hasShadow {
        .left-wrapper, .right-wrapper__top, .right-wrapper__bottom {
            box-shadow: var(--box-shadow-base);
        }
    }

    &.center-screen {
        .right-wrapper__top {
            margin-bottom: var(--default-padding);
        }
    }

    &.no-select {
        user-select: none;
    }

    .left-bottom, .right-wrapper__top {
        /deep/ .filter-item {
            display: flex;
            align-items: center;

            .title {
                padding-right: var(--default-padding);
            }

            .control {
                width: calc(100% - 100px);
                flex-grow: 1;
            }
        }
    }   

    .left-bottom {
        /deep/ .filter-item {
            + .filter-item {
                margin-top: var(--default-padding);
            }
        }
    }
    .right-wrapper__top {
        /deep/ .filter-item {
            + .filter-item {
                margin-left: var(--default-padding);
            }
        }
    }  
}

.flex-container {

    .bar-handler {
        &.horizontal {
            position: relative;
            width: 50px;
            height: 5px;
            border-radius: 4px;
            background: var(--scrollbar-background-color);
        }

        &.vertical {
            position: relative;
            height: 50px;
            width: 5px;
            border-radius: 4px;
            background: var(--scrollbar-background-color);
        }
    }

    .bar-slider {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;

        &.left-right {
            cursor: e-resize;
            top: 0px;
            height: 100%;
            width: var(--default-padding);
        }

        &.top-bottom {
            cursor: n-resize;
            right: 0px;
            height: var(--default-padding);
            justify-content: center;
        }
        
        .bar-control {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;

            .bar-button {
                position: relative;
                display: none;
                justify-content: center;
                align-items: center;
            }

            .bar-icon {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: var(--color-white);
                box-shadow: var(--box-shadow-base);
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                z-index: 100000;

                &:hover {
                    background-color: var(--color-primary);
                    color: var(--color-white);
                }
            }
        }

        &:hover {
            .bar-control {
                .bar-button {
                    display: flex;
                }

                .bar-handler {
                    display: none;
                }
            }
        }
    }


    .move-bar {
        background-color: var(--background-color-base);
        border: 1px dashed var(--border-color-base);
        position: absolute;
        z-index: 10000;
        
        &.horizontal {
            width: 100%;
            height: var(--default-padding);
            cursor: n-resize;
            margin-left: -9px;
            right: 0px;
        }

        &.vertical {
            height: 100%;
            width: var(--default-padding);
            cursor: e-resize;
            top: 0px;
        }
    }
}
</style>
