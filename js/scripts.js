// Direccion del BACKEND, cambiar en produccion:
API_URL = 'https://clownstech.com/api-protein-folder'

// Funcion que se ejecuta al subir el archivo
document
  .getElementById("button_submit")
  .addEventListener("click", function (ev) {
    const fileInput = document.getElementById("zipFile");
    const file = fileInput.files[0];

    if (!file) {
      throw "No upload file";
    }

    const formData = new FormData();
    formData.append("zipFile", file);

    result = fetch(API_URL+"/upload/", {
      method: "POST",
      body: formData,
    })
      .then((request) => request.json())
      .catch((error) => console.error("Error:", error))
      .then((response) => {
        console.log("Success:", response.msg);
        loadArchives(response["data"]);
      });

    ev.preventDefault();
  });

// Funcion que se ejecuta una vez subido el archivo, ejecuta las dos funciones que renderizan el html para mostrar las opciones
function loadArchives(data) {
  if (Object(data).hasOwnProperty("JSON")) {
    showOptionsZscores(data["JSON"]);
  }
  if (Object(data).hasOwnProperty("PDB")) {
    showOptionsRamachan(data["PDB"]);
  }
  document.getElementById("results").classList.remove("d-none");
}

// Funcion de renderizado de las opciones de ramanchandran
function showOptionsRamachan(optionsPdb) {
  if (!optionsPdb) return;
  const container = document.getElementById("content_ramachan_options");
  const elements = document.createElement("div");
  elements.className = "row g-4";

  // Recorremos cada archivo subido para dar la opcion de generar el grafico
  for (let i = 0; i < optionsPdb.length; i++) {
    const col = document.createElement("div");
    col.classList.add("col-12");

    // HTML de la card que contiene el boton para generar el grafico de RAMANCHANDRAN
    col.innerHTML = `<div class="card border-secondary">
                            <div class="card-body">
                                <h5 class="card-title">${optionsPdb[i]}</h5>
                                <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                                <button class="btn btn-primary" id="file_${
                                  i + 1
                                }">Go somewhere</button>
                            </div>
                        </div>`;
    const button = col.querySelector(`#file_${i + 1}`);

    // Evento del boton, consulta al backend
    button.addEventListener("click", () => {
      button.setAttribute("disabled", true);
      data = { filename: optionsPdb[i] };
      result = fetch(API_URL+"/pdb/plot/ramachandran/", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((request) => request.json())
        .catch((error) => console.error("Error:", error))
        .then((response) => {
          // HTML de renderizado de la imagen
          const file = new File(
            [base64ToBlob(response.data)],
            "ramachandran.png",
            { type: "image/png" }
          );
          const img = document.createElement("img");
          img.src = URL.createObjectURL(file);
          img.alt = "Imagen";
          img.className =
            "img-fluid my-2 border border-1 rounded border-secondary";
          col.appendChild(img);
        });
    });

    elements.appendChild(col);
  }
  container.replaceChildren(elements);
}

// Funcion que genera las opciones para el grafico de zscores
function showOptionsZscores(optionsJson) {
  if (!optionsJson) return;
  const container = document.getElementById("content_zscores_options");
  const elements = document.createElement("div");
  elements.className = "row g-4";

  // Recorremos los archivos para renderizar las opciones
  for (let i = 0; i < optionsJson.length; i++) {
    const col = document.createElement("div");
    col.classList.add("col-12");

    // HTML de las opciones de ZSCORES
    col.innerHTML = `<div class="card border-secondary">
                            <div class="card-body">
                                <h5 class="card-title">${optionsJson[i]}</h5>
                                <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                                <button class="btn btn-primary" id="file_${
                                  i + 1
                                }">Go somewhere</button>
                            </div>
                        </div>`;
    const button = col.querySelector(`#file_${i + 1}`);

    // Evento que ejecuta la consulta del grafico al backend
    button.addEventListener("click", () => {
      button.setAttribute("disabled", true);
      data = { filename: optionsJson[i] };
      result = fetch(API_URL+"/json/plot/zscores/", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((request) => request.json())
        .catch((error) => console.error("Error:", error))
        .then((response) => {
          const file = new File([base64ToBlob(response.data)], "zscores.png", {
            type: "image/png",
          });

          // Renderizado del grafico zscores
          const img = document.createElement("img");
          img.src = URL.createObjectURL(file);
          img.alt = "Imagen";
          img.className =
            "img-fluid my-2 border border-1 rounded border-secondary";
          col.appendChild(img);
        });
    });

    elements.appendChild(col);
  }
  container.replaceChildren(elements);
}

// Funcion que convierte los datos en BASE64 enviados desde el backend en un BLOB
function base64ToBlob(base64String) {
  // Convertir la cadena base64 a un array de bytes
  const bytes = atob(base64String.replace(/data:image\/png;base64,/, ""));
  const byteNumbers = new Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    byteNumbers[i] = bytes.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  // Crear un objeto Blob a partir del array de bytes
  return new Blob([byteArray], { type: "image/png" });
}
