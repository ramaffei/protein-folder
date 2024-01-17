from flask import Flask, render_template, request, flash, redirect, url_for
from werkzeug.utils import secure_filename
from zipfile import ZipFile
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './downlo'

ALLOWED_EXTENSIONS = {'zip'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def AlphaFoldXploR_read(zfile):
    with ZipFile(zfile, 'r') as fz:
        for zip_info in fz.infolist():
            if zip_info.filename[-1] == '/':
                continue
            tab = os.path.basename(zip_info.filename)
            if tab.endswith(".json"):
                zip_info.filename = os.path.basename(zip_info.filename)
                lista1 = fz.extract(zip_info, "archivos_json")

    with ZipFile(zfile, 'r') as fz:
        for zip_info in fz.infolist():
            if zip_info.filename[-1] == '/':
                continue
            tab = os.path.basename(zip_info.filename)
            if tab.endswith(".pdb"):
                zip_info.filename = os.path.basename(zip_info.filename)
                lista2 = fz.extract(zip_info, "archivos_pdb")

@app.route("/")
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
        
        # Llama a AlphaFoldXploR_read con el nombre del archivo
        AlphaFoldXploR_read(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        flash('Archivo subido exitosamente')
        return redirect(url_for('upload_file'))

    flash('El tipo de archivo no está permitido')
    return redirect(request.url)

if __name__ == '__main__':
    app.run(debug=True)

