<template>
    <div class="dialogTree-container">
  
      <div class="dialogTree-item">
        <el-button type="primary" @click="handleOpenModal('checkbox')">打开同步多选弹框树</el-button>
        <el-button type="primary" @click="handleOpenModal('radio')">打开同步单选弹框树</el-button>
        <div class="message">同步取值，调用方法直接打开 / 传递值， 不用来回搞事件传递，配置好东西就可以直接通过方法内获取想要的数据</div>
      </div>
      <DialogTree
        ref="dialogTree"
        :check-mode="dialogTreeModel"
        tree-sign="vehicleModel"
        :mandatory="mandatory"
        :tree-data="vehicleModel"
        :extand-show-rules="extandShowRules"
      />
  
      <div class="dialogTree-item">
        <el-button type="primary" @click="treeDialog = true">打开异步弹框树</el-button>
        <div class="message">异步取值， 事件传递形式的，可能用在触发什么 事件 调用什么查询方法啥的</div>
      </div>
      <DialogTree
        ref="dialogTreeAsync"
        v-model="treeDialog"
        :mandatory="mandatory"
        async-commit
        tree-sign="vehicleModel"
        :tree-data="vehicleModel"
        :extand-show-rules="extandShowRules"
        @change="handleTreeSelectChange"
      />
  
      <div class="dialogTree-item leftRight">
        <div class="left-wrapper">
          <div class="setting-item">
            <div class="title">双向绑定的值(多选)</div>
            <div class="control">
              {{ JSON.stringify(checkboxModelTree) }}
            </div>
          </div>
          <div class="setting-item">
            <div class="title">需要哪些字段？</div>
            <div class="control">
              <el-checkbox-group v-model="checkboxUseKey">
                <el-checkbox label="id" />
                <el-checkbox label="parent" />
                <el-checkbox label="level" />
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="center-wrapper">
          <SelectTree
            ref="selectTreecheckbox"
            v-model="checkboxModelTree"
            :use-key="checkboxUseKey"
            tree-sign="vehicleModel"
            async-commit
            :tree-data="vehicleModel"
            :extand-show-rules="extandShowRules"
          />
        </div>
        <div class="right-wrapper">
          <el-button type="primary" @click="handleOpenFormModal('vehicleList')">模拟给【多选】添加默认值并打开弹框</el-button>
        </div>
      </div>
  
      <div class="dialogTree-item leftRight">
        <div class="left-wrapper">
          <div class="setting-item">
            <div class="title">事件传递(多选)</div>
            <div class="control">
              {{ JSON.stringify(checkboxModelTreeAsync) }}
            </div>
          </div>
          <div class="setting-item">
            <div class="title">需要哪些字段？</div>
            <div class="control">
              <el-checkbox-group v-model="checkboxUseKeyAsync">
                <el-checkbox label="id" />
                <el-checkbox label="parent" />
                <el-checkbox label="level" />
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="center-wrapper">
          <SelectTree
            ref="selectTreecheckboxAync"
            :use-key="checkboxUseKeyAsync"
            tree-sign="vehicleModel"
            :tree-data="vehicleModel"
            :extand-show-rules="extandShowRules"
            @change="handleSetValue"
          />
        </div>
        <div class="right-wrapper">
          <el-button type="primary" @click="setDefaultValue('selectTreecheckboxAync',['siyu', 'yage'])">设置[思域, 雅阁]为默认值</el-button>
        </div>
      </div>
  
      <div class="dialogTree-item leftRight">
        <div class="left-wrapper">
          <div class="setting-item">
            <div class="title">双向绑定的值(单选)</div>
            <div class="control">
              {{ JSON.stringify(radioModelTree) }}
            </div>
          </div>
          <div class="setting-item">
            <div class="title">需要哪些字段？</div>
            <div class="control">
              <el-checkbox-group v-model="radioUseKey">
                <el-checkbox label="id" />
                <el-checkbox label="parent" />
                <el-checkbox label="level" />
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="center-wrapper">
          <SelectTree
            ref="selectTreeradio"
            v-model="radioModelTree"
            check-mode="radio"
            tree-sign="vehicleModel"
            :use-key="radioUseKey"
            async-commit
            :tree-data="vehicleModel"
            :extand-show-rules="extandShowRules"
          />
        </div>
        <div class="right-wrapper">
          <el-button type="primary" @click="handleOpenFormModal('vehicle')">模拟给【单选】添加默认值并打开弹框</el-button>
        </div>
  
      </div>
  
      <div class="dialogTree-item leftRight">
        <div class="left-wrapper">
          <div class="setting-item">
            <div class="title">事件传递(单选)</div>
            <div class="control">
              {{ JSON.stringify(radioModelTreeAsync) }}
            </div>
          </div>
          <div class="setting-item">
            <div class="title">需要哪些字段？</div>
            <div class="control">
              <el-checkbox-group v-model="radioUseKeyAsync">
                <el-checkbox label="id" />
                <el-checkbox label="parent" />
                <el-checkbox label="level" />
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="center-wrapper">
          <SelectTree
            ref="selectTreeradioAsync"
            check-mode="radio"
            tree-sign="vehicleModel"
            :use-key="radioUseKeyAsync"
            :tree-data="vehicleModel"
            :extand-show-rules="extandShowRules"
            @change="handleSetRadioValue"
          />
        </div>
        <div class="right-wrapper">
          <el-button type="primary" @click="setDefaultValue('selectTreeradioAsync','siyu')">设置思域为默认值</el-button>
        </div>
      </div>
  
      <el-dialog
        title="提示"
        :visible.sync="modal.show"
        width="30%"
      >
  
        <el-form ref="form" :model="modal.data" label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="modal.data.name" />
          </el-form-item>
          <el-form-item label="年龄">
            <el-input-number v-model="modal.data.age" :min="1" :max="100" />
          </el-form-item>
          <el-form-item label="车型">
            <SelectTree
              ref="selectTree1"
              v-model="modal.data.vehicle"
              check-mode="radio"
              tree-sign="vehicleModel"
              async-commit
              :tree-data="vehicleModel"
              :extand-show-rules="extandShowRules"
            />
          </el-form-item>
          <el-form-item label="哪些车">
            <SelectTree
              ref="selectTree2"
              v-model="modal.data.vehicleList"
              tree-sign="vehicleModel"
              async-commit
              :tree-data="vehicleModel"
              :extand-show-rules="extandShowRules"
            />
          </el-form-item>
        </el-form>
  
        <span slot="footer" class="dialog-footer">
          <el-button @click="modal.show = false">取 消</el-button>
          <el-button type="primary" @click="handleCommit">确 定</el-button>
        </span>
      </el-dialog>
  
    </div>
  </template>
  
  <script>
  import { DialogTree, SelectTree } from '@/components/ElementTree'
  import { vehicleModel } from '@/components/ElementTree/util/treeMockData'
  export default {
    name: 'ExtandTree',
    components: {
      DialogTree,
      SelectTree
    },
    props: {},
    data() {
      const defaultData = {
        name: '',
        age: '',
        vehicle: '',
        vehicleList: []
      }
  
      return {
        treeDialog: false,
  
        dialogTreeModel: 'radio',
  
        vehicleModel: [...vehicleModel],
  
        extandShowRules: {
          labelkey: 'name',
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
          },
          fouth: {
            showNode: false
          }
        },
  
        returnRules: {
          key: 'level',
          value: ['fouth']
        },
  
        // 不能为空
        mandatory: true,
  
        checkboxModelTree: null,
        checkboxUseKey: ['id', 'parent'],
  
        radioModelTree: null,
        radioUseKey: ['id', 'parent'],
  
        checkboxModelTreeAsync: null,
        checkboxUseKeyAsync: ['id', 'parent'],
  
        radioModelTreeAsync: null,
        radioUseKeyAsync: ['id', 'parent'],
  
        modal: {
          show: false,
  
          defaultData,
          data: JSON.parse(JSON.stringify(defaultData))
        }
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
  
      /**
       *
       * 传值的方式如下
       * 我咋传给你，你咋传给我就行了
       * 如果该值不是你想要的，可以通过 watch 一下绑定的变量 把监听的值转换下在赋给你想要的变量上 / 格式
       *
       */
      async handleOpenFormModal(type) {
        this.modal.show = true
        this.modal.data = JSON.parse(JSON.stringify(this.modal.defaultData))
        await this.$nextTick()
  
        //  多选情况如下
        if (type === 'vehicleList') {
          const mockData = ['siyu', 'yage', 'xuefulan']
          // const mockData = [
          //     { id: 'siyu', a: '', b: '' },
          //     { id: 'yage', a: '', b: '' },
          //     { id: 'xuefulan', a: '', b: '' },
          // ]
          Object.assign(this.modal.data, {
            vehicleList: mockData,
            vehicle: ''
          })
        } else { // 单选情况 唯一值的 id 必须要在！
          const mockData = 'siyu'
          // const mockData = { id: 'siyu', a: '' }
          Object.assign(this.modal.data, {
            vehicle: mockData,
            vehicleList: []
          })
        }
      },
  
      handleSetValue(result) {
        this.checkboxModelTreeAsync = result
      },
  
      handleSetRadioValue(result) {
        this.radioModelTreeAsync = result
      },
  
      /**
       *
       * 同步形式获取需要的数据
       *
       */
      async handleOpenModal(type) {
        this.dialogTreeModel = type
        await this.$nextTick()
        const parmas = type === 'radio' ? ['siyu'] : ['siyu', 'yage']
        const $dialogTree = this.$refs['dialogTree']
        const result = await $dialogTree.initDialogData(parmas)
        console.log('【同步】获取弹框树的值', result)
      },
  
      handleTreeSelectChange(result) {
        console.log('【异步】获取弹框树的值', result)
        this.treeDialog = false
      },
  
      handleCommit() {
        console.log('this.modal.data', this.modal.data)
        this.modal.show = false
      },
  
      async setDefaultValue(refs, value) {
        const $currentTree = this.$refs[refs]
        await $currentTree.waitForInit
        $currentTree.setInputValue(value)
      }
    }
  }
  </script>
  <style lang="scss" scoped>
  
      .dialogTree-container {
          width: 100%;
          height: 100%;
          padding: 10px;
          box-sizing: border-box;
          overflow-y: auto;
  
          .dialogTree-item {
              margin-top: 10px;
              padding: 10px;
              display: flex;
              align-items: center;
              background-color: var(--color-white);
  
              .message {
                  margin-left: 10px;
              }
  
              &.leftRight {
                  flex-direction: row;
  
                  .left-wrapper {
                      display: flex;
                      flex-direction: column;
                      width: 450px;
  
                      .setting-item {
                          margin-bottom: 10px;
                          line-height: 26px;
                      }
                  }
  
                  .center-wrapper {
                      width: 300px;
                  }
              }
  
          }
  
      }
  </style>
  