import { postForm, post, get } from '../request'

export const uploadPicture = postForm('/?app=data&controller=base_model&action=upload&type=picture')

export const getDictionaryList = post('/?app=data&controller=object&action=find&fast=true')

export const getDictionaryListByForm = postForm('/?app=data&controller=object&action=find&fast=true')

export const getUserGroupInfo = post('/?app=system&controller=company&action=info')

export const getColumns = get('/?app=vehicle&controller=table&action=getFields')

export const setColumns = get('/?app=vehicle&controller=table&action=setFields')