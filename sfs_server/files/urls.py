from django.urls import path

from .views import FilesListView, FileView

app_name = 'files'

urlpatterns = [
    path('files', FilesListView.as_view(), name='files_list'),
    path('files/<int:pk>', FileView.as_view(), name='file_detail'),
]
