# SVG Animation Project

This project is designed to create cross-browser compatible SVG animations that work seamlessly in modern browsers like Firefox and Safari. The animations include a flower and a butterfly, each defined in their respective SVG files.

## Project Structure

```
svg-animation-project
├── src
│   ├── animations
│   │   ├── flower.svg        # SVG animation for a flower
│   │   └── butterfly.svg     # SVG animation for a butterfly
│   ├── css
│   │   ├── styles.css        # General styles for the project
│   │   └── animations.css     # Styles specific to SVG animations
│   ├── js
│   │   ├── main.js           # Main logic for triggering and controlling animations
│   │   └── svg-polyfill.js   # Polyfill for improved SVG compatibility
│   └── index.html            # Entry point for the project
├── docs
│   └── browser-compatibility.md # Information on browser compatibility
├── package.json              # npm configuration file
└── README.md                 # Project documentation
```

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd svg-animation-project
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Open the project**:
   Open `src/index.html` in your preferred web browser to view the SVG animations.

## Features

- Cross-browser compatible SVG animations.
- Customizable styles for animations.
- JavaScript control for triggering animations.
- Polyfill for older browsers to ensure SVGs render correctly.

## Browser Compatibility

For detailed information on browser compatibility, please refer to the `docs/browser-compatibility.md` file.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.