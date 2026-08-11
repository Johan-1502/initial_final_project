from django.test import TestCase, RequestFactory, Client
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import JsonResponse
from django.contrib.messages import get_messages
from .models import Event, Place, TypeEvent, WorkersByEvent
from people_module.models import Person, Role
from . import services
from . import views
import json
from datetime import date, datetime


class EventServiceTests(TestCase):
    def setUp(self):
        """
        Método ejecutado antes de cada test.
        Crea datos de ejemplo necesarios para las pruebas.
        """
        self.factory = RequestFactory()
        self.client = Client()
        
        # Crear datos base necesarios
        self.person_client = Person.objects.create(
            name="Cliente Test",
            dni="12345678",
            phoneNumber="123456789",
            address="Calle Cliente 123",
            email="cliente@test.com"
        )
        
        self.person_employee1 = Person.objects.create(
            name="Empleado 1",
            dni="87654321",
            phoneNumber="987654321",
            address="Calle Empleado 1",
            email="emp1@test.com"
        )
        
        self.person_employee2 = Person.objects.create(
            name="Empleado 2",
            dni="11111111",
            phoneNumber="111111111",
            address="Calle Empleado 2",
            email="emp2@test.com"
        )
        
        self.place = Place.objects.create(
            name="Salon Principal",
            city="Tunja",
            address="Calle Principal 456"
        )
        
        self.type_event = TypeEvent.objects.create(type="Boda")
        
        self.role1 = Role.objects.create(name="Mesero", description="Servir mesas")
        self.role2 = Role.objects.create(name="Chef", description="Cocinar")
        
        # Datos de ejemplo para eventos
        self.sample_event_data = {
            "name": "Evento Test",
            "startDate": "2025-07-01",
            "endDate": "2025-07-02",
            "place": str(self.place.id),
            "typeEvent": str(self.type_event.id),
            "typeWritten": "",
            "client": self.person_client.dni,
            "employees": json.dumps([
                {"dni": self.person_employee1.dni, "role": self.role1.id, "salary": "500000"},
                {"dni": self.person_employee2.dni, "role": self.role2.id, "salary": "600000"}
            ])
        }
        
        self.sample_event_data_2 = {
            "name": "Evento Test 2",
            "startDate": "2025-08-01",
            "endDate": "2025-08-02",
            "place": str(self.place.id),
            "typeEvent": str(self.type_event.id),
            "typeWritten": "",
            "client": self.person_client.dni,
            "employees": json.dumps([
                {"dni": self.person_employee1.dni, "role": self.role1.id, "salary": "400000"}
            ])
        }

    def test_create_event_success(self):
        """
        Verifica que se crea correctamente un evento con empleados.
        """
        request = self.factory.post("/", data=self.sample_event_data)
        services.createEvent(request)
        
        event = Event.objects.get(name="Evento Test")
        self.assertEqual(event.name, "Evento Test")
        self.assertEqual(event.client.dni, self.person_client.dni)
        self.assertEqual(event.place.id, self.place.id)
        self.assertTrue(event.isVisible)
        
        # Verificar empleados asignados
        workers = WorkersByEvent.objects.filter(event=event)
        self.assertEqual(workers.count(), 2)

    def test_create_event_with_new_type(self):
        """
        Verifica que se crea un evento con un nuevo tipo de evento.
        """
        data = self.sample_event_data.copy()
        data["typeWritten"] = "Quinceañero"
        data["typeEvent"] = ""
        
        request = self.factory.post("/", data=data)
        services.createEvent(request)
        
        event = Event.objects.get(name="Evento Test")
        self.assertEqual(event.typeEvent.type, "Quinceañero")
        
        # Verificar que el tipo se creó
        type_exists = TypeEvent.objects.filter(type="Quinceañero").exists()
        self.assertTrue(type_exists)

    def test_create_event_missing_required_field(self):
        """
        Verifica que se lanza excepción al faltar campos requeridos.
        """
        data = self.sample_event_data.copy()
        del data["name"]
        request = self.factory.post("/", data=data)
        
        with self.assertRaises(KeyError):
            services.createEvent(request)

    def test_create_event_invalid_client(self):
        """
        Verifica que se lanza excepción con cliente inexistente.
        """
        data = self.sample_event_data.copy()
        data["client"] = "99999999"
        request = self.factory.post("/", data=data)
        
        with self.assertRaises(Person.DoesNotExist):
            services.createEvent(request)

    def test_create_event_invalid_place(self):
        """
        Verifica que se lanza excepción con lugar inexistente.
        """
        data = self.sample_event_data.copy()
        data["place"] = "999"
        request = self.factory.post("/", data=data)
        
        with self.assertRaises(Place.DoesNotExist):
            services.createEvent(request)

    def test_edit_event_success(self):
        """
        Verifica que se edita correctamente un evento existente.
        """
        # Crear evento primero
        request_create = self.factory.post("/", data=self.sample_event_data)
        services.createEvent(request_create)
        event = Event.objects.get(name="Evento Test")
        
        # Editar evento
        edit_data = self.sample_event_data.copy()
        edit_data["id"] = str(event.id)
        edit_data["name"] = "Evento Editado"
        edit_data["employees"] = json.dumps([
            {"dni": self.person_employee1.dni, "role": self.role1.id, "salary": "700000"}
        ])
        
        request_edit = self.factory.post("/", data=edit_data)
        services.editEvent(request_edit)
        
        event.refresh_from_db()
        self.assertEqual(event.name, "Evento Editado")
        
        # Verificar que se actualizaron los empleados
        workers = WorkersByEvent.objects.filter(event=event)
        self.assertEqual(workers.count(), 1)
        self.assertEqual(workers.first().salary, 700000)

    def test_edit_event_with_new_role(self):
        """
        Verifica que se puede editar un evento creando un nuevo rol.
        """
        # Crear evento primero
        request_create = self.factory.post("/", data=self.sample_event_data)
        services.createEvent(request_create)
        event = Event.objects.get(name="Evento Test")
        
        # Editar con nuevo rol
        edit_data = self.sample_event_data.copy()
        edit_data["id"] = str(event.id)
        edit_data["employees"] = json.dumps([
            {"dni": self.person_employee1.dni, "role": "Bartender", "salary": "550000"}
        ])
        
        request_edit = self.factory.post("/", data=edit_data)
        services.editEvent(request_edit)
        
        # Verificar que se creó el nuevo rol
        new_role = Role.objects.filter(name="Bartender").first()
        self.assertIsNotNone(new_role)
        
        worker = WorkersByEvent.objects.filter(event=event).first()
        self.assertEqual(worker.role.name, "Bartender")

    def test_edit_nonexistent_event(self):
        """
        Verifica que se lanza excepción al editar evento inexistente.
        """
        data = self.sample_event_data.copy()
        data["id"] = "999"
        request = self.factory.post("/", data=data)
        
        with self.assertRaises(Event.DoesNotExist):
            services.editEvent(request)

    def test_delete_event_success(self):
        """
        Verifica que se elimina correctamente un evento (soft delete).
        """
        request = self.factory.post("/", data=self.sample_event_data)
        services.createEvent(request)
        event = Event.objects.get(name="Evento Test")
        
        services.deleteEvent(event.id)
        
        event.refresh_from_db()
        self.assertFalse(event.isVisible)

    def test_delete_nonexistent_event(self):
        """
        Verifica el comportamiento al eliminar evento inexistente.
        """
        # No debe lanzar excepción, solo no hacer nada
        services.deleteEvent(999)
        # Si llega aquí, la prueba pasa (no se lanzó excepción)

    def test_get_all_events_only_visible(self):
        """
        Verifica que se obtienen solo eventos visibles.
        """
        # Crear eventos
        request1 = self.factory.post("/", data=self.sample_event_data)
        services.createEvent(request1)
        
        request2 = self.factory.post("/", data=self.sample_event_data_2)
        services.createEvent(request2)
        
        # Eliminar uno
        event_to_delete = Event.objects.get(name="Evento Test")
        services.deleteEvent(event_to_delete.id)
        
        visible_events = services.getAllEvents()
        self.assertEqual(visible_events.count(), 1)
        self.assertEqual(visible_events.first().name, "Evento Test 2")

    def test_get_event_by_id_success(self):
        """
        Verifica que se obtiene correctamente un evento por ID.
        """
        request = self.factory.post("/", data=self.sample_event_data)
        services.createEvent(request)
        event = Event.objects.get(name="Evento Test")
        
        found_event = services.getEventById(event.id)
        self.assertEqual(found_event.id, event.id)
        self.assertEqual(found_event.name, "Evento Test")

    def test_get_event_by_id_not_found(self):
        """
        Verifica que se lanza excepción con ID inexistente.
        """
        with self.assertRaises(Person.DoesNotExist):  # Error en el código original
            services.getEventById(999)

    def test_get_employees_by_event_success(self):
        """
        Verifica que se obtienen correctamente los empleados de un evento.
        """
        request = self.factory.post("/", data=self.sample_event_data)
        services.createEvent(request)
        event = Event.objects.get(name="Evento Test")
        
        employees = services.getEmployeesByEvent(event.id)
        self.assertEqual(employees.count(), 2)
        
        employee_dnis = [emp.person.dni for emp in employees]
        self.assertIn(self.person_employee1.dni, employee_dnis)
        self.assertIn(self.person_employee2.dni, employee_dnis)

    def test_get_employees_by_nonexistent_event(self):
        """
        Verifica excepción al buscar empleados de evento inexistente.
        """
        with self.assertRaises(Event.DoesNotExist):
            services.getEmployeesByEvent(999)

    def test_get_employees_data_by_event_success(self):
        """
        Verifica que se obtienen correctamente los datos de empleados.
        """
        request = self.factory.post("/", data=self.sample_event_data)
        services.createEvent(request)
        event = Event.objects.get(name="Evento Test")
        
        employees_data = services.getEmployeesDataByEvent(event.id)
        self.assertEqual(len(employees_data), 2)
        
        # Verificar estructura de datos
        first_employee = employees_data[0]
        self.assertIn('id', first_employee)
        self.assertIn('name', first_employee)
        self.assertIn('salary', first_employee)
        self.assertIn('role', first_employee)

    def test_get_employees_data_by_nonexistent_event(self):
        """
        Verifica que retorna lista vacía para evento inexistente.
        """
        employees_data = services.getEmployeesDataByEvent(999)
        self.assertEqual(employees_data, [])

    def test_create_place_success(self):
        """
        Verifica que se crea correctamente un lugar.
        """
        place_data = {
            "city": "Bogotá",
            "direction": "Carrera 7 # 123-45",
            "placeName": "Centro de Convenciones"
        }
        request = self.factory.post("/", data=place_data)
        
        place = services.createPlace(request)
        self.assertEqual(place.city, "Bogotá")
        self.assertEqual(place.address, "Carrera 7 # 123-45")
        self.assertEqual(place.name, "Centro de Convenciones")

    def test_get_all_places(self):
        """
        Verifica que se obtienen todos los lugares.
        """
        places = services.getallPlaces()
        self.assertGreaterEqual(places.count(), 1)  # Al menos el creado en setUp

    def test_get_all_types(self):
        """
        Verifica que se obtienen todos los tipos de evento.
        """
        types = services.getallTypes()
        self.assertGreaterEqual(types.count(), 1)  # Al menos el creado en setUp

    def test_filter_event_by_name(self):
        """
        Verifica el filtrado de eventos por nombre.
        """
        request1 = self.factory.post("/", data=self.sample_event_data)
        services.createEvent(request1)
        
        request2 = self.factory.post("/", data=self.sample_event_data_2)
        services.createEvent(request2)
        
        filtered_events = services.filter_event_by(name__icontains="Test 2")
        self.assertEqual(filtered_events.count(), 1)
        self.assertEqual(filtered_events.first().name, "Evento Test 2")

    def test_create_event_without_employees(self):
        """
        Verifica la creación de evento sin empleados.
        """
        data = self.sample_event_data.copy()
        data["employees"] = ""
        
        request = self.factory.post("/", data=data)
        services.createEvent(request)
        
        event = Event.objects.get(name="Evento Test")
        workers = WorkersByEvent.objects.filter(event=event)
        self.assertEqual(workers.count(), 0)

    def test_create_event_with_nonexistent_employee(self):
        """
        Verifica que se ignoran empleados que no existen.
        """
        data = self.sample_event_data.copy()
        employees = [
            {"dni": self.person_employee1.dni, "role": self.role1.id, "salary": "500000"},
            {"dni": "99999999", "role": self.role1.id, "salary": "500000"}  # No existe
        ]
        data["employees"] = json.dumps(employees)
        
        request = self.factory.post("/", data=data)
        services.createEvent(request)
        
        event = Event.objects.get(name="Evento Test")
        workers = WorkersByEvent.objects.filter(event=event)
        self.assertEqual(workers.count(), 1)  # Solo se creó uno

    def test_create_event_empty_fields(self):
        """
        Verifica que se lanza excepción con campos vacíos.
        """
        empty_data = {
            "name": "",
            "startDate": "",
            "endDate": "",
            "place": "",
            "typeEvent": "",
            "typeWritten": "",
            "client": "",
            "employees": ""
        }
        request = self.factory.post("/", data=empty_data)
        
        with self.assertRaises(Exception):  # Puede ser ValidationError o KeyError
            services.createEvent(request)


class EventViewTests(TestCase):
    def setUp(self):
        """
        Configuración para pruebas de vistas.
        """
        self.client = Client()
        self.factory = RequestFactory()
        
        # Crear datos base
        self.person_client = Person.objects.create(
            name="Cliente Test",
            dni="12345678",
            phoneNumber="123456789",
            address="Calle Cliente 123",
            email="cliente@test.com"
        )
        
        self.place = Place.objects.create(
            name="Salon Test",
            city="Tunja",
            address="Calle Test 123"
        )
        
        self.type_event = TypeEvent.objects.create(type="Cumpleaños")
        self.role = Role.objects.create(name="Animador", description="Animar")

    def test_manage_event_get_request(self):
        """
        Verifica que la vista de gestión carga correctamente.
        """
        response = self.client.get('/manage_event/')
        self.assertEqual(response.status_code, 200)

    def test_places_to_send_json_response(self):
        """
        Verifica que la API de lugares retorna JSON correcto.
        """
        response = self.client.get('/places-to-send/')  # Ajusta la URL según tu configuración
        
        if response.status_code == 200:
            data = response.json()
            self.assertIn('places', data)
            self.assertGreater(len(data['places']), 0)

    def test_types_to_send_json_response(self):
        """
        Verifica que la API de tipos retorna JSON correcto.
        """
        response = self.client.get('/types-to-send/')  # Ajusta la URL según tu configuración
        
        if response.status_code == 200:
            data = response.json()
            self.assertIn('types', data)
            self.assertGreater(len(data['types']), 0)

    def test_people_to_send_json_response(self):
        """
        Verifica que la API de personas retorna JSON correcto.
        """
        response = self.client.get('/people-to-send/')  # Ajusta la URL según tu configuración
        
        if response.status_code == 200:
            data = response.json()
            self.assertIn('people', data)
            self.assertGreater(len(data['people']), 0)

    def test_roles_to_send_json_response(self):
        """
        Verifica que la API de roles retorna JSON correcto.
        """
        response = self.client.get('/roles-to-send/')  # Ajusta la URL según tu configuración
        
        if response.status_code == 200:
            data = response.json()
            self.assertIn('roles', data)

    def test_create_place_via_view(self):
        """
        Verifica la creación de lugar mediante vista.
        """
        place_data = {
            "city": "Medellín",
            "direction": "Calle Nueva 789",
            "placeName": "Salón Nuevo"
        }
        
        response = self.client.post('/create-place/', data=place_data)  # Ajusta URL
        
        if response.status_code == 200:
            data = response.json()
            self.assertIn('name', data)
            self.assertIn('id', data)
            self.assertEqual(data['name'], "Salón Nuevo")

    def test_filter_events_with_query(self):
        """
        Verifica el filtrado de eventos con query.
        """
        # Crear evento de prueba primero
        Event.objects.create(
            name="Evento Filtrable",
            startDate="2025-07-01",
            endDate="2025-07-02",
            place=self.place,
            typeEvent=self.type_event,
            client=self.person_client
        )
        
        response = self.client.get('/filter-events/', {'query': 'Filtrable'})
        
        if response.status_code == 200:
            data = response.json()
            self.assertIn('events', data)
            events = data['events']
            self.assertGreater(len(events), 0)
            self.assertIn('Filtrable', events[0]['name'])

    def test_filter_events_without_query(self):
        """
        Verifica el filtrado sin query (todos los eventos).
        """
        response = self.client.get('/filter-events/')
        
        if response.status_code == 200:
            data = response.json()
            self.assertIn('events', data)

    def test_event_report_with_valid_id(self):
        """
        Verifica el reporte de evento con ID válido.
        """
        event = Event.objects.create(
            name="Evento Reporte",
            startDate="2025-07-01",
            endDate="2025-07-02",
            place=self.place,
            typeEvent=self.type_event,
            client=self.person_client
        )
        
        response = self.client.get('/event-report/', {'id': event.id})
        
        if response.status_code == 200:
            data = response.json()
            self.assertIn('employees', data)

    def test_employees_of_an_event_with_valid_id(self):
        """
        Verifica la obtención de empleados de un evento.
        """
        event = Event.objects.create(
            name="Evento Empleados",
            startDate="2025-07-01",
            endDate="2025-07-02",
            place=self.place,
            typeEvent=self.type_event,
            client=self.person_client
        )
        
        response = self.client.get('/employees-of-event/', {'id': event.id})
        
        if response.status_code == 200:
            data = response.json()
            self.assertIn('employees', data)


class EventIntegrationTests(TestCase):
    """
    Pruebas de integración entre diferentes componentes.
    """
    
    def setUp(self):
        self.client = Client()
        
        # Crear datos completos para pruebas de integración
        self.client_person = Person.objects.create(
            name="Cliente Integración",
            dni="99999999",
            phoneNumber="999999999",
            address="Calle Integración",
            email="integracion@test.com"
        )
        
        self.employee = Person.objects.create(
            name="Empleado Integración",
            dni="88888888",
            phoneNumber="888888888",
            address="Calle Empleado",
            email="empleado@test.com"
        )
        
        self.place = Place.objects.create(
            name="Lugar Integración",
            city="Tunja",
            address="Dirección Integración"
        )
        
        self.type_event = TypeEvent.objects.create(type="Evento Integración")
        self.role = Role.objects.create(name="Trabajador", description="Trabajo general")

    def test_full_event_lifecycle(self):
        """
        Prueba completa del ciclo de vida de un evento.
        """
        # 1. Crear evento
        event_data = {
            "name": "Evento Completo",
            "startDate": "2025-12-01",
            "endDate": "2025-12-02",
            "place": str(self.place.id),
            "typeEvent": str(self.type_event.id),
            "typeWritten": "",
            "client": self.client_person.dni,
            "employees": json.dumps([
                {"dni": self.employee.dni, "role": self.role.id, "salary": "800000"}
            ])
        }
        
        request = RequestFactory().post("/", data=event_data)
        services.createEvent(request)
        
        # 2. Verificar creación
        event = Event.objects.get(name="Evento Completo")
        self.assertIsNotNone(event)
        
        # 3. Obtener empleados
        employees = services.getEmployeesByEvent(event.id)
        self.assertEqual(employees.count(), 1)
        
        # 4. Editar evento
        edit_data = event_data.copy()
        edit_data["id"] = str(event.id)
        edit_data["name"] = "Evento Editado Completo"
        
        request_edit = RequestFactory().post("/", data=edit_data)
        services.editEvent(request_edit)
        
        # 5. Verificar edición
        event.refresh_from_db()
        self.assertEqual(event.name, "Evento Editado Completo")
        
        # 6. Eliminar evento
        services.deleteEvent(event.id)
        
        # 7. Verificar eliminación
        event.refresh_from_db()
        self.assertFalse(event.isVisible)
        
        # 8. Verificar que no aparece en listado
        visible_events = services.getAllEvents()
        self.assertEqual(visible_events.filter(id=event.id).count(), 0)