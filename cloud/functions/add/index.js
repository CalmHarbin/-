// 云函数入口文件
const cloud = require("wx-server-sdk")

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    let { date, deserved, realGain, remark } = event
    let openid = wxContext.OPENID

    return new Promise((resolve) => {
        //先查询是否存在
        let db = cloud.database()
        let collection = db.collection("user")
        collection
            .where({
                openid,
                date,
            })
            .get()
            .then((row) => {
                if (row.data.length) {
                    //修改
                    collection
                        .doc(row.data[0]._id)
                        .update({
                            data: {
                                deserved,
                                realGain,
                                remark,
                            },
                        })
                        .then(() => {
                            resolve()
                        })
                } else {
                    //添加一条数据
                    collection
                        .add({
                            data: {
                                openid,
                                date,
                                deserved,
                                realGain,
                                remark,
                            },
                        })
                        .then((res) => {
                            resolve()
                        })
                }
            })
    })
}
