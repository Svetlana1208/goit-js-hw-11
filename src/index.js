import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
    form: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    btnLoadMore: document.querySelector('.load-more'),
};
const params = new URLSearchParams ({
    page: 1,
    per_page: 40,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
})


refs.form.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', searchNext)

function onSearch(e) {
    e.preventDefault();
    refs.gallery.innerHTML = "";
    const form = e.currentTarget;
    const searchQuery = form.elements.searchQuery.value;
    const key = '33264104-6177d05b85a0a5034084eaf54';
    const url = `https://pixabay.com/api/?key=${key}&q=${searchQuery}&fields=webformatURL,largeImageURL,tags,likes,views,comments,downloads&${params}`;
    
    function fetchRequest(request) {
        return fetch(url)
        .then(response => {
        if(!response.ok) {
            throw new Error(response.status);
        }
        return response.json();
    })
} 

    fetchRequest(searchQuery)
        .then(result => {
            if(result.total === 0) {
                refs.btnLoadMore.classList.add('is-hidden');
                Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            }
            else {
                console.log(result.hits);
                const markup = result.hits.map(photoCard =>
                    `<div class="photo-card">
                        <img src="${photoCard.webformatURL}" alt="${photoCard.tags}" loading="lazy" />
                        <div class="info">
                        <p class="info-item">
                            <b>Likes</b>
                            <span>${photoCard.likes}
                        </p>
                        <p class="info-item">
                            <b>Views</b>
                            <span>${photoCard.views}
                        </p>
                        <p class="info-item">
                            <b>Comments</b>
                            <span>${photoCard.comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads</b>
                            <span>${photoCard.downloads}
                        </p>
                    </div>
                  </div>`)
                .join("");

                refs.gallery.insertAdjacentHTML('beforeend', markup);
            };
        })

    refs.btnLoadMore.classList.remove('is-hidden');
}

function searchNext() {
    params.page +=1;

}