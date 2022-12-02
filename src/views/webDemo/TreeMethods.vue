<template>
    <div class="treemethods-container">
        <div class="left-wrapper">
            <ElementTree ref="treeInstance" :tree-sign="treeSign" :tree-icon="treeIcon" :tree-line="treeLine"
                :check-mode="checkMode" :use-d-b-click="useDBClick" :user-hover="treeNodeHover"
                :tree-data="vehicleModel" :extand-show-rules="extandShowRules" @node-check="handleNodeCheck"
                @node-click="handleNodeClick" @node-double-click="handleNodeDBClick"
                @node-simple-click="handleNodeSimpleClick">
                <template slot="hoverMenu" slot-scope="{ data }">
                    <div class="hoverMenu">
                        <div class="hoverMenu__header">
                            [车型]
                        </div>
                        <div class="hoverMenu__content">
                            {{ data.name }}
                        </div>
                    </div>
                </template>

            </ElementTree>
        </div>
        <div class="right-wrapper">
            <div class="setting-item">
                <div class="title">选中模式</div>
                <div class="control">
                    <el-radio-group v-model="checkMode">
                        <el-radio label="checkbox">多选</el-radio>
                        <el-radio label="radio">单选</el-radio>
                        <el-radio label="nocheck">无</el-radio>
                    </el-radio-group>
                </div>
            </div>

            <div class="setting-item">
                <div class="title">显示图标</div>
                <div class="control">
                    <el-switch v-model="treeIcon" />
                </div>
            </div>

            <div class="setting-item">
                <div class="title">显示引导线</div>
                <div class="control">
                    <el-switch v-model="treeLine" />
                </div>
            </div>

            <div class="setting-item">
                <div class="title">开启触碰详情</div>
                <div class="control">
                    <el-switch v-model="treeNodeHover" />
                </div>
            </div>

            <div class="setting-item">
                <div class="title">开启双击模拟事件</div>
                <div class="control">
                    <el-switch v-model="useDBClick" />
                </div>
            </div>

            <div class="setting-item">
                <el-button type="primary" @click="checkTreeNodeByNodeID">根据【nodeId】选中本田</el-button>
                <el-button type="primary" @click="checkTreeNodeByNode">根据【node】选中本田</el-button>
                <el-button type="primary" @click="clearTreeChecked">清空所有选中</el-button>
            </div>

            <div class="setting-item">
                <el-button type="primary" @click="setHeightLight">设置思域高亮</el-button>
                <el-button type="primary" @click="clearHeightLight">清空高亮</el-button>
                <el-button type="primary" @click="scrollToRightView('tang')">滚动到比亚迪唐</el-button>
                <el-button type="primary" @click="scrollToRightView('siyu')">滚动到思域</el-button>
            </div>

            <div class="setting-item">
                <el-button type="primary" @click="expandCurrentNode">展开本田</el-button>
                <el-button type="primary" @click="expandAllNode(true)">展开全部</el-button>
                <el-button type="primary" @click="expandAllNode(false)">收起全部</el-button>
            </div>

            <div class="setting-item">
                <span v-show="!useDBClick" class="card">普通点击事件： {{ nodeClickEventNum }}</span>
                <span v-show="useDBClick" class="card">[双击模式] 点击事件： {{ clickEventNum }}</span>
                <span v-show="useDBClick" class="card">[双击模式] 双击事件 {{ dbClickEventNum }}</span>
                <span class="card">选中事件： {{ checkEventNum }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import ElementTree from '@/components/ElementTree/ElementTree'
    import {
        vehicleModel
    } from '@/components/ElementTree/util/treeMockData'
    export default {
        name: 'TreeMethods',
        components: {
            ElementTree
        },
        props: {},
        data() {
            return {
                treeSign: 'vehicleModel',

                vehicleModel: [...vehicleModel],

                extandShowRules: {
                    label: 'name',
                    id: 'id',
                    parent: 'parent',
                    icon: 'icon',
                    level: 'level'
                },

                treeIcon: true,

                treeLine: true,

                checkMode: 'checkbox',

                treeNodeHover: false,

                useDBClick: false,

                checkEventNum: 0,

                clickEventNum: 0,

                dbClickEventNum: 0,

                nodeClickEventNum: 0
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
            checkTreeNodeByNodeID() {
                const $tree = this.$refs['treeInstance']
                $tree.checkCurrentKeys(['bentian'])
            },

            checkTreeNodeByNode() {
                const $tree = this.$refs['treeInstance']
                const node = $tree.getNode('bentian')
                $tree.checkCurrentNodes([node.data])
            },

            clearTreeChecked() {
                const $tree = this.$refs['treeInstance']
                $tree.clearChecked()
            },

            setHeightLight() {
                const $tree = this.$refs['treeInstance']
                $tree.setCurrentKey('siyu')
            },

            clearHeightLight() {
                const $tree = this.$refs['treeInstance']
                $tree.clearCurrent()
            },

            scrollToRightView(type) {
                const $tree = this.$refs['treeInstance']
                $tree.scrollToRightView(type)
            },

            expandCurrentNode() {
                const $tree = this.$refs['treeInstance']
                $tree.expandByNodeId('bentian')
            },

            expandAllNode(type) {
                const $tree = this.$refs['treeInstance']
                $tree.expandAllNode(type)
            },

            handleNodeCheck(data, node) {
                this.checkEventNum++
            },

            handleNodeDBClick(data, node) {
                this.dbClickEventNum++
            },

            handleNodeSimpleClick(data, node) {
                this.clickEventNum++
            },

            handleNodeClick(data, node) {
                this.nodeClickEventNum++
            }

        }
    }
</script>
<style lang="scss" scoped>
    .treemethods-container {
        width: 100%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        background: var(--background-color-base);

        .left-wrapper {
            height: 100%;
            width: 300px;
            background-color: var(--color-white);
        }

        .right-wrapper {
            height: 100%;
            width: calc(100% - 310px);
            background-color: var(--color-white);
        }

        .setting-item {
            height: 40px;
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0 10px;
            margin-bottom: 10px;

            .card {
                margin-right: 10px;
            }

            .title {
                width: 150px;
                margin-right: 20px;
            }
        }
    }
</style>