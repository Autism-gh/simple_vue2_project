 import './resize.scss';


 const mask = document.createElement('div');
 mask.classList.add('v-resize-mask');
 document.body.appendChild(mask);
 
 
 function getContentWidthOrHeight(el, attr) {
     const computedStyle = window.getComputedStyle(el);
     switch (attr) { 
         case 'width':
             return (
                 el.offsetWidth -
                 parseInt(computedStyle.borderLeftWidth) -
                 parseInt(computedStyle.borderRightWidth) -
                 parseInt(computedStyle.paddingLeft) -
                 parseInt(computedStyle.paddingRight)
             )
         case 'height':
             return (
                 el.offsetHeight -
                 parseInt(computedStyle.borderTopWidth) -
                 parseInt(computedStyle.borderBottomWidth) -
                 parseInt(computedStyle.paddingTop) -
                 parseInt(computedStyle.paddingBottom)
             )
     }
 }
 
 
 class ResizeElm {
 
     constructor(el, binding) {
         this.$el = el;
         const value = binding.value || {};
         const options = this.options = Object.assign({
             min: [0, 0],//width height
             max: [Infinity, Infinity],//width height
             triggerPosition: ['right'],//[right,bottom,bottomRight]
             triggerHint: false,
             scaleOnly: false,//是否按比例缩放 可强制开启或根据triggerPosition自适应
             onResize: null,
             onResized: null,
         }, value)
 
 
         //triggerPosition 三种情况分析
         switch (true) {
             case options.triggerPosition.length === 1 && options.triggerPosition[0] === 'bottomRight':
                 //只有bottomRight 则只能按比例拖动
                 options.scaleOnly = true;
                 break;
             case options.triggerPosition.includes('bottomRight'):
             case options.triggerPosition.includes('right') && options.triggerPosition.includes('bottom'):
                 //只要包含bottomRight或则同时包含[right,bottom],则格式化成[right,bottom,bottomRight]
                 options.triggerPosition = ['right', 'bottom', 'bottomRight'];
                 break;
             // default://[right]或者[bottom]
         }
 
         //其他参数
         this.resizingDirection = 'right';//正在拖动的方向
         this.max = [Infinity, Infinity];//计算后的最大宽和长
         this.min = [0, 0];//计算后的最小宽和长
         this.defaultScale = 1; //长宽比例 为 第一次的baseSize[0]/baseSize[1]
         this.zoom = [1, 1];//按比例缩放的最小最大倍数
         this.paramsInitialized = false;
         this.originalSize = [0, 0];//一开始的宽长
         this.baseRect = [0, 0]; //鼠标点下时的x,y,width,height
         this.resized = false;
 
         el.classList.add(`v-resize`);
         if (!this.options.triggerHint) {
             el.classList.add('v-resize--no-hint');
         }
         this.appendTriggerElm();
 
         this.mouseDownHandle = this.mouseDownHandle.bind(this);
         this.mouseMoveHandle = this.mouseMoveHandle.bind(this);
         this.mouseUpHandle = this.mouseUpHandle.bind(this);
         this.$el.addEventListener('mousedown', this.mouseDownHandle)
     }
 
     appendTriggerElm() {
         const {$el} = this;
         let fragment = document.createDocumentFragment();
         this.options.triggerPosition.forEach(position => {
             let temp = document.createElement('span');
             temp.classList.add(`v-resize__${position.replace(/([A-Z])/g, function ($0, $1) {
                 return `-${$1.toLowerCase()}`
             })}`);
             temp.dataset.resizePosition = position;
             fragment.appendChild(temp)
         })
         $el.appendChild(fragment)
     }
 
     initOtherParams() {
         if (this.paramsInitialized) return;
         const {options} = this;
         ['width', 'height'].forEach((attr, index) => {
             const parentSize = getContentWidthOrHeight(this.$el.parentElement, attr);
             this.max[index] = isNaN(options.max[index]) ? (parseFloat(options.max[index]) * parentSize / 100)
                 : options.max[index];
             this.min[index] = isNaN(options.min[index]) ? (parseFloat(options.min[index]) * parentSize / 100)
                 : options.min[index];
         });
         this.originalSize = [...this.baseRect.slice(2)];
         this.defaultScale = this.originalSize[0] / this.originalSize[1];
         this.zoom = [
             Math.max(this.min[0] / this.originalSize[0], this.min[1] / this.originalSize[1]),
             Math.min(this.max[0] / this.originalSize[0], this.max[1] / this.originalSize[1]),
         ];
 
         this.paramsInitialized = true;
     }
 
     mouseDownHandle(ev) {
         const direction = ev.target.dataset.resizePosition;
         if (!direction) return;
         this.resizingDirection = direction;
         //初始化相关信息
         const rect = this.$el.getBoundingClientRect();
         this.baseRect = [rect.right, rect.bottom, rect.width, rect.height];
 
         this.initOtherParams();
         //显示mask 并设置箭头
         this.$el.classList.add(`v-resize--resizing`);
         mask.style.cursor = direction.replace(/(bottom)?(right)?/i, function ($0, $1, $2) {
             return `${$1 ? 's' : ''}${$2 ? 'e' : ''}-resize`
         });
         mask.style.display = 'block';
         mask.addEventListener('mousemove', this.mouseMoveHandle);
         document.addEventListener('mouseup', this.mouseUpHandle, {once: true});
 
         this.resized = false;
     }
 
     mouseUpHandle() {
         this.$el.classList.remove(`v-resize--resizing`);
         mask.style.display = 'none';
         mask.removeEventListener('mousemove', this.mouseMoveHandle);
         if (this.resized) {
             this.options.onResized && this.options.onResized()
         }
     }
 
     mouseMoveHandle(ev) {
         const direction = this.resizingDirection;
         if (this.options.scaleOnly) {
             let width = ev.clientX - this.baseRect[0] + this.baseRect[2],
                 widthZoom = width / this.originalSize[0],
                 height = ev.clientY - this.baseRect[1] + this.baseRect[3],
                 heightZoom = height / this.originalSize[1];
             let zoom = Math.max(Math.min(Math.max(widthZoom, heightZoom), this.zoom[1]), this.zoom[0]);
             Object.assign(this.$el.style, {
                 width: this.originalSize[0] * zoom + 'px',
                 height: this.originalSize[1] * zoom + 'px',
             })
         } else {
             let width, height;
             switch (direction) {
                 case 'bottomRight':
                 case 'right':
                     width = ev.clientX - this.baseRect[0] + this.baseRect[2];
                     width = Math.max(this.min[0], Math.min(this.max[0], width));
                     this.$el.style.width = width + 'px';
                     if (direction !== 'bottomRight') {
                         break;
                     }
                     break;
                 case 'bottom':
                     height = ev.clientY - this.baseRect[1] + this.baseRect[3];
                     height = Math.max(this.min[1], Math.min(this.max[1], height));
                     this.$el.style.height = height + 'px';
                     break;
             }
         }
 
         this.resized = true;
         this.options.onResize && this.options.onResize()
     }
 
     destroy() {
         this.$el.removeEventListener('mousedown', this.mouseDownHandle);
         this.$el.classList.remove(`v-resize`);
         [...this.$el.children].filter(node => {
             return Array.from(node.classList).some(className => className.indexOf('v-resize__') + 1);
         }).forEach(node => {
             this.$el.removeChild(node);
         })
         this.$el.removeEventListener('mousedown', this.mouseDownHandle, {capture: true})
     }
 }
 
 const instanceSymbol = Symbol('resize');
 
 export default {
     inserted: function (el, binding, vnode) {
         if (!binding.value) {
             return;
         }
         if (!el[instanceSymbol] && binding.value) {
             el[instanceSymbol] = new ResizeElm(el, binding, vnode);
         }
     },
     unbind: function (el) {
         el[instanceSymbol]?.destroy();
     },
     update: function (el, binding, vnode) {
         if (!binding.value) {
             return;
         }
         if (JSON.stringify(binding.oldValue) !== JSON.stringify(binding.value)) {
             el[instanceSymbol]?.destroy();
             if (binding.value) {
                 el[instanceSymbol] = new ResizeElm(el, binding, vnode);
             }
         }
     }
 }