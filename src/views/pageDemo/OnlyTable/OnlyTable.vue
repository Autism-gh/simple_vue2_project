<template>
    <FlexContainer>
      <template slot="rightBottom">
        <TableAutomatic ref="aviationtable" :fieldConfig="fieldConfig" :checkedField="checkedField" :tableData="tableData"
          exportIcon="airplane/material/export" :manageColumn="manageColumn" :preColumns="preColumns"
          :pagesize.sync="pagesize" :page.sync="page" :total="total" :pinned="pinned" :gridTag="gridTag"
          @pagination="handleChangePageView" @modify="handleOpenModal($event, true)" @remove="handleRemoveEvent">
  
          <template slot="filterLeft">
            <div class="filter-item">
              <el-button type="primary" @click="handleOpenModal(null, false)">添加
              </el-button>
            </div>
          </template>
  
          <template slot="extand">
            <div class="flex flex--wrap">
              <div class="filter-item">
                <div class="title">生产计划单</div>
                <el-input class="control" v-model="query.erpOrder" />
              </div>
              <div class="filter-item">
                <div class="title">派工单编号</div>
                <el-input class="control" v-model="query.mesWorkOrder" />
              </div>
              <div class="filter-item">
                <div class="title">工单计划时间</div>
                <el-date-picker
                  v-model="query.mesPlanStartEnd"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="timestamp">
                </el-date-picker>
              </div>
              <div class="filter-item">
                <div class="title">工单实际时间</div>
                <el-date-picker
                  v-model="query.mesProductionStartEnd"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="timestamp">
                </el-date-picker>
              </div>
            </div>
          </template>
  
          <template slot="filterRight">
            <SearchPanel v-model="query.materialName" @search="handleChangePageView" placeholder="物料名称"></SearchPanel>
          </template>
  
          <template slot="pageLeft">
            <el-button type="primary" @click="handleRemoveMore">删除
            </el-button>
          </template>
  
        </TableAutomatic>
      </template>
  
      <el-dialog :title="`${ modal.isModify ? '编辑':'添加' }生产计划`" :visible.sync="modal.show" width="980px">
        <el-form ref="productionPlan" :model="modal.data" :rules="modal.rules" label-width="150px">
          <el-col :span="item.span" v-for="item in modal.lockList" :key="item.key">
            <el-form-item :label="item.name">
              {{ modal.data[item.key] }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物料名称" prop="materialName">
              <el-input v-model="modal.data.materialName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物料编码" prop="materialSn">
              <el-input v-model="modal.data.materialSn" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产计划单" prop="erpOrder">
              <el-input v-model="modal.data.erpOrder" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="派工单编号" prop="mesWorkOrder">
              <el-input v-model="modal.data.mesWorkOrder" />
            </el-form-item>
          </el-col>
  
          <el-col :span="12">
            <el-form-item label="工单计划生产数量" prop="mesWorkPlanQty">
              <el-input v-model="modal.data.mesWorkPlanQty" />
            </el-form-item>
          </el-col>
  
          <el-col :span="12">
            <el-form-item label="工单计划开始时间" prop="mesPlanStartTime">
              <el-date-picker style="width: 100%" v-model="modal.data.mesPlanStartTime" type="datetime"
                placeholder="选择日期时间" @change="handlePlanStartTimeChange" value-format="timestamp">
              </el-date-picker>
            </el-form-item>
          </el-col>
  
          <el-col :span="12">
            <el-form-item label="工单计划结束时间" prop="mesPlanEndTime">
              <el-date-picker style="width: 100%" v-model="modal.data.mesPlanEndTime" type="datetime" placeholder="选择日期时间"
                :picker-options="planPickerOptionsEnd" @change="handlePlanEndTimeChange" value-format="timestamp">
              </el-date-picker>
            </el-form-item>
          </el-col>
  
          <el-col :span="12">
            <el-form-item label="工单实际生产数量" prop="mesWorkActQty">
              <el-input v-model="modal.data.mesWorkActQty" />
            </el-form-item>
          </el-col>
  
          <el-col :span="12">
            <el-form-item label="生产不合格数量" prop="mesWorkUnqualifiedQty">
              <el-input v-model="modal.data.mesWorkUnqualifiedQty" />
            </el-form-item>
          </el-col>
  
          <el-col :span="12">
            <el-form-item label="工单实际开始时间" prop="mesProductionStartTime">
              <el-date-picker style="width: 100%" v-model="modal.data.mesProductionStartTime" type="datetime"
                placeholder="选择日期时间" @change="handleTrueStartTimeChange" value-format="timestamp">
              </el-date-picker>
            </el-form-item>
          </el-col>
  
          <el-col :span="12">
            <el-form-item label="工单实际结束时间" prop="mesProductionEndTime">
              <el-date-picker style="width: 100%" v-model="modal.data.mesProductionEndTime" type="datetime"
                :picker-options="truePickerOptionsEnd" placeholder="选择日期时间" @change="handleTrueEndTimeChange" value-format="timestamp">
              </el-date-picker>
            </el-form-item>
          </el-col>
  
          <el-col :span="12">
            <el-form-item label="班次数量" prop="shiftNum">
              <el-input v-model="modal.data.shiftNum" />
            </el-form-item>
          </el-col>
  
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleCommitModal">确 定</el-button>
          <el-button type="primary" @click="modal.show = false">关 闭</el-button>
        </span>
      </el-dialog>
  
    </FlexContainer>
  </template>
  <script>
    import FlexContainer from '@/components/Layout/FlexContainer.vue';
    import {
      TableAutomatic,
      SearchPanel,
      singletable
    } from '@/components/ElementTable'
    import {
      fieldConfig,
      lockList
    } from './components/fieldConfig'
    import {
      checkNumber
    } from '@/util/formcheck'
    import {
      checkEmptyParmas
    } from '@/util/common/common'
    import moment from 'moment';
    export default {
      name: 'OnlyTable',
      components: {
        FlexContainer,
        TableAutomatic,
        SearchPanel
      },
      mixins: [singletable],
      props: {},
      data() {
        const defaultData = {
          // actual_start_end_time: [],
  
          mesProductionEndTime: moment().set({
            "hour": 18,
            "minute": 0,
            "second": 0
          }).valueOf(),
          mesProductionStartTime: moment().set({
            "hour": 8,
            "minute": 0,
            "second": 0
          }).valueOf(),
  
          mesPlanStartTime: moment().set({
            "hour": 8,
            "minute": 0,
            "second": 0
          }).valueOf(),
          mesPlanEndTime: moment().set({
            "hour": 18,
            "minute": 0,
            "second": 0
          }).valueOf(),
  
          mesWorkActQty: null,
          mesWorkPlanQty: null,
          mesWorkUnqualifiedQty: null,
          shiftNum: null,
  
          customer: "客户名称",
          mesWorkOrder: "派工单编号",
          factoryCode: "工厂编码",
          factoryName: "工厂名称",
          materialSn: "物料编码",
          materialName: "物料名称",
          erpOrder: "生产计划单",
          companyId: "供应商编码",
          company: "供应商名称",
        }
  
  
        return {
          manageColumn: [{
              name: '修改',
              icon: 'el-icon-edit-outline',
              event: 'modify',
              root: 'airplane/material/update'
            },
            {
              name: '删除',
              icon: 'el-icon-delete',
              event: 'remove',
              root: 'airplane/material/delete'
            },
          ],
  
          gridTag: 'OnlyTable',
  
          fieldConfig,
  
          tableData: [],
  
          queryName: '',
  
          modal: {
            show: false,
  
            isModify: false,
  
            defaultData,
  
            data: JSON.parse(JSON.stringify(defaultData)),
  
            lockList,
  
            rules: {
              materialName: [{
                required: true,
                message: '物料名称不能为空',
                trigger: 'blur'
              }],
              materialSn: [{
                required: true,
                message: '物料编码不能为空',
                trigger: 'blur'
              }],
              erpOrder: [{
                required: true,
                message: '生产计划单不能为空',
                trigger: 'blur'
              }],
              mesWorkOrder: [{
                required: true,
                message: '派工单编号不能为空',
                trigger: 'blur'
              }],
              mesWorkPlanQty: [{
                validator: checkNumber,
                required: true,
                trigger: 'blur'
              }],
              mesPlanStartTime: [{
                required: true,
                message: '计划开始时间不能为空',
                trigger: 'blur'
              }],
              mesPlanEndTime: [{
                required: true,
                message: '计划结束时间不能为空',
                trigger: 'blur'
              }],
              mesWorkActQty: [{
                validator: checkNumber,
                required: true,
                trigger: 'blur'
              }],
              mesWorkUnqualifiedQty: [{
                validator: checkNumber,
                required: true,
                trigger: 'blur'
              }],
              mesProductionStartTime: [{
                required: true,
                message: '实际开始时间不能为空',
                trigger: 'blur'
              }],
              mesProductionEndTime: [{
                required: true,
                message: '实际结束时间不能为空',
                trigger: 'blur'
              }],
              shiftNum: [{
                validator: checkNumber,
                required: true,
                trigger: 'blur'
              }]
            }
          },
  
          planPickerOptionsEnd: {
            disabledDate: (time) => {
              const {
                mesPlanStartTime
              } = this.modal.data
              if (mesPlanStartTime) {
                return (
                  time.getTime() <= new Date(mesPlanStartTime).getTime() - 86400000
                );
              }
            }
          },
  
          truePickerOptionsEnd: {
            disabledDate: (time) => {
              const {
                mesProductionStartTime
              } = this.modal.data
              if (mesProductionStartTime) {
                return (
                  time.getTime() <= new Date(mesProductionStartTime).getTime() - 86400000
                );
              }
            }
          },
  
          query: {
            materialName: '',
            erpOrder: '',
            mesWorkOrder: '',
            mesPlanStartEnd: [],
            mesProductionStartEnd: []
          }
  
        }
      },
      computed: {
  
      },
      methods: {
        async handleChangePageView({
          page = 1,
          pagesize = this.pagesize
        } = {}) {
          const extandParmas = this.getExtandParmas()
  
          const resultParmas = Object.assign(extandParmas, {
            page,
            pagesize
          })
  
          console.log('resultParmas', resultParmas)
  
  
        },
  
        getExtandParmas() {
          const keysList = Object.keys(this.query)
          const extandParmas = {}
          keysList.forEach(item => {
            const value = this.query[item]
            if(checkEmptyParmas(value)) {
              extandParmas[item] = value
            }
          })
          return extandParmas
        },
  
        async handleOpenModal(row, type) {
          const {
            defaultData
          } = this.modal
          this.modal.data = JSON.parse(JSON.stringify(defaultData))
          this.modal.isModify = type
          this.modal.show = true
          await this.$nextTick()
          this.$refs['productionPlan'].clearValidate()
  
  
        },
  
  
        handleRemoveEvent({
          _id
        }) {
          this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
  
          })
        },
  
        handleRemoveMore() {
          const select = this.$refs['aviationtable'].getCheckedRows()
          if (!select || !select?.length) {
            this.$warning('请选择要删除的数据')
            return
          }
          const idlist = select.map(item => item._id)
          this.handleRemoveEvent({
            _id: idlist
          })
        },
  
  
        handleCommitModal() {
          this.$refs['productionPlan'].validate(async (res) => {
            if (!res) return
            const {
              isModify,
              data
            } = this.modal
            const {
              mesWorkActQty,
              mesWorkUnqualifiedQty
            } = data
  
            if (mesWorkUnqualifiedQty > mesWorkActQty) {
              this.$warning('不合格数量不的大于实际生产数量')
              return
            }
  
            console.log('data', data)
  
            
  
            if (isModify) {
              this.$success('修改成功')
            } else {
              this.$success('新增成功')
            }
  
            this.modal.show = false
            this.handleChangePageView()
          })
        },
  
  
  
  
  
        /**
         * 
         * 开始结束时间相互牵扯调整
         * 
         */
  
        handlePlanStartTimeChange(time) {
          const { mesPlanEndTime } = this.modal.data
          if(mesPlanEndTime) {
            const startTimeSecond = moment(time).valueOf()
            const endTimeSecond = moment(mesPlanEndTime).valueOf()
  
            if(startTimeSecond > endTimeSecond) {
              this.modal.data.mesPlanEndTime = startTimeSecond
            }
          }
        },
  
        handlePlanEndTimeChange(time) {
          const { mesPlanStartTime } = this.modal.data
          if(mesPlanStartTime) {
            const startTimeSecond = moment(mesPlanStartTime).valueOf()
            const endTimeSecond = moment(time).valueOf()
  
            if(endTimeSecond < startTimeSecond) {
              this.modal.data.mesPlanStartTime = endTimeSecond
            }
          }
        },
  
        handleTrueStartTimeChange(time) {
          const { mesProductionEndTime } = this.modal.data
          if(mesProductionEndTime) {
            const startTimeSecond = moment(time).valueOf()
            const endTimeSecond = moment(mesProductionEndTime).valueOf()
  
            if(startTimeSecond > endTimeSecond) {
              this.modal.data.mesProductionEndTime = startTimeSecond
            }
          }
        },
  
        handleTrueEndTimeChange(time) {
          const { mesProductionStartTime } = this.modal.data
          if(mesProductionStartTime) {
            const startTimeSecond = moment(mesProductionStartTime).valueOf()
            const endTimeSecond = moment(time).valueOf()
  
            if(endTimeSecond < startTimeSecond) {
              this.modal.data.mesProductionStartTime = endTimeSecond
            }
          }
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