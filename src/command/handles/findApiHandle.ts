/**
 * @Author: Sun Rising
 * @Date: 2020-12-30 10:35:28
 * @Last Modified by: Sun Rising
 * @Last Modified time: 2020-12-31 13:38:17
 * @Description:查询接口清单
 */
import * as vscode from "vscode";
import { YapiService } from "../../services/YapiService";
import { GlobalStore } from "../../store/GlobalStore";
import { YapiMenuView } from "../../view-bar/YapiMenuView";

// 处理器
async function handle(agrs: any, command: string) {
  try {
    let inputStr = await vscode.window.showInputBox({
      prompt: `请输入接口名称或路径.`,
    });
    if (!inputStr) return; // ESC或者空输入
    let interFaceCat = YapiService.getYapiService().getInterFaceCat();
    interFaceCat.forEach((item: any) => {
      if (item.interFaces) {
        item.interFaces.forEach((item: any) => {
          if (
            !(item.title.includes(inputStr) || item.path.includes(inputStr))
          ) {
            item.isHide = true;
          } else {
            item.isHide = false;
          }
        });
      }
    });
    GlobalStore.getStore().setGlobalContextValue("button.collapseAll", false);
    GlobalStore.getStore().setGlobalContextValue("button.expandAll", true);

    GlobalStore.getStore().setGlobalContextValue("button.findApi", false);
    GlobalStore.getStore().setGlobalContextValue("button.resetApiList", true);

    YapiMenuView.getYapiMenuView().refresh();
  } catch (error: any) {
    vscode.window.showErrorMessage(error.message);
  }
}

export { handle as FindApiHandle };
