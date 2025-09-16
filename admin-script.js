// Admin Panel Manager
class AdminPanelManager {
    constructor() {
        this.data = this.loadData();
        this.init();
    }

    init() {
        this.loadAllData();
        this.setupEventListeners();
        this.showMessage('Admin panel loaded successfully!', 'success');
    }

    loadData() {
        const saved = localStorage.getItem('siteData');
        if (saved) {
            return JSON.parse(saved);
        }

        // Default data structure
        return {
            siteName: 'Your Name',
            bioText: 'Welcome to my personal space',
            profileImage: 'https://via.placeholder.com/150',
            socialLinks: [
                { name: 'GitHub', url: 'https://github.com/username', icon: '🐙' },
                { name: 'Twitter', url: 'https://twitter.com/username', icon: '🐦' },
                { name: 'TikTok', url: 'https://tiktok.com/@username', icon: '🎵' },
                { name: 'Instagram', url: 'https://instagram.com/username', icon: '📷' }
            ],
            mediaItems: [
                { type: 'youtube', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Featured Video' }
            ],
            customContent: [
                { type: 'text', content: 'Add your custom content here!' }
            ]
        };
    }

    saveData() {
        localStorage.setItem('siteData', JSON.stringify(this.data));
        this.showMessage('Data saved successfully!', 'success');
    }

    loadAllData() {
        this.loadGeneralSettings();
        this.loadSocialLinksEditor();
        this.loadMediaEditor();
        this.loadCustomContentEditor();
    }

    loadGeneralSettings() {
        document.getElementById('siteName').value = this.data.siteName || '';
        document.getElementById('bioText').value = this.data.bioText || '';
        document.getElementById('profileImage').value = this.data.profileImage || '';
    }

    loadSocialLinksEditor() {
        const container = document.getElementById('socialLinksEditor');
        container.innerHTML = '';

        this.data.socialLinks.forEach((link, index) => {
            const linkEditor = this.createSocialLinkEditor(link, index);
            container.appendChild(linkEditor);
        });
    }

    createSocialLinkEditor(link, index) {
        const div = document.createElement('div');
        div.className = 'editor-item';
        div.innerHTML = `
            <button class="remove-btn" onclick="removeSocialLink(${index})">×</button>
            <div class="form-row">
                <div class="form-group">
                    <label>Platform Name:</label>
                    <input type="text" value="${link.name}" data-field="name" data-index="${index}">
                </div>
                <div class="form-group">
                    <label>Icon (Emoji):</label>
                    <input type="text" value="${link.icon}" data-field="icon" data-index="${index}" placeholder="🔗">
                </div>
            </div>
            <div class="form-group">
                <label>URL:</label>
                <input type="url" value="${link.url}" data-field="url" data-index="${index}" placeholder="https://example.com">
            </div>
        `;
        return div;
    }

    loadMediaEditor() {
        const container = document.getElementById('mediaEditor');
        container.innerHTML = '';

        this.data.mediaItems.forEach((item, index) => {
            const mediaEditor = this.createMediaEditor(item, index);
            container.appendChild(mediaEditor);
        });
    }

    createMediaEditor(item, index) {
        const div = document.createElement('div');
        div.className = 'editor-item';
        div.innerHTML = `
            <button class="remove-btn" onclick="removeMediaItem(${index})">×</button>
            <div class="form-row">
                <div class="form-group">
                    <label>Media Type:</label>
                    <select data-field="type" data-index="${index}" onchange="updateMediaType(${index})">
                        <option value="youtube" ${item.type === 'youtube' ? 'selected' : ''}>YouTube</option>
                        <option value="tiktok" ${item.type === 'tiktok' ? 'selected' : ''}>TikTok</option>
                        <option value="video" ${item.type === 'video' ? 'selected' : ''}>Video File</option>
                        <option value="image" ${item.type === 'image' ? 'selected' : ''}>Image</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Title:</label>
                    <input type="text" value="${item.title}" data-field="title" data-index="${index}">
                </div>
            </div>
            <div class="form-group">
                <label>URL:</label>
                <input type="url" value="${item.url}" data-field="url" data-index="${index}" 
                       placeholder="${this.getMediaPlaceholder(item.type)}">
            </div>
        `;
        return div;
    }

    getMediaPlaceholder(type) {
        const placeholders = {
            youtube: 'https://www.youtube.com/embed/VIDEO_ID',
            tiktok: 'https://www.tiktok.com/@user/video/ID',
            video: 'https://example.com/video.mp4',
            image: 'https://example.com/image.jpg'
        };
        return placeholders[type] || 'https://example.com';
    }

    loadCustomContentEditor() {
        const container = document.getElementById('contentEditor');
        container.innerHTML = '';

        this.data.customContent.forEach((content, index) => {
            const contentEditor = this.createCustomContentEditor(content, index);
            container.appendChild(contentEditor);
        });
    }

    createCustomContentEditor(content, index) {
        const div = document.createElement('div');
        div.className = 'editor-item';
        div.innerHTML = `
            <button class="remove-btn" onclick="removeCustomContent(${index})">×</button>
            <div class="form-group">
                <label>Content Type:</label>
                <select data-field="type" data-index="${index}" onchange="updateContentType(${index})">
                    <option value="text" ${content.type === 'text' ? 'selected' : ''}>Text</option>
                    <option value="html" ${content.type === 'html' ? 'selected' : ''}>HTML</option>
                </select>
            </div>
            <div class="form-group">
                <label>Content:</label>
                <textarea rows="4" data-field="content" data-index="${index}" 
                          placeholder="Enter your content here...">${content.content}</textarea>
            </div>
        `;
        return div;
    }

    setupEventListeners() {
        // Auto-save on input changes
        document.addEventListener('input', (e) => {
            if (e.target.hasAttribute('data-field')) {
                this.updateDataField(e.target);
            }
        });

        document.addEventListener('change', (e) => {
            if (e.target.hasAttribute('data-field')) {
                this.updateDataField(e.target);
            }
        });
    }

    updateDataField(element) {
        const field = element.getAttribute('data-field');
        const index = element.getAttribute('data-index');
        const value = element.value;

        if (index !== null) {
            const idx = parseInt(index);

            if (element.closest('#socialLinksEditor')) {
                if (!this.data.socialLinks[idx]) this.data.socialLinks[idx] = {};
                this.data.socialLinks[idx][field] = value;
            } else if (element.closest('#mediaEditor')) {
                if (!this.data.mediaItems[idx]) this.data.mediaItems[idx] = {};
                this.data.mediaItems[idx][field] = value;
            } else if (element.closest('#contentEditor')) {
                if (!this.data.customContent[idx]) this.data.customContent[idx] = {};
                this.data.customContent[idx][field] = value;
            }
        }
    }

    showMessage(text, type = 'info') {
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;

        const container = document.querySelector('.admin-container');
        container.insertBefore(message, container.firstChild.nextSibling);

        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 3000);
    }
}

// Global functions - FIXED VERSION
function showTab(tabName, buttonElement) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to clicked button
    if (buttonElement) {
        buttonElement.classList.add('active');
    }
}

function updateGeneral() {
    adminManager.data.siteName = document.getElementById('siteName').value;
    adminManager.data.bioText = document.getElementById('bioText').value;
    adminManager.data.profileImage = document.getElementById('profileImage').value;
    adminManager.saveData();
}

function addSocialLink() {
    const newLink = { name: 'New Platform', url: 'https://example.com', icon: '🔗' };
    adminManager.data.socialLinks.push(newLink);
    adminManager.loadSocialLinksEditor();
}

function removeSocialLink(index) {
    if (confirm('Remove this social link?')) {
        adminManager.data.socialLinks.splice(index, 1);
        adminManager.loadSocialLinksEditor();
        adminManager.saveData();
    }
}

function saveSocialLinks() {
    adminManager.saveData();
}

function addMediaItem() {
    const newMedia = { type: 'youtube', url: '', title: 'New Media' };
    adminManager.data.mediaItems.push(newMedia);
    adminManager.loadMediaEditor();
}

function removeMediaItem(index) {
    if (confirm('Remove this media item?')) {
        adminManager.data.mediaItems.splice(index, 1);
        adminManager.loadMediaEditor();
        adminManager.saveData();
    }
}

function updateMediaType(index) {
    const select = document.querySelector(`[data-field="type"][data-index="${index}"]`);
    const urlInput = document.querySelector(`[data-field="url"][data-index="${index}"]`);
    if (select && urlInput) {
        urlInput.placeholder = adminManager.getMediaPlaceholder(select.value);
    }
}

function saveMediaContent() {
    adminManager.saveData();
}

function addCustomContent() {
    const newContent = { type: 'text', content: 'New content block' };
    adminManager.data.customContent.push(newContent);
    adminManager.loadCustomContentEditor();
}

function removeCustomContent(index) {
    if (confirm('Remove this content block?')) {
        adminManager.data.customContent.splice(index, 1);
        adminManager.loadCustomContentEditor();
        adminManager.saveData();
    }
}

function updateContentType(index) {
    // Refresh the editor when content type changes
    adminManager.loadCustomContentEditor();
}

function saveCustomContent() {
    adminManager.saveData();
}

function exportData() {
    const dataStr = JSON.stringify(adminManager.data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'website-backup.json';
    link.click();
    adminManager.showMessage('Data exported successfully!', 'success');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    adminManager.data = importedData;
                    adminManager.saveData();
                    adminManager.loadAllData();
                    adminManager.showMessage('Data imported successfully!', 'success');
                } catch (error) {
                    adminManager.showMessage('Error importing data!', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function previewSite() {
    window.open('index.html', '_blank');
}

// Initialize admin manager
let adminManager;
document.addEventListener('DOMContentLoaded', () => {
    adminManager = new AdminPanelManager();
});