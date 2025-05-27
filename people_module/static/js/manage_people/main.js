import { setupSearch } from './search.js';
import { setupCreate } from './create.js';
import { setupUpdate, setupDelete, showMessage } from './update_delete.js';
import { showDetails } from './details.js';


document.addEventListener("DOMContentLoaded", () => {
  const message = sessionStorage.getItem("successMessage");
  if (message) {
    showMessage(message, "success");
    sessionStorage.removeItem("successMessage");
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const resultsList = document.getElementById('resultsList');
  const searchInput = document.getElementById('searchInput');
  const updateButton = document.getElementById('update-button');
  const changeForm = document.getElementById('changeForm');
  const activateCreateButton = document.getElementById("activateCreateButton");
  const buttonContainer = document.getElementById("button-container");
  const searchContainer = document.getElementById("search-container");
  const detailContainer = document.getElementById("detail-container");
  const deleteButton = document.getElementById("delete-button");
  const showReportButton = document.getElementById('change-pop-up-report');
  const closeReportButton = document.getElementById('close-pop-up-report');
  const exportReportButton = document.getElementById('export-pdf-btn');
  const popUpReport = document.getElementById("pop-up-report");

  closeReportButton.addEventListener('click', () => {
    closePopUp(popUpReport);
  });

  exportReportButton.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Informe de Nómina', 14, 20);

    const fecha = document.getElementById('fecha-actual').textContent;
    doc.setFontSize(12);
    doc.text(`Fecha de informe: ${fecha}`, 14, 30);

    doc.autoTable({
      html: '#report-table',
      startY: 55,
      theme: 'grid',
      headStyles: { fillColor: [0, 157, 204] }
    });

    doc.save('informe_nomina.pdf');
  });

  showReportButton.addEventListener('click', () => {
    console.log("Mostrando reporte");
    const fecha = new Date();
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('fecha-actual').textContent =
      fecha.toLocaleDateString('es-ES', opciones);

    const dni = document.getElementById('change-detail-cc').value;
    const tbody = document.querySelector('#report-table tbody');
    tbody.innerHTML = '';
    fetch(`/person-report/?dni=${dni}`)
      .then(response => response.json())
      .then(data => {
        data.employees.forEach(event => {
          const newRow = document.createElement('tr');
          const formattedSalary = Number(event.salary).toLocaleString('es-ES', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
          newRow.innerHTML = `
          <td>${event.eventName}</td>
          <td>${event.startDate}</td>
          <td>${event.endDate}</td>
          <td>${formattedSalary}</td>
          <td>${event.role}</td>
        `;
          tbody.appendChild(newRow);
        });
      })
      .catch(error => {
        console.error("Error al obtener historial:", error);
      });


    openPopUp(popUpReport);
  });

  const detailElementsCreate = {
    cc: document.getElementById('create-detail-cc'),
    nombre: document.getElementById('create-detail-nombre'),
    telefono: document.getElementById('create-detail-telefono'),
    direccion: document.getElementById('create-detail-direccion'),
    correo: document.getElementById('create-detail-correo'),
  };

  const detailElementsChange = {
    cc: document.getElementById('change-detail-cc'),
    nombre: document.getElementById('change-detail-nombre'),
    telefono: document.getElementById('change-detail-telefono'),
    direccion: document.getElementById('change-detail-direccion'),
    correo: document.getElementById('change-detail-correo'),
  };

  window.showDetails = (button) => {
    showDetails(
      button,
      detailElementsChange,
      searchContainer,
      detailContainer,
      buttonContainer
    );
  };

  const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

  setupSearch(resultsList, searchInput);
  setupCreate(activateCreateButton, detailElementsCreate, searchContainer, buttonContainer, detailContainer);
  setupUpdate(updateButton, changeForm, detailElementsChange, csrfToken);
  setupDelete(deleteButton, changeForm, csrfToken);
});

function closePopUp(popUpElement) {
  popUpElement.classList.add("d-none");
}

function openPopUp(popUpElement) {
  popUpElement.classList.remove("d-none");
}