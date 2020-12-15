import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import { getFolderPath, resolveinApiData } from "../../utils"
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
        let templateFullStr = await resolveinApiData(Store.getStore().getInterFaceList())
        if (templateFullStr)
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

