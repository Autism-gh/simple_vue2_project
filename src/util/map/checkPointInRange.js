/**
 * 
 * @param {lat, lng} checkPoint             [lat,lng]
 * @param { latlnglist } polygonPoints      [[lat,lng],[lat,lng]]
 * 目前是判断那个点有没有超界限 这里是采用四点得模式得 就是固定顺序得
 * 这个我估摸着跨越赤道得矩形有问题，但是考虑到我们在china不会出现这种情况得
 * 建议plan B
 * 
 * 
 *  这里拿去页面里测试去吧
    let latlnglist = [
        [30.1896188583493,120.19574411978611],
        [30.20171067168713,120.19574312102262],
        [30.20173822113379,120.21664819367],
        [30.189646408074307,120.21664918680446],
    ]
    看看这是第几个  leaflet
    latlnglist.forEach((item, index) => {
        L.marker(item).bindTooltip(`我是第${index + 1}个`, { permanent: true, offset: [-15, -10], direction: 'top' }).openTooltip()
        .addTo($maticsmap)
    })
    let layer = L.rectangle(latlnglist, {
        color: 'red',
        fillColor: 'red',
        weight: 2,
        fillOpacity: 0.2
    }).addTo($maticsmap);
    let result = this.checkPointInRectangle([30.189944, 120.200404], latlnglist)
 * 
 */
const checkPointInRectangle = (checkPoint, polygonPoints) => {

    // plan A 一路是常规得模式 就是 leaflet 生成得时候得常规顺序 取 左上 和 右下得点进行判断
    let topLeft = polygonPoints[1]
    let bottomRight = polygonPoints[3]

    // plan B 一路是兼容模式，就是外界已经获取到了 左上和右下角得点进行判断
    // let topLeft = polygonPoints[0]
    // let bottomRight = polygonPoints[1]
    
    let result  = true
    switch (true) {
        case checkPoint[0] >= topLeft[0]:
            result = false
            break;
        case checkPoint[1] <= topLeft[1]:
            result = false
            break;
        case checkPoint[0] <= bottomRight[0]:
            result = false
            break;
        case checkPoint[1] >= bottomRight[1]:
            result = false
            break;
    }

    return result
}










/**
 * 这里判断得一句就是根据点向边界发一条射线，判断相交点，奇数就是在圈内，偶数反之
 * @param {*} checkPoint        [lat,lng]
 * @param {*} polygonPoints     [[lat,lng],[lat,lng]]
 * 
 * 
    let layer = L.polygon(binjiangjson, {
        color: 'red',
        fillColor: 'red',
        weight: 2,
        fillOpacity: 0.2
    }).addTo($maticsmap);
    let result = this.checkPointInPolygon([30.189944, 120.200404], binjiangjson)
 * 
 * 
 * 
 */
const checkPointInPolygon = ( checkPoint, polygonPoints ) => {
    var counter = 0;
    var i;
    var xinters;
    var p1, p2;
    var pointCount = polygonPoints.length;
    p1 = polygonPoints[0];

    for (i = 1; i <= pointCount; i++) {
        p2 = polygonPoints[i % pointCount];
        if (
            checkPoint[1] > Math.min(p1[1], p2[1]) &&
            checkPoint[1] <= Math.max(p1[1], p2[1])
        ) {
            if (checkPoint[0] <= Math.max(p1[0], p2[0])) {
                if (p1[1] != p2[1]) {
                    xinters =
                        (checkPoint[1] - p1[1]) *
                            (p2[0] - p1[0]) /
                            (p2[1] - p1[1]) +
                        p1[1];
                    if (p1[0] == p2[0] || checkPoint[0] <= xinters) {
                        counter++;
                    }
                }
            }
        }
        p1 = p2;
    }
    return counter % 2 == 0?false: true
}



const checkPointInPolygonV2 = (checkPoint, polygonPointsX, polygonPointsY) => {
    polygonPointsX = polygonPointsX.concat(polygonPointsX[0])
    polygonPointsY = polygonPointsY.concat(polygonPointsY[0])
    
    let isInside = false;  
    let ESP = 1e-9;  
    let count = 0;  
    let linePoint1x;  
    let linePoint1y;  
    let linePoint2x = 180;  
    let linePoint2y;  
  
    linePoint1x = checkPoint[0];  
    linePoint1y = checkPoint[1];  
    linePoint2y = checkPoint[1];  
  
    for (let i = 0; i < polygonPointsX.length - 1; i++) {  
        let cx1 = polygonPointsX[i];  
        let cy1 = polygonPointsY[i];  
        let cx2 = polygonPointsX[i + 1];  
        let cy2 = polygonPointsY[i + 1];  
        // 如果目标点在任何一条线上  
        if (isOnLine(checkPoint[0], checkPoint[1], cx1, cy1, cx2, cy2)) {  
            return true;  
        }  
        // 如果线段的长度无限小(趋于零)那么这两点实际是重合的，不足以构成一条线段  
        if (Math.abs(cy2 - cy1) < ESP) {  
            continue;  
        }  
        // 第一个点是否在以目标点为基础衍生的平行纬度线  
        if (isOnLine(cx1, cy1, linePoint1x, linePoint1y, linePoint2x,  
                linePoint2y)) {  
            // 第二个点在第一个的下方,靠近赤道纬度为零(最小纬度)  
            if (cy1 > cy2) {
                count++;
            }
        }  
        // 第二个点是否在以目标点为基础衍生的平行纬度线  
        else if (isOnLine(cx2, cy2, linePoint1x, linePoint1y,  
                linePoint2x, linePoint2y)) {  
            // 第二个点在第一个的上方,靠近极点(南极或北极)纬度为90(最大纬度)  
            if (cy2 > cy1) {
                count++;
            }
        }  
        // 由两点组成的线段是否和以目标点为基础衍生的平行纬度线相交  
        else if (isIntersect(cx1, cy1, cx2, cy2, linePoint1x, linePoint1y, linePoint2x, linePoint2y)) {  
            count++;  
        }  
    }  
    if (count % 2 == 1) {  
        isInside = true;  
    }  

    return isInside;  


}


const isOnLine = (px0, py0, px1, py1, px2, py2) => {
    let flag = false
    let ESP = 1e-9
    if ((Math.abs(Multiply(px0, py0, px1, py1, px2, py2)) < ESP)  
            && ((px0 - px1) * (px0 - px2) <= 0)  
            && ((py0 - py1) * (py0 - py2) <= 0)) {  
        flag = true;  
    }  
    return flag; 
}

const isIntersect = (px1, py1, px2, py2, px3, py3, px4, py4) => {
    let flag = false;  
    let d = (px2 - px1) * (py4 - py3) - (py2 - py1) * (px4 - px3);  
    if (d != 0) {  
        let r = ((py1 - py3) * (px4 - px3) - (px1 - px3) * (py4 - py3)) / d;  
        let s = ((py1 - py3) * (px2 - px1) - (px1 - px3) * (py2 - py1)) / d;  
        if ((r >= 0) && (r <= 1) && (s >= 0) && (s <= 1)) {  
            flag = true;  
        }  
    }  
    return flag;  
}

const Multiply = (px0, py0, px1, py1, px2, py2) => {
    return ((px1 - px0) * (py2 - py0) - (px2 - px0) * (py1 - py0));
}

export {
    checkPointInPolygon,
    checkPointInRectangle,
    checkPointInPolygonV2,
}