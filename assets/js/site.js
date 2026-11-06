document.addEventListener("DOMContentLoaded", () => {
    const yearNodes = document.querySelectorAll("[data-year]");
    const currentYear = String(new Date().getFullYear());

    yearNodes.forEach(node => {
        node.textContent = `© ${currentYear}`;
    });

    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll("nav a").forEach(link => {
        const linkPath = link.getAttribute("href");
        if (linkPath === currentPath) {
            link.setAttribute("aria-current", "page");
        }
    });
});