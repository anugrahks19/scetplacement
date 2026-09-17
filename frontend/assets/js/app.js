/*------------------------------------------------------------------
[App Js]

Template:       DashQ - Bootstrap HTML Admin Dashboard Template

Version:        1.0.0
Last change:    19 June, 2026
-------------------------------------------------------------------*/
(function (window, document) {
    'use strict';

    const DashQ = {
        // --- Configuration & Constants ---
        settings: {
            storagePrefix: "DashQ_admin_",
            keys: {
                mode: "theme_mode",
                preset: "theme_preset",
                primary: "primary_color",
                font: "font_family",
                size: "font_size",
            },
            defaults: {
                mode: "light",
                preset: "theme-indigo",
                font: "inter",
                size: "medium",
                primary: "#573CFB",
            }
        },

        // --- Initialization ---
        init: function () {
            this.root = document.documentElement;
            this.body = document.body;

            this.initThemeMode();
            this.initThemePreset();
            this.initCustomColor();
            this.initTypography();
            this.initBootstrapComponents();
            this.initEventListeners();
            this.initLayoutToggles();
        },

        // --- Storage Helper ---
        getStorage: function (key) {
            return localStorage.getItem(this.settings.storagePrefix + key);
        },

        setStorage: function (key, value) {
            localStorage.setItem(this.settings.storagePrefix + key, value);
        },

        // --- Theme Mode (Light/Dark) ---
        initThemeMode: function () {
            const saved = this.getStorage(this.settings.keys.mode) || this.settings.defaults.mode;
            this.applyThemeMode(saved);

            document.addEventListener('click', (e) => {
                if (e.target.closest('#themeToggle')) {
                    const current = this.root.getAttribute("data-bs-theme");
                    this.applyThemeMode(current === "light" ? "dark" : "light");
                }
            });
        },

        applyThemeMode: function (mode) {
            this.root.setAttribute("data-bs-theme", mode);
            this.setStorage(this.settings.keys.mode, mode);

            const btn = document.getElementById("themeToggle");
            if (btn) {
                btn.innerHTML = mode === "light" ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon"></i>';
            }
        },

        // --- Theme Presets & Custom Primary ---
        initThemePreset: function () {
            const saved = this.getStorage(this.settings.keys.preset) || this.settings.defaults.preset;
            this.applyThemePreset(saved, false);
        },

        applyThemePreset: function (preset, clearCustom = true) {
            if (!preset) return;
            if (clearCustom) localStorage.removeItem(this.settings.storagePrefix + this.settings.keys.primary);

            this.root.setAttribute("data-theme", preset);
            this.setStorage(this.settings.keys.preset, preset);

            // Sync UI active states
            document.querySelectorAll(".theme-swatch").forEach(btn => {
                btn.classList.toggle("active", btn.dataset.theme === preset);
            });
        },

        initCustomColor: function () {
            const saved = this.getStorage(this.settings.keys.primary);
            if (saved) this.applyCustomPrimary(saved);

            // Handle Inputs
            document.addEventListener('input', (e) => {
                if (e.target.id === 'customThemeColor') this.applyCustomPrimary(e.target.value);
            });

            document.addEventListener('change', (e) => {
                if (e.target.id === 'customThemeHex') {
                    let val = e.target.value.trim();
                    if (!val.startsWith('#')) val = '#' + val;
                    if (/^#([0-9A-Fa-f]{3,6})$/.test(val)) {
                        this.applyCustomPrimary(val);
                    }
                }
            });
        },

        applyCustomPrimary: function (hex) {
            this.root.style.setProperty("--bs-primary", hex);
            
            // Convert Hex to RGB for Bootstrap utility classes (very important for ThemeForest)
            const rgb = this.hexToRgb(hex);
            if (rgb) this.root.style.setProperty("--bs-primary-rgb", `${rgb.r}, ${rgb.g}, ${rgb.b}`);

            this.setStorage(this.settings.keys.primary, hex);

            const colorInput = document.getElementById("customThemeColor");
            const hexInput = document.getElementById("customThemeHex");
            if (colorInput) colorInput.value = hex;
            if (hexInput) hexInput.value = hex.toUpperCase();
        },

        // --- Typography ---
        initTypography: function () {
            const font = this.getStorage(this.settings.keys.font) || this.settings.defaults.font;
            const size = this.getStorage(this.settings.keys.size) || this.settings.defaults.size;
            this.applyFont(font);
            this.applySize(size);
        },

        applyFont: function (key) {
            const fonts = {
                inter: '"Inter", system-ui, sans-serif',
                dm: '"DM Sans", system-ui, sans-serif',
                poppins: '"Poppins", system-ui, sans-serif',
                space: '"Space Grotesk", system-ui, sans-serif'
            };
            this.root.style.setProperty("--app-font-family", fonts[key] || fonts.inter);
            this.setStorage(this.settings.keys.font, key);
            this.updatePills(".font-pill", "font", key);
        },

        applySize: function (key) {
            const sizes = { small: 0.9, medium: 1, large: 1.1 };
            this.root.style.setProperty("--font-scale", sizes[key] || 1);
            this.setStorage(this.settings.keys.size, key);
            this.updatePills(".size-pill", "size", key);
        },

        updatePills: function (selector, dataAttr, activeVal) {
            document.querySelectorAll(selector).forEach(p => {
                p.classList.toggle("active", p.dataset[dataAttr] === activeVal);
            });
        },

        // --- Utils & Layout ---
        initLayoutToggles: function () {
            const toggles = [
                { id: "Background_Image", class: "bg-image" },
                { id: "Glass_Effect_Toggle", class: "glass-effect" },
                { id: "Retro_Border_Style", class: "retro-border" }
            ];

            toggles.forEach(t => {
                const el = document.getElementById(t.id);
                if (!el) return;
                const state = this.getStorage(t.id) === "true";
                el.checked = state;
                this.body.classList.toggle(t.class, state);

                el.addEventListener('change', () => {
                    this.body.classList.toggle(t.class, el.checked);
                    this.setStorage(t.id, el.checked);
                });
            });
        },

        initEventListeners: function () {
            // Global Click Handling (Event Delegation)
            document.addEventListener('click', (e) => {
                // Preset Buttons
                const presetBtn = e.target.closest('.theme-swatch');
                if (presetBtn) this.applyThemePreset(presetBtn.dataset.theme);

                // Font/Size Pills
                const fontPill = e.target.closest('.font-pill');
                if (fontPill) this.applyFont(fontPill.dataset.font);

                const sizePill = e.target.closest('.size-pill');
                if (sizePill) this.applySize(sizePill.dataset.size);

                // Submenu Toggle
                const submenuBtn = e.target.closest('[data-bs-toggle="submenu"]');
                if (submenuBtn) {
                    e.preventDefault();
                    submenuBtn.nextElementSibling.classList.toggle("show");
                }

                // Layout Utility Toggles
                if (e.target.closest('.btn-fullscreen-main')) this.body.classList.toggle('app-body-fullscreen');
                if (e.target.closest('.btn-navbar-collapse')) this.body.classList.toggle('body-navbar-collapse');
                if (e.target.closest('.aside-toggle')) document.querySelector('aside')?.classList.toggle('open');

                // Ripple Effect
                const rippleBtn = e.target.closest('.btn-ripple');
                if (rippleBtn) this.createRipple(e, rippleBtn);
            });

            // Scroll Header
            const header = document.querySelector("header");
            window.addEventListener('scroll', () => {
                header?.classList.toggle("scrolled", window.scrollY > 10);
            }, { passive: true });
        },

        // --- Helper: Ripple ---
        createRipple: function (e, btn) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-element');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            btn.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        },

        // --- Helper: Hex to RGB ---
        hexToRgb: function (hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        // --- Third Party Plugins ---
        initBootstrapComponents: function () {
            // Tooltips
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(el => new bootstrap.Tooltip(el));

            // Tab Animations
            document.addEventListener('shown.bs.tab', (e) => {
                const target = document.querySelector(e.target.getAttribute("data-bs-target") || e.target.getAttribute("href"));
                if (!target) return;
                const dir = [...e.target.parentElement.children].indexOf(e.target) > [...e.relatedTarget?.parentElement.children || []].indexOf(e.relatedTarget) ? "right" : "left";
                target.classList.remove("tab-animate-from-right", "tab-animate-from-left");
                void target.offsetWidth; 
                target.classList.add(`tab-animate-from-${dir}`);
            });

            // DateRange
            if (window.jQuery && $.fn.daterangepicker) {
                $('.js-daterange').daterangepicker({ opens: 'left' });
            }
        }
    };

    // Modern layout to Classic version
    document.addEventListener("DOMContentLoaded", function () {
        const toggle = document.getElementById("Classic_View");

        if (toggle) {
            toggle.addEventListener("change", function () {
                document.body.classList.toggle("classic-view", this.checked);
            });
        }
    });

    // LTR to RTL mode toggle
    document.addEventListener("DOMContentLoaded", function () {
        const rtlToggle = document.getElementById("RTL_Mode");

        if (rtlToggle) {
            rtlToggle.addEventListener("change", function () {

                const html = document.documentElement;

                const bootstrapCSS = document.querySelector(
                    'link[href*="bootstrap.min.css"], link[href*="bootstrap.rtl.min.css"]'
                );

                if (!bootstrapCSS) return;

                let currentHref = bootstrapCSS.getAttribute("href");

                if (this.checked) {
                    html.setAttribute("dir", "rtl");
                    bootstrapCSS.setAttribute(
                        "href",
                        currentHref.replace("bootstrap.min.html", "bootstrap.rtl.min.html")
                    );
                } else {
                    html.setAttribute("dir", "ltr");
                    bootstrapCSS.setAttribute(
                        "href",
                        currentHref.replace("bootstrap.rtl.min.html", "bootstrap.min.html")
                    );
                }
            });
        }
    });

    // Run on DOM Ready
    document.addEventListener('DOMContentLoaded', () => DashQ.init());

    // Export to window for external access
    window.DashQ = DashQ;

    // Graceful fallback for all unbound buttons and dead links
    document.addEventListener('click', function(e) {
        let target = e.target.closest('a, button');
        if (!target) return;

        let href = target.getAttribute('href');
        let hasDataToggle = target.hasAttribute('data-bs-toggle');
        let hasOnclick = target.hasAttribute('onclick');
        let type = target.getAttribute('type');
        let id = target.getAttribute('id');
        let isDeadLink = target.tagName === 'A' && (href === '#' || href === 'javascript:void(0)' || !href);
        let isUnboundButton = target.tagName === 'BUTTON' && !hasOnclick && !hasDataToggle && type !== 'submit' && !id;

        if ((isDeadLink && !hasDataToggle && !hasOnclick) || isUnboundButton) {
            e.preventDefault();
            
            // Create a dynamic toast container if it doesn't exist
            let container = document.getElementById('global-toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'global-toast-container';
                container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
                container.style.zIndex = '9999';
                document.body.appendChild(container);
            }

            // Create toast element
            let toastEl = document.createElement('div');
            toastEl.className = 'toast align-items-center text-bg-primary border-0 mb-2';
            toastEl.setAttribute('role', 'alert');
            toastEl.setAttribute('aria-live', 'assertive');
            toastEl.setAttribute('aria-atomic', 'true');
            
            toastEl.innerHTML = `
                <div class="d-flex">
                    <div class="toast-body d-flex align-items-center gap-2">
                        <i class="bi bi-info-circle fs-5"></i>
                        <div>
                            <strong>Action Logged</strong><br>
                            <span class="fs-14">This feature is currently in development and will be activated soon.</span>
                        </div>
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            `;
            
            container.appendChild(toastEl);
            let bsToast = new bootstrap.Toast(toastEl, { delay: 3000 });
            bsToast.show();
            
            // Clean up DOM after hide
            toastEl.addEventListener('hidden.bs.toast', () => {
                toastEl.remove();
            });
        }
    });

    // === SPA ROUTING LOGIC ===
    // This intercepts internal links to maintain the universal shell layout
    
    // Save initial state
    const initialBody = document.querySelector('.app-body') || document.querySelector('.content-wrapper') || document.querySelector('main');
    if (initialBody && !window.history.state) {
        window.history.replaceState({ 
            html: initialBody.innerHTML, 
            className: initialBody.className,
            scripts: [] 
        }, '');
    }

    // Handle deep linking on initial load
    if (window.location.hash && window.location.hash.length > 1) {
        const targetHref = window.location.hash.substring(1);
        fetchAndSwap(targetHref, false);
    }

    async function fetchAndSwap(href, pushToHistory = true) {
        const appBody = document.querySelector('.app-body') || document.querySelector('.content-wrapper') || document.querySelector('main');
        if (!appBody) return false;
        
        appBody.style.opacity = '0.5';

        try {
            const response = await fetch(href);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            const newAppBody = doc.querySelector('.app-body') || doc.querySelector('.content-wrapper') || doc.querySelector('main');
            
            if (newAppBody) {
                appBody.innerHTML = newAppBody.innerHTML;
                appBody.className = newAppBody.className; 
                appBody.style.opacity = '1';
                
                const customScripts = [];
                doc.querySelectorAll('script').forEach(s => {
                    if (s.src && (s.src.includes('vendor/') || s.src.includes('app.js') || s.src.includes('jquery') || s.src.includes('bootstrap'))) return;
                    if (s.innerHTML.includes('document.write')) return;
                    
                    customScripts.push({
                        src: s.getAttribute('src'),
                        innerHTML: s.innerHTML
                    });
                });
                
                if (pushToHistory) {
                    window.history.pushState({ 
                        html: newAppBody.innerHTML, 
                        className: newAppBody.className,
                        scripts: customScripts
                    }, '', '#' + href);
                }
                
                executeScripts(customScripts);
                
                // Close offcanvas if mobile
                const offcanvasMenu = document.getElementById('offcanvasMenu');
                if (offcanvasMenu) {
                    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasMenu);
                    if (bsOffcanvas) bsOffcanvas.hide();
                }
                
                window.scrollTo(0, 0);
                return true;
            }
        } catch (error) {
            console.error('Error fetching page:', error);
            appBody.style.opacity = '1';
        }
        return false;
    }

    function executeScripts(scriptsData) {
        if (!scriptsData || !scriptsData.length) return;
        
        scriptsData.forEach(scriptObj => {
            const newScript = document.createElement('script');
            newScript.className = 'spa-injected-script';
            if (scriptObj.src) {
                newScript.src = scriptObj.src;
            } else if (scriptObj.innerHTML) {
                let code = scriptObj.innerHTML;
                code = code.replace(/\blet\s+/g, 'var ').replace(/\bconst\s+/g, 'var ');
                newScript.appendChild(document.createTextNode(code));
            }
            document.body.appendChild(newScript);
        });
    }

    document.addEventListener('click', async function(e) {
        let target = e.target.closest('a');
        if (!target) return;
        
        let href = target.getAttribute('href');
        if (!href || href === '#' || href.startsWith('javascript:') || href.startsWith('http') || target.hasAttribute('data-bs-toggle') || target.getAttribute('target') === '_blank') {
            return;
        }

        if (href.endsWith('index.html') && !href.includes('dashboard')) {
            return; // Allow logout
        }

        e.preventDefault();
        
        const success = await fetchAndSwap(href, true);
        if (!success) {
            window.location.href = href;
        }
    });

    window.addEventListener('popstate', function(e) {
        const appBody = document.querySelector('.app-body') || document.querySelector('.content-wrapper') || document.querySelector('main');
        if (!appBody) return;
        
        if (e.state && e.state.html) {
            appBody.innerHTML = e.state.html;
            appBody.className = e.state.className;
            executeScripts(e.state.scripts);
        } else {
            if (window.location.hash && window.location.hash.length > 1) {
                fetchAndSwap(window.location.hash.substring(1), false);
            } else {
                window.location.reload();
            }
        }
    });

})(window, document);

