from .models import Person
from django.core.exceptions import ValidationError
from django.db import IntegrityError


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
