import { initEnv } from '../../extension';
import { YapiMenuView } from '../../view-bar/YapiMenuView';

// 处理器
async function handle(agrs: any, command: string) {
    await initEnv()
    YapiMenuView.getYapiMenuView().refresh(false)
}

export { handle as RefreshHandle }