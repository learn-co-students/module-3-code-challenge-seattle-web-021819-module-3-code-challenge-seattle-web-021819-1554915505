document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')
  const likeURL = `https://randopic.herokuapp.com/likes/`
  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
  getImage(imageURL)
  addClickability(likeURL)
  getLikes(imageURL)
  submitFunctionality()
  getComments(imageURL)
})

const imageId = 2382 //id from my specific image
const commentsURL = `https://randopic.herokuapp.com/comments/`

function getImage(url){
  fetch(url)
    .then(resp => resp.json())
    .then(data => {
      //console.log(data.url)
      renderImage(data.url)
    })
}

function renderImage(imgUrl){
  let imgTag = document.getElementById('image')
  imgTag.src = imgUrl
}

function addClickability(likeURL){
  let button = document.getElementById('like_button')
  button.addEventListener('click', (ev) => {
    ev.preventDefault()
    //console.log('clicked!')
    increaseLikes(likeURL)
  })
}

function getLikes(url){
  fetch(url)
    .then(resp => resp.json())
    .then(data => {
      //console.log(data.like_count)
      renderLikes(data.like_count)
    })
}

function renderLikes(count){
  let likes = document.getElementById('likes')
  likes.textContent = count
}

function increaseLikes(likeURL){
  let likes = document.getElementById('likes')
  let updatedLikes = likes.textContent++ //increase backend count and front
  //likes.textContent++ //front end update
  let config = {
    method: 'POST',
    headers: {'Accept': 'application/json',
              'Content-Type': 'application/json'},
    body: JSON.stringify({image_id: imageId, like_count: updatedLikes})
  }

  fetch(likeURL, config) //back end
    .then(resp => resp.json())
    .then(data => {
      console.log(data)
    })
}

function getComments(imageURL){
  fetch(imageURL)
   .then(resp => resp.json())
   .then(data => {
     console.log(data)
     let commentsArray = data.comments
     renderComments(commentsArray)
   })
}

function renderComments(commentsArray){
  let ul = document.getElementById('comments')
  commentsArray.forEach(function(object){
    let li = document.createElement('li')
    li.textContent = object.content
    ul.appendChild(li)
  })
}

function submitFunctionality(){
  let submit = document.getElementById('submit')
  submit.addEventListener('click', (ev) => {
    ev.preventDefault()
    //console.log('submit clicked')
    let comment = document.getElementById('comment_input').value
    addComment(comment)
  })
}

function addComment(blurb){
  let ul = document.getElementById('comments')
  let li = document.createElement('li')
  li.textContent = blurb
  ul.appendChild(li)  // front end updated
  clearInputField()

 let config = {  //update backend comments
   method: 'POST',
   headers: {'Accept': 'application/json',
            'Content-Type': 'application/json'},
   body: JSON.stringify({image_id: imageId, content: blurb})
 }

 fetch(commentsURL, config)
   .then(resp => resp.json())
   .then(data => {
     console.log(data)
   })

}

function clearInputField(){
  let test = document.getElementById('comment_input')
  test.value = ""
}
