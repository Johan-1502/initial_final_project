from django.test import TestCase, RequestFactory
from .models import Person
from . import services
from django.core.exceptions import ValidationError
from django.db import IntegrityError

class ServiceTests(TestCase):
    def setUp(self):
        """
        Metodo ejecutado antes del test.
        Crea un RequestFactory para simular peticiones HTTP 
        y un diccionario de datos de ejemplo.
        """
        self.factory = RequestFactory()
        self.sample_data_1 = {
            "name": "JuanJose",
            "dni": "12345678",
            "phoneNumber": "123456789",
            "address": "Calle Falsa 123",
            "email": "juanJose@example.com"
        }
        self.sample_data_2 = {
            "name": "Maria",
            "dni": "87654321",
            "phoneNumber": "987654321",
            "address": "Calle Verdadera 321",
            "email": "maria@example.com"
        }

    def test_create_first_first_person(self):
        """
        Verifica que se crea correctamente una persona.
        """
        request = self.factory.post("/", data=self.sample_data_1)
        services.createPerson(request)

        person = Person.objects.get(dni="12345678")
        self.assertEqual(person.name, "JuanJose")
        self.assertEqual(person.isVisible, True)

    def test_search_first_person(self):
        """
        Verifica que se crea correctamente una segunda persona.
        """
        Person.objects.create(**self.sample_data_1)
        result = services.searchPerson("12345678")
        self.assertEqual(result.count(), 1)
        self.assertEqual(result.first().dni, "12345678")

    def test_get_all_people(self):
        """
        Verifica que se obtienen todas las personas visibles.
        """
        Person.objects.create(**self.sample_data_1)
        Person.objects.create(**self.sample_data_2, isVisible=False)

        visible = services.getAllPeople()
        self.assertEqual(len(visible), 1)
        self.assertEqual(visible[0].dni, "12345678")

    def test_create_second_person(self):
        """
        Verifica que se crea correctamente una segunda persona.
        """
        request = self.factory.post("/", data=self.sample_data_2)
        services.createPerson(request)

        person = Person.objects.get(dni="87654321")
        self.assertEqual(person.name, "Maria")
        self.assertEqual(person.email, "maria@example.com")

    def test_get_all_people_multiple(self):
        """
        Verifica que se obtienen todas las personas visibles.
        """
        Person.objects.create(**self.sample_data_1)
        Person.objects.create(**self.sample_data_2)

        visibles = services.getAllPeople()
        self.assertEqual(visibles.count(), 2)
        self.assertSetEqual(
            set([p.dni for p in visibles]),
            {"12345678", "87654321"}
        )
    
    def test_delete_only_one_person(self):
        """
        Verifica que se elimina selectivamente una sola persona por eliminación.
        """
        Person.objects.create(**self.sample_data_1)
        Person.objects.create(**self.sample_data_2)

        services.deletePerson("12345678")

        self.assertFalse(Person.objects.get(dni="12345678").isVisible)
        self.assertTrue(Person.objects.get(dni="87654321").isVisible)

    def test_delete_first_person(self):
        """
        Verifica que se elimina correctamente una persona existente.
        """
        Person.objects.create(**self.sample_data_1)
        services.deletePerson("12345678")
        person = Person.objects.get(dni="12345678")
        self.assertFalse(person.isVisible)

    def test_edit_first_person(self):
        """
        Verifica que se edita correctamente una persona existente.
        """
        Person.objects.create(**self.sample_data_1)
        edited_data = self.sample_data_1.copy()
        edited_data["name"] = "Pedro"
        edited_data["phoneNumber"] = "000000000"
        request = self.factory.post("/", data=edited_data)

        services.editPerson(request)
        person = Person.objects.get(dni="12345678")
        self.assertEqual(person.name, "Pedro")
        self.assertEqual(person.phoneNumber, "000000000")
    
    def test_edit_nonexistent_first_person_raises_error(self):
        """
        Verifica que se lanza una excepción al intentar editar una persona que no existe.
        """
        edited_data = self.sample_data_2.copy()
        request = self.factory.post("/", data=edited_data)

        with self.assertRaises(Person.DoesNotExist):
            services.editPerson(request)
    
    def test_search_nonexistent_first_person(self):
        """
        Verifica que se lanza una excepción al intentar buscar una persona que no existe.
        """
        result = services.searchPerson("00000000")
        self.assertEqual(result.count(), 0)

    def test_delete_nonexistent_first_person(self):
        """
        Verifica que se lanza una excepción al intentar eliminar una persona que no existe.
        """
        self.assertFalse(Person.objects.filter(dni="99999999").exists())
        services.deletePerson("99999999")
        self.assertEqual(Person.objects.count(), 0)


    def test_create_first_person_missing_email(self):
        """
        Verifica que se lanza una excepción al intentar crear una persona sin el campo email.
        """
        data_incomplete = self.sample_data_1.copy()
        del data_incomplete["email"]
        request = self.factory.post("/", data=data_incomplete)

        with self.assertRaises(KeyError):
            services.createPerson(request)

    def test_duplicate_dni(self):
        """
        Verifica que se lanza una excepción al intentar crear una persona con un DNI ya existente
        (Se repite la llave primaria).
        """
        request1 = self.factory.post("/", data=self.sample_data_1)
        request2 = self.factory.post("/", data=self.sample_data_1)
        services.createPerson(request1)
        
        with self.assertRaises(IntegrityError):
            services.createPerson(request2)
    
    def test_create_person_empty_fields(self):
        """
        Verifica que se lanza una excepción al intentar crear una persona con campos vacíos.
        """
        empty_data = {
            "name": "",
            "dni": "",
            "phoneNumber": "",
            "address": "",
            "email": ""
        }
        request = self.factory.post("/", data=empty_data)
        
        with self.assertRaises(ValidationError):
            services.createPerson(request)
        
    def test_edit_person_dni_not_changed(self):
        """
        Verifica que se lanza una excepción al intentar editar una persona con un DNI que ya existe
        (Se repite la llave primaria).
        """
        services.createPerson(self.factory.post("/", data=self.sample_data_1))
        edited_data = self.sample_data_1.copy()
        edited_data["name"] = "Nombre Nuevo"
        edited_data["dni"] = "otroDNI"
        request_edit = self.factory.post("/", data=edited_data)

        with self.assertRaises(Person.DoesNotExist):
            services.editPerson(request_edit)

            
    def test_edit_person_with_empty_fields(self):
        """
        Verifica que se lanza una excepción al intentar editar una persona con campos vacíos.
        """
        request = self.factory.post("/", data=self.sample_data_1)
        services.createPerson(request)
        empty_data = {
            "name": "",
            "dni": "12345678",
            "phoneNumber": "",
            "address": "",
            "email": ""
        }
        request_edit = self.factory.post("/", data=empty_data)

        with self.assertRaises(ValidationError):
            services.editPerson(request_edit)
    


