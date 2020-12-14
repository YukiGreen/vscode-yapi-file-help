import * as vscode from 'vscode';
import { Store } from '../../store';
import { DataProvider } from '../../view-bar/DataProvider';

// 处理器
async function handle(agrs: any) {
    try {
        await Store.getStore().initStore()
        vscode.window.registerTreeDataProvider("yapi-file-help-menu-view", new DataProvider());
        vscode.window.showInformationMessage("刷新成功！")
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(error.message)
    }
}

export { handle as RefreshHandle }