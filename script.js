document.addEventListener('DOMContentLoaded', function() {
    const galleryData = [
        { id: 1, title: 'Mountain Landscape', category: 'nature', src: 'https://picsum.photos/seed/mountains1/800/600.jpg' },
        { id: 2, title: 'City Skyline', category: 'architecture', src: 'https://picsum.photos/seed/city1/800/600.jpg' },
        { id: 3, title: 'Portrait Photography', category: 'people', src: 'https://picsum.photos/seed/portrait1/800/600.jpg' },
        { id: 4, title: 'Wildlife', category: 'animals', src: 'https://picsum.photos/seed/animals1/800/600.jpg' },
        { id: 5, title: 'Forest Path', category: 'nature', src: 'https://picsum.photos/seed/forest1/800/600.jpg' },
        { id: 6, title: 'Modern Building', category: 'architecture', src: 'https://picsum.photos/seed/building1/800/600.jpg' },
        { id: 7, title: 'Street Life', category: 'people', src: 'https://picsum.photos/seed/street1/800/600.jpg' },
        { id: 8, title: 'Pet Dog', category: 'animals', src: 'https://picsum.photos/seed/dog1/800/600.jpg' },
        { id: 9, title: 'Beach Sunset', category: 'nature', src: 'https://picsum.photos/seed/beach1/800/600.jpg' },
        { id: 10, title: 'Historic Church', category: 'architecture', src: 'https://picsum.photos/seed/church1/800/600.jpg' },
        { id: 11, title: 'Family Portrait', category: 'people', src: 'https://picsum.photos/seed/family1/800/600.jpg' },
        { id: 12, title: 'Exotic Bird', category: 'animals', src: 'https://picsum.photos/seed/bird1/800/600.jpg' }
    ];

    const gallery = document.querySelector('.gallery');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxClose = document.querySelector('.lightbox-close');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterOptionsBtn = document.getElementById('filter-options-btn');
    const filterOptions = document.querySelector('.filter-options');
    const sortSelect = document.getElementById('sort-select');
    const applySortBtn = document.getElementById('apply-sort');

    let currentFilter = 'all';
    let currentFilterEffect = 'none';
    let currentSort = 'default';
    let currentIndex = 0;

    function initGallery() {
        renderGallery();
        setupEventListeners();
    }

    function renderGallery() {
        gallery.innerHTML = '';
        let filteredData = galleryData;

        if (currentFilter !== 'all') {
            filteredData = galleryData.filter(item => item.category === currentFilter);
        }

        switch (currentSort) {
            case 'name-asc':
                filteredData.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc':
                filteredData.sort((a, b) => b.title.localeCompare(a.title));
                break;
            default:
                filteredData.sort((a, b) => a.id - b.id);
        }

        filteredData.forEach((item, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.dataset.id = item.id;

            if (currentFilterEffect !== 'none') {
                galleryItem.classList.add(`filter-${currentFilterEffect}`);
            }

            galleryItem.innerHTML = `
                <img src="${item.src}" alt="${item.title}">
                <div class="overlay">
                    <div class="title">${item.title}</div>
                    <div class="category">${item.category}</div>
                </div>
            `;

            gallery.appendChild(galleryItem);
        });
    }

    function setupEventListeners() {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.dataset.category) {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentFilter = this.dataset.category;
                } else if (this.dataset.filter) {
                    filterBtns.forEach(b => {
                        if (b.dataset.filter) b.classList.remove('active');
                    });
                    this.classList.add('active');
                    currentFilterEffect = this.dataset.filter;
                }
                renderGallery();
            });
        });

        filterOptionsBtn.addEventListener('click', () => {
            filterOptions.classList.toggle('active');
        });

        applySortBtn.addEventListener('click', () => {
            currentSort = sortSelect.value;
            renderGallery();
            filterOptions.classList.remove('active');
        });

        gallery.addEventListener('click', function(e) {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                const id = parseInt(galleryItem.dataset.id);
                const item = galleryData.find(item => item.id === id);
                if (item) {
                    currentIndex = galleryData.findIndex(img => img.id === id);
                    openLightbox(item);
                }
            }
        });

        lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
        lightboxNext.addEventListener('click', () => navigateLightbox(1));
        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            else if (e.key === 'ArrowLeft') navigateLightbox(-1);
            else if (e.key === 'ArrowRight') navigateLightbox(1);
        });
    }

    function openLightbox(item) {
        lightboxImg.src = item.src;
        lightboxCaption.textContent = `${item.title} (${item.category})`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        currentIndex = (currentIndex + direction + galleryData.length) % galleryData.length;
        const item = galleryData[currentIndex];
        lightboxImg.src = item.src;
        lightboxCaption.textContent = `${item.title} (${item.category})`;
    }

    initGallery();
});