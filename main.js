import './styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


// 2. ELEMENT SEÇİCİLER
const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader'); 

// 3. API FONKSİYONU
function fetchImages(userInput) {
    const API_KEY = '9502846-e36776c567c382242bf5ffcec'; 
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(userInput)}&image_type=photo&orientation=horizontal&safesearch=true`;

    return fetch(url).then(response => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
    });
}

// 4. EKRANA BASMA FONKSİYONU
function renderImages(images) {
    gallery.innerHTML = '';
    const markup = images.map(image => {
        return `
            <li class="gallery-item">
                <a class="gallery-link" href="${image.largeImageURL}"> 
                    <img 
                        class="gallery-image" 
                        src="${image.webformatURL}" 
                        alt="${image.tags}" 
                    />
                </a> <div class="info">
                    <p><b>Likes</b> ${image.likes}</p>
                    <p><b>Views</b> ${image.views}</p>
                    <p><b>Comments</b> ${image.comments}</p>
                    <p><b>Downloads</b> ${image.downloads}</p>
                </div>
            </li>
        `;
    }).join('');
    gallery.innerHTML = markup;
    lightbox.refresh();
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  overlayOpacity: 0.8,
    showCounter: true,
    close: true
});

// 5. OLAY DİNLEYİCİSİ (Submit İşlemi)
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = event.target.elements.query.value.trim();

    if (query === "") {
        iziToast.warning({ message: "Sorry, there are no images matching your search query. Please try again!", position: 'topRight' });
        return;
    }

    // --- LOADER BURADA BAŞLAR ---
    loader.classList.remove('is-hidden');
    gallery.innerHTML = ''; 

    setTimeout(() => {
    fetchImages(query)
        .then(data => {
            if (data.hits.length === 0) {
                iziToast.error({
                    message: "Sorry, there are no images matching your search query. Please try again!",
                    position: 'topRight'
                });
            } else {
                renderImages(data.hits);
            }
        })
        .catch(err => console.log("Hata:", err))
        .finally(() => {
            // --- LOADER BURADA BİTER ---
            loader.classList.add('is-hidden');
            searchForm.reset(); 
        });
        }, 1300);
});