# Profile Card Component

A fully accessible, responsive Profile Card component with **image upload functionality** and **localStorage persistence**. Themed with a modern green and red color scheme matching the Testable Todo app, and laid out in a landscape-style flex arrangement on larger screens.

## ✨ Key Features

✅ **Image Upload with localStorage** — Upload and save profile pictures locally  
✅ **Green & Red Theme** — Modern color scheme matching the Todo app  
✅ **Responsive Design** — Mobile, tablet, and desktop optimized  
✅ **Fully Accessible** — WCAG AA compliant with keyboard navigation  
✅ **Dynamic Time Updates** — Real-time millisecond timestamp (Date.now())  
✅ **Semantic HTML** — Proper structure for accessibility  
✅ **Modern CSS** — Flexbox/Grid with smooth transitions  

## 📋 Core Elements (All Required)

- ✅ **Profile Card Root** (`data-testid="test-profile-card"`) — Semantic `<article>` element
- ✅ **User Name** (`data-testid="test-user-name"`) — Displayed in `<h1>` inside header
- ✅ **User Biography** (`data-testid="test-user-bio"`) — Semantic `<p>` element
- ✅ **Current Time (ms)** (`data-testid="test-user-time"`) — Updates every 500ms via `Date.now()`
- ✅ **Avatar Image** (`data-testid="test-user-avatar"`) — Meaningful alt text, clickable, stored in localStorage
- ✅ **Default Avatar** — Uses the local `image/potrait.webp` file when no uploaded image exists
- ✅ **Upload Link** — "Click to upload or change profile image" with a link-style control
- ✅ **Social Links List** (`data-testid="test-user-social-links"`) — `<nav>` with `<ul>`, includes:
  - `test-user-social-twitter`
  - `test-user-social-github`
  - `test-user-social-linkedin`
  - `test-user-social-instagram`
- ✅ **Hobbies List** (`data-testid="test-user-hobbies"`) — Semantic `<ul>` inside `<section>`
- ✅ **Dislikes List** (`data-testid="test-user-dislikes"`) — Semantic `<ul>` inside `<section>`

## 🎨 Color Scheme

- **Primary Green**: `#168a4b` (accent color, buttons, borders)
- **Danger Red**: `#8b1c1c` (dislikes section)
- **Background**: Light green gradient (#e8f7ef)
- **Card**: White (#ffffff)
- **Text**: Dark green (#183228)
- **Muted**: Medium green (#4b6657)
- **Focus**: Amber (#f59e0b)

## 📸 Image Upload Features

### How It Works
1. Click the avatar image OR the "Click to upload a new profile picture" button
2. Select an image file from your device
3. Image is automatically converted to base64 and stored in browser's localStorage
4. Uploaded image persists even after page refresh

### Validation
- File size limit: 5MB
- Supported formats: All image types (PNG, JPG, GIF, WebP, etc.)
- Error handling for quota exceeded and invalid files

### Storage
- Uses `localStorage` with key: `profileCardAvatar`
- Stores image as base64 data URL
- Survives browser refresh and session restoration

### Default Avatar
- Uses the local `image/potrait.webp` file by default
- Keeps the avatar centered with a crop that focuses on the middle of the image

### Console Utilities (for testing)
```javascript
// Clear stored avatar
clearStoredAvatar()

// Log component info
logProfileCardInfo()
```

## 📁 File Structure

```
Stage-1-task-1b/
├── index.html    — Semantic HTML with image upload
├── index.css     — Green/red theme with responsive design
├── script.js     — Image upload + localStorage + time updates
└── readme.md     — This file
```

## 🚀 Usage

1. Open `index.html` in a web browser
2. The component displays with a default placeholder avatar
3. Click the avatar or the upload link to select an image
4. Select any image file to upload
5. Your image is saved and will persist on page reload
6. Use keyboard (Tab) to navigate through interactive elements

## ♿ Accessibility Features

- ✅ Meaningful alt text on avatar
- ✅ WCAG AA color contrast compliance
- ✅ Full keyboard navigation with visible focus indicators (amber outline)
- ✅ `aria-live="polite"` on time element for screen readers
- ✅ `aria-label` on all interactive elements
- ✅ Semantic HTML structure
- ✅ `.sr-only` class for hidden content
- ✅ Accessible form labels for image upload

## 🧪 Testing

All required `data-testid` attributes are present for automated testing:

```javascript
// Test discovery examples
const card = document.querySelector('[data-testid="test-profile-card"]');
const name = document.querySelector('[data-testid="test-user-name"]');
const time = document.querySelector('[data-testid="test-user-time"]');
const avatar = document.querySelector('[data-testid="test-user-avatar"]');
const socialLinks = document.querySelector('[data-testid="test-user-social-links"]');
const hobbies = document.querySelector('[data-testid="test-user-hobbies"]');
const dislikes = document.querySelector('[data-testid="test-user-dislikes"]');
```

## 📱 Responsive Breakpoints

- **Mobile**: < 480px — Single column, optimized spacing
- **Tablet**: 768px - 1023px — Avatar left, content right (two-column)
- **Desktop**: ≥ 1024px — Spacious layout with larger typography

## 🎨 Customization

### Change User Data
Edit `index.html` to update:
- Name (`.user-name`)
- Bio (`.user-bio`)
- Social links (update `href` and `data-testid`)
- Hobbies and dislikes lists

### Styling
- All colors use CSS variables (`:root`)
- Adjust color scheme by modifying `--accent`, `--danger`, etc.
- Update breakpoints in media queries for different screen sizes
- Modify font-family in base styles (currently uses "Lato")

### Storage Key
Change the localStorage key by editing `AVATAR_STORAGE_KEY` in `script.js`

## 🔧 Technical Details

### Image Upload Flow
1. User selects file via input or clicks avatar
2. FileReader API converts to base64
3. Validation checks file type and size
4. Image stored in `localStorage`
5. DOM updated with new image

### Time Updates
- Updates every 500ms
- Shows current `Date.now()` in milliseconds
- Announced to screen readers via `aria-live`

### Keyboard Navigation
- Tab: Move between elements
- Enter/Space: Activate buttons/links
- Arrow keys: Not required but compatible

## 💾 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers with localStorage support

### localStorage Limitations
- ~5-10MB per origin on most browsers
- Disabled in private/incognito mode (may show warning)
- Persistent across sessions

## 📝 Notes

- Default avatar is the local `image/potrait.webp` image
- Uploaded images can be very large; file size validation prevents storage issues
- For production, consider cloud storage (AWS S3, Firebase, etc.)
- localStorage is domain-specific; moving to different domain clears data
