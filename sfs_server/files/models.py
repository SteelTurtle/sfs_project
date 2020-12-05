from django.db import models


class File(models.Model):
    file = models.FileField(max_length=255, blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file

    class Meta:
        ordering = ['created_at']
