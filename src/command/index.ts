import { CopyAllApiHandle } from "./handles/copyAllApiHandle"
import { CopyApiHandle } from "./handles/copyApiHandle"
import { CopyInterFaceHandle } from "./handles/copyInterFaceHandle"
import { CreateApiFileHandle } from "./handles/createApiFileHandle"
import { CreateInterfaceFileHandle } from "./handles/createInterfaceFileHandle"
import { ExpandSwitchHandle } from "./handles/expandSwitchHandle"
import { FindApiHandle } from "./handles/findApiHandle"
import { OpenUrlHandle } from "./handles/OpenUrlHandle"
import { RefreshHandle } from "./handles/refreshHandle"
import { ResetApiListHandle } from "./handles/resetApiListHandle"
import { TitleSwitchHandle } from "./handles/titleSwitchHandle"

const menus = [
    // ----------------- explorer/context 开始 -----------------------
    {
        // 创建API清单文件
        command: "extension.addApiFile",
        handle: CreateApiFileHandle
    },
    {
        // 创建接口类型文件
        command: "extension.addInterfaceFile",
        handle: CreateInterfaceFileHandle
    },
    // ----------------- explorer/context 结束 -----------------------
    // ----------------- view/title 开始 -----------------------
    {
        // 刷新yapi数据
        command: "extension.refresh",
        handle: RefreshHandle
    },
    {
        // 生成全部的API清单到剪贴板
        command: "extension.copyAllApi",
        handle: CopyAllApiHandle
    },
    {
        // 列表label显示接口标题
        command: "extension.showApiTitle",
        handle: TitleSwitchHandle
    },
    {
        // 列表label显示接口路径
        command: "extension.showApiPath",
        handle: TitleSwitchHandle
    },
    {
        // 重置接口清单
        command: "extension.resetApiList",
        handle: ResetApiListHandle
    },
    {
        // 查询接口清单
        command: "extension.findApi",
        handle: FindApiHandle
    },
    {
        // 展开全部
        command: "extension.expandAll",
        handle: ExpandSwitchHandle
    },
    {
        // 收起全部
        command: "extension.collapseAll",
        handle: ExpandSwitchHandle
    },
    // ----------------- view/title 结束 -----------------------
    // ----------------- view/item/context 开始 -----------------
    {
        // 复制api接口到剪贴板
        command: "extension.copyApi",
        handle: CopyApiHandle
    },
    {
        // 复制api接口类型到剪贴板
        command: "extension.copyInterFace",
        handle: CopyInterFaceHandle
    },
    {
        // 打开浏览器网页
        command: "extension.openUrl",
        handle: OpenUrlHandle
    }
    // ----------------- view/item/context 结束 -----------------
]

export { menus }
