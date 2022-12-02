/**
 * 
 * 与element 同步变更的颜色 这里需要动态抛出 利用 css-var 方便其他的样式伴随修改
 * 
 */
const basic = {
    '--color-primary': '#ff7940',

    // 滚动条
    '--scrollbar-background-color':'#E4E7ED'
}


/**
 * 
 * 
 * extand 拓展颜色
 * 
 * 
 */

const extand = {
    
    // 背景拓展
    '--background-color-light':  '#333333',
    '--background-color-lighter':  '#3a3b3c',
    '--background-color-modal': '#2e2e2e',


    // 菜单
    '--menu-text': '#bfcbd9',
    '--menu-active-text': '#ff7940',
    '--sub-menu-active-text': '#f4f4f5',
    '--menu-bg': '#2e2e2e',
    '--menu-hover': '#333333',
    '--sub-menu-bg': '#1f2d3d',
    '--sub-menu-hover': '#001528',
    '--side-bar-width': '210px'
}


export default {
    ...basic,
    ...extand
}