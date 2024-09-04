document.addEventListener("DOMContentLoaded", async function () {
    const zipcodeElement = document.getElementById("zipcode");
    const zipcode = zipcodeElement.getAttribute("data-zipcode");
    console.log(zipcode);
  
    if (zipcode) {
      try {
        await fetchAuthorities(zipcode);
      } catch (error) {
        console.error("Failed to fetch authorities:", error);
        alert("Error fetching authorities.");
      }
    } else {
      alert("User is not logged in or token is missing.");
    }
  
    // Correct the typo in "submit"
    document.getElementById("complaintForm").addEventListener("submit", async function (event) {
      event.preventDefault();
  
      const formData = {
        description:document.getElementById('description').value,
        authoriti_id:document.getElementById('authorities').value

      }
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
          window.location.href='/api/dashbord/public';
        } else {
          alert("Error: " + result.msg);
        }
      } catch (error) {
        alert("Error submitting complaint");
      }
    });
  });
  
  async function fetchAuthorities(zipcode) {
    const response = await fetch(`/api/authorities/nearby?zipcode=${zipcode}`);
    const authorities = await response.json();
  
    const select = document.getElementById("authorities");
    authorities.forEach((authority) => {
      const option = document.createElement("option");
      option.value = authority._id;
      option.textContent = authority.name;
      select.appendChild(option);
    });
  }
  