/**
 * @Author: Sun Rising 
 * @Date: 2020-12-30 10:32:51 
 * @Last Modified by: Sun Rising
 * @Last Modified time: 2020-12-31 13:36:46
 * @Description: 列表 展开/折叠 切换
 */
import { GlobalStore } from '../../store/GlobalStore';
import { YapiMenuView } from '../../view-bar/YapiMenuView';

// 处理器
async function handle(agrs: any, command: string) {
    if (command == "extension.expandAll") {
        GlobalStore.getStore().setGlobalContextValue("button.collapseAll", false)
        GlobalStore.getStore().setGlobalContextValue("button.expandAll", true)
    }
    if (command == "extension.collapseAll") {
        GlobalStore.getStore().setGlobalContextValue("button.collapseAll", true)
        GlobalStore.getStore().setGlobalContextValue("button.expandAll", false)
    }
    YapiMenuView.getYapiMenuView().refresh()
}

export { handle as ExpandSwitchHandle }