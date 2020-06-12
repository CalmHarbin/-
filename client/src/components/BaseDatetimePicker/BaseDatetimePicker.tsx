import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'

//声明自定义组件
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'van-popup': {
                children?: Element
                show: boolean
                position: string
                onClose: () => void
                'onBefore-enter': () => void
            }
            'van-datetime-picker': any
        }
    }
}

//声明 props
type PropsType = {
    show: boolean
    title?: string
    type?: string
    time: string
    minDate?: number
    maxDate?: number
    minHour?: number
    maxHour?: number
    minMinute?: number
    maxMinute?: number
    onInput: (state: boolean) => void
    onConfirm: (time: string) => void
}

//声明 state
type StateType = {
    formatter_time: string | null
    currentDate: number
}

interface BaseDatetimePicker {
    props: PropsType
    state: StateType
}

class BaseDatetimePicker extends Component {
    static defaultProps = {
        show: false,
        title: '选择时间',
        type: 'datetime',
        minDate: new Date('2010/01/01 00:00:00').getTime(),
        maxDate: new Date('2036/12/31 23:59:59').getTime(),
        minHour: 0,
        maxHour: 23,
        minMinute: 0,
        maxMinute: 59,
        onInput: Function,
        onConfirm: Function
    }
    constructor() {
        super(...arguments)
        this.state = {
            formatter_time: null,
            currentDate: new Date().getTime()
        }
        this.update = this.update.bind(this)
    }

    config: Config = {
        usingComponents: {
            'van-popup': '../../wxcomponents/vant-weapp/popup/index',
            'van-datetime-picker':
                '../../wxcomponents/vant-weapp/datetime-picker/index'
        }
    }

    componentWillMount() {
        this.update()
    }

    componentDidMount() {}

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    update() {
        let formatter_time, currentDate

        if (this.props.time === '') {
            formatter_time = this.GetDateTime(new Date(), 'Y/m/d h:i:s')
            currentDate = Date.now() //默认当前时间
        } else {
            formatter_time = this.props.time.replace(/-/g, '/') //防止格式不统一  2019-12-12  和 2019/12/12
            //这里得判断下值,ios传入年月  new Date('2020/01').getTime() 会得到NAN
            if (this.props.type === 'year-month') {
                currentDate = new Date(formatter_time + '/01').getTime() //将时间转一下格式
            } else {
                currentDate = new Date(formatter_time).getTime() //将时间转一下格式
            }
        }

        this.setState({
            formatter_time,
            currentDate
        })
    }
    /**
     * 确定
     * @method onConfirm
     * @param { Date } value 选中的时间
     * @return { String } 格式化后的结果
     */
    onConfirm(event) {
        let value = event.detail
        //返回格式化的时间
        let formatTime
        if (this.props.type === 'datetime') {
            formatTime = this.GetDateTime(value, 'Y-m-d h:i')
        } else if (this.props.type === 'date') {
            formatTime = this.GetDateTime(value, 'Y-m-d')
        } else if (this.props.type === 'year-month') {
            formatTime = this.GetDateTime(value, 'Y-m')
        } else if (this.props.type === 'time') {
            formatTime = value
        }
        //关闭弹出层
        this.props.onInput(false)
        this.props.onConfirm(formatTime)
    }
    /**
     * 取消选择
     * @method cancel
     * @return { undefined }
     */
    cancel() {
        this.props.onInput(false)
    }

    /**
     * vant时间格式化
     * @method formatter
     * @return { undefined }
     */
    formatter(type, value) {
        if (type === 'year') {
            return `${value}年`
        } else if (type === 'month') {
            return `${value}月`
        } else if (type === 'day') {
            return `${value}日`
        } else if (type === 'hour') {
            return `${value}时`
        } else if (type === 'minute') {
            return `${value}分`
        }
        return value
    }

    /**
     * 格式化时间
     * @method GetDateTime
     * @param { Date } 时间对象
     * @param { String } 格式化格式   例如 'Y-m-d h:i:s'
     * @return { String } 格式化后的结果
     */
    GetDateTime(dateObj, format) {
        if (dateObj) {
            if (typeof dateObj === 'string') {
                let tempIndex = dateObj.lastIndexOf('.')
                if (tempIndex > -1) {
                    dateObj = dateObj.substring(0, tempIndex)
                }

                dateObj = dateObj.replace('T', ' ').replace(/-/g, '/')
            }
            let date = new Date(dateObj)

            let obj = {
                y: date.getFullYear(),
                m: date.getMonth() + 1,
                d: date.getDate(),
                h: date.getHours(),
                min: date.getMinutes(),
                s: date.getSeconds()
            }
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    let element = obj[key]
                    obj[key] = element < 10 ? '0' + element : element
                }
            }
            if (format) {
                return format
                    .replace('Y', obj.y)
                    .replace('m', obj.m)
                    .replace('d', obj.d)
                    .replace('h', obj.h)
                    .replace('i', obj.min)
                    .replace('s', obj.s)
            }

            return (
                obj.y +
                '-' +
                obj.m +
                '-' +
                obj.d +
                ' ' +
                obj.h +
                ':' +
                obj.min +
                ':' +
                obj.s
            ) //返回时间格式
        } else return ''
    }

    render() {
        return (
            <View className="DatetimePicker">
                <van-popup
                    show={this.props.show}
                    position="bottom"
                    onClose={this.cancel.bind(this)}
                    onBefore-enter={this.update}
                >
                    <van-datetime-picker
                        value={this.state.currentDate}
                        ref="datetime"
                        type={this.props.type}
                        title={this.props.title}
                        min-date={this.props.minDate}
                        max-date={this.props.maxDate}
                        min-hour={this.props.minHour}
                        max-hour={this.props.maxHour}
                        min-minute={this.props.minMinute}
                        max-minute={this.props.maxMinute}
                        formatter={(type, value) => {
                            if (type === 'year') {
                                return `${value}年`
                            } else if (type === 'month') {
                                return `${value}月`
                            } else if (type === 'day') {
                                return `${value}日`
                            } else if (type === 'hour') {
                                return `${value}时`
                            } else if (type === 'minute') {
                                return `${value}分`
                            }
                            return value
                        }}
                        onConfirm={this.onConfirm.bind(this)}
                        onCancel={this.cancel.bind(this)}
                    />
                </van-popup>
            </View>
        )
    }
}

export default BaseDatetimePicker
