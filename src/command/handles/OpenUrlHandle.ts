/**
 * @Author: Sun Rising 
 * @Date: 2020-12-30 10:32:51 
 * @Last Modified by: Sun Rising
 * @Last Modified time: 2021-02-01 10:15:23
 * @Description: 打开浏览器网页
 */
import * as vscode from 'vscode';
import { GlobalStore } from '../../store/GlobalStore';

// 处理器
async function handle(agrs: any) {
    const baseUrl = GlobalStore.getStore().getStaticValue("baseUrl")
    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`${baseUrl}/project/${agrs.data.project_id}/interface/api/${agrs.data._id}`))
}

export { handle as OpenUrlHandle }