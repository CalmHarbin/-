import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'

// 自动导入 modules
let requireModules = require.context('./modules', true, /.*\.js$/)
let Modules = {}

requireModules.keys().forEach(function(fileName) {
    //单个模块
    let Module = requireModules(fileName)
    Module = Module[fileName.slice(2, -3)] || Module
    //添加模块 fileName.slice(2, -3)文件名, ./test.js则是test
    Modules[fileName.slice(2, -3)] = Module
})

const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
              // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
          })
        : compose

const middlewares = [thunkMiddleware]

if (
    process.env.NODE_ENV === 'development' &&
    process.env.TARO_ENV !== 'quickapp'
) {
    middlewares.push(require('redux-logger').createLogger())
}

const enhancer = composeEnhancers(
    applyMiddleware(...middlewares)
    // other store enhancers if any
)

export default function configStore() {
    const store = createStore(combineReducers(Modules), enhancer)
    return store
}
