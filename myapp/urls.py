from django.urls import path, include
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("create_person/", views.create_person, name="create_person"),
    path("search_person/", views.search_person, name="search_person"),
    path("search_person_to_edit/", views.search_person_to_edit, name="search_person_to_edit"),
    path("search_person_to_delete/", views.search_person_to_delete, name="search_person_to_delete"),
    path("show_people/", views.show_people, name="show_people"),
    path("delete_person/", views.delete_person_by_dni, name="delete_person"),
    path("edit_person/", views.edit_person, name="edit_person"),
    path("get-person/<int:dni>/", views.get_person, name="get_person"),
    path("delete-person/<int:id>/", views.delete_person_by_id, name="delete_person"),
    path("confirm_changes/", views.confirm_changes, name="confirm_changes")
]