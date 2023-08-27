let counter = 10;

function add_post() {
    const post = document.createElement('div');
    post.className = 'single-post';
    post.innerHTML = `Post ${counter + 1} <button class="button-hide">Hide</button>`;
    counter++;
    document.querySelector('.posts').append(post);
    
    console.log(`Button ${counter} created.`)

}

document.addEventListener('click', event => {
    const element = event.target;
    if (element.className === 'button-hide') {

        add_post();

        element.parentElement.style.animationPlayState = 'running';
        element.parentElement.addEventListener('animationend', () => {
            element.parentElement.remove();
            
        })
    }
})


window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        add_post();
    }
}