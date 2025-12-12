document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos del DOM
    const carouselContainer = document.querySelector('.image-container-building');
    const imagesContainer = carouselContainer ? carouselContainer.querySelector('.carousel-images') : null;
    const images = imagesContainer ? imagesContainer.querySelectorAll('.building-image') : [];
    const prevBtn = carouselContainer ? carouselContainer.querySelector('#prev-btn') : null;
    const nextBtn = carouselContainer ? carouselContainer.querySelector('#next-btn') : null;
    const indicators = carouselContainer ? carouselContainer.querySelectorAll('.indicator') : [];

    // Comprobación de si hay imágenes (si no hay, salimos del script)
    if (images.length === 0) {
        console.log('No hay imágenes para inicializar el carrusel.');
        return;
    }

    let currentIndex = 0; // Índice de la imagen actualmente visible

    // 2. Función para actualizar el carrusel
    const updateCarousel = () => {
        // Oculta todas las imágenes y desactiva todos los indicadores
        images.forEach(img => img.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));

        // Muestra la imagen actual y activa el indicador actual
        if (images[currentIndex]) {
            images[currentIndex].classList.add('active');
        }
        if (indicators[currentIndex]) {
            indicators[currentIndex].classList.add('active');
        }
    };

    // 3. Manejadores de eventos para los botones
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            // Mueve el índice hacia atrás. Si es la primera, salta a la última.
            currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
            updateCarousel();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            // Mueve el índice hacia adelante. Si es la última, salta a la primera.
            currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
            updateCarousel();
        });
    }

    // 4. Manejador de eventos para los indicadores (navegación directa)
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    // 5. Inicializar: Asegurarse de que solo la primera imagen esté visible al cargar
    updateCarousel(); 
});