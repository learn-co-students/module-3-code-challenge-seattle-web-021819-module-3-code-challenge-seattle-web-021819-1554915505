const likeURL = `https://randopic.herokuapp.com/likes/`
const commentsURL = `https://randopic.herokuapp.com/comments/`

document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')
  let imageId = 2394 //Enter the id from the fetched image here
  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  fetch(imageURL)
    .then(response => response.json())
    .then(data => {addImage(data)})
})

function addImage(data){
  let {url, name, like_count, id} = data
  let image = document.getElementById('image')
  let h4Name = document.getElementById('name')
  let spanLike = document.getElementById('likes')
  let likeButton = document.getElementById('like_button')

  image.src = url
  h4Name.textContent = name
  spanLike.textContent = like_count

  likeButton.addEventListener('click', () => {
    like_count = parseInt(like_count) + 1
    spanLike.textContent = like_count
    addLikes(id)
  })

  getComments(data)
}

function addLikes(id) {
  let config = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({image_id: (id)})
  }
  fetch(likeURL, config)
    .then(response => response.json())
    // .then(data => {'Likes: ' + console.log(data)})
}

function getComments(data){
  let comments = data.comments
  comments.forEach(comment =>{
    addComments(comment)
  })
}

function addComments(comment) {
  let ul = document.getElementById('comments')
  let li = document.createElement('li')
  let form = document.getElementById('comment_form')
  let {id, content, image_id} = comment

  li.id = `li-${id}`
  li.textContent = content
  ul.appendChild(li)

  deleteButton(id)

  form.addEventListener('submit', (ev) => {
    ev.preventDefault()
    newComment(image_id)
  })
}

function deleteButton(id){
  let li = document.getElementById(`li-${id}`)
  let dButton = document.createElement('button')
  dButton.textContent = 'Delete'

  dButton.addEventListener('click', () => {
    fetchDelete(id)
  })
  li.appendChild(dButton)

}

function newComment(image_id) {
  let ul1 = document.getElementById('comments')
  let newContentId = document.getElementById('comment_input')
  let newContent = newContentId.value
  let newLi = document.createElement('li')
  let newDButton = document.createElement('button')
  newLi.textContent = newContent
  newContentId.setAttribute('onfocus', "this.value=''")
  ul1.appendChild(newLi)

  let config = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_id: image_id,
      content: newContent
    })
  }
  fetch(commentsURL, config)
    .then(response => response.json())
    .then(data => {newLi.id = data.id})

  deleteButton(newLi.id)
}

function fetchDelete(id){
  let deleteURL = 'commentsURL + `/${id}`'
  let deleteLi = document.getElementById(`li-${id}`)
  deleteLi.remove()
  let config = {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }
  fetch(deleteURL, config)
}
