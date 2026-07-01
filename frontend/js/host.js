document.addEventListener('DOMContentLoaded', () => {
    const guestNameInput = document.getElementById('guestNameInput');
    const generateBtn = document.getElementById('generateBtn');
    const resultBox = document.getElementById('resultBox');
    const generatedLinkEl = document.getElementById('generatedLink');
    const copyBtn = document.getElementById('copyBtn');
    const copyFeedback = document.getElementById('copyFeedback');
    const historyList = document.getElementById('historyList');

    const STORAGE_KEY = 'wedding_guest_links';

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
            const guestLinks = result.data.guestLinks || [];
            
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
                    count: '-',
                    wish: '-'
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
            
            // Merge Wishes
            wishes.forEach(wish => {
                const normalizedName = wish.guestName.trim().toLowerCase();
                const existing = mergedMap.get(normalizedName) || {
                    name: wish.guestName,
                    link: `${baseUrl}/index.html?guestname=${encodeURIComponent(wish.guestName)}`,
                    status: 'pending',
                    count: '-',
                    createdBy: '-',
                    createdAt: null
                };
                
                if (existing.wish && existing.wish !== '-') {
                    existing.wish += `\n---\n${wish.message}`;
                } else {
                    existing.wish = wish.message;
                }
                
                mergedMap.set(normalizedName, existing);
            });
            
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
                        <td class="wish-cell">${guest.wish || '-'}</td>
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

            
        } catch (error) {
            console.error(error);
            document.getElementById('dataGridBody').innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Lỗi tải dữ liệu. Hãy kiểm tra server!</td></tr>';
        }
    };

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
