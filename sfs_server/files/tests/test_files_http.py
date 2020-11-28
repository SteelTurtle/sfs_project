from io import BytesIO

from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from files.models import File


class FilesHttpTest(APITestCase):
    def test_can_create_file_on_server(self):
        picture_file = _create_random_picture_file()
        response = self.client.post(reverse('files:files_list'), data={
            'file': picture_file
        })
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        file = File.objects.last()
        self.assertIsNotNone(file.created_at)

    def test_can_list_files_on_server(self):
        picture_files = [_create_random_picture_file() for _ in range(0, 5)]
        # given some random files saved in the media
        for picture in picture_files:
            response = self.client.post(reverse('files:files_list'), data={
                'file': picture
            })
            self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        # then it is possible to retrieve a list of all the files
        response = self.client.get(reverse('files:files_list'))
        self.assertEqual(status.HTTP_200_OK, response.status_code)


def _create_random_picture_file():
    random_data = BytesIO()
    Image.new('RGB', (250, 250)).save(random_data, 'JPEG')
    random_data.seek(0)
    return SimpleUploadedFile('random_picture.jpg', random_data.getvalue())
