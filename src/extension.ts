import * as vscode from 'vscode';
import { menus } from './command';
import { Store } from './store';
import { DataProvider } from './view-bar/DataProvider';


/**
 * 扩展启用
 * @param {vscode.ExtensionContext} context
 */
export async function activate(context: vscode.ExtensionContext) {

	console.log("yapi-file-help 扩展启用");

	vscode.commands.executeCommand('setContext', 'button.addApiFile', true);
	vscode.commands.executeCommand('setContext', 'button.addInterfaceFile', true);
	vscode.commands.executeCommand('setContext', 'button.copyAllApi', true);
	vscode.commands.executeCommand('setContext', 'button.refresh', true);
	context.globalState.update("aaaa", true)
	console.log(context.globalState.get("aaaa"));
	console.log(context.globalState.get("button.addInterfaceFile"));
	context.workspaceState.update("aaaa", true)
	console.log(context.workspaceState.get("button.addInterfaceFile"));


	await Store.getStore().initStore()

	for (const item of menus) {
		context.subscriptions.push(vscode.commands.registerCommand(item.command, args => item.handle(args)));
	}

	vscode.window.registerTreeDataProvider("yapi-file-help-menu-view", new DataProvider());

}

/**
 * 扩展停用
 */
export function deactivate() { }
