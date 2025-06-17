let products = JSON.parse(localStorage.getItem("products") || "[]");
let orders = [];

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
  products.forEach((product, i) => {
    const div = document.createElement("div");
    div.innerHTML = \`
      \${product} 
      <input type='number' min='1' placeholder='Qty' id='qty_\${i}' />
      <button onclick='addToOrder("\${product}", \${i})'>Add</button>
      <button onclick='editProduct(\${i})'>Edit</button>
      <button onclick='removeProduct(\${i})'>Remove</button>
    \`;
    container.appendChild(div);
  });
}

function editProduct(index) {
  const newName = prompt("Edit product name:", products[index]);
  if (newName && !products.includes(newName)) {
    products[index] = newName;
    saveProducts();
  }
}

function removeProduct(index) {
  products.splice(index, 1);
  saveProducts();
}

function filterProducts() {
  const term = document.getElementById("searchInput").value.toLowerCase();
  const filtered = products.map((p, i) => ({ name: p, index: i })).filter(p => p.name.toLowerCase().includes(term));
  const container = document.getElementById("productList");
  container.innerHTML = "";
  filtered.forEach(({ name, index }) => {
    const div = document.createElement("div");
    div.innerHTML = \`
      \${name} 
      <input type='number' min='1' placeholder='Qty' id='qty_\${index}' />
      <button onclick='addToOrder("\${name}", \${index})'>Add</button>
      <button onclick='editProduct(\${index})'>Edit</button>
      <button onclick='removeProduct(\${index})'>Remove</button>
    \`;
    container.appendChild(div);
  });
}

function addToOrder(product, index) {
  const qty = document.getElementById("qty_" + index).value;
  if (qty && qty > 0) {
    const existing = orders.find(o => o.product === product);
    if (existing) {
      existing.qty = parseInt(qty);
    } else {
      orders.push({ product, qty });
    }
    renderOrderList();
  } else {
    alert("Enter a valid quantity.");
  }
}

function renderOrderList() {
  const container = document.getElementById("orderList");
  container.innerHTML = "<h3>Order List:</h3>";
  orders.forEach((item, i) => {
    const div = document.createElement("div");
    div.innerHTML = \`\${i + 1}. \${item.product}- \${item.qty}
      <button onclick='editOrderQty(\${i})'>Edit Qty</button>
      <button onclick='removeOrder(\${i})'>Remove</button>\`;
    container.appendChild(div);
  });
}

function editOrderQty(index) {
  const newQty = prompt("Enter new quantity:", orders[index].qty);
  if (newQty && newQty > 0) {
    orders[index].qty = parseInt(newQty);
    renderOrderList();
  }
}

function removeOrder(index) {
  orders.splice(index, 1);
  renderOrderList();
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
  const content = document.getElementById("orderSummary").innerHTML;
  const printWindow = window.open('', '', 'height=842,width=595'); // A4 size in px
  printWindow.document.write('<html><head><title>Order Summary</title>');
  printWindow.document.write('<style>body{font-family:Arial;margin:40px;}</style>');
  printWindow.document.write('</head><body>');
  printWindow.document.write(content);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
}

function downloadPDF() {
  const content = document.getElementById("orderSummary").innerHTML;
  const blob = new Blob([content], { type: "application/pdf" });
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
