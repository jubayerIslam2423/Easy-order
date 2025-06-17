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
  products.forEach((product, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      ${product}
      <input type='number' min='1' placeholder='Qty' id='qty_${index}' />
      <button onclick='addToOrder(${index})'>Add to Order</button>
      <button onclick='editProduct(${index})'>✏️</button>
      <button onclick='removeProduct(${index})'>🗑️</button>
    `;
    container.appendChild(div);
  });
}

function addToOrder(index) {
  const qty = document.getElementById("qty_" + index).value;
  if (qty && qty > 0) {
    const product = products[index];
    orders.push({ product, qty });
    renderOrderList();
  } else {
    alert("Please enter a valid quantity.");
  }
}

function renderOrderList() {
  const container = document.getElementById("orderList");
  container.innerHTML = "<h3>Order List:</h3>";
  orders.forEach((item, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      ${i + 1}. ${item.product}- ${item.qty}
      <button onclick='editOrderQty(${i})'>✏️</button>
      <button onclick='removeOrder(${i})'>🗑️</button>
    `;
    container.appendChild(div);
  });
}

function editProduct(index) {
  const newName = prompt("Edit product name:", products[index]);
  if (newName && !products.includes(newName)) {
    products[index] = newName;
    saveProducts();
  } else {
    alert("Invalid or duplicate name.");
  }
}

function removeProduct(index) {
  if (confirm("Are you sure you want to remove this product?")) {
    products.splice(index, 1);
    saveProducts();
  }
}

function editOrderQty(index) {
  const newQty = prompt("Edit quantity:", orders[index].qty);
  if (newQty && !isNaN(newQty)) {
    orders[index].qty = newQty;
    renderOrderList();
  }
}

function removeOrder(index) {
  if (confirm("Remove this item from order list?")) {
    orders.splice(index, 1);
    renderOrderList();
  }
}

function generateOrderSummary() {
  const from = document.getElementById("fromInput").value;
  const to = document.getElementById("toInput").value;
  let summary = `From: ${from}<br>To: ${to}<br><br>`;
  orders.forEach((item, i) => {
    summary += `${i + 1}. ${item.product}- ${item.qty}<br>`;
  });
  document.getElementById("orderSummary").innerHTML = summary;
}

function printSummary() {
  const summaryHTML = document.getElementById("orderSummary").innerHTML;
  const printWindow = window.open('', '', 'height=842,width=595'); // A4 size

  printWindow.document.write(`
    <html>
    <head>
      <title>Print Order Summary</title>
      <style>
        @page {
          size: A4;
          margin: 40px;
        }
        body {
          font-family: Arial, sans-serif;
          font-size: 16pt;
          line-height: 1.6;
          padding: 20px;
        }
      </style>
    </head>
    <body>
      ${summaryHTML}
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function downloadPDF() {
  const summaryHTML = document.getElementById("orderSummary").innerHTML;
  const printWindow = window.open('', '', 'height=842,width=595'); // A4: 595x842pt
  printWindow.document.write(`
    <html>
    <head>
      <title>Order Summary PDF</title>
      <style>
        @page {
          size: A4;
          margin: 40px;
        }
        body {
          font-family: Arial, sans-serif;
          font-size: 16pt;
          line-height: 1.6;
          padding: 20px;
        }
      </style>
    </head>
    <body>
      ${summaryHTML}
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function downloadExcel() {
  const wb = XLSX.utils.book_new();
  const data = orders.map((item, i) => [i + 1, item.product, item.qty]);
  data.unshift(["S/N", "Product", "Quantity"]);
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Orders");
  XLSX.writeFile(wb, "order_summary.xlsx");
}

function toggleProductList() {
  const content = document.getElementById("productList");
  content.style.display = content.style.display === "none" ? "block" : "none";
}

// Initial render
renderProducts();
