
let products = JSON.parse(localStorage.getItem("products") || "[]");
let orders = [];

function toggleProductList() {
  const content = document.getElementById("productList");
  content.style.display = content.style.display === "block" ? "none" : "block";
}

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

function addProduct() {
  const name = document.getElementById("productName").value.trim();
  if (name && !products.includes(name)) {
    products.push(name);
    saveProducts();
    document.getElementById("productName").value = "";
  } else {
    alert("Invalid or duplicate product name.");
  }
}

function renderProducts() {
  const container = document.getElementById("productList");
  container.innerHTML = "";
  products.forEach((product) => {
    const div = document.createElement("div");
    div.innerHTML = \`\${product} <input type='number' min='1' placeholder='Qty' id='qty_\${product}' />
      <button onclick='addToOrder("\${product}")'>Add to Order</button>\`;
    container.appendChild(div);
  });
}

function filterProducts() {
  const term = document.getElementById("searchInput").value.toLowerCase();
  const filtered = products.filter(p => p.toLowerCase().includes(term));
  const container = document.getElementById("productList");
  container.innerHTML = "";
  filtered.forEach((product) => {
    const div = document.createElement("div");
    div.innerHTML = \`\${product} <input type='number' min='1' placeholder='Qty' id='qty_\${product}' />
      <button onclick='addToOrder("\${product}")'>Add to Order</button>\`;
    container.appendChild(div);
  });
}

function addToOrder(product) {
  const qty = document.getElementById("qty_" + product).value;
  if (qty && qty > 0) {
    orders.push({ product, qty });
    renderOrderList();
  } else {
    alert("Please enter valid quantity.");
  }
}

function renderOrderList() {
  const container = document.getElementById("orderList");
  container.innerHTML = "<h3>Order List:</h3>";
  orders.forEach((item, i) => {
    const div = document.createElement("div");
    div.textContent = \`\${i + 1}. \${item.product}- \${item.qty}\`;
    container.appendChild(div);
  });
}

function generateOrderSummary() {
  const from = document.getElementById("fromInput").value;
  const to = document.getElementById("toInput").value;
  let summary = "From: " + from + "<br>To: " + to + "<br><br>";
  orders.forEach((item, i) => {
    summary += \`\${i + 1}. \${item.product}- \${item.qty}<br>\`;
  });
  document.getElementById("orderSummary").innerHTML = summary;
}

function printSummary() {
  const printWindow = window.open('', '', 'height=800,width=600');
  printWindow.document.write('<html><head><title>Order Summary</title></head><body>');
  printWindow.document.write(document.getElementById("orderSummary").innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
}

function downloadPDF() {
  const summary = document.getElementById("orderSummary").innerHTML;
  const blob = new Blob([summary], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "order_summary.pdf";
  link.click();
}

function downloadExcel() {
  const wb = XLSX.utils.book_new();
  const data = orders.map((item, i) => [i + 1, item.product, item.qty]);
  data.unshift(["S/N", "Product", "Quantity"]);
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Orders");
  XLSX.writeFile(wb, "order_summary.xlsx");
}

renderProducts();
