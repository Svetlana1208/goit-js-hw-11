import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const key = '33264104-6177d05b85a0a5034084eaf54';
let url;
let form;
let searchQuery;
let markup;
let page = 1;
const per_page = 40;
let totalPages;

const refs = {
    form: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    btnLoadMore: document.querySelector('.load-more'),
};



refs.form.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', searchNext);

function onSearch(e) {
    e.preventDefault();
    refs.gallery.innerHTML = "";
    form = e.currentTarget;
    searchQuery = form.elements.searchQuery.value;
    page = 1;
    
    fetchRequest(searchQuery)
        .then(result => {
            if(result.total === 0) {
                refs.btnLoadMore.classList.add('is-hidden');
                Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            }
            else {
                onMarkUp(result);
            };
        })

    refs.btnLoadMore.classList.remove('is-hidden');
}

function fetchRequest() {
    const params = new URLSearchParams ({
        page: page,
        per_page: per_page,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
    });

    url = `https://pixabay.com/api/?key=${key}&q=${searchQuery}&fields=webformatURL,largeImageURL,tags,likes,views,comments,downloads&${params}`;

    return fetch(url)
    .then(response => response.json())
}; 

function onMarkUp(result) {
    markup = result.hits.map(photoCard =>
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
      </div>`).join("");

      refs.gallery.insertAdjacentHTML('beforeend', markup);
      page += 1;
}

function searchNext() {
    fetchRequest(searchQuery)
    .then(result => {
        totalPages = result.totalHits / per_page;
        if(page > totalPages) {
            return toggleAlertPopup();
        }             
        
        onMarkUp(result)}
    );
}

function toggleAlertPopup() {
    refs.btnLoadMore.classList.add('is-hidden');
    Notify.failure("We're sorry, but you've reached the end of search results.");
}