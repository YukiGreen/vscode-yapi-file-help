import * as vscode from 'vscode';
import { writeSync } from "clipboardy";
import { generateUrl } from '../../utils';

// 处理器
async function handle(agrs: any) {
    try {
        writeSync(`
        // ${agrs.tooltip}
        ${generateUrl(agrs.data)}:"${agrs.label}",`)
        vscode.window.showInformationMessage("已生成 api 至剪贴板！")
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(error.message)
    }
}

export { handle as CopyApiHandle }