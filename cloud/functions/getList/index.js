// 云函数入口文件
const cloud = require("wx-server-sdk")

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    let openid = wxContext.OPENID
    let { startTime, endTime } = event
    return new Promise((resolve) => {
        let db = cloud.database()
        const _ = db.command
        db.collection("user")
            .where({
                openid: openid,
                date: _.gt(startTime).and(_.lt(endTime)),
            })
            .orderBy("date", "asc")
            .get()
            .then((rows) => {
                resolve(rows.data)
            })
    })
}
