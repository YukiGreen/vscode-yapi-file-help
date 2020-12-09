const request = require("request");
const path = require("path");
const fs = require("fs");

module.exports = {
    // 获取连接的html
    getHttpBody(url, data) {
        return new Promise((resolve, reject) => {
            request({
                url: url,
                method: 'GET',
                qs: {
                    ...data
                }
            }, (error, response) => {
                if (error !== null) reject(error)
                resolve(JSON.parse(response.body))
            });
        });
    },
    // 创建请求路径
    generateUrl(intfaceItem) {
        let str_arr = [intfaceItem.method, ...intfaceItem.path.split("/").filter(item => item.length > 0)]
        let _str_arr = str_arr.map((item, index) => {
            let _item = item.replace(/[\{\}]/g, "").toLowerCase().split("")
            if (index != 0)
                _item[0] = _item[0].toUpperCase()
            return _item.join("")
        })
        return _str_arr.join("")
    },
    // 获取目标路径
    getFolderPath(agrs) {
        return fs.lstatSync(agrs.fsPath).isDirectory() ? agrs.fsPath : path.dirname(agrs.fsPath)
    },
    // 检查配置文件
    async checkConfig() {
        const _workspaceFolders = vscode.workspace.workspaceFolders
        if (_workspaceFolders.length == 0) {
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
        if (!packageObj["yapiConfig"]["url"]) {
            throw new Error("未发现配置项 package.json [ yapiConfig.url ] ")
        }
        return {
            url: packageObj["yapiConfig"]["url"],
            token: packageObj["yapiConfig"]["token"]
        }
    }
}