const i18nDict = {
    en: {
        hero_title: "Elevate your workflow",
        hero_subtitle: "Professional file conversions, background removal, and compression tools in one sleek interface.",
        tab_video: "Video", tab_image: "Image", tab_pdf: "PDF",
        video_title: "Advanced Video Processing",
        video_drop: "Drag & Drop your Video here",
        video_start: "Start Time (sec):", video_end: "End Time (sec):",
        video_trim_hint: "Adjust values to trim the video.",
        video_action: "Action:", video_act_extract: "Convert to MP3 (Audio Only)", video_act_compress: "Compress Video (Reduce File Size)",
        video_quality: "Target Quality:", video_q_high: "High (1080p)", video_q_med: "Medium (720p)", video_q_low: "Low (480p)",
        video_btn: "Process Video",
        img_title: "Professional Image Tools",
        img_drop: "Drag & Drop your Image here",
        img_action: "Action:", img_act_rm: "Remove Background", img_act_res: "Resize & Convert Format",
        img_width: "Width (px):", img_fmt: "Format:", img_btn: "Process Image",
        pdf_title: "PDF Optimization & Full Metadata",
        pdf_drop: "Drag & Drop your PDF here", pdf_hint: "Compress and edit all properties",
        pdf_desc: "The PDF will be automatically compressed when saving. You can also totally control the internal documentation properties below.",
        pdf_f_title: "Document Title:", pdf_f_author: "Author:", pdf_f_sub: "Subject:", pdf_f_key: "Keywords:", pdf_f_creat: "Creator:", pdf_f_prod: "Producer:",
        pdf_btn: "Process PDF",
        status_load: "Processing your file...",
        modal_title: "Interactive Background Eraser", modal_tol: "Magic Wand Tolerance:", modal_undo: "Undo", modal_reset: "Reset",
        modal_hint: "Click anywhere on the background to magically erase it.", modal_apply: "Apply & Process"
    },
    es: {
        hero_title: "Mejora tu flujo de trabajo",
        hero_subtitle: "Herramientas profesionales de conversión, borrado de fondo y compresión de archivos.",
        tab_video: "Vídeo", tab_image: "Imagen", tab_pdf: "PDF",
        video_title: "Procesado Avanzado de Vídeo",
        video_drop: "Arrastra y Suelta tu Vídeo aquí",
        video_start: "Inicio (seg):", video_end: "Fin (seg):",
        video_trim_hint: "Ajusta los valores numéricos para recortar el vídeo.",
        video_action: "Acción:", video_act_extract: "Convertir a MP3 (Solo Audio)", video_act_compress: "Comprimir Vídeo",
        video_quality: "Calidad:", video_q_high: "Alta (1080p)", video_q_med: "Media (720p)", video_q_low: "Baja (480p)",
        video_btn: "Procesar Vídeo",
        img_title: "Herramientas de Imagen Pro",
        img_drop: "Arrastra tu Imagen aquí",
        img_action: "Acción:", img_act_rm: "Eliminar Fondo", img_act_res: "Redimensionar y Convertir Format",
        img_width: "Ancho (px):", img_fmt: "Formato:", img_btn: "Procesar Imagen",
        pdf_title: "Optimización PDF y Metadatos Completos",
        pdf_drop: "Arrastra tu PDF aquí", pdf_hint: "Comprime y edita atributos",
        pdf_desc: "El PDF se auto-comprimirá localmente. Puedes sobreescribir todos sus metadatos usando las casillas inferiores.",
        pdf_f_title: "Título:", pdf_f_author: "Autor:", pdf_f_sub: "Asunto:", pdf_f_key: "Palabras Clave:", pdf_f_creat: "Creador:", pdf_f_prod: "Productor:",
        pdf_btn: "Procesar PDF",
        status_load: "Procesando tu archivo de forma segura...",
        modal_title: "Borrador Mágico Interactivo", modal_tol: "Tolerancia Mágica:", modal_undo: "Deshacer", modal_reset: "Resetear",
        modal_hint: "Haz clic en el fondo que quieras convertir a transparente.", modal_apply: "Aplicar y Procesar"
    }
};

document.addEventListener('DOMContentLoaded', () => {

    // Language Switcher Logic
    const langSelect = document.getElementById('langSwitcher');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            const dict = i18nDict[lang] || i18nDict['en'];
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (dict[key]) {
                    if (el.tagName === 'INPUT' && el.type === 'text') {
                        // Placeholder logic isn't fully set for i18n yet, keeping textContent for elements
                        el.textContent = dict[key];
                    } else {
                        el.textContent = dict[key];
                    }
                }
            });
        });
    }

    // Tab Switching Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const toolSections = document.querySelectorAll('.tool-section');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            toolSections.forEach(s => s.classList.remove('active-tool'));
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active-tool');
            resetStatus();
        });
    });

    // Video Tool dynamic options
    const videoActionSel = document.getElementById('videoAction');
    const videoCompressOptions = document.getElementById('videoCompressOptions');
    if (videoActionSel && videoCompressOptions) {
        videoActionSel.addEventListener('change', (e) => {
            if (e.target.value === 'compress-video') {
                videoCompressOptions.style.display = 'block';
            } else {
                videoCompressOptions.style.display = 'none';
            }
        });
    }

    // Image Tool dynamic options
    const imageActionSel = document.getElementById('imageAction');
    const resizeOptions = document.getElementById('resizeOptions');
    if (imageActionSel && resizeOptions) {
        imageActionSel.addEventListener('change', (e) => {
            if (e.target.value === 'resize') {
                resizeOptions.style.display = 'block';
            } else {
                resizeOptions.style.display = 'none';
            }
        });
    }

    // File Input & Drag and Drop Handling
    const fileInputs = document.querySelectorAll('.file-input');
    
    fileInputs.forEach(input => {
        const dropzone = input.closest('.dropzone');
        const toolForm = input.closest('.tool-form');
        const selectedFileDiv = toolForm.querySelector('.selected-file');
        const filenameSpan = selectedFileDiv.querySelector('.filename');
        const removeBtn = selectedFileDiv.querySelector('.remove-file');
        const fileMetaSpan = selectedFileDiv.querySelector('.file-meta');

        const triggerUIUpdate = (file) => {
            if (file) {
                dropzone.style.display = 'none';
                selectedFileDiv.style.display = 'flex';
                filenameSpan.textContent = file.name;
                
                if (fileMetaSpan) {
                    const mbSize = (file.size / (1024 * 1024)).toFixed(2);
                    const ext = file.name.split('.').pop().toUpperCase();
                    fileMetaSpan.textContent = `${mbSize} MB • Format: ${ext}`;
                }

                // If this is the video tool, load the trimmer preview
                if (input.id === 'fileInputVideo') {
                    const videoPreview = document.getElementById('videoPreview');
                    const videoContainer = document.getElementById('videoPreviewContainer');
                    const startTimeInput = document.getElementById('videoStartTime');
                    const endTimeInput = document.getElementById('videoEndTime');
                    if (videoPreview) {
                        videoPreview.src = URL.createObjectURL(file);
                        videoPreview.onloadedmetadata = function() {
                            startTimeInput.value = 0;
                            startTimeInput.max = this.duration;
                            endTimeInput.value = this.duration.toFixed(1);
                            endTimeInput.max = this.duration;
                            videoContainer.style.display = 'block';
                        };
                    }
                }

            } else {
                dropzone.style.display = 'block';
                selectedFileDiv.style.display = 'none';
                input.value = ''; // Reset input
                if (input.id === 'fileInputVideo') {
                    const videoContainer = document.getElementById('videoPreviewContainer');
                    if (videoContainer) videoContainer.style.display = 'none';
                }
            }
            resetStatus();
        };

        input.addEventListener('change', (e) => {
            if (input.files.length) triggerUIUpdate(input.files[0]);
        });
        removeBtn.addEventListener('click', () => {
            triggerUIUpdate(null);
        });

        dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
        dropzone.addEventListener('dragleave', (e) => { e.preventDefault(); dropzone.classList.remove('dragover'); });
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault(); dropzone.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                const dT = new DataTransfer();
                dT.items.add(e.dataTransfer.files[0]);
                input.files = dT.files;
                triggerUIUpdate(input.files[0]);
            }
        });
    });

    const statusContainer = document.getElementById('statusContainer');
    const statusMessage = document.getElementById('statusMessage');
    const loader = document.getElementById('loader');
    const downloadAction = document.getElementById('downloadAction');

    const resetStatus = () => {
        statusContainer.style.display = 'none';
        loader.style.display = 'none';
        downloadAction.style.display = 'none';
        statusMessage.className = 'status-message';
        statusMessage.textContent = '';
        downloadAction.innerHTML = '';
    };

    const setStatus = (msg, state = 'loading') => {
        statusContainer.style.display = 'block';
        statusMessage.textContent = msg;
        statusMessage.className = 'status-message';
        
        if (state === 'loading') {
            loader.style.display = 'flex'; downloadAction.style.display = 'none';
        } else if (state === 'success') {
            loader.style.display = 'none'; statusMessage.classList.add('status-success'); downloadAction.style.display = 'block';
        } else if (state === 'error') {
            loader.style.display = 'none'; statusMessage.classList.add('status-error'); downloadAction.style.display = 'none';
        }
    };

    const renderDownloadUrl = (url, name) => {
        const a = document.createElement('a');
        a.href = url; a.className = 'download-btn'; a.textContent = 'Download Result'; a.download = name || '';
        const icon = document.createElement('i'); icon.className = 'fa-solid fa-download';
        a.prepend(icon); downloadAction.appendChild(a);
    };

    const handleFormSubmit = async (e, endpoint, processFormData = null) => {
        e.preventDefault();
        const formEl = document.getElementById(e.target.id);
        const fileInput = formEl.querySelector('.file-input');
        if (!fileInput.files.length) return alert('Please select a file first.');

        const formData = new FormData(formEl);
        if (processFormData) processFormData(formData);

        const submitBtn = formEl.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        setStatus('Processing request. This might take a few moments...', 'loading');

        try {
            const resp = await fetch(endpoint, { method: 'POST', body: formData });
            if (!resp.ok) {
                const errData = await resp.json().catch(() => ({}));
                throw new Error(errData.details || errData.error || `Server error: ${resp.status}`);
            }
            const contentDisposition = resp.headers.get('Content-Disposition');
            let fileName = 'downloaded_file';
            if (contentDisposition && contentDisposition.includes('filename=')) {
                fileName = contentDisposition.split('filename=')[1].replace(/["']/g, '');
            }
            const blob = await resp.blob();
            const downloadUrl = URL.createObjectURL(blob);
            setStatus('File processed successfully!', 'success');
            renderDownloadUrl(downloadUrl, fileName);
        } catch (error) {
            setStatus('Error: ' + error.message, 'error');
        } finally {
            submitBtn.disabled = false;
        }
    };

    // Bind Forms
    document.getElementById('uploadFormVideo').addEventListener('submit', (e) => {
        handleFormSubmit(e, '/api/v1/video/process');
    });

    document.getElementById('uploadFormPdf').addEventListener('submit', (e) => {
        handleFormSubmit(e, '/api/v1/pdf/compress');
    });

    // Magic Wand Editor Logic
    const magicModal = document.getElementById('magicEditorModal');
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let originalImageObj = null;
    let historyState = null;

    if (magicModal) {
        document.getElementById('closeEditorBtn').addEventListener('click', () => { magicModal.style.display = 'none'; });
        document.getElementById('toleranceSlider').addEventListener('input', (e) => {
            document.getElementById('tolValue').textContent = e.target.value;
        });
        document.getElementById('clearEditorBtn').addEventListener('click', () => {
            if (originalImageObj) drawImageToCanvas(originalImageObj);
        });
        document.getElementById('undoEditorBtn').addEventListener('click', () => {
            if (historyState) ctx.putImageData(historyState, 0, 0);
        });
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width; const scaleY = canvas.height / rect.height;
            const x = Math.floor((e.clientX - rect.left) * scaleX); const y = Math.floor((e.clientY - rect.top) * scaleY);
            const tolerance = parseInt(document.getElementById('toleranceSlider').value, 10);
            historyState = ctx.getImageData(0, 0, canvas.width, canvas.height);
            floodFill(x, y, tolerance);
        });
    }

    const drawImageToCanvas = (img) => {
        const MAX_WIDTH = 1280;
        let w = img.width; let h = img.height;
        if (w > MAX_WIDTH) { h = Math.floor(h * (MAX_WIDTH / w)); w = MAX_WIDTH; }
        canvas.width = w; canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);
    };

    const colorMatch = (a, b, tolerance) => {
        return Math.abs(a[0] - b[0]) <= tolerance && Math.abs(a[1] - b[1]) <= tolerance && Math.abs(a[2] - b[2]) <= tolerance && a[3] === b[3];
    };

    const floodFill = (startX, startY, tolerance) => {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data; const w = canvas.width; const h = canvas.height;
        const startIdx = (startY * w + startX) * 4;
        const startColor = [data[startIdx], data[startIdx+1], data[startIdx+2], data[startIdx+3]];
        if (startColor[3] === 0) return;
        const targetColor = [0, 0, 0, 0];
        const stack = [[startX, startY]];
        const visited = new Uint8Array(w * h);

        while(stack.length > 0) {
            let [x, y] = stack.pop(); let idx1D = y * w + x;
            if (visited[idx1D]) continue;
            let colIdx = idx1D * 4;
            let currentColor = [data[colIdx], data[colIdx+1], data[colIdx+2], data[colIdx+3]];
            if (colorMatch(startColor, currentColor, tolerance)) {
                data[colIdx] = targetColor[0]; data[colIdx+1] = targetColor[1]; data[colIdx+2] = targetColor[2]; data[colIdx+3] = targetColor[3];
                visited[idx1D] = 1;
                if (x > 0) stack.push([x-1, y]); if (x < w-1) stack.push([x+1, y]);
                if (y > 0) stack.push([x, y-1]); if (y < h-1) stack.push([x, y+1]);
            }
        }
        ctx.putImageData(imgData, 0, 0);
    };

    document.getElementById('applyEditorBtn')?.addEventListener('click', () => {
        magicModal.style.display = 'none';
        canvas.toBlob((blob) => {
            const formEl = document.getElementById('uploadFormImage');
            const fileInput = formEl.querySelector('.file-input');
            const originalFile = fileInput.files[0];
            let formData = new FormData();
            formData.append('image', blob, originalFile.name);
            const submitBtn = formEl.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            setStatus('Optimizing and finishing your image...', 'loading');
            fetch('/api/v1/image/remove-background', { method: 'POST', body: formData })
            .then(async (resp) => {
                if (!resp.ok) {
                    const errData = await resp.json().catch(() => ({})); throw new Error(errData.details || errData.error || `Server error: ${resp.status}`);
                }
                const contentDisposition = resp.headers.get('Content-Disposition');
                let fileName = 'downloaded_file';
                if (contentDisposition && contentDisposition.includes('filename=')) fileName = contentDisposition.split('filename=')[1].replace(/["']/g, '');
                const dlBlob = await resp.blob(); const downloadUrl = URL.createObjectURL(dlBlob);
                setStatus('File processed successfully!', 'success'); renderDownloadUrl(downloadUrl, fileName);
            })
            .catch(error => setStatus('Error: ' + error.message, 'error'))
            .finally(() => submitBtn.disabled = false);
        }, 'image/png');
    });

    document.getElementById('uploadFormImage').addEventListener('submit', (e) => {
        e.preventDefault();
        const actionSel = document.getElementById('imageAction').value;
        const fileInput = e.target.querySelector('.file-input');
        if (!fileInput.files.length) return alert('Please select a file first.');
        if (actionSel === 'resize') handleFormSubmit(e, '/api/v1/image/resize-convert');
        else {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                originalImageObj = new Image();
                originalImageObj.onload = () => { drawImageToCanvas(originalImageObj); historyState = null; magicModal.style.display = 'flex'; };
                originalImageObj.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

});
