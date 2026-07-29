document.addEventListener('DOMContentLoaded', () => {
    const guestNameInput = document.getElementById('guestNameInput');
    const generateBtn = document.getElementById('generateBtn');
    const resultBox = document.getElementById('resultBox');
    const generatedLinkEl = document.getElementById('generatedLink');
    const copyBtn = document.getElementById('copyBtn');
    const copyFeedback = document.getElementById('copyFeedback');
    const historyList = document.getElementById('historyList');
    
    let allWishes = [];
    let allGuestLinks = [];

    const STORAGE_KEY = 'wedding_guest_links';

    // --- MODAL LOGIC ---
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        const closeModal = imageModal.querySelector('.close-modal');
        closeModal.addEventListener('click', () => {
            imageModal.style.display = 'none';
        });
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                imageModal.style.display = 'none';
            }
        });
    }

    // --- LOGIN LOGIC ---
    const loginBtn = document.getElementById('loginBtn');
    const hostUsername = document.getElementById('hostUsername');
    const hostPassword = document.getElementById('hostPassword');
    const loginError = document.getElementById('loginError');
    const loginOverlay = document.getElementById('loginOverlay');
    const hostDashboard = document.getElementById('hostDashboard');

    if (localStorage.getItem('hostLoggedIn') === 'true') {
        // If session exists but username is not stored, force re-login to capture it
        if (!localStorage.getItem('hostUsername')) {
            localStorage.removeItem('hostLoggedIn');
            // Stay on login screen (do not show dashboard)
        } else {
            loginOverlay.style.display = 'none';
            hostDashboard.style.display = 'flex';
        }
    }

    const getCreatorDisplayName = (username) => {
        if (username === 'vananh') return 'Vân Anh';
        if (username === 'congminh') return 'Công Minh';
        return username;
    };

    const validateLogin = () => {
        const user = hostUsername.value.trim().toLowerCase();
        const pass = hostPassword.value;
        if ((user === 'congminh' || user === 'vananh') && pass === '181026') {
            localStorage.setItem('hostLoggedIn', 'true');
            localStorage.setItem('hostUsername', user);
            loginOverlay.style.display = 'none';
            hostDashboard.style.display = 'flex';
        } else {
            loginError.style.display = 'block';
        }
    };

    loginBtn.addEventListener('click', validateLogin);
    hostPassword.addEventListener('keypress', (e) => { if (e.key === 'Enter') validateLogin(); });
    hostUsername.addEventListener('keypress', (e) => { if (e.key === 'Enter') hostPassword.focus(); });

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('hostLoggedIn');
            localStorage.removeItem('hostUsername');
            hostDashboard.style.display = 'none';
            loginOverlay.style.display = 'flex';
            // Clear input fields
            if (hostUsername) hostUsername.value = '';
            if (hostPassword) hostPassword.value = '';
            if (loginError) loginError.style.display = 'none';
        });
    }

    // --- TAB LOGIC ---
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            navTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and its content
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
            
            // If gallery tab is clicked, fetch gallery data
            if (targetId === 'tab-gallery') {
                fetchAndRenderGallery();
            }
        });
    });

    // Base URL of the invitation
    const baseUrl = window.location.href.split('host.html')[0].replace(/\/$/, "");

    // Fetch and Render Data
    const fetchAndRenderData = async () => {
        try {
            // 1. Fetch from API
            const response = await fetch('/api/dashboard');
            const result = await response.json();
            
            if (!result.success) throw new Error('Failed to fetch data');
            
            const rsvps = result.data.rsvps || [];
            const wishes = result.data.wishes || [];
            allWishes = wishes; // Store globally for filtering
            
            const guestLinks = result.data.guestLinks || [];
            allGuestLinks = guestLinks; // Store globally for dropdown
            
            // Populate guest filter dropdown
            const guestFilter = document.getElementById('guestWishFilter');
            if (guestFilter) {
                // Keep the current selection if any
                const currentSelection = guestFilter.value;
                guestFilter.innerHTML = '<option value="">-- Tất cả khách mời --</option>';
                allGuestLinks.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.guestName.toLowerCase().trim();
                    option.textContent = item.guestName;
                    guestFilter.appendChild(option);
                });
                if (currentSelection) {
                    guestFilter.value = currentSelection;
                }
            }
            
            // 2. Merge Data - source of truth is guestLinks from DB
            const mergedMap = new Map();
            
            // Add all links from DB first
            guestLinks.forEach(item => {
                const normalizedName = item.guestName.trim().toLowerCase();
                mergedMap.set(normalizedName, {
                    name: item.guestName,
                    link: item.link,
                    createdBy: item.createdBy,
                    createdAt: item.createdAt,
                    status: 'pending',
                    count: '-'
                });
            });
            
            // Merge RSVPs
            rsvps.forEach(rsvp => {
                const normalizedName = rsvp.guestName.trim().toLowerCase();
                const existing = mergedMap.get(normalizedName) || {
                    name: rsvp.guestName,
                    link: `${baseUrl}/index.html?guestname=${encodeURIComponent(rsvp.guestName)}`,
                    createdBy: '-',
                    createdAt: null
                };
                
                existing.status = rsvp.isAttending ? 'attending' : 'not-attending';
                existing.count = rsvp.isAttending ? rsvp.guestCount : 0;
                mergedMap.set(normalizedName, existing);
            });
            
            // We no longer merge wishes into the main table
            
            // 3. Render Table
            const tbody = document.getElementById('dataGridBody');
            tbody.innerHTML = '';
            
            const mergedList = Array.from(mergedMap.values());
            
            if (mergedList.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #999;">Chưa có dữ liệu khách mời</td></tr>';
            } else {
                mergedList.forEach((guest, index) => {
                    const tr = document.createElement('tr');
                    
                    let statusHtml = '';
                    if (guest.status === 'attending') statusHtml = '<span class="status-badge status-attending">Tham dự</span>';
                    else if (guest.status === 'not-attending') statusHtml = '<span class="status-badge status-not-attending">Không thể tham dự</span>';
                    else statusHtml = '<span class="status-badge status-pending">Chưa phản hồi</span>';
                    
                    const createdAtStr = guest.createdAt
                        ? new Date(guest.createdAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : '-';
                    
                    tr.innerHTML = `
                        <td style="font-weight: bold;">${guest.name}</td>
                        <td>${statusHtml}</td>
                        <td style="text-align: center; font-weight: bold;">${guest.count}</td>
                        <td style="white-space: nowrap; color: #555; font-size: 0.85rem;">${guest.createdBy || '-'}</td>
                        <td style="white-space: nowrap; color: #555; font-size: 0.85rem;">${createdAtStr}</td>
                        <td><a href="${guest.link}" target="_blank" style="color: #2E4C7E; text-decoration: none;">Xem thiệp</a></td>
                        <td>
                            <button class="btn-copy-history" data-link="${guest.link}" style="background: none; border: 1px solid #ccc; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Copy</button>
                            <button class="btn-delete-guest" data-name="${guest.name}" style="background: none; border: 1px solid #c62828; color: #c62828; padding: 4px 8px; border-radius: 4px; cursor: pointer; margin-left: 5px;">Xóa</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
                
                // Attach copy events
                document.querySelectorAll('.btn-copy-history').forEach(btn => {
                    btn.addEventListener('click', (e) => copyToClipboard(e.target.dataset.link, e.target));
                });

                // Attach delete events
                document.querySelectorAll('.btn-delete-guest').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const guestName = e.target.dataset.name;
                        if (confirm(`Bạn có chắc muốn xóa dữ liệu phản hồi và lời chúc của "${guestName}" không?\n(Link mời và lịch sử tạo link sẽ vẫn được giữ lại)`)) {
                            try {
                                const res = await fetch(`/api/dashboard/guest/${encodeURIComponent(guestName)}`, {
                                    method: 'DELETE'
                                });
                                const result = await res.json();
                                if (result.success) {
                                    fetchAndRenderData();
                                } else {
                                    alert('Lỗi: ' + result.message);
                                }
                            } catch (error) {
                                console.error(error);
                                alert('Lỗi kết nối tới máy chủ!');
                            }
                        }
                    });
                });
            }
            
            // 5. Update Stats
            document.getElementById('totalGuestsCount').innerText = result.data.totalAttendingGuests || 0;
            document.getElementById('totalLinksCount').innerText = guestLinks.length;

            // 6. Render Wishes independently
            // Use current filter value if set
            const currentGuestFilter = document.getElementById('guestWishFilter');
            const searchTerm = currentGuestFilter ? currentGuestFilter.value : '';
            if (searchTerm) {
                const guestName = currentGuestFilter.options[currentGuestFilter.selectedIndex].text;
                renderWishes(allWishes.filter(wish => wish.guestName.toLowerCase().trim() === searchTerm), guestName);
            } else {
                renderWishes(allWishes);
            }
            
        } catch (error) {
            console.error(error);
            document.getElementById('dataGridBody').innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Lỗi tải dữ liệu. Hãy kiểm tra server!</td></tr>';
        }
    };
    
    // Delete mode state
    let isDeletingWishes = false;
    let selectedWishes = new Set();
    let isDeletingGallery = false;
    let selectedGallery = new Set();

    // Render Wishes logic
    const renderWishes = (wishesArray, selectedGuestName = null) => {
        const tbody = document.getElementById('wishesGridBody');
        tbody.innerHTML = '';
        if (wishesArray.length === 0) {
            if (selectedGuestName) {
                tbody.innerHTML = `
                    <tr>
                        <td style="font-weight: bold; vertical-align: top; border-right: 1px solid #eee; background: #fff;">${selectedGuestName}</td>
                        <td style="padding: 12px 15px; color: #999; font-style: italic;">Chưa có lời chúc nào</td>
                        <td style="font-size: 0.8rem; color: #777; padding: 12px 15px;">-</td>
                    </tr>
                `;
            } else {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #999;">Chưa có lời chúc nào</td></tr>';
            }
            return;
        }
        
        // Group by guestName
        const grouped = new Map();
        wishesArray.forEach(wish => {
            const lowerName = wish.guestName.toLowerCase().trim();
            if (!grouped.has(lowerName)) {
                grouped.set(lowerName, { guestName: wish.guestName, wishes: [], wishIds: [] });
            }
            grouped.get(lowerName).wishes.push(wish);
            grouped.get(lowerName).wishIds.push(wish._id);
        });

        grouped.forEach(group => {
            group.wishes.forEach((wish, index) => {
                const tr = document.createElement('tr');
                tr.className = 'wish-row';
                if (isDeletingWishes) {
                    tr.classList.add('selectable');
                    if (selectedWishes.has(wish._id)) {
                        tr.classList.add('selected');
                    }
                }
                tr.dataset.id = wish._id;
                
                let nameCell = '';
                if (index === 0) {
                    nameCell = `<td rowspan="${group.wishes.length}" style="font-weight: bold; vertical-align: top; border-right: 1px solid #eee; background: #fff;">${group.guestName}</td>`;
                }
                
                const timeStr = wish.createdAt ? new Date(wish.createdAt).toLocaleString('vi-VN') : '-';
                
                tr.innerHTML = `
                    ${nameCell}
                    <td style="padding: 12px 15px;">${wish.message || wish.text || ''}</td>
                    <td style="font-size: 0.8rem; color: #777; padding: 12px 15px;">${timeStr}</td>
                `;
                
                if (isDeletingWishes) {
                    tr.addEventListener('click', () => {
                        const id = tr.dataset.id;
                        if (selectedWishes.has(id)) {
                            selectedWishes.delete(id);
                            tr.classList.remove('selected');
                        } else {
                            selectedWishes.add(id);
                            tr.classList.add('selected');
                        }
                        updateWishDeleteConfirmBtn();
                    });
                }
                
                tbody.appendChild(tr);
            });
        });
    };

    // Filter wishes
    const guestWishFilter = document.getElementById('guestWishFilter');
    if (guestWishFilter) {
        guestWishFilter.addEventListener('change', (e) => {
            const searchTerm = e.target.value;
            if (!searchTerm) {
                renderWishes(allWishes);
            } else {
                const guestName = e.target.options[e.target.selectedIndex].text;
                const filteredWishes = allWishes.filter(wish => wish.guestName.toLowerCase().trim() === searchTerm);
                renderWishes(filteredWishes, guestName);
            }
        });
    }

    // Wish Action Buttons
    const enterDeleteWishBtn = document.getElementById('enterDeleteWishBtn');
    const confirmDeleteWishBtn = document.getElementById('confirmDeleteWishBtn');
    const cancelDeleteWishBtn = document.getElementById('cancelDeleteWishBtn');

    const updateWishDeleteConfirmBtn = () => {
        let totalCount = selectedWishes.size;
        confirmDeleteWishBtn.innerText = `Xong (${totalCount})`;
        confirmDeleteWishBtn.disabled = totalCount === 0;
        if (totalCount === 0) {
            confirmDeleteWishBtn.style.opacity = '0.5';
        } else {
            confirmDeleteWishBtn.style.opacity = '1';
        }
    };

    if (enterDeleteWishBtn) {
        enterDeleteWishBtn.addEventListener('click', () => {
            isDeletingWishes = true;
            selectedWishes.clear();
            enterDeleteWishBtn.style.display = 'none';
            confirmDeleteWishBtn.style.display = 'block';
            cancelDeleteWishBtn.style.display = 'block';
            updateWishDeleteConfirmBtn();
            
            // Re-render to show selectable rows
            const searchTerm = guestWishFilter ? guestWishFilter.value : '';
            if (searchTerm) {
                const guestName = guestWishFilter.options[guestWishFilter.selectedIndex].text;
                renderWishes(allWishes.filter(wish => wish.guestName.toLowerCase().trim() === searchTerm), guestName);
            } else {
                renderWishes(allWishes);
            }
        });
        
        cancelDeleteWishBtn.addEventListener('click', () => {
            isDeletingWishes = false;
            selectedWishes.clear();
            enterDeleteWishBtn.style.display = 'block';
            confirmDeleteWishBtn.style.display = 'none';
            cancelDeleteWishBtn.style.display = 'none';
            
            // Re-render to hide selectable rows
            const searchTerm = guestWishFilter ? guestWishFilter.value : '';
            if (searchTerm) {
                const guestName = guestWishFilter.options[guestWishFilter.selectedIndex].text;
                renderWishes(allWishes.filter(wish => wish.guestName.toLowerCase().trim() === searchTerm), guestName);
            } else {
                renderWishes(allWishes);
            }
        });
        
        confirmDeleteWishBtn.addEventListener('click', async () => {
            if (selectedWishes.size === 0) return;
            let totalCount = selectedWishes.size;
            let allIds = Array.from(selectedWishes);
            
            if (confirm(`Bạn có chắc muốn xóa ${totalCount} lời chúc này không?`)) {
                try {
                    for (const id of allIds) {
                        await fetch(`/api/dashboard/wish/${id}`, { method: 'DELETE' });
                    }
                    alert('Đã xóa thành công!');
                    
                    isDeletingWishes = false;
                    selectedWishes.clear();
                    enterDeleteWishBtn.style.display = 'block';
                    confirmDeleteWishBtn.style.display = 'none';
                    cancelDeleteWishBtn.style.display = 'none';
                    
                    fetchAndRenderData(); // refresh data
                } catch (error) {
                    console.error(error);
                    alert('Lỗi kết nối tới máy chủ khi xóa!');
                }
            }
        });
    }

    // GALLERY LOGIC
    const fetchAndRenderGallery = async () => {
        const grid = document.getElementById('galleryGrid');
        grid.innerHTML = '<p style="text-align: center; color: #999; grid-column: 1 / -1;">Đang tải ảnh...</p>';
        try {
            const res = await fetch('/api/gallery');
            const images = await res.json();
            
            grid.innerHTML = '';
            if (images.length === 0) {
                grid.innerHTML = '<p style="text-align: center; color: #999; grid-column: 1 / -1;">Chưa có ảnh nào trong Gallery.</p>';
                return;
            }
            
            images.forEach(img => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                if (isDeletingGallery) {
                    item.classList.add('selectable');
                    if (selectedGallery.has(img.name)) {
                        item.classList.add('selected');
                    }
                }
                item.innerHTML = `
                    <img src="/thumbnails/${img.name}" alt="Gallery Image" loading="lazy" class="gallery-img-view" data-full="/gallery/${img.name}">
                `;
                grid.appendChild(item);
            });
            
            // Attach view image events or selection events
            const imageModal = document.getElementById('imageModal');
            const modalImageSrc = document.getElementById('modalImageSrc');
            
            document.querySelectorAll('.gallery-img-view').forEach(img => {
                img.addEventListener('click', (e) => {
                    if (isDeletingGallery) {
                        const filename = e.target.dataset.full.split('/').pop();
                        const parent = e.target.closest('.gallery-item');
                        if (selectedGallery.has(filename)) {
                            selectedGallery.delete(filename);
                            parent.classList.remove('selected');
                        } else {
                            selectedGallery.add(filename);
                            parent.classList.add('selected');
                        }
                        updateGalleryDeleteConfirmBtn();
                    } else {
                        modalImageSrc.src = e.target.dataset.full;
                        imageModal.style.display = 'flex';
                    }
                });
            });
        } catch (err) {
            console.error(err);
            grid.innerHTML = '<p style="text-align: center; color: red; grid-column: 1 / -1;">Lỗi khi tải danh sách ảnh.</p>';
        }
    };

    // Gallery Action Buttons
    const enterDeleteGalleryBtn = document.getElementById('enterDeleteGalleryBtn');
    const confirmDeleteGalleryBtn = document.getElementById('confirmDeleteGalleryBtn');
    const cancelDeleteGalleryBtn = document.getElementById('cancelDeleteGalleryBtn');

    const updateGalleryDeleteConfirmBtn = () => {
        confirmDeleteGalleryBtn.innerText = `Xong (${selectedGallery.size})`;
        confirmDeleteGalleryBtn.disabled = selectedGallery.size === 0;
        if (selectedGallery.size === 0) {
            confirmDeleteGalleryBtn.style.opacity = '0.5';
        } else {
            confirmDeleteGalleryBtn.style.opacity = '1';
        }
    };

    if (enterDeleteGalleryBtn) {
        enterDeleteGalleryBtn.addEventListener('click', () => {
            isDeletingGallery = true;
            selectedGallery.clear();
            enterDeleteGalleryBtn.style.display = 'none';
            confirmDeleteGalleryBtn.style.display = 'block';
            cancelDeleteGalleryBtn.style.display = 'block';
            updateGalleryDeleteConfirmBtn();
            fetchAndRenderGallery();
        });
        
        cancelDeleteGalleryBtn.addEventListener('click', () => {
            isDeletingGallery = false;
            selectedGallery.clear();
            enterDeleteGalleryBtn.style.display = 'block';
            confirmDeleteGalleryBtn.style.display = 'none';
            cancelDeleteGalleryBtn.style.display = 'none';
            fetchAndRenderGallery();
        });
        
        confirmDeleteGalleryBtn.addEventListener('click', async () => {
            if (selectedGallery.size === 0) return;
            if (confirm(`Bạn có chắc muốn xóa ${selectedGallery.size} ảnh này không?`)) {
                try {
                    for (const filename of selectedGallery) {
                        await fetch(`/api/gallery/${filename}`, { method: 'DELETE' });
                    }
                    alert('Đã xóa thành công!');
                    
                    isDeletingGallery = false;
                    selectedGallery.clear();
                    enterDeleteGalleryBtn.style.display = 'block';
                    confirmDeleteGalleryBtn.style.display = 'none';
                    cancelDeleteGalleryBtn.style.display = 'none';
                    
                    fetchAndRenderGallery(); // refresh data
                } catch (error) {
                    console.error(error);
                    alert('Lỗi kết nối tới máy chủ khi xóa!');
                }
            }
        });
    }

    // Upload logic
    const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
    const uploadPhotoInput = document.getElementById('uploadPhotoInput');
    const uploadStatus = document.getElementById('uploadStatus');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    
    if (uploadPhotoInput && fileNameDisplay) {
        uploadPhotoInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                fileNameDisplay.textContent = e.target.files[0].name;
                fileNameDisplay.style.color = '#333';
                fileNameDisplay.style.fontWeight = 'bold';
            } else {
                fileNameDisplay.textContent = 'Chưa chọn ảnh nào';
                fileNameDisplay.style.color = '#666';
                fileNameDisplay.style.fontWeight = 'normal';
            }
        });
    }

    if (uploadPhotoBtn && uploadPhotoInput) {
        uploadPhotoBtn.addEventListener('click', async () => {
            if (!uploadPhotoInput.files || uploadPhotoInput.files.length === 0) {
                alert('Vui lòng chọn ảnh để tải lên!');
                return;
            }
            const file = uploadPhotoInput.files[0];
            
            const formData = new FormData();
            formData.append('image', file);
            
            uploadStatus.style.display = 'inline';
            uploadPhotoBtn.disabled = true;
            
            try {
                const res = await fetch('/api/gallery/upload', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                if (data.success) {
                    uploadPhotoInput.value = ''; // clear input
                    if (fileNameDisplay) {
                        fileNameDisplay.textContent = 'Chưa chọn ảnh nào';
                        fileNameDisplay.style.color = '#666';
                        fileNameDisplay.style.fontWeight = 'normal';
                    }
                    fetchAndRenderGallery();
                } else {
                    alert('Lỗi: ' + data.message);
                }
            } catch (err) {
                console.error(err);
                alert('Có lỗi xảy ra khi tải ảnh lên.');
            } finally {
                uploadStatus.style.display = 'none';
                uploadPhotoBtn.disabled = false;
            }
        });
    }

    const copyToClipboard = (text, buttonElement) => {
        navigator.clipboard.writeText(text).then(() => {
            if (buttonElement.id === 'copyBtn') {
                copyFeedback.style.display = 'inline';
                setTimeout(() => copyFeedback.style.display = 'none', 2000);
            } else {
                const originalText = buttonElement.innerText;
                buttonElement.innerText = 'Đã copy!';
                buttonElement.style.color = 'green';
                setTimeout(() => {
                    buttonElement.innerText = originalText;
                    buttonElement.style.color = '';
                }, 2000);
            }
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Không thể copy link, vui lòng copy thủ công!');
        });
    };

    generateBtn.addEventListener('click', async () => {
        const name = guestNameInput.value.trim();
        if (!name) {
            alert('Vui lòng nhập tên khách mời!');
            return;
        }

        // Generate Link
        const link = `${baseUrl}/index.html?guestname=${encodeURIComponent(name)}`;
        
        // Show in UI
        generatedLinkEl.innerText = link;
        resultBox.classList.add('active');

        // Save to server DB with creator info
        const username = localStorage.getItem('hostUsername') || '';
        const createdBy = getCreatorDisplayName(username);
        try {
            const saveRes = await fetch('/api/dashboard/link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guestName: name, link, createdBy })
            });
            if (!saveRes.ok) {
                const errData = await saveRes.json();
                console.error('Failed to save guest link:', errData);
            }
        } catch (err) {
            console.error('Failed to save guest link:', err);
        }
        
        // Refresh list immediately
        await fetchAndRenderData();
        
        // Clear input
        guestNameInput.value = '';
    });

    copyBtn.addEventListener('click', () => {
        copyToClipboard(generatedLinkEl.innerText, copyBtn);
    });
    
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            if (confirm('Bạn có chắc chắn muốn xóa lịch sử các link đã tạo không? (Lưu ý: Không ảnh hưởng đến dữ liệu khách đã phản hồi trên server)')) {
                localStorage.removeItem(STORAGE_KEY);
                fetchAndRenderData();
            }
        });
    }

    // Init
    fetchAndRenderData();
});
