import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as handlebars from 'handlebars';
import { generateUrl, getFolderPath, checkConfig, getHttpBody } from "../../utils"

class CreateApiFile {

    // 工作空间根路径
    workspaceRootPath = ""

    // yapi配置
    yapiConfig = {
        // 基础路径
        baseUrl: "",
        // token
        token: ""
    }

    constructor(agrs: any) {
        this.workspaceRootPath = getFolderPath(agrs)
    }

    async run() {
        // 检查配置项
        const { baseUrl, token } = await checkConfig()
        Object.assign(this.yapiConfig, { baseUrl, token })
        await this.loadServerData()
    }

    // 获取服务器数据
    async loadServerData() {
        // 获取项目id
        const resp: any = await getHttpBody(this.yapiConfig.baseUrl + "/api/project/get", {
            token: this.yapiConfig.token
        })
        // 获取接口集合
        const resp2: any = await getHttpBody(this.yapiConfig.baseUrl + "/api/interface/list", {
            token: this.yapiConfig.token,
            project_id: resp.data.uid,
            page: 1,
            limit: 1000
        })
        await this.resolveinIntfaceData(resp2.data.list)
    }

    // 解析接口数据
    async resolveinIntfaceData(serverData: any[]) {
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
        const tmpStr = fs.readFileSync(path.resolve(__dirname, `../../../templates/api.ts.tmpl`), 'utf-8')
        const template = handlebars.compile(tmpStr);
        let templateFullStr = template({
            interfaceArray: _serverData
        })
        fs.writeFileSync(this.workspaceRootPath + "/api.ts", templateFullStr)
    }

}

// 处理器
async function handle(agrs: any) {
    try {
        console.log(1111111);

        await new CreateApiFile(agrs).run()
        vscode.window.showInformationMessage("api.ts创建完成!")
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(error.message)
    }
}

export { handle as CreateApiFileHandle }

