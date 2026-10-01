import { queryGraphQL, navigateToPost } from '../helpers/helper_functions.js';

const fetchAllPosts = async () => {
    const query = `
        {
            getAllPosts {
                author {
                    name
                }
                content
                id
                title
            }
        }
    `;
    try {
        const result = await queryGraphQL(query);
        return result.data.getAllPosts || [];
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const posts = await fetchAllPosts();
    const postListContainer = document.getElementById('post-list');

    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'card mb-4 shadow-sm clickable-post';
        postCard.onclick = () => navigateToPost(post.id);

        postCard.innerHTML = `
            <div class="card-body">
                <h3 class="card-title">${post.title}</h3>
                <p class="text-muted mb-2">By ${post.author.name}</p>
                <p class="card-text">${post.content}</p>
                <small class="text-primary">Click to read more →</small>
            </div>
        `;

        postListContainer.appendChild(postCard);
    });
});