import os

from channels.routing import ProtocolTypeRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configuration.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
})
