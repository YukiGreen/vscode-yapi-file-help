import { CreateApiFileHandle } from "./handles/createApiFileHandle"
import { CreateInterfaceFileHandle } from "./handles/createInterfaceFileHandle"

const menus = [
    {
        command: "extension.addApiFile",
        handle: CreateApiFileHandle
    },
    {
        command: "extension.addInterfaceFile",
        handle: CreateInterfaceFileHandle
    }
]

export { menus }
