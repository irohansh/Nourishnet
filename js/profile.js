document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user._id) { 
      alert('Please login to view your profile.');
      window.location.href = 'login.html';
      return;
  }

  populateProfileData(user);

  setupRoleSpecificUI(user.role);

});

function populateProfileData(user) {
  document.getElementById('username-display').innerText = user.name || 'User';
  document.getElementById('detail-name').innerText = user.name || 'N/A';
  document.getElementById('detail-email').innerText = user.email || 'N/A';
  document.getElementById('detail-contact').innerText = user.contact || 'N/A';
  document.getElementById('detail-role').innerText = user.role || 'N/A';

  if (user.role === 'distributor') {
      document.getElementById('detail-categories').innerText = user.categories || 'Not Specified';
  } else if (user.role === 'collector') {
      document.getElementById('detail-region').innerText = user.region || 'Not Specified';
      document.getElementById('detail-requirements').innerText = user.requirements || 'Not Specified';
  }
}

function setupRoleSpecificUI(role) {
  const distributorElements = document.querySelectorAll('.distributor-only');
  const collectorElements = document.querySelectorAll('.collector-only');

  if (role === 'distributor') {
      distributorElements.forEach(el => el.style.display = 'block'); 
      collectorElements.forEach(el => el.style.display = 'none'); 
  } else if (role === 'collector') {
      distributorElements.forEach(el => el.style.display = 'none');
      collectorElements.forEach(el => el.style.display = 'block'); 
  } else {
      distributorElements.forEach(el => el.style.display = 'none');
      collectorElements.forEach(el => el.style.display = 'none');
  }
}

function toggleEditProfile() {
  const editFormDiv = document.getElementById('edit-profile-form');
  const detailsDiv = document.getElementById('user-details');
  const toggleButton = document.getElementById('edit-profile-toggle-btn');

  if (editFormDiv.style.display === 'none' || !editFormDiv.style.display) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return; 
      // Pre-populate the form with current data
      document.getElementById('edit-name').value = user.name || '';
      document.getElementById('edit-email').value = user.email || '';
      document.getElementById('edit-contact').value = user.contact || '';
      // Pre-populate role-specific fields
       if (user.role === 'distributor') {
          document.getElementById('edit-categories').value = user.categories || '';
           document.getElementById('edit-categories').required = true; 
       } else if (user.role === 'collector') {
          document.getElementById('edit-region').value = user.region || '';
          document.getElementById('edit-requirements').value = user.requirements || '';
           document.getElementById('edit-region').required = true; 
           document.getElementById('edit-requirements').required = true; 
       }

      editFormDiv.style.display = 'block';
      detailsDiv.style.display = 'none'; 
      toggleButton.style.display = 'none'; 
  } else {
      editFormDiv.style.display = 'none';
      detailsDiv.style.display = 'block'; 
       toggleButton.style.display = 'inline-block'; 
  }
}

async function submitProfileEdits(e) {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem('user'));
  const messageDiv = document.getElementById('profile-message');
  messageDiv.textContent = 'Saving changes...';
  messageDiv.style.color = 'orange';

  if (!user || !user._id) {
      messageDiv.textContent = 'Error: User session not found.';
      messageDiv.style.color = 'red';
      return;
  }

  const updatedData = {
      name: document.getElementById('edit-name').value.trim(),
      email: document.getElementById('edit-email').value.trim(),
      contact: document.getElementById('edit-contact').value.trim(),
      ...(user.role === 'distributor' && { categories: document.getElementById('edit-categories').value.trim() }),
      ...(user.role === 'collector' && { region: document.getElementById('edit-region').value.trim() }),
      ...(user.role === 'collector' && { requirements: document.getElementById('edit-requirements').value.trim() }),
  };
   // Basic validation
   if (!updatedData.name || !updatedData.email || !updatedData.contact) {
       messageDiv.textContent = 'Error: Name, Email, and Contact are required.';
       messageDiv.style.color = 'red';
       return;
   }
    if (user.role === 'distributor' && !updatedData.categories) {
        messageDiv.textContent = 'Error: Categories field is required for distributors.';
        messageDiv.style.color = 'red';
        return;
    }
     if (user.role === 'collector' && (!updatedData.region || !updatedData.requirements)) {
         messageDiv.textContent = 'Error: Region and Requirements fields are required for collectors.';
         messageDiv.style.color = 'red';
         return;
     }


  try {
      const response = await fetch(`/api/users/${user._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData)
      });

      const result = await response.json();

      if (result.success) {
          localStorage.setItem('user', JSON.stringify(result.user));

          populateProfileData(result.user);
           updateNavbar(); 

          messageDiv.textContent = 'Profile updated successfully!';
          messageDiv.style.color = 'green';

          toggleEditProfile();

           setTimeout(() => { messageDiv.textContent = ''; }, 5000);

      } else {
          messageDiv.textContent = `Error: ${result.message || 'Failed to update profile.'}`;
          messageDiv.style.color = 'red';
      }
  } catch (err) {
      console.error('Profile update error:', err);
      messageDiv.textContent = 'An unexpected error occurred. Please try again.';
      messageDiv.style.color = 'red';
  }
}

async function changePassword(e) {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem('user'));
  const form = document.getElementById('change-password-form');
  const messageDiv = document.getElementById('password-message');
  messageDiv.textContent = 'Updating password...';
  messageDiv.style.color = 'orange';

  if (!user || !user._id) {
      messageDiv.textContent = 'Error: User session not found.';
      messageDiv.style.color = 'red';
      return;
  }

  const oldPassword = document.getElementById('old-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmNewPassword = document.getElementById('confirm-new-password').value;
  // Basic validation
  if (!oldPassword || !newPassword || !confirmNewPassword) {
      messageDiv.textContent = 'Error: Please fill in all password fields.';
      messageDiv.style.color = 'red';
      return;
  }
  if (newPassword.length < 6) {
       messageDiv.textContent = 'Error: New password must be at least 6 characters long.';
       messageDiv.style.color = 'red';
       return;
  }
  if (newPassword !== confirmNewPassword) {
      messageDiv.textContent = 'Error: New passwords do not match.';
      messageDiv.style.color = 'red';
      return;
  }
  if (newPassword === oldPassword) {
       messageDiv.textContent = 'Error: New password cannot be the same as the old password.';
       messageDiv.style.color = 'red';
       return;
  }

  try {
      const response = await fetch('/api/auth/changePassword', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              userId: user._id,
              oldPassword: oldPassword,
              newPassword: newPassword
          })
      });

      const result = await response.json();

      if (result.success) {
          messageDiv.textContent = 'Password changed successfully!';
          messageDiv.style.color = 'green';
          form.reset(); 
           setTimeout(() => { messageDiv.textContent = ''; }, 5000);
      } else {
          messageDiv.textContent = `Error: ${result.message || 'Failed to change password.'}`;
          messageDiv.style.color = 'red';
      }
  } catch (err) {
      console.error('Password change error:', err);
      messageDiv.textContent = 'An unexpected error occurred. Please try again.';
      messageDiv.style.color = 'red';
  }
}