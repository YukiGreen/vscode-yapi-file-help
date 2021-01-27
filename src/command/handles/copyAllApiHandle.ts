/**
 * @Author: Sun Rising 
 * @Date: 2020-12-30 10:29:11 
 * @Last Modified by: Sun Rising
 * @Last Modified time: 2020-12-30 10:29:38
 * @Description: 生成全部的API清单到剪贴板
 */
import * as vscode from 'vscode';
import { writeSync } from "clipboardy";
import { resolveinApiData } from '../../utils';
import { YapiService } from '../../services/YapiService';

// 处理器
async function handle(agrs: any, command: string) {
    try {
        let templateFullStr = await resolveinApiData(YapiService.getYapiService().getInterFaceList(), false)
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