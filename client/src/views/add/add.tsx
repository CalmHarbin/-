import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import styles from './add.module.scss'

import BaseDatetimePicker from '@/components/BaseDatetimePicker/BaseDatetimePicker'
import { $_GetDateTime } from '@/units/index'

export default class Add extends Component {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '添加',
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
        RealGain: '', //实发
        remark: '' //备注
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
        if (!this.state.RealGain) {
            return Taro.showToast({
                title: '请输入实发工资',
                icon: 'none',
                duration: 2000
            })
        } else if (Number(this.state.RealGain) < 0) {
            return Taro.showToast({
                title: '实发工资必须大于0',
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
                        this.state.date.replace(/-/, '/') + '-01'
                    ).getTime(), //时间存时间戳
                    deserved: this.state.deserved,
                    RealGain: this.state.RealGain,
                    remark: this.state.remark
                }
            })
            .then(() => {
                Taro.hideLoading()
                Taro.showToast({
                    title: '添加成功',
                    icon: 'success',
                    duration: 2000,
                    complete: () => {
                        //回退
                        Taro.navigateBack()
                    }
                })
            })
    }

    render() {
        return (
            <View className="add">
                <van-cell-group>
                    <van-cell
                        title="日期"
                        value={this.state.date ? this.state.date : '请选择'}
                        is-link
                        required
                        onClick={() => {
                            this.setState({
                                show: true
                            })
                        }}
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
                        value={this.state.RealGain}
                        onChange={event => {
                            this.setState({
                                RealGain: event.detail
                            })
                        }}
                    />
                    <van-field
                        value={this.state.remark}
                        label="备注"
                        type="textarea"
                        placeholder="请输入"
                        autosize
                        border={false}
                    />
                </van-cell-group>

                <View className={styles.btnBox}>
                    <van-button
                        type="info"
                        block
                        onClick={this.submit.bind(this)}
                    >
                        提交
                    </van-button>
                </View>

                <BaseDatetimePicker
                    type="year-month"
                    minDate={new Date('2018/01/01').getTime()}
                    maxDate={Date.now()}
                    show={this.state.show}
                    time={this.state.date}
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
