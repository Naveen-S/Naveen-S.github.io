/* Naveen S — personal site
 * Theme toggle (light/dark) + IntersectionObserver scroll reveals + footer year
 */

(function () {
    "use strict";

    // ---------- Theme ----------
    var STORAGE_KEY = "naveen-theme";
    var root = document.documentElement;
    var toggleBtn = document.getElementById("theme-toggle");

    function getSystemTheme() {
        return window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }

    function applyTheme(theme) {
        if (theme === "dark") {
            root.setAttribute("data-theme", "dark");
        } else {
            root.removeAttribute("data-theme");
        }
        // Sync the browser chrome color
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute("content", theme === "dark" ? "#0c0c0c" : "#f5f3ee");
        }
    }

    var saved = null;
    try {
        saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) { /* storage may be unavailable */ }

    var initial = saved || getSystemTheme();
    applyTheme(initial);

    if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
            var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
            applyTheme(next);
            try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
        });
    }

    // Follow system changes only if the user hasn't picked one
    if (!saved && window.matchMedia) {
        var mq = window.matchMedia("(prefers-color-scheme: dark)");
        var listener = function (e) { applyTheme(e.matches ? "dark" : "light"); };
        if (mq.addEventListener) mq.addEventListener("change", listener);
        else if (mq.addListener) mq.addListener(listener);
    }

    // ---------- Scroll reveals ----------
    var revealNodes = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window && revealNodes.length) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in");
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

        revealNodes.forEach(function (node) { io.observe(node); });
    } else {
        revealNodes.forEach(function (node) { node.classList.add("in"); });
    }

    // ---------- Footer year ----------
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // ---------- Smooth scroll on anchor clicks (account for the marquee strip) ----------
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener("click", function (e) {
            var id = a.getAttribute("href");
            if (!id || id === "#") return;
            var target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
})();
