/**
 * @Author: Sun Rising
 * @Date: 2020-12-26 13:23:48
 * @Last Modified by: Sun Rising
 * @Last Modified time: 2021-02-01 10:07:24
 * @Description: 配置检测
 */
import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import { GlobalStore } from '../store/GlobalStore';

export class ConfigService {

    /**
     * 检查配置
     * @param isSilent 是否静默检查
     */
    static async check(isSilent = false) {
        try {
            const _workspaceFolders = vscode.workspace.workspaceFolders
            if (!_workspaceFolders || _workspaceFolders.length == 0) {
                throw new Error("未发现可用的工作空间")
            }
            const currWorkspaceFolder = _workspaceFolders[0]
            if (!fs.existsSync(currWorkspaceFolder.uri.fsPath + '/yapi.conf.json')) {
                throw new Error("未发现配置文件 yapi.conf.json ")
            }
            const packageObj = fs.readJSONSync(currWorkspaceFolder.uri.fsPath + '/yapi.conf.json')
            if (!packageObj["yapiConfig"]) {
                throw new Error("未发现配置项 yapi.conf.json [ yapiConfig ] ")
            }
            if (!packageObj["yapiConfig"]["token"]) {
                throw new Error("未发现配置项 yapi.conf.json [ yapiConfig.token ] ")
            }
            if (!packageObj["yapiConfig"]["baseUrl"]) {
                throw new Error("未发现配置项 yapi.conf.json [ yapiConfig.baseUrl ] ")
            }
            GlobalStore.getStore().setStaticValue("baseUrl", packageObj["yapiConfig"]["baseUrl"])
            GlobalStore.getStore().setStaticValue("token", packageObj["yapiConfig"]["token"])
            return true
        } catch (error) {
            console.log(error);
            if (isSilent) return false
            vscode.window.showErrorMessage(error.message)
            throw error
        }
    }

}