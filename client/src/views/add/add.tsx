import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import styles from './add.module.scss'

import BaseDatetimePicker from '@/components/BaseDatetimePicker/BaseDatetimePicker'
import { $_GetDateTime } from '@/units/index'

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'van-cell-group': any
            'van-cell': any
            'van-field': any
            'van-button': any
        }
    }
}

class Add extends Component {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '添加工资',
        usingComponents: {
            'van-cell-group': '../../wxcomponents/vant-weapp/cell-group/index',
            'van-cell': '../../wxcomponents/vant-weapp/cell/index',
            'van-field': '../../wxcomponents/vant-weapp/field/index',
            'van-button': '../../wxcomponents/vant-weapp/button/index'
        }
    }

    state = {
        show: false,
        date: $_GetDateTime(new Date(), 'Y-m'), //默认当前月
        deserved: '', //应发
        realGain: '', //实发
        remark: '' //备注
    }
    componentWillMount() {
        if (this.$router.preload && this.$router.preload.date) {
            Taro.setNavigationBarTitle({
                title: '修改工资'
            })
            this.setState(
                {
                    date: $_GetDateTime(
                        new Date(this.$router.preload.date),
                        'Y-m'
                    )
                },
                () => {
                    this.getData()
                }
            )
        }
    }

    //获取数据
    getData() {
        Taro.showLoading({
            title: '加载中',
            mask: true
        })
        //调用云函数
        Taro.cloud
            .callFunction({
                // 云函数名称
                name: 'getOne',
                data: {
                    date: this.$router.preload && this.$router.preload.date
                }
            })
            .then((res: any) => {
                Taro.hideLoading()
                this.setState({
                    deserved: res.result.deserved ? res.result.deserved : '',
                    realGain: res.result.realGain ? res.result.realGain : '',
                    remark: res.result.remark
                })
            })
    }

    //提交
    submit() {
        if (!this.state.date) {
            return Taro.showToast({
                title: '请选择日期',
                icon: 'none',
                duration: 2000
            })
        }
        if (!this.state.realGain) {
            return Taro.showToast({
                title: '请输入实发工资',
                icon: 'none',
                duration: 2000
            })
        } else if (Number(this.state.realGain) < 0) {
            return Taro.showToast({
                title: '实发工资必须大于0',
                icon: 'none',
                duration: 2000
            })
        } else if (Number(this.state.realGain) > 99999999) {
            return Taro.showToast({
                title: '实发工资必须小于1亿',
                icon: 'none',
                duration: 2000
            })
        }
        Taro.showLoading({
            title: '正在提交',
            mask: true
        })
        //调用云函数
        Taro.cloud
            .callFunction({
                // 云函数名称
                name: 'add',
                // 传给云函数的参数
                data: {
                    date: new Date(
                        this.state.date.replace(/-/, '/') + '/01'
                    ).getTime(), //时间存时间戳
                    deserved: Number(this.state.deserved),
                    realGain: Number(this.state.realGain),
                    remark: this.state.remark
                }
            })
            .then(() => {
                Taro.hideLoading()
                Taro.showToast({
                    title:
                        this.$router.preload && this.$router.preload.date
                            ? '修改成功'
                            : '添加成功',
                    icon: 'success',
                    duration: 2000,
                    complete: () => {
                        //回退
                        Taro.navigateBack()
                    }
                })
            })
    }

    //改变日期
    setDate() {
        if (this.$router.preload && this.$router.preload.date) return
        this.setState({
            show: true
        })
    }

    render() {
        return (
            <View className="add">
                <van-cell-group>
                    <van-cell
                        title="日期"
                        value={this.state.date ? this.state.date : '请选择'}
                        is-link={
                            this.$router.preload && this.$router.preload.date
                                ? false
                                : true
                        }
                        required
                        onClick={this.setDate.bind(this)}
                    />
                    <van-field
                        label="应发工资"
                        placeholder="请输入"
                        input-align="right"
                        type="digit"
                        value={this.state.deserved}
                        onChange={event => {
                            this.setState({
                                deserved: event.detail
                            })
                        }}
                    />
                    <van-field
                        label="实发工资"
                        required
                        placeholder="请输入"
                        input-align="right"
                        type="digit"
                        value={this.state.realGain}
                        onChange={event => {
                            this.setState({
                                realGain: event.detail
                            })
                        }}
                    />
                    <van-field
                        value={this.state.remark}
                        label="备注"
                        type="textarea"
                        placeholder="请输入"
                        border={false}
                        autosize={{ minHeight: 70 }}
                    />
                </van-cell-group>

                <View className={styles.btnBox}>
                    <van-button
                        type="info"
                        block
                        onClick={this.submit.bind(this)}
                    >
                        {this.$router.preload && this.$router.preload.date
                            ? '确认修改'
                            : '提交'}
                    </van-button>
                </View>

                <BaseDatetimePicker
                    type="year-month"
                    minDate={new Date('2018/01/01').getTime()}
                    maxDate={Date.now()}
                    show={this.state.show}
                    time={this.state.date as string}
                    onConfirm={time => {
                        this.setState({
                            date: time
                        })
                    }}
                    onInput={state => {
                        this.setState({
                            show: state
                        })
                    }}
                ></BaseDatetimePicker>
            </View>
        )
    }
}

export default Add
