document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("legalBuddy");
    if (!root) return;

    const toggle = document.getElementById("legalToggle");
    const bubble = document.getElementById("legalBubble");
    const closeBtn = document.getElementById("legalClose");
    const nav = document.getElementById("legalNav");
    const textEl = document.getElementById("legalText");
    const dotsEl = document.getElementById("legalDots");
    const prevBtn = document.getElementById("legalPrev");
    const nextBtn = document.getElementById("legalNext");
    const charImg = document.getElementById("legalChar");

    const characterSrc = {
        open: "assets/img/skin_open.webp",
        closed: "assets/img/skin_closed.webp"
    };

    const pages = [
        "Los archivos para descargar (Forge MDK, Eclipse y Adoptium/OpenJDK) los distribuyen originalmente sus desarrolladores.",
        "Los enlaces apuntan a copias en Google Drive solo para facilitar el acceso, sin modificar su contenido.",
        "Todas las licencias y derechos pertenecen a sus propietarios: Forge (MinecraftForge Team), Eclipse Foundation y Adoptium."
    ];

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0;
    let typingTimer = null;
    let isOpen = true;

    pages.forEach(() => dotsEl.appendChild(document.createElement("i")));

    // Escribe el HTML letra por letra sin romper las etiquetas.
    function typewrite(html) {
        clearInterval(typingTimer);

        if (reduceMotion) {
            textEl.innerHTML = html;
            return;
        }

        const temp = document.createElement("div");
        temp.innerHTML = html;
        const plainLength = temp.textContent.length;
        let visible = 0;

        textEl.innerHTML = "";
        typingTimer = setInterval(() => {
            visible++;
            let out = "";
            let count = 0;
            let inTag = false;

            for (const char of html) {
                if (char === "<") inTag = true;
                if (!inTag) {
                    if (count >= visible) break;
                    count++;
                }
                out += char;
                if (char === ">") inTag = false;
            }

            textEl.innerHTML = out;
            if (visible >= plainLength) clearInterval(typingTimer);
        }, 22);
    }

    function show(nextIndex) {
        index = Math.max(0, Math.min(pages.length - 1, nextIndex));
        typewrite(pages[index]);
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === pages.length - 1;
        [...dotsEl.children].forEach((dot, i) => dot.classList.toggle("on", i === index));
    }

    function setOpen(nextOpen) {
        isOpen = nextOpen;
        bubble.hidden = !isOpen;
        root.classList.toggle("is-collapsed", !isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Cerrar aviso legal" : "Abrir aviso legal");

        const nextSrc = isOpen ? characterSrc.open : characterSrc.closed;
        if (charImg.getAttribute("src") !== nextSrc) {
            charImg.src = nextSrc;
        }

        if (isOpen) {
            show(index);
        } else {
            clearInterval(typingTimer);
        }
    }

    // Mejora progresiva: sin JS, el texto completo queda visible y estos controles no aparecen.
    closeBtn.hidden = false;
    nav.hidden = false;

    toggle.addEventListener("click", () => setOpen(!isOpen));

    closeBtn.addEventListener("click", () => {
        setOpen(false);
        toggle.focus();
    });

    prevBtn.addEventListener("click", () => show(index - 1));
    nextBtn.addEventListener("click", () => show(index + 1));

    bubble.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
            event.preventDefault();
            show(index + 1);
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            show(index - 1);
        } else if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false);
            toggle.focus();
        }
    });

    show(0);

    if (window.matchMedia("(max-width: 600px)").matches) {
        setOpen(false);
    }
});
