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


            this.$watch(() => {
                return this.$store.getters.columnsSettings[item]
            }, (val) => {
                this.$set(this.checkedField, item, val?.fields)
                this.$set(this.pinned, item, val?.pinned)
            })

            this.getColumns(item)
        })
    },

    methods: {
        async getColumns(tag) {
            const res = await store.dispatch('columns/getColumns', tag)
            this.$set(this.checkedField, tag, res.fields || this.fieldConfig[tag])
            this.$set(this.pinned, tag, res.pinned || [])
        }
    }
}

export default mixin