module.exports = {
    title: '基础管理页面模板',

    copyright: 'Autism',

    // 允许登入的用户
    rootUser: {
        admin: 'abc123456d',
        wuchuang: 'autism',
        lynn: '123456'
    },

    // 模拟用户信息
    userInfo: {
        userName: '',
        address: '',
        mapCenter: '',
        age: '',
        vehicle: '',
        photo: ''
    },


    /**
     * @type {boolean} true | false
     * @description Whether show the settings right-panel
     */
    showSettings: true,
  
    /**
     * @type {boolean} true | false
     * @description Whether need tagsView
     */
    tagsView: true,
  
    /**
     * @type {boolean} true | false
     * @description Whether fix the header
     */
    fixedHeader: true,
  
    /**
     * @type {boolean} true | false
     * @description Whether show the logo in sidebar
     */
    sidebarLogo: true,
  
    /**
     * @type {string | array} 'production' | ['production', 'development']
     * @description Need show err logs component.
     * The default is only used in the production env
     * If you want to also use it in dev, you can pass ['production', 'development']
     */
    errorLog: 'production',


    firstPage: '/vehicle/vehicle/index_new_map'
}
  