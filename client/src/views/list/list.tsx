import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import styles from './list.module.scss'
import none from '../../assets/none.jpg'

//声明自定义组件
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'van-icon': {
                name: string
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
        navigationBarTitleText: '我的工资',
        usingComponents: {
            'van-icon': '../../wxcomponents/vant-weapp/icon/index' // 书写第三方组件的相对路径
        }
    }

    state = {
        list: []
    }

    componentDidShow() {
        this.getList()
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
                name: 'getAllList'
            })
            .then(res => {
                console.log(167, res)
                Taro.hideLoading()
                this.setState({
                    list: res.result
                })
            })
    }

    go(date: number) {
        //传参
        this.$preload({
            date
        })
        Taro.navigateTo({
            url: '/views/add/add'
        })
    }

    render() {
        interface Item {
            date: number
            realGain: number
        }
        let className = styles.list,
            noWrap
        if (this.state.list.length === 0) {
            className = styles.noList
            noWrap = (
                <View className={styles.noneBox}>
                    <Image
                        mode="widthFix"
                        className={styles.noneJpg}
                        src={none}
                    />
                    <View className={styles.noneText}>
                        您还没有工资记录哦,{' '}
                        <Text
                            className={styles.noneTextAdd}
                            onClick={() =>
                                Taro.navigateTo({
                                    url: '/views/add/add'
                                })
                            }
                        >
                            去添加
                        </Text>
                    </View>
                </View>
            )
        }
        return (
            <View className={className}>
                {this.state.list.map((item: Item) => {
                    let year = new Date(item.date).getFullYear()
                    let month = new Date(item.date).getMonth() + 1
                    return (
                        <View
                            key={item.date}
                            className={styles.item}
                            onClick={() => this.go(item.date)}
                        >
                            <View className={styles.label}>
                                {year}年{month}月
                            </View>
                            <View className={styles.value}>
                                {item.realGain}元
                            </View>
                            <van-icon name="arrow" />
                        </View>
                    )
                })}
                {noWrap}
            </View>
        )
    }
}
