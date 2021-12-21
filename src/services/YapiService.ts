import { httpGet } from "../lib/axios";
import { GlobalStore } from "../store/GlobalStore";
import * as vscode from "vscode";

/**
 * @Author: Sun Rising
 * @Date: 2020-12-26 13:14:56
 * @Last Modified by: Sun Rising
 * @Last Modified time: 2020-12-30 10:55:17
 * @Description: Yapi服务
 */
export class YapiService {
  private static yapiService: YapiService;

  // 接口集合
  private interFaceCat: any[] = [];

  private constructor() {}

  static getYapiService() {
    if (!YapiService.yapiService) YapiService.yapiService = new YapiService();
    return YapiService.yapiService;
  }

  // 初始化数据
  init() {
    return new Promise((resolve, reject) => {
      try {
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            cancellable: false,
          },
          async (progress) => {
            return new Promise(async (r) => {
              const token = GlobalStore.getStore().getStaticValue("token");
              progress.report({
                increment: 0,
                message: "Yapi 数据拉取中...",
              });
              // 获取项目id
              const resp: any = await httpGet("/api/project/get", {
                token,
              });
              progress.report({ increment: 5 });
              // 获取分类
              let resp2: any = await httpGet("/api/interface/getCatMenu", {
                token,
                project_id: resp.data.uid,
              });
              progress.report({ increment: 10 });
              // 获取接口
              if (Array.isArray(resp2.data)) {
                for (var i = 0; i < resp2.data.length; i++) {
                  let item = resp2.data[i];
                  let resp3: any = await httpGet("/api/interface/list_cat", {
                    token,
                    catid: item._id,
                    page: 1,
                    limit: 999,
                  });
                  // 获取接口详细数据
                  if (Array.isArray(resp3.data.list)) {
                    for (
                      let index = 0;
                      index < resp3.data.list.length;
                      index++
                    ) {
                      let item = resp3.data.list[index];
                      const resp4: any = await httpGet("/api/interface/get", {
                        token: token,
                        id: item._id,
                      });
                      item["details"] = resp4.data;
                      progress.report({ increment: 10 + i + index });
                    }
                  }
                  item["interFaces"] = resp3.data.list;
                }
                this.interFaceCat = resp2.data;
                progress.report({
                  increment: 90,
                  message: "Yapi 数据拉取完成 !",
                });
              }
              setTimeout(() => {
                r(null);
              }, 3000);
              resolve(null);
            });
          }
        );
      } catch (error: any) {
        console.log(error);
        vscode.window.showErrorMessage(error.message);
      }
    });
  }

  // 获取全部接口列表
  getInterFaceList() {
    let interFaceList: any[] = [];
    this.interFaceCat.forEach((item) => {
      interFaceList = interFaceList.concat(item["interFaces"]);
    });
    return interFaceList;
  }

  // 获取全部接口分类
  getInterFaceCat(): any[] {
    return this.interFaceCat;
  }
}
