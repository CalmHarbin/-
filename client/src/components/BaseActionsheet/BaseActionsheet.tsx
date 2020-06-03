import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'

export default class Login extends Component {
    static defaultProps = {
        show: false,
        title: '选择时间',
        columns: [],
        default_index: 0,
        onInput: Function,
        onConfirm: Function
    }

    config: Config = {
        usingComponents: {
            'van-popup': '../../wxcomponents/vant-weapp/popup/index',
            'van-picker': '../../wxcomponents/vant-weapp/picker/index'
        }
    }

    state = {
        index: 0
    }

    componentWillMount() {
        this.update()
    }
    update() {
        console.log(this.props.default_index)
        this.setState({
            index: this.props.default_index
        })
    }
    /**
     * 确定
     * @method onConfirm
     * @param { Date } value 选中的时间
     * @return { String } 格式化后的结果
     */
    onConfirm(event) {
        let { value, index } = event.detail
        //关闭弹出层
        this.props.onInput(false)
        this.props.onConfirm(value, index)
    }
    /**
     * 取消选择
     * @method cancel
     * @return { undefined }
     */
    cancel() {
        this.props.onInput(false)
    }

    render() {
        return (
            <View className="DatetimePicker">
                <van-popup
                    show={this.state.show}
                    position="bottom"
                    onClose={this.cancel.bind(this)}
                    onBefore-enter={this.update}
                >
                    <van-picker
                        ref="picker"
                        show-toolbar
                        title={this.props.title}
                        default-index={this.state.index}
                        columns={this.props.columns}
                        onConfirm={this.onConfirm.bind(this)}
                        onCancel={this.cancel.bind(this)}
                    />
                </van-popup>
            </View>
        )
    }
}
