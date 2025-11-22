const SUPABASE_URL = "https://ryqlprvtsqzydvfkzuhu.supabase.co";
const SUPABASE_KEY = "SUA_ANON_KEY"; // ANON KEY!!
const headers = {
    "Content-Type": "application/json",
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`
};

let editingId = null;

async function fetchServices() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/braids?select=*`, { headers });
    const data = await res.json();
    renderServices(data);
}

function renderServices(services) {
    const list = document.getElementById("service-list");
    list.innerHTML = "";

    services.forEach(s => {
        list.innerHTML += `
            <div class="card">
                <img src="${s.image}" alt="">
                <div class="info">
                    <div class="title">${s.title}</div>
                    <div>${s.code} • ${s.category}</div>

                    <div class="actions">
                        <button class="btn-edit" onclick="openEdit(${s.id})">Editar</button>
                        <button class="btn-delete" onclick="deleteService(${s.id})">Excluir</button>
                    </div>
                </div>
            </div>
        `;
    });
}

document.getElementById("service-form").addEventListener("submit", async e => {
    e.preventDefault();

    const body = {
        code: code.value,
        title: title.value,
        description: description.value,
        price: price.value,
        image: image.value,
        category: category.value,
    };

    await fetch(`${SUPABASE_URL}/rest/v1/braids`, {
        method: "POST",
        headers,
        body: JSON.stringify(body)
    });

    alert("Serviço cadastrado!");
    e.target.reset();
    fetchServices();
});

// DELETE
async function deleteService(id) {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

    await fetch(`${SUPABASE_URL}/rest/v1/braids?id=eq.${id}`, {
        method: "DELETE",
        headers
    });

    alert("Serviço excluído!");
    fetchServices();
}

// OPEN EDIT
async function openEdit(id) {
    editingId = id;

    const r = await fetch(`${SUPABASE_URL}/rest/v1/braids?id=eq.${id}&select=*`, { headers });
    const [s] = await r.json();

    document.getElementById("edit-code").value = s.code;
    document.getElementById("edit-title").value = s.title;
    document.getElementById("edit-description").value = s.description;
    document.getElementById("edit-price").value = s.price;
    document.getElementById("edit-image").value = s.image;
    document.getElementById("edit-category").value = s.category;

    document.getElementById("edit-modal").style.display = "flex";
}

function closeEdit() {
    document.getElementById("edit-modal").style.display = "none";
}

// SAVE EDIT
async function saveEdit() {

    const body = {
        code: document.getElementById("edit-code").value,
        title: document.getElementById("edit-title").value,
        description: document.getElementById("edit-description").value,
        price: document.getElementById("edit-price").value,
        image: document.getElementById("edit-image").value,
        category: document.getElementById("edit-category").value,
    };

    await fetch(`${SUPABASE_URL}/rest/v1/braids?id=eq.${editingId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(body)
    });

    alert("Serviço atualizado!");
    closeEdit();
    fetchServices();
}

fetchServices();
