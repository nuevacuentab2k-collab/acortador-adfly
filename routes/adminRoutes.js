<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Panel Admin - Acortador</title>
<style>
  body { font-family: Arial, sans-serif; background: #f5f6fa; margin: 0; }
  header { background: #2f3640; color: #fff; padding: 20px; text-align: center; }
  h1 { margin: 0; }
  .container { max-width: 1200px; margin: 30px auto; padding: 20px; background: #fff; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
  .stats { display: flex; justify-content: space-around; margin-bottom: 20px; }
  .stat { background: #f1f2f6; padding: 15px 25px; border-radius: 8px; text-align: center; flex: 1; margin: 0 10px; }
  .stat h2 { margin: 0; font-size: 24px; color: #2f3640; }
  .stat p { margin: 5px 0 0; font-size: 14px; color: #718093; }
  #searchBar { margin-bottom: 15px; width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #ccc; font-size: 16px; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; }
  th, td { padding: 12px; border-bottom: 1px solid #dcdde1; text-align: left; font-size: 14px; }
  th { background: #f1f2f6; }
  a { color: #0097e6; text-decoration: none; }
  button { padding: 6px 12px; margin-right: 5px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
  .btn-update { background: #e1b12c; color: #fff; }
  .btn-delete { background: #c23616; color: #fff; }
  .btn-export { background: #44bd32; color: #fff; margin-bottom: 10px; }
</style>
</head>
<body>
<header>
  <h1>Panel de Administración - Acortador</h1>
</header>
<div class="container">
  <div class="stats">
    <div class="stat">
      <h2 id="totalLinks">0</h2>
      <p>Total Enlaces</p>
    </div>
    <div class="stat">
      <h2 id="totalClicks">0</h2>
      <p>Total Clics</p>
    </div>
  </div>

  <input type="text" id="searchBar" placeholder="Buscar por código o URL...">
  <button class="btn-export" onclick="exportCSV()">Exportar CSV</button>

  <table>
    <thead>
      <tr>
        <th>Código</th>
        <th>URL Original</th>
        <th>Enlace Corto</th>
        <th>Clics</th>
        <th>Creado</th>
        <th>Última Visita</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody id="linksTable"></tbody>
  </table>
</div>

<script>
const ADMIN_SECRET = prompt("Ingresa tu ADMIN_SECRET:");

let linksData = [];

// Obtener estadísticas
async function fetchStats(){
  try {
    const res = await fetch("/admin/stats", { headers: { "x-admin-secret": ADMIN_SECRET }});
    const data = await res.json();
    document.getElementById("totalLinks").innerText = data.totalLinks;
    document.getElementById("totalClicks").innerText = data.totalClicks;
  } catch(err){
    console.error(err);
  }
}

// Obtener enlaces
async function fetchLinks(query = ""){
  try {
    const url = query ? `/admin/links/search?q=${encodeURIComponent(query)}` : "/admin/links";
    const res = await fetch(url, { headers: { "x-admin-secret": ADMIN_SECRET }});
    linksData = await res.json();
    renderTable();
  } catch(err){
    console.error(err);
  }
}

// Renderizar tabla
function renderTable(){
  const tbody = document.getElementById("linksTable");
  tbody.innerHTML = "";
  linksData.forEach(link => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${link.code}</td>
      <td><a href="${link.target}" target="_blank">${link.target}</a></td>
      <td><a href="${link.shortUrl || link.target}" target="_blank">${link.shortUrl || link.target}</a></td>
      <td>${link.clicks}</td>
      <td>${new Date(link.createdAt).toLocaleString()}</td>
      <td>${link.lastAccess ? new Date(link.lastAccess).toLocaleString() : "-"}</td>
      <td>
        <button class="btn-update" onclick="updateLink('${link.code}')">Actualizar</button>
        <button class="btn-delete" onclick="deleteLink('${link.code}')">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Actualizar URL
async function updateLink(code){
  const newUrl = prompt("Ingresa la nueva URL:");
  if(!newUrl) return;
  try {
    await fetch(`/admin/links/${code}`, {
      method: "PUT",
      headers: {
        "Content-Type":"application/json",
        "x-admin-secret": ADMIN_SECRET
      },
      body: JSON.stringify({ target: newUrl })
    });
    fetchLinks();
  } catch(err){ console.error(err); }
}

// Eliminar enlace
async function deleteLink(code){
  if(!confirm("¿Eliminar este enlace?")) return;
  try {
    await fetch(`/admin/links/${code}`, {
      method: "DELETE",
      headers: { "x-admin-secret": ADMIN_SECRET }
    });
    fetchLinks();
  } catch(err){ console.error(err); }
}

// Exportar CSV
function exportCSV(){
  window.open(`/admin/export/csv`, "_blank");
}

// Buscar en tiempo real
document.getElementById("searchBar").addEventListener("input", (e)=>{
  fetchLinks(e.target.value);
});

// Actualizar datos cada 5 segundos
setInterval(()=>{ fetchStats(); fetchLinks(); }, 5000);

// Inicializar
fetchStats();
fetchLinks();
</script>
</body>
</html>
