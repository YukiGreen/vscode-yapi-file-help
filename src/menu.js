
const menus = [
    {
        command: "extension.addApiFile",
        handle: require('./handles/createApiFileHandle')
    },
    {
        command: "extension.addInterfaceFile",
        handle: require('./handles/createInterfaceFileHandle')
    },
    {
        command: "extension.addAngularDirective",
        handle: require('./handles/createInterfaceFileHandle')
    },
    {
        command: "extension.addAngularPipe",
        handle: require('./handles/createInterfaceFileHandle')
    },
    {
        command: "extension.addAngularService",
        handle: require('./handles/createInterfaceFileHandle')
    },
    {
        command: "extension.addAngularRoute",
        handle: require('./handles/createInterfaceFileHandle')
    },
    {
        command: "extension.addAngularModule",
        handle: require('./handles/createInterfaceFileHandle')
    }
]

module.exports = {
    menus
}