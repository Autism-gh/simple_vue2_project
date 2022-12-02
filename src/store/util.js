import * as TreeApi from '@/axios/app/tree'

/**
 * 
 * 参考权限设置内的
 * 获取账号下所有的组织
 * 
 */
export const formatCompanyTree = async () => {
    const result = await TreeApi.getVehicleCompany({})
    return result.length ? result : []
}

