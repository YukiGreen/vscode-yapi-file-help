/**
 * @Author: Sun Rising
 * @Date: 2020-12-30 10:35:44
 * @Last Modified by: Sun Rising
 * @Last Modified time: 2020-12-31 11:50:10
 * @Description:重置接口清单
 */
import * as vscode from "vscode";
import { YapiService } from "../../services/YapiService";
import { GlobalStore } from "../../store/GlobalStore";
import { YapiMenuView } from "../../view-bar/YapiMenuView";

// 处理器
async function handle(agrs: any, command: string) {
  try {
    let interFaceCat = YapiService.getYapiService().getInterFaceCat();
    interFaceCat.forEach((item: any) => {
      if (item.interFaces) {
        item.interFaces.forEach((item: any) => {
          item.isHide = false;
        });
      }
    });
    GlobalStore.getStore().setGlobalContextValue("button.findApi", true);
    GlobalStore.getStore().setGlobalContextValue("button.resetApiList", false);
    YapiMenuView.getYapiMenuView().refresh();
  } catch (error: any) {
    vscode.window.showErrorMessage(error.message);
  }
}

export { handle as ResetApiListHandle };
