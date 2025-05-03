from .models import Person


def createPerson(request):
    Person.objects.create(
        name=request.POST["name"],
        dni=request.POST["dni"],
        phoneNumber=request.POST["phoneNumber"],
        address=request.POST["address"],
        email=request.POST["email"],
    )


def searchPerson(dni):
    person = Person.objects.filter(dni=dni)
    return person


def getAllPeople():
    return Person.objects.filter(isVisible=True)


def deletePerson(dni):
    persons = Person.objects.filter(dni=dni)
    for person in persons:
        person.isVisible = False
        person.save()


def editPerson(request):
    person = Person.objects.get(dni=request.POST["dni"])
    person.name = (request.POST["name"])
    person.dni = (request.POST["dni"])
    person.phoneNumber = (request.POST["phoneNumber"])
    person.address = (request.POST["address"])
    person.email = request.POST["email"]
    person.save()
