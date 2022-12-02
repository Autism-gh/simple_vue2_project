<template>
    <el-row class="treedemo-container" type="flex" justify="space-between">
      <div class="treedemo-wrapper">
        <div class="top">
          <ElementTree ref="treeInstance" :user-hover="false" show-icon default-expand-all :extand-show-rules="extandShowRules" :tree-data="treeData" />
        </div>
        <div class="bottom">
          <el-button type="primary" @click="changeTreeData">切换数据</el-button>
        </div>
      </div>
      <div class="treedemo-wrapper">
        <div class="half-height">
          <div class="title">
            多选模式
          </div>
          <div class="content">
            <ElementTree :user-hover="false" :tree-data="vehicleModel" :extand-show-rules="extandShowRules" @mounted="handleTreeReady" />
          </div>
        </div>
        <div class="half-height">
          <div class="title">
            单选模式
          </div>
          <div class="content">
            <ElementTree :user-hover="false" :tree-data="vehicleModel" :extand-show-rules="extandShowRules" check-mode="radio" />
          </div>
        </div>
      </div>
      <div class="treedemo-wrapper">
        <div class="half-height">
          <div class="title">
            多选默认选中
          </div>
          <div class="content">
            <ElementTree :user-hover="false" :tree-data="vehicleModel" :extand-show-rules="extandShowRules" :default-checked="checkDefault" />
          </div>
        </div>
        <div class="half-height">
          <div class="title">
            单选默认选中
          </div>
          <div class="content">
            <ElementTree :user-hover="false" :tree-data="vehicleModel" :extand-show-rules="extandShowRules" :default-checked="radioDefault" check-mode="radio" />
          </div>
        </div>
      </div>
      <div class="treedemo-wrapper">
        <div class="half-height">
          <div class="title">
            无选中框默认选中
          </div>
          <div class="content">
            <ElementTree :user-hover="false" :tree-data="vehicleModel" :extand-show-rules="extandShowRules" :default-select="nocheckDefault" check-mode="nocheck" />
          </div>
          <div class="title">
            带上引导线
          </div>
          <div class="content">
            <ElementTree :user-hover="false" :tree-data="vehicleModel" :extand-show-rules="extandShowRules" tree-line check-mode="nocheck" />
          </div>
        </div>
      </div>
      <div class="treedemo-wrapper">
        <div class="half-height">
          <div class="title">
            指定层级不显示选中
          </div>
          <div class="content">
            <ElementTree
              :user-hover="false"
              :tree-data="vehicleModel"
              :extand-show-rules="extandShowRules"
              default-expand-all
              :node-show-rules="nodeShowRules"
            />
          </div>
        </div>
        <div class="half-height">
          <div class="title">
            指定层级禁止选中
          </div>
          <div class="content">
            <ElementTree
              :user-hover="false"
              :tree-data="vehicleModel"
              :extand-show-rules="extandShowRules"
              default-expand-all
              :node-show-rules="nodeShowRules2"
            />
          </div>
        </div>
      </div>
    </el-row>
  </template>
  
  <script>
  import ElementTree from '@/components/ElementTree/ElementTree'
  import { vehicleModel, JapanModel } from '@/components/ElementTree/util/treeMockData'

  export default {
    name: 'TreeDemo',
    components: {
      ElementTree
    },
    props: {},
    data() {
      return {
        state: false,
  
        treeData: [...JapanModel],
  
        JapanModel: [...JapanModel],
  
        vehicleModel: [...vehicleModel],
  
        extandShowRules: {
          label: 'name',
          id: 'id',
          parent: 'parent',
          icon: 'icon',
          level: 'level'
        },
  
        nodeShowRules: {
          first: {
            showCheckbox: false
          },
          second: {
            showCheckbox: false
          }
        },
  
        nodeShowRules2: {
          first: {
            disabled: true
          },
          second: {
            disabled: true
          }
        },
  
        checkDefault: ['bentian', 'kaidilake'],
  
        radioDefault: ['bentian'],
  
        nocheckDefault: 'bentian'
      }
    },
    computed: {
  
    },
    watch: {
  
    },
    created() {
  
    },
    mounted() {
  
    },
    methods: {
      handleTreeReady($tree, { treeList, treeData, firstNode }) {
        // console.log('$tree', $tree)
        // console.log('treeList', treeList)
        // console.log('treeData', treeData)
        // console.log('firstNode', firstNode)
      },
  
      async changeTreeData() {
        this.state = !this.state
  
        if (this.state) {
          this.treeData = [...vehicleModel]
        } else {
          this.treeData = [...JapanModel]
        }
  
        await this.$nextTick()
  
        // 数据刷新完的验证钩子
        await this.$refs['treeInstance'].waitForInit
  
        console.log('加载完成验证')
      }
    }
  }
  </script>
  <style lang="scss" scoped>
      .treedemo-container {
          width: 100%;
          height: 100%;
          padding: 10px;
          background: var(--background-color-base);
  
          .treedemo-wrapper {
              height: 100%;
              width: calc((100% - 30px) / 5);
              background-color: #FFFFFF;
  
              .top {
                  height: calc(100% - 50px);
              }
  
              .bottom {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 50px;
              }
          }
  
          .half-height {
              height: 50%;
  
              .title {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 40px;
                  background: var(--border-color-lighter);
              }
  
              .content {
                  height: calc(100% - 40px);
              }
          }
      }
  </style>
  