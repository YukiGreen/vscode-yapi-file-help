/**
 * @Author: Sun Rising 
 * @Date: 2020-12-14 08:53:43 
 * @Last Modified by: Sun Rising
 * @Last Modified time: 2020-12-14 14:29:21
 * @Description: 单例数据仓库
 */
import * as vscode from 'vscode';
import { checkConfig, getHttpBody } from "../utils"

export class Store {

    private static store: Store

    // 初始化标识
    private initFlag: boolean = false

    // 接口集合
    private interFaceCat: any[] = []

    private constructor() { }

    static getStore() {
        if (Store.store == null) {
            Store.store = new Store()
        }
        return Store.store
    }

    // 初始化仓库数据
    async initStore() {
        try {
            // 检查配置项
            const { baseUrl, token } = await checkConfig()
            // 获取项目id
            const resp: any = await getHttpBody(baseUrl + "/api/project/get", {
                token: token
            })
            // 获取分类
            let resp2: any = await getHttpBody(baseUrl + "/api/interface/getCatMenu", {
                token: token,
                project_id: resp.data.uid
            })
            // 获取接口
            if (Array.isArray(resp2.data)) {
                for (var i = 0; i < resp2.data.length; i++) {
                    let item = resp2.data[i]
                    let resp3: any = await getHttpBody(baseUrl + "/api/interface/list_cat", {
                        token: token,
                        catid: item._id,
                        page: 1,
                        limit: 999
                    })

                    // 获取接口详细数据
                    if (Array.isArray(resp3.data.list)) {
                        for (let index = 0; index < resp3.data.list.length; index++) {
                            let item = resp3.data.list[index];
                            const resp4: any = await getHttpBody(baseUrl + "/api/interface/get", {
                                token: token,
                                id: item._id
                            })
                            item["details"] = resp4.data
                        }
                    }

                    item["interFaces"] = resp3.data.list

                }
            }

            this.interFaceCat = resp2.data
            this.initFlag = true
            vscode.window.showInformationMessage("Yapi 数据拉取成功！")
        } catch (error) {
            console.log(error);
            vscode.window.showErrorMessage(error.message)
        }
    }

    // 获取全部接口列表
    getInterFaceList() {
        let interFaceList: any[] = []
        this.interFaceCat.forEach(item => {
            interFaceList = interFaceList.concat(item['interFaces'])
        })
        return interFaceList
    }

    // 获取全部接口分类
    getInterFaceCat(): any[] {
        return this.interFaceCat
    }

    // 是否进行了初始化
    async isInit() {
        if (!this.initFlag) {
            throw new Error("Yapi 未进行初始化，原因可能是未配置 yapi.conf.json ");
        }
        if (this.interFaceCat.length == 0) {
            throw new Error("未拉取到 Yapi 数据.");
        }
    }

}
