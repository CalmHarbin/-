import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Navigator, OpenData } from '@tarojs/components'
import styles from './home.module.scss'
import none from '../../assets/none.jpg'
// import * as echarts from '@/wxcomponents/ec-canvas/echarts.js'
import * as echarts from '../../wxcomponents/ec-canvas/echarts.js' //此处用相对路径,以免保存不是模块
import { $_GetDateTime, $_deepCompare } from '@/units/index'
import BaseActionsheet from '@/components/BaseActionsheet/BaseActionsheet'

//声明自定义组件, 如果很多地方用,写到global.d.ts中去
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'ec-canvas': {
                id: string
                'canvas-id': string
                ec: any
            }
        }
    }
}

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
            // onInit: this.initLineChart,
            lazyLoad: true // 延迟加载
        },
        list: [],
        total: 0, //总收入
        columns: [], //年份选择
        index: 0, //当前选中年份
        show: false,
        canvasUrl: ''
    }

    //首次加载触发
    componentDidMount() {
        let columns: number[] = []
        let curYear = new Date().getFullYear()
        for (let i = 2018; i <= curYear; i++) {
            columns.push(i)
        }
        this.setState(
            {
                columns,
                index: columns.length - 1
            },
            () => {
                this.getList()
            }
        )
    }

    //页面显示时触发
    componentDidShow() {
        if (this.state.columns.length === 0) return
        //查询数据
        this.getList()
    }

    // 折线图
    initLineChart(canvas: any, width: number, height: number, dpr: number) {
        // const res = Taro.getSystemInfoSync()
        // res.pixelRatio

        const chart = echarts.init(canvas, null, {
            devicePixelRatio: dpr,
            width: width,
            height: height
        })

        interface row {
            date: Date
            realGain: number
        }

        canvas.setChart(chart)
        var option = {
            tooltip: {
                show: true,
                trigger: 'axis',
                formatter: '{b}: {c}元'
            },
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
                    interval: 0, //强制显示所有的刻度
                    fontSize: 13
                },
                // data: ['1月', '2月', '3月', '4月', '5月', '6月']
                data: this.state.list.map((item: row) => {
                    return `${$_GetDateTime(new Date(item.date), 'm')}月`
                })
            },
            yAxis: {
                name: '元',
                type: 'value',
                axisLabel: {
                    fontSize: 13
                }
                // scale: true //不强制显示0
            },
            // legend: {
            //     data: ['账单'], //跟下面的name对应
            //     show: true, //写成false不行
            //     left: -1000 //为了隐藏
            // },
            series: [
                {
                    name: '账单',
                    // data: [5000, 6100, 8325, 7000, 4200, 5720],
                    data: this.state.list.map((item: row) => {
                        return item.realGain
                    }),
                    type: 'line',
                    label: {
                        normal: {
                            rich: {}
                        }
                    },
                    color: ['#ff5656']
                },
                {
                    name: '账单',
                    type: 'bar',
                    barMaxWidth: 50,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true, //开启显示
                                position: 'top', //在上方显示
                                textStyle: {
                                    //数值样式
                                    color: 'black',
                                    fontSize: 16
                                }
                            }
                        }
                    },
                    // data: [5000, 6100, 8325, 7000, 4200, 5720],
                    data: this.state.list.map((item: row) => {
                        return item.realGain
                    }),
                    color: ['#3398DB']
                }
            ]
        }

        chart.setOption(option)

        setTimeout(this.save.bind(this), 1000)
        return chart
    }
    //获取canvas的图片地址
    save() {
        const ecComponent = this.$scope.selectComponent('#mychart-dom-line')
        ecComponent.canvasToTempFilePath({
            success: res => {
                this.setState({
                    canvasUrl: res.tempFilePath
                })
            }
        })
    }

    getList() {
        Taro.showLoading({
            title: '加载中',
            mask: true
        })
        //调用云函数
        Taro.cloud
            .callFunction({
                // 云函数名称
                name: 'getList',
                // 传给云函数的参数
                data: {
                    startTime: new Date(
                        `${this.state.columns[this.state.index]}/01/01 00:00:00`
                    ).getTime(),
                    endTime: new Date(
                        `${this.state.columns[this.state.index]}/12/31 23:59:59`
                    ).getTime()
                }
            })
            .then(res => {
                Taro.hideLoading()
                // 如果数据没有变化则不重新绘图
                if ($_deepCompare(this.state.list, res.result)) return
                if ((res.result as any[]).length) {
                    let total = 0
                    for (let item of res.result as any[]) {
                        total += item.realGain
                    }
                    this.setState(
                        {
                            list: res.result,
                            total: total
                        },
                        () => {
                            //实例化图标
                            this.$scope
                                .selectComponent('#mychart-dom-line')
                                .init(this.initLineChart.bind(this))
                        }
                    )
                } else {
                    this.setState({
                        list: [],
                        total: 0
                    })
                }
            })
    }

    render() {
        let content
        if (this.state.list.length) {
            // 图表
            content = (
                <View className={styles['container-line']}>
                    <View
                        className={this.state.show ? styles.show : styles.hide}
                    >
                        <Image
                            mode="widthFix"
                            className={styles.canvasUrl}
                            src={this.state.canvasUrl}
                        />
                    </View>

                    <View
                        className={
                            this.state.show
                                ? [styles.hide, styles['container-line']].join(
                                      ' '
                                  )
                                : [styles.show, styles['container-line']].join(
                                      ' '
                                  )
                        }
                    >
                        <ec-canvas
                            id="mychart-dom-line"
                            canvas-id="mychart-line"
                            ec={this.state.ecLine}
                        ></ec-canvas>
                    </View>
                </View>
            )
        } else {
            content = (
                <View className={styles.noneBox}>
                    <Image
                        mode="widthFix"
                        className={styles.noneJpg}
                        src={none}
                    />
                    <View className={styles.noneText}>您还没有工资记录哦</View>
                </View>
            )
        }

        return (
            <View className="home">
                {/* 头部 */}
                <View className={styles.header}>
                    <View className={[styles.info, 'divider-bottom'].join(' ')}>
                        {/* <Image
                            className={styles.avatar}
                            src="https://wework.qpic.cn/bizmail/iamP91D7fgE9Qwoy5o7NdRC2jichpoURDaIwRbK8oOCbSxfz9uT9kfeA/0"
                        /> */}
                        <View
                            className={styles['avatar-box']}
                            onClick={() =>
                                Taro.navigateTo({
                                    url: '/views/list/list'
                                })
                            }
                        >
                            <OpenData
                                className={styles.avatar}
                                type="userAvatarUrl"
                            />
                        </View>

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
                        <Text className={styles.price}>
                            ￥{this.state.total}
                        </Text>
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
                        <Text
                            onClick={() => {
                                this.setState({
                                    show: true
                                })
                            }}
                        >
                            {this.state.columns[this.state.index]}年收入统计
                        </Text>
                        <View
                            className={[
                                styles.solid,
                                styles['solid-right']
                            ].join(' ')}
                        ></View>
                    </View>
                    {content}
                </View>
                {/* 年份选择 */}
                <BaseActionsheet
                    show={this.state.show}
                    columns={this.state.columns}
                    default_index={this.state.index}
                    onConfirm={(_value, index) => {
                        this.setState(
                            {
                                index: index
                            },
                            () => {
                                this.getList()
                            }
                        )
                    }}
                    onInput={state => {
                        this.setState({
                            show: state
                        })
                    }}
                />
            </View>
        )
    }
}
