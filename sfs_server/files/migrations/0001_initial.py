# Generated by Django 3.1.3 on 2020-11-26 01:06

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='File',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False,
                                        verbose_name='ID')),
                ('file', models.FileField(max_length=255, upload_to='')),
                ('file_size', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
