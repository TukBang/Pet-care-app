from flask import Flask, request, send_from_directory
from flask_restful import Resource, Api
from PIL import Image
import base64
import io
import os

app = Flask(__name__)
api = Api(app)

# Ensure the 'images' directory exists
if not os.path.exists('images'):
    os.makedirs('images')

class ImageResource(Resource):
    def get(self, image_name):
        if os.path.isfile(os.path.join('images', image_name)):
            return send_from_directory('images', image_name)
        else:
            return {'error': 'Image not found'}, 404

    def post(self):
        data = request.get_json()
        image_data = data.get('image', None)
        if image_data:
            try:
                image_data = base64.b64decode(image_data)
                image = Image.open(io.BytesIO(image_data))
                image_name = data.get('name', 'unnamed.jpg')
                image_path = os.path.join('images', image_name)
                image.save(image_path)
                return {'message': 'Image saved successfully', 'name': image_name}
            except Exception as e:
                return {'error': str(e)}, 400
        else:
            return {'error': 'No image data found'}, 400

api.add_resource(ImageResource, '/images', '/images/<string:image_name>')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
