# 🎨 ColorPreview — Color & Gradient Previewer

A beautiful, ready-to-launch **Single Page Application** for previewing colors and gradients in real-time. Built with pure HTML, CSS, and JavaScript — no frameworks, no build tools required.

![color_preview](https://img.shields.io/badge/color_preview-v1.0.0-6366f1?style=for-the-badge&logo=css3&logoColor=white)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 🚀 Getting Started

No installation or build process needed.

```bash
# 1. Clone or download the project
git clone https://github.com/yourusername/color_preview.git

# 2. Navigate into the folder
cd color_preview

# 3. Open in browser
open index.html
# or just double-click index.html
```

> ✅ Works in all modern browsers — Chrome, Firefox, Edge, Safari.

---

## 📁 Project Structure

```
color_preview/
├── index.html      # Main HTML structure & layout
├── style.css       # All styles, animations, and themes
├── app.js          # All interactivity and state logic
└── README.md       # You're here!
```

---

## ✨ Features

### 🎛️ Two Previewer Modes
| Mode | Description |
|------|-------------|
| **Single Color** | Pick any hex color with opacity control |
| **Gradient** | Build multi-stop gradients with full control |

---

### 🌈 Gradient Builder
- **Draggable color stops** on an interactive track
- **Click anywhere** on the track to add a new color stop (auto-interpolates the color)
- **Remove stops** (minimum 2 stops enforced)
- Per-stop controls: **color picker**, **hex input**, **position slider**, **opacity slider**
- Supports **Linear** and **Radial** gradient types
- **Angle Wheel** — drag to rotate or type an exact degree value (linear only)

---

### 👁️ 5 Preview Modes
See your color applied to real UI components live:

| Preview Mode | What It Shows |
|---|---|
| **Background** | Full-screen background fill |
| **Button BG** | Button components with normal + hover states |
| **Text Color** | Heading and paragraph text styling |
| **Border** | Card with colored/gradient border |
| **Card** | Card component with colored header |

---

### 🖥️ Fullscreen Previewer
- Click the **expand icon** (top-right of preview panel) to go fullscreen
- All UI controls are hidden for a clean, distraction-free view
- Press the **× button** or hit `Escape` to return to normal view

---

### 📋 Copy CSS
- Click **Copy CSS** to copy the ready-to-use CSS snippet to your clipboard
- The output adapts to the selected preview mode:

```css
/* Example outputs */

/* Background */
background: linear-gradient(90deg, rgba(99,102,241,1) 0%, rgba(168,85,247,1) 100%);

/* Text Color */
background: linear-gradient(90deg, ...);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;

/* Border */
border: 3px solid transparent;
border-image: linear-gradient(90deg, ...) 1;

/* Single Color with opacity */
background-color: rgba(99, 102, 241, 0.75);
```

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| **Font** | [Poppins](https://fonts.google.com/specimen/Poppins) (Google Fonts) |
| **Icons** | [Font Awesome 6](https://fontawesome.com/) |
| **Theme** | Dark glassmorphism |
| **Accent** | `#6366f1` (Indigo) |
| **Background** | `#0a0b0f` with animated mesh orbs |

---

## 🧠 How It Works

### State Management
All app state is held in a single `state` object in `app.js`:
```js
const state = {
  mode: 'single',         // 'single' | 'gradient'
  gradientType: 'linear', // 'linear' | 'radial'
  angle: 90,
  singleColor: '#6366f1',
  singleOpacity: 100,
  stops: [ ... ],         // Array of color stop objects
  activeStopId: 'stop_1',
  previewMode: 'bg',
};
```

### Color Stop Object
```js
{
  id: 'stop_1',
  color: '#6366f1',   // hex color
  position: 0,        // 0–100 (percent)
  opacity: 100        // 0–100
}
```

### CSS Generation
The `buildGradientCss()` and `buildSingleColorCss()` functions generate valid CSS values that are injected into both the live preview and the CSS output box in real time.

---

## 📱 Responsive Design

| Breakpoint | Layout |
|------------|--------|
| **≥ 900px** | Two-column split — controls left, previewer right |
| **< 900px** | Single column — controls stacked above previewer |

---

## 🔧 Customization

### Change the default accent color
In `style.css`, update the `--accent` variable:
```css
:root {
  --accent: #6366f1;        /* Change to any hex */
  --accent-light: #818cf8;  /* Lighter variant */
  --accent-glow: rgba(99, 102, 241, 0.35); /* Glow effect */
}
```

### Add a new Preview Mode
1. Add a chip button in `index.html`
2. Add the mode key to the `labels` object in `setPreviewMode()` in `app.js`
3. Add a `case` block inside the `switch (state.previewMode)` in `applyPreview()`

---

## 🌐 Browser Support

| Browser | Support |
|---------|---------|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Safari 14+ | ✅ Full |
| IE 11 | ❌ Not supported |

---

## 📦 Dependencies (CDN — no install needed)

| Library | Version | Purpose |
|---------|---------|---------|
| [Poppins](https://fonts.google.com/specimen/Poppins) | Latest | Typography |
| [Font Awesome](https://fontawesome.com/) | 6.5.0 | Icons |

Both are loaded via CDN in `index.html`. No `npm install` required.

---

## 📝 License

MIT License — free to use, modify, and distribute for personal and commercial projects.

---

## 🙌 Built With

Made with ❤️ using vanilla HTML, CSS & JavaScript.  
Designed for small business developers and UI/UX designers who need a fast, no-friction color tool.

---

> 💡 **Pro Tip:** Use the CSS output directly in your MERN stack project's inline styles, Tailwind `style` props, or Supabase-powered theming system!
