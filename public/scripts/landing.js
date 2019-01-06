$(() => {
    $(document).scroll(() => {
        const nav = $("nav");
        nav.toggleClass("scrolled", $(this).scrollTop() > $("body").height() - nav.height());
    })
});