from django.urls import path, include
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("create_person/", views.create_person, name="create_person"),
    path("search_person/", views.search_person, name="search_person"),
    path("show_people/", views.show_people, name="show_people"),
    path("delete_person/", views.delete_person, name="delete_person"),
    path("edit_person/", views.edit_person, name="edit_person"),
    path("confirm_changes/", views.confirm_changes, name="confirm_changes")
]