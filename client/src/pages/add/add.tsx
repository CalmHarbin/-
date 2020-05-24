import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import styles from "./add.module.scss";

import BaseDatetimePicker from "../../components/BaseDatetimePicker/BaseDatetimePicker";

export default class Add extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: "添加",
    usingComponents: {
      "van-cell-group": "/wxcomponents/vant-weapp/cell-group/index",
      "van-cell": "/wxcomponents/vant-weapp/cell/index",
      "van-field": "/wxcomponents/vant-weapp/field/index",
    },
  };
  constructor() {
    super(...arguments);
    this.state = {
      show: false,
      date: "",
      deserved: "", //应发
      RealGain: "", //实发
    };
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <View className="add">
        <van-cell-group>
          <van-cell
            title="单元格"
            value={this.state.date ? this.state.date : "请选择"}
            is-link
            onClick={() => {
              this.setState({
                show: true,
              });
            }}
          />
          <van-field
            label="应发工资"
            placeholder="请输入"
            input-align="right"
            type="digit"
            value={this.state.deserved}
            onChange={(event) => {
              this.setState({
                deserved: event.detail,
              });
            }}
          />
          <van-field
            label="实发工资"
            placeholder="请输入"
            input-align="right"
            type="digit"
            value={this.state.RealGain}
            onChange={(event) => {
              this.setState({
                RealGain: event.detail,
              });
            }}
          />
        </van-cell-group>

        <BaseDatetimePicker
          type="year-month"
          minDate={new Date("2018/01/01").getTime()}
          maxDate={Date.now()}
          show={this.state.show}
          time={this.state.date}
          onConfirm={(time) => {
            this.setState({
              date: time,
            });
          }}
          onInput={(state) => {
            this.setState({
              show: state,
            });
          }}
        ></BaseDatetimePicker>
      </View>
    );
  }
}
