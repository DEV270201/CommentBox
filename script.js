let commentContainer = document.getElementsByClassName('comment-container')[0];
let author = document.getElementById('author');
let comment = document.getElementById('comment');
let replyAuthor = document.getElementById('reply-author');
let replyComment = document.getElementById('reply-comment');
let replyBtn = document.getElementById('reply-post');
let editAuthor = document.getElementById('edit-author');
let editComment = document.getElementById('edit-comment');
let editBtn = document.getElementById('edit-post');
let post = document.getElementById('post');
let comments = [];

//function for adding the reply to the comment using Modal
function addReply(id){
  replyBtn.addEventListener('click',()=> addComment(replyAuthor.value,replyComment.value,id),{once:true});
  $('#replyModal').modal('show');
}

//recursive function to delete the comment
function deleteComment(comment,id){
    if(comment.id == id){
      return true;
    }
    if(comment.children.length == 0)
      return false;
    comment.children = comment.children.filter((com)=>{
     if(!deleteComment(com,id)){
        return com;
     }
    });
    return false;
}

function deleteCom(id){
  comments = comments.filter((comment)=>{
      if(!deleteComment(comment,id)){
          return comment;
      }
  });
  alert("Comment deleted successfully");
  renderComments();
  return;
}


//recurisve function to update the comment
function recursiveUpdateComment(comment,content,id){
    if(comment.id == id){
        comment.content = content;
        return true;
    }
    for(let i=0;i<comment.children.length;i++){
      if(recursiveUpdateComment(comment.children[i],content,id)){
          return true;
      }
    }
  return false;
}


function updateComment(prevContent,updatedContent,id){
  if(prevContent.trim() === updatedContent.trim()){
    $('#editModal').modal('hide');
    alert("No changes made");
    return;
  }
  for(let i=0;i<comments.length;i++){
    if(recursiveUpdateComment(comments[i],updatedContent,id))
      break;
  }
  $('#editModal').modal('hide');
  alert("Comment updated successfully");
  renderComments();
}

//opens the modal for editing the comment
function editCom(id,author,content){
  editBtn.addEventListener('click',()=> updateComment(content,editComment.value,id),{once:true});
  editAuthor.value = author;
  editComment.value = content;
  $('#editModal').modal('show');
}

//recursive function for appending the  actual comment cards as well as the reply cards.
function appendCommentsToRender(comment,html,margin){
   html+=`
     <div class="card my-1" style="margin-left:${margin}px;">
       <div class="card-body">
       <h6 class="my-1">${comment.author}</h6>
        ${comment.content}
        <div class="btns my-2">
          <button class="btn btn-sm btn-outline-primary mr-1" onclick="addReply(${comment.id})">Reply</button>
           <button class="btn btn-sm btn-outline-success mx-1" onclick="editCom(${comment.id},'${comment.author}','${comment.content}')">Edit</button>
            <button class="btn btn-sm btn-outline-danger ml-1" onclick="deleteCom(${comment.id})">Delete</button>
        </div>
       </div>
     </div>
   `;

    for(let i=0;i<comment.children.length;i++){
      html = appendCommentsToRender(comment.children[i],html,margin+20);
    }
    return html;
}

// function for rendering all the comments 
function renderComments(){
  if(comments.length == 0){
    commentContainer.innerHTML = `<h6 class="text-primary">No comments...</h6>`;
    return;
  }

  let html="";
  for(let i=0;i<comments.length;i++){
     html = appendCommentsToRender(comments[i],html,0);
  }
  commentContainer.innerHTML = html;
  return;
}

//recursive function for finding the parent comment and attaching the reply comment to it.
function findParentAndInsertComment(parentCommentID,parentComment,commentObj){
    if(parentCommentID == parentComment.id){
        parentComment.children.push(commentObj);
        return true;
    }
    for(let i=0;i<parentComment.children.length;i++){
      if(findParentAndInsertComment(parentCommentID,parentComment.children[i],commentObj)){
        return true;
      }
    }
  return false;
}

function insertReplyToComment(parentCommentID,commentObj){
    for(let i=0;i<comments.length;i++){
       if(findParentAndInsertComment(parentCommentID,comments[i],commentObj)){
         break;
       }
    }
  return;
}

//function for making the comment and updating the array of comments
function addComment(auth,comm,id){
  $('#replyModal').modal('hide');

  if(auth.trim() === "" || comm.trim() === ""){
    alert("Invalid comment!");
    author.value = "";
    comment.value = "";
    replyAuthor.value = "";
    replyComment.value = "";
    return;
  }
  
  let commentObj = {
    author:auth,
    content:comm,
    id:Math.random(),
    children:[]
  }
  
  if(!id){
    comments.push(commentObj);
    author.value = "";
    comment.value = "";
  }
  else{
    replyAuthor.value = "";
    replyComment.value = "";
    insertReplyToComment(id,commentObj);
  }
  
  alert("Comment added successfully!");
  renderComments();
  return;
}

renderComments();
post.addEventListener("click",()=> addComment(author.value,comment.value,null));

//structure used for storing the comments as well as nested comments
// let comments = [
//   {
//     author:"A",
//     content:"a",
//     id:1,
//     children:[{
//       author:"A1",
//       content:"a1",
//       id:11,
//       children:[{
//         author:"A11",
//         content:"a11",
//         id:111,
//         children:[]
//       },{
//         author:"A12",
//         content:"a12",
//         id:112,
//         children:[]
//       }]
//     }]
//   },
//   {
//     author:"B",
//     content:"b",
//     id:2,
//     children:[{
//       author:"B1",
//       content:"b1",
//       id:21,
//       children:[{
//         author:"B11",
//         content:"b11",
//         id:211,
//         children:[
//           {
//             author:"B111",
//             content:"b111",
//             id:2111,
//             children:[]
//           }
//         ]
//       }]
//     }]
//   }
// ];



