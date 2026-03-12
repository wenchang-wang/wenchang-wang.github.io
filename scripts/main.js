(() => {
    const root = document.documentElement;
    const storageKey = "theme-preference";
    const saved = localStorage.getItem(storageKey);

    if (saved === "light" || saved === "dark") {
        root.setAttribute("data-theme", saved);
    }

    const getEffectiveTheme = () => {
        const forced = root.getAttribute("data-theme");
        if (forced === "light" || forced === "dark") return forced;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };

    const updateToggleLabel = (button) => {
        const mode = root.getAttribute("data-theme") || "auto";
        const effective = getEffectiveTheme();
        if (!button) return;
        button.textContent = effective === "dark" ? "☀️" : "🌙";
        button.setAttribute("aria-label", `Theme mode: ${mode}. Click to switch.`);
        button.setAttribute("title", `Theme: ${mode}`);
    };

    const cycleTheme = () => {
        const current = root.getAttribute("data-theme");
        if (!current || current === "auto") {
            root.setAttribute("data-theme", "light");
            localStorage.setItem(storageKey, "light");
            return;
        }
        if (current === "light") {
            root.setAttribute("data-theme", "dark");
            localStorage.setItem(storageKey, "dark");
            return;
        }
        root.removeAttribute("data-theme");
        localStorage.removeItem(storageKey);
    };

    const bindThemeToggle = () => {
        const button = document.querySelector("[data-theme-toggle]");
        if (!button) return;
        updateToggleLabel(button);
        button.addEventListener("click", () => {
            cycleTheme();
            updateToggleLabel(button);
        });

        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
            if (!root.getAttribute("data-theme")) updateToggleLabel(button);
        });
    };

    const bindNavbarScroll = () => {
        const navbar = document.querySelector(".navbar");
        if (!navbar) return;
        const onScroll = () => {
            if (window.scrollY > 8) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
    };

    const applyReveal = () => {
        const blocks = document.querySelectorAll(".profile-section, .education-section, .awards-section, .cv-section, .research-section, .blog-section, .article-header, .article-content, .page-description");
        blocks.forEach((item, index) => {
            item.classList.add("fade-in");
            item.style.animationDelay = `${Math.min(index * 60, 240)}ms`;
        });
    };

    const bindHeroEffects = () => {
        const hero = document.querySelector(".header-banner");
        if (!hero) return;
        const scrollBtn = hero.querySelector("[data-scroll-next]");
        const target = document.querySelector("#main-content");

        const onScroll = () => {
            const y = Math.max(window.scrollY, 0);
            const viewport = Math.max(window.innerHeight, 1);
            const progressLimit = 0.65;
            const shiftRate = 0.58;
            const shiftCap = 0.58;
            const progress = Math.min(y / (viewport * progressLimit), 1);
            const shift = Math.min(y * shiftRate, viewport * shiftCap);

            hero.style.setProperty("--hero-progress", progress.toFixed(3));
            hero.style.setProperty("--hero-shift", `${shift.toFixed(1)}px`);

            if (y > 8) {
                hero.classList.add("is-scrolling");
            } else {
                hero.classList.remove("is-scrolling");
            }
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });

        if (scrollBtn && target) {
            scrollBtn.addEventListener("click", (event) => {
                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        }
    };

    bindThemeToggle();
    bindNavbarScroll();
    bindHeroEffects();
    applyReveal();
})();
