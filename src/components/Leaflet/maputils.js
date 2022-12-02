export const acctiveMap = 'GaoDe.Normal.Map'

export const timmeMap = 'GaoDe.Time.Map'

import L from '@/components/Leaflet/leaflet'

export const leafletMapIcon = {
    'default': L.icon({ iconUrl: require('../../assets/images/map/default.png'), iconSize: [22, 33], iconAnchor: [11, 32] }),
    'start': L.icon({ iconUrl: require('../../assets/images/map/start.png'), iconSize: [24, 32], iconAnchor: [12, 30] }),
    'end': L.icon({ iconUrl: require('../../assets/images/map/end.png'), iconSize: [24, 32], iconAnchor: [12, 30] }),

    'online': L.icon({ iconUrl: require('../../assets/images/map/online.png'), iconSize: [28, 28], iconAnchor: [14, 14] }),
    'offline': L.icon({ iconUrl: require('../../assets/images/map/offline.png'), iconSize: [28, 28], iconAnchor: [14, 14] }),

    'arrow': L.icon({ iconUrl: require('../../assets/images/map/arrowTop.svg'), iconSize: [28, 28], iconAnchor: [14, 14] }),
    'mapBase': L.icon({ iconUrl: require('../../assets/images/map/mapBase.svg'), iconSize: [30, 30], iconAnchor: [15, 15] }),
}


export const drawMapLayer = (options) => {
    let layer = null

    const formatOptions = JSON.parse(options)
    const { coordinates, type, radius } = formatOptions?.geometry
    const formatList = coordinates[0]

    if(type === 'Circle') {
        layer = L.circle(formatList, { radius })
    }

    if(type === 'Polygon') {
        layer = L.polygon(formatList)
    }

    if(type === 'Rectangle') {
        layer = L.rectangle(formatList)
    }
    return layer 
}

export const changeLngLatToGeoJson = (type, options) => {
    if(['Circle'].includes(type)) {
        const { radius, latlng} = options
        const format = [latlng.lat, latlng.lng]
        return {
            type: "Feature",
            properties: {},
            geometry: {
                coordinates: [format],
                radius: radius,
                type: 'Circle'
            }
        }
    } 

    if(['Polygon', 'Rectangle'].includes(type)) {
        const { latlng} = options
        const format = latlng[0].map(item => {
            return [item.lat, item.lng]
        })
        return {
            type: "Feature",
            properties: {},
            geometry: {
                type: type,
                coordinates: [format]
            }
        }
    }
}

export const translateDireDesc = (dire) => {
    var text = ''
    if(!dire && dire != 0) {
        text = '-'
        return text
    } else if (dire == 0 || dire == 360) {
        text = '正北'
    } else if (dire > 0 && dire < 90) {
        text = '东北'
    } else if (dire == 90) {
        text = '正东'
    } else if (dire > 90 && dire < 180) {
        text = '东南'
    } else if (dire == 180) {
        text = '正南'
    } else if (dire > 180 && dire < 270) {
        text = '西南'
    } else if (dire == 270) {
        text = '正西'
    } else if (dire > 270 && dire < 360) {
        text = '西北'
    } else {
        text = '正北'
    }
    return text
}
