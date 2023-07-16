export default handler => (req, res) => handler(req, res)
  .then(result => res.json(result))
  .catch(error => {
    res.status(error.statusCode || 500).json({ errorMessage: error.message })
  })
