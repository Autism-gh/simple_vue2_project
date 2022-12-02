import { post, get, apiService } from "../request";

export const getPlaneGroups = post('/api/device/tree/groups', { api: apiService })

export const getCategoryTree = get('/?app=vehicle&controller=tag&action=interestCategoryTree')

export const getPlaneList = post('/api/device/tree/vehicles', { api: apiService })

export const getVehicleCompany = get('/?app=system&controller=department&action=cate_for_tree&catid=tree')

export const getInterestList = get('/?app=vehicle&controller=tag&action=interestCategoryPointTree')

export const getFenceRangeList = get('/?app=vehicle&controller=region&action=tree&region=true')

// 获取基地
export const getBaseGroup = post('/api/device/feiji/tree/base/groups' , { api: apiService } )

// 获取场地
export const getSiteList = post('/api/device/feiji/mission/site/list' , { api: apiService } )