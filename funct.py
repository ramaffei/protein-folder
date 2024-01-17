
import os
from flask import Flask, render_template, request, flash, redirect, url_for
from werkzeug.utils import secure_filename
from zipfile import ZipFile

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './PAGINA/downlo'
#app.secret_key = 'clave_secreta'  # Necesario para usar 'flash'

ALLOWED_EXTENSIONS = {'zip'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/PAGINA/")
def upload_file():
    return render_template('products.html')

@app.route("/upload", methods=['POST'])
def uploadAndApply():
    if 'zipFile' not in request.files:
        flash('No se ha proporcionado ningún archivo')
        return redirect(request.url)

    file = request.files['zipFile']

    if file.filename == '':
        flash('No se ha seleccionado ningún archivo')
        return redirect(request.url)

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        flash('Archivo subido exitosamente')
        return redirect(url_for('upload_file'))

    flash('El tipo de archivo no está permitido')
    return redirect(request.url)

if __name__ == '__main__':
    app.run(debug=True)





