export const query =  (req, res, sql, columnMapper, selector) => {
  let { page=1, size=20, order='desc', orderBy='id', column, keyword } = req.query;
  if(columnMapper){
    orderBy = columnMapper(orderBy);
    column = columnMapper(column);
  }

  if(column && keyword){
    sql.where(column, 'LIKE', `%${keyword}%`)
  }

  if(selector) sql.where(selector);

  if(page){
    sql.limit(size);
    sql.offset((page-1)*size)
  }

  if(order){
    sql.orderBy(orderBy, order)
  }
  
  return sql
}

export const total = (req, res, sql, selector) => {
  return new Promise(async resolve => {
    let { page, column, keyword } = req.query; 
    if(page){
      let _sql = sql.count('* as count')
      if(selector) _sql.where(selector);
      let total = await (column && keyword ? _sql.where(column, 'LIKE', `%${keyword}%`).first() : _sql.first());
      res.set('x-pagination-count', total.count);
      resolve(total.count);
    } else resolve();
  })
}