document.addEventListener("DOMContentLoaded", async () => {
    // Elementos del formulario
    const form = document.getElementById("form-edificacio");
    const selectPublicacions = document.getElementById("publications");
    const selectArquitectes = document.getElementById("architects");
    const selectTipologia = document.getElementById("typologies");
    const containerTipologia = document.getElementById("typologies-container");
    const selectProtection = document.getElementById("protection");

    // Función para cargar los desplegables
    async function carregarDesplegables() {
        try {
            // pedimos todos los datos en paralelo para que no tarde tanto
            const [publicacions, architects, protections] = await Promise.all([
                fetch("/buildings/form/publications").then(res => res.json()),
                fetch("/buildings/form/architects").then(res => res.json()),
                fetch("/buildings/form/protection").then(res => res.json())
                // Tipologías las pedimos luego según la publicación
            ]);

            // Logica para pintar los desplegables

            //Rellenamos el desplegable de publicaciones
            publicacions.forEach(pub => {
                const opt = new Option(pub.title, pub.id_publication);
                selectPublicacions.add(opt);
            });

            //Rellenamos el desplegable de arquitectos
            architects.forEach(arq => {
                const opt = new Option(arq.name, arq.id_architect);
                selectArquitectes.add(opt);
            });

            //Rellenamos el desplegable de protecciones
            selectProtection.innerHTML = '<option value="">-- Cap --</option>';
            protections.forEach(p => {
                const opt = document.createElement("option");
                opt.value = p.id_protection;
                opt.textContent = p.level;
                selectProtection.appendChild(opt);
            });

            // Importante promise all devuelve un array con los resultados en el mismo orden que se hicieron, asi que luego hay que rellenar los desplegables en el mismo orden

            // Importación MultiSelect
            new MultiSelect(selectArquitectes, {
                placeholder: 'Selecciona arquitectes...',
                search: true, // Activa el buscador
                selectAll: true // Botón para seleccionar todo
            });

            new MultiSelect(selectPublicacions, {
                placeholder: 'Selecciona publicacions...',
                search: true,   // Activa el buscador
                selectAll: true, // Botón para seleccionar todo
                onChange: function () {
                    // Evento para cargar tipologías cuando se selecciona una publicación
                    actualizarTipologias();
                }
            });

        } catch (error) {
            console.error("Error cargando los desplegables:", error);
            alert("Error al cargar los datos iniciales.");
        }
    }

    // Función auxiliar para cargar tipologías 
    async function actualizarTipologias() {
        // Obtenemos los valores seleccionados del select nativo 
        const hiddenInputs = document.querySelectorAll('input[name="publications[]"]');
        const selectedIds = Array.from(hiddenInputs).map(input => input.value);

        // Resetear tipología
        selectTipologia.innerHTML = '<option value="">-- Selecciona una tipologia --</option>';

        if (selectedIds.length === 0) {
            containerTipologia.style.display = 'none';
            return;
        }

        // Mostrar el contenedor de tipologías
        containerTipologia.style.display = 'block';

        try {
            // Pedir las tipologías específicas de estas publicaciones 
            const idsString = selectedIds.join(',');
            const res = await fetch(`/buildings/form/typologies/filter?ids=${idsString}`);
            const tipologies = await res.json();

            if (tipologies && tipologies.length > 0) {
                // Si hay tipologías, llenamos el select
                tipologies.forEach(t => {
                    const opt = document.createElement("option");
                    opt.value = t.id_typology;
                    opt.textContent = t.name;
                    selectTipologia.appendChild(opt);
                });
            }
        } catch (err) {
            console.error("Error cargando tipologías:", err);
        }
    }

    // Cargar los desplegables al cargar la página
    await carregarDesplegables();

    // Evento para enviar el formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        // Obtenemos los datos del formulario
        const formData = new FormData(form);
        const data = {};

        // Recorremos el formData para construir el objeto y gestionar arrays
        for (const [key, value] of formData.entries()) {
            if (key === 'pictures') continue; // Saltamos las imágenes aqui

            // Quitamos los corchetes [] que añade la librería
            const cleanKey = key.replace('[]', '');

            // Si es un campo múltiple o ya existe, creamos array
            if (data[cleanKey]) {
                if (!Array.isArray(data[cleanKey])) {
                    data[cleanKey] = [data[cleanKey]];
                }
                data[cleanKey].push(value);
            } else {
                data[cleanKey] = value;
            }
        }

        // Aseguramos que sean arrays si solo hay uno seleccionado
        if (data.publications && !Array.isArray(data.publications)) data.publications = [data.publications];
        if (data.architects && !Array.isArray(data.architects)) data.architects = [data.architects];

        // creamos variable pictureUrl (ahora es array para múltiples)
        let pictureUrls = [];
        const pictureInput = document.getElementById("picture"); // Asegúrate de que el input tenga id="picture"

        // Si se ha seleccionado un archivo (o varios)
        if (pictureInput.files && pictureInput.files.length > 0) {
            const uploadData = new FormData();
            // Añadimos todos los archivos seleccionados
            for (const file of pictureInput.files) {
                uploadData.append("pictures", file); // Nombre 'pictures' debe coincidir con el backend
            }

            // Subir la imagen al servidor
            try {
                const uploadRes = await fetch("/buildings/form/upload", {
                    method: "POST",
                    body: uploadData
                });
                // Obtenemos la respuesta
                const uploadResult = await uploadRes.json();
                if (uploadResult.success) {
                    pictureUrls = uploadResult.filePaths; // El backend devuelve filePaths (array)
                } else {
                    alert("Error al subir la imagen.");
                    return;
                }
            } catch (err) {
                console.error("Error al subir la imagen:", err);
                alert("Error al subir la imagen.");
                return;
            }
        }
        // Asignamos la URL de la imagen al objeto data
        data.pictureUrls = pictureUrls;

        const oblig = ["name", "address", "construction_year", "publications"];
        // Validamos los campos obligatorios
        for (let field of oblig) {
            const val = data[field];
            // Comprobamos si está vacío o si es un array vacío
            if (!val || (Array.isArray(val) && val.length === 0)) {
                alert(`El camp "${field}" és obligatori.`);
                return;
            }
        }
        // Enviamos el formulario
        try {
            const res = await fetch("/buildings/form", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            alert(result.message);
            if (result.success) form.reset();
        } catch (err) {
            console.error("Error:", err);
            alert("Error al enviar el formulario.");
        }
    });
});