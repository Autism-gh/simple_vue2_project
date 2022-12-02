import { formatColumnTime } from '@/util/common/column'

export const fieldConfig = [
    {  
        name: '供应商名称',
        field: 'company',
        default: false,
    },
    {  
        name: '供应商编码',
        field: 'companyId',
        default: false,
    },
    {  
        name: '工厂名称',
        field: 'factoryName',
        default: false,
    },
    {  
        name: '工厂编码',
        field: 'factoryCode',
        default: false,
    },
    {  
        name: '客户名称',
        field: 'customer',
        default: false,
    },
    {  
        name: '物料名称',
        field: 'materialName',
        default: false,
    },
    {  
        name: '物料编码',
        field: 'materialSn',
        default: false,
    },
    {  
        name: '生产计划单',
        field: 'erpOrder',
        default: false,
    },
    {  
        name: '派工单编号',
        field: 'mesWorkOrder',
        default: false,
    },
    {  
        name: '工单计划生产数量',
        field: 'mesWorkPlanQty',
        default: false,
    },
    {  
        name: '工单计划开始时间',
        field: 'mesPlanStartTime',
        default: false,
    },
    {  
        name: '工单计划结束时间',
        field: 'mesPlanEndTime',
        default: false,
    },
    {  
        name: '工单实际生产数量',
        field: 'mesWorkActQty',
        default: false,
    },
    {  
        name: '生产不合格数量',
        field: 'mesWorkUnqualifiedQty',
        default: false,
    },
    {  
        name: '工单实际开始时间',
        field: 'mesProductionStartTime',
        default: false,
    },
    {  
        name: '工单实际结束时间',
        field: 'mesProductionEndTime',
        default: false,
    },
    {  
        name: '班次数量',
        field: 'shiftNum',
        default: false,
    }
]


export const lockList = [
    {
        "name": "客户名称",
        "key": "customer",
        "form": false,
        "span": 12
    },{
        "name": "供应商名称",
        "key": "company",
        "form": false,
        "span": 12
    }, {
        "name": "供应商编码",
        "key": "companyId",
        "form": false,
        "span": 12
    }, {
        "name": "工厂名称",
        "key": "factoryName",
        "form": false,
        "span": 12
    }, {
        "name": "工厂编码",
        "key": "factoryCode",
        "form": false,
        "span": 12
    }
]


export const formaList = [  {
	"name": "物料名称",
	"key": "materialName",
	"form": true,
    "prop": "materialName",
	"span": 12
}, {
	"name": "物料编码",
	"key": "materialSn",
	"form": true,
    "prop": "materialSn",
	"span": 12
}, {
	"name": "生产计划单",
	"key": "erpOrder",
	"form": true,
    "prop": "erpOrder",
	"span": 12
}, {
	"name": "派工单编号",
	"key": "mesWorkOrder",
	"form": true,
    "prop": "mesWorkOrder",
	"span": 12
}, {
	"name": "工单计划生产数量",
	"key": "mesWorkPlanQty",
	"form": true,
    "prop": "mesWorkPlanQty",
	"span": 12,
    "type": "number"
}, 



{
	"name": "工单计划开始时间",
	"key": "mesPlanStartTime",
	"form": true,
    "prop": "mesPlanStartTime",
	"span": 12
}, {
	"name": "工单计划结束时间",
	"key": "mesPlanEndTime",
	"form": true,
    "prop": "mesPlanEndTime",
	"span": 12
}, 

{
	"name": "工单实际生产数量",
	"key": "mesWorkActQty",
	"form": true,
    "prop": "mesWorkActQty",
	"span": 12,
    "type": "number"
}, 
{
	"name": "生产不合格数量",
	"key": "mesWorkUnqualifiedQty",
	"form": true,
    "prop": "mesWorkUnqualifiedQty",
	"span": 12,
    "type": "number"
}, 



{
	"name": "工单实际开始时间",
	"key": "mesProductionStartTime",
	"form": true,
    "prop": "mesProductionStartTime",
	"span": 12
}, {
	"name": "工单实际结束时间",
	"key": "mesProductionEndTime",
	"form": true,
    "prop": "mesProductionEndTime",
	"span": 12
}, 

{
	"name": "班次数量",
	"key": "shiftNum",
	"form": true,
    "prop": "shiftNum",
	"span": 12,
    "type": "number"
}
]