export const emailReg = /[a-zA-Z0-9]{3,18}@[a-z]{2,8}\.(net|com|cn)/g

export const phoneAndTelReg = /(^[0-9]{3,4}-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^([0-9]{3,4})[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)/

export const phoneAndMobileReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/

export const idCardReg = /^[12345]{1}\d{16}(\d|X){1}$/

export const snum = /^[0-9,.]+$/

export const checkLetterAndNumber = /^[A-Za-z0-9]+$/

export const checkNumberreg = /^[0-9]*$/

export const checkletter = /^[A-Za-z]+$/

export const checklowercase = /^[a-z]+$/

export const checkCapitalize = /^[A-Z]+$/

export const checkNumberdecimal = /^\d{1}\d*\.{0,1}\d{0,1}$/


export const checkPassword = /^(?=.{12})(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[*?!&￥$%^#,./@";:><[\]}{\-=+_\\|》《。，、？’‘“”~ `]).*$/