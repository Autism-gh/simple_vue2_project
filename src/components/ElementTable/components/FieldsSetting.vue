<template>
  <el-dialog
    title="设置"
    :visible.sync="dialogShow"
    top="10vh"
    width="800px"
    class="setting__dialog"
  >
    <el-row :gutter="20">
        <el-col :span="12">
            <ElementTree 
                v-if="dialogShow"
                :treeIcon="false"
                ref="fieldstree" 
                :extandShowRules="extandShowRules" 
                :treeData="allFields" 
                default-expand-all
                @node-check="handleNodeChecked">
            </ElementTree>
        </el-col>
        <el-col :span="12">
          <div class="setting-header">
            锁定前 <el-input-number class="margin--lr" v-model="pinned" :min="0" :max="5" ></el-input-number> 列
          </div>
          <div class="setting-body">
            <draggable v-model="checkedFields">
              <transition-group>
                  <div class="field-row" v-for="element in checkedFields" :key="element.field">
                      {{element.name}}
                  </div>
              </transition-group>
            </draggable>
          </div>
        </el-col>
    </el-row>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="commitSetting">确 定</el-button>
      <el-button type="primary" @click="dialogShow = false">取 消</el-button>
    </span>

  </el-dialog>
</template>
<script>   
import ElementTree from '@/components/ElementTree/ElementTree'
import draggable from 'vuedraggable'
import { listToObj } from '@/util/common/common'
export default {
  name: 'FieldsSetting',
  components: { ElementTree, draggable  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
        extandShowRules: {
            label: 'name',
            id: 'field',
            parent: 'parent',
            icon: 'field',
            level: 'field'
        },


        checkedFields: [],

        allFields: [],

        pinned: 0,

        gridTag: '',
        
        dialogShow: false,
    }
  },
  computed: {
   
  },
  methods: {
    async handleOpenModal(item) {
        const { allData, checked, pinned, gridTag } = item
        const formatTree = [{ name: '全部', field: '#' }].concat(allData.map(item => {
            return Object.assign(item, { parent: '#' })
        }))
        this.allFields = formatTree
        this.dialogShow = true
        await this.$nextTick()

        const $tree = this.$refs['fieldstree']
        await $tree.waitForInit
        const formatChecked = checked.map(item => item.field)
        $tree.checkCurrentKeys(formatChecked)
        this.pinned = JSON.parse(JSON.stringify(pinned))
        this.gridTag = gridTag
        this.checkedFields = checked
    },

    handleNodeChecked(data, node) {
      const { checkedNodes } = node

      if(!checkedNodes.length) {
        this.checkedFields = []
        return
      }

      this.checkedFields = checkedNodes.filter(item => item.field !== '#')
    },

    async commitSetting() {
      const format = this.checkedFields.map(item => item.field)
      const bindObj = listToObj(this.allFields, 'field')
      const fields = format.map(item => {
        const value = bindObj[item]
        value && delete value.parent
        return value
      })

      const parmas = { tag: this.gridTag, fields, pinned: this.pinned }
      await this.$store.dispatch('columns/setColumns', parmas)
      this.dialogShow = false
    }
  },
  beforeCreate () {

  },
  created () {

  },
  beforeMount () {

  },
  mounted () {

  },
  beforeDestroy() {

  },
}
</script>
<style lang="scss" scoped>
.setting__dialog {
  .el-col {
    height: 100%;
  }

  .setting-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: var(--default-padding);
  }

  .setting-body {
    height: calc(100% - 40px);
    overflow-y: auto;
  }

  .field-row {
    line-height: 25px;
    border: solid 1px var(--border-color-base);
    padding: 5px 10px;
    margin-bottom: 10px;
    border-radius: 4px;

    &:last-child {
      margin: 0;
    }

    &.sortable-chosen {
      box-shadow: var(--box-shadow-dark);
    }
  }
} 

</style>
