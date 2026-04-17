/**
 * Profile Card Component Script
 * Handles dynamic updates, image upload, and localStorage persistence
 */

const AVATAR_STORAGE_KEY = 'profileCardAvatar';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    // Load saved avatar from localStorage
    loadAvatarFromStorage();
    
    // Initialize time display
    updateCurrentTime();
    
    // Update time every 500ms for reasonable accuracy
    setInterval(updateCurrentTime, 500);
    
    // Setup avatar upload handler
    setupAvatarUpload();

    // Setup link-style upload trigger
    setupUploadLink();
    
    // Make avatar clickable to trigger upload
    const avatarImg = document.getElementById('profile-avatar');
    if (avatarImg) {
        avatarImg.addEventListener('click', function () {
            document.getElementById('avatar-upload').click();
        });
    }
});

/**
 * Setup the link-style upload trigger
 */
function setupUploadLink() {
    const uploadLink = document.getElementById('upload-profile-link');
    const avatarInput = document.getElementById('avatar-upload');

    if (!uploadLink || !avatarInput) return;

    uploadLink.addEventListener('click', function (event) {
        event.preventDefault();
        avatarInput.click();
    });
}

/**
 * Load avatar from localStorage if available
 */
function loadAvatarFromStorage() {
    const savedAvatar = localStorage.getItem(AVATAR_STORAGE_KEY);
    const avatarImg = document.getElementById('profile-avatar');

    if (!avatarImg) return;

    if (savedAvatar) {
        avatarImg.src = savedAvatar;
        avatarImg.alt = 'User uploaded profile avatar';
    } else {
        avatarImg.src = 'image/potrait.webp';
        avatarImg.alt = 'Default profile avatar photo';
    }
}

/**
 * Setup avatar upload functionality
 */
function setupAvatarUpload() {
    const avatarInput = document.getElementById('avatar-upload');
    if (!avatarInput) return;
    
    avatarInput.addEventListener('change', function (event) {
        handleAvatarUpload(event);
    });
}

/**
 * Handle avatar image upload
 * Converts to base64 and stores in localStorage
 */
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Validate file is an image
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        alert('Image size must be less than 5MB');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function (e) {
        const base64String = e.target.result;
        const avatarImg = document.getElementById('profile-avatar');
        
        if (avatarImg) {
            // Update the image
            avatarImg.src = base64String;
            avatarImg.alt = 'User uploaded profile avatar';
            
            // Save to localStorage
            try {
                localStorage.setItem(AVATAR_STORAGE_KEY, base64String);
                console.log('Avatar Image saved to localStorage');
            } catch (err) {
                console.error('Failed to save avatar to localStorage:', err);
                if (err.name === 'QuotaExceededError') {
                    alert('Storage quota exceeded. Image may be too large.');
                }
            }
        }
    };
    
    reader.onerror = function () {
        alert('Failed to read the image file');
    };
    
    // Read the file as data URL
    reader.readAsDataURL(file);
}

/**
 * Update the current time display with Date.now() in milliseconds
 */
function updateCurrentTime() {
    const timeElement = document.querySelector('[data-testid="test-user-time"]');
    if (timeElement) {
        timeElement.textContent = Date.now();
    }
}

/**
 * Clear stored avatar from localStorage (utility function)
 */
function clearStoredAvatar() {
    localStorage.removeItem(AVATAR_STORAGE_KEY);
    console.log('Avatar cleared from localStorage');
}

/**
 * Log component info for debugging
 */
function logProfileCardInfo() {
    console.log('Profile Card Component Info:');
    console.log('- Current time:', document.querySelector('[data-testid="test-user-time"]').textContent);
    console.log('- User name:', document.querySelector('[data-testid="test-user-name"]').textContent);
    console.log('- User bio:', document.querySelector('[data-testid="test-user-bio"]').textContent);
    console.log('- Avatar src:', document.getElementById('profile-avatar').src);
    console.log('- Avatar alt text:', document.querySelector('[data-testid="test-user-avatar"]').alt);
    console.log('- Social links:', document.querySelectorAll('[data-testid^="test-user-social-"]').length);
    console.log('- Hobbies:', document.querySelectorAll('[data-testid="test-user-hobbies"] li').length);
    console.log('- Dislikes:', document.querySelectorAll('[data-testid="test-user-dislikes"] li').length);
    console.log('- Stored avatar in localStorage:', !!localStorage.getItem(AVATAR_STORAGE_KEY));
}

// Make utilities available in console for testing
window.logProfileCardInfo = logProfileCardInfo;
window.clearStoredAvatar = clearStoredAvatar;
