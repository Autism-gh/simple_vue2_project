import { post, postForm, get } from "../request";

export const addNewView = postForm("/?app=data&controller=object&action=create")

export const getViewList = post('/?app=vehicle&controller=visualField&action=lists')

export const setViewDefault = get('/?app=vehicle&controller=visualField&action=setDefault')

export const removeView = get('/?app=vehicle&controller=visualField&action=delete')