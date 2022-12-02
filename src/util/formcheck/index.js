import * as REGUTIL from './reg'

export const checkedPhoneValidate = (rule, value, callback) => {
    if (!value) {
        callback(new Error('该字段不可为空'))
    } else if (!REGUTIL.phoneAndTelReg.test(value)) {
        callback(new Error('数据格式不规范'))
    } else {
        callback()
    }
}

export const checkedMobileValidate = (rule, value, callback) => {
    if (!value) {
        callback(new Error('该字段不可为空'))
    } else if (!REGUTIL.phoneAndMobileReg.test(value)) {
        callback(new Error('数据格式不规范'))
    } else {
        callback()
    }
}

export const checkLetterAndNumber = (rule, value, callback) => {
    if (!value) {
        callback(new Error('该字段不可为空'))
    } else if (!REGUTIL.checkLetterAndNumber.test(value)) {
        callback(new Error('该字段仅支持数字 + 字母的组合'))
    } else {
        callback()
    }
}

export const checkNumber = (rule, value, callback) => {
    if (!value) {
        callback(new Error('该字段不能为空'))
    } else if (!REGUTIL.checkNumberreg.test(value)) {
        callback(new Error('该字段仅支持数字格式'))
    } else {
        callback()
    }
}

export const checkNullOrNumber = (rule, value, callback) => {
    if (!value) {
        callback()
    } else if (!REGUTIL.checkNumberreg.test(value)) {
        callback(new Error('该字段仅支持数字格式'))
    } else {
        callback()
    }
}

export const checkNumberdecimal = (rule, value, callback) => {
    if (!value) {
        callback()
    } else if (!REGUTIL.checkNumberdecimal.test(value)) {
        callback(new Error('该字段仅支持数字且数字只允许保留一位'))
    } else {
        callback()
    }
}