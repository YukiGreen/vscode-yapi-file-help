import * as vscode from 'vscode';
import { menus } from './command';
import { ConfigService } from './services/ConfigService';
import { YapiService } from './services/YapiService';
import { GlobalStore } from './store/GlobalStore';
import { YapiMenuView } from './view-bar/YapiMenuView';


/**
 * 扩展启用
 * @param {vscode.ExtensionContext} context
 */
export async function activate(context: vscode.ExtensionContext) {

	console.log("yapi-to-angular 扩展启用");

	// 注册命令
	for (const item of menus) {
		context.subscriptions.push(vscode.commands.registerCommand(item.command, args => item.handle(args, item.command)));
	}

	// 初始化仓库
	GlobalStore.init(context)

	await initEnv()

}

export async function initEnv() {
	// 检查环境
	if (await ConfigService.check(true)) {
		// 初始化Yapi数据
		await YapiService.getYapiService().init()
		// 显示操作按钮
		GlobalStore.getStore().setGlobalContextValue("button.addApiFile", true)
		GlobalStore.getStore().setGlobalContextValue("button.addInterfaceFile", true)
		GlobalStore.getStore().setGlobalContextValue("button.copyAllApi", true)

		GlobalStore.getStore().setGlobalContextValue("button.findApi", true)
		GlobalStore.getStore().setGlobalContextValue("button.resetApiList", false)

		GlobalStore.getStore().setGlobalContextValue("button.showApiTitle", true)
		GlobalStore.getStore().setGlobalContextValue("button.showApiPath", false)

		GlobalStore.getStore().setGlobalContextValue("button.collapseAll", true)
		GlobalStore.getStore().setGlobalContextValue("button.expandAll", false)

		// 注册侧边菜单
		vscode.window.registerTreeDataProvider("yapi-menu-view", YapiMenuView.getYapiMenuView())

	} else {
		GlobalStore.getStore().setGlobalContextValue("button.addApiFile", false)
		GlobalStore.getStore().setGlobalContextValue("button.addInterfaceFile", false)
		GlobalStore.getStore().setGlobalContextValue("button.copyAllApi", false)

		GlobalStore.getStore().setGlobalContextValue("button.findApi", false)
		GlobalStore.getStore().setGlobalContextValue("button.resetApiList", false)

		GlobalStore.getStore().setGlobalContextValue("button.showApiTitle", false)
		GlobalStore.getStore().setGlobalContextValue("button.showApiPath", false)

		GlobalStore.getStore().setGlobalContextValue("button.collapseAll", false)
		GlobalStore.getStore().setGlobalContextValue("button.expandAll", false)
	}
}

/**
 * 扩展停用
 */
export function deactivate() { }
