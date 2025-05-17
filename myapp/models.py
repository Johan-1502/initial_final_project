from django.db import models


class Person(models.Model):
    name = models.CharField(max_length=200, blank=False)
    dni = models.CharField(max_length=20, primary_key=True, blank=False)
    phoneNumber = models.CharField(max_length=15, blank=False)
    address = models.CharField(max_length=100, blank=False)
    email = models.EmailField(blank=False)
    isVisible = models.BooleanField(default=True)

    def __str__(self):
        return self.name + " " + self.dni

class Place(models.Model):
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return f"{self.name}, {self.city}, {self.address}"
    
class TypeEvent(models.Model):
    type = models.CharField(max_length=100)

    def __str__(self):
        return self.type

class Event(models.Model):
    name = models.CharField(max_length=100)
    startDate = models.DateField()
    endDate = models.DateField()
    place = models.ForeignKey(Place, on_delete=models.CASCADE)
    typeEvent = models.ForeignKey(TypeEvent, on_delete=models.CASCADE)
    client = models.ForeignKey(Person, on_delete=models.CASCADE, related_name="events")
    isVisible = models.BooleanField(default=True)
    
    
    def __str__(self):
        return f"{self.name} ({self.startDate} - {self.endDate}) en {self.place.name}, {self.place.city}"


class Role(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class WorkersByEvent(models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name="roles")

    def __str__(self):
        return f"{self.role.name} en {self.event.name} por {self.person.name}"
