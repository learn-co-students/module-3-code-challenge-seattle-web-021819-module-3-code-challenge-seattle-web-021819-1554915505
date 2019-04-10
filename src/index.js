console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')
let imageId = 2389
const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
const likeURL = `https://randopic.herokuapp.com/likes/`
const commentsURL = `https://randopic.herokuapp.com/comments/`

/* 
 <div id="image_card" class="card col-md-4">
    <img src="" id="image" data-id=""/>
    <h4 id="name">Title of image goes here</h4>
    <span>Likes:
      <span id="likes">Likes Go Here</span>
    </span>
    <button id="like_button">Like</button>
    <form id="comment_form">
      <input id="comment_input" type="text" name="comment" placeholder="Add Comment"/>
      <input type="submit" value="Submit"/>
    </form>
    <ul id="comments">
          <!-- <li> for each comment goes here -->
    </ul>
  </div>
*/

const card = document.getElementById('image_card')
const image = document.getElementById('image')
const title = document.getElementById('name')
const likes = document.getElementById('likes')
const likeBtn = document.getElementById('like_button')
const form = document.getElementById('comment_form')
const commentsUl = document.getElementById('comments')

// Fetches image data from db
function fetchImage() {
  fetch(imageURL)
    .then(res => res.json())
    .then(data => setCard(data))
}

// Create new like in db and increment likes 
function updateLike() {
  fetch(likeURL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_id: imageId
    })
  })
    .then(res => res.json())
    .then(() => {
      likes.textContent = parseInt(likes.textContent) + 1
    })
}

// Create new comment in db and add to list
function createComment(content) {
  fetch(commentsURL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_id: imageId,
      content: content
    })
  })
    .then(res => res.json())
    .then(comment => {
      commentsUl.appendChild(renderComment(comment))
    })
}

// Delete a comment from db and remove from list
function deleteComment(id) {
  fetch(commentsURL + id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
   .then(res => res.json())
   .then(data => {
      // If comment successfully destroyed in db, remove comment from list
      if (data.message) 
        document.querySelector(`[data-id="comment-${id}"]`).remove()
      else 
        console.error("Unable to delete comment.")
   })
}

// Callback for like button click
const handleLikeClick = () => {
  //console.log('like button clicked')
  updateLike()
}

// Callback for form submission
const handleFormSubmit = (e) => {
  //console.log('form submitted')
  e.preventDefault()

  // Get comment content from input
  const content = e.target.elements["comment"].value
  createComment(content)
}

// Callback for deleting comment
const handleDeleteComment = (id) => {
  //console.log('delete button clicked', id)
  deleteComment(id)
}

// Set card content from data
function setCard(card) {
  const { url, name, like_count, comments } = card

  // Set title
  title.textContent = name 

  // Set image url
  image.src = url

  // Set likes 
  likes.textContent = like_count

  // Add event to like button
  likeBtn.addEventListener('click', handleLikeClick)

  // Add event to form submit
  form.addEventListener('submit', handleFormSubmit)

  // Render comments list
  comments.forEach(comment => {
    commentsUl.appendChild(renderComment(comment))
  })
}

// Create and returns li element containing comment content
function renderComment(comment) {
  const { id, content } = comment

  // Set data-id to grab comment for deletion later
  const li = document.createElement('li')
  li.setAttribute('data-id', 'comment-' + id)
  li.textContent = content

  // Add delete button
  const delBtn = document.createElement('button')
  delBtn.textContent = 'x'
  delBtn.classList.add('del-btn')
  delBtn.addEventListener('click', () => handleDeleteComment(id))
  li.appendChild(delBtn)

  return li
}

fetchImage()