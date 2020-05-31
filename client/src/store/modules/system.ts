const ADD_CANCELTOKEN = 'SET_CANCELTOKEN'
const REMOVE_CANCELTOKEN = 'REMOVE_CANCELTOKEN'
const SET_LOADING = 'SET_LOADING'
const SET_USER = 'SET_USER'

let STATE = {
    cancelToken: [],
    isLoading: false, //是否显示loading,用于防止loading消失过快
    userInfo: null //用户基本信息
}

//导出module,名字需要和文件名保持一致
export const system = (state = STATE, action: { type: any; payload?: any }) => {
    switch (action.type) {
        //添加一个请求
        case ADD_CANCELTOKEN:
            return {
                ...state,
                cancelToken: [...state.cancelToken, action.payload]
            }
        //清空请求,同时全部取消掉
        case REMOVE_CANCELTOKEN:
            return {
                ...state,
                cancelToken: []
            }
        //设置loading
        case SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            }
        //改变用户基本信息
        case SET_USER:
            return {
                ...state,
                userInfo: action.payload
            }
        default:
            return state
    }
}

export const addCancelToken = () => (payload: string) => {
    return {
        type: ADD_CANCELTOKEN,
        payload
    }
}

export const removeCancelToken = () => () => {
    return {
        type: REMOVE_CANCELTOKEN
    }
}

export const setLoading = () => (payload: boolean) => {
    return {
        type: SET_LOADING,
        payload
    }
}

export const setUser = () => (payload: any) => {
    return {
        type: ADD_CANCELTOKEN,
        payload
    }
}
