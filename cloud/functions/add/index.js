// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    let { date, deserved, RealGain, remark } = event
    let openid = wxContext.OPENID

    return new Promise(resolve => {
        //先查询是否存在
        let db = cloud.database().collection('user')
        db.where({
            openid,
            date,
        })
            .get()
            .then(row => {
                if (row.data.length) {
                    //修改
                    db.doc(row.data[0]._id)
                        .update({
                            data: {
                                deserved,
                                RealGain,
                                remark,
                            },
                        })
                        .then(() => {
                            resolve()
                        })
                } else {
                    //添加一条数据
                    db.add({
                        data: {
                            openid,
                            date,
                            deserved,
                            RealGain,
                            remark,
                        },
                    }).then(res => {
                        resolve()
                    })
                }
            })
    })
}
