import { initEnv } from "../../extension";
import { YapiMenuView } from "../../view-bar/YapiMenuView";
import { ConfigService } from "../../services/ConfigService";

// 处理器
async function handle(agrs: any, command: string) {
  try {
    await ConfigService.check();
    await initEnv();
    YapiMenuView.getYapiMenuView().refresh(false);
  } catch (error: any) {}
}

export { handle as RefreshHandle };
