from django.db import models

# Create your models here.
class Person(models.Model):
    name = models.CharField(max_length=200, blank=False)
    dni = models.CharField(max_length=20, primary_key=True, blank=False)
    phoneNumber = models.CharField(max_length=15, blank=False)
    address = models.CharField(max_length=100, blank=False)
    email = models.EmailField(blank=False)
    isVisible = models.BooleanField(default=True)

    def __str__(self):
        return self.name + ' ' + self.dni
    