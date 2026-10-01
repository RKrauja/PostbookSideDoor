import { queryGraphQL } from '../helpers/helper_functions.js';

const getPostIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('post_id') ? urlParams.get('post_id') : null;
}

const fetchPost = async (postId) => {
    const query = `
                query GetPost($id: Int!) {
                    getPost(PostId: $id) {
                        id
                        title
                        content
                        author {
                            name
                        }
                    }
                }
            `;
    try {
        const result = await queryGraphQL(query, { id: parseInt(postId) });
        return result.data.getPost;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

const displayPost = (post) => {
    if (!post) {
        document.getElementById('post-title').textContent = 'Post not found';
        document.getElementById('post-author').textContent = 'Unknown';
        document.getElementById('post-content').innerHTML = '<p class="text-danger">Post could not be loaded.</p>';
        return;
    }

    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-author').textContent = post.author.name;
    document.getElementById('post-content').innerHTML = `<p>${post.content}</p>`;
    document.title = `PostBook - ${post.title}`;
}

document.addEventListener('DOMContentLoaded', async () => {
    const postId = getPostIdFromUrl();
    if (!postId) {
        document.getElementById('post-title').textContent = 'No post ID provided';
        document.getElementById('post-author').textContent = 'Unknown';
        document.getElementById('post-content').innerHTML = '<p class="text-danger">Please provide a valid post ID in the URL.</p>';
        return;
    }

    const post = await fetchPost(postId);
    displayPost(post);
});