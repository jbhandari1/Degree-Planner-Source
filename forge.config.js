module.exports = {
    packagerConfig: {
        ignore: ['^\\/public$', '^\\/src$', '^\\/node_modules$', '^\\/[.].+'],
        win32metadata: {
            ProductName: 'Degree Planner',
            CompanyName: 'UTD Students',
        },
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {},
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin'],
        },
        {
            name: '@electron-forge/maker-deb',
            config: {},
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {},
        },
    ],
}
