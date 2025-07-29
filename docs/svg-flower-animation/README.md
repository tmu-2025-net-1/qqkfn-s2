# SVG Flower Animation Project

This project showcases an interactive flower animation using SVG graphics. The flowers' names are animated to enhance the visual experience, and the project is designed to be compatible with modern web browsers, including Firefox and Safari.

## Project Structure

```
svg-flower-animation
├── src
│   ├── index.html          # Main HTML document
│   ├── css
│   │   ├── style.css       # Main styles for the application
│   │   └── animations.css   # CSS animations for SVG flower names
│   ├── js
│   │   ├── app.js          # Initializes the application and manages SVG display
│   │   ├── animations.js    # Logic for triggering and controlling animations
│   │   └── browser-compatibility.js # Polyfills for browser compatibility
│   ├── svg
│   │   ├── flowers         # SVG representations of flowers
│   │   ├── text            # SVG text representations of flower names
│   │   └── icons           # SVG icons for custom cursors
│   ├── images              # Fallback images for flowers
│   └── data
│       └── flowers.json    # JSON data related to flowers
├── dist                    # Build output directory
├── package.json            # npm configuration file
├── webpack.config.js       # Webpack configuration file
├── .babelrc                # Babel configuration file
├── .browserslistrc         # Target browsers configuration
└── README.md               # Project documentation
```

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd svg-flower-animation
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the development server**:
   ```
   npm start
   ```

4. **Build the project for production**:
   ```
   npm run build
   ```

## Usage

Open `src/index.html` in your web browser to view the interactive flower animations. Hover over the flowers to see their names animate.

## Compatibility

This project includes polyfills and feature detections to ensure that animations work correctly in Firefox and Safari. 

## Contributing

Feel free to submit issues or pull requests to improve the project. 

## License

This project is licensed under the MIT License.