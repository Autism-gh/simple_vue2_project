import Resize from './resize/resize'
import Drag from './dialogdrag/drag'
import Clickoutside from './clickoutside/clickoutside'
import showTooltip from './showTooltip'

export default {
    install: function (Vue) {
        Vue.directive('resize', Resize)
        Vue.directive('drag-dialog', Drag)
        Vue.directive('click-outside', Clickoutside)
        Vue.directive('showTooltip', showTooltip)
    }
}