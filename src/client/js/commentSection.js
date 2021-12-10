const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.getElementById("deleteBtn");
const videoComment = document.getElementById("video__comment");
const videoCommentUl = document.querySelector("#video__comments_ul");

const addComment = (text, id) => {
  const videoComment = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  const icon = document.createElement("i");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  const deleteBtn = document.createElement("button");
  span.innerText = `${text}`;
  deleteBtn.innerText = "❌";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(deleteBtn);
  videoComment.prepend(newComment);
  deleteBtn.addEventListener("click", hnadleDelete);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const hnadleDelete = async (event) => {
  const id = event.target.parentElement.dataset.id;
  videoCommentUl.removeChild(event.target.parentElement);
  await fetch("/api/deleteComment", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
