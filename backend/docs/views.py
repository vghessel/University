from django.http import FileResponse
from django.conf import settings
import os

# Swagger
def serve_swagger_yaml(request):
    file_path = os.path.join(settings.BASE_DIR, 'docs', 'swagger.yaml')
    return FileResponse(open(file_path, 'rb'), content_type='application/yaml')