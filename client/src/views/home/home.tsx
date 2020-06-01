import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Navigator, OpenData } from '@tarojs/components'
import styles from './home.module.scss'
import none from '../../assets/none.jpg'
import * as echarts from '@/wxcomponents/ec-canvas/echarts.js'

export default class Home extends Component {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '我爱记工资',
        usingComponents: {
            'ec-canvas': '../../wxcomponents/ec-canvas/ec-canvas' // 书写第三方组件的相对路径
        }
    }

    state = {
        ecLine: {
            onInit: this.initLineChart
        }
    }

    initLineChart(canvas: any, width: number, height: number) {
        const chart = echarts.init(canvas, null, {
            width: width,
            height: height
        })
        canvas.setChart(chart)

        var option = {
            grid: {
                top: 30,
                left: 50,
                bottom: 30,
                right: 15
            },
            xAxis: {
                name: '月份',
                type: 'category',
                axisTick: {
                    alignWithLabel: true //名字与刻度线对齐
                },
                axisLabel: {
                    interval: 0 //强制显示所有的刻度
                },
                data: [
                    '一月',
                    '2月',
                    '3月',
                    '4月',
                    '5月',
                    '6月',
                    '7月',
                    '8月',
                    '9月',
                    '10月',
                    '11月',
                    '12月'
                ]
            },
            yAxis: {
                name: '元',
                type: 'value'
            },
            series: [
                {
                    data: [
                        5000,
                        6100,
                        8325,
                        7000,
                        4200,
                        5720,
                        5590,
                        5990,
                        6800,
                        9325,
                        6250,
                        5800
                    ],
                    type: 'line'
                }
            ]
        }
        chart.setOption(option)
        return chart
    }

    componentWillMount() {
        Taro.getSetting({
            success: function(res) {
                if (!res.authSetting['scope.userInfo']) {
                    Taro.authorize({
                        scope: 'scope.userInfo',
                        success: function() {
                            // 用户已经同意小程序使用录音功能，后续调用 Taro.startRecord 接口不会弹窗询问
                            Taro.getUserInfo({
                                success: function(res) {
                                    console.log(res)
                                }
                            })
                        }
                    })
                }
            }
        })
    }

    componentDidMount() {}

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    render() {
        return (
            <View className="home">
                {/* 头部 */}
                <View className={styles.header}>
                    <View className={[styles.info, 'divider-bottom'].join(' ')}>
                        {/* <Image
                            className={styles.avatar}
                            src="https://wework.qpic.cn/bizmail/iamP91D7fgE9Qwoy5o7NdRC2jichpoURDaIwRbK8oOCbSxfz9uT9kfeA/0"
                        /> */}
                        <OpenData
                            className={styles.avatar}
                            type="userAvatarUrl"
                        />

                        <View className={styles.right}>
                            {/* <Text className={styles.name}>张林</Text> */}
                            <OpenData
                                className={styles.name}
                                type="userNickName"
                            />
                        </View>
                        <Navigator
                            className={styles.history}
                            url="/views/add/add"
                            open-type="navigate"
                        >
                            添加工资
                        </Navigator>
                    </View>

                    <View className={styles['price-content']}>
                        <Text className={styles.label}>年度总收入</Text>
                        <Text className={styles.price}>￥100.00</Text>
                    </View>
                </View>

                {/* 图表 */}
                <View className={styles.container}>
                    {/* title */}
                    <View className={styles.title}>
                        <View
                            className={[
                                styles.solid,
                                styles['solid-left']
                            ].join(' ')}
                        ></View>
                        <Text>2020年收入统计</Text>
                        <View
                            className={[
                                styles.solid,
                                styles['solid-right']
                            ].join(' ')}
                        ></View>
                    </View>
                    {/* 折线图 */}
                    <View className={styles['container-line']}>
                        <ec-canvas
                            id="mychart-dom-line"
                            canvas-id="mychart-line"
                            ec={this.state.ecLine}
                        ></ec-canvas>
                    </View>
                    {/* 没有记录 */}
                    {/* <View className={styles.noneBox}>
                        <Image
                            mode="widthFix"
                            className={styles.noneJpg}
                            src={none}
                        />
                        <View className={styles.noneText}>
                            您还没有工资记录哦
                        </View>
                    </View> */}
                </View>
            </View>
        )
    }
}
