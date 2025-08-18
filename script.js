import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM refs
const blogContainer = document.getElementById("blog-posts");
const postForm = document.getElementById("post-form");
const postContainer = document.getElementById("post-container");

// Load posts on index.html
if (blogContainer) {
  async function loadPosts() {
    blogContainer.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach(docSnap => {
      const post = docSnap.data();
      const article = document.createElement("article");
      article.classList.add("post-card");
      article.innerHTML = `
        <h2><a href="view.html?id=${docSnap.id}">${post.title}</a></h2>
        <p>${post.content.substring(0, 120)}...</p>
        <div class="post-meta">Published: ${post.date}</div>
      `;
      blogContainer.appendChild(article);
    });
  }
  loadPosts();
}

// Handle new post submission on post.html
if (postForm) {
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    await addDoc(collection(db, "posts"), {
      title,
      content,
      date: new Date().toLocaleDateString()
    });

    alert("Post published!");
    window.location.href = "index.html";
  });
}

// Load single post on view.html
if (postContainer) {
  async function loadPost() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("id");
    if (!postId) return;

    const docRef = doc(db, "posts", postId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const post = docSnap.data();
      postContainer.innerHTML = `
        <h2>${post.title}</h2>
        <div class="post-meta">Published: ${post.date}</div>
        <p>${post.content.replace(/\n/g, "<br>")}</p>
      `;
    } else {
      postContainer.innerHTML = "<p>Post not found.</p>";
    }
  }
  loadPost();
}
