// Common helper functions for PostBook application

// GraphQL query function
export const queryGraphQL = async (query, variables = {}) => {
    try {
        const response = await fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for session management
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('GraphQL query error:', error);
        throw error;
    }
};

// Alert display function
export const showAlert = (message, type = 'danger') => {
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
    }
};



// Get current user from session
export const getCurrentUser = async () => {
    try {
        const response = await fetch('/api/current-user', {
            credentials: 'include'
        });
        if (response.ok) {
            const userData = await response.json();
            return userData;
        } else {
            throw new Error('Failed to get current user');
        }
    } catch (error) {
        console.error('Error getting current user:', error);
        window.location.href = '/login';
        return null;
    }
};

// Post navigation
export const navigateToPost = (postId) => {
    window.location.href = `/post?post_id=${postId}`;
};
