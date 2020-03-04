const manageFiles = require.context('../../', true, /route\/route\.js$/)

// console.log(manageFiles.keys()) // ['./a.js'] 返回一个数组，包含全部文件名
let configRouters = []
manageFiles.keys().forEach(key => {
    //if (key === './store.js') return //    如果是当前文件，则跳过
    configRouters = configRouters.concat(manageFiles(key).default) // 读取出文件中的default模块
})
// console.log(configRouters);
export default configRouters // 抛出一个Vue-router期待的结构的数组
