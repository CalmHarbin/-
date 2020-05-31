const ADD = 'ADD'
const MINUS = 'MINUS'

let STATE = {
    num: 0
}

//导出module,名字需要和文件名保持一致
export const test = (state = STATE, action: { type: any }) => {
    switch (action.type) {
        case ADD:
            return {
                ...state,
                num: state.num + 1
            }
        case MINUS:
            return {
                ...state,
                num: state.num - 1
            }
        default:
            return state
    }
}

export const add = () => {
    return {
        type: ADD
    }
}
export const minus = () => {
    return {
        type: MINUS
    }
}

// 异步的action
export const asyncAdd = () => dispatch => {
    setTimeout(() => {
        dispatch(add())
    }, 2000)
}
