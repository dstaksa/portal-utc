const httpHandler = (res, response) => {
  return new Promise((resolve, reject) => {
    if(response.status === 401){
      res.redirect('/login')
    } else {
      resolve()    
    }
  })
}

export default httpHandler