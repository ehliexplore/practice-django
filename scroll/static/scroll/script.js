document.addEventListener('click', event => {
    const element = event.target;
    if (element.className === 'button-hide') {
        element.parentElement.style.animationPlayState = 'running';
        element.parentElement.style.addEventListener('animationend', () => {
            element.parentElement.remove();
        })
    }
})

let counter = 10;

function add_post() {
    const post = document.createElement('div');
    post.className = 'single-post';
    post.innerHTML = `Post ${counter + 1} <button class="button-hide">Hide</button>`;
    counter++;

    document.querySelector('.posts').append(post);
}

window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        add_post();
    }
}