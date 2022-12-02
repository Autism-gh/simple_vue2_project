<template>
    <el-dialog 
        :title="title" 
        :visible="treeShow" 
        :width="treeWidth" 
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialogTree-modal"
        @close="handleOpen(false)">

        <ElementTree
            v-bind="$attrs"
            v-loading="modal.loading"
            :style="formatTreeStyle"
            ref="dialogTreeRef"
            @mounted="handleTreeAfterInit"
            @node-simple-click="handleClick"
            @node-check="handleChecked">
        </ElementTree>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleCommit">确 定</el-button>
            <el-button type="primary" @click="handleOpen(false)">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import ElementTree from './ElementTree.vue'
    import { deepClone } from '@/util/common/common'
    import { isString, isObject } from '@/util/common/type-check'
    export default {
        components: { ElementTree },
        model: {
            prop: 'show',
            event: 'modify'
        },
        props: {
            show: {
                type: Boolean,
                default: false
            },

            title: {
                type: String,
                default: '请选择对象'
            },

            treeWidth: {
                type: String,
                default: '400px'
            },

            treeHeight: {
                type: [String, Number],
                default: 400
            },

            /**
             * 
             * 强制必选 不然会提示
             * 
             */
            mandatory: {
                type: Boolean,
                default: false
            },

            /**
             * 返回选中值的方式
             * async 异步  走 emit &  @change
             * sync  同步  调用之后可直接获取  result = await initDialogTree(' 想选中的值的id / list ')
             */
            asyncCommit: {
                type: Boolean,
                default: false
            },

            /**
             *
             * 组件向外传值 all 代表当前节点数据全部都要 如果需要指定值 那就给对应值的 key
             * 组件向外传递数据字段控制，默认_id
             *
             */
            useKey: {
                type: [String, Array],
                default: function() {
                    return 'id'
                }
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


        },
        name: 'DialogTree',
        data() {
            return {
                modal: {
                    show: false,
                    loading: false,
                    nodeOptions: null,
                    treeData: []
                },

                dialogTree: {
                    handleNode: null,

                    heightLight: ''
                },

                waitForInit: null,

                promiseResolve: null,

                resultResolve: null
            };
        },
        watch: {

        },
        computed: {
            treeShow: {
                get() {
                    return this.asyncCommit ? this.show: this.modal.show
                },
                set(val) {
                    if(this.asyncCommit) {
                        this.$emit('modify', val)
                    } else {
                        this.modal.show = val
                    }
                }
            },

            checkMode() {
                return this.$attrs['check-mode'] || this.$attrs['checkMode'] || 'checkbox'
            },

            haveCheckBox() {
                return this.checkMode !== 'nocheck'
            },

            formatTreeStyle() {
                const height = isString(this.treeHeight) ? this.treeHeight : `${ this.treeHeight }px`
                return `height: ${ height }`
            }
        },
        methods: {
            async handleTreeAfterInit($tree, { treeList, nodeOptions }) {
                if (!treeList || !treeList.length) {
                    this.modal.loading = false
                    return
                }
                this.modal.nodeOptions = deepClone(nodeOptions)
                this.modal.treeData = deepClone(treeList)
                this.modal.loading = false
                this.promiseResolve({ state: true, message: 'OK' })
            },

            async initDialogTreeData(parmasId = null) {
                this.modal.loading = true

                this.reSetPromiseInit()
                this.handleOpen(true)
                await this.$nextTick()

                // 等待树全部加载完毕
                const $tree = this.$refs['dialogTreeRef']
                await $tree.waitForInit

                // 清空选中和高亮
                $tree.clearChecked()
                $tree.clearCurrent()

                await this.$nextTick()
                const { nodeOptions, treeData } = this.modal
                const { id: ruleId } = nodeOptions
                let heightLightId = parmasId

                if(parmasId) {
                    // 选中框模式
                    if(this.haveCheckBox) {
                        let needChecked = Array.isArray(parmasId) ? parmasId : [parmasId]
                        this.dialogTree.handleNode = treeData.filter(item => needChecked.includes(item[ruleId]))
                        heightLightId = needChecked[0]
                        $tree.checkCurrentKeys(needChecked)
                    } else {
                        this.dialogTree.handleNode = treeData.find(item => item[ruleId] === parmasId)
                    }
                }

                if(heightLightId) {
                    await $tree.scrollToRightView(heightLightId)
                }

                this.modal.loading = false
                await this.$nextTick()
                if (!this.asyncCommit) {
                    return new Promise((resolve) => {
                        this.resultResolve = resolve
                    })
                }
            },


            /**
             * 外界手动获取目前选中 / 点击的单选的数据
             */
            getCommitSelect() {
                let result
                const { nodeOptions } = this.modal
                const { handleNode } = this.dialogTree
                const { id: ruleId } = nodeOptions
                
                if (Array.isArray(handleNode)) {
                    const keyList = handleNode.map(item => item[ruleId])
                    result = {
                        state: true,
                        isEmpty: !handleNode.length,
                        keyList: keyList,
                        nodeList: handleNode
                    }
                } else {
                    result = {
                        state: true,
                        isEmpty: JSON.stringify(handleNode) === '{}',
                        key: handleNode[ruleId],
                        node: handleNode
                    }
                }
                return result
            },


            async handleCommit() {
                const result = this.getCommitSelect()
                const { isEmpty } = result

                if(this.mandatory && isEmpty) {
                    this.$warning('必须选择一项！')
                    return
                }

                if (this.asyncCommit) {
                    this.$emit('change', result)
                } else {
                    if (this.resultResolve) {
                        this.resultResolve(result)
                    }
                    this.handleOpen(false)
                }
            },


            handleClick(data) {
                // 不是选中模式的点击事件不作为
                if (this.haveCheckBox) return
                this.dialogTree.handleNode = data
            },


            handleChecked(data, node) {
                if (this.checkMode === 'radio') {
                    this.dialogTree.handleNode = node.checkedNodes
                } else {
                    this.dialogTree.handleNode = this.handleCanSelectList(node.checkedNodes)
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


            reSetPromiseInit(type = true) {
                try {
                    this.modal.loading = true
                    if (this.waitForInit) {
                        this.promiseResolve({ state: false, message: 'open again' })
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

            handleOpen(state) {
                // // 为空不得关闭，这个好像有点过分暂时不用
                // const result = this.getCommitSelect()
                // const { isEmpty } = result
                // if(this.mandatory && isEmpty) {
                //     this.$warning('必须选择一项！')
                //     return
                // }

                this.treeShow = state
                if(this.resultResolve) {
                    this.resultResolve({ state: false, message: 'Dialog Closed' })
                }
            }
        },
        created() {
            if(this.asyncCommit) {
                this.reSetPromiseInit()
            }
        },
        mounted() {

        },

        beforeDestroy () {
            this.reSetPromiseInit(false)
        }
    };
</script>
<style lang="scss" scoped>

</style>