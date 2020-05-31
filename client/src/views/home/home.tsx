import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Navigator, OpenData } from '@tarojs/components'
import styles from './home.module.scss'
import none from '../../assets/none.jpg'

export default class Home extends Component {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '我爱记工资'
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
                    {/* 没有记录 */}
                    <View className={styles.noneBox}>
                        <Image
                            mode="widthFix"
                            className={styles.noneJpg}
                            src={none}
                        />
                        <View className={styles.noneText}>
                            您还没有工资记录哦
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
