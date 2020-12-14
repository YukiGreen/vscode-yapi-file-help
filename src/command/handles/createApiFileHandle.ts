import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as handlebars from 'handlebars';
import { generateUrl, getFolderPath } from "../../utils"
import { Store } from '../../store';

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
        await this.resolveinIntfaceData(Store.getStore().getInterFaceList())
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
        await new CreateApiFile(agrs).run()
        vscode.window.showInformationMessage("api.ts创建完成!")
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(error.message)
    }
}

export { handle as CreateApiFileHandle }

