const triggerOpen = document.querySelectorAll('[trigger-button]');
const triggerClose = document.querySelectorAll('[trigger-close]');
const overlay = document.querySelectorAll('[data-overlay]');

for (let index = 0; index < triggerOpen.length; index++) {
    let currentId = triggerOpen[index].dataset.target,
    targetEl = document.querySelector(`#${currentId}`);

    const openData = () => {
        targetEl.classList.remove('active');
        overlay.classList.remove('active');
    }
    triggerOpen[index].addEventListener('click', function() {
        console.log('open');
        targetEl.classList.add('active');
        overlay.classList.add('active');
    });
    targetEl.querySelector('[close-button]').addEventListener('click', openData);
    overlay.addEventListener('click', openData);

    console.log(triggerClose);
}