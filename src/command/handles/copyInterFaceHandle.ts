/**
 * @Author: Sun Rising
 * @Date: 2020-12-30 10:35:17
 * @Last Modified by: Sun Rising
 * @Last Modified time: 2021-01-01 22:30:54
 * @Description: 复制api接口类型到剪贴板
 */
import { writeSync } from "clipboardy";
import * as vscode from "vscode";
import { resolveinIntfaceData } from "../../utils";

// 处理器
async function handle(agrs: any, command: string) {
  try {
    let obj = await resolveinIntfaceData(agrs.data.details);
    if (obj) {
      writeSync(obj.tsTmp);
      vscode.window.showInformationMessage("已生成 typing 至剪贴板！");
    }
  } catch (error: any) {
    console.log(error);
    vscode.window.showErrorMessage(error.message);
  }
}

export { handle as CopyInterFaceHandle };
