document.addEventListener("alpine:init", () => {
    Alpine.data("menuSimple", (type = "static", offset = 0) => ({
        open: false,
        type,
        offset,

        init() {
            const { wrapper, nav } = this.$refs;
            const { clientHeight } = wrapper;
            wrapper.style.height = `${clientHeight}px`;
            if (this.type === "sticky-on-scroll") {
                window.addEventListener("scroll", () => {
                    const { top } = wrapper.getBoundingClientRect();
                    if (top <= this.offset) {
                        nav.style.position = "fixed";
                    } else {
                        nav.removeAttribute("style");
                    }
                });
            }

            this.$watch("open", (value) => {
                if (value) {
                    document.body.classList.add("overflow-hidden");
                } else {
                    document.body.classList.remove("overflow-hidden");
                }
            });
        },

        onWindowScroll() {
            const rect = this.$refs.nav.getBoundingClientRect();
        },

        onEscape() {
            this.open = false;
        },

        wrapper: {},

        trigger: {
            ["@click.prevent"]() {
                this.open = true;
            },
        },

        menu: {
            ["x-show"]() {
                return this.open;
            },
            ["x-ref"]() {
                return "panel";
            },
            ["@click.away"]() {
                this.open = false;
            },
        },
    }));
});
