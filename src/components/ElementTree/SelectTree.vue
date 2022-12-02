<template>
    <el-select ref="select" 
        :clearable="clearable"
        :disabled="disable" 
        :value="formatSelectValue" 
        :popper-append-to-body="false"
        :placeholder="placeholder" 
        popper-class="tree-select-container" 
        @visible-change="handleScroll"
        @clear="handleClearSelect">

        <!-- 演员 -->
        <el-option :style="formatTreeStyle" value="">&nbsp;</el-option>

        <div class="selectTree">
            <div class="selectTree__main">
                <ElementTree ref="selectTreeRef" 
                    v-bind="$attrs" 
                    @refresh="handleEmitReflash"
                    @mounted="handleTreeAfterInit"
                    @node-simple-click="handleClick" 
                    @node-check="handleChecked" />
            </div>
            <div v-if="!asyncCommit" class="selectTree__fotter">
                <span class="font--12 text--brand">
                    <span v-if="haveCheckBox">
                        {{ foramtSelectNumber }} / {{ select.rootNumber }}
                    </span>
                </span>
                <span>
                    <el-button class="text--secondary" type="text" @click="cancleSelect">取消</el-button>
                    <el-button type="text" @click="commitSelect">确认</el-button>
                </span>
            </div>
        </div>

    </el-select>
</template>

<script>
    import ElementTree from './ElementTree.vue'
    import { deepClone, isEmpty } from '@/util/common/common'
    import { isString, isObject } from '@/util/common/type-check'
    export default {
        model: {
            prop: 'chooseValue',
            event: 'modify'
        },

        components: {
            ElementTree
        },
        props: {
            /**
             * 
             * 绑定的值！
             * 
             */
            chooseValue: {
                type: [Object, Array, String, Number],
                default: function() {
                    return {}
                }
            },

            /**
             * 
             * 有用的值！
             * chooseValue 传递什么出去就传递什么进来！
             * 
             */
            useKey: {
                type: [String, Array],
                default: function() {
                    return 'id'
                }
            },




            disable: {
                type: Boolean,
                default: false
            },

            placeholder: {
                type: String,
                default: '请选择对象'
            },

            selectText: {
                type: String,
                default: '个对象'
            },

            treeHeight: {
                type: [String, Number],
                default: 400
            },

            treeWidth: {
                type: String,
                default: '300px'
            },


            /**
             * 可选的节点
             *
             * {
             *    key: 'type',    那个值？
             *    value: ['first', 'second']   有哪些可能的？？？计算在里面
             * }
             * 需要节点筛选，满足key value匹配的节点将会在返回结果中过滤
             * 
             * 如上述，所有节点的 type值 为 first second 的 将不做返回
             */
            returnRules: {
                type: [String, Object],
                default: function() {
                    return {}
                }
            },


            /**
             * 返回选中值的方式
             * asyncCommit 异步提交 ？ false emit 修改数据  true 同步提交
             * async 异步  走 emit &  @change
             * sync  同步  调用之后可直接获取  result = await initDialogTree(' 想选中的值的id / list ')
             */
            asyncCommit: {
                type: Boolean,
                default: false
            },

            clearable: {
                type: Boolean,
                default: false
            }
        },
        name: 'SelectTree',
        data() {
            return {
                select: {
                    nodeOptions: {},
                    treeData: [],
                    rootNumber: 0
                },


                selectTree: {
                    handleNode: null,

                    // 高亮选中的数据
                    heightLightId: ''
                },


                waitForInit: null,

                promiseResolve: null
            };
        },
        watch: {
            chooseValue() {
                this.setInputValue()
            }
        },
        computed: {
            checkMode() {
                return this.$attrs['check-mode'] || this.$attrs['checkMode'] || 'checkbox'
            },

            haveCheckBox() {
                return this.checkMode !== 'nocheck'
            },

            foramtSelectNumber() {
                const { handleNode } = this.selectTree
                const { nodeOptions: { label } } = this.select
                return handleNode ? Array.isArray(handleNode) ? handleNode?.length : handleNode[label] : 0
            },

            formatTreeStyle() {
                const { treeHeight, treeWidth } = this
                const height =  `height: ${ isString(treeHeight) ? treeHeight : `${ treeHeight }px` }`
                return `${ height }; width: ${ treeWidth }; background-color: var(--color-white)`
            },


            formatSelectValue: {
                get() {
                    const { handleNode } = this.selectTree
                    const { rootNumber, nodeOptions } = this.select

                    if(this.checkMode === 'checkbox') {
                        const number = handleNode?.length || 0
                        const text = number === rootNumber  ? '全部' : ''
                        return number ? `已选择${text}${number}${this.selectText}` : ''
                    } else {
                        const formatData = Array.isArray(handleNode) ? handleNode[0] : handleNode
                        return formatData ? formatData[nodeOptions?.label] || '' : ''
                    }
                },

                set(val) {
                    this.selectTree.handleNode = val
                }
            }
        },
        methods: {
            getParmas() {
                return this.selectTree.handleNode
            },

            async handleClearSelect() {
                this.formatSelectValue = null
                await this.$nextTick()
                
                // 清空选中和高亮
                const $tree = this.$refs['selectTreeRef']
                $tree.clearChecked()
                $tree.clearCurrent()

                this.handleEmitValue()
            },

            async refresh() {
                await this.$refs['selectTreeRef'].handlReflashTreeData()
            },

            handleEmitReflash() {
                this.$emit('refresh')
            },

            /**
             * 
             * 
             * 存在一个问题。当这个组件进行首次赋值，BUT ！ 未改变，那么我就无法 做移入移出 了
             * 
             * 做一个 ID 匹配了只能
             * 
             * 外界也可以调用这个设置默认值
             * 
             */
            async setInputValue(formatData = this.chooseValue) {
                const $tree = this.$refs['selectTreeRef']

                if(isEmpty(formatData)) {
                    // 清空选中和高亮
                    $tree.clearChecked()
                    $tree.clearCurrent()
                    
                    this.selectTree.handleNode = null
                    return
                }

                const { nodeOptions, treeData } = this.select
                const { id: ruleId } = nodeOptions

                let heightLight
                // 有框的选中(包含单选多选)
                if(this.haveCheckBox) {
                    let checkedKeys
                    const formatValue = Array.isArray(formatData) ? formatData : [formatData]
                    const firstData =  formatValue[0]
                    const isTreeId = isString(firstData)

                    // 选中的idlist
                    checkedKeys = isTreeId ? formatValue : formatValue.map(item => item[ruleId])
                    this.selectTree.handleNode = treeData.filter(item => checkedKeys.includes(item[ruleId]))

                    // 只有一个选中的时候高亮它！
                    if(formatValue?.length === 1) {
                        heightLight = isTreeId ? firstData : firstData[ruleId]
                    }
                    checkedKeys?.length && $tree.checkCurrentKeys(checkedKeys)
                } else {
                    heightLight = isString(formatData) ? formatData : formatData[ruleId]
                    this.selectTree.handleNode = treeData.find(item => item[ruleId] === heightLight)
                }

                const currentNode = $tree.getNode(heightLight)
                currentNode && currentNode.expand(null, true);
                currentNode && $tree.setCurrentKey(currentNode)
            },


            async handleClick(data) {
                // 不是选中模式的点击事件不作为
                if (this.haveCheckBox) return
                this.selectTree.handleNode = data
                
                if(this.asyncCommit) {
                    this.handleEmitValue()
                    await this.$nextTick()
                    if (this.checkMode !== 'checkbox') {
                        this.cancleSelect()
                    }
                }
            },


            async handleChecked(data, node) {
                // console.log('handleChecked', data)

                if(!node) return
                if (this.checkMode === 'radio') {
                    this.selectTree.handleNode = node.checkedNodes
                } else {
                    this.selectTree.handleNode = this.handleCanSelectList(node.checkedNodes)
                }

                if(this.asyncCommit) {
                    this.handleEmitValue()
                    await this.$nextTick()

                    if (this.checkMode !== 'checkbox') {
                        this.cancleSelect()
                    }
                }
            },


            handleEmitValue(value) {
                if(!value) {
                    value = this.getCommitSelect()
                }
                this.$emit('modify', value)
            },


            cancleSelect() {
                this.$refs['select'].blur()
            },


            commitSelect() {
                const result = this.getCommitSelect()
                this.$emit('change', result)
                this.cancleSelect()
            },


            /**
             * 外界手动获取目前选中 / 点击的单选的数据
             */
            getCommitSelect() {
                const { handleNode } = this.selectTree
                let formatResult = {}

                const { nodeOptions: { id: ruleId } } = this.select

                // 需要node 中的多种数据
                const keyRules = isEmpty(this.useKey) ? ruleId : this.useKey
                const arrayType = Array.isArray(keyRules)

                if(!handleNode) return

                let formatData = deepClone(handleNode)
                if(this.checkMode === 'radio') {
                    formatData = formatData[0]
                }

                if(isEmpty(formatData)) {
                    formatResult = Array.isArray(formatData) ? [] : null
                } else {
                    if(keyRules === 'all') {
                        formatResult = formatData
                    } else {

                        // 数据多选的情况
                        if(Array.isArray(formatData)) {
                            
                            if (arrayType) {
                                formatResult = formatData.map(item => {
                                    const obj = {}
                                    keyRules.forEach(key => {
                                        obj[key] = item[key]
                                    })
                                    return obj
                                })
                            } else {
                                formatResult = formatData.map(item => item[keyRules])
                            }
                        }
                        // 数据单选选择的情况
                        else 
                        {
                            if (arrayType) {
                                const obj = {}
                                keyRules.forEach(key => {
                                    obj[key] = formatData[key]
                                })
                                formatResult = obj
                            } else {
                                formatResult = formatData[keyRules]
                            }
                        }
                    }
                }
                return formatResult
            },





            handleScroll(val) {
                if(!val) return
                const $tree = this.$refs['selectTreeRef']
                $tree.scrollToRightView()
            },


            handleTreeAfterInit($tree, { treeList, nodeOptions, firstNode, treeData }) {
                if (!treeList || !treeList.length) return
                this.select.nodeOptions = deepClone(nodeOptions)
                this.select.treeData = deepClone(treeList)

                const canList = this.handleCanSelectList(treeList)
                this.select.rootNumber = canList.length

                const checked = $tree.getCheckedNodes()
                if(checked) {
                    this.setInputValue(checked)
                }

                if(this.chooseValue) {
                    this.setInputValue(this.chooseValue)
                }
                let firstChild = firstNode[nodeOptions['id']]
                let firstData = treeData?.[0]?.[nodeOptions['id']]

                this.promiseResolve({ state: true, data: { firstChild, firstData  }, message: 'OK' })
            },

            
            reSetPromiseInit(type = true) {
                try {
                    if (this.waitForInit) {
                        this.promiseResolve({ state: false,  message: 'open again' })
                        this.waitForInit = null
                        this.promiseResolve = null
                    }
                    if (!type) return

                    this.waitForInit = new Promise((resolve) => {
                        this.promiseResolve = resolve
                    })
                } catch (error) {
                    console.log('error', error)
                }
            },

            handleCanSelectList(list) {
                let result
                if (isObject(this.returnRules) && JSON.stringify(this.returnRules) !== '{}') {
                    const { key, value } = this.returnRules
                    result = list.filter(item => item[key] !== undefined && value.includes(item[key]))
                } else {
                    result = list
                }
                return result
            },

        },
        created() {
            this.reSetPromiseInit()
        },
        mounted() {
            
        },  

        activated () {
            
        },

        beforeDestroy() {
            this.reSetPromiseInit(false)
        }
    };
</script>
<style lang="scss">
    .tree-select-container {
        height: max-content;

        .el-scrollbar {
            height: 100%;
        }

        .el-scrollbar__bar {
            display: none;
        }

        .el-select-dropdown__wrap {
            width: 100%;
            height: 100%;
            overflow: hidden;
            max-height: inherit;
        }

        .el-select-dropdown__item {
            padding: 0 8px 5px 0px;
        }

        .el-select-dropdown__list {
            padding: 0;
        }
    }

    .selectTree-tooltip {

        &.el-tooltip__popper[x-placement^=top],
        &.el-popper[x-placement^=top] {
            margin-bottom: 6px;
        }
    }
</style>
<style lang="scss" scoped>
    .selectTree {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 100;

        &__main {
            flex-grow: 1;
            height: calc(100% - 36px);
            width: 100%;
        }

        &__fotter {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 36px;
            padding: 0 10px;
            border-top: solid 1px var(--border-color-base);
        }
    }
</style>