import Vue from 'vue'

export const isIE = function () {
    return !Vue.prototype.$isServer && !isNaN(Number(document.documentMode));
};

export const isEdge = function () {
    return !Vue.prototype.$isServer && navigator.userAgent.indexOf('Edge') > -1;
};

export const isFirefox = function () {
    return !Vue.prototype.$isServer && !!window.navigator.userAgent.match(/firefox/i);
};