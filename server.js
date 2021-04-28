let express = require("express")
let mongodb = require("mongodb")
let sanitizeHTML = require("sanitize-html")

let app = express()
let db

let port = process.env.PORT
if(port == null || port == ""){
  port = 3000
}
app.use(express.static('public'))

let connectionString = "mongodb+srv://todoAppUser:2duapuza@cluster0.vqnib.mongodb.net/todoApp?retryWrites=true&w=majority"
mongodb.connect(connectionString, {useNewUrlParser: true}, (err, client) =>{
  db = client.db()
  app.listen(port)
})
app.use(express.json())
app.use(express.urlencoded({extended: false}))

function pwdProtected(req, res, next){
  res.set('www-Authenticate', 'Basic realm="simple ToDo App"')
  console.log(req.headers.authorization);
  if(req.headers.authorization == "Basic dG9kb2FwcDppbmpz"){
    next()
  }else{
    res.status(401).send("inncorrect username and(or) password")
  }
}
app.use(pwdProtected)

app.get('/', (req, res) => {
  db.collection('items').find().toArray((err, items) =>{
    res.send(`
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple To-Do App</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
  </head>
  <body>
  <div class="container">
    <h1 class="display-4 text-center py-1">To-Do App</h1>

    <div class="jumbotron p-3 shadow-sm">
      <form id="create-form" action="/create-item" method="POST">
        <div class="d-flex align-items-center">
          <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
          <button class="btn btn-primary" type="submit">Add New Item</button>
        </div>
      </form>
    </div>

    <ul id="item-list" class="list-group pb-5">
    </ul>

  </div>
<script>
  let items = ${JSON.stringify(items)}
</script>

  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script src="/editDelete.js"></script>
  </body>
  </html>
      `)
  })

})

app.post('/create-item', (req, res) =>{
  //console.log(req.body.item);
  let safeText = sanitizeHTML(req.body.text, {allowedTags: [], alloweAttributes: {} })
  db.collection('items').insertOne({text: safeText}, (err, info) =>{
      res.json(info.ops[0])
  })
})

app.post('/update-item', (req, res) =>{
  let safeText = sanitizeHTML(req.body.text, {allowedTags: [], alloweAttributes: {} })
  db.collection('items').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, {$set:{text:safeText}},()=>{
    res.send("success")
  })
})

app.post('/delete-item', (req, res) =>{
  db.collection('items').deleteOne({_id: new mongodb.ObjectId(req.body.id)} ,()=>{
    res.send("success")
  })
})
//app.listen(3000)

//evil user
// <a href="#" onclick="(()=>{alert("evil lives here")})()"> click this</a>









//
// ${items.map((item)=>{
//     return `
//     <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
//       <span class="item-text">${item.text}</span>
//       <div>
//         <button data-id ="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
//         <button data-id ="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
//       </div>
//     </li>
//     `
// }).join('')}
