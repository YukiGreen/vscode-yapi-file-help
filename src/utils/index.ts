import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import Axios from 'axios';

// 获取请求体
export function getHttpBody(url: string, params: any) {
    return new Promise((resolve, reject) => {
        Axios.get(url, { params }).then((res: any) => {
            resolve(res.data)
        }).catch((error: any) => reject(error))
    })
}

// 创建请求路径
export function generateUrl(intfaceItem: any) {
    let str_arr = [intfaceItem.method, ...intfaceItem.path.split("/").filter((item: any) => item.length > 0)]
    let _str_arr = str_arr.map((item, index) => {
        let _item = item.replace(/[\{\}]/g, "").toLowerCase().split("")
        if (index != 0)
            _item[0] = _item[0].toUpperCase()
        return _item.join("")
    })
    return _str_arr.join("")
}

// 获取目标路径
export function getFolderPath(agrs: any) {
    return fs.lstatSync(agrs.fsPath).isDirectory() ? agrs.fsPath : path.dirname(agrs.fsPath)
}

// 检查配置
export async function checkConfig() {
    const _workspaceFolders = vscode.workspace.workspaceFolders
    if (!_workspaceFolders || _workspaceFolders.length == 0) {
        throw new Error("未发现可用的工作空间")
    }
    const currWorkspaceFolder = _workspaceFolders[0]
    if (!fs.existsSync(currWorkspaceFolder.uri.fsPath + '/package.json')) {
        throw new Error("未发现配置文件 package.json ")
    }
    const packageObj = fs.readJSONSync(currWorkspaceFolder.uri.fsPath + '/package.json')
    if (!packageObj["yapiConfig"]) {
        throw new Error("未发现配置项 package.json [ yapiConfig ] ")
    }
    if (!packageObj["yapiConfig"]["token"]) {
        throw new Error("未发现配置项 package.json [ yapiConfig.token ] ")
    }
    if (!packageObj["yapiConfig"]["baseUrl"]) {
        throw new Error("未发现配置项 package.json [ yapiConfig.baseUrl ] ")
    }
    return {
        baseUrl: packageObj["yapiConfig"]["baseUrl"],
        token: packageObj["yapiConfig"]["token"]
    }
}

// 处理json-schema
export function handleJsonSchema(jsonSchema: any, title: string) {
    if (jsonSchema.properties) {
        for (const key in jsonSchema.properties) {
            if (jsonSchema.properties[key].type == "array") {
                Object.assign(jsonSchema.properties[key].items, {
                    "$ref": "#",
                    title: `${title}${key}Item`
                })
            }
        }
    }
    return jsonSchema
}