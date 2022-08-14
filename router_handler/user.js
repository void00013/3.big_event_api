const db = require('../db/index')
const bcrypt = require('bcryptjs')
// 导入生成token的包
const jwt = require('jsonwebtoken')
// 导入jwt配置对象
const config = require('../config')

exports.regUser = (req, res) => {
  const userinfo = req.body
  // if(!userinfo.username || !userinfo.password) {
  //   // return res.send({
  //   //   status: 1,
  //   //   message: '用户名或密码不能为空!'
  //   // })
  //   return res.cc('用户名或密码不能为空!')
  // }
  // 定义查询对应username的sql语句
  const sqlStr = 'select * from ev_users where username=?'
  db.query(sqlStr, userinfo.username, (err, results) => {
    if(err) {
      // return res.send({
      //   status: 1,
      //   message: err.message
      // })
      return res.cc(err)
    }
    if(results.length > 0) {
      // return res.send({
      //   status: 1,
      //   message: '用户名已被占用，请更换其他用户名'
      // })
      return res.cc('用户名已被占用，请更换其他用户名')
    }
    // 对密码进行加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    // 定义插入新用户的sql语句
    const sql = 'insert into ev_users set ?'
    db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
      if(err) {
        // return res.send({
        //   status: 1,
        //   message: err.message
        // })
        return res.cc(err)
      }
      if(results.affectedRows !== 1) {
        // return res.send({
        //   status: 1,
        //   message: '注册用户失败，请稍后再试！'
        // })
        return res.cc('注册用户失败，请稍后再试！')
      }
      // res.send({
      //   status: 0,
      //   message: '注册成功'
      // })
      return res.cc('注册成功', 0)
    })
  })
}

exports.login = (req, res) => {
  // 接收表单数据
  const userinfo = req.body
  const sql = 'select * from ev_users where username=?'
  db.query(sql, userinfo.username, (err, results) => {
    if(err) { return res.cc(err) }
    if(results.length !== 1) { return res.cc('请注册后再登录！') }
    // console.dir(results)
    // 判断密码是否正确
    const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
    if(!compareResult) { return res.cc('输入的密码错误，请重试！') }
    // 在服务器端生成token字符串
    const user = { ...results[0], password: '', user_pic: '' }
    // console.log(user)
    const token = jwt.sign(user, config.secret, { expiresIn: config.expiresIn })
    // console.log(token)
    res.send({
      status: 0,
      message: '登陆成功！',
      token: 'Bearer ' + token
    })
  })
}
