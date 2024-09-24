document.addEventListener("DOMContentLoaded", () => {
  let movies = [];

  // Cargar la información de las películas
  fetch("https://japceibal.github.io/japflix_api/movies-data.json")
    .then(response => response.json())
    .then(data => {
      movies = data; // Guardar los datos de las películas
    })
    .catch(error => console.error("Error al cargar los datos:", error));

  // Evento para el botón de búsqueda
  document.getElementById("btnBuscar").addEventListener("click", () => {
    const query = document.getElementById("inputBuscar").value.toLowerCase().trim();
    
    if (query) { // Verifica que haya texto en el campo de búsqueda
      const results = movies.filter(movie => 
        movie.title.toLowerCase().includes(query) || 
        (movie.genres && movie.genres.some(genre => genre.name.toLowerCase().includes(query))) ||
        (movie.tagline && movie.tagline.toLowerCase().includes(query)) ||
        (movie.overview && movie.overview.toLowerCase().includes(query))
      );

      displayResults(results);
    } else {
      displayResults([]); // Si no hay consulta, mostrar una lista vacía
    }
  });

  // Función para mostrar los resultados
  function displayResults(results) {
    const lista = document.getElementById("lista");
    lista.innerHTML = ""; // Limpiar la lista anterior

    if (results.length === 0) {
      lista.innerHTML = "<li class='list-group-item'>No se encontraron resultados.</li>";
      return;
    }

    results.forEach(movie => {
      const starRating = getStarRating(movie.vote_average);
      const listItem = document.createElement("li");
      listItem.className = "list-group-item";
      listItem.innerHTML = `
        <h5 class="movie-title">${movie.title}</h5>
        <p>${movie.tagline}</p>
        <p>${starRating}</p>
      `;
      
      // Añadir evento de clic para mostrar detalles
      listItem.querySelector('.movie-title').addEventListener("click", () => showMovieDetails(movie, listItem));
      
      lista.appendChild(listItem);
    });
  }

  // Función para mostrar detalles de la película debajo de la película seleccionada
  function showMovieDetails(movie, listItem) {
    // Crear el contenedor de detalles dinámicamente
    const detalleDiv = document.createElement('div');
    detalleDiv.className = 'detalles-adicionales mt-3'; // Clase para estilos adicionales si es necesario

    detalleDiv.innerHTML = `
    <h2>${movie.title}</h2>
    <p>${movie.overview}</p>
    <h5>Géneros:</h5>
    <ul>
      ${movie.genres.map(genre => `<li>${genre.name}</li>`).join('')}
    </ul>
    <div class="text-end mb-2">
      <button class="btn btn-secondary btnMore">More</button>
    </div>
    <div class="detallesAdicionales" style="display: none;">
      <p><strong>Año de lanzamiento:</strong> ${movie.release_date.split("-")[0]}</p>
      <p><strong>Duración:</strong> ${movie.runtime} minutos</p>
      <p><strong>Presupuesto:</strong> $${movie.budget.toLocaleString()}</p>
      <p><strong>Ganancias:</strong> $${movie.revenue.toLocaleString()}</p>
    </div>
  `;
  
    // Eliminar el contenedor de detalles anterior (si ya existía)
    const previousDetail = listItem.querySelector('.detalles-adicionales');
    if (previousDetail) {
      previousDetail.remove();
    }

    // Mostrar el contenedor de detalles debajo del elemento seleccionado
    listItem.appendChild(detalleDiv);

    // Agregar el evento para el botón "More" dentro del contenedor recién creado
    const moreButton = detalleDiv.querySelector('.btnMore');
    moreButton.addEventListener('click', () => {
      const detallesAdicionales = detalleDiv.querySelector('.detallesAdicionales');
      if (detallesAdicionales.style.display === 'none') {
        detallesAdicionales.style.display = 'block';
        moreButton.innerText = 'Less'; // Cambiar texto a "Less"
      } else {
        detallesAdicionales.style.display = 'none';
        moreButton.innerText = 'More'; // Cambiar texto a "More"
      }
    });
  }

  // Función para convertir la calificación a estrellas
  function getStarRating(vote) {
    const stars = Math.round(vote / 2); // Convertir a estrellas (0-10 a 0-5)
    let starHtml = "";
    for (let i = 0; i < 5; i++) {
      if (i < stars) {
        starHtml += '<i class="fa fa-star text-warning"></i>';
      } else {
        starHtml += '<i class="fa fa-star-o text-secondary"></i>';
      }
    }
    return starHtml;
  }
});
