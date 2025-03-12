document.addEventListener("alpine:init", () => {
    Alpine.data("gallery-old", () => ({
        open: false,
        currentId: null,
        currentSlide: null,
        isScrolling: false,
        scrollTimeout: null,
        init() {
            document.addEventListener("keydown", (e) => {
                switch (e.key) {
                    case "Escape":
                        this.open = false;
                        break;
                    case "ArrowLeft":
                        this.prev();
                        break;
                    case "ArrowRight":
                        this.next();
                        break;
                }
            });
            this.$watch("currentId", (value) => {
                if (!value) return;
                this.currentSlide =
                    document.getElementById(`slide_${value}`) ?? null;
                if (!this.open) {
                    this.open = true;
                }
            });
            this.$watch("currentSlide", (slide) => {
                if (!slide) return;
                this.centerIndicator(slide.dataset.resourceId);
            });
            this.$refs.lightbox.addEventListener("scroll", () => {
                this.isScrolling = true;
                clearTimeout(this.scrollTimeout);
                this.scrollTimeout = setTimeout(() => {
                    this.isScrolling = false;
                }, 100);
            });
        },
        onEscape() {
            this.open = false;
        },
        next() {
            if (!this.currentSlide.nextElementSibling) return;
            const resourceId =
                this.currentSlide.nextElementSibling.dataset.resourceId;
            if (!resourceId) {
                console.warn("no resource id");
                return;
            }
            this.scrollToSlide(resourceId);
        },
        prev() {
            if (!this.currentSlide.previousElementSibling) return;
            const resourceId =
                this.currentSlide.previousElementSibling.dataset.resourceId;
            if (!resourceId) {
                console.warn(
                    "Previous slide not found",
                    this.currentSlide.previousElementSibling
                );
                return;
            }
            this.scrollToSlide(resourceId);
        },
        scrollToSlide(resourceId) {
            if (this.isScrolling) return;
            const lightbox = this.$refs.lightbox;
            const slide = document.getElementById(`slide_${resourceId}`);
            if (!slide) {
                console.warn("Unable to find slide element", resourceId);
                return;
            }
            const scrollPosition = slide.offsetLeft - lightbox.offsetLeft;
            lightbox.scrollTo({
                left: scrollPosition,
                behavior: "smooth",
            });
        },
        centerIndicator(resourceId) {
            const indicators = this.$refs.lightboxIndicators;
            const thumbnail = document.getElementById(
                `LightboxIndicator_${resourceId}`
            );
            if (!thumbnail) {
                console.warn("Unable to find thumbnail element", resourceId);
                return;
            }
            const thumbnailWidth = thumbnail.offsetWidth; // change 10 to gap value const
            scrollLeft = thumbnail.offsetLeft + thumbnailWidth / 2;
            indicators.style.transform = `translateX(calc(50vw + ${-scrollLeft}px))`;
        },
        gallery: {
            ["x-class"]() {
                return this.open ? "opacity-1" : "opacity-[0.5]";
            },
            ["x-ref"]() {
                return "panel";
            },
            ["@click.away"]() {
                this.open = false;
            },
        },
        trigger: {
            ["@click.prevent"](event) {
                const delay = this.open ? 0 : 80;
                this.open = true;
                setTimeout(() => {
                    const { resourceId } =
                        event.target.closest("[data-resource-id]").dataset;
                    if (!resourceId) {
                        console.warn("No resource id found", event);
                        return;
                    }
                    this.scrollToSlide(resourceId);
                }, delay);
            },
        },
        thumbnail: {
            ["@click.prevent"](event) {
                const { resourceId } =
                    event.target.closest("[data-resource-id]").dataset;
                this.scrollToSlide(resourceId);
            },
        },
        nextButton: {
            ["@click.prevent"]() {
                this.next();
            },
            [":disabled"]() {
                return;
            },
        },
        prevButton: {
            ["@click.prevent"]() {
                this.prev();
            },
            [":disabled"]() {
                return;
            },
        },
        indicator: {
            ["@click.prevent"]() {
                const { resourceId } = this.$el.dataset;
                this.scrollToSlide(resourceId);
            },
        },
        indicatorThumbnail: {
            ["@click.prevent"]() {
                const { resourceId } = this.$el.dataset;
                this.scrollToSlide(resourceId);
            },
        },
    }));
});
