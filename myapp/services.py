from .models import Person
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


def createPerson(request):
    try:
        person = Person.objects.create(
            name=request.POST["name"],
            dni=request.POST["dni"],
            phoneNumber=request.POST["phoneNumber"],
            address=request.POST["address"],
            email=request.POST["email"],
        )
        person.full_clean()
        person.save() 
    except ValidationError as v:
        raise v
    except IntegrityError as i:
        raise i
    except KeyError as k:
        raise k
    except Exception as e:
        raise e



def searchPerson(infoToFilter):
    people = Person.objects.filter(dni__icontains=infoToFilter) | Person.objects.filter(name__icontains=infoToFilter)
    return people.distinct()


def getAllPeople():
    return Person.objects.filter(isVisible=True)


def deletePerson(dni):
    persons = Person.objects.filter(dni=dni)
    print(persons)
    for person in persons:
        person.isVisible = False
        person.save()


def editPerson(request):
    try:
        person = Person.objects.get(dni=request.POST["dni"])
        person.name = request.POST["name"]
        person.dni = request.POST["dni"]
        person.phoneNumber = request.POST["phoneNumber"]
        person.address = request.POST["address"]
        person.email = request.POST["email"]
        person.full_clean()
        person.save()
    except ValidationError as v:
        raise v
    except KeyError as k:
        raise k
    except Exception as e:
        raise e


def getPersonById(dni):
    try:
        return Person.objects.get(dni=dni)  # Busca la persona por su DNI
    except Person.DoesNotExist:
        raise Person.DoesNotExist(f"No se encontró una persona con el DNI {dni}")


@csrf_exempt
def update_person(request):
    if request.method == "POST":
        try:
            data = request.POST  # Cambiado para manejar datos enviados como FormData
            person = Person.objects.get(dni=data["dni"])  # Buscar la persona por su DNI
            person.name = data["name"]
            person.phoneNumber = data["phoneNumber"]
            person.address = data["address"]
            person.email = data["email"]
            person.save()  # Guardar los cambios en la base de datos
            return JsonResponse({"success": True, "person": {
                "dni": person.dni,
                "name": person.name,
                "phoneNumber": person.phoneNumber,
                "address": person.address,
                "email": person.email,
            }})
        except Person.DoesNotExist:
            return JsonResponse({"success": False, "error": "Persona no encontrada"})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})
