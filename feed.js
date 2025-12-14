const FEED = document.getElementById("feed-container");
const searchBtn = document.getElementById("searchBtn");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");

searchBtn.addEventListener("click", () => {
    if (searchBox.style.display === "none") {
        searchBox.style.display = "block";
        searchInput.focus();
    } else {
        searchBox.style.display = "none";
        searchInput.value = "";
        loadUnsplashFeed("trending");
    }
});

let searchTimeout = null;

searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();

    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        if (query.length === 0) {
            loadUnsplashFeed("trending");
        } else {
            loadUnsplashFeed(query);
        }
    }, 400);
});


// LOAD FEED UNSPLASH

async function loadUnsplashFeed(query = "trending") {
    FEED.innerHTML = "<p>Chargement…</p>";

    try {
        const res = await fetch(`${API_URL}/api/photos/unsplash?q=${query}`);
        if (!res.ok) throw new Error("Erreur Unsplash");

        const photos = await res.json();
        FEED.innerHTML = "";

        photos.forEach(photo => createPost(photo));
    } catch (err) {
        console.error(err);
        FEED.innerHTML = "<p>Impossible de charger le feed.</p>";
    }
}


// CREATE POST

function createPost(photo) {
    const post = document.createElement("article");
    post.className = "post card";

    post.innerHTML = `
        <img src="${photo.url}" class="post-image">

        <div class="post-footer">
            <button type="button" class="action-btn like-btn">
                ❤️ <span class="like-count">0</span>
            </button>
        </div>

        
        <input class="comment-input" placeholder="Commenter…">
        <div class="comments"></div> 
    `;

    const likeBtn = post.querySelector(".like-btn");
    const likeCountSpan = post.querySelector(".like-count");
    const commentInput = post.querySelector(".comment-input");
    const commentsDiv = post.querySelector(".comments");

    let liked = false;

    // Charger likes
    fetch(`${API_URL}/api/likes/${photo.externalId}/count`)
        .then(res => res.json())
        .then(data => likeCountSpan.textContent = data.likeCount);

    likeBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const res = await fetch(`${API_URL}/api/likes/${photo.externalId}`, {
            method: liked ? "DELETE" : "POST",
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        liked = data.liked;
        likeCountSpan.textContent = data.likeCount;
        likeBtn.classList.toggle("liked", liked);
    });

    commentInput.addEventListener("keydown", async (e) => {
        if (e.key === "Enter" && commentInput.value.trim()) {
            await fetch(`${API_URL}/api/comments/${photo.externalId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ text: commentInput.value })
            });

            commentInput.value = "";
            loadComments(photo.externalId, commentsDiv);
        }
    });

    loadComments(photo.externalId, commentsDiv);
    FEED.appendChild(post);
}



// LOAD COMMENTS

async function loadComments(externalId, container) {
    try {
        const res = await fetch(`${API_URL}/api/comments/${externalId}`);
        if (!res.ok) throw new Error("Erreur commentaires");

        const comments = await res.json();

        container.innerHTML = comments
            .map(c => `
                <div class="comment">
                    <strong>@${c.username}</strong> ${c.text}
                </div>
            `)
            .join("");
    } catch (err) {
        console.error(err);
    }
}


// INIT

loadUnsplashFeed();
