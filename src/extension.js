const vscode = require('vscode');
const { menus } = require('./menu');

/**
 * 扩展激活
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log("yapi-file-help 扩展激活");

	for (const item of menus) {
		context.subscriptions.push(vscode.commands.registerCommand(item.command, args => item.handle(args)));
	}

}

module.exports = {
	activate
}
