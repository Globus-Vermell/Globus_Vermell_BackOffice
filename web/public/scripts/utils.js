
const AppUtils = {
    /**
     * Inicializa un MultiSelect con las opciones por defecto.
     * @param {HTMLElement|string} element - El elemento select o su ID.
     * @param {string} placeholder - Texto placeholder.
     * @param {Object} extraOptions - Opciones adicionales (opcional).
     * @returns {MultiSelect} Instancia del MultiSelect.
     */
    initMultiSelect: (element, placeholder = 'Selecciona alguna opció...', extraOptions = {}) => {
        const selectElement = typeof element === 'string' ? document.getElementById(element) : element;
        if (!selectElement) return null;

        return new MultiSelect(selectElement, {
            placeholder: placeholder,
            search: true,
            selectAll: true,
            ...extraOptions
        });
    },

    /**
     * Convierte un formulario HTML en un objeto JSON, manejando
     * automáticamente los campos array del MultiSelect (quitando los []).
     * @param {HTMLFormElement} form - El formulario a procesar.
     * @returns {Object} Objeto con los datos limpios.
     */
    serializeForm: (form) => {
        const formData = new FormData(form);
        const data = {};

        for (const [key, value] of formData.entries()) {
            const cleanKey = key.replace('[]', '');

            if (data[cleanKey]) {
                if (!Array.isArray(data[cleanKey])) {
                    data[cleanKey] = [data[cleanKey]];
                }
                data[cleanKey].push(value);
            } else {
                data[cleanKey] = value;
            }
        }
        return data;
    },

    /**
     * Función para eliminar elementos con confirmación.
     * @param {string} url - Endpoint para eliminar (ej: '/buildings/delete/5').
     * @param {string} confirmMsg - Mensaje de confirmación.
     */
    confirmAndDelete: async (url, confirmMsg = "Segur que vols eliminar aquest element?", successRedirect = null) => {
        if (!confirm(confirmMsg)) return;

        try {
            const res = await fetch(url, { method: "DELETE" });
            const data = await res.json();

            Swal.fire({
                text: data.message,
                icon: data.success ? 'success' : 'error'
            }).then(() => {
                if (data.success) {
                    if (successRedirect) {
                        window.location.href = successRedirect;
                    } else {
                        window.location.reload();
                    }
                }
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Error de connexió al servidor."
            });
        }
    },

    /**
     * Función para validar elementos con confirmación.
     * @param {string} url - Endpoint (ej: '/buildings/validation/5').
     * @param {string} confirmMsg - Mensaje de confirmación.
     */
    validateItem: async (url, confirmMsg = "Segur que vols validar aquest element?") => {
        if (!confirm(confirmMsg)) return;

        try {
            const res = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ validated: true })
            });
            const data = await res.json();

            Swal.fire({ text: data.message, icon: data.success ? 'success' : 'error' })
                .then(() => { if (data.success) location.reload(); });
        } catch (err) {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Error', text: "Error al validar." });
        }
    },

    /**
     * Subir archivos a una URL específica.
     * @param {string} inputId - ID del input type="file".
     * @param {string} uploadUrl - Endpoint del servidor (ej: '/buildings/upload').
     * @param {string} formDataKey - Nombre del campo que espera Multer (ej: 'pictures' o 'image').
     * @returns {Promise<Object|null>} Retorna la respuesta del servidor o null si no se seleccionaron archivos.
     */

    uploadFiles: async (inputId, uploadUrl, formDataKey = 'image') => {
        const input = document.getElementById(inputId);
        if (!input || !input.files || input.files.length === 0) return null;

        const uploadData = new FormData();
        for (const file of input.files) {
            uploadData.append(formDataKey, file);
        }

        try {
            const res = await fetch(uploadUrl, { method: "POST", body: uploadData });
            const result = await res.json();

            if (!result.success) {
                throw new Error(result.message || "Error al pujar fitxer");
            }
            return result;
        } catch (err) {
            console.error("Upload error:", err);
            Swal.fire({ icon: 'error', title: 'Error', text: err.message || "Error de connexió al pujar fitxer." });
            throw err;
        }
    },


    /**
     * Función para gestionar una lista dinámica de textareas.
     * @param {string} containerId - ID del contenedor donde se añadirán los campos.
     * @param {string} buttonId - ID del botón para añadir nuevos campos.
     * @param {string} fieldName - Nombre del atributo name para el input.
     * @param {Array} initialValues - Array de strings para precargar valores en edición.
     */
    setupDynamicList: (containerId, buttonId, fieldName, initialValues = []) => {
        const container = document.getElementById(containerId);
        const btn = document.getElementById(buttonId);

        if (!container || !btn) return;

        const addField = (value = '') => {
            const div = document.createElement('div');
            div.classList.add('description-row');

            const textarea = document.createElement('textarea');
            textarea.name = fieldName;
            textarea.value = value;
            textarea.rows = 3;

            const deleteButton = document.createElement('button');
            deleteButton.type = "button";
            deleteButton.innerHTML = '<img src="/images/icons/trash-2-64.png" alt="Borrar">';
            deleteButton.classList.add('delete-description-button');
            deleteButton.onclick = () => div.remove();

            div.appendChild(textarea);
            div.appendChild(deleteButton);
            container.appendChild(div);
        };

        btn.addEventListener('click', () => addField());

        if (initialValues && initialValues.length > 0) {
            initialValues.forEach(val => addField(val.content || val));
        }
    },

    /**
     * Vincula un MultiSelect de publicaciones con un Select de tipologías.
     * @param {Object} publicationsMS - Instancia del MultiSelect de publicaciones.
     * @param {string} targetSelectId - ID del select de tipologías (el destino).
     * @param {string} containerId - ID del contenedor que se oculta/muestra.
     * @param {string|number} preSelectedId - (Opcional) ID de la tipología preseleccionada (para edit).
     */
    linkPublicationsToTypologies: async (publicationsMS, targetSelectId, containerId, preSelectedId = null) => {
        const selectTipologia = document.getElementById(targetSelectId);
        const containerTipologia = document.getElementById(containerId);

        if (!selectTipologia || !containerTipologia) return;

        const update = async () => {
            const selectedIds = publicationsMS.selectedValues;

            // Resetear estado visual
            containerTipologia.style.display = 'none';
            selectTipologia.innerHTML = '<option value="">-- Selecciona una tipologia --</option>';

            if (!selectedIds || selectedIds.length === 0) return;

            try {
                const idsString = selectedIds.join(',');
                const res = await fetch(`/buildings/typologies/filter?ids=${idsString}`);
                const typologies = await res.json();

                if (typologies && typologies.length > 0) {
                    containerTipologia.style.display = 'block';

                    typologies.forEach(t => {
                        const opt = document.createElement("option");
                        opt.value = t.id_typology;
                        opt.textContent = t.name;

                        if (preSelectedId && t.id_typology == preSelectedId) {
                            opt.selected = true;
                        }
                        selectTipologia.appendChild(opt);
                    });
                }
            } catch (err) {
                console.error("Error al cargar tipologías vinculadas:", err);
            }
        };
        await update();
        return update;
    }

};