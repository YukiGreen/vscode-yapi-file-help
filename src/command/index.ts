import { CopyAllApiHandle } from "./handles/copyAllApiHandle"
import { CopyApiHandle } from "./handles/copyApiHandle"
import { CopyInterFaceHandle } from "./handles/copyInterFaceHandle"
import { CreateApiFileHandle } from "./handles/createApiFileHandle"
import { CreateInterfaceFileHandle } from "./handles/createInterfaceFileHandle"
import { RefreshHandle } from "./handles/refreshHandle"

const menus = [
    {
        command: "extension.addApiFile",
        handle: CreateApiFileHandle
    },
    {
        command: "extension.addInterfaceFile",
        handle: CreateInterfaceFileHandle
    },
    {
        command: "extension.refresh",
        handle: RefreshHandle
    },
    {
        command: "extension.copyApi",
        handle: CopyApiHandle
    },
    {
        command: "extension.copyInterFace",
        handle: CopyInterFaceHandle
    },
    {
        command: "extension.copyAllApi",
        handle: CopyAllApiHandle
    }
]

export { menus }
