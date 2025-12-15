document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM chargé");

    const FEED = document.getElementById("feed-container");

    async function loadFeed() {
        FEED.innerHTML = "<p>Chargement…</p>";

        try {
            const res = await fetch("https://picsum.photos/v2/list?limit=6");
            const photos = await res.json();
            FEED.innerHTML = "";

//Permettre de liker
            photos.forEach(photo => {
    const post = document.createElement("article");
    post.className = "post";

    post.innerHTML = `
        <img 
            src="https://picsum.photos/id/${photo.id}/400/400" 
            class="post-image"
        >

        <div class="post-actions">
            <button class="like-btn">❤️ <span class="like-count">0</span></button>
        </div>

        <div class="post-comments">
            <input 
                type="text" 
                class="comment-input" 
                placeholder="Ajouter un commentaire…"
            >
            <div class="comments"></div>
        </div>
    `;
//Rendre le like fonctionnel
    const likeBtn = post.querySelector(".like-btn");
const likeCount = post.querySelector(".like-count");

let liked = false;

likeBtn.addEventListener("click", () => {
    liked = !liked;
    likeCount.textContent = liked ? 1 : 0;
});
//Rendre les commentaires fonctionnels
const commentInput = post.querySelector(".comment-input");
const commentsDiv = post.querySelector(".comments");

commentInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && commentInput.value.trim()) {
        const comment = document.createElement("div");
        comment.textContent = commentInput.value;
        commentsDiv.appendChild(comment);
        commentInput.value = "";
    }
});

    FEED.appendChild(post);
});
        } catch (e) {
            console.error(e);
            FEED.innerHTML = "Erreur chargement feed";
        }
    }

    loadFeed();
});


