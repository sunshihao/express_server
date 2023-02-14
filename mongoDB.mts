/** mongoDB */
const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://82.157.139.89/:27017/animals', (err, client) => {
  if (err) throw err

  const db = client.db('animals')

  db.collection('mammals').find().toArray((err, result) => {
    if (err) throw err

    console.log(result)
  })
})