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
