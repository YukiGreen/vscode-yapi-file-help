import * as vscode from 'vscode';
import { writeSync } from "clipboardy";
import { resolveinApiData } from '../../utils';
import { Store } from '../../store';

// 处理器
async function handle(agrs: any) {
    try {
        let templateFullStr = await resolveinApiData(Store.getStore().getInterFaceList(), false)
        if (templateFullStr) {
            writeSync(templateFullStr)
            vscode.window.showInformationMessage("已生成全部 api 至剪贴板！")
        }
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(error.message)
    }
}

export { handle as CopyAllApiHandle }