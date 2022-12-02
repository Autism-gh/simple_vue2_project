/**
 * 
 * 与element 同步变更的颜色 这里需要动态抛出 利用 css-var 方便其他的样式伴随修改
 * 
 */
const basic = {
    // 基础
    '--color-primary': '#19AC9E',
    
    // 三原色
    '--color-success': '#73D13D',
    '--color-warning': '#F5A071',
    '--color-danger': '#F57171',
    '--color-info': '#999999',

    // 字体
    '--color-text-primary': '#333333',
    '--color-text-regular': '#666666',
    '--color-text-secondary': '#999999',
    '--color-text-placeholder': '#cccccc',

    // 边框
    '--border-color-base': '#dcdcdc',
    '--border-color-light': '#e5e6e7',
    '--border-color-lighter': '#eeeeee',
    '--border-color-extra-light': '#f6f6f6',

    // 背景
    '--background-color-base': '#f6f6f6',
    

    // 阴影
    '--box-shadow-base': '0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)',
    '--box-shadow-dark': '0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .12)',
    '--box-shadow-light': '0 2px 12px 0 rgba(0, 0, 0, 0.1)',

    // 滚动条
    '--scrollbar-background-color':'#dddddd'
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


    // 主体
    '--app-main': '#f6f6f6',


    // 菜单
    '--menu-text': '#bfcbd9',
    '--menu-active-text': '#19AC9E',
    '--sub-menu-active-text': '#f4f4f5',

    '--menu-bg': '#304156',
    '--menu-hover': '#263445',

    '--sub-menu-bg': '#1f2d3d',
    '--sub-menu-hover': '#001528',

    '--side-bar-width': '210px',


    // 间距，间隔
    '--default-padding': '8px'
}


export default {
    ...basic,
    ...extand
}