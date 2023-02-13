module.exports = {
    "plugins": {
        "postcss-import": {},
        "postcss-url": {},
        "autoprefixer": {},
        'postcss-px-to-viewport': {
            propList: ['*'],
            viewportWidth: 1920,
            fontViewportUnit: 'vw',
            viewportUnit: 'vw',
        }
    }
  }