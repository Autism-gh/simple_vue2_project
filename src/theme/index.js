import './commonTheme.scss'

import './main/default.css'
import './main/orange.css'

import { defaultVariables, extandVariables } from './defaultsetting'
import cssVars from 'css-vars-ponyfill'
import store from '@/store'

// 从本地里找找是否已经有过了 没有 就走默认喽
// const defaultPlan = localStorage.getItem('customTheme') || store.state.settings.themeName || 'orange'

const defaultPlan = store.state.settings.themeName || 'orange'


let currentPlan

const themePlan = {
    default: () => import('./colorset/default.js'),

    orange: () => import('./colorset/orange.js')
}

const getPlanStyle = async (planName) => {
    if(!planName || toString.call(planName) !== '[object String]') return
    if(!themePlan[planName]) return

    // 需要用 css var 丢出来的当然包含原始样式喽
    const defaultOptions = Object.assign(defaultVariables, extandVariables)
    currentPlan = (await themePlan[planName]()).default;
    currentPlan = Object.assign(defaultOptions, currentPlan)

    // 记住样式 并存到 vue 上
    const styleOption = {}
    const keysList = Object.keys(currentPlan)
    keysList.forEach(item => {
        const newKey = item.replace(/-/g, '')
        styleOption[newKey] = currentPlan[item]
    })
    
    // 记录到样式

    return {
        currentPlan,
        styleOption
    }
}

const changeElementStyle = (type) => {
    const element = document.body
    if(!element || !type) return

    let classList = element.className.split(' ')
    classList = classList.filter(item => !item.includes('theme-'))

    let classString = classList.join(' ')
    classString += ` theme-${ type }`
    element.className = classString
}

export default {
    install: async function (Vue) {
        changeElementStyle(defaultPlan)
        const { currentPlan, styleOption } = await getPlanStyle(defaultPlan)
        cssVars({
            variables: currentPlan,
            onSuccess() {
                console.log('【THEME CHANGE SUCCESS】::', defaultPlan)
            },
            onError(message) {
                console.log('【THEME CHANGE ERROR】::', message)
            },
        })
        store.dispatch('settings/changeSetting', {
            key: 'themeOptions',
            value: styleOption
        })

        

        Vue.prototype.$setTheme = async (key) => {
            localStorage.setItem('customTheme', key)
            changeElementStyle(key)

            const { currentPlan, styleOption } = await getPlanStyle(key)
            
            return new Promise((resolve, reject) => {
                store.dispatch('settings/changeSetting', {
                    key: 'themeOptions',
                    value: styleOption
                })

                cssVars({
                    include: 'style[id="custom-theme"]',
                    variables: currentPlan,
                    onSuccess(cssText, node, url) {
                        console.log('【THEME CHANGE SUCCESS】::', defaultPlan)
                        resolve({cssText, node, url})
                    },
                    onError(message, node, xhr, url) {
                        console.log('【THEME CHANGE ERROR】::', message)
                        reject(message, node, xhr, url)
                    },
                    onComplete() {
                        console.log('【THEME CHANGE LOADING】::', ...arguments)
                        resolve()
                    }
                });
            })
        }
    }
}