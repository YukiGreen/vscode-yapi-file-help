const vscode = require('vscode');
const fs = require('fs-extra')
const { compile } = require('json-schema-to-typescript')
const { getHttpBody, generateUrl, getFolderPath, checkConfig, handleJsonSchema } = require("../utils");

class CreateInterfaceFile {

    // 工作空间根路径
    workspaceRootPath = ""

    // yapi配置
    yapiConfig = {
        // 基础路径
        baseUrl: "",
        // token
        token: ""
    }

    constructor(agrs) {
        this.workspaceRootPath = getFolderPath(agrs)
    }

    // 获取文件的头部注释
    getBannerComment(data) {
        return `/**\n* 作者:${data.username}\n*/`
    }

    async run() {
        // 检查配置项
        const { baseUrl, token } = await checkConfig()
        Object.assign(this.yapiConfig, { baseUrl, token })
        // 加载服务器数据
        await this.getServerData()
    }

    // 获取服务器数据
    async getServerData() {
        // 获取项目id
        const resp = await getHttpBody(this.yapiConfig.baseUrl + "/api/project/get", {
            token: this.yapiConfig.token
        })
        // 获取接口集合
        const resp2 = await getHttpBody(this.yapiConfig.baseUrl + "/api/interface/list", {
            token: this.yapiConfig.token,
            project_id: resp.data.uid,
            page: 1,
            limit: 1000
        })
        // 获取接口详细数据
        if (Array.isArray(resp2.data.list)) {
            for (let index = 0; index < resp2.data.list.length; index++) {
                const item = resp2.data.list[index];
                const resp3 = await getHttpBody(this.yapiConfig.baseUrl + "/api/interface/get", {
                    token: this.yapiConfig.token,
                    id: item._id
                })
                await this.resolveinIntfaceData(resp3.data)
            }
        }
    }

    // 解析接口数据
    async resolveinIntfaceData(serverData) {
        if (!serverData.path || !serverData.method) return
        // ts模板字符串
        let tsTmp = ""
        // 文件名称
        const fileName = generateUrl(serverData)
        // 处理服务器响应参数
        if (serverData.res_body_is_json_schema && serverData.res_body) {
            const title = fileName + "Res"
            let jsonSchema = await this.resolveinJsonSchema(serverData.res_body, title)
            tsTmp = tsTmp + await compile(jsonSchema, title, {
                bannerComment: this.getBannerComment(serverData)
            })
        }
        // 处理客户端请求参数
        if (serverData.req_body_is_json_schema && serverData.req_body_other) {
            const title = fileName + "Req"
            let jsonSchema = await this.resolveinJsonSchema(serverData.req_body_other, title)
            tsTmp = tsTmp + await compile(jsonSchema, title, {
                bannerComment: this.getBannerComment(serverData)
            })
        }
        fs.writeFileSync(this.workspaceRootPath + '/' + fileName + ".ts", tsTmp)
    }

    // 处理json_schema
    async resolveinJsonSchema(data, interfaceName) {
        let jsonSchema = JSON.parse(data)
        if (Object.keys(jsonSchema).length == 0) return
        delete jsonSchema.title
        handleJsonSchema(jsonSchema, interfaceName)
        return jsonSchema
    }

}

// 处理器
async function handle(agrs) {
    try {
        await new CreateInterfaceFile(agrs).run()
        vscode.window.showInformationMessage("interfaces.ts创建完成!")
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(error.message)
    }
}

module.exports = handle
