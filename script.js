// Gestion simple des likes
document.querySelectorAll('[data-like]').forEach(button => {
    button.addEventListener('click', () => {
        const countSpan = button.querySelector('.count');
        let count = parseInt(countSpan.textContent, 10);

        if (button.classList.contains('liked')) {
            // On retire le like
            button.classList.remove('liked');
            countSpan.textContent = count - 1;
        } else {
            // On ajoute le like
            button.classList.add('liked');
            countSpan.textContent = count + 1;
        }
    });
});

// Ajout TRÈS simple d'un nouveau post (front seulement)
const publishBtn = document.getElementById('publish-btn');
const newPostTextarea = document.getElementById('new-post');
const postsContainer = document.querySelector('.posts');

publishBtn.addEventListener('click', () => {
    const text = newPostTextarea.value.trim();
    if (!text) return;

    const article = document.createElement('article');
    article.className = 'post card';
    article.innerHTML = `
        <div class="post-header">
            <div class="avatar">G</div>
            <div class="post-info">
                <div class="post-user">@glodie</div>
                <div class="post-time">À l’instant</div>
            </div>
        </div>
        <div class="post-body">
            <p>${text}</p>
        </div>
        <div class="post-footer">
            <button class="action-btn like-btn" data-like>
                ❤️ <span class="count">0</span>
            </button>
            <button class="action-btn">💬 0</button>
            <button class="action-btn">↻ 0</button>
        </div>
    `;

    postsContainer.prepend(article);
    newPostTextarea.value = '';

    // ré-attacher le listener sur le nouveau bouton like
    const likeBtn = article.querySelector('[data-like]');
    likeBtn.addEventListener('click', () => {
        const countSpan = likeBtn.querySelector('.count');
        let count = parseInt(countSpan.textContent, 10);

        if (likeBtn.classList.contains('liked')) {
            likeBtn.classList.remove('liked');
            countSpan.textContent = count - 1;
        } else {
            likeBtn.classList.add('liked');
            countSpan.textContent = count + 1;
        }
    });
});
