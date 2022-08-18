const db = require('../db/index')
const bcrypt = require('bcryptjs')

exports.getUserInfo = (req, res) => {
  const sql = 'select id, username, nickname, email, user_pic from ev_users where id=?'
  // console.log(req.auth)
  // expressjwt中间件解析token后把解析后的信息对象挂载在请求对象req的auth属性上
  db.query(sql, req.auth.id, (err, results) => {
    if(err) { return res.cc(err) }
    if(results.length !== 1) { return res.cc('获取用户信息失败！') }
    res.send({
      status: 0,
      message: '获取用户信息成功！',
      data: results[0]
    })
  })
}

exports.updateUserInfo = (req, res) => {
  const sql = 'update ev_users set ? where id=?'
  db.query(sql, [req.body, req.body.id], (err, results) => {
    if(err) { return res.cc(err) }
    if(results.affectedRows !== 1) { return res.cc('修改用户信息失败！') }
    res.cc('修改用户信息成功！', 0)
  })
}

exports.updatePassword = (req, res) => {
  let { oldPwd, newPwd } = req.body
  const sqlStr = 'select password from ev_users where id=?'
  db.query(sqlStr, req.auth.id, (err, results) => {
    if(err) { return res.cc(err) }
    if(results.length !== 1) { return res.cc('用户不存在！') }
    // console.log(results[0].password)
    // 判断提交的旧密码是否正确
    const compareResult = bcrypt.compareSync(oldPwd, results[0].password)
    if(!compareResult) { return res.cc('原密码错误！') }
    // 对新密码进行加密
    newPwd = bcrypt.hashSync(newPwd, 10)
    // 更新密码
    const sql = 'update ev_users set password=? where id=?'
    db.query(sql, [newPwd, req.auth.id], (err, results) => {
      if(err) { return res.cc(err) }
      if(results.affectedRows !== 1) { return res.cc('修改密码失败！') }
      res.cc('修改密码成功！', 0)
    })
  })
}

exports.updateAvatar = (req, res) => {
  const sql = 'update ev_users set user_pic=? where id=?'
  db.query(sql, [req.body.avatar, req.auth.id], (err, results) => {
    if(err) { return res.cc(err) }
    if(results.affectedRows !== 1) { return res.cc('修改头像失败！') }
    res.cc('修改头像成功！', 0)
  })
}
