<template>
    <FlexContainer>
        <template slot="leftWrapper">
            <ElementTree treeSign="japanModel" default-expand-all></ElementTree>
        </template>

        <template slot="rightTop">
            您好
        </template>

        <template slot="rightBottom">
            <TableAutomatic :fieldConfig="fieldConfig" :checkedField="checkedField" :tableData="formatTableData"
                :manageColumn="manageColumn" :preColumns="preColumns" :pagesize.sync="pagesize" :page.sync="page"
                :total="total" :pinned="pinned" :gridTag="gridTag" @pagination="handleChangePageView"
                @modify="handleModifyEvent" @remove="handleRemoveEvent" @row-click="handleClickRow">

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
                    <SearchPanel v-model="driverName" @search="handleGetTableData" placeholder="请输入驾驶员名称"></SearchPanel>
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
        </template>

        <PictureView v-show="picture.show" :url-list="picture.urlList" :on-close="() => picture.show = false" />

    </FlexContainer>
</template>
<script>
    import {
        ElementTree
    } from '@/components/ElementTree';
    import FlexContainer from '@/components/Layout/FlexContainer';
    import {
        TableAutomatic,
        SearchPanel,
        singletable
    } from '@/components/ElementTable'
    import PictureView from '@/components/PictureView/PictureView.vue'
    import {
        tableOptions,
        defaultData
    } from './components/fieldConfig'
    export default {
        name: 'TreeAndTable',
        components: {
            ElementTree,
            FlexContainer,
            TableAutomatic,
            SearchPanel,
            PictureView
        },
        props: {},
        mixins: [singletable],
        data() {
            return {
                gridTag: 'TreeAndTable',

                platNo: '',

                simNo: '',

                total: 9,

                driverName: '',

                tableData: defaultData,

                fieldConfig: tableOptions,

                picture: {
                    show: false,
                    urlList: []
                }
            }
        },
        computed: {
            pageStart() {
                return (this.page - 1) * this.pagesize
            },
            formatTableData() {
                return this.tableData.slice(this.pageStart, this.pageStart + this.pagesize)
            },
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

            handleEmitExtandEvent() {
                this.picture.urlList = ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg']

                this.picture.show = true

                // console.log('handleEmitExtandEvent', row)
            },

            handleGetTableData() {
                console.log('handleGetTableData', this.driverName)
            }
        },
        beforeCreate() {

        },
        created() {

        },
        beforeMount() {

        },
        mounted() {

        },
        beforeDestroy() {

        },
    }
</script>
<style lang="scss" scoped>

</style>