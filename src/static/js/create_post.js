import { queryGraphQL, showAlert, getCurrentUser } from '../helpers/helper_functions.js';

let currentUser = null;

const setLoading = (loading) => {
    const createBtn = document.getElementById('create-btn');
    const createText = document.getElementById('create-text');
    const createSpinner = document.getElementById('create-spinner');

    if (loading) {
        createBtn.disabled = true;
        createSpinner.classList.remove('d-none');
    } else {
        createBtn.disabled = false;
        createSpinner.classList.add('d-none');
    }
};

const createPost = async (title, content, authorId) => {
    const mutation = `
            mutation CreatePost($title: String!, $content: String!, $authorId: Int!) {
                createPost(title: $title, content: $content, authorId: $authorId) {
                    id
                    title
                    content
                    author {
                        id
                        name
                    }
                }
            }
        `;

    try {
        const result = await queryGraphQL(mutation, {
            title: title,
            content: content,
            authorId: authorId,
        });

        if (result.errors) {
            throw new Error(result.errors[0].message);
        }

        return result.data.createPost;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

document.getElementById('content').addEventListener('input', (e) => {
    const charCount = e.target.value.length;
    document.getElementById('char-count').textContent = charCount;
});

document.getElementById('create-post-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();

    if (!title || !content) {
        showAlert('Please fill in both title and content.');
        return;
    }

    if (title.length < 3) {
        showAlert('Title must be at least 3 characters long.');
        return;
    }

    if (content.length < 10) {
        showAlert('Content must be at least 10 characters long.');
        return;
    }

    if (!currentUser) {
        showAlert('User not found. Please refresh the page.');
        return;
    }

    setLoading(true);

    try {
        const newPost = await createPost(title, content, currentUser.id);
        showAlert('Post created successfully! Redirecting to your profile...', 'success');
        window.location.href = '/profile';

    } catch (error) {
        console.error('Create post error:', error);
        showAlert(error.message || 'Failed to create post. Please try again.');
    } finally {
        setLoading(false);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    currentUser = await getCurrentUser();
});