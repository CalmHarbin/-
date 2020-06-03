// 云函数入口文件
const cloud = require("wx-server-sdk")

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    let openid = wxContext.OPENID
    return new Promise((resolve) => {
        let db = cloud.database()

        db.collection("user")
            .where({
                openid: openid,
            })
            .orderBy("date", "desc")
            .get()
            .then((rows) => {
                resolve(rows.data)
            })
    })
}
