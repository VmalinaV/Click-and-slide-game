const rightArrow = document.querySelector('#right-arrow');
const leftArrow = document.querySelector('#left-arrow');
const sliderImages = document.querySelector('#image-container').querySelectorAll('img');

export let slider = {
    currentSlide: 0,
    nextSlide: () => {
        if (slider.currentSlide >= sliderImages.length - 1) {
            slider.currentSlide = 0;
            sliderImages[slider.currentSlide].scrollIntoView();
        }
        slider.currentSlide++;

        sliderImages[slider.currentSlide].scrollIntoView({ behavior: 'smooth' });

        document.querySelector('img.active').classList.remove('active');
        sliderImages[slider.currentSlide].classList.add('active');
    },
    previousSlide: () => {
        if (slider.currentSlide <= 0) {
            slider.currentSlide = sliderImages.length - 1;
            sliderImages[slider.currentSlide].scrollIntoView();
        }
        slider.currentSlide--;

        sliderImages[slider.currentSlide].scrollIntoView({ behavior: 'smooth' });

        document.querySelector('img.active').classList.remove('active');
        sliderImages[slider.currentSlide].classList.add('active');
    },
    addClickListeners: () => {
        rightArrow.addEventListener('click', slider.nextSlide);
        leftArrow.addEventListener('click', slider.previousSlide);
        rightArrow.classList.remove('disabled');
        leftArrow.classList.remove('disabled');
    },
    removeClickListeners: () => {
        rightArrow.removeEventListener('click', slider.nextSlide);
        leftArrow.removeEventListener('click', slider.previousSlide);
        rightArrow.classList.add('disabled');
        leftArrow.classList.add('disabled');
    }
};