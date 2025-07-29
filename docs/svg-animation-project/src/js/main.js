const flowerAnimation = document.getElementById('flower-animation');
const butterflyAnimation = document.getElementById('butterfly-animation');

function startFlowerAnimation() {
    flowerAnimation.classList.add('animate');
}

function startButterflyAnimation() {
    butterflyAnimation.classList.add('animate');
}

document.addEventListener('DOMContentLoaded', () => {
    startFlowerAnimation();
    startButterflyAnimation();
});