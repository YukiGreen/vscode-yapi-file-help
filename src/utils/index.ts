import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as handlebars from 'handlebars';
import { compile } from 'json-schema-to-typescript'
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

// 解析接口数据
export async function resolveinIntfaceData(serverData: any) {
    if (!serverData.path || !serverData.method) return
    // ts模板字符串
    let tsTmp = ""
    // 文件名称
    const fileName = generateUrl(serverData)
    // 处理服务器响应参数
    if (serverData.res_body_is_json_schema && serverData.res_body) {
        const title = fileName + "Res"
        let jsonSchema = await resolveinJsonSchema(serverData.res_body, title)
        tsTmp = tsTmp + await compile(jsonSchema, title, {
            bannerComment: getBannerComment(serverData)
        })
    }
    // 处理客户端请求参数
    if (serverData.req_body_is_json_schema && serverData.req_body_other) {
        const title = fileName + "Req"
        let jsonSchema = await resolveinJsonSchema(serverData.req_body_other, title)
        tsTmp = tsTmp + await compile(jsonSchema, title, {
            bannerComment: getBannerComment(serverData)
        })
    }
    return { fileName, tsTmp }
}

// 解析API数据
export async function resolveinApiData(serverData: any[], isPrefix: boolean = true) {
    let _serverData: any[] = []
    if (Array.isArray(serverData)) {
        serverData.forEach(item => {
            _serverData.push({
                desc: item.title,
                key: generateUrl(item),
                value: item.path
            })
        })
    }
    if (_serverData.length == 0) return
    const tmpStr = fs.readFileSync(path.resolve(__dirname, `../../templates/api.ts.tmpl`), 'utf-8')
    const template = handlebars.compile(tmpStr);
    let templateFullStr = template({
        interfaceArray: _serverData,
        isPrefix
    })
    return templateFullStr
}

// 处理json_schema
export async function resolveinJsonSchema(data: string, interfaceName: string) {
    let jsonSchema = JSON.parse(data)
    if (Object.keys(jsonSchema).length == 0) return
    delete jsonSchema.title
    handleJsonSchema(jsonSchema, interfaceName)
    return jsonSchema
}

// 获取文件的头部注释
export function getBannerComment(data: any) {
    return `/**\n* 作者:${data.username}\n*/`
}