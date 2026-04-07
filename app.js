let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

function guardar() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

/* ── AGREGAR ── */
function agregarTarea() {
  const texto = document.getElementById("tarea").value.trim();
  const materia = document.getElementById("materia").value;
  const prioridad = document.getElementById("prioridad").value;
  const fecha = document.getElementById("fecha").value;

  if (!texto || !materia || !prioridad) {
    alert("Completa todos los campos obligatorios");
    return;
  }

  if (!confirm("¿Agregar tarea?")) return;

  tareas.push({ id: Date.now(), texto, materia, prioridad, fecha, completada: false });
  guardar();
  window.location.href = "tareas.html";
}

/* ── MOSTRAR ── */
function mostrar() {
  const lista = document.getElementById("lista");
  if (!lista) return;

  let datos = tareas.map((t, i) => ({ ...t, _realIndex: i }));

  const estado    = document.getElementById("filtroEstado")?.value;
  const materia   = document.getElementById("filtroMateria")?.value;
  const prioridad = document.getElementById("filtroPrioridad")?.value;
  const orden     = document.getElementById("orden")?.value;

  datos = datos.filter(t =>
    (!estado    || (estado === "pendiente" ? !t.completada : t.completada)) &&
    (!materia   || t.materia === materia) &&
    (!prioridad || t.prioridad === prioridad)
  );

  const ordenP = { Alta: 1, Media: 2, Baja: 3 };
  if (orden === "fecha") {
    datos.sort((a, b) => { if (!a.fecha) return 1; if (!b.fecha) return -1; return new Date(a.fecha) - new Date(b.fecha); });
  } else if (orden === "materia") {
    datos.sort((a, b) => a.materia.localeCompare(b.materia));
  } else {
    datos.sort((a, b) => {
      if (a.completada !== b.completada) return a.completada ? 1 : -1;
      return (ordenP[a.prioridad] || 99) - (ordenP[b.prioridad] || 99);
    });
  }

  // Contador
  const contador = document.getElementById("contador");
  const contadorTexto = document.getElementById("contadorTexto");
  const contadorSub = document.getElementById("contadorSub");
  if (contador) {
    const total = tareas.length;
    const pendientesFiltradas = datos.filter(t => !t.completada).length;
    if (total > 0) {
      contador.style.display = "flex";
      contadorTexto.textContent = `${datos.length} tarea${datos.length !== 1 ? 's' : ''} mostrada${datos.length !== 1 ? 's' : ''}`;
      contadorSub.textContent = `${pendientesFiltradas} de ${datos.length} pendiente${datos.length !== 1 ? 's' : ''}`;
    } else {
      contador.style.display = "none";
    }
  }

  lista.innerHTML = "";

  if (datos.length === 0) {
    lista.innerHTML = `<div class="empty-state">No hay tareas para mostrar</div>`;
    return;
  }

  datos.forEach(t => {
    const ri = t._realIndex;
    const div = document.createElement("div");
    div.className = `task ${t.prioridad.toLowerCase()} ${t.completada ? "completada" : ""}`;

    const fechaTexto = t.fecha ? formatearFecha(t.fecha) : "Sin fecha";
    const btnLabel = t.completada ? "Descompletar" : "Completar";

    div.innerHTML = `
      <strong class="task-titulo">${t.texto}</strong>
      <span class="task-meta">${t.materia}</span>
      <div class="task-info">
        <span class="badge badge-${t.prioridad.toLowerCase()}">${t.prioridad}</span>
        <span class="task-fecha">${fechaTexto}</span>
      </div>
      <div class="actions">
        <button class="btn-toggle" onclick="toggle(${ri})">${btnLabel}</button>
        <button class="btn-delete" onclick="eliminar(${ri})">Eliminar</button>
      </div>
    `;
    lista.appendChild(div);
  });
}

function formatearFecha(valor) {
  const [year, month, day] = valor.split("-");
  return `${day}/${month}/${year}`;
}

function eliminar(i) {
  if (!confirm("¿Eliminar esta tarea?")) return;
  tareas.splice(i, 1);
  guardar();
  mostrar();
}

function toggle(i) {
  tareas[i].completada = !tareas[i].completada;
  guardar();
  mostrar();
}

document.addEventListener("DOMContentLoaded", () => {
  mostrar();

});