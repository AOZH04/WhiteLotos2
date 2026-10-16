(function () {
    var header = document.querySelector('.site_header');
    if (!header) return;

    document.addEventListener('click', function (e) {
        if (e.target.closest('.burger')) {
            header.classList.toggle('is_open');
            return;
        }
        if (e.target.closest('.main_nav a')) {
            header.classList.remove('is_open');
            return;
        }
        if (header.classList.contains('is_open') && !e.target.closest('.site_header')) {
            header.classList.remove('is_open');
        }
    });

    window.addEventListener('scroll', function () {
        if (header.classList.contains('is_open')) header.classList.remove('is_open');
    }, { passive: true });
})();

/* Горизонтальные слайдеры со scroll-snap (статьи, отзывы) */
(function () {
    function initSlider(root) {
        var track = root.querySelector('.slider_track');
        var prev = root.querySelector('.slider_prev');
        var next = root.querySelector('.slider_next');
        if (!track || !prev || !next) return;

        function step() {
            var cards = track.children;
            if (!cards.length) return track.clientWidth;
            var ml = parseInt(window.getComputedStyle(cards[1] || cards[0]).marginLeft, 10) || 0;
            return cards[0].getBoundingClientRect().width + ml;
        }

        function update() {
            var max = track.scrollWidth - track.clientWidth;
            prev.disabled = track.scrollLeft <= 8;
            next.disabled = track.scrollLeft >= max - 8;
        }

        prev.addEventListener('click', function () { track.scrollLeft -= step(); });
        next.addEventListener('click', function () { track.scrollLeft += step(); });
        track.addEventListener('scroll', update);
        window.addEventListener('resize', update);
        update();
    }

    var sliders = document.querySelectorAll('.articles_slider, .reviews_slider');
    for (var i = 0; i < sliders.length; i++) initSlider(sliders[i]);
})();

/* Прайс — вертикальные табы */
(function () {
    var tabs = document.querySelector('.price_tabs');
    if (!tabs) return;

    tabs.addEventListener('click', function (e) {
        var tab = e.target.closest('.price_tab');
        if (!tab) return;
        var id = tab.getAttribute('data-tab');
        var all = tabs.querySelectorAll('.price_tab');
        for (var i = 0; i < all.length; i++) all[i].classList.toggle('is_active', all[i] === tab);
        var panels = tabs.querySelectorAll('.price_panel');
        for (var j = 0; j < panels.length; j++) {
            panels[j].classList.toggle('is_active', panels[j].getAttribute('data-panel') === id);
        }
    });
})();

/* Видео-коверфлоу: активный по центру на всю ширину, соседи за контейнером, бесконечный */
(function () {
    var slider = document.querySelector('.video_slider');
    if (!slider) return;

    var slides = Array.prototype.slice.call(slider.querySelectorAll('.video_slide'));
    var prev = slider.querySelector('.video_prev');
    var next = slider.querySelector('.video_next');
    if (slides.length < 2 || !prev || !next) return;

    var n = slides.length;
    var active = 0;

    function resetFrame(slide) {
        var frame = slide.querySelector('.video_frame');
        var iframe = frame.querySelector('iframe');
        if (iframe) iframe.remove();
        var poster = frame.querySelector('.video_poster');
        var play = frame.querySelector('.video_play');
        if (poster) poster.style.display = '';
        if (play) play.style.display = '';
    }

    function render() {
        for (var i = 0; i < n; i++) {
            var d = (i - active + n) % n;
            var cls = 'is_hidden';
            if (d === 0) cls = 'is_active';
            else if (d === 1) cls = 'is_right';
            else if (d === n - 1) cls = 'is_left';
            slides[i].className = 'video_slide ' + cls;
        }
    }

    function go(dir) {
        slides.forEach(resetFrame);
        active = (active + dir + n) % n;
        render();
    }

    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });

    slider.addEventListener('click', function (e) {
        var btn = e.target.closest('.video_play');
        if (!btn) return;
        var slide = btn.closest('.video_slide');
        if (!slide.classList.contains('is_active')) return;
        var id = slide.getAttribute('data-vid');
        var frame = slide.querySelector('.video_frame');
        var poster = frame.querySelector('.video_poster');
        if (poster) poster.style.display = 'none';
        btn.style.display = 'none';
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
        iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        frame.appendChild(iframe);
    });

    render();
})();
