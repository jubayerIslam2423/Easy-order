
let products = [];

function addProduct() {
  const name = document.getElementById('productName').value.trim();
  const qty = document.getElementById('productQty').value.trim();
  if (name && qty) {
    products.push({ name, qty });
    renderTable();
    document.getElementById('productName').value = '';
    document.getElementById('productQty').value = '';
  }
}

function renderTable() {
  const tbody = document.querySelector("#productTable tbody");
  tbody.innerHTML = "";
  products.forEach((p, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${p.name}</td><td>${p.qty}</td><td><button onclick="removeProduct(${index})">Remove</button></td>`;
    tbody.appendChild(row);
  });
}

function removeProduct(index) {
  products.splice(index, 1);
  renderTable();
}

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Easy Order", 10, 10);
  let y = 20;
  products.forEach(p => {
    doc.text(`${p.name} - ${p.qty}`, 10, y);
    y += 10;
  });
  doc.save("order.pdf");
}

function exportExcel() {
  const ws = XLSX.utils.json_to_sheet(products);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Order");
  XLSX.writeFile(wb, "order.xlsx");
}
