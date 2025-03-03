// initial MVP code (steps 1-5) finished at 10:30
// stretch goal (step 6) finished at 10:56

document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 2383 //Enter the id from the fetched image here
  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
  const likeURL = `https://randopic.herokuapp.com/likes/`
  const commentsURL = `https://randopic.herokuapp.com/comments/`

  // DOM elements
  const h4 = document.getElementById('name')
  const image = document.getElementById('image')
  const likes = document.getElementById('likes')
  const button = document.getElementById('like_button')
  const form = document.getElementById('comment_form')
  const input = document.getElementById('comment_input')
  const ul = document.getElementById('comments')



  function getImage() {
    fetch(imageURL)
    .then(res => res.json())
    .then(data => {
      let {id, url, name, like_count, comments} = data

      // load image, name, like_count
      image.src = url
      h4.textContent = name
      likes.textContent = like_count

      //create new li for each comment
      comments.forEach(comment => {
        let li = document.createElement('li')
        ul.appendChild(li)
        li.textContent = comment.content
        addDeleteButton(li, comment.id)
      })

      // like button
      button.addEventListener('click', () => {
        // increase likes on page
        like_count++
        likes.textContent = like_count

        // POST like_count to database
        fetch(likeURL, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({"image_id": `${imageId}`})
        })
      })

      // comment form
      form.addEventListener('submit', (ev) => {
        ev.preventDefault()

        // create new li
        let li = document.createElement('li')
        ul.appendChild(li)
        li.textContent = input.value


        // POST comment to database
        fetch(commentsURL, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "image_id": `${imageId}`,
            "content": `${input.value}`
          })
        })
        .then(res => res.json())
        .then(comment => {
          //comment is an Object, use comment.id to delete from database
          addDeleteButton(li, comment.id)
        })
      })

    })
  }

  function addDeleteButton(li, id) {
    let deleteButton = document.createElement('button')
    li.appendChild(deleteButton)
    deleteButton.textContent = "Delete"
    deleteButton.addEventListener('click', () => {
      li.parentNode.removeChild(li)
      fetch(commentsURL + id, {method: "DELETE"})
    })

  }


  getImage()
})
