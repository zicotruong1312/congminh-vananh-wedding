document.addEventListener('DOMContentLoaded', () => {

    // --- 0. i18n Dictionary & Logic ---
    const translations = {
        vi: {
            page_title: "Lễ Thành Hôn - Công Minh & Vân Anh",
            couple_names: "Công Minh & Vân Anh",
            ticker_header: "Lời chúc từ khách mời",
            ticker_loading: "Đang tải lời chúc...",
            ticker_empty: "Hãy là người đầu tiên gửi lời chúc!",
            skip_album: "Bỏ qua Album ⏭",
            album_instruction: "Nhấn để xem Album",
            envelope_instruction: "Nhấn để mở phong thư",
            seal_text: "Mời",
            wedding_title: "Lễ Thành Hôn",
            cordially_invited: "Trân trọng kính mời",
            location_name: "Nhà hàng Pavillon Tân Sơn Nhất",
            hall_name: "SẢNH GRAND DIAMOND TẦNG 4",
            location_address: "202 Hoàng Văn Thụ, Phường Đức Nhuận, TPHCM",
            date_text: "18:00 · Chủ Nhật · 18/10/2026",
            news_title: "Nhóm Cập Nhật Thông Tin",
            news_desc: "Quét mã QR dưới đây để tham gia nhóm Facebook cập nhật những thông tin và hình ảnh mới nhất về đám cưới  nhé!",
            confirm_attendance_btn: "Phúc Đáp",
            rsvp_title: "Phúc Đáp",
            rsvp_desc: "Sự hiện diện của Quý khách là niềm vinh hạnh cho gia đình chúng tôi.<br>Kính mong Quý khách vui lòng xác nhận tham dự để gia đình tiếp đón được chu đáo nhất.",
            will_attend: "Sắp xếp tham dự",
            will_not_attend: "Rất tiếc chưa thể tham dự",
            guest_count: "Số thành viên tham dự:",
            absence_reason: "Xin lý do vắng mặt (tuỳ chọn):",
            absence_placeholder: "Nhập lý do...",
            submit_rsvp: "Gửi Phản Hồi",
            back_to_invite: "⟲ Quay lại thiệp mời",
            guestbook_title: "Sổ Lưu Bút",
            guestbook_desc: "Hãy để lại lời chúc tốt đẹp nhất cho cô dâu và chú rể",
            wish_placeholder: "Viết lời chúc của bạn tại đây...",
            submit_wish: "Gửi Lời Chúc",
            guest_fallback: "Quý khách",
            toast_rsvp_attend: "Gia đình vô cùng trân trọng và mong chờ được đón tiếp Quý khách!",
            toast_rsvp_decline: "Gia đình vô cùng tiếc nuối nhưng vẫn trân trọng tình cảm của Quý khách!",
            rsvp_confirm_attend_title: "Chúng tôi rất vui được đón tiếp!",
            rsvp_confirm_attend_msg: "Gia đình Công Minh – Vân Anh xin trân trọng cảm ơn và rất mong được đón tiếp Quý khách trong ngày trọng đại này.",
            rsvp_confirm_decline_title: "Rất tiếc khi vắng bóng Quý khách",
            rsvp_confirm_decline_msg: "Gia đình thấu hiểu và vô cùng trân trọng tình cảm của Quý khách. Cầu chúc Quý khách luôn bình an và hạnh phúc.",
            toast_wish_success: "Gửi lời chúc thành công!",
            toast_error: "Có lỗi xảy ra",
            toast_server_error: "Lỗi kết nối máy chủ",
            card_image: "<img src=\"/gallery/VNI.png\" alt=\"Thiệp cưới\" style=\"width: 100%; height: 100%; object-fit: cover; border-radius: 4px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">",
            open_map_btn: "Bản Đồ 📍",
            invite_guest: "TRÂN TRỌNG KÍNH MỜI",
            scroll_to_explore: "Cuộn để khám phá",
            nav_home: "Trang Chủ",
            nav_gallery: "Khoảnh Khắc",
            nav_baohy: "Báo Hỷ",
            nav_timeline: "Chương Trình",
            nav_card: "Thiệp Cưới",
            nav_location: "Địa Điểm",
            nav_news: "Tham Gia Nhóm",
            nav_rsvp: "Phúc Đáp",
            dear_guest: "Kính gửi",
            click_to_start: "Nhấn để bắt đầu",
            explore: "Khám phá",
            tl_1: "Đón khách & Chụp hình",
            tl_2: "Lễ cưới & Vows",
            tl_3: "Khai tiệc",
            tl_4: "Hát hò · Nhảy múa",
            tl_5: "Kế nhiệm hoa cưới ^^",
            tl_6: "Kết thúc tiệc",
            dresscode_title: "Dress Code",
            color_yellow: "Vàng",
            color_brown: "Nâu",
            color_black: "Đen",
            color_green: "Xanh lá",
            color_white: "Trắng"
        },
        en: {
            page_title: "Wedding Invitation - Cong Minh & Van Anh",
            couple_names: "Cong Minh & Van Anh",
            ticker_header: "Messages from guests",
            ticker_loading: "Loading wishes...",
            ticker_empty: "Be the first to leave a wish!",
            skip_album: "Skip Album ⏭",
            album_instruction: "Tap to view Album",
            envelope_instruction: "Tap to open envelope",
            seal_text: "Invite",
            wedding_title: "Wedding Ceremony",
            cordially_invited: "Cordially Invited",
            location_name: "Tan Son Nhat Pavillon",
            hall_name: "GRAND DIAMOND HALL 4TH FLOOR",
            location_address: "202 Hoang Van Thu, Duc Nhuan Ward, HCMC",
            date_text: "18:00 · Sunday, Oct 18, 2026",
            news_title: "Join Us For News",
            news_desc: "Scan the QR code below to join our Facebook group for the latest updates and photos of our wedding!",
            confirm_attendance_btn: "Confirm Attendance",
            rsvp_title: "Confirm Attendance",
            rsvp_desc: "Your presence is our greatest honor.<br>Please kindly confirm your attendance so we can best prepare for your welcome.",
            will_attend: "Joyfully accept",
            will_not_attend: "Regretfully decline",
            guest_count: "Number of attending members:",
            absence_reason: "Reason for absence (optional):",
            absence_placeholder: "Enter reason...",
            submit_rsvp: "Submit",
            back_to_invite: "⟲ Back to invite",
            guestbook_title: "Guestbook",
            guestbook_desc: "Please leave your warmest wishes for the bride and groom",
            wish_placeholder: "Write your wish here...",
            submit_wish: "Send Wish",
            guest_fallback: "Dear Guest",
            toast_rsvp_attend: "We are deeply honored and look forward to welcoming you!",
            toast_rsvp_decline: "We are deeply regretful but still truly appreciate your warmest wishes!",
            rsvp_confirm_attend_title: "We are delighted to welcome you!",
            rsvp_confirm_attend_msg: "Cong Minh & Van Anh's family sincerely thanks you and looks forward to celebrating this special day together with you.",
            rsvp_confirm_decline_title: "We'll miss you dearly",
            rsvp_confirm_decline_msg: "We deeply understand and truly cherish your kind wishes. May you always be blessed with peace and happiness.",
            toast_wish_success: "Wish sent successfully!",
            toast_error: "An error occurred",
            toast_server_error: "Server connection error",
            card_image: "<img src=\"/gallery/ENG.png\" alt=\"Wedding Invitation\" style=\"width: 100%; height: 100%; object-fit: cover; border-radius: 4px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">",
            open_map_btn: "Map 📍",
            invite_guest: "CORDIALLY INVITES",
            scroll_to_explore: "Scroll to explore",
            nav_home: "Home",
            nav_gallery: "Gallery",
            nav_baohy: "Announcement",
            nav_timeline: "Timeline",
            nav_card: "Invitation",
            nav_location: "Venue",
            nav_news: "Updates",
            nav_rsvp: "Confirm Attendance",
            dear_guest: "Dear",
            click_to_start: "Tap to begin",
            explore: "Explore",
            tl_1: "Welcome & Photos",
            tl_2: "Ceremony & Vows",
            tl_3: "Banquet Starts",
            tl_4: "Singing & Dancing",
            tl_5: "Bouquet Toss",
            tl_6: "Party Ends",
            dresscode_title: "Dress Code",
            color_yellow: "Yellow",
            color_brown: "Brown",
            color_black: "Black",
            color_green: "Green",
            color_white: "White"
        }
    };

    let currentLang = localStorage.getItem('lang') || 'vi';
    let rsvpAttendingState = null; // null = not yet answered, true = attending, false = declining

    // Fallback getter since guestName might not be in URL or change based on lang
    let parsedGuestName = new URLSearchParams(window.location.search).get('guestname');
    if (parsedGuestName) parsedGuestName = decodeURIComponent(parsedGuestName).trim();

    const setLanguage = (lang) => {
        currentLang = lang;
        localStorage.setItem('lang', lang);

        // Update UI buttons
        document.getElementById('lang-vi').classList.toggle('active', lang === 'vi');
        document.getElementById('lang-en').classList.toggle('active', lang === 'en');

        // Update inner text
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });

        // Update guest name
        const guestNameElement = document.getElementById('guest-name');
        if (guestNameElement) {
            guestNameElement.innerText = parsedGuestName ? parsedGuestName : translations[lang].guest_fallback;
        }

        // Document title
        document.title = translations[lang].page_title;

        // Show/hide Báo Hỷ section and its nav dot based on language
        const baohySection = document.getElementById('baohy-section');
        const baohyDot = document.querySelector('.dot-item[data-section="baohy-section"]');
        if (baohySection) baohySection.style.display = (lang === 'en') ? 'none' : '';
        if (baohyDot) baohyDot.style.display = (lang === 'en') ? 'none' : '';

        // Re-apply RSVP confirmation text if already answered
        if (rsvpAttendingState !== null) {
            const confirmTitle = document.getElementById('rsvp-confirm-title');
            const confirmMsg   = document.getElementById('rsvp-confirm-message');
            if (confirmTitle && confirmMsg) {
                if (rsvpAttendingState === true) {
                    confirmTitle.textContent = translations[lang].rsvp_confirm_attend_title;
                    confirmMsg.textContent   = translations[lang].rsvp_confirm_attend_msg;
                } else {
                    confirmTitle.textContent = translations[lang].rsvp_confirm_decline_title;
                    confirmMsg.textContent   = translations[lang].rsvp_confirm_decline_msg;
                }
            }
        }

        // Re-apply live wishes ticker header
        const wishesHeader = document.getElementById('live-wishes-header');
        if (wishesHeader) wishesHeader.textContent = translations[lang].ticker_title || (lang === 'vi' ? 'Lời Chúc Từ Khách Mời' : 'Messages From Guests');
    };

    // Attach Lang events
    document.getElementById('lang-vi').addEventListener('click', () => setLanguage('vi'));
    document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));

    // Init Lang
    setLanguage(currentLang);

    // --- RSVP Constraint: Check if already submitted ---
    if (parsedGuestName) {
        fetch(`/api/rsvp/check?name=${encodeURIComponent(parsedGuestName)}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.hasRsvp) {
                    // Instantly swap form for confirmation panel
                    const formState = document.getElementById('rsvp-form-state');
                    const confirmState = document.getElementById('rsvp-confirmation-state');
                    const confirmIcon = document.getElementById('rsvp-confirm-icon');
                    const confirmTitle = document.getElementById('rsvp-confirm-title');
                    const confirmMsg = document.getElementById('rsvp-confirm-message');
                    
                    if (formState && confirmState) {
                        formState.classList.add('hidden');
                        confirmState.classList.remove('hidden');
                        confirmState.style.display = 'block'; // Reset in case it was modified
                        if (data.data && data.data.isAttending) {
                            rsvpAttendingState = true;
                            confirmIcon.innerHTML = '✓';
                            confirmIcon.style.background = 'linear-gradient(135deg, #1E3F5A, #2e6b9e)';
                            confirmIcon.style.color = '#fff';
                            confirmIcon.style.boxShadow = '0 10px 30px rgba(30,63,90,0.3)';
                            confirmTitle.textContent = translations[currentLang].rsvp_confirm_attend_title;
                            confirmMsg.textContent = translations[currentLang].rsvp_confirm_attend_msg;
                        } else {
                            rsvpAttendingState = false;
                            confirmIcon.innerHTML = '♡';
                            confirmIcon.style.background = 'linear-gradient(135deg, #688f43, #a7c787)';
                            confirmIcon.style.color = '#fff';
                            confirmIcon.style.boxShadow = '0 10px 30px rgba(104,143,67,0.3)';
                            confirmTitle.textContent = translations[currentLang].rsvp_confirm_decline_title;
                            confirmMsg.textContent = translations[currentLang].rsvp_confirm_decline_msg;
                        }
                    }
                }
            })
            .catch(err => console.error('Error checking RSVP:', err));
    }


    // --- 2. Audio Control ---
    const bgMusic = document.getElementById('bg-music');
    if (bgMusic) bgMusic.volume = 0.35; // Set volume to 35% for background ambiance
    const musicToggleBtn = document.getElementById('music-toggle');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');

    let isPlaying = false;

    const toggleMusic = () => {
        if (isPlaying) {
            bgMusic.pause();
            iconPlay.classList.remove('hidden');
            iconPause.classList.add('hidden');
        } else {
            bgMusic.play().catch(e => console.log("Audio play blocked by browser:", e));
            iconPlay.classList.add('hidden');
            iconPause.classList.remove('hidden');
        }
        isPlaying = !isPlaying;
    };

    musicToggleBtn.addEventListener('click', toggleMusic);

    // --- 3. Live Wishes Ticker ---
    const liveWishesScroll = document.getElementById('live-wishes-scroll');
    let wishesData = [];
    let currentWishIndex = 0;
    let tickerInterval;

    const fetchWishes = async () => {
        try {
            const response = await fetch('/api/wishes');
            const result = await response.json();
            if (result.success && result.data.length > 0) {
                wishesData = result.data;
                if (!tickerInterval) startWishesTicker();
            } else {
                liveWishesScroll.innerHTML = `<div class="wish-item active">${translations[currentLang].ticker_empty}</div>`;
            }
        } catch (error) {
            console.error('Error fetching wishes:', error);
        }
    };

    const displayNextWish = () => {
        if (wishesData.length === 0) return;
        const wish = wishesData[currentWishIndex];
        const wishEl = document.createElement('div');
        wishEl.className = 'wish-item';
        wishEl.innerHTML = `<span class="wish-name">${wish.guestName}</span>${wish.message}`;

        liveWishesScroll.appendChild(wishEl);

        // Trigger reflow to ensure transition works
        void wishEl.offsetWidth;
        wishEl.classList.add('active');

        // Scroll to bottom
        liveWishesScroll.scrollTop = liveWishesScroll.scrollHeight;

        // Maintain a maximum of 4 items visible
        const currentItems = liveWishesScroll.querySelectorAll('.wish-item');
        if (currentItems.length > 4) {
            const oldestItem = currentItems[0];
            oldestItem.classList.remove('active');
            oldestItem.classList.add('exit');
            setTimeout(() => {
                if (oldestItem.parentNode) oldestItem.parentNode.removeChild(oldestItem);
            }, 500); // Matches CSS transition duration
        }

        currentWishIndex = (currentWishIndex + 1) % wishesData.length;
    };

    const startWishesTicker = () => {
        if (tickerInterval) clearInterval(tickerInterval);
        liveWishesScroll.innerHTML = '';

        // Display first 3 messages immediately if available
        const initialCount = Math.min(3, wishesData.length);
        for (let i = 0; i < initialCount; i++) {
            displayNextWish();
        }

        tickerInterval = setInterval(displayNextWish, 3000); // Faster ticker for livestream feel
    };

    fetchWishes();

    // Close button for Live Wishes Widget
    const closeWishesBtn = document.getElementById('close-wishes-btn');
    if (closeWishesBtn) {
        closeWishesBtn.addEventListener('click', () => {
            const container = document.getElementById('live-wishes-container');
            if (container) {
                container.style.display = 'none';
                if (tickerInterval) clearInterval(tickerInterval); // Stop ticking in background
            }
        });
    }

    // --- 4. Toast helper ---
    const showToast = (messageKey, isError = false) => {
        const toast = document.getElementById('toast');
        toast.innerText = translations[currentLang][messageKey] || messageKey;
        toast.style.backgroundColor = isError ? '#c0392b' : '#1E3F5A';
        toast.style.color = '#fff';
        toast.classList.remove('hidden');
        // Force reflow so transition fires
        void toast.offsetWidth;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.classList.add('hidden'), 350);
        }, 4000);
    };



    // Lightbox elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightboxBtn = document.querySelector('.lightbox-close');

    const openLightbox = (src) => {
        if (!lightboxImg || !lightbox) return;
        lightboxImg.src = src;
        lightbox.classList.remove('hidden');
    };
    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.classList.add('hidden');
        setTimeout(() => { if (lightboxImg) lightboxImg.src = ''; }, 400);
    };
    if (lightbox) {
        lightbox.addEventListener('click', e => { if (e.target !== lightboxImg) closeLightbox(); });
    }


    // ── CINEMATIC INTRO ──────────────────────────────────────────────────
    const splashScreen = document.getElementById('splash-screen');
    const mainPortfolio = document.getElementById('main-portfolio');

    // Inject guest name from URL
    const introGuestEl = document.getElementById('intro-guest-name');
    if (introGuestEl && parsedGuestName) introGuestEl.textContent = parsedGuestName;

    // Bokeh canvas particles
    (() => {

        const canvas = document.getElementById('bokeh-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resize();
        window.addEventListener('resize', resize);

        const dots = Array.from({ length: 70 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2.5 + 0.8,
            alpha: Math.random() * 0.45 + 0.1,
            vy: Math.random() * 0.35 + 0.08,
            vx: (Math.random() - 0.5) * 0.2,
            pulse: Math.random() * Math.PI * 2
        }));

        let animRunning = true;
        (function draw() {
            if (!animRunning) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dots.forEach(d => {
                d.pulse += 0.012;
                d.y -= d.vy;
                d.x += d.vx;
                const a = d.alpha * (0.55 + 0.45 * Math.sin(d.pulse));
                const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 3.5);
                g.addColorStop(0, `rgba(167, 199, 135,${a})`);
                g.addColorStop(1, `rgba(167, 199, 135,0)`);
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r * 3.5, 0, Math.PI * 2);
                ctx.fillStyle = g;
                ctx.fill();
                if (d.y < -8) { d.y = canvas.height + 8; d.x = Math.random() * canvas.width; }
                if (d.x < -8 || d.x > canvas.width + 8) d.x = Math.random() * canvas.width;
            });
            requestAnimationFrame(draw);
        })();

        // Stop bokeh when transitioning
        splashScreen.addEventListener('click', () => { animRunning = false; }, { once: true });
    })();

    // Click → slide splash UP, reveal portfolio
    let gone = false;
    splashScreen.addEventListener('click', () => {
        if (gone) return;
        gone = true;
        if (!isPlaying) toggleMusic();

        // Slide splash screen upward
        splashScreen.style.transition = 'transform 1s cubic-bezier(0.76,0,0.24,1), opacity 0.4s ease 0.6s';
        splashScreen.style.transform = 'translateY(-100%)';
        splashScreen.style.opacity = '0';

        // Show portfolio underneath
        mainPortfolio.style.display = 'block';
        void mainPortfolio.offsetWidth;
        mainPortfolio.style.opacity = '1';

        // Unhide music controls
        const controls = document.getElementById('controls');
        if (controls) controls.classList.remove('hidden');

        // Cleanup + animate hero
        setTimeout(() => {
            splashScreen.style.display = 'none';
            const liveWishes = document.getElementById('live-wishes-container');
            if (liveWishes) { liveWishes.classList.remove('hidden'); liveWishes.style.transform = 'translateY(0)'; }
            initGlobalScrollAnimations();
            if (window.gsap) {
                gsap.fromTo('#hero-section h1', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, ease: 'power3.out', delay: 0.1 });
                gsap.fromTo('#hero-section p', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, ease: 'power3.out', delay: 0.3 });
                gsap.fromTo('.scroll-indicator', { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.9 });
            }
        }, 1200);
    });
    document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !gone) splashScreen.click(); });



    const initGlobalScrollAnimations = () => {
        // --- 1. Scroll Progress Bar ---
        const progressBar = document.getElementById('scroll-progress');
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            if (progressBar) progressBar.style.width = scrolled + '%';
        });

        // --- 2. Dot Navigation & Intersection Observer ---
        const dotNav = document.getElementById('dot-nav');
        if (dotNav) dotNav.classList.remove('hidden');

        const sections = document.querySelectorAll('section');
        const navDots = document.querySelectorAll('.dot-item');

        const updateActiveDot = () => {
            // Use getBoundingClientRect for real-time positions (works with lazy-loaded images)
            // Find the last section whose top is above 60% of the viewport
            const threshold = window.innerHeight * 0.6;
            let activeId = null;

            sections.forEach(sec => {
                const rect = sec.getBoundingClientRect();
                if (rect.top <= threshold) {
                    activeId = sec.getAttribute('id');
                }
            });

            // If nothing found (user above first section), default to first section with a dot
            if (!activeId && sections.length > 0) {
                activeId = sections[0].getAttribute('id');
            }

            if (activeId) {
                navDots.forEach(dot => {
                    const isTarget = dot.getAttribute('data-section') === activeId;
                    dot.classList.toggle('active', isTarget);
                });
            }
        };

        window.addEventListener('scroll', updateActiveDot, { passive: true });
        updateActiveDot(); // Run once on init

        // Smooth scroll on dot click/touch
        const handleDotClick = (e, dot) => {
            e.preventDefault();
            stopAutoScroll();
            const targetId = dot.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        };

        navDots.forEach(dot => {
            dot.addEventListener('click', (e) => handleDotClick(e, dot));
            dot.addEventListener('touchstart', (e) => handleDotClick(e, dot), { passive: false });
        });

        // Click on "Khám phá" chevron
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.cursor = 'pointer';
            scrollIndicator.addEventListener('click', () => {
                stopAutoScroll();
                const gallerySection = document.getElementById('gallery-section');
                if (gallerySection) gallerySection.scrollIntoView({ behavior: 'smooth' });
            });
        }

        // --- 3. Scroll Reveal Elements ---
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Reveal only once
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));

        // --- 4. Auto-Scroll Logic ---
        let autoScrollTimeout;
        let autoScrollInterval;
        let isAutoScrolling = false;
        const hint = document.getElementById('autoscroll-hint');

        const startAutoScroll = () => {
            if (isAutoScrolling) return;
            // Stop if at bottom already
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) return;
            isAutoScrolling = true;
            if (hint) hint.classList.add('visible');

            autoScrollInterval = setInterval(() => {
                window.scrollBy({ top: 1, left: 0 }); // Very slow smooth scroll

                // Stop if reached bottom
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
                    stopAutoScroll();
                }
            }, 30);
        };

        const stopAutoScroll = () => {
            isAutoScrolling = false;
            clearInterval(autoScrollInterval);
            if (hint) hint.classList.remove('visible');
        };

        // If user interacts, stop auto-scroll and schedule a resume after 3 seconds of idle
        const handleUserInteraction = () => {
            stopAutoScroll();
            clearTimeout(autoScrollTimeout);
            // Resume auto-scroll 3 seconds after user stops interacting
            autoScrollTimeout = setTimeout(startAutoScroll, 3000);
        };

        window.addEventListener('wheel', handleUserInteraction);
        window.addEventListener('touchmove', handleUserInteraction);
        window.addEventListener('mousedown', handleUserInteraction);
        window.addEventListener('keydown', handleUserInteraction);

        // Start auto-scroll immediately when portfolio loads (no delay)
        autoScrollTimeout = setTimeout(startAutoScroll, 2000);

        // --- 5. GSAP Parallax (Keep for Cards if needed) ---
        if (window.gsap && window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
            gsap.fromTo('.card-scene',
                { y: 150, opacity: 0, rotationX: 10 },
                {
                    y: 0, opacity: 1, rotationX: 0, duration: 1.5, ease: 'power3.out', stagger: 0.2,
                    scrollTrigger: { trigger: '#cards-container', start: 'top 80%' }
                }
            );
        }
    };

    // --- PHASE 2: Fetch and Render Masonry Gallery ---
    const loadGallery = async () => {
        try {
            const response = await fetch('/api/gallery');
            if (!response.ok) throw new Error('Network response was not ok');
            let images = await response.json();

            // Randomize but show the entire album as requested
            images = images.sort(() => 0.5 - Math.random());

            const galleryContainer = document.getElementById('masonry-gallery');
            
            // Re-enable the true Masonry layout (like Screenshot 2) using Flexbox Columns
            // This perfectly mimics CSS column-count but mathematically guarantees NO flickering
            galleryContainer.style.display = 'flex';
            galleryContainer.style.flexWrap = 'nowrap';
            galleryContainer.style.gap = '20px';
            galleryContainer.style.columnCount = 'unset'; // Disable buggy CSS multi-column
            
            const numCols = window.innerWidth <= 768 ? 2 : 3;
            const colHeights = Array(numCols).fill(0); // Track heights for perfect bottom balancing
            const cols = Array.from({length: numCols}, () => {
                const col = document.createElement('div');
                col.className = 'masonry-col';
                col.style.display = 'flex';
                col.style.flexDirection = 'column';
                col.style.gap = '20px';
                col.style.flex = '1';
                galleryContainer.appendChild(col);
                return col;
            });

            images.forEach((imgObj) => {
                const imgWrap = document.createElement('div');
                imgWrap.className = 'masonry-item';
                imgWrap.style.marginBottom = '0'; // Gap handles spacing

                const innerWrap = document.createElement('div');
                innerWrap.className = 'masonry-inner';
                innerWrap.style.opacity = '0'; // Prepare for GSAP
                innerWrap.style.width = '100%';

                const img = document.createElement('img');
                img.src = `/thumbnails/${imgObj.name}`;
                img.style.width = '100%';
                img.style.display = 'block';
                img.loading = 'lazy';
                
                // Reserve height before load to prevent column popping
                if (imgObj.width && imgObj.height) {
                    img.style.aspectRatio = `${imgObj.width} / ${imgObj.height}`;
                }

                innerWrap.appendChild(img);
                imgWrap.appendChild(innerWrap);
                imgWrap.addEventListener('click', () => openLightbox(`/gallery/${imgObj.name}`));
                
                // Find the shortest column
                const minColIndex = colHeights.indexOf(Math.min(...colHeights));
                
                // Append to the shortest column to keep the bottom perfectly balanced
                cols[minColIndex].appendChild(imgWrap);
                
                // Update the tracked height of this column
                if (imgObj.width && imgObj.height) {
                    colHeights[minColIndex] += (imgObj.height / imgObj.width);
                } else {
                    colHeights[minColIndex] += 1.5;
                }
            });

            // Wait for images to load before animating
            setTimeout(() => {
                // Initialize VanillaTilt for masonry items
                if (window.VanillaTilt) {
                    VanillaTilt.init(document.querySelectorAll(".masonry-inner"), {
                        max: 10,
                        speed: 400,
                        glare: true,
                        "max-glare": 0.2,
                    });
                }

                // Initialize ScrollTrigger for masonry items
                if (window.gsap && window.ScrollTrigger) {
                    gsap.registerPlugin(ScrollTrigger);
                    gsap.utils.toArray('.masonry-inner').forEach(item => {
                        gsap.fromTo(item,
                            { opacity: 0 },
                            {
                                opacity: 1, duration: 1.0, ease: 'power3.out',
                                scrollTrigger: {
                                    trigger: item.parentElement,
                                    start: 'top 85%',
                                    toggleActions: "play none none none"
                                }
                            }
                        );
                    });
                }
            }, 100);

        } catch (error) {
            console.error('Error loading gallery:', error);
        }
    };
    loadGallery();



    // --- Form Submissions (RSVP and Wish) ---
    const rsvpForm = document.getElementById('rsvp-form');
    const absenceReasonGroup = document.getElementById('absence-reason-group');
    const rsvpRadios = document.querySelectorAll('input[name="isAttending"]');

    rsvpRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'true') {
                absenceReasonGroup.style.display = 'none';
            } else {
                absenceReasonGroup.style.display = 'block';
            }
        });
    });

    rsvpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('rsvp-submit');
        const loader = submitBtn.querySelector('.loader');
        const btnText = submitBtn.querySelector('.btn-text');

        submitBtn.disabled = true; btnText.style.display = 'none'; loader.classList.remove('hidden');

        const formData = new FormData(rsvpForm);
        const isAttending = formData.get('isAttending') === 'true';
        const data = {
            guestName: parsedGuestName || translations[currentLang].guest_fallback,
            isAttending: isAttending,
            guestCount: isAttending ? 1 : 0, // Defaulting to 1 if attending
            absenceReason: isAttending ? '' : (formData.get('absenceReason') || '')
        };

        try {
            const response = await fetch('/api/rsvp', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();

            if (response.ok) {
                // Swap form for confirmation panel
                const formState = document.getElementById('rsvp-form-state');
                const confirmState = document.getElementById('rsvp-confirmation-state');
                const confirmIcon = document.getElementById('rsvp-confirm-icon');
                const confirmTitle = document.getElementById('rsvp-confirm-title');
                const confirmMsg = document.getElementById('rsvp-confirm-message');

                if (isAttending) {
                    rsvpAttendingState = true;
                    confirmIcon.innerHTML = '✓';
                    confirmIcon.style.background = 'linear-gradient(135deg, #1E3F5A, #2e6b9e)';
                    confirmIcon.style.color = '#fff';
                    confirmIcon.style.boxShadow = '0 10px 30px rgba(30,63,90,0.3)';
                    confirmTitle.textContent = translations[currentLang].rsvp_confirm_attend_title;
                    confirmMsg.textContent = translations[currentLang].rsvp_confirm_attend_msg;
                } else {
                    rsvpAttendingState = false;
                    confirmIcon.innerHTML = '♡';
                    confirmIcon.style.background = 'linear-gradient(135deg, #688f43, #a7c787)';
                    confirmIcon.style.color = '#fff';
                    confirmIcon.style.boxShadow = '0 10px 30px rgba(167, 199, 135,0.4)';
                    confirmTitle.textContent = translations[currentLang].rsvp_confirm_decline_title;
                    confirmMsg.textContent = translations[currentLang].rsvp_confirm_decline_msg;
                }

                // Fade out form, fade in confirmation
                formState.style.transition = 'opacity 0.4s ease';
                formState.style.opacity = '0';
                setTimeout(() => {
                    formState.classList.add('hidden');
                    confirmState.classList.remove('hidden');
                    confirmState.style.opacity = '0';
                    confirmState.style.transition = 'opacity 0.5s ease';
                    void confirmState.offsetWidth;
                    confirmState.style.opacity = '1';
                }, 400);
            } else {
                showToast(result.message || 'toast_error', true);
            }
        } catch (error) {
            showToast('toast_server_error', true);
        } finally {
            submitBtn.disabled = false; btnText.style.display = 'inline-block'; loader.classList.add('hidden');
        }
    });

    const wishForm = document.getElementById('wish-form');
    wishForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('wish-submit');
        const loader = submitBtn.querySelector('.loader');
        const btnText = submitBtn.querySelector('.btn-text');

        submitBtn.disabled = true; btnText.style.display = 'none'; loader.classList.remove('hidden');

        const formData = new FormData(wishForm);
        const data = {
            guestName: parsedGuestName || translations[currentLang].guest_fallback,
            message: formData.get('message')
        };

        try {
            const response = await fetch('/api/wishes', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();

            if (response.ok) {
                const wishText = data.message || '';

                // --- Flying Envelope Animation ---
                const flyWish = () => {
                    const submitBtn2 = document.getElementById('wish-submit');
                    const chatContainer = document.getElementById('live-wishes-container');
                    if (!submitBtn2 || !chatContainer) return;

                    const btnRect = submitBtn2.getBoundingClientRect();
                    const chatRect = chatContainer.getBoundingClientRect();

                    // Create the flying envelope element
                    const env = document.createElement('div');
                    env.className = 'flying-wish';
                    const envText = document.createElement('span');
                    envText.className = 'flying-wish-text';
                    envText.textContent = wishText.substring(0, 18) + (wishText.length > 18 ? '…' : '');
                    env.appendChild(envText);

                    // Start at button center
                    const startX = btnRect.left + btnRect.width / 2 - 30;
                    const startY = btnRect.top + btnRect.height / 2 - 22;
                    env.style.left = startX + 'px';
                    env.style.top = startY + 'px';
                    document.body.appendChild(env);

                    // Target: center of live chat widget
                    const endX = chatRect.left + chatRect.width / 2 - 30;
                    const endY = chatRect.top + chatRect.height / 2 - 22;

                    // GSAP curved flight
                    if (window.gsap) {
                        if (window.MotionPathPlugin) gsap.registerPlugin(MotionPathPlugin);
                        gsap.to(env, {
                            duration: 1.1,
                            ease: 'power2.inOut',
                            motionPath: {
                                path: [
                                    { x: 0, y: 0 },
                                    { x: (endX - startX) * 0.3, y: -180 },
                                    { x: endX - startX, y: endY - startY }
                                ],
                                curviness: 1.5
                            },
                            scale: 0.35,
                            opacity: 0.9,
                            rotation: -15,
                            onComplete: () => {
                                env.remove();
                                // Pulse live chat widget
                                chatContainer.classList.add('chat-pulse-anim');
                                setTimeout(() => chatContainer.classList.remove('chat-pulse-anim'), 750);
                                // Reload wishes so new one appears in live chat
                                fetchWishes();
                            }
                        });
                    } else {
                        // Fallback: simple CSS transition
                        env.style.transition = 'all 1.1s cubic-bezier(0.4,0,0.2,1)';
                        env.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0.35)`;
                        env.style.opacity = '0.5';
                        setTimeout(() => { env.remove(); fetchWishes(); }, 1200);
                    }
                };

                wishForm.reset();
                flyWish();
                showToast('toast_wish_success');
            } else {
                showToast(result.message || 'toast_error', true);
            }
        } catch (error) {
            showToast('toast_server_error', true);
        } finally {
            submitBtn.disabled = false; btnText.style.display = 'inline-block'; loader.classList.add('hidden');
        }
    });

    // --- Cinematic Particles Generation ---
    const generateParticles = () => {
        const particlesBg = document.getElementById('particles-bg');
        if (!particlesBg) return;
        const particleCount = window.innerWidth > 768 ? 40 : 20;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            const size = Math.random() * 5 + 2;
            const left = Math.random() * 100;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 10;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}vw`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;

            particlesBg.appendChild(particle);
        }
    };
    generateParticles();



    // --- Image Protection ---
    // Prevent right-click and drag
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

});
