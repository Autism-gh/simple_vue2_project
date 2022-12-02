import store from '@/store'

const defaultPage = 100

const mixin = {
    components: { },
    data() {
        return {
            gridTag: [],

            fieldConfig: {},

            checkedField: {},

            preColumns: {},

            manageColumn: {},

            page: {},

            pagesize: {},

            total: {},

            pinned: {}
        }
    },
    watch: {

    },
    computed: {},

    async beforeMount() {
        this.gridTag.forEach(item => {
            this.$set(this.page, item, 1)
            this.$set(this.pagesize, item, defaultPage)
            this.$set(this.total, item, 0)
            
            const formatTag = `${ store.state.columns.prefix }__${item}`

            this.$watch(() => {
                return this.$store.getters.columnsSettings[formatTag]
            }, (val) => {
                const { pinned, fields } = val
                this.$set(this.pinned, item, pinned)
                this.$set(this.checkedField, item, fields)
            })

            this.getColumns(item)
        })
    },

    methods: {
        async getColumns(tag) {
            const res = await store.dispatch('columns/getColumns', tag)
            const { pinned, fields } = res
            this.$set(this.checkedField, tag, fields || this.fieldConfig[tag])
            this.$set(this.pinned, tag, pinned || 2)
        }
    }
}

export default mixin