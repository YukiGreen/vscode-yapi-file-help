import * as vscode from 'vscode';
import { Store } from '../../store';
import { DataProvider } from '../../view-bar/DataProvider';

// 处理器
async function handle(agrs: any) {
    await Store.getStore().initStore()
    vscode.window.registerTreeDataProvider("yapi-file-help-menu-view", new DataProvider());
}

export { handle as RefreshHandle }