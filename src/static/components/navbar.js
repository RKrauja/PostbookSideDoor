class NavbarComponent extends HTMLElement {
    constructor() {
        super();
        this.currentUser = null;
    }

    async connectedCallback() {
        await this.loadNavbar();
    }

    async loadNavbar() {
        try {
            // Check if user is logged in
            const response = await fetch('/api/current-user', {
                credentials: 'include'
            });

            if (response.ok) {
                // User is logged in
                this.currentUser = await response.json();
                this.renderLoggedInNavbar();
            } else {
                // User is not logged in
                this.renderGuestNavbar();
            }
        } catch (error) {
            console.error('Error loading navbar:', error);
            this.renderGuestNavbar();
        }
    }

    renderLoggedInNavbar() {
        this.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                <div class="container">
                    <a class="navbar-brand fw-bold" href="/">PostBook</a>
                    <div class="navbar-nav ms-auto">
                        <a class="nav-link" href="/">Home</a>
                        <a class="nav-link" href="/profile">Profile</a>
                        <button class="btn btn-outline-light btn-sm" onclick="window.navbarLogout()">Logout</button>
                    </div>
                </div>
            </nav>
        `;
    }

    renderGuestNavbar() {
        this.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                <div class="container">
                    <a class="navbar-brand fw-bold" href="/">PostBook</a>
                    <div class="navbar-nav ms-auto">
                        <a class="nav-link" href="/">Home</a>
                        <a class="nav-link" href="/login">Login</a>
                        <a class="nav-link" href="/register">Register</a>
                    </div>
                </div>
            </nav>
        `;
    }

    async refresh() {
        await this.loadNavbar();
    }
}

window.navbarLogout = async () => {
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            window.location.href = '/';
        } else {
            alert('Error logging out');
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error logging out');
    }
};

// Define the custom element
customElements.define('navbar-component', NavbarComponent);