<template>
    <div class="identify">
        <div class="identify__event" @click="reflashIdentifyCode" />
        <canvas id="s-canvas" :width="contentWidth" :height="contentHeight" style="cursor: pointer; border-radius: 4px;" />
    </div>
</template>

<script>
    export default {
        name: 'LoginIdentify',
        components: {},
        model: {
            prop: 'identifyCode',
            event: 'update'
        },
        props: {
            identifyCode: {
                // 默认注册码
                type: String,
                default: ''
            },
            identifyLength: {
                type: Number,
                default: 4
            },
            canUserCode: {
                type: String,
                default: '1234567890'
            },
            fontSizeMin: {
                // 字体最小值
                type: Number,
                default: 25
            },
            fontSizeMax: {
                // 字体最大值
                type: Number,
                default: 35
            },
            backgroundColorMin: {
                // 验证码图片背景色最小值
                type: Number,
                default: 200
            },
            backgroundColorMax: {
                // 验证码图片背景色最大值
                type: Number,
                default: 220
            },
            dotColorMin: {
                // 背景干扰点最小值
                type: Number,
                default: 60
            },
            dotColorMax: {
                // 背景干扰点最大值
                type: Number,
                default: 120
            },
            contentWidth: {
                // 容器宽度
                type: Number,
                default: 120
            },
            contentHeight: {
                // 容器高度
                type: [Number, String],
                default: 47
            }
        },
        data() {
            return {

            }
        },
        computed: {

        },
        watch: {
            identifyCode() {
                this.drawPic()
            }
        },
        created() {

        },
        mounted() {
            this.drawPic()
        },
        methods: {
            // 生成一个随机数
            randomNum(min, max) {
                return Math.floor(Math.random() * (max - min) + min)
            },
            // 生成一个随机的颜色
            randomColor(min, max) {
                const r = this.randomNum(min, max)
                const g = this.randomNum(min, max)
                const b = this.randomNum(min, max)
                return 'rgb(' + r + ',' + g + ',' + b + ')'
            },
            drawPic() {
                const canvas = document.getElementById('s-canvas')
                const ctx = canvas.getContext('2d')
                ctx.textBaseline = 'bottom'
                // 绘制背景
                ctx.fillStyle = this.randomColor(this.backgroundColorMin, this.backgroundColorMax)
                ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
                // 绘制文字
                for (let i = 0; i < this.identifyCode.length; i++) {
                    this.drawText(ctx, this.identifyCode[i], i)
                }
                this.drawLine(ctx)
                this.drawDot(ctx)
            },
            drawText(ctx, txt, i) {
                ctx.fillStyle = this.randomColor(50, 160) // 随机生成字体颜色
                ctx.font = this.randomNum(this.fontSizeMin, this.fontSizeMax) + 'px SimHei' // 随机生成字体大小
                const x = (i + 1) * (this.contentWidth / (this.identifyCode.length + 1))
                const y = this.randomNum(this.fontSizeMax, this.contentHeight - 5)
                var deg = this.randomNum(-30, 30)
                // 修改坐标原点和旋转角度
                ctx.translate(x, y)
                ctx.rotate((deg * Math.PI) / 180)
                ctx.fillText(txt, 0, 0)
                // 恢复坐标原点和旋转角度
                ctx.rotate((-deg * Math.PI) / 180)
                ctx.translate(-x, -y)
            },
            drawLine(ctx) {
                // 绘制干扰线
                for (let i = 0; i < 4; i++) {
                    ctx.strokeStyle = this.randomColor(100, 200)
                    ctx.beginPath()
                    ctx.moveTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
                    ctx.lineTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
                    ctx.stroke()
                }
            },
            drawDot(ctx) {
                // 绘制干扰点
                for (let i = 0; i < 30; i++) {
                    ctx.fillStyle = this.randomColor(0, 255)
                    ctx.beginPath()
                    ctx.arc(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight), 1, 0, 2 * Math
                        .PI)
                    ctx.fill()
                }
            },
            reflashIdentifyCode(len) {
                len = Number.isFinite(len) ? len : this.identifyLength
                let newcode = ''
                for (let i = 0; i < len; i++) {
                    const a = this.canUserCode[this.changeRandomNum(0, this.canUserCode.length - 1)]
                    newcode += a
                }
                this.$emit('update', `${newcode}`)
            },
            changeRandomNum(min, max) {
                max = max + 1
                return Math.floor(Math.random() * (max - min) + min)
            }
        }
    }

</script>
<style lang="scss" scoped>
    .identify {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;

        &__event {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 2;
            cursor: pointer;
            border-radius: 4px;
        }
    }

</style>
