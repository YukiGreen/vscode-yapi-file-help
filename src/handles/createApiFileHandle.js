const vscode = require('vscode');
const fs = require('fs-extra')
const handlebars = require("handlebars");
const path = require("path");

const { getHttpBody, generateUrl, getFolderPath, checkConfig } = require("../utils")

// 基础配置
let yapiConfig = {
    token: "",
    url: ""
}

// 项目ID
let project_id = ""

// 获取服务器数据
async function loadServerData() {
    // 获取项目id
    const resp = await getHttpBody(yapiConfig.url + "/api/project/get", {
        token: yapiConfig.token
    })
    // 获取接口集合
    project_id = resp.data.uid
    const resp2 = await getHttpBody(yapiConfig.url + "/api/interface/list", {
        token: yapiConfig.token,
        project_id,
        page: 1,
        limit: 1000
    })
    return resp2.data.list
}

// 解析接口数据
async function resolveinIntfaceData(serverData) {
    let _serverData = []
    if (Array.isArray(serverData)) {
        serverData.forEach(item => {
            _serverData.push({
                desc: item.title,
                key: generateUrl(item),
                value: item.path
            })
        })
    }
    const tmpStr = fs.readFileSync(path.resolve(__dirname, `../templates/api.ts.tmpl`), 'utf-8')
    const template = handlebars.compile(tmpStr);
    let templateFullStr = template({
        interfaceArray: _serverData
    })
    return templateFullStr
}

// 处理器
async function handle(agrs) {
    try {
        const { url, token } = await checkConfig()
        yapiConfig.token = token
        yapiConfig.url = url
        const serverData = await loadServerData()
        const templateFullStr = await resolveinIntfaceData(serverData, agrs)
        fs.writeFileSync(getFolderPath(agrs) + "/api.ts", templateFullStr)
        vscode.window.showInformationMessage("api.ts创建完成!")
    } catch (error) {
        vscode.window.showErrorMessage(error.message)
    }
}

module.exports = handle
