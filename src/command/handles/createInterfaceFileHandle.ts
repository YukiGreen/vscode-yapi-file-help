/**
 * @Author: Sun Rising 
 * @Date: 2020-12-30 10:31:04 
 * @Last Modified by: Sun Rising
 * @Last Modified time: 2020-12-30 10:38:54
 * @Description: 创建接口类型文件
 */
import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import { getFolderPath, resolveinIntfaceData } from "../../utils"
import { YapiService } from '../../services/YapiService';

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
        const interFaceList = YapiService.getYapiService().getInterFaceList()
        for (let index = 0; index < interFaceList.length; index++) {
            const item = interFaceList[index];
            let obj = await resolveinIntfaceData(item["details"])
            if (obj)
                fs.writeFileSync(this.workspaceRootPath + '/' + obj.fileName + ".ts", obj.tsTmp)
        }
    }

}

// 处理器
async function handle(agrs: any, command: string) {
    try {
        await new CreateInterfaceFile(agrs).run()
        vscode.window.showInformationMessage("interfaces.ts创建完成!")
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(error.message)
    }
}

export { handle as CreateInterfaceFileHandle }
