export let selectedEventName = null;

export function showDetails(button, detailElementsChange, searchContainer, detailContainer, buttonContainer) {
  console.log(button.getAttribute("data-date"));
  const event = {
    name: button.getAttribute('data-name'),
    startDate: button.getAttribute('data-start-date'),
    endDate: button.getAttribute('data-end-date'),
    place: button.getAttribute('data-place'),
    type: button.getAttribute('data-type'),
    placeId: button.getAttribute('data-place-id'),
    typeId: button.getAttribute('data-type-id'),
    id: button.getAttribute('data-id'),
    client: button.getAttribute('data-client'),
  };

  if (window.selectedEventName == event.name) {
    searchContainer.classList.remove('col-md-6');
    searchContainer.classList.add('col-md-12');
    detailContainer.classList.remove('opacity-100');
    detailContainer.classList.add('opacity-0');
    document.querySelector('.edit-delete-person-section').classList.add('d-none');
    window.selectedEventName = null;
  } else {
    window.selectedEventName = event.name;

    detailElementsChange.nombre.value = event.name;
    detailElementsChange.fechaInicio.value = event.startDate;
    detailElementsChange.fechaFin.value = event.endDate;
    detailElementsChange.id.value = event.id;
    const client = document.createElement("option");
    //client.value = event.placeId;
    client.textContent = event.client;
    detailElementsChange.client.appendChild(client);
    const place = document.createElement("option");
    place.value = event.placeId;
    place.textContent = event.place;
    detailElementsChange.selectPlace.appendChild(place);
    const type = document.createElement("option");
    type.value = event.typeId;
    type.textContent = event.type;
    detailElementsChange.selectType.appendChild(type);

    fetch(`/places/`)
      .then(response => response.json())
      .then(data => {
        data.places.forEach(place => {
          if (!(place.name == event.place)) {
            const option = document.createElement("option");
            option.value = place.id;
            option.textContent = place.name;
            detailElementsChange.selectPlace.appendChild(option);
          }
        });
      })
      .catch(error => {
        console.error("Error al filtrar eventos:", error);
      });

    fetch(`/types/`)
      .then(response => response.json())
      .then(data => {
        data.types.forEach(type => {
          if (!(type.name == event.type)) {
            const option = document.createElement("option");
            option.value = type.id;
            option.textContent = type.name;
            detailElementsChange.selectType.appendChild(option);
          }
        });
      })
      .catch(error => {
        console.error("Error al filtrar eventos:", error);
      });

    searchContainer.classList.remove('col-md-12');
    searchContainer.classList.add('col-md-6');
    detailContainer.classList.remove('opacity-0');
    detailContainer.classList.add('opacity-100');
    buttonContainer.classList.add('opacity-100');
    buttonContainer.classList.remove('opacity-0');

    document.querySelector('.edit-delete-person-section').classList.remove('d-none');
    document.querySelector('.create-person-section').classList.add('d-none');
  }


}

window.showEventDetails = function (button) {
  const { detailElementsChange, searchContainer, detailContainer, buttonContainer } = window.eventGlobals;
  showDetails(button, detailElementsChange, searchContainer, detailContainer, buttonContainer);
};