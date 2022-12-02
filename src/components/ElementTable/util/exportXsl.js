import * as XLSX from "xlsx";
import { filterTime } from '@/util/common/common'
export default {
    methods: {
        async exportExcel() {
            let tableData = JSON.parse(JSON.stringify(this.formatTableList)) 
            let select = JSON.parse(JSON.stringify(this.$refs["automaticstable"].selection)) ;
            // eslint-disable-next-line no-unused-vars
            let Exportdata = []
            select.length && await this.$confirm('默认优先导出选中数据, 是否继续?', '提示:', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                // center: true
            }).then(() => {
                Exportdata = select
            }).catch(() => {
                // eslint-disable-next-line no-const-assign
                select = false
            });
            if (select) {
                let ExportArrayList = Exportdata.length ? Exportdata : tableData
                let status = ExportArrayList.length ? true : false
                if (!status) ExportArrayList = [{}]
                const fdArray = [];
                ExportArrayList.forEach( (data, index) => {
                    var obj = {}
                    this.formatChecked.forEach((Val) => {
                        obj['序号'] = status ? index + 1 : ''
                        obj[Val.name] = data.table_formatter[Val.field] || data[Val.field] || '-'
                    })
                    fdArray.push(obj);
                });
                // 新建一个excel.xlsx
                let wb = XLSX.utils.book_new();
                //封装JSON 数据
                let fdXslxws = XLSX.utils.json_to_sheet(fdArray);
                XLSX.utils.book_append_sheet(wb, fdXslxws, "sheet");
                XLSX.writeFile(wb, `${this.$route?.meta?.title} - ${ filterTime(Date.now(),false)}` + ".xlsx");
                this.$success("导出成功");
            } else {
                this.$warning("取消导出");
            }
        },
        destination (row) {
            let ss = [];
            if (row.destination_lng !== "") {
                ss.push(row.destination_lng);
            }
            if (row.destination_lat !== "") {
                ss.push(row.destination_lat);
            }
            return ss.join(",");
        }
    },
}