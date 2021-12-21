/**
 * @Author: Sun Rising
 * @Date: 2020-12-30 10:30:09
 * @Last Modified by: Sun Rising
 * @Last Modified time: 2020-12-30 10:30:09
 * @Description: 创建API清单文件
 */
import * as vscode from "vscode";
import * as fs from "fs-extra";
import { getFolderPath, resolveinApiData } from "../../utils";
import { YapiService } from "../../services/YapiService";

class CreateApiFile {
  // 工作空间根路径
  workspaceRootPath = "";

  // yapi配置
  yapiConfig = {
    // 基础路径
    baseUrl: "",
    // token
    token: "",
  };

  constructor(agrs: any) {
    this.workspaceRootPath = getFolderPath(agrs);
  }

  async run() {
    let templateFullStr = await resolveinApiData(
      YapiService.getYapiService().getInterFaceList()
    );
    if (templateFullStr)
      fs.writeFileSync(this.workspaceRootPath + "/api.ts", templateFullStr);
  }
}

// 处理器
async function handle(agrs: any, command: string) {
  try {
    await new CreateApiFile(agrs).run();
    vscode.window.showInformationMessage("api.ts创建完成!");
  } catch (error: any) {
    console.log(error);
    vscode.window.showErrorMessage(error.message);
  }
}

export { handle as CreateApiFileHandle };
