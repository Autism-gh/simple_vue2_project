import { get, post, apiService, postObjToForm } from "../request";

export const login = get('/?app=system&controller=admin&action=login_new')

export const getInfo = get('/?app=system&controller=index&action=userInfo')

export const logout = get('/?app=system&controller=admin&action=logout_new')

//获取个人信息
export const getUserinfo = get('/?app=system&controller=my&action=profile')

//图片提交
export const uploadImg = post('/?app=system&controller=upload&action=photo')

//修改个人信息
export const editUserinfo = postObjToForm('/?app=system&controller=my&action=profile')

//修改个人信息
export const editPassword = postObjToForm('/?app=system&controller=my&action=password')