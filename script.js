// Site Configuration and Data Storage
class SiteManager {
    constructor() {
        this.data = this.loadData();
        this.adminEmail = 'astolfo@femboyo.online'; // Change this to your email
        this.adminPassword = '2009Vojta!'; // Change this to a secure password
        this.verificationCode = '';
        this.init();
    }

    init() {
        this.loadContent();
        this.setupEventListeners();
    }

    loadData() {
        const defaultData = {
            siteName: 'Ari The Puppy',
            bioText: 'Welcome to my bio',
            profileImage: 'https://i.imgur.com/C56TnEk.png',
            socialLinks: [
                { name: 'GitHub', url: 'https://github.com/arionyxx', icon: '📝' },
                { name: 'Twitter', url: 'https://twitter.com/@Arionyx', icon: '🐦' },
                { name: 'TikTok', url: 'https://tiktok.com/@arifemboyo', icon: '🎵' },
                { name: 'Instagram', url: 'https://instagram.com/Arionyx', icon: '📷' }
            ],
            mediaItems: [
                { type: 'youtube', url: 'https://www.youtube.com/embed/oEsnmKspGa4', title: 'CSGO Legacy Astolfo' }
            ],
            customContent: [
                { type: 'text', content: '❤️Hi how are you Cutie❤️' }
            ]
        };

        const saved = localStorage.getItem('siteData');
        return saved ? JSON.parse(saved) : defaultData;
    }

    saveData() {
        localStorage.setItem('siteData', JSON.stringify(this.data));
    }

    loadContent() {
        // Load site name and bio
        document.getElementById('siteName').textContent = this.data.siteName;
        document.getElementById('bioText').textContent = this.data.bioText;
        document.getElementById('profileImage').src = this.data.profileImage;

        // Load social links
        this.loadSocialLinks();

        // Load media content
        this.loadMediaContent();

        // Load custom content
        this.loadCustomContent();
    }

    loadSocialLinks() {
        const container = document.getElementById('socialLinks');
        container.innerHTML = '';

        this.data.socialLinks.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.target = '_blank';
            linkElement.className = 'social-link';
            linkElement.innerHTML = `
                <span class="icon">${link.icon}</span>
                <span>${link.name}</span>
            `;
            container.appendChild(linkElement);
        });
    }

    loadMediaContent() {
        const container = document.getElementById('mediaContainer');
        container.innerHTML = '';

        this.data.mediaItems.forEach(item => {
            const mediaElement = document.createElement('div');
            mediaElement.className = 'media-item';

            let mediaHTML = '';
            if (item.type === 'youtube') {
                mediaHTML = `<iframe src="${item.url}" allowfullscreen></iframe>`;
            } else if (item.type === 'tiktok') {
                // TikTok embed would need their embed code
                mediaHTML = `<iframe src="${item.url}" allowfullscreen></iframe>`;
            } else if (item.type === 'video') {
                mediaHTML = `<video controls><source src="${item.url}" type="video/mp4"></video>`;
            } else if (item.type === 'image') {
                mediaHTML = `<img src="${item.url}" alt="${item.title}">`;
            }

            mediaElement.innerHTML = `
                ${mediaHTML}
                <div class="media-title">${item.title}</div>
            `;
            container.appendChild(mediaElement);
        });
    }

    loadCustomContent() {
        const container = document.getElementById('customContent');
        container.innerHTML = '';

        this.data.customContent.forEach(content => {
            const contentElement = document.createElement('div');
            contentElement.className = 'custom-content-item';

            if (content.type === 'text') {
                contentElement.innerHTML = `<p>${content.content}</p>`;
            } else if (content.type === 'html') {
                contentElement.innerHTML = content.content;
            }

            container.appendChild(contentElement);
        });
    }

    setupEventListeners() {
        document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAdminLogin();
        });
    }

    handleAdminLogin() {
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;

        if (email === this.adminEmail && password === this.adminPassword) {
            // Generate verification code
            this.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

            // In a real implementation, you'd send this via email
            // For now, we'll show it in console and alert
            console.log('Verification code:', this.verificationCode);
            alert(`Verification code (check console): ${this.verificationCode}`);

            document.getElementById('verificationSection').style.display = 'block';
        } else {
            alert('Invalid credentials!');
        }
    }

    verifyCode() {
        const inputCode = document.getElementById('verificationCode').value;

        if (inputCode === this.verificationCode) {
            this.openAdminPanel();
            this.closeAdminLogin();
        } else {
            alert('Invalid verification code!');
        }
    }

    openAdminPanel() {
        // Open admin panel in new window/tab
        const adminWindow = window.open('admin.html', '_blank');

        // Pass data to admin panel (you might want to use postMessage for security)
        adminWindow.addEventListener('load', () => {
            adminWindow.siteManager = this;
        });
    }

    closeAdminLogin() {
        document.getElementById('adminModal').style.display = 'none';
        document.getElementById('adminLoginForm').reset();
        document.getElementById('verificationSection').style.display = 'none';
    }
}

// Global functions for HTML onclick events
function showAdminLogin() {
    document.getElementById('adminModal').style.display = 'block';
}

function closeAdminLogin() {
    siteManager.closeAdminLogin();
}

function verifyCode() {
    siteManager.verifyCode();
}

// Initialize site manager
let siteManager;
document.addEventListener('DOMContentLoaded', () => {
    siteManager = new SiteManager();
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('adminModal');
    if (event.target === modal) {
        closeAdminLogin();
    }
});
