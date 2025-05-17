
export function setupCreate(activateCreateButton, detailElementsCreate, searchContainer, buttonContainer, detailContainer, selectedPersonDni) {
  activateCreateButton.addEventListener('click', function () {
    document.querySelector('.edit-delete-person-section').classList.add('d-none');
    document.querySelector('.create-person-section').classList.remove('d-none');
    detailElementsCreate.selectPlace.innerHTML = "";
    detailElementsCreate.selectType.innerHTML = "";
    detailElementsCreate.client.removeAttribute('style');

    detailElementsCreate.nombre.value = "";
    detailElementsCreate.id.style.display = 'none';
    detailElementsCreate.idLabel.style.display = 'none';


    detailElementsCreate.id.value = "";

    fetch(`/people/`)
      .then(response => response.json())
      .then(data => {
        data.people.forEach(person => {
          console.log(person);
          const option = document.createElement("option");
          option.value = person.dni;
          option.textContent = person.name;
          detailElementsCreate.client.appendChild(option);
        });
      })
      .catch(error => {
        console.error("Error al filtrar eventos:", error);
      });

    fetch(`/places/`)
      .then(response => response.json())
      .then(data => {
        data.places.forEach(place => {
          const option = document.createElement("option");
          option.value = place.id;
          option.textContent = place.name;
          detailElementsCreate.selectPlace.appendChild(option);
        });
      })
      .catch(error => {
        console.error("Error al filtrar eventos:", error);
      });

    fetch(`/types/`)
      .then(response => response.json())
      .then(data => {
        data.types.forEach(type => {
          const option = document.createElement("option");
          option.value = type.id;
          option.textContent = type.name;
          detailElementsCreate.selectType.appendChild(option);
        });
      })
      .catch(error => {
        console.error("Error al filtrar eventos:", error);
      });


    searchContainer.classList.remove('col-md-12');
    searchContainer.classList.add('col-md-6');
    buttonContainer.classList.add('opacity-0');
    buttonContainer.classList.remove('opacity-100');
    detailContainer.classList.remove('opacity-0');
    detailContainer.classList.add('opacity-100');
    window.selectedPersonDni = null;
  });
}