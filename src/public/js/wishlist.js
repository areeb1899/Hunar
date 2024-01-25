console.log('wishlist connected');

const likeBtn = document.querySelectorAll('.like-button');

async function likeButton(getLikeId,like) {

    try {
        const res = await axios({
            method: 'post',
            url: `/listing/${getLikeId}/like`,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },

        });
        if(like.children[0].classList.contains('fa-solid')){
            like.children[0].classList.remove('fa-solid')
            like.children[0].classList.add('fa-regular')      
        } else {
            like.children[0].classList.remove('fa-regular')      
            like.children[0].classList.add('fa-solid')      

        }
        
    } catch (error) {
        window.location.replace('/login')
        console.log(error.message);
    }

}

for (let like of likeBtn) {
    like.addEventListener('click', () => {
        const getLikeId = like.getAttribute('listing-id');
        likeButton(getLikeId,like);
    });
}
