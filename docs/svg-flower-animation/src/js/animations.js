// This file contains the logic for triggering and controlling the animations for the SVG flower names.

document.addEventListener("DOMContentLoaded", () => {
    const flowerNames = document.querySelectorAll('.flower-name');
    
    flowerNames.forEach((flower, index) => {
        flower.style.opacity = 0; // Start with hidden
        flower.style.transform = 'translateY(20px)'; // Start position

        // Trigger animation after a delay
        setTimeout(() => {
            flower.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            flower.style.opacity = 1; // Fade in
            flower.style.transform = 'translateY(0)'; // Move to original position
        }, index * 200); // Staggered animation
    });
});