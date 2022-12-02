<template>
    <div ref="leftRight" :class="['leftRight-container', 
        { hasBorder, hasShadow }, 
        { 'no-margin' : leftmost },
        { 'no-margin' : rightmost },
        { 'no-select' : isDraging }
      ]">
  
      <div class="left-wrapper" :style="leftWrapperStyle" v-show="!leftmost">
        <slot name="leftWrapper"></slot>
      </div>
  
      <div class="right-wrapper" :style="rightWrapperStyle" v-show="checkRightWrapper && !rightmost">
        <slot name="rightWrapper"></slot>
      </div>
  
      <div class="bar-slider left-right" v-show="checkRightWrapper" :style="leftHandleStyle" @mousedown="handleVerticalMove">
        <div class="bar-control">
          <div class="bar-button">
            <div class="bar-icon" v-show="!rightmost" @click.stop="handleHiddenLeft" @mouseover="canDrag = false" @mouseout="canDrag = true">
              <i :class="leftmost ? 'el-icon-caret-right' : 'el-icon-caret-left'"></i>
            </div>
            <div class="bar-icon" v-show="!leftmost" @click.stop="handleHiddenRight" @mouseover="canDrag = false" @mouseout="canDrag = true">
              <i :class="rightmost ? 'el-icon-caret-left' : 'el-icon-caret-right'"></i>
            </div>
          </div>
          <div class="bar-handler vertical"></div>
        </div>
      </div>
  
      <div v-show="barShow" class="move-bar vertical" :style="leftBarStyle"></div>
  
    </div>
  </template>
  <script>
    export default {
      name: 'LeftRight',
      components: {},
      props: {
        hasBorder: {
          type: Boolean,
          default: true
        },
  
        hasShadow: {
          type: Boolean,
          default: false
        },
  
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
  
        initPadding: {
          type: Number,
          default: 10
        },
  
        // 是否伴随移动
        moveFollow: {
          type: Boolean,
          default: false
        },

        haveRight: {
            default: undefined,
        }
      },
      data() {
        return {
          isDraging: false,
  
          canDrag: true,
  
          leftmost: false,
  
          rightmost: false,
  
          barShow: false,
  
          mouseX: 0,
  
          activeLeft: 0,
  
          leftRight: {
            x: 0,
            y: 0,
            height: 0,
            width: 0
          }
        }
      },
      computed: {
        checkLeftWrapper() {
          return this.$slots.leftWrapper
        },
        
        checkRightWrapper() {
            if(this.haveRight !== undefined) {
                return this.haveRight
            } else {
                return this.$slots.rightWrapper
            }
        },
  
        // 最大值
        maxLeftNumber() {
          const {
            width
          } = this.leftRight
          return this.maxLeft > 1 ? this.maxLeft : Math.floor(width * this.maxLeft)
        },
  
        // 最小值
        minLeftNumber() {
          const {
            width
          } = this.leftRight
          return this.minLeft > 1 ? this.minLeft : Math.floor(width * this.minLeft)
        },
  
        // 默认值
        leftNumber() {
          const { width } = this.leftRight
          return this.leftSize > 1 ? this.leftSize : Math.floor(width * this.leftSize)
        },
  
        // 最终值
        formatleftSize() {
          if (!this.checkLeftWrapper) return 0
          let baseValue = this.leftNumber || this.minLeftNumber
          let formatLeft
  
          if(this.moveFollow) {
            formatLeft = this.leftBarX || baseValue
          } else {
            formatLeft = this.activeLeft || baseValue
          }
          return formatLeft
        },
  
        leftWrapperStyle() {
          if(!this.checkRightWrapper) {
            return `width: 100%`
          } else if (this.leftmost) {
            return `width: 0px;`
          } else if (this.rightmost) {
            return `width: 100%`
          } else {
            return `width: ${ this.formatleftSize }px`
          }
        },
  
        rightWrapperStyle() {
          if(!this.checkRightWrapper) {
            return `width: 0`
          } else if (this.leftmost) {
            return 'width: 100%;'
          } else if(this.rightmost) {
            return `width: 0px`
          } else {
            return `width: calc(100% - ${ this.formatleftSize }px)`
          }
        },
  
        leftHandleStyle() {
          // 在最左边
          if(!this.checkRightWrapper) {
            return `right: 0`
          } else if(this.leftmost) {
              return `left: 0px;`
          } else if(this.rightmost) {
              return 'right: 0px'
          } else {
            return `left: ${this.formatleftSize + this.initPadding }px;`
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
          const { x } = this.leftRight
          let activeX = this.mouseX - x
  
          if (activeX) {
            if (activeX < this.minLeftNumber) {
              activeX = this.minLeftNumber
            }
            if (activeX > this.maxLeftNumber) {
              activeX = this.maxLeftNumber
            }
          } else {
            activeX = this.leftNumber || this.minLeftNumber
          }
          return activeX
        },
  
  
        
  
      },
      methods: {
        /**
         * 左右移动
         * @param {*} e 
         */
        handleVerticalMove(e) {
          // 在最左边，或者没有开启拖拽的时候不允许
          if (!this.canDrag || this.leftmost) return
  
          // 开始拖拽模式禁止选中全局，防止蓝屏
          this.isDraging = true
  
          if(!this.moveFollow) {
            this.mouseX = e.clientX
          }
          
          this.getFlexContanerRect()
          this.barShow = true
  
          window.addEventListener('mousemove', this.leftMove)
          window.addEventListener('mouseup', this.leftUp)
        },
  
        getFlexContanerRect() {
          const $flexInstance = this.$refs['leftRight']
          const { x, y, width, height } = $flexInstance?.getBoundingClientRect()
          Object.assign(this.leftRight, { x, y,  height, width })
        },
  
        leftMove(e) {
          this.mouseX = e.clientX
        },
  
        leftUp() {
          this.barShow = false
          this.activeLeft = this.leftBarX - this.initPadding
          window.removeEventListener('mousemove', this.leftMove)
          window.removeEventListener('mouseup', this.leftUp)
          // 记录上次的位置方便判断方向
          this.isDraging = false
        },
  
        handleHiddenLeft() {
            this.leftmost = !this.leftmost
        },
  
        handleHiddenRight() {
            this.rightmost = !this.rightmost
        }
      },
      beforeCreate() {
  
      },
      created() {
  
      },
      beforeMount() {
  
      },
      mounted() {
        this.getFlexContanerRect()
      },
      beforeDestroy() {
  
      },
    }
  </script>
  <style lang="scss" scoped>
    .leftRight-container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      user-select: auto;
      padding: var(--default-padding);
  
      
  
      .left-wrapper {
          position: relative;
          height: 100%;
          border-radius: 4px;
          background-color: var(--color-white);
      }
  
      .right-wrapper {
          position: relative;
          flex: 1;
          height: 100%;
          border-radius: 4px;
          background-color: var(--color-white);
          margin-left: var(--default-padding);
      }
  
      &.no-select {
        user-select: none;
      }
  
      
  
      &.hasBorder {
  
        .left-wrapper,
        .right-wrapper {
          border: solid 1px var(--border-color-base);
        }
      }
  
      &.hasShadow {
  
        .left-wrapper,
        .right-wrapper {
          box-shadow: var(--box-shadow-base);
        }
      }
  
      &.no-margin {
        .right-wrapper {
          margin: 0;
        }
      }
  
    }
  
    .leftRight-container {
      .bar-handler {
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
  
        .bar-control {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
  
          .bar-button {
            position: relative;
            display: none;
            flex-direction: column;
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