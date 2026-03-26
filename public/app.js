const i18nDict = {
    en: {
        hero_title: "Your <i>Smart</i> Toolbox",
        hero_subtitle: "Convert, edit, and optimize your files in seconds. 100% Private and in your browser.",
        tab_video: "Video Studio", tab_image: "Image Tools", tab_pdf: "PDF Editor",
        video_title: "Video Studio",
        video_drop: "Drop your Video here",
        video_start: "Start at (sec):", video_end: "End at (sec):",
        video_trim_hint: "Choose the exact part you want to keep.",
        video_action: "What would you like to do?", video_act_extract: "Get Sound (MP3)", video_act_compress: "Make file smaller",
        video_quality: "Quality:", video_q_high: "High", video_q_med: "Standard", video_q_low: "Small file",
        video_btn: "Done! Create Video",
        img_title: "Image Tools",
        img_drop: "Drop your Image here",
        img_action: "What do you want to do?", img_act_rm: "Remove Background", img_act_res: "Change Size",
        img_width: "Width (px):", img_fmt: "Format:", img_btn: "Done! Create Image",
        pdf_title: "PDF Editor",
        pdf_drop: "Drop your PDF here", pdf_hint: "Ready to edit and optimize",
        pdf_desc: "Your files stay with you. Adjust everything with a simple click.",
        pdf_f_title: "Document Title:", pdf_f_author: "Owner/Author:", pdf_f_sub: "Subject:", pdf_f_key: "Keywords:", pdf_f_creat: "Created by:", pdf_f_prod: "Produced by:",
        pdf_btn: "Done! Create PDF",
        status_load: "Working on it... 🔨",
        modal_title: "Remove Background", modal_tol: "Sensitivity:", modal_undo: "Back", modal_reset: "Reset",
        modal_hint: "Choose a tool and click or paint to erase the background.", modal_apply: "Save & Export",
        err_format: "This file type isn't supported yet.",
        err_server: "Oops, something went wrong. Try again!",
        err_generic: "An error occurred. Please refresh."
    },
    es: {
        hero_title: "Tu Caja de <i>Herramientas</i> Inteligente",
        hero_subtitle: "Convierte, edita y optimiza tus archivos en segundos. 100% Privado y en tu navegador.",
        tab_video: "Estudio de Vídeo", tab_image: "Herramientas de Imagen", tab_pdf: "Editor de PDF",
        video_title: "Estudio de Vídeo",
        video_drop: "Suelta tu Vídeo aquí",
        video_start: "Empezar en (seg):", video_end: "Terminar en (seg):",
        video_trim_hint: "Elige exactamente el trozo que quieres guardar.",
        video_action: "¿Qué quieres hacer con este vídeo?", video_act_extract: "Sacar el Sonido (MP3)", video_act_compress: "Hacerlo menos pesado",
        video_quality: "Calidad:", video_q_high: "Alta", video_q_med: "Estándar", video_q_low: "Archivo pequeño",
        video_btn: "¡Listo! Crear Vídeo",
        img_title: "Herramientas de Imagen",
        img_drop: "Suelta tu Imagen aquí",
        img_action: "¿Qué quieres hacer con esta imagen?", img_act_rm: "Borrar Fondo", img_act_res: "Cambiar Tamaño",
        img_width: "Ancho (px):", img_fmt: "Formato:", img_btn: "¡Listo! Crear Imagen",
        pdf_title: "Editor de PDF",
        pdf_drop: "Suelta tu PDF aquí", pdf_hint: "Listo para editar y optimizar",
        pdf_desc: "Tus archivos no salen de aquí. Ajusta todo con un simple clic.",
        pdf_f_title: "Título del documento:", pdf_f_author: "Dueño/Autor:", pdf_f_sub: "Asunto:", pdf_f_key: "Palabras Clave:", pdf_f_creat: "Creado por:", pdf_f_prod: "Producido por:",
        pdf_btn: "¡Listo! Crear PDF",
        status_load: "¡Manos a la obra! 🔨",
        modal_title: "Borrar Fondo", modal_tol: "Sensibilidad:", modal_undo: "Atrás", modal_reset: "Reiniciar",
        modal_hint: "Elige una herramienta y pincha o pinta para borrar el fondo.", modal_apply: "Guardar y Exportar",
        err_format: "Este tipo de archivo aún no lo soportamos.",
        err_server: "Vaya, algo ha fallado. ¡Inténtalo de nuevo!",
        err_generic: "Ha ocurrido un error. Por favor, recarga."
    }
};

// Global Helpers
window.adjustTime = (inputId, delta) => {
    const input = document.getElementById(inputId);
    const startInput = document.getElementById('videoStartTime');
    const endInput = document.getElementById('videoEndTime');
    const video = document.getElementById('videoPreview');
    
    let newVal = Math.max(0, Math.min(parseFloat(input.value || 0) + delta, video.duration || 0));
    
    // Safety checks
    if(inputId === 'videoStartTime' && newVal >= parseFloat(endInput.value)) newVal = parseFloat(endInput.value) - 0.1;
    if(inputId === 'videoEndTime' && newVal <= parseFloat(startInput.value)) newVal = parseFloat(startInput.value) + 0.1;

    input.value = newVal.toFixed(1);
    video.currentTime = newVal;
    input.dispatchEvent(new Event('change'));
};

document.addEventListener('DOMContentLoaded', () => {

    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    if (!localStorage.getItem('toolchest_cookies_accepted')) setTimeout(() => cookieBanner.style.display = 'block', 1000);
    acceptBtn?.addEventListener('click', () => {
        localStorage.setItem('toolchest_cookies_accepted', 'true');
        cookieBanner.style.opacity = '0';
        setTimeout(() => cookieBanner.style.display = 'none', 500);
    });

    const langSelect = document.getElementById('langSwitcher');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            const dict = i18nDict[lang] || i18nDict['en'];
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (dict[key]) el.innerHTML = dict[key];
            });
        });
    }

    const tabBtns = document.querySelectorAll('.tab-btn');
    const toolSections = document.querySelectorAll('.tool-section');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if(btn.classList.contains('active')) return;
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            toolSections.forEach(s => { s.style.opacity = '0'; setTimeout(() => s.classList.remove('active-tool'), 300); });
            setTimeout(() => { document.getElementById(btn.getAttribute('data-target')).classList.add('active-tool'); resetStatus(); }, 300);
        });
    });

    const setupActionGrid = (gridId, hiddenInputId) => {
        const grid = document.getElementById(gridId);
        const input = document.getElementById(hiddenInputId);
        if (!grid || !input) return;
        grid.querySelectorAll('.action-opt').forEach(btn => {
            btn.addEventListener('click', () => {
                grid.querySelectorAll('.action-opt').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                input.value = btn.getAttribute('data-value');
                input.dispatchEvent(new Event('change'));
            });
        });
    };
    setupActionGrid('videoActionGrid', 'videoAction');
    setupActionGrid('imageActionGrid', 'imageAction');
    setupActionGrid('pdfActionGrid', 'pdfAction');

    document.getElementById('videoAction')?.addEventListener('change', (e) => {
        const val = e.target.value;
        document.getElementById('videoCompressOptions').style.display = (val === 'compress-video' || val === 'convert-format') ? 'block' : 'none';
        document.getElementById('videoFormatGroup').style.display = (val === 'convert-format') ? 'block' : 'none';
    });

    document.getElementById('imageAction')?.addEventListener('change', (e) => {
        document.getElementById('resizeOptions').style.display = (e.target.value === 'resize') ? 'block' : 'none';
    });

    // --- Advanced Video Interaction (Timeline Drag & Seek) ---
    const video = document.getElementById('videoPreview');
    const timeline = document.getElementById('videoTrimTimeline');
    const bar = document.getElementById('videoTrimBar');
    const startIn = document.getElementById('videoStartTime');
    const endIn = document.getElementById('videoEndTime');
    const durationLbl = document.getElementById('videoTrimDuration');

    let isDragging = false;
    let dragPart = null; // 'left', 'right', 'center'

    const updateTrimUI = () => {
        const start = parseFloat(startIn.value) || 0;
        const end = parseFloat(endIn.value) || 0;
        const duration = video.duration || 1;
        
        const left = (start / duration) * 100;
        const width = ((end - start) / duration) * 100;
        if(bar) { bar.style.left = left + '%'; bar.style.width = width + '%'; }
        if(durationLbl) durationLbl.textContent = `Duración: ${Math.max(0, end - start).toFixed(1)}s`;
    };

    [startIn, endIn].forEach(input => {
        input?.addEventListener('change', () => {
            video.currentTime = parseFloat(input.value);
            updateTrimUI();
        });
    });

    timeline?.addEventListener('mousedown', (e) => {
        if(!video.duration) return;
        isDragging = true;
        const rect = timeline.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const clickedTime = (offsetX / rect.width) * video.duration;
        
        const start = parseFloat(startIn.value);
        const end = parseFloat(endIn.value);
        const threshold = (video.duration * 0.05); // 5% tolerance

        if(Math.abs(clickedTime - start) < threshold) dragPart = 'left';
        else if(Math.abs(clickedTime - end) < threshold) dragPart = 'right';
        else if(clickedTime > start && clickedTime < end) dragPart = 'center';
        else dragPart = null;
    });

    document.addEventListener('mousemove', (e) => {
        if(!isDragging || !dragPart) return;
        const rect = timeline.getBoundingClientRect();
        const offsetX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const newTime = (offsetX / rect.width) * video.duration;

        if(dragPart === 'left') {
            const end = parseFloat(endIn.value);
            startIn.value = Math.min(newTime, end - 0.1).toFixed(1);
            video.currentTime = parseFloat(startIn.value);
        } else if(dragPart === 'right') {
            const start = parseFloat(startIn.value);
            endIn.value = Math.max(newTime, start + 0.1).toFixed(1);
            video.currentTime = parseFloat(endIn.value);
        }
        updateTrimUI();
    });

    document.addEventListener('mouseup', () => { isDragging = false; dragPart = null; });

    const fileInputs = document.querySelectorAll('.file-input');
    fileInputs.forEach(input => {
        const dropzone = input.closest('.dropzone');
        const toolForm = input.closest('.tool-form');
        const selectedFileDiv = toolForm.querySelector('.selected-file');
        
        const updateState = async (file) => {
            if (file) {
                dropzone.style.display = 'none';
                selectedFileDiv.style.display = 'flex';
                toolForm.querySelectorAll('.preview-card').forEach(c => c.remove());
                const previewCard = document.createElement('div');
                previewCard.className = 'preview-card';
                previewCard.innerHTML = `
                    <div class="preview-thumb" id="thumb-${input.id}"><i class="fa-solid fa-spinner fa-spin"></i></div>
                    <div class="preview-info">
                        <span class="meta-tag">${file.name.split('.').pop().toUpperCase()}</span>
                        <h4>${file.name}</h4>
                        <p>Tamaño: ${(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        <p id="extra-meta-${input.id}"></p>
                    </div>
                    <i class="fa-solid fa-circle-xmark remove-file" style="cursor:pointer; font-size:1.5rem; color:var(--acc-error); margin-left:auto;"></i>
                `;
                toolForm.insertBefore(previewCard, toolForm.querySelector('.card-bg'));
                previewCard.querySelector('.remove-file').onclick = () => updateState(null);
                const thumb = document.getElementById(`thumb-${input.id}`);
                const extra = document.getElementById(`extra-meta-${input.id}`);

                if (input.id === 'fileInputVideo') {
                    video.src = URL.createObjectURL(file);
                    video.onloadedmetadata = () => {
                        thumb.innerHTML = ''; thumb.className = 'preview-video-thumb'; thumb.style.width = '100%';
                        const vClone = document.createElement('video'); vClone.src = video.src; vClone.style.width='100%'; thumb.appendChild(vClone);
                        extra.textContent = `Duración: ${video.duration.toFixed(1)}s`;
                        startIn.value = 0;
                        endIn.value = video.duration.toFixed(1);
                        document.getElementById('videoPreviewContainer').style.display = 'block';
                        updateTrimUI();
                    };
                } else if (input.id === 'fileInputImage') {
                    const img = new Image(); img.src = URL.createObjectURL(file);
                    img.onload = () => { thumb.innerHTML = `<img src="${img.src}">`; extra.textContent = `Resolución: ${img.width}x${img.height}px`; document.getElementById('width').value = img.width; };
                } else if (input.id === 'fileInputPdf') {
                    try {
                        const pdfjs = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
                        const data = new Uint8Array(await file.arrayBuffer());
                        const pdf = await pdfjs.getDocument(data).promise;
                        const page = await pdf.getPage(1);
                        const canvas = document.createElement('canvas');
                        const vp = page.getViewport({scale: 0.3});
                        canvas.width = vp.width; canvas.height = vp.height;
                        await page.render({canvasContext: canvas.getContext('2d'), viewport: vp}).promise;
                        thumb.innerHTML = `<img src="${canvas.toDataURL()}">`;
                        const meta = await pdf.getMetadata();
                        extra.textContent = `Páginas: ${pdf.numPages}`;
                        if (meta.info) {
                            document.getElementById('pdfTitle').value = meta.info.Title || '';
                            document.getElementById('pdfAuthor').value = meta.info.Author || '';
                            document.getElementById('pdfSubject').value = meta.info.Subject || '';
                            document.getElementById('pdfKeywords').value = meta.info.Keywords || '';
                        }
                    } catch (e) { thumb.innerHTML = '<i class="fa-solid fa-file-pdf" style="font-size:2rem;"></i>'; }
                }
            } else {
                dropzone.style.display = 'block'; selectedFileDiv.style.display = 'none';
                toolForm.querySelectorAll('.preview-card').forEach(c => c.remove());
                input.value = '';
                if (input.id === 'fileInputVideo') document.getElementById('videoPreviewContainer').style.display = 'none';
            }
            resetStatus();
        };

        input.addEventListener('change', (e) => { if (input.files.length) updateState(input.files[0]); });
        dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.style.borderColor = 'var(--acc-primary)'; dropzone.style.backgroundColor = 'var(--acc-primary-soft)'; });
        dropzone.addEventListener('dragleave', (e) => { e.preventDefault(); dropzone.style.borderColor = 'var(--border-color)'; dropzone.style.backgroundColor = 'white'; });
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault(); dropzone.style.borderColor = 'var(--border-color)'; dropzone.style.backgroundColor = 'white';
            if (e.dataTransfer.files.length) {
                const dT = new DataTransfer(); dT.items.add(e.dataTransfer.files[0]);
                input.files = dT.files; updateState(input.files[0]);
            }
        });
    });

    const statusContainer = document.getElementById('statusContainer');
    const statusMessage = document.getElementById('statusMessage');
    const downloadAction = document.getElementById('downloadAction');
    const loader = document.getElementById('loader');

    const resetStatus = () => {
        if(statusContainer) statusContainer.style.display = 'none';
        if(downloadAction) { downloadAction.style.display = 'none'; downloadAction.innerHTML = ''; }
        if(loader) loader.style.display = 'none';
    };

    const setStatus = (msg, state = 'loading') => {
        if(!statusContainer) return;
        statusContainer.style.display = 'block';
        statusMessage.innerHTML = msg;
        statusMessage.className = 'status-message';
        if (state === 'loading') { loader.style.display = 'flex'; }
        else {
            loader.style.display = 'none';
            if (state === 'success') { statusMessage.classList.add('status-success'); downloadAction.style.display = 'block'; }
            else if (state === 'error') { statusMessage.classList.add('status-error'); statusContainer.animate([{transform:'translateX(-10px)'},{transform:'translateX(10px)'},{transform:'translateX(0)'}], {duration:300}); }
        }
    };

    const renderDownload = (url, name) => {
        const a = document.createElement('a'); a.href = url; a.className = 'download-btn'; a.textContent = 'Descargar Resultado'; a.download = name || 'result';
        const icon = document.createElement('i'); icon.className = 'fa-solid fa-download';
        a.prepend(icon); downloadAction.appendChild(a);
        a.animate([{opacity:0, transform:'translateY(10px)'},{opacity:1, transform:'translateY(0)'}], {duration:500, easing:'ease-out'});
    };

    const runProcess = async (e, endpoint) => {
        e.preventDefault();
        const form = e.target;
        const input = form.querySelector('.file-input');
        const lang = document.getElementById('langSwitcher')?.value || 'es';
        const dict = i18nDict[lang];
        if (!input.files.length) return;
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        setStatus(dict.status_load || '¡Manos a la obra! 🔨', 'loading');
        try {
            const resp = await fetch(endpoint, { method: 'POST', body: new FormData(form) });
            if (!resp.ok) throw new Error(resp.status === 400 ? dict.err_format : dict.err_server);
            const blob = await resp.blob();
            setStatus('¡Proceso completado con éxito!', 'success');
            const ext = blob.type.split('/')[1] === 'x-matroska' ? 'mkv' : (blob.type.split('/')[1] || 'out');
            renderDownload(URL.createObjectURL(blob), input.files[0].name.replace(/\.[^/.]+$/, "") + "_toolchest." + ext);
        } catch (error) { setStatus(`<i class="fa-solid fa-triangle-exclamation"></i> ${error.message}`, 'error'); }
        finally { btn.disabled = false; }
    };

    document.getElementById('uploadFormVideo').addEventListener('submit', (e) => runProcess(e, '/api/v1/video/process'));
    document.getElementById('uploadFormImage').addEventListener('submit', (e) => {
        if(document.getElementById('imageAction').value === 'resize') runProcess(e, '/api/v1/image/resize-convert');
        else {
            e.preventDefault();
            const f = document.getElementById('fileInputImage').files[0];
            const r = new FileReader(); r.onload = (ev) => {
                const img = new Image(); img.onload = () => { drawImg(img); document.getElementById('magicEditorModal').style.display = 'flex'; };
                img.src = ev.target.result;
            };
            r.readAsDataURL(f);
        }
    });

    document.getElementById('uploadFormPdf').addEventListener('submit', (e) => {
        if(document.getElementById('pdfAction').value === 'visual-editor') { e.preventDefault(); openVisualPdfEditor(document.getElementById('fileInputPdf').files[0]); }
        else runProcess(e, '/api/v1/pdf/compress');
    });

    const setupPanZoom = (wrapperId, zoomInId, zoomOutId, zoomLevelId) => {
        const wrapper = document.getElementById(wrapperId);
        if(!wrapper) return null;
        let scale = 1; let trX = 0; let trY = 0;
        const update = () => { wrapper.style.transform = `scale(${scale}) translate(${trX}px, ${trY}px)`; document.getElementById(zoomLevelId).textContent = Math.round(scale*100)+'%'; };
        document.getElementById(zoomInId)?.addEventListener('click', () => { scale = Math.min(scale * 1.2, 5); update(); });
        document.getElementById(zoomOutId)?.addEventListener('click', () => { scale = Math.max(scale / 1.2, 0.2); update(); });
        return { reset: () => { scale=1; trX=0; trY=0; update(); } };
    };
    setupPanZoom('imageCanvasWrapper', 'imgZoomInBtn', 'imgZoomOutBtn', 'imgZoomLevel');
    const pdfPZ = setupPanZoom('pdfCanvasWrapper', 'pdfZoomInBtn', 'pdfZoomOutBtn', 'pdfZoomLevel');

    let isDrawingPdf = false;
    let pdfDrawCtx = null;

    async function openVisualPdfEditor(file) {
        const modal = document.getElementById('pdfEditorModal');
        modal.style.display = 'flex';
        const canvas = document.getElementById('pdfRenderCanvas');
        const drawLayer = document.getElementById('pdfDrawLayer');
        const ctx = canvas.getContext('2d');
        pdfDrawCtx = drawLayer.getContext('2d');
        
        try {
            const pdfjs = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
            const data = new Uint8Array(await file.arrayBuffer());
            const pdf = await pdfjs.getDocument(data).promise;
            const page = await pdf.getPage(1);
            
            const container = modal.querySelector('.canvas-container');
            const targetWidth = container.clientWidth * 0.9;
            const viewportOrig = page.getViewport({scale: 1});
            const scale = targetWidth / viewportOrig.width;
            
            const vp = page.getViewport({scale: Math.min(scale, 1.5)}); 
            canvas.width = vp.width; canvas.height = vp.height;
            drawLayer.width = vp.width; drawLayer.height = vp.height;
            await page.render({canvasContext: ctx, viewport: vp}).promise;
            if(pdfPZ) pdfPZ.reset();
        } catch (e) { console.error("PDF Render Error", e); }
    }

    document.getElementById('closePdfEditorBtn')?.addEventListener('click', () => document.getElementById('pdfEditorModal').style.display = 'none');

    const drawImg = (img) => {
        const canvas = document.getElementById('imageCanvas');
        const ctx = canvas.getContext('2d');
        const modal = document.getElementById('magicEditorModal');
        const container = modal.querySelector('.canvas-container');
        let scale = Math.min(container.clientWidth / img.width, container.clientHeight / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    const dLayer = document.getElementById('pdfDrawLayer');
    dLayer?.addEventListener('mousedown', (e) => {
        if(!isDrawingPdf) return;
        const rect = dLayer.getBoundingClientRect();
        const wrapper = document.getElementById('pdfCanvasWrapper');
        const scale = parseFloat(wrapper.style.transform.match(/scale\(([^)]+)\)/)?.[1] || 1);
        pdfDrawCtx.beginPath(); pdfDrawCtx.moveTo((e.clientX - rect.left) / scale, (e.clientY - rect.top) / scale);
        dLayer._painting = true;
    });
    document.addEventListener('mousemove', (e) => {
        if(!isDrawingPdf || !dLayer?._painting) return;
        const rect = dLayer.getBoundingClientRect();
        const wrapper = document.getElementById('pdfCanvasWrapper');
        const scale = parseFloat(wrapper.style.transform.match(/scale\(([^)]+)\)/)?.[1] || 1);
        pdfDrawCtx.lineTo((e.clientX - rect.left) / scale, (e.clientY - rect.top) / scale);
        pdfDrawCtx.stroke();
    });
    document.addEventListener('mouseup', () => { if(dLayer) dLayer._painting = false; });

    document.getElementById('pdfSignBtn')?.addEventListener('click', (e) => {
        isDrawingPdf = !isDrawingPdf;
        e.target.classList.toggle('active', isDrawingPdf);
        dLayer.style.pointerEvents = isDrawingPdf ? 'auto' : 'none';
        dLayer.classList.toggle('signing', isDrawingPdf);
    });
});
