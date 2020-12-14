import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import { getFolderPath, resolveinIntfaceData } from "../../utils"
import { Store } from '../../store';

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

    constructor(agrs: any) {
        this.workspaceRootPath = getFolderPath(agrs)
    }

    async run() {
        const interFaceList = Store.getStore().getInterFaceList()
        for (let index = 0; index < interFaceList.length; index++) {
            const item = interFaceList[index];
            let obj = await resolveinIntfaceData(item["details"])
            if (obj)
                fs.writeFileSync(this.workspaceRootPath + '/' + obj.fileName + ".ts", obj.tsTmp)
        }
    }

}

// 处理器
async function handle(agrs: any) {
    try {
        await new CreateInterfaceFile(agrs).run()
        vscode.window.showInformationMessage("interfaces.ts创建完成!")
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(error.message)
    }
}

export { handle as CreateInterfaceFileHandle }
