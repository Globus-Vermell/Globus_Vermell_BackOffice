document.addEventListener("DOMContentLoaded", async () => {
    // Elementos del formulario
    const form = document.getElementById("form-edificacio");
    const selectPublicacions = document.getElementById("publications");
    const selectArquitectes = document.getElementById("architects");
    const selectTipologia = document.getElementById("tipologies");
    const containerTipologia = document.getElementById("typologies-container");
    const selectProtection = document.getElementById("protection");

    // Función para cargar los desplegables
    async function carregarDesplegables() {
        try {
            // pedimos todos los datos en paralelo para que no tarde tanto
            const [publicacions, arquitectes, protections] = await Promise.all([

                fetch("/buildings/form/publications").then(res => res.json()),

                fetch("/buildings/form/architects").then(res => res.json()),

                fetch("/buildings/form/protection").then(res => res.json())
                //Logica para pedirlo, convertirlo a JSON y esperar a que todas las peticiones terminen
            ]);
            // Logica para pintar los desplegables

            //Rellenamos el desplegable de publicaciones
            selectPublicacions.innerHTML = '<option value="">-- Selecciona una publicació --</option>';
            publicacions.forEach(pub => {
                const opt = document.createElement("option");
                opt.value = pub.id_publication;
                opt.textContent = pub.title;
                selectPublicacions.appendChild(opt);
            });

            //Rellenamos el desplegable de arquitectos
            selectArquitectes.innerHTML = '<option value="">-- Selecciona un arquitecte --</option>';
            arquitectes.forEach(arq => {
                const opt = document.createElement("option");
                opt.value = arq.id_architect;
                opt.textContent = arq.name;
                selectArquitectes.appendChild(opt);
            });

            //Rellenamos el desplegable de protecciones
            selectProtection.innerHTML = '<option value="">-- Cap --</option>';
            protections.forEach(p => {
                const opt = document.createElement("option");
                opt.value = p.id_protection;
                opt.textContent = p.level;
                selectProtection.appendChild(opt);
            });
            // Importante promise all devuelve un array con los resultados de todas las peticiones en el mismo orden que se hicieron
            // por lo que publicacions es el primer elemento, arquitectes el segundo y protections el tercero
            // Si se añade un nuevo desplegable al final del array luego el desplegable se debe rellenar al final tambien 
        } catch (error) {
            console.error("Error cargando los desplegables:", error);
            alert("Error al cargar los datos iniciales.");
        }

    }

    // Evento para cargar tipologías cuando se selecciona una publicación
    selectPublicacions.addEventListener("change", async (e) => {
        const pubId = e.target.value;
        // Resetear tipología
        selectTipologia.innerHTML = '';
        containerTipologia.style.display = 'none';

        if (pubId) {
            try {
                // Pedir las tipologías específicas de esta publicación
                const res = await fetch(`/buildings/form/typologies/${pubId}`);
                const tipologies = await res.json();

                if (tipologies && tipologies.length > 0) {
                    // Si hay tipologías, llenamos el select y mostramos el div
                    selectTipologia.innerHTML = '<option value="">-- Selecciona una tipologia --</option>';
                    tipologies.forEach(t => {
                        const opt = document.createElement("option");
                        opt.value = t.id_typology;
                        opt.textContent = t.name;
                        selectTipologia.appendChild(opt);
                    });
                    // Mostrar el contenedor
                    containerTipologia.style.display = 'block';
                }
            } catch (err) {
                console.error("Error cargando tipologías:", err);
            }
        }
    });

    // Cargar los desplegables al cargar la página
    await carregarDesplegables();

    // Evento para enviar el formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        // Obtenemos los datos del formulario
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        //creamos variable pictureUrl
        let pictureUrl = "";

        const pictureFile = formData.get("picture");
        // Si se ha seleccionado un archivo
        if (pictureFile && pictureFile.size > 0) {
            const uploadData = new FormData();
            uploadData.append("picture", pictureFile);

            // Subir la imagen al servidor
            try {
                const uploadRes = await fetch("/buildings/form/upload", {
                    method: "POST",
                    body: uploadData
                });
                // Obtenemos la respuesta
                const uploadResult = await uploadRes.json();
                if (uploadResult.success) {
                    pictureUrl = uploadResult.filePath;
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
        data.pictureUrl = pictureUrl;

        const oblig = ["name", "address", "construction_year", "publications"];
        // Validamos los campos obligatorios
        for (let field of oblig) {
            if (!data[field]) {
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