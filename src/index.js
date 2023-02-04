import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const key = '33264104-6177d05b85a0a5034084eaf54';
let url;
let form;
let searchQuery;
let markup;
let page = 1;
const per_page = 40;
let totalPages;
let counter = 0;

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
    refs.btnLoadMore.classList.add('is-hidden');
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
                if(counter > 1) {
                    Notify.info(`Hooray! We found ${result.totalHits} images.`)
                };

                onMarkUp(result);
            };
        })

    counter += 1;

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
            <a class="gallery__item" href="${photoCard.largeImageURL}">
                <img class="gallery__image" src="${photoCard.webformatURL}" alt="${photoCard.tags}" loading="lazy" />
            </a>
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

    const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();
  
    window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
    });

    page += 1;

    let newGallery = new SimpleLightbox('.photo-card a', {
        captionSelector: 'img',
        captionType: 'attr',
        captionPosition: 'bottom',
        captionDelay: '250ms',
    });

    newGallery.on('show.simplelightbox', {});
    newGallery.refresh();

    refs.btnLoadMore.classList.remove('is-hidden');
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