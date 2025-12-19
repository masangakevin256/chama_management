import supabase from "../supabase/supabase.js";

// Load Layout
async function loadLayout() {
    let pathPrefix = "../includes";
    if (window.location.pathname.includes("/dashboards/")) {
        pathPrefix = "../../includes";
    }

    // Inject CSS
    const assetPrefix = pathPrefix.replace("includes", "assets");
    const cssFiles = ["main.css", "dashboard.css", "form.css", "table.css"];
    cssFiles.forEach(file => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `${assetPrefix}/${file}`;
        document.head.appendChild(link);
    });

    // Load Sidebar
    const sidebarContainer = document.getElementById("sidebar-container");
    if (sidebarContainer) {
        const res = await fetch(`${pathPrefix}/sidebar.html`);
        const html = await res.text();
        sidebarContainer.innerHTML = html;
    }

    // Load Navbar
    const navbarContainer = document.getElementById("navbar-container");
    if (navbarContainer) {
        const res = await fetch(`${pathPrefix}/navbar.html`);
        const html = await res.text();
        navbarContainer.innerHTML = html;
    }

    // Load Footer
    const footerContainer = document.getElementById("footer-container");
    if (footerContainer) {
        const res = await fetch(`${pathPrefix}/footer.html`);
        const html = await res.text();
        footerContainer.innerHTML = html;
    }

    // Initialize UI events
    setupEvents();
    checkAuth();
}

function setupEvents() {
    // Toggle Sidebar
    document.addEventListener("click", (e) => {
        if (e.target && e.target.id === "sidebarToggle") {
            const sidebar = document.getElementById("wrapper");
            sidebar.classList.toggle("toggled");
        }
        // Logout
        if (e.target && e.target.id === "logoutBtn") {
            e.preventDefault();
            handleLogout();
        }
    });
}

function getRootPath() {
    return window.location.pathname.includes("/dashboards/") ? "../.." : "..";
}

async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        window.location.href = `${getRootPath()}/index.html`;
        return;
    }

    // Fetch User Profile for Role
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

    if (profile) {
        // Update Navbar User Name
        const userDisplay = document.getElementById("userDisplay");
        if (userDisplay) userDisplay.textContent = profile.full_name || session.user.email;

        // Show Sidebar Links Based on Role
        document.querySelectorAll(".role-link").forEach(el => el.classList.add("d-none"));
        const roleLinks = document.querySelector(`.permission-${profile.role}`);
        if (roleLinks) roleLinks.classList.remove("d-none");
    }
}

async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = `${getRootPath()}/index.html`;
}

// Start
document.addEventListener("DOMContentLoaded", loadLayout);
