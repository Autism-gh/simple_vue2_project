import Vue from 'vue'

import ElementUI from 'element-ui';

Vue.use(ElementUI, { size: 'mini' })

//  主要为了element得提示有点不方便，这样子可以直接穿文字就好了得
Vue.prototype.$success = (msg) => {
    ElementUI.Message({type: 'success', message: msg, showClose: true});
}
Vue.prototype.$error = (msg) => {
    ElementUI.Message({type: 'error', message: msg, showClose: true});
}
Vue.prototype.$warning = (msg) => {
    ElementUI.Message({type: 'warning', message: msg, showClose: true});
}
Vue.prototype.$info = (msg) => {
    ElementUI.Message({type: 'info', message: msg, showClose: true});
}

// 这两个默认关闭了
ElementUI.Dialog.props.closeOnClickModal.default = false;

ElementUI.Dialog.props.top.default = '10vh'

ElementUI.MessageBox.setDefaults({
  closeOnClickModal: false
})

