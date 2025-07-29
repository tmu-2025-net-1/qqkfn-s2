// src/js/app.js

document.addEventListener('DOMContentLoaded', () => {
    const flowerNames = document.querySelectorAll('.flower-name');
    const flowerContainers = document.querySelectorAll('.flower-container');

    flowerContainers.forEach((container, index) => {
        container.addEventListener('mouseenter', () => {
            flowerNames[index].classList.add('animate');
        });

        container.addEventListener('mouseleave', () => {
            flowerNames[index].classList.remove('animate');
        });
    });
});