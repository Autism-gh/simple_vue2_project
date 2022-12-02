import L from 'leaflet'

// import 'leaflet/dist/leaflet.css'
import './scss/leaflet.scss'
// 有些奇怪的样式
import './scss/leaflet-map.scss'


/**
 *  @description 地图基本图层
 *  https://github.com/htoooth/Leaflet.ChineseTmsProviders
 */
require('./lib/Leaflet.ChineseTmsProviders')


/**
 *  @description 常规聚合
 *  https://www.npmjs.com/package/leaflet.markercluster
 */
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'


/**
 *  @description 图标旋转依赖
 *  https://www.npmjs.com/package/leaflet-rotatedmarker
 */
// 这个会偏，假的!!!!!!!
// import 'leaflet-rotatedmarker'
import './lib/Leaflet-Rotatedmarker'




/**
 *  @description 画图工具       内部已改成中文版本的了。。  文件内修改搜索（ handlers ）
 *  @apilink https://github.com/Leaflet/Leaflet.draw
 */
// import './lib/Leaflet.draw'
import 'leaflet-draw'
import './lib/Leaflet.Draw-zh.js'
import 'leaflet-draw/dist/leaflet.draw.css'



/**
 * 测距
 */
import './lib/Leaflet-Polylinemeasure'



/**
 * 
 * 线段上带点东西
 * cnpm install leaflet-polylinedecorator --s
 * 
 */
// import 'leaflet-polylinedecorator'


// import './lib/Leaflet.canvas-marker'



/**
 * 分级聚合
 */
// require('./lib/Leaflet.LayerCollision')
import './lib/Leaflet.LayerCollision'
 


/**
 * 鹰眼地图
 */
import 'leaflet-minimap'
import 'leaflet-minimap/dist/Control.MiniMap.min.css'

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default L