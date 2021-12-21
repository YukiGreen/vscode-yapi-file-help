/**
 * @Author: Sun Rising
 * @Date: 2020-12-30 10:35:08
 * @Last Modified by: Sun Rising
 * @Last Modified time: 2020-12-30 10:35:08
 * @Description: 复制api接口到剪贴板
 */
import * as vscode from "vscode";
import { writeSync } from "clipboardy";
import { generateUrl } from "../../utils";

// 处理器
async function handle(agrs: any, command: string) {
  try {
    writeSync(`
        // ${agrs.data.title}
        ${generateUrl(agrs.data)}:"${agrs.data.path}",`);
    vscode.window.showInformationMessage("已生成 api 至剪贴板！");
  } catch (error: any) {
    console.log(error);
    vscode.window.showErrorMessage(error.message);
  }
}

export { handle as CopyApiHandle };
