const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,

    // tab
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,

    token: state => state.user.token,
    name: state => state.user.name,

    userInfo: state => state.user.userInfo,
    jurisdiction: state => state.user.buttonPermiss,

    roles: state => state.user.roles,
    menus: state => state.user.menus,

    errorLogs: state => state.errorLog.logs,

    columnsSettings: state => state.columns.columnsSettings,

    treeData: state => state.tree.treeData
  }
  
  export default getters
  