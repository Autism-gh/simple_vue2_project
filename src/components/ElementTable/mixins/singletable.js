
import store from '@/store'
/**
 * 
 *  { name: '修改', icon: 'el-icon-edit-outline', event: 'modify' },
    { name: '删除', icon: 'el-icon-delete', event: 'remove' },
    { name: '查看', icon: 'el-icon-search', event: 'show' },
    { name: '下载', icon: 'el-icon-download', event: 'download' },
 * 
 */

const defaultPage = 100


const mixin = {
    components: { },
    data() {
        return {
            gridTag: '',

            fieldConfig: [],

            checkedField: [],

            preColumns: ['checkbox','index'],

            manageColumn: [
                { name: '修改', icon: 'el-icon-edit-outline', event: 'modify' },
                { name: '删除', icon: 'el-icon-delete', event: 'remove' },
            ],

            page: 1,

            pagesize: defaultPage,

            total: 0,

            pinned: 0
        }
    },
    watch: {

    },
    computed: {},

    async beforeMount() {
        try {
            await this.getColumns(this.gridTag)
        
        const formatTag = `${ store.state.columns.prefix }__${this.gridTag}`
        this.$watch(() => {
            return this.$store.getters.columnsSettings[formatTag]
        }, (val) => {
            const { pinned, fields } = val
            // const fieldList = fields && fields?.length ? 
            //     fields.map(item => item.field) : 
            //     this.fieldConfig.map(item => item.field)
                
            this.pinned = pinned
            this.checkedField = fields
        })
        } catch (error) {
            return
        }
        
    },

    methods: {
        async getColumns(tag) {
            const res = await store.dispatch('columns/getColumns', tag)
            const { pinned, fields } = res

            this.pinned = pinned
            // const fieldList = fields && fields?.length ? 
            //     fields.map(item => item.field) : 
            //     this.fieldConfig.map(item => item.field)
            this.checkedField = fields
        }
    }
}

export default mixin