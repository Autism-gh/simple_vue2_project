<template>
    <div class="tree-container" v-loading="tree.loading">

        <div class="header-wrapper" v-click-outside="() => query.show = false">
            <div class="query-header">
                <div class="header-input">
                    <el-input 
                        @focus="handleChangeSelectView" 
                        clearable v-model="query.value" 
                        placeholder="请输入内容" 
                        @clear="query.filterList = [], query.active = ''">
                    </el-input>
                </div>
                <div class="header-icon"  @click="handlReflashTreeData">
                    <i class="el-icon-refresh-right" ></i>
                </div>
                <slot name="inputBtn"></slot>
            </div>
            <ul v-show="query.show" :class="['query-content', { 'show-filter-icon' : filterIcon }]" v-loading="query.loading">
                <li v-show="!query.filterList.length" class="no-data">暂无数据</li>
                <li v-for="item in query.filterList" :key="item[nodeOptions.id]" @click="sendSelectNode(item)"
                    :class="{'active': item[nodeOptions.id] === query.active }">
                    <i :class="['tree-icon', item[nodeOptions.icon]]"></i>
                    {{ item[nodeOptions.label] }}
                </li>
            </ul>
        </div>

        <slot name="treeHeader" />

        <div class="content-wrapper" ref="treeWrap">
            <ElTree
                ref="tree"
                :class="[
                'customtree',
                `customtree--${ treeSign }`,
                `customtree--${ checkMode }`,
                treeLine ? 'customtree--line' : '']"
                :indent="treeLine ? 0 : 22"
                v-bind="treeAttrs"
                :data="tree.dataObject"
                :show-checkbox="hasCheckBox"
                :check-strictly="formatCheckStrictly"
                :render-content="renderContent"
                :node-key="nodeOptions.id"
                v-on="$listeners"
                @check="handleNodeCheck"
                @node-click="handleNodeClick"
                @check-change="handleCheckChange"
            >

                <div :class="['elementTree-tree-row', { expanded: node.expanded }]" slot-scope="{ node, data }">
                    <i v-if="treeIcon" :class="['tree-icon', data[nodeOptions.icon]]" />
                    <!-- 
                        树后面带点东西
                     -->
                    <div v-if="checkHave" class="elementTree-tree-node">
                        <div class="element-tree-node__label"
                            @mouseover="handleHoveMenuEvent(data, $event)"
                            @mouseout="hoverMenu.options.show = false">

                            {{ data[nodeOptions.label] }}
                        </div>
                        <slot :data="data" name="treeCustom" />
                    </div>
                    <!-- 
                        整个树节点根据你想要得重新来
                     -->
                    <div v-else class="elementTree-tree-node custom">
                        <slot :data="data" name="treeNode" />
                    </div>
                </div>
            </ElTree>
        </div>

        <div
            ref="hovermenu"
            class="hovermernu-wrapper"
            :style="formatHoverStyle"
            size="mini">
            <slot :data="hoverMenu.node" name="hoverMenu" />
        </div>

    </div>
</template>

<script>
    import ElTree from './ElTree/tree.vue'
    import * as TreeUtil from './util/treeUtil'
    import { timeSleep } from '@/util/common/common'
    import { mapActions } from 'vuex'
    import PinyinMatch from 'pinyin-match'
    import _ from 'lodash'
    export default {
        components: { ElTree },
        props: {
            defaultChecked: {
                type: Array,
                default: () => []
            },

            defaultSelect: {
                type: String,
                default: ''
            },

            defaultCheckAll: {
                type: Boolean,
                default: false
            },

            // 筛选结果图标是否显示
            filterIcon: {
                type: Boolean,
                default: true
            },

            /**
             * 
             * 可以根据这个东西 直接切换想要的树，这个数据是存到 vuex 里面的
             * 省的每次都调用接口这么麻烦
             * 
             */
            treeSign: {
                type: String,
                default: ''
            },

            placeholder: {
                type: String,
                default: '请输入关键字查询'
            },

            /**
             * 
             * 选中模式
             * radio  checkbox  nocheck
             * 
             */
            checkMode: {
                type: String,
                default: 'checkbox'
            },

            /**
             * 
             * 树的图标是否显示
             * 
             */
            treeIcon: {
                type: Boolean,
                default: true
            },

            /**
             * 
             *  树的导航线
             * 
             */
            treeLine: {
                type: Boolean,
                default: false
            },

            userHover: {
                type: Boolean,
                default: true
            },

            /**
             * 
             * 自定义节点渲染函数 会覆盖掉slot的内容
             * 注意 渲染函数不会 添加 data-v-xxxxx 不会受到scoped样式影响 需要添加全局样式
             * 
             * 
             */
            renderContent: {
                type: Function,
                default: null
            },

            /**
             * 
             * 父子节点不关联
             * 
             */
            checkStrictly: {
                type: Boolean,
                default: false
            },
            
            /**
             *
             *  节点显示规则
             *  type 为该层级的唯一标识
             *  rule hidden(该节点不显示) / showCheckbox(看不见选中框)
             *  {
             *    brand: {
             *      showCheckbox: false,    显示选中框
             *      showNode: false,        显示节点
             *    },
             *    model: {
             *      showCheckbox: false
             *      showNode: false
             *    },
             *  }
             */
            nodeShowRules: {
                type: Object,
                default: function() {
                    return {}
                }
            },
            

            treeData: {
                type: Array,
                default: () => null
            },


            /**
             * 
             * element 原生没有双击节点事件，所以采用延迟的形式模拟了一个
             * 不知道后续会不会推出
             * 
             */
            useDBClick: {
                type: Boolean,
                default: false
            },

            
            /**
             * 
             * 不同的树 id name 什么的都是不一样的
             * 外界对 node 的基本配置
             * 
             */
            extandShowRules: {
                type: Object,
                default: () => null
            },

            /**
             * 
             * 点击展开节点规则
             * 有哪些特别的节点是可以通过点击展开的
             * 
             */
            idCanExpandByClick: {
                type: Array,
                default: () => []
            },

            /**
             * 
             * 触碰显示详情
             * 
             */
            treeNodeHover: {
                type: [Boolean, Array],
                default: false
            },

            /**
             * 是否从API 获取数据    false ==  form vuex
             */
            fromServer: {
                type: Boolean,
                default: true
            }
            
        },
        name: 'ElementTree',
        data() {
            return {
                query: {
                    show: false,
                    value: '',
                    active: '',
                    loading: false,
                    filterList: []
                },

                tree: {
                    loading: false,
                    dataSource: [],
                    dataArray: [],
                    dataObject: {},
                },

                dblickEvent: null,

                waitForInit: null,

                promiseResolve: null,

                nodeOptionRules: JSON.parse(JSON.stringify(TreeUtil.treeNodeOptions)),

                hoverMenu: {
                    node: {},
                    options: {
                        show: false,
                        left: 0,
                        top: 0,
                        clientX: 0,
                        clientY: 0,
                        clientHeight: 0
                    },
                    offSet: {
                        marLeft: 20,
                        marTop: -30,
                        halfHeight: 12, // treenode.height / 2
                        menuHeight: 100
                    },
                    beforeY: 0,
                    isFromUp: true
                }

            };
        },

        computed: {
            $treeInstance() {
                return this.$refs['tree']
            },

            checkHave() {
                return !this.$scopedSlots.treeNode
            },

            /**
             * 
             * 不同的树有不同的key节点，但是为了组件方便传值的key最好统一
             * 
             */
            nodeOptions() {
                if (this.extandShowRules) {
                    return this.extandShowRules
                } else {
                    return this.treeSign ?  (this.nodeOptionRules[this.treeSign] || this.nodeOptionRules.default) : this.nodeOptionRules.default
                }
            },

            /**
             * 
             * 是否有选中框
             * 
             */
            hasCheckBox() {
                return this.checkMode !== 'nocheck'
            },

            /**
             * 
             * 父子关联
             * 
             */
            formatCheckStrictly() {
                return this.checkMode === 'radio' ? true : this.checkStrictly
            },


            treeAttrs() {
                return Object.assign({
                    // 高亮显示
                    'highlight-current': true,  
                    // 关闭哪点击节点收缩功能改成配置的
                    'expand-on-click-node': false, 
                    // 点击节点选中 checkbox 只在  (有选中框的情况下才会开启)
                    'check-on-click-node': this.hasCheckBox
                }, this.$attrs)
            },

            formatHoverStyle() {
                const { show, left, top, clientX, clientY, clientHeight } = this.hoverMenu.options
                // marTop
                const { marLeft, halfHeight, menuHeight } = this.hoverMenu.offSet
                const onLeft = clientX - left
                const onTop = clientY - top

                // 顶部的高度加上触碰内容的的高度
                const isBottomed = (onTop + menuHeight) > clientHeight
                /**
                 *
                 * 为了防止视角遮挡做了固定位置偏移，效果还行
                 *
                 */
                const extand = this.hoverMenu.isFromUp ? isBottomed ? 40 : 36 : isBottomed ? (30 + halfHeight * 2) : halfHeight

                if (isBottomed) {
                    return `display: ${show ? 'block' : 'none'}; left: ${onLeft + marLeft}px; bottom: ${clientHeight - onTop + extand}px`
                } else {
                    return `display: ${show ? 'block' : 'none'}; left: ${onLeft + marLeft}px; top: ${onTop + extand}px`
                    // return `display: ${show ? 'block' : 'none'}; left: ${onLeft + marLeft}px; top: ${onTop - marTop + extand}px`
                }
            }
        },

        watch: {    
            treeData: {
                handler: function(value) {
                    if(!value || !value.length) {
                        this.tree.dataSource = []
                        this.tree.loading = false
                        return
                    }
                    // 重置验证装置
                    this.reSetPromiseInit()
                    this.tree.dataSource = JSON.parse(JSON.stringify(value))
                },
                immediate: true
            },

            'tree.dataSource': {
                handler: async function(value) {
                    if (!value || !value.length) {
                        this.tree.dataObject = []
                        this.tree.loading = false
                        return
                    }

                    const { dataObject, dataArray } = TreeUtil.listToTree(value, this.nodeOptions, this.nodeShowRules)
                    this.tree.dataArray = [...dataArray]
                    this.tree.dataObject = dataObject
                    await this.$nextTick()
                    this.handleOverInit(value)
                },
                immediate: true
            },

            'query.value': function(value) {
                this.getFilterNodeList(value)
            },

            checkMode() {
                this.clearChecked()
            }
        },

        methods: {
            ...mapActions('tree', {
                GetTreeDataArrayBySign: 'getTreeData'
            }),

            reSetPromiseInit(type = true) {
                try {
                    if (this.waitForInit) {
                        this.promiseResolve({ state: false, message: 'data refresh' })
                        this.waitForInit = null
                        this.promiseResolve = null
                    }
                    if (!type) {
                        this.tree.loading = false
                        return
                    }
                    
                    this.tree.loading = true
                    this.waitForInit = new Promise((resolve) => {
                        this.promiseResolve = resolve
                    })
                } catch (error) {
                    this.tree.loading = false
                    console.log('error', error)
                }
            },

            /**
             *
             *  拒绝监听vuex数据，这里添加是否从 API获取数据，与 ztreeData 呼应上
             *
             */
            async initTreeData(type = this.treeSign, fromApi = this.fromServer) {
                if (!type) {
                    this.tree.loading = false
                    return
                }
                this.tree.loading = true
                /**
                 *  根绝type 去 vuex 中拿到想要的数据
                 */
                const treeData = await this.GetTreeDataArrayBySign({ type, fromServer: fromApi })
                
                if(treeData) this.tree.dataSource = JSON.parse(JSON.stringify(treeData))
                
                await this.$nextTick()
                this.handleOverInit()
                this.tree.loading = false
            },


            async handleOverInit(list = null) {
                if(!list || !list?.length) {
                    this.tree.loading = false
                    return
                }
                this.handleInitCustom()
                // 双验证
                const { dataArray, dataObject } = this.tree

                const firstNode = dataArray?.[0]

                // 默认展开第一个节点
                if(firstNode) {
                    const activeNode = this.$treeInstance?.getNode(firstNode)
                    if(activeNode) activeNode.expand(null, true)
                }

                this.$emit('mounted', this.$treeInstance, {
                    treeList: list || dataArray,
                    treeData: dataObject,
                    firstNode: firstNode,
                    nodeOptions: this.nodeOptions
                })
                this.promiseResolve({ state: true, message: 'OK' })
                await this.$nextTick()
                // await timeSleep(2000)
                this.tree.loading = false
            },
            
            
            handleInitCustom() {
                // 默认高亮
                if (this.defaultSelect) {
                    this.expandByNodeId(this.defaultSelect)
                    this.$treeInstance.setCurrentKey(this.defaultSelect)
                }

                if (this.defaultChecked.length) {
                    if (this.checkMode === 'checkbox') {
                        this.$treeInstance.setCheckedKeys(this.defaultChecked)
                    }

                    if (this.checkMode === 'radio') {
                        const checkId = this.defaultChecked[0]
                        this.$treeInstance.setChecked(checkId, true, false)
                        this.scrollToRightView(checkId)
                    }
                }

                if(this.defaultCheckAll) {
                    // const { id } = this.nodeOptions
                    // const keysList = this.tree.dataArray.map(item => item[id])
                    // $tree.setCheckedKeys(keysList)
                    // 两者皆可
                    this.$treeInstance.setCheckedNodes(this.tree.dataArray)
                }
            },




            /**
             * 
             * 常用的方法
             * 
             */
            clearChecked() {
                this.$treeInstance && this.$treeInstance.setCheckedKeys([]);
            },  

            clearCurrent() {
                this.$treeInstance && this.$treeInstance.setCurrentKey(null);
            },

            /**
             * 
             * @param {node  / keys} node 
             * @param {节点是否选中} type 
             * @param {是否设置子节点} deep 
             */
            changeNodeCheckState(parmas, type = true, deep = false, async = false) {
                this.$treeInstance.setChecked(parmas, type, deep);
                if(async) {
                    this.handleNodeCheck({}, this.getTreeCurrentState())
                }
            },
            
            checkCurrentNodes(node, async = false) {
                if(!node) return
                this.$treeInstance.setCheckedNodes(node)
                if(async) {
                    this.handleNodeCheck({}, this.getTreeCurrentState())
                }
            },
            
            /**
             * 会清空现有的选择继而选择 当前
             * @param {*} keys 
             * @param {*} leafOnly 
             * @param {*} async 
             */
            checkCurrentKeys(keys, leafOnly = false, async = false) {
                if(!keys || !keys.length) return
                this.$treeInstance.setCheckedKeys(keys, leafOnly)
                if(async) {
                    this.handleNodeCheck({}, this.getTreeCurrentState())
                }
            },

            getNode(key) {
                return this.$treeInstance.getNode(key)
            },

            setCurrentKey(key) {
                this.$treeInstance && this.$treeInstance.setCurrentKey(key)
            },


            /**
             * 展开指定元素
             */
            expandByNode(node) {
                if (!node) return
                if (node?.parent) {
                    this.expandByNode(node.parent)
                }
                if (!node.expanded) {
                    node.expand()
                }
            },

            /**
             * 根据ID 展开
             */
            expandByNodeId(nodeId) {
                if (!nodeId) return
                const node = this.$treeInstance.getNode(nodeId)
                this.expandByNode(node)
            },

            expandAllNode(type) {
                var nodes = this.$refs.tree.store.nodesMap;
                for (var i in nodes) {
                    nodes[i].expanded = type;
                }
            },




            /**
             * 
             * 
             * 
             * 选中点击事件
             * 
             * 
             * 
             * 
             * 
             */
            handleCheckChange(data, checked) {
                // console.log('checked', checked, data)
                if (this.checkMode === 'radio' && checked) {
                    this.$refs.tree.setCheckedNodes([data])
                }
            },

            async handleNodeCheck(data, node) {
                this.$emit('node-check', data, node)
            },

            handleNodeClick(data, node) {
                if (this.useDBClick) {
                    if (this.dblickEvent) {
                        clearTimeout(this.dblickEvent)
                        this.dblickEvent = undefined
                        this.$emit('node-double-click', data, node)
                    } else {
                        this.dblickEvent = setTimeout(() => {
                            this.$emit('node-simple-click', data, node)
                            this.dblickEvent = undefined
                        }, 300)
                    }
                } else {
                    if(this.idCanExpandByClick.length) {
                        const levelValue = data[this.nodeOptions.level]
                        if (levelValue && this.idCanExpandByClick.includes(levelValue)) {
                            if (node.expanded) {
                                node.collapse()
                            } else {
                                node.expand()
                            }
                        }
                    }
                }
            },


            getCurrentInfo(type) {
                const queryNode = this.$treeInstance.getNode(this.query.value)

                switch (type) {
                    case 'current':
                        return queryNode.data
                    case 'checkedNodes':
                        return this.$treeInstance.getCheckedNodes()
                    case 'checkedKeys':
                        return this.$treeInstance.getCheckedKeys()
                    case 'halfCheckedNodes':
                        return this.$treeInstance.getHalfCheckedNodes()
                    case 'halfCheckedKeys':
                        return this.$treeInstance.getHalfCheckedKeys()
                    default:
                        return Object.assign({
                            queryNode: queryNode.data,
                            selectNode: this.$treeInstance.getCurrentNode()
                        }, this.getTreeCurrentState())
                }
            },

            getTreeCurrentState() {
                return {
                    checkedNodes: this.$treeInstance.getCheckedNodes(),
                    checkedKeys: this.$treeInstance.getCheckedKeys(),
                    halfCheckedNodes: this.$treeInstance.getHalfCheckedNodes(),
                    halfCheckedKeys: this.$treeInstance.getHalfCheckedKeys()
                }
            },

            
            /**
             *  业务尚未贯彻，暂且不知道目前筛选方式的差异，后续改进可以添加新的选择框根据指定类型来查询
             *  筛选方法，后面肯定要升级先暂时用文字节点代替
             */
            getFilterNodeList(query) {
                if (query !== '') {
                    setTimeout(() => {
                        this.query.filterList = this.tree.dataArray.filter(item => PinyinMatch.match(item[this.nodeOptions.label], query))

                        console.log('this.query.filterList', this.query.filterList)
                    }, 500)
                } else {
                    this.query.filterList = []
                }
            },

            async handleChangeSelectView() {  
                this.query.show = true
                await this.$nextTick()
                const { active } = this.query
                const node = this.$treeInstance.getNode(active)
                this.$treeInstance.setCurrentKey(active)
                node && node.expand(null, true)
            },

            showSelectNode(type) {
                if (type) {
                    const node = this.query.filterList.find(item => item[this.nodeOptions.id] === this.query.value)
                    if (node) {
                        this.$treeInstance.setCurrentNode(node)
                    }
                }
            },

            async sendSelectNode(row) {
                const active = row[this.nodeOptions.id]
                this.query.active = active
                this.query.show = false

                const node = this.$treeInstance.getNode(active)

                node && node.expand(null, true)
                this.setCurrentKey(active)

                if (this.hasCheckBox) {
                    const { showCheckbox } = node.data
                    if(showCheckbox) {
                        if(this.checkMode === 'radio') {
                            this.$refs.tree.setCheckedNodes([node.data])
                        } else {
                            node.setChecked(true, true)
                        }
                        this.handleNodeCheck(node?.data, this.getTreeCurrentState())
                    }
                } else {
                    this.$emit('node-click', node?.data, this.getTreeCurrentState())
                }
                this.scrollToRightView()
            },

            

            scrollToRightView: _.debounce(async function(nodeId = null) {
                if (nodeId) {
                    this.$treeInstance.setCurrentKey(nodeId)
                    this.expandByNode(this.$treeInstance.store.nodesMap[nodeId])
                    await this.$nextTick()
                    /**
                     * 
                     * 因为 select 下拉得时候有个动画延时，所以需要把这个时间给算进去
                     * 不然会出现定位不准确得问题，相当蓝瘦
                     * 
                     */
                    await timeSleep(400)
                }
                const $node = this.$el.querySelector('div[role=treeitem].el-tree-node.is-current')
                if ($node) {
                    const $treeWrap = this.$refs['treeWrap']
                    const wrapRect = $treeWrap.getBoundingClientRect()
                    const nodeRect = $node.getBoundingClientRect()
                    const { top } = wrapRect
                    $treeWrap.scrollTo({ top: (nodeRect.top + $treeWrap.scrollTop) - top })
                }
            }, 1000),


            async handlReflashTreeData(fromServer = true) {
                if (this.treeData) {
                    this.$emit('refresh')
                    return
                }
                this.tree.loading = true
                if (this.treeSign) {
                    await this.initTreeData(this.treeSign, fromServer)
                }
                await this.$nextTick()
                this.tree.loading = false
            },


            handleHoveMenuEvent(data, event) {
                if (!this.userHover) return
                const content = this.$refs['treeWrap']
                if (!content) return
                this.hoverMenu.node = JSON.parse(JSON.stringify(data))

                const { clientX, clientY } = event
                const { beforeY } = this.hoverMenu

                // 从头上来， 从上面来和从下面来显示的位置是不一样的哦
                this.hoverMenu.isFromUp = beforeY && beforeY < clientY
                this.hoverMenu.beforeY = JSON.parse(JSON.stringify(clientY))

                const bounds = content.getBoundingClientRect()
                Object.assign(this.hoverMenu.options, {
                    show: true,
                    clientX: clientX,
                    clientY: clientY,
                    left: bounds.left,
                    top: bounds.top - 30,
                    clientHeight: content.clientHeight
                })

                const node = this.getNode(data[this.nodeOptions.id])
                this.$emit('hovermenu', data, node)

            }
        },
        created() {

        },
        async mounted() {
            if (!this.treeData) {
                this.reSetPromiseInit()

                await this.initTreeData()

                this.$watch(() => {
                    return this.$store.getters.treeData[this.treeSign]
                }, (val) => {
                    if(!val) return
                    const { data } = val
                    if(!data || !data.length) {
                        this.tree.dataSource = []
                        return
                    }
                    this.tree.dataSource = JSON.parse(JSON.stringify(data))
                })
            }
        },
    };
</script>
<style lang="scss">
@import './scss/ElementTree.scss';
.header-wrapper {
    .query-header {
        .el-input__inner {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
    }
}
</style>

<style lang="scss" scoped>
.tree-container {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding:  var(--default-padding);
    
    .header-wrapper {
        position: relative;
        margin-bottom: var(--default-padding);

        .query-header {
            height: 100%;
            display: flex;
            flex-direction: row;
        }

        .query-content {
            position: absolute;
            width: 100%;
            z-index: 100;
            left: 0;
            top: 30px;
            padding: 8px 0;
            background-color: var(--color-white);
            border: solid 1px var(--border-color-base);
            max-height: 200px;
            overflow: auto;

            li {
                display: flex;
                align-items: center;
                line-height: 30px;
                padding: 0 10px;
                cursor: pointer;

                &.active {
                    color: var(--color-primary);
                    font-weight: bold;
                }

                &:hover {
                    background-color: var(--background-color-base);
                }

                &.no-data {
                    text-align: center;
                }
            }

            .tree-icon {
                display: none;
            }

            &.show-filter-icon {
                .tree-icon {
                    display: inline-block;
                }
            }
        }

        .header-input {
            height: 100%;
            position: relative;
            flex-grow: 1;
        }

        /deep/ .header-icon {
            cursor: pointer;
            padding: 0 6px 0 8px;
            display: flex;
            align-items: center;
            border: solid 1px var(--border-color-base);
            border-left: 0;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;

            i {
                font-size: 16px;
            }
        }
    }   
    
    .content-wrapper {
        flex-grow: 1;
        overflow: auto;
    }

    .elementTree-tree-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        flex-grow: 1;
        max-width: calc(100% - 25px);

        .tree-icon {
            font-size: 16px;
            margin-right: 5px;
            color: var(--color-primary);
        }
    }

    .hovermernu-wrapper {
        z-index: 10;
        position: absolute;
        z-index: 10000;
        background-color: var(--color-white);
        box-shadow: var(--box-shadow-base);
        border-radius: 4px;
        min-width: 150px;
        max-width: 250px;
        width: max-content;
        transition-delay: 0.5s;
        transition: all 0.5s;
    }
}
</style>