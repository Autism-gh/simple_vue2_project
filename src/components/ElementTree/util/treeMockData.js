export const vehicleModel = [
    { name: '全部车系', id: 'all', parent: '#', icon: 'el-icon-folder', level: 'first' },
  
    { name: '日系', id: 'rixi', parent: 'all', icon: 'el-icon-folder', level: 'second' },
    { name: '本田', id: 'bentian', parent: 'rixi', icon: 'el-icon-folder', level: 'third' },
    { name: '思域', id: 'siyu', parent: 'bentian', icon: 'el-icon-folder', level: 'fouth' },
    { name: '雅阁', id: 'yage', parent: 'bentian', icon: 'el-icon-folder', level: 'fouth' },
    { name: 'C-RV', id: 'crv', parent: 'bentian', icon: 'el-icon-folder', level: 'fouth' },
  
    { name: '丰田', id: 'fengtian', parent: 'rixi', icon: 'el-icon-folder', level: 'third' },
    { name: '雷凌', id: 'leileng', parent: 'fengtian', icon: 'el-icon-folder', level: 'fouth' },
    { name: '凯美瑞', id: 'kaimeirui', parent: 'fengtian', icon: 'el-icon-folder', level: 'fouth' },
    { name: '亚洲龙', id: 'yazhoulong', parent: 'fengtian', icon: 'el-icon-folder', level: 'fouth' },
  
    { name: '日产', id: 'richan', parent: 'rixi', icon: 'el-icon-folder', level: 'third' },
    { name: '轩逸', id: 'xuanyi', parent: 'richan', icon: 'el-icon-folder', level: 'fouth' },
    { name: '天籁', id: 'tianlai', parent: 'richan', icon: 'el-icon-folder', level: 'fouth' },
    { name: '逍客', id: 'xiaoke', parent: 'richan', icon: 'el-icon-folder', level: 'fouth' },
  
    { name: '马自达', id: 'mazida', parent: 'rixi', icon: 'el-icon-folder', level: 'third' },
    { name: '马自达3', id: 'ma3', parent: 'mazida', icon: 'el-icon-folder', level: 'fouth' },
    { name: '马自达6', id: 'ma6', parent: 'mazida', icon: 'el-icon-folder', level: 'fouth' },
    { name: '马自达CX-30', id: 'macx-30', parent: 'mazida', icon: 'el-icon-folder', level: 'fouth' },
  
    { name: '美系', id: 'meixi', parent: 'all', icon: 'el-icon-folder', level: 'second' },
    { name: '雪佛兰', id: 'xuefulan', parent: 'meixi', icon: 'el-icon-folder', level: 'third' },
    { name: '别克', id: 'bieke', parent: 'meixi', icon: 'el-icon-folder', level: 'third' },
    { name: '凯迪拉克', id: 'kaidilake', parent: 'meixi', icon: 'el-icon-folder', level: 'third' },
  
    { name: '德系', id: 'dexi', parent: 'all', icon: 'el-icon-folder', level: 'second' },
    { name: '大众', id: 'dazhong', parent: 'dexi', icon: 'el-icon-folder', level: 'third' },
    { name: '奥迪', id: 'aodi', parent: 'dexi', icon: 'el-icon-folder', level: 'third' },
    { name: '宝马', id: 'bmw', parent: 'dexi', icon: 'el-icon-folder', level: 'third' },
  
    { name: '国产', id: 'guochan', parent: 'all', icon: 'el-icon-folder', level: 'second' },
    { name: '吉利', id: 'jili', parent: 'guochan', icon: 'el-icon-folder', level: 'third' },
    { name: '长安', id: 'changan', parent: 'guochan', icon: 'el-icon-folder', level: 'third' },
    { name: '比亚迪', id: 'biyadi', parent: 'guochan', icon: 'el-icon-folder', level: 'third' },
    { name: 'BYD唐DMI', id: 'tang', parent: 'biyadi', icon: 'el-icon-folder', level: 'fouth' },
    { name: 'BYD宋DMI', id: 'song', parent: 'biyadi', icon: 'el-icon-folder', level: 'fouth' },
    { name: 'BYD汉DMI', id: 'han', parent: 'biyadi', icon: 'el-icon-folder', level: 'fouth' }
  ]
  
  export const JapanModel = [
    { name: '日系车型', id: 'all', parent: '#', icon: 'el-icon-folder', level: 'first' },
    { name: '本田', id: 'bentian', parent: 'all', icon: 'el-icon-folder', level: 'second' },
    { name: '思域', id: 'siyu', parent: 'bentian', icon: 'el-icon-folder', level: 'third' },
    { name: '雅阁', id: 'yage', parent: 'bentian', icon: 'el-icon-folder', level: 'third' },
    { name: 'C-RV', id: 'yingshipai', parent: 'bentian', icon: 'el-icon-folder', level: 'third' },
  
    { name: '丰田', id: 'fengtian', parent: 'all', icon: 'el-icon-folder', level: 'second' },
    { name: '雷凌', id: 'leileng', parent: 'fengtian', icon: 'el-icon-folder', level: 'third' },
    { name: '凯美瑞', id: 'kaimeirui', parent: 'fengtian', icon: 'el-icon-folder', level: 'third' },
    { name: '亚洲龙', id: 'yazhoulong', parent: 'fengtian', icon: 'el-icon-folder', level: 'third' },
  
    { name: '日产', id: 'richan', parent: 'all', icon: 'el-icon-folder', level: 'second' },
    { name: '轩逸', id: 'xuanyi', parent: 'richan', icon: 'el-icon-folder', level: 'third' },
    { name: '天籁', id: 'tianlai', parent: 'richan', icon: 'el-icon-folder', level: 'third' },
    { name: '逍客', id: 'xiaoke', parent: 'richan', icon: 'el-icon-folder', level: 'third' },
  
    { name: '马自达', id: 'mazida', parent: 'all', icon: 'el-icon-folder', level: 'second' },
    { name: '马自达3', id: 'ma3', parent: 'mazida', icon: 'el-icon-folder', level: 'third' },
    { name: '马自达6', id: 'ma6', parent: 'mazida', icon: 'el-icon-folder', level: 'third' },
    { name: '马自达CX-30', id: 'macx-30', parent: 'mazida', icon: 'el-icon-folder', level: 'third' }
  
  ]
  