// Busco las zonas donde se arma y se guardan las palabras
const respuesta = document.querySelector('#respuesta');
const bancoPalabras = document.querySelector('#bancoPalabras');


// Al hacer click en una palabra del banco, se mueve a la zona de respuesta
bancoPalabras.addEventListener('click', (event) => {  // Agrego un event listener al banco de palabras para detectar clicks en sus elementos
    const palabra = event.target.closest('.palabra'); // Busco la palabra más cercana al elemento clickeado

    if (palabra) {
        respuesta.appendChild(palabra); // Muevo la palabra a la zona de respuesta
        }
    });


    // Al hacer click en una palabra de la zona de respuesta, se mueve de vuelta al banco
    respuesta.addEventListener('click', (event) => {
        const palabra = event.target.closest('.palabra'); // Busco la palabra más cercana al elemento clickeado

        if (palabra) {
            bancoPalabras.appendChild(palabra); // Muevo la palabra de vuelta al banco
        }
    });