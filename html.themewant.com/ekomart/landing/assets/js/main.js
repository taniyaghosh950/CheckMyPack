! function(e) {
    "use strict";
    let t = window.innerWidth;
    e.exists = function(t) {
        return e(t).length > 0
    }, gsap.registerPlugin(ScrollTrigger, SplitText);
    var o = {
        m: function(e) {
            o.d(), o.methods()
        },
        d: function(t) {
            this._window = e(window), this._document = e(document), this._body = e("body"), this._html = e("html")
        },
        methods: function(e) {
            o.stickyHeader(), o.title_animation(), o.skew_up(), o.gsapAnimationImageScale(), o.imageSlideGsap(), o.sideMenu(), o.mesonaryTab(), o.feedbackCollupsShow()
        },
        stickyHeader: function(t) {
            e(window).scroll(function() {
                e(this).scrollTop() > 150 ? e(".header--sticky").addClass("sticky") : e(".header--sticky").removeClass("sticky")
            })
        },
        title_animation: function() {
            t > 767 && (gsap.registerPlugin(ScrollTrigger), gsap.registerPlugin(SplitText), e(document).ready(function() {
                let t = function() {
                    e(".split-collab").each(function(t) {
                        let o = e(this),
                            i = new SplitText(o, {
                                type: "chars"
                            }),
                            n = i.chars;
                        gsap.timeline({
                            scrollTrigger: {
                                trigger: o,
                                start: "top 85%",
                                end: "top 85%",
                                onComplete: function() {
                                    o.removeClass(".split-collab")
                                }
                            }
                        }).set(o, {
                            opacity: 1
                        }).from(n, {
                            duration: .5,
                            autoAlpha: 0,
                            x: 50,
                            stagger: {
                                amount: 1
                            },
                            ease: "back.out(1)"
                        })
                    })
                };
                t(), window.addEventListener("resize", function(o) {
                    e(window).width() >= 992 && t()
                })
            }))
        },
        skew_up: function() {
            t > 767 && (gsap.registerPlugin(SplitText), e(document).ready(function() {
                let t = function() {
                    e(".skew-up").each(function(t) {
                        new SplitType(e(this), {
                            types: "lines, words",
                            lineClass: "word-line"
                        });
                        let o = e(this),
                            i = o.find(".word-line").find(".word");
                        gsap.timeline({
                            scrollTrigger: {
                                trigger: o,
                                start: "top 85%",
                                end: "top 85%",
                                onComplete: function() {
                                    e(o).removeClass("skew-up")
                                }
                            }
                        }).set(o, {
                            opacity: 1
                        }).from(i, {
                            y: "100%",
                            skewX: "-5",
                            duration: 2,
                            stagger: .09,
                            ease: "expo.out"
                        })
                    })
                };
                t(), window.addEventListener("resize", function(o) {
                    e(window).width() >= 992 && t()
                })
            }), e(document).ready(function() {
                let t = function() {
                    e(".skew-up-2").each(function(t) {
                        let o = e(this),
                            i = new SplitText(o, {
                                type: "chars"
                            }),
                            n = i.chars;
                        gsap.timeline({
                            scrollTrigger: {
                                trigger: o,
                                start: "top 85%",
                                end: "top 85%",
                                onComplete: function() {
                                    o.removeClass("skew-up-2")
                                }
                            }
                        }).set(o, {
                            opacity: 1
                        }).from(n, {
                            duration: .4,
                            autoAlpha: 0,
                            y: 50,
                            stagger: {
                                amount: 1
                            },
                            ease: "back.out(0)"
                        })
                    })
                };
                t(), window.addEventListener("resize", function(o) {
                    e(window).width() >= 992 && t()
                })
            }))
        },
        gsapAnimationImageScale: function(t) {
            e(document).ready(function() {
                if (document.getElementsByClassName("grow").length) {
                    let e = gsap.timeline({
                        scrollTrigger: {
                            trigger: ".grow",
                            scrub: 1,
                            start: "top center",
                            end: "+=1000",
                            ease: "power1.out"
                        }
                    });
                    e.to(".grow", {
                        duration: 1,
                        scale: 1
                    })
                }
            })
        },
        imageSlideGsap: function() {
            gsap.to(".images", {
                scrollTrigger: {
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                },
                x: 330
            }), gsap.to(".images-2", {
                scrollTrigger: {
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                },
                y: 830
            })
        },
        sideMenu: function() {
            e(document).on("click", "#menu-btn", function() {
                e("#side-bar").addClass("show"), e("#anywhere-home").addClass("bgshow")
            }), e(document).on("click", ".close-icon-menu", function() {
                e("#side-bar").removeClass("show"), e("#anywhere-home").removeClass("bgshow")
            }), e(document).on("click", "#anywhere-home", function() {
                e("#side-bar").removeClass("show"), e("#anywhere-home").removeClass("bgshow")
            }), e(document).on("click", ".onepage .mainmenu li a", function() {
                e("#side-bar").removeClass("show"), e("#anywhere-home").removeClass("bgshow")
            })
        },
        mesonaryTab: function() {
            e(window).on("load", function() {
                if (e(".main-isotop").length) {
                    var t = new Isotope(".filter", {
                            itemSelector: ".element-item",
                            layoutMode: "fitRows",
                            fitRows: {
                                equalheight: !0
                            }
                        }),
                        o = {
                            ium: function(e) {
                                return e.querySelector(".name").textContent.match(/ium$/)
                            }
                        };
                    document.querySelector(".filters-button-group").addEventListener("click", function(e) {
                        if (matchesSelector(e.target, "button")) {
                            var i = e.target.getAttribute("data-filter");
                            i = o[i] || i, t.arrange({
                                filter: i
                            })
                        }
                    });
                    for (var i = document.querySelectorAll(".button-group"), n = 0, s = i.length; n < s; n++) r(i[n]);

                    function r(e) {
                        e.addEventListener("click", function(t) {
                            matchesSelector(t.target, "button") && (e.querySelector(".is-checked").classList.remove("is-checked"), t.target.classList.add("is-checked"))
                        })
                    }
                }
                e(".grid-masonary").length && e(".grid-masonary").imagesLoaded(function() {
                    e(".portfolio-filter").on("click", "button", function() {
                        var o = e(this).attr("data-filter");
                        t.isotope({
                            filter: o
                        })
                    });
                    var t = e(".grid-masonary").isotope({
                        itemSelector: ".grid-item-p",
                        percentPosition: !0,
                        masonry: {
                            columnWidth: ".grid-item-p"
                        }
                    })
                }), e(".portfolio-filter button").on("click", function(t) {
                    e(this).siblings(".is-checked").removeClass("is-checked"), e(this).addClass("is-checked"), t.preventDefault()
                })
            })
        },
        feedbackCollupsShow: function() {
            document.addEventListener("DOMContentLoaded", function() {
                var e = document.querySelector(".button-area-box-shadow .rts-btn"),
                    t = document.querySelector(".overlay-bottom-section"),
                    o = !1;
                e && t && e.addEventListener("click", function() {
                    o ? (e.style.margin = "", e.innerHTML = "View All Reviews", t.classList.add("overlay-bottom-section")) : (e.style.margin = "0px auto 0 auto", e.innerHTML = "View Less Reviews", t.classList.remove("overlay-bottom-section")), o = !o
                })
            })
        }
    };
    o.m(), e(document).ready(function() {
        e(".accordion-item .accordion-header").click(function() {
            var t = e(this).parent();
            t.hasClass("active") ? (t.removeClass("active"), t.find(".accordion-content").slideUp(280)) : (e(".accordion-item").removeClass("active"), e(".accordion-item .accordion-content").slideUp(280), t.addClass("active"), t.find(".accordion-content").slideDown(280))
        })
    }), document.querySelectorAll('a[href^="#"]').forEach(e => {
        e.addEventListener("click", function(e) {
            e.preventDefault();
            let t = this.getAttribute("href");
            "#" === t ? window.scrollTo({
                top: 0,
                behavior: "smooth"
            }) : document.querySelector(t).scrollIntoView({
                behavior: "smooth"
            })
        })
    }), e(document).ready(function() {
        e(".working-process-accordion-one .accordion-collapse").on("show.bs.collapse", function() {
            e(this).closest(".accordion-item").addClass("show")
        }), e(".working-process-accordion-one .accordion-collapse").on("hide.bs.collapse", function() {
            e(this).closest(".accordion-item").removeClass("show")
        })
    }), e(".shape-move").mousemove(function(t) {
        var o = e(window).width(),
            i = e(window).height(),
            n = t.pageX - this.offsetLeft,
            s = t.pageY - this.offsetTop,
            r = n - o / 2,
            a = s - i / 2;
        e(".shape-image .shape").each(function() {
            var t = e(this).attr("data-speed");
            e(this).attr("data-revert") && (t *= -1), TweenMax.to(e(this), 1, {
                x: 1 - r * t,
                y: 1 - a * t
            })
        })
    });
    var i = e(window),
        n = e(".scroll-top-btn");
    i.on("scroll", function() {
        i.scrollTop() > 150 ? n.fadeIn() : n.fadeOut()
    }), n.on("click", function() {
        e("html,body").animate({
            scrollTop: 0
        }, 500)
    })
}(jQuery, window);