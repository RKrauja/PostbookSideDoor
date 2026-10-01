import { queryGraphQL, getCurrentUser, navigateToPost } from '../helpers/helper_functions.js';

let currentUser = null;
let sessionToken = null;

const fetchUserPosts = async (userId) => {
    const query = `
                query GetUsersPosts($userId: Int!) {
                    getUsersPosts(UserId: $userId) {
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
        const result = await queryGraphQL(query, { userId: userId });
        if (result.errors) {
            throw new Error(result.errors[0].message);
        }
        return result.data.getUsersPosts || [];
    } catch (error) {
        throw error;
    }
};

const displayUserInfo = (user) => {
    document.getElementById('user-name').textContent = user.name;

    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    document.getElementById('user-avatar').textContent = initials;
};

const displayPosts = (posts) => {
    const container = document.getElementById('posts-container');
    container.innerHTML = '';

    if (posts.length === 0) {
        document.getElementById('empty-state').classList.remove('d-none');
        return;
    }

    document.getElementById('post-count').textContent = posts.length;

    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'card mb-4 shadow-sm clickable-post';
        postCard.onclick = () => navigateToPost(post.id);

        postCard.innerHTML = `
                    <div class="card-body">
                        <h4 class="card-title">${post.title}</h4>
                        <p class="card-text">${post.content}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <small class="text-muted">Post ID: ${post.id}</small>
                            <small class="text-primary">Click to view →</small>
                        </div>
                    </div>
                `;

        container.appendChild(postCard);
    });
};

const showError = (message) => {
    document.getElementById('loading-state').classList.add('d-none');
    document.getElementById('empty-state').classList.add('d-none');
    document.getElementById('error-message').textContent = message;
    document.getElementById('error-state').classList.remove('d-none');
};

const hideAllStates = () => {
    document.getElementById('loading-state').classList.add('d-none');
    document.getElementById('empty-state').classList.add('d-none');
    document.getElementById('error-state').classList.add('d-none');
};

const setRefreshLoading = (loading) => {
    const refreshText = document.getElementById('refresh-text');
    const refreshSpinner = document.getElementById('refresh-spinner');

    if (loading) {
        refreshText.textContent = 'Loading...';
        refreshSpinner.classList.remove('d-none');
    } else {
        refreshText.textContent = 'Refresh';
        refreshSpinner.classList.add('d-none');
    }
};

const loadUserData = async () => {
    try {
        hideAllStates();
        document.getElementById('loading-state').classList.remove('d-none');

        currentUser = await getCurrentUser();
        if (!currentUser) {
            return;
        }
        try {
            // This is an admin querry for confidential user data ;)
            const adminQuery = `
                        query GetDetailedUserInfo($userId: Int!) {
                            getUser(UserId: $userId) {
                                id
                                name
                                hashedPassword
                            }
                        }
                    `;

            const adminResult = await queryGraphQL(adminQuery, {
                userId: currentUser.id,
            });

        } catch (adminError) {
            console.debug('Enhanced profile data requires admin privileges');
        }

        displayUserInfo(currentUser);

        const posts = await fetchUserPosts(currentUser.id);
        hideAllStates();
        displayPosts(posts);

    } catch (error) {
        hideAllStates();
        showError(error.message || 'Failed to load profile data');
    }
};

const refreshPosts = async () => {
    setRefreshLoading(true);
    try {
        await loadUserData();
    } finally {
        setRefreshLoading(false);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
});

window.loadUserData = loadUserData;
window.refreshPosts = refreshPosts;
