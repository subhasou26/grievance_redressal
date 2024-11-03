document.addEventListener("DOMContentLoaded", async function () {
  const pincodeElement = document.getElementById("pincode");
  
  pincodeElement.addEventListener("input", async function () {
      const pincode = pincodeElement.value;
     
      
      if (pincode) {
          try {
              await fetchAuthorities(pincode);
          } catch (error) {
              console.error("Failed to fetch authorities:", error);
              alert("Error fetching authorities.");
          }
      } else {
          alert("Please enter a valid pincode.");
      }
      console.log( document.getElementById('authorities').value);
  });

  document.getElementById("complaintForm").addEventListener("submit", async function (event) {
      event.preventDefault();
      
      // Manually collect the description and selected authorities
        const complaint_tag=document.getElementById("tag").value;
        const description = complaint_tag+":"+document.getElementById('complaintDetails').value;
        const authorities = Array.from(document.getElementById('authorities').selectedOptions).map(option => option.value);
        // Create an object with only the necessary data
       
    
      
        const formData = {
            description: description,
            authoriti_ids: authorities
        };
        
      try {
          const response = await fetch("/api/complaint", {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
          });

          const result = await response.json();
          if (response.ok) {
              alert("Complaint submitted successfully: " + result.complaintNumber);
              window.location.href = '/api/dashbord/public';
          } else {
              alert("Error: " + result.msg);
          }
      } catch (error) {
          alert("Error submitting complaint");
      }
  });
});

async function fetchAuthorities(pincode) {
  const response = await fetch(`/api/authorities/nearby?zipcode=${pincode}`);
  const authorities = await response.json();
  
  const select = document.getElementById("authorities");
  select.innerHTML = ''; // Clear previous options

  authorities.forEach((authority) => {
      const option = document.createElement("option");
      option.value = authority._id;
      option.textContent = authority.name;
      select.appendChild(option);
  });
}
