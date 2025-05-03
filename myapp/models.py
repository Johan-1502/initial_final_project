from django.db import models

# Create your models here.
class Person(models.Model):
    name = models.CharField(max_length=200)
    dni = models.CharField(max_length=20)
    phoneNumber = models.CharField(max_length=15)
    address = models.CharField(max_length=100)
    email = models.EmailField()
    isVisible = models.BooleanField(default=True)
    def __str__(self):
        return self.name + ' ' + self.dni
    