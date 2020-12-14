import { writeSync } from 'clipboardy';
import * as vscode from 'vscode';
import { resolveinIntfaceData } from '../../utils';

// 处理器
async function handle(agrs: any) {
    try {
        let obj = await resolveinIntfaceData(agrs.data.details)
        if (obj) {
            writeSync(obj.tsTmp)
            vscode.window.showInformationMessage("已生成 typing 至剪贴板！")
        }
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(error.message)
    }
}

export { handle as CopyInterFaceHandle }