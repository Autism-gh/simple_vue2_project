<template>
    <FlexContainer>
        <template slot="leftWrapper">
            <ElementTree treeSign="japanModel" default-expand-all></ElementTree>
        </template>
        <template slot="rightBottom">

            <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane label="用户管理" name="first">
                    <TableAutomatic :gridTag="gridTag[0]" :fieldConfig="fieldConfig[gridTag[0]]"
                        :checkedField="checkedField[gridTag[0]]" :tableData="table.first"
                        :manageColumn="manageColumn[gridTag[0]]" :preColumns="preColumns[gridTag[0]]"
                        :pagesize.sync="pagesize[gridTag[0]]" :page.sync="page[gridTag[0]]" :total="total[gridTag[0]]"
                        :pinned="pinned[gridTag[0]]" @pagination="handleChangePageView" @modify="handleModifyEvent"
                        @remove="handleRemoveEvent" @row-click="handleClickRow">

                        <template slot="filterLeft">
                            <div class="filter-item">
                                <span class="title">驾驶员名称: </span>
                                <el-input class="control" v-model="platNo" placeholder="请输入名称"></el-input>
                            </div>
                            <div class="filter-item">
                                <span class="title">手机号: </span>
                                <el-input class="control" v-model="simNo" placeholder="请输入手机号"></el-input>
                            </div>

                            <el-button type="primary">新增</el-button>
                            <el-button type="primary">导入</el-button>
                            <el-button type="primary">导出</el-button>
                        </template>

                        <template slot="filterRight">
                            <SearchPanel v-model="driverName" @search="handleGetTableData" placeholder="请输入驾驶员名称">
                            </SearchPanel>
                        </template>

                        <template slot="extand">
                            <div class="filter-item">
                                <span class="title">手机号: </span>
                                <el-input class="control" v-model="simNo" placeholder="请输入手机号"></el-input>
                            </div>
                        </template>

                        <template slot="pageLeft">
                            <el-button type="primary">删除</el-button>
                        </template>

                        <template slot="table-ComponetRow" slot-scope="{ data }">
                            <el-tag @click.stop="handleEmitExtandEvent(data)">哈哈哈</el-tag>
                        </template>

                    </TableAutomatic>
                </el-tab-pane>
                <el-tab-pane label="配置管理" name="second">
                    <TableAutomatic :gridTag="gridTag[1]" :fieldConfig="fieldConfig[gridTag[1]]"
                        :checkedField="checkedField[gridTag[1]]" :tableData="table.second"
                        :manageColumn="manageColumn[gridTag[1]]" :preColumns="preColumns[gridTag[1]]"
                        :pagesize.sync="pagesize[gridTag[1]]" :page.sync="page[gridTag[1]]" :total="total[gridTag[1]]"
                        :pinned="pinned[gridTag[1]]" @pagination="handleChangePageView" @modify="handleModifyEvent"
                        @remove="handleRemoveEvent" @row-click="handleClickRow">

                        <template slot="filterLeft">
                            <div class="filter-item">
                                <span class="title">驾驶员名称: </span>
                                <el-input class="control" v-model="platNo" placeholder="请输入名称"></el-input>
                            </div>
                            <div class="filter-item">
                                <span class="title">手机号: </span>
                                <el-input class="control" v-model="simNo" placeholder="请输入手机号"></el-input>
                            </div>

                            <el-button type="primary">新增</el-button>
                            <el-button type="primary">导入</el-button>
                            <el-button type="primary">导出</el-button>
                        </template>

                        <template slot="filterRight">
                            <SearchPanel v-model="driverName" @search="handleGetTableData" placeholder="请输入驾驶员名称">
                            </SearchPanel>
                        </template>

                        <template slot="extand">
                            <div class="filter-item">
                                <span class="title">手机号: </span>
                                <el-input class="control" v-model="simNo" placeholder="请输入手机号"></el-input>
                            </div>
                        </template>

                        <template slot="pageLeft">
                            <el-button type="primary">删除</el-button>
                        </template>

                        <template slot="table-ComponetRow" slot-scope="{ data }">
                            <el-tag @click.stop="handleEmitExtandEvent(data)">哈哈哈</el-tag>
                        </template>

                    </TableAutomatic>
                </el-tab-pane>
            </el-tabs>

        </template>
    </FlexContainer>
</template>

<script>
    import {
        ElementTree
    } from '@/components/ElementTree'
    import FlexContainer from '@/components/Layout/FlexContainer'
    import {
        TableAutomatic,
        SearchPanel,
        doubletable
    } from '@/components/ElementTable'
    import {
        tableOptions,
        defaultData
    } from './components/fieldConfig'
    export default {
        components: {
            FlexContainer,
            TableAutomatic,
            ElementTree,
            SearchPanel
        },
        props: {},
        mixins: [doubletable],
        name: 'DoubleTable',
        data() {
            return {
                gridTag: ['DoubleTable1', 'DoubleTable2'],

                activeName: 'first',

                table: {
                    first: defaultData,

                    second: defaultData
                },

                platNo: '',

                simNo: '',

                driverName: ''

            };
        },
        watch: {

        },
        computed: {

        },
        methods: {
            handleChangePageView({
                page,
                pagesize
            }) {
                console.log('handleChangePageView', page, pagesize)
            },

            handleModifyEvent(row) {
                console.log('handleModifyEvent', row)
            },

            handleRemoveEvent(row) {
                console.log('handleRemoveEvent', row)
            },

            handleClickRow(row) {
                console.log('handleClickRow', row)
            },

            handleEmitExtandEvent(row) {
                console.log('handleEmitExtandEvent', row)
            },

            handleGetTableData() {
                console.log('handleGetTableData', this.driverName)
            }
        },
        created() {

        },

        beforeMount() {
            this.gridTag.forEach(item => {
                this.$set(this.fieldConfig, item, tableOptions)
                this.$set(this.manageColumn, item, [{
                        name: '修改',
                        icon: 'el-icon-edit-outline',
                        event: 'modify'
                    },
                    {
                        name: '删除',
                        icon: 'el-icon-delete',
                        event: 'remove'
                    },
                ])
            })
            this.$set(this.preColumns, this.gridTag[0], ['checkbox'])
            this.$set(this.preColumns, this.gridTag[1], ['index'])
        },

        mounted() {

        },
    };
</script>
<style lang="scss" scoped>

</style>