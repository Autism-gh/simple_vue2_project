<template>
    <div :class="['table-container', {'has-extand': $slots.extand}]">
        <div class="query-wrapper">
            <div class="first-floor">
                <div class="filter-left" v-if="$slots.filterLeft">
                    <slot name="filterLeft"></slot>
                </div>
                <div class="filter-right">
                    <slot name="filterRight"></slot>
                </div>
            </div>
            <div v-show="showMore" class="extand-floor" v-if="$slots.extand">
                <slot name="extand"></slot>
            </div>
        </div>
        <div class="botton-wrapper" v-if="$slots.button">
            <slot name="button"></slot>
        </div>
        <div class="table-wrapper">
            <slot name="table"></slot>
        </div>
        <div class="page-wrapper">
            <div class="page-left" v-if="$slots.pageLeft">
                <slot name="pageLeft"></slot>
            </div>
            <div class="page-right">
                <el-pagination
                    v-bind="pageAttrs"
                    :current-page.sync="currentPage"
                    :page-size.sync="currentPageSize"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { scrollTo } from '@/util/common/scroll-to'
export default {
    components: {  },
    props: {  

        /**
         * 分页数据传递
         */
        pageOptions: {
            type: Object,
            default: function() {
                return {
                    pageSizes: [30, 50, 100, 150, 200],
                    layout: 'total, sizes, prev, pager, next, jumper',
                }
            }
        },

        page: {
            type: Number,
            default: 1
        },

        pagesize: {
            type: Number,
            default: 50
        },

        total: {
            required: true,
            type: Number
        },

        fieldConfig: {
            type: Array,
            default: function() {
                return []
            }
        }

    },
    name: 'TableManual',
    data() {
        return {
            showMore: false,
        };
    },
    watch: {
        
    },
    computed: {
        pageAttrs() {
            return Object.assign(this.pageOptions, this.$attrs)
        },

        currentPage: {
            get() {
                return this.page
            },
            set(val) {
                this.$emit('update:page', val)
            }
        },
        currentPageSize: {
            get() {
                return this.size
            },
            set(val) {
                this.$emit('update:size', val)
            }
        }
    },
    methods: {
        handleSizeChange(val) {
            this.$emit('pagination', { page: this.currentPage, pageSize: val })
            if (this.autoScroll) {
                scrollTo(0, 800)
            }
        },

        handleCurrentChange(val) {
            this.$emit('pagination', { page: val, pageSize: this.pageSize })
            if (this.autoScroll) {
                scrollTo(0, 800)
            }
        }
    },
    created() {
        
    },
    mounted() {
        
    },
};
</script>
<style lang="scss" scoped>
@import './scss/table.scss'
</style>