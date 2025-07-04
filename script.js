// ელემენტების მიღება
const burgerButton = document.getElementById('burgerButton');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');
const mainContent = document.getElementById('mainContent');
const contentPanel = document.getElementById('contentPanel');
const contentTitle = document.getElementById('contentTitle');
const contentBody = document.getElementById('contentBody');
const closeBtn = contentPanel.querySelector('.close-btn');

const modal = document.getElementById('orderModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalSendOrderBtn = document.getElementById('modalSendOrderBtn');
const modalPaymentBtn = document.getElementById('modalPaymentBtn');
const footerSendOrderBtn = document.querySelector('footer button[type="button"]');
const cartButton = document.getElementById('cartButton');
const orderSummary = document.getElementById('order-summary');

const adModal = document.getElementById('adModal');
const adCloseBtn = document.getElementById('adCloseBtn');
const adImage = document.getElementById('adImage');

const validationMessage = document.getElementById('validationMessage');
const validationText = document.getElementById('validationText');
const validationCloseBtn = document.getElementById('validationCloseBtn');

const paymentLink = 'https://egreve.bog.ge/G10o';

let productsByCategory = {};
let filteredProductsByCategory = {};
let selectedProducts = {};
let ads = [];
let currentAdIndex = 0;
let currentIndex = 0;
let slideshowInterval;
let sponsorLink = '';

// --- სერვისის ხელმისაწვდომობის შემოწმება
function checkServiceAvailability() {
  const now = new Date();
  const hour = now.getHours();
  const isClosed = (hour >= 24) || (hour < 1);

  if (isClosed) {
    if (!document.getElementById('serviceClosedMessage')) {
      const messageDiv = document.createElement('div');
      messageDiv.id = 'serviceClosedMessage';
      messageDiv.textContent = 'საღამოს 20:00 საათიდან დილის 08:00 საათამდე პლატფორმა არ მუშაობს – აღნიშნულ პერიოდში მომსახურება შეჩერებულია.';
      Object.assign(messageDiv.style, {
        position: 'fixed',
        top: '60px',
        left: '0',
        right: '0',
        backgroundColor: '#e74c3c',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        fontWeight: '700',
        fontSize: '1.2rem',
        zIndex: '1400',
      });
      document.body.insertBefore(messageDiv, document.body.firstChild);
    }
    mainContent.style.filter = 'blur(3px)';
    mainContent.style.pointerEvents = 'none';
    burgerButton.disabled = true;
    footerSendOrderBtn.disabled = true;
    cartButton.disabled = true;
    return true;
  } else {
    const existingMsg = document.getElementById('serviceClosedMessage');
    if (existingMsg) existingMsg.remove();
    mainContent.style.filter = 'none';
    mainContent.style.pointerEvents = 'auto';
    burgerButton.disabled = false;
    footerSendOrderBtn.disabled = false;
    cartButton.disabled = false;
    return false;
  }
}

// --- პროდუქტის ჩატვირთვა JSON-დან
async function loadProducts() {
  try {
    const response = await fetch('products.json');
    productsByCategory = await response.json();
    filteredProductsByCategory = {...productsByCategory};
    renderProducts(filteredProductsByCategory);
  } catch (e) {
    console.error('პროდუქტების ჩატვირთვა ვერ მოხერხდა:', e);
  }
}

// --- რეკლამის ჩატვირთვა JSON-დან
async function loadAds() {
  try {
    const response = await fetch('ad.json');
    const data = await response.json();
    ads = data.advertisements || [];
    if (ads.length > 0) {
      currentAdIndex = 0;
      showAd(currentAdIndex);
    }
  } catch (e) {
    console.error('რეკლამის ჩატვირთვა ვერ მოხერხდა:', e);
  }
}

function showAd(index) {
  const ad = ads[index];
  if (!ad) return;
  adImage.src = ad.image;
  sponsorLink = ad.link;
  adImage.onclick = () => {
    window.open(sponsorLink, '_blank', 'noopener');
  };
  adModal.hidden = false;
  adModal.classList.add('show');
  adModal.focus();
}

function startAdRotation(interval = 3000) {
  if (ads.length <= 1) return;
  setInterval(() => {
    currentAdIndex = (currentAdIndex + 1) % ads.length;
    showAd(currentAdIndex);
  }, interval);
}

// --- სლაიდშოუს სურათები
const images = [
  'https://i.postimg.cc/Y9WRYCk8/Picsart-25-06-17-17-52-33-620.jpg',
  'https://i.postimg.cc/43wBsSPb/Picsart-25-06-17-17-57-33-801.jpg',
  'https://i.postimg.cc/sxWLjJvj/Picsart-25-06-17-17-53-42-737.jpg',
  'https://i.postimg.cc/Kc3wDmQ6/Picsart-25-06-17-17-56-37-707.jpg'
];

const slideshow = document.querySelector('.slideshow');

function initSlideshow() {
  slideshow.innerHTML = '';
  images.forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `სურათი ${index + 1}`;
    if (index === 0) img.classList.add('active');
    slideshow.appendChild(img);
  });
  currentIndex = 0;
  if (slideshowInterval) clearInterval(slideshowInterval);
  slideshowInterval = setInterval(showNextSlide, 3000);
}

function showNextSlide() {
  const slides = slideshow.querySelectorAll('img');
  slides[currentIndex].classList.remove('active');
  currentIndex = (currentIndex + 1) % slides.length;
  slides[currentIndex].classList.add('active');
}

// --- მენიუს მართვა
function openMenu() {
  sideMenu.classList.add('open');
  overlay.classList.add('visible');
  burgerButton.setAttribute('aria-expanded', 'true');
  burgerButton.classList.add('open');
  mainContent.style.filter = 'blur(3px)';
  sideMenu.focus();
}
function closeMenu() {
  sideMenu.classList.remove('open');
  overlay.classList.remove('visible');
  burgerButton.setAttribute('aria-expanded', 'false');
  burgerButton.classList.remove('open');
  mainContent.style.filter = 'none';
  burgerButton.focus();
}
burgerButton.addEventListener('click', () => {
  if (sideMenu.classList.contains('open')) closeMenu();
  else openMenu();
});
burgerButton.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    burgerButton.click();
  }
});
overlay.addEventListener('click', () => {
  closeMenu();
  closeContentPanel();
});

// --- კონტენტის პანელის მართვა
const sectionsContent = {
  rules: {
    title: 'წესდება',
    html: `<ul>
      <li>არარეალური ან ფიქტიური შეკვეთების შემთხვევაში მოხდება მომხმარებლის დაბლოკვა.</li>
      <li>დაიცავით პატივი კურიერისა და მისი სამუშაო დროის მიმართ.</li>
      <li>მიწოდების მისამართი მიუთითეთ სრულად და ზუსტად.</li>
      <li>ტელეფონის ნომერი უნდა იყოს სწორი და მოქმედი.</li>
      <li>დადასტურებული შეკვეთის გაუქმება შეუძლებელია.</li>
      <li>დახმარებისა და დეტალური ინფორმაციისთვის გაეცანით ინსტრუქციას.</li>
    </ul>`
  },
  instructions: {
    title: 'ინსტრუქცია',
    html: `<ol>
      <li>აირჩიეთ სასურველი პროდუქტები და მათი რაოდენობა.</li>
      <li>დააჭირეთ ღილაკს "შეკვეთის გაგზავნა".</li>
      <li>გახსნილ ფანჯარაში ყურადღებით გაეცანით დართულ ტექსტს.</li>
      <li>დაადასტურეთ შეკვეთა ფანჯარაში განთავსებული შესაბამისი ღილაკით.</li>
      <li>გაგზავნის შემდეგ დაბრუნდით ვებსაიტზე და დააჭირეთ ღილაკს "გადახდა".</li>
      <li>ბმულზე გადასვლისას მიუთითეთ შეკვეთის სრული თანხა.</li>
      <li>გამგზავნის ველში მიუთითეთ თქვენი შეკვეთის ნომერი, რათა შესაძლებელი იყოს გადამხდელის იდენტიფიკაცია.</li>
    </ol>`
  },
  cities: {
    title: 'მოქმედი ქალაქები',
    html: `<p>ჩვენი სერვისი მოქმედებს შემდეგ ქალაქებში:</p><ul><li>თბილისი</li><li>ბათუმი</li><li>ქუთაისი</li><li>რუსთავი</li><li>გურჯაანი</li></ul>`
  }
};
function showContentPanel(sectionKey) {
  const section = sectionsContent[sectionKey];
  if (!section) return;
  contentTitle.textContent = section.title;
  contentBody.innerHTML = section.html;
  contentPanel.classList.add('active');
  overlay.classList.add('visible');
  mainContent.style.filter = 'blur(3px)';
  closeMenu();
  contentPanel.focus();
}
function closeContentPanel() {
  contentPanel.classList.remove('active');
  overlay.classList.remove('visible');
  mainContent.style.filter = 'none';
  burgerButton.focus();
}
sideMenu.querySelectorAll('button.menu-item').forEach(btn => {
  btn.addEventListener('click', () => {
    showContentPanel(btn.getAttribute('data-section'));
  });
});
closeBtn.addEventListener('click', closeContentPanel);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (contentPanel.classList.contains('active')) closeContentPanel();
    else if (sideMenu.classList.contains('open')) closeMenu();
    else if (!modal.hidden) closeOrderModal();
  }
});

// --- პროდუქტის მართვა
function createProductCard(product) {
  const selected = selectedProducts[product.id];
  return `
    <article class="product-card${selected ? ' selected' : ''}" tabindex="0" aria-pressed="${!!selected}" role="button" onclick="toggleProduct(${product.id})" onkeydown="if(event.key==='Enter' || event.key===' ') toggleProduct(${product.id})">
      <div class="product-header">
        <h3 class="product-name">${product.name}</h3>
        <div class="price-tag" aria-label="ფასი">${product.price.toFixed(2)}₾</div>
      </div>
      <div class="quantity-controls" aria-label="რაოდენობის კონტროლი: ${product.name}">
        <button type="button" aria-label="რაოდენობის შემცირება" onclick="adjustQuantity(event, ${product.id}, -1)">−</button>
        <input type="number" class="quantity-input" id="qty-${product.id}" min="0" value="${selected ? selected.quantity : 0}" aria-live="polite" aria-atomic="true" aria-label="რაოდენობა: ${product.name}" onchange="updateQuantity(event, ${product.id}, this.value)" />
        <button type="button" aria-label="რაოდენობის გაზრდა" onclick="adjustQuantity(event, ${product.id}, 1)">+</button>
      </div>
    </article>
  `;
}
function renderProducts(filtered = filteredProductsByCategory) {
  const container = document.getElementById('productContainer');
  let html = '';
  for (const [category, items] of Object.entries(filtered)) {
    if (items.length === 0) continue;
    let categoryName = category;
    switch(category) {
      case 'რძის_პროდუქტები': categoryName = 'რძის პროდუქტები'; break;
      case 'საყხობი': categoryName = 'საყხობი'; break;
      case 'ხილი_ბოსტნეული': categoryName = 'ხილი და ბოსტნეული'; break;
      case 'ხორცი': categoryName = 'ხორცი'; break;
    }
    html += `<div class="category-header">${categoryName}</div><div class="product-list">`;
    for (const product of items) {
      html += createProductCard(product);
    }
    html += `</div>`;
  }
  container.innerHTML = html;
  updateTotals();
}
function toggleProduct(id) {
  if (selectedProducts[id]) {
    delete selectedProducts[id];
  } else {
    const product = findProductById(id);
    selectedProducts[id] = { ...product, quantity: 1 };
  }
  renderProducts(filteredProductsByCategory);
}
function adjustQuantity(event, id, delta) {
  event.stopPropagation();
  const current = selectedProducts[id]?.quantity || 0;
  const newQty = Math.max(0, current + delta);
  updateQuantity(event, id, newQty);
}
function updateQuantity(event, id, value) {
  event.stopPropagation();
  let qty = parseInt(value);
  if (isNaN(qty) || qty < 0) qty = 0;
  if (qty === 0) {
    delete selectedProducts[id];
  } else {
    const product = findProductById(id);
    selectedProducts[id] = { ...product, quantity: qty };
  }
  renderProducts(filteredProductsByCategory);
}
function findProductById(id) {
  for (const items of Object.values(productsByCategory)) {
    const found = items.find(p => p.id === id);
    if (found) return found;
  }
  return null;
}
function updateTotals() {
  const summaryItems = document.getElementById('summaryItems');
  const summaryTotal = document.getElementById('summaryTotal');
  let total = 0;
  if (Object.keys(selectedProducts).length === 0) {
    summaryItems.textContent = 'არცერთი პროდუქტი არ არის არჩეული';
    summaryTotal.textContent = '₾0.00';
    return;
  }
  let html = '';
  for (const item of Object.values(selectedProducts)) {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    html += `<div>${item.name} (${item.quantity}): ${itemTotal.toFixed(2)}₾</div>`;
  }
  summaryItems.innerHTML = html;
  summaryTotal.textContent = `${total.toFixed(2)}₾`;
}

// --- Toast შეტყობინებები
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// --- პროდუქტების ძებნა
function filterProducts() {
  const query = document.getElementById('productSearch').value.toLowerCase();
  filteredProductsByCategory = {};
  for (const [category, items] of Object.entries(productsByCategory)) {
    filteredProductsByCategory[category] = items.filter(product =>
      product.name.toLowerCase().includes(query)
    );
  }
  renderProducts(filteredProductsByCategory);
}

// --- ვალიდაციის შეტყობინების მართვა
function showValidationMessage(message) {
  validationText.textContent = message;
  validationMessage.style.display = 'flex';
  validationMessage.style.alignItems = 'center';
}
validationCloseBtn.addEventListener('click', () => {
  validationMessage.style.display = 'none';
});

// --- უნიკალური 4 ციფრიანი შეკვეთის ნომრის გენერაცია
function generateUniqueOrderCode() {
  const usedCodes = JSON.parse(localStorage.getItem('usedOrderCodes') || '[]');

  let code;
  do {
    code = Math.floor(000001 + Math.random() * 999999); // 4 ციფრი 1000-დან 9999-მდე
  } while (usedCodes.includes(code));

  usedCodes.push(code);
  localStorage.setItem('usedOrderCodes', JSON.stringify(usedCodes));

  return code;
}

// --- შეკვეთის ვალიდაცია
function validateOrder() {
  const phoneInput = document.getElementById('phone');
  const addressInput = document.getElementById('address');

  const phone = phoneInput.value.trim();
  const address = addressInput.value.trim();

  const phoneRegex = /^\d{9}$/;

  if (!phoneRegex.test(phone)) {
    showValidationMessage('გთხოვთ, სწორად მიუთითეთ 9 ციფრიანი ტელეფონის ნომერი.');
    phoneInput.focus();
    return false;
  }

  if (address.length === 0) {
    showValidationMessage('გთხოვთ, მიუთითეთ მიწოდების სრული მისამართი.');
    addressInput.focus();
    return false;
  }

  if (Object.keys(selectedProducts).length === 0) {
    showValidationMessage('გთხოვთ, აირჩიოთ მინიმუმ ერთი პროდუქტი.');
    return false;
  }

  validationMessage.style.display = 'none';
  return true;
}

// --- შეკვეთის გაგზავნა
function sendOrder() {
  if (!validateOrder()) return;

  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();
  const orderLines = Object.values(selectedProducts).map(item =>
    `${item.name} (${item.quantity}): ${(item.price * item.quantity).toFixed(2)}₾`
  ).join('\n- ');

  const total = Object.values(selectedProducts).reduce((sum, item) => sum + item.price * item.quantity, 0);

  const orderCode = generateUniqueOrderCode();

  const body = `
📞 ტელეფონი: ${phone}

🆔 შეკვეთის ნომერი: ${orderCode}

🧾 შეკვეთის დეტალები:
- ${orderLines}

💵 ჯამი: ${total.toFixed(2)}₾

📍 მიწოდების მისამართი:
${address}
`.trim();

  window.location.href = `mailto:nadashviligio707@gmail.com?subject=ახალი კურიერის შეკვეთა #${orderCode}&body=${encodeURIComponent(body)}`;
  showToast(`შეკვეთა წარმატებით გაიგზავნა! თქვენი შეკვეთის ნომერია: ${orderCode}`);
}

// --- მოდალური მართვა
function openOrderModal() {
  if (checkServiceAvailability()) return;

  modal.hidden = false;
  modal.classList.add('show');
  modalOverlay.classList.add('show');
  mainContent.style.filter = 'blur(3px)';
  modal.focus();
}
function closeOrderModal() {
  modal.classList.remove('show');
  modalOverlay.classList.remove('show');
  mainContent.style.filter = 'none';
  modal.hidden = true;
  footerSendOrderBtn.focus();
}
footerSendOrderBtn.addEventListener('click', e => {
  e.preventDefault();
  openOrderModal();
});
modalSendOrderBtn.addEventListener('click', () => {
  closeOrderModal();
  sendOrder();
});
modalPaymentBtn.addEventListener('click', () => {
  window.open(paymentLink, '_blank', 'noopener');
  closeOrderModal();
});
modalCloseBtn.addEventListener('click', closeOrderModal);
modalOverlay.addEventListener('click', closeOrderModal);

// --- რეკლამის მოდალი
adCloseBtn.addEventListener('click', () => {
  adModal.classList.remove('show');
  adModal.hidden = true;
});

// --- პროდუქტების ძებნა
document.getElementById('productSearch').addEventListener('input', filterProducts);

// --- ტელეფონის ნომრის შენახვა
document.getElementById('phone').addEventListener('input', e => {
  localStorage.setItem('lastPhone', e.target.value);
});

// --- კალათის ღილაკი
cartButton.addEventListener('click', () => {
  orderSummary.scrollIntoView({ behavior: 'smooth', block: 'start' });
  orderSummary.style.outline = '0px solid var(--primary)';
  setTimeout(() => {
    orderSummary.style.outline = 'none';
  }, 2000);
});

// --- გვერდის ჩატვირთვა
window.onload = async () => {
  if (!checkServiceAvailability()) {
    await loadProducts();
    await loadAds();
    initSlideshow();

    const lastPhone = localStorage.getItem('lastPhone');
    if (lastPhone) {
      document.getElementById('phone').value = lastPhone;
    }

    adModal.hidden = false;
    adModal.classList.add('show');
    adModal.focus();

    if (ads.length > 1) {
      startAdRotation(7000);
    }
  }
};

// --- გლობალურად გამოცხადება (ინლაინ ჰენდლერებისთვის)
window.toggleProduct = toggleProduct;
window.adjustQuantity = adjustQuantity;
window.updateQuantity = updateQuantity;
window.sendOrder = sendOrder;
