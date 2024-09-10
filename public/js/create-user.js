
document.getElementById('create-user-form').addEventListener('submit', async function(event) {
  event.preventDefault();
  
  const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
     
      role:document.getElementById('role').value,
      address: {
          street: document.getElementById('street').value,
          city: document.getElementById('city').value,
          state: document.getElementById('state').value,
          zipcode: document.getElementById('zipcode').value,
      }
  };

  try {
      const response = await fetch('/api/admin/create-user', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (response.ok) {
        window.location.href='/api/dashbord/admin';
          alert('Registration successful');
      } else {
          alert('Error: ' + result.msg);
      }
  } catch (error) {
      alert(error);
      //console.log(error);
  }
});
