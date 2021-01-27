/**
 * @Author: Sun Rising 
 * @Date: 2020-12-30 10:32:51 
 * @Last Modified by: Sun Rising
 * @Last Modified time: 2020-12-31 13:19:15
 * @Description: 列表label显示接口 标题/路径 切换
 */
import { GlobalStore } from '../../store/GlobalStore';
import { YapiMenuView } from '../../view-bar/YapiMenuView';

// 处理器
async function handle(agrs: any, command: string) {
    if (command == "extension.showApiTitle") {
        GlobalStore.getStore().setGlobalContextValue("button.showApiTitle", true)
        GlobalStore.getStore().setGlobalContextValue("button.showApiPath", false)
    }
    if (command == "extension.showApiPath") {
        GlobalStore.getStore().setGlobalContextValue("button.showApiTitle", false)
        GlobalStore.getStore().setGlobalContextValue("button.showApiPath", true)
    }
    YapiMenuView.getYapiMenuView().refresh(false)
}

export { handle as TitleSwitchHandle }