let products = JSON.parse(localStorage.getItem("products") || "[]");
let orders = [];

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

function addProduct() {
  const input = document.getElementById("productName");
  const name = input.value.trim();
  if (name === "") {
    alert("Please enter a product name");
    return;
  }
  if (products.includes(name)) {
    alert("This product already exists");
    return;
  }
  products.push(name);
  saveProducts();
  input.value = "";
}

function renderProducts(filtered = null) {
  const list = filtered || products;
  const container = document.getElementById("productList");
  container.innerHTML = "";
  list.forEach((product) => {
    const safeId = encodeURIComponent(product);
    const div = document.createElement("div");
    div.innerHTML = `
      ${product} 
      <input type="number" id="qty_${safeId}" placeholder="Qty" min="1" />
      <button onclick="addToOrder('${safeId}')">Add to Order</button>
    `;
    container.appendChild(div);
  });
}

function filterProducts() {
  const term = document.getElementById("searchInput").value.toLowerCase();
  const filtered = products.filter(p => p.toLowerCase().includes(term));
  renderProducts(filtered);
}

function addToOrder(productId) {
  const product = decodeURIComponent(productId);
  const qtyInput = document.getElementById("qty_" + productId);
  const qty = qtyInput.value;
  if (!qty || qty <= 0) {
    alert("Please enter a valid quantity");
    return;
  }
  orders.push({ product, qty });
  renderOrderList();
  qtyInput.value = ""; // clear qty input after adding
}

function renderOrderList() {
  const container = document.getElementById("orderList");
  container.innerHTML = "<h3>Order List:</h3>";
  orders.forEach((item, i) => {
    const div = document.createElement("div");
    div.textContent = `${i + 1}. ${item.product} - ${item.qty}`;
    container.appendChild(div);
  });
}

function generateOrderSummary() {
  const from = document.getElementById("fromInput").value;
  const to = document.getElementById("toInput").value;
  let summary = `From: ${from}<br>To: ${to}<br><br>`;
  orders.forEach((item, i) => {
    summary += `${i + 1}. ${item.product} - ${item.qty}<br>`;
  });
  document.getElementById("orderSummary").innerHTML = summary;
}

function printSummary() {
  const printWindow = window.open('', '', 'height=500,width=800');
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
