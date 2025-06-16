let products = JSON.parse(localStorage.getItem('products')) || [];
let orderItems = [];

function saveProducts() {
  localStorage.setItem('products', JSON.stringify(products));
}

function addProduct() {
  const name = document.getElementById('productName').value.trim();
  if (name && !products.includes(name)) {
    products.push(name);
    saveProducts();
    document.getElementById('productName').value = '';
    alert('Product added.');
  }
}

document.getElementById('searchInput').addEventListener('input', function () {
  const query = this.value.toLowerCase();
  const resultBox = document.getElementById('searchResults');
  resultBox.innerHTML = '';
  products.filter(p => p.toLowerCase().includes(query)).forEach(p => {
    const div = document.createElement('div');
    div.textContent = p;
    div.onclick = () => {
      const qty = prompt(`Enter quantity for "${p}"`);
      if (qty) {
        orderItems.push({ name: p, qty: qty });
        updateOrderSummary();
      }
    };
    resultBox.appendChild(div);
  });
});

function updateOrderSummary() {
  const list = document.getElementById('orderSummaryList');
  list.innerHTML = '';
  orderItems.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${item.name} - ${item.qty}`;
    list.appendChild(li);
  });
}

function generateSummaryText() {
  const from = document.getElementById('fromInput').value.trim();
  const to = document.getElementById('toInput').value.trim();
  let content = `From: ${from}\nTo: ${to}\n\n`;
  orderItems.forEach((item, index) => {
    content += `${index + 1}. ${item.name} - ${item.qty}\n`;
  });
  return content;
}

function printSummary() {
  const newWindow = window.open('', '_blank');
  newWindow.document.write('<pre>' + generateSummaryText() + '</pre>');
  newWindow.document.close();
  newWindow.print();
}

function downloadPDF() {
  const content = generateSummaryText();
  const blob = new Blob([content], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'order_summary.pdf';
  a.click();
  URL.revokeObjectURL(url);
}

function downloadExcel() {
  const content = generateSummaryText();
  const blob = new Blob([content], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'order_summary.xls';
  a.click();
  URL.revokeObjectURL(url);
}
