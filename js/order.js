async function openOrderOverlay(donationId) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
      alert('Please log in to request a donation.');
      window.location.href = 'login.html';
      return;
  }
   if (user.role !== 'collector') {
       alert('Only collectors can request donations.');
       return;
   }

  const overlayDiv = document.getElementById('order-overlay');
  if (!overlayDiv) {
      console.error("Order overlay container not found!");
      return;
  }

  overlayDiv.innerHTML = '<p style="color:white; text-align:center; padding:20px;">Loading donation details...</p>';
  overlayDiv.style.display = 'flex'; 
  document.body.classList.add('overlay-active'); 

  try {
      const donationResponse = await fetch('/api/donations/' + donationId);
      if (!donationResponse.ok) throw new Error(`Failed to fetch donation details (Status: ${donationResponse.status})`);
      const donationData = await donationResponse.json();

      if (!donationData.success || !donationData.donation) {
          throw new Error(donationData.message || 'Donation not found.');
      }
      const donation = donationData.donation;

       if (donation.quantity <= 0) {
           overlayDiv.innerHTML = `
               <div class="order-modal" style="background:white; padding:2rem; border-radius:8px; text-align:center;">
                   <span class="close-btn" onclick="closeOrderOverlay()" style="position:absolute; top:1rem; right:1rem; font-size:2rem; cursor:pointer;">&times;</span>
                   <h2>Donation Not Available</h2>
                   <p>Sorry, all servings for this donation have already been requested.</p>
                   <button class="btn" onclick="closeOrderOverlay()">Close</button>
               </div>`;
           return;
       }

      const orderFormHtml = `
          <div class="order-modal">
              <span class="close-btn" onclick="closeOrderOverlay()">&times;</span>
              <h2>Request Donation</h2>
              <form id="order-form" onsubmit="submitOrder(event)">
                  <div id="order-details-display" class="order-info">
                       <!-- Donation details will be injected here -->
                       <p><strong>Type:</strong> ${donation.foodType}</p>
                       <p><strong>Available Servings:</strong> <span id="overlay-servings">${donation.quantity}</span></p>
                       <p><strong>Pickup Time:</strong> ${donation.pickupTime}</p>
                       <p><strong>Location:</strong> ${donation.location}</p>
                       <p><strong>Use By:</strong> ${new Date(donation.useBy).toLocaleString()}</p>
                       ${donation.allergy ? `<p><strong>Allergens:</strong> ${donation.allergy}</p>` : ''}
                       <hr>
                  </div>
                  <div class="inputBox">
                      <label for="itemCount">How many servings/items do you need? <span style="color:red">*</span></label>
                      <input type="number" name="itemCount" id="itemCount" placeholder="Enter quantity" min="1" max="${donation.quantity}" required />
                  </div>
                  <!-- Hidden input for donationId -->
                  <input type="hidden" name="donationId" value="${donation._id}">
                  <div id="order-error-message" style="color:red; margin-bottom:10px;"></div>
                  <input type="submit" value="Submit Request" class="btn" />
              </form>
              <div id="order-summary" class="hidden" style="margin-top: 1.5rem; padding: 1rem; background: #eaf7e9; border-left: 4px solid #28a745; border-radius: 4px;">
                  <!-- Summary shown after successful submission -->
              </div>
          </div>
      `;

      overlayDiv.innerHTML = orderFormHtml;
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = 'css/order.css'; 
      document.head.appendChild(styleLink); 


  } catch (err) {
      console.error('Error opening order overlay:', err);
      overlayDiv.innerHTML = `<div style="background:white; padding:20px; border-radius:5px;">Error loading details: ${err.message}. <button onclick="closeOrderOverlay()">Close</button></div>`;
  }
}

function closeOrderOverlay() {
  const overlay = document.getElementById('order-overlay');
  if (overlay) {
      overlay.style.display = 'none';
      overlay.innerHTML = ''; 
  }
  document.body.classList.remove('overlay-active'); 
}

async function submitOrder(event) {
  event.preventDefault();
  const form = event.target;
  const summaryDiv = document.getElementById('order-summary');
  const errorDiv = document.getElementById('order-error-message');
  const submitButton = form.querySelector('input[type="submit"]');
  errorDiv.textContent = ''; 
  summaryDiv.classList.add('hidden'); 

  const orderData = {
      itemCount: parseInt(form.itemCount.value),
      donationId: form.donationId.value,
      collector: null 
  };

   if (isNaN(orderData.itemCount) || orderData.itemCount <= 0) {
       errorDiv.textContent = 'Please enter a valid quantity greater than 0.';
       return;
   }
   const availableServings = parseInt(document.getElementById('overlay-servings')?.textContent || '0');
   if (orderData.itemCount > availableServings) {
        errorDiv.textContent = `Cannot request more than the available ${availableServings} servings.`;
        return;
   }

  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user._id) {
      errorDiv.textContent = 'Error: Could not identify collector. Please log in again.';
      return;
  }
  orderData.collector = user._id;

  submitButton.value = 'Submitting...';
  submitButton.disabled = true;

  try {
      const response = await fetch('/api/donations/order', {
          method: 'POST',
          body: JSON.stringify(orderData),
          headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();

      if (data.success) {
          summaryDiv.innerHTML = `
              <h3><i class="fas fa-check-circle" style="color: green;"></i> Thank You!</h3>
              <p>Your request for ${orderData.itemCount} servings has been placed successfully.</p>
              <p><strong>Order ID:</strong> ${data.orderId}</p>
              <p>You will be notified about pickup details if applicable.</p>
              <p>Remaining servings for this donation: ${data.updatedDonation.quantity}</p>
          `;
          summaryDiv.classList.remove('hidden');
          form.style.display = 'none'; 
          const donationCard = document.getElementById(`donation-card-${orderData.donationId}`);
          if (donationCard) {
              const quantitySpan = donationCard.querySelector('.donation-quantity');
              if (quantitySpan) {
                  quantitySpan.textContent = data.updatedDonation.quantity;
              }
              if (data.updatedDonation.quantity <= 0) {
                   const requestButton = donationCard.querySelector('.request-btn');
                   if (requestButton) {
                        requestButton.textContent = 'Unavailable';
                        requestButton.disabled = true;
                        requestButton.style.opacity = '0.6';
                        requestButton.style.cursor = 'not-allowed';
                   }
               }
          }
           // setTimeout(closeOrderOverlay, 4000);

      } else {
          errorDiv.textContent = `Error placing order: ${data.message || 'Unknown error'}`;
          submitButton.value = 'Submit Request';
          submitButton.disabled = false;
      }
  } catch (err) {
      console.error('Order submission error:', err);
      errorDiv.textContent = 'An unexpected error occurred while submitting your request.';
      submitButton.value = 'Submit Request';
      submitButton.disabled = false;
  }
}
