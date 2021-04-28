function itemTemplate(item){
  return`
  <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button data-id ="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id ="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>
  `
}
//_____ create feature
let createField = document.getElementById("create-field")
document.getElementById("create-form").addEventListener("submit", (e)=>{
  e.preventDefault()
  axios.post('/create-item', {text: createField.value}).then((response)=>{
    //html for a new item
    document.getElementById("item-list").insertAdjacentHTML("beforeend", itemTemplate(response.data))
    createField.value = ""
    createField.focus()
  }).catch(()=>{
    console.log("please try again later");
  })
})

//initial page load render
let ourHtml = items.map((item)=>{
  return itemTemplate(item)
}).join('')
document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHtml)


document.addEventListener("click", (e) =>{
//______ delete feature
  if(e.target.classList.contains("delete-me")){
    if(confirm("do you want to delete this item")){
      axios.post('/delete-item', {id: e.target.getAttribute("data-id")}).then(()=>{
        e.target.parentElement.parentElement.remove()
      }).catch(()=>{
        console.log("please try again later");
      })
    }
  }


  //______ update feature
  if(e.target.classList.contains("edit-me")){
    let userInput = prompt("edit text", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
    if(userInput){
      axios.post('/update-item', {text: userInput, id: e.target.getAttribute("data-id")}).then(()=>{
        e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
      }).catch(()=>{
        console.log("please try again later");
      })
    }
  }
})
