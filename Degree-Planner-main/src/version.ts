import packageInfo from '../package.json'

const version = packageInfo.version
export default version
export const [majorVersion, minorVersion, patchVersion] = version
    .split('.')
    .map((v) => +v)
