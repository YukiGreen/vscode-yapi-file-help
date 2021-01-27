import { WebviewPanel } from "vscode";
import { GlobalStore } from "../store/GlobalStore";
import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import { resolveinIntfaceData, resolveinTmp } from "../utils";

/**
 * @Author: Sun Rising
 * @Date: 2021-01-20 15:32:46
 * @Last Modified by: Sun Rising
 * @Last Modified time: 2021-01-26 12:05:45
 * @Description: webview消息解析
 */
export interface webviewMsg {
    // 信息唯一标识
    token: string,
    // 执行类别
    command: string,
    // 携带信息
    data: any
}

/**
 * webview消息解析
 * @param message 信息
 */
export async function resolveHandle(message: webviewMsg, panel: WebviewPanel) {
    console.log("接收到webview信息", message);
    if (message.command == "getCurrInterface") {
        panel.webview.postMessage(Object.assign(message, { data: GlobalStore.getStore().getStaticValue("currInterface") }));
    }
    if (message.command == "saveQueryPageFile") {
        // ------------- 获取输入的组件名称 开始 -----------------------------------
        let inputStr = await vscode.window.showInputBox({ prompt: `请输入组件名称.` })
        // ESC或者空输入
        if (!inputStr) {
            panel.webview.postMessage(Object.assign(message, { command: "reject", data: "未输入组件名称，取消生成" }));
            return
        };
        // ------------- 获取输入的组件名称 结束 -----------------------------------

        // ------------- 获取保存路径 开始 -----------------------------------------
        let uri = await vscode.window.showOpenDialog({
            title: "请选择保存路径",
            canSelectMany: false,
            canSelectFiles: false,
            canSelectFolders: true
        })
        if (!(uri && uri.length > 0)) {
            panel.webview.postMessage(Object.assign(message, { command: "reject", data: "未选择保存路径，取消生成" }));
            return
        }
        // ------------- 获取保存路径 结束 -----------------------------------------

        // ------------- 生成接口文件 开始 ----------------------------------------
        let currInterface = GlobalStore.getStore().getStaticValue("currInterface")
        let obj = await resolveinIntfaceData(currInterface.details)
        if (!obj) {
            panel.webview.postMessage(Object.assign(message, { command: "reject", data: "接口模板解析失败，取消生成" }));
            return
        }
        fs.writeFileSync(`${uri[0].path.substring(1)}/${inputStr}.module.ts`, obj.tsTmp)
        // ------------- 生成接口文件 结束 ----------------------------------------

        // ------------- 生成Html文件 开始 ----------------------------------------
        let htmlTmp = resolveinTmp(GlobalStore.getStore().getExtensionContext(), "templates/queryPage.html.tmpl", message.data)
        fs.writeFileSync(`${uri[0].path.substring(1)}/${inputStr}.component.html`, htmlTmp)
        // ------------- 生成Html文件 结束 ----------------------------------------

        // ------------- 生成ts文件 开始 ----------------------------------------
        let tsTmp = resolveinTmp(GlobalStore.getStore().getExtensionContext(), "templates/queryPage.ts.tmpl", Object.assign(message.data, {
            resInterfaceName: obj.resInterfaceName,
            reqInterfaceName: obj.reqInterfaceName
        }))
        fs.writeFileSync(`${uri[0].path.substring(1)}/${inputStr}.component.ts`, tsTmp)
        // ------------- 生成ts文件 结束 ----------------------------------------

        // ------------- 生成less文件 开始 ----------------------------------------
        fs.writeFileSync(`${uri[0].path.substring(1)}/${inputStr}.component.less`, "")
        // ------------- 生成less文件 结束 ----------------------------------------

        panel.webview.postMessage(Object.assign(message, { data: "ok" }));
    }
    if (message.command == "saveTypingFile") {
        let currInterface = GlobalStore.getStore().getStaticValue("currInterface")
        let obj = await resolveinIntfaceData(currInterface.details)
        let uri = await vscode.window.showSaveDialog({
            title: "保存",
            filters: {
                'TypeScript': ['ts']
            }
        })
        if (!uri || !obj) return
        fs.writeFileSync(uri.path.substring(1), obj.tsTmp)
        panel.webview.postMessage(Object.assign(message, { data: "ok" }));
    }
    if (message.command == "saveEditPageFile") {

    }
}