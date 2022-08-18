const db = require('../db/index')

// 获取文章分类列表
exports.getArticleCates = (req, res) => {
  // is_delete为0表示没有被标记为删除的数据,order by子句 按id升序排列
  const sql = 'select * from ev_article_cate where is_delete=0 order by id asc'
  db.query(sql, (err, results) => {
    if(err) { return res.cc(err) }
    res.send({
      status: 0,
      message: '获取文章分类列表成功！',
      data: results
    })
  })
}

// 新增文章分类
exports.addArticleCates = (req, res) => {
  const sql = 'select * from ev_article_cate where name=? or alias=?'
  db.query(sql, [req.body.name, req.body.alias], (err, results) => {
    if(err) { return res.cc(err) }
    // 分类名称 和 分类别名 都被占用
    if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
    if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
    // 分类名称 或 分类别名 被占用
    if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
    if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
    const sql = 'insert into ev_article_cate set ?'
    db.query(sql, req.body, (err, results) => {
      if(err) { return res.cc(err) }
      if(results.affectedRows !== 1) { return res.cc('新增文章分类失败！') }
      res.cc('新增文章分类成功', 0)
    })
  })
}

// req.query 可以获取到查询字符串中的对象 ?...&...
// req.params 可以获取到动态参数的对象 :...
// req.body 可以获取到请求体中的对象

// 根据id删除文章分类(标记删除)
exports.deleteCateById = (req, res) => {
  const sql = 'update ev_article_cate set is_delete=1 where id=?'
  db.query(sql, req.params.id, (err, results) => {
    if(err) { return res.cc(err) }
    if(results.affectedRows !== 1) { return res.cc('删除文章分类失败！') }
    res.cc('删除文章分类成功！', 0)
  })
}

// 根据id获取文章分类数据
exports.getArtCateById = (req, res) => {
  const sql = 'select * from ev_article_cate where id=?'
  db.query(sql, req.params.id, (err, results) => {
    if(err) { return res.cc(err) }
    if(results.length !== 1) { return res.cc('获取文章分类数据失败！') }
    res.send({
      status: 0,
      message: '获取文章分类数据成功！',
      data: results[0]
    })
  })
}

// 根据id更新文章分类数据
exports.updateCateById = (req, res) => {
  const sql = 'select * from ev_article_cate where id<>? and (name=? or alias=?)'
  db.query(sql, [req.body.id, req.body.name, req.body.alias], (err, results) => {
    if(err) { return res.cc(err) }
    if(results.length === 2) { return res.cc('分类名称与别名都被占用，请更换后重试！') }
    if(results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) { return res.cc('分类名称与别名都被占用，请更换后重试！') }
    if(results.length === 1 && results[0].name === req.body.name) { return res.cc('分类名称被占用，请更换后重试！') }
    if(results.length === 1 && results[0].alias === req.body.alias) { return res.cc('分类别名被占用，请更换后重试！') }
    const sql = 'update ev_article_cate set ? where id=?'
    db.query(sql, [req.body, req.body.id], (err, results) => {
      if(err) { return res.cc(err) }
      if(results.affectedRows !== 1) { return res.cc('更新文章分类失败！') }
      res.cc('更新文章分类成功！', 0)
    })
  })
}
