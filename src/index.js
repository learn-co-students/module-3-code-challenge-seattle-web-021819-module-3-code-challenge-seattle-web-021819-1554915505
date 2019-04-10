// Set constants
let imageId = 2387;
const imageURL = `https://randopic.herokuapp.com/images/2387`
const likeURL = `https://randopic.herokuapp.com/likes/`
const commentsURL = `https://randopic.herokuapp.com/comments/`
const div = document.getElementById('image_card');
const ul = div.querySelector('ul');
const forms = document.getElementById('comment_form');
const likeButton = document.getElementById('like_button');
const fetchHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};
const commentArray = [];

// Add event listeners
likeButton.addEventListener('click', (ev) => liked(ev))
forms.addEventListener('submit', (ev) => newComment(ev))


// Fetching image
function fetchImg() {
  fetch(imageURL)
    .then(resp => resp.json())
    .then(data => {
      displayImage(data);
    })
}


// Display Image on page load
function displayImage(data) {
  console.log(data);
  // Assign attributes of image on page
  div.querySelector('img').src = data.url;
  div.querySelector('h4').textContent = data.name;
  div.querySelector('span').firstElementChild.textContent = data.like_count;
  // Send to iterator to go through each comment
  commentIterator(data.comments);
}


// Comment iterator
function commentIterator(comments) {
  clearComments();
  for (comment of comments) {
    commentArray.push(comment);
    displayComment(comment.content);
  }
}


// Build LI and display for a single comment
function displayComment(commentContent) {
  // Creating and building out <LI>
  let li = document.createElement('li');
  li.innerText = commentContent;
  // [BONUS] Creating Delete button
  let deleteButton = document.createElement('button');
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener('click', (ev) => deleteComment(ev));
  // Appending everything to <UL>
  li.appendChild(deleteButton);
  ul.appendChild(li);
}


// Clear comments
function clearComments() {
  while(ul.firstElementChild) {
    ul.firstElementChild.remove();
  }
}


// Increase likes (triggered by click event)
function liked(ev) {
  // Updating likes optimistically
  ev.target.previousElementSibling.firstElementChild.innerText++;
  let like_count = ev.target.previousElementSibling.firstElementChild.innerText;
  // Sends updated info to POST function
  let body = {image_id: imageId}
  sendPost(body, likeURL);
}


// Adding new comment (triggered by submit event)
function newComment(ev) {
  // Prevent event from refreshing/redirecting
  ev.preventDefault();
  // Grabbing comment optimistically directly from form
  // NOT from the response of the POST request
  let comment = ev.target.firstElementChild.value;
  // Resets input field
  forms.reset();
  // Send user input to display function
  displayComment(comment);
  // Send new comment to POST function
  let body = {
    image_id: imageId,
    content: comment
  };
  sendPost(body, commentsURL);
}


// [BONUS] Delete function (triggered by click event)
function deleteComment(ev) {
  console.log('WARNING: Comment not actually delete in database');
  // Removing comment optimistically
  ev.target.parentElement.remove();
  // Sending DELETE request
  // NOTE: COULDN'T GET ID FOR COMMENT :(
  // fetch((commentsURL+comment_id), {
  //   method: 'DELETE'
  // })
  // .then(console.log('DELETE successful!'))
}


// Send POST request
function sendPost(body, Url) {
  fetch(Url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: fetchHeaders
  })
  .then(resp => resp.json())
  .then(data => {
    console.log('POST successful!')
    // Adding comment to local array if new comment request
    if ("content" in data) {
      commentArray.push(data);
    } else {
      console.log('Liked!');
    }
  })
}


// Initializing script
fetchImg();
