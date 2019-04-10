document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 2393 //Enter the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`

  const imgCard = document.getElementById('image_card')

  const commentForm = document.getElementById('comment_form')
  const commentSubmitBtn = document.getElementById('comment_submit')
  let commentInput = document.getElementById('comment_input')

  const commentsList = document.getElementById('comments')

  commentSubmitBtn.addEventListener('click', (ev) => {
    ev.preventDefault();

    let comment = commentInput.value

    createNewComment(comment)
  })

  function createNewComment(comment){
    console.log(comment)

    fetch(commentsURL, {
      method: 'POST',

      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({image_id: imageId, content: comment})
    }).then(res => res.json()).then(json => console.log(json))
    fetchImage(imageURL)
  }

  function fetchImage(url){
    fetch(url)
    .then(res => res.json())
    .then(json => renderImage(json))
  }

  function renderImage(data){

    commentInput.value = ""

    let img = document.getElementById('image')
    let title = document.getElementById('name')
    let likesSpan = document.getElementById('likes')
    let likeBtn = document.getElementById('like_button')

    likeBtn.addEventListener('click', () => {
      likeFunction()
    })

    name.textContent = data.name
    img.src = data.url
    likesSpan.textContent = data.like_count

    renderComments(data)
  }

  function deleteBtn(){

  }

  function likeFunction(){
    fetch(likeURL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({image_id: imageId})
    })
    fetchImage(imageURL)
  }

  function renderComments(data){
    while(commentsList.firstChild){
      commentsList.firstChild.remove()
    }
    let comments = data.comments
    comments.forEach(comment => {
      let li = document.createElement('li')
      li.id = comment.id
      let deleteBtn = document.createElement('button')
      deleteBtn.textContent = "Delete"
      deleteBtn.id = comment.id

      deleteBtn.addEventListener('click', () => {
        deleteBtnFunction(deleteBtn)
      })
      li.textContent = comment.content
      li.appendChild(deleteBtn)
      commentsList.appendChild(li)
    })
  }

  function deleteBtnFunction(deleteBtn){
    let commentToDelete = document.getElementById(deleteBtn.id)
    fetch(commentsURL+`${commentToDelete}`, {
      method: 'DELETE',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    fetchImage(imageURL)
  }


  fetchImage(imageURL)
})
