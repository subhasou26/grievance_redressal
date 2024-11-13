document.addEventListener("DOMContentLoaded", function () {
  const locationButton = document.getElementById("get-location");
  const complaintForm = document.getElementById("complaintForm");

  let lat, long;

  locationButton.addEventListener("click", function () {
      navigator.geolocation.getCurrentPosition(
          function (position) {
              lat = position.coords.latitude;
              long = position.coords.longitude;

              alert(`Location retrieved:\nLatitude: ${lat}\nLongitude: ${long}`);
              fetchAuthorities(lat, long);
          },
          function (error) {
              console.error("Error retrieving location:", error);
              alert("Failed to retrieve location. Please enable location services.");
          }
      );
  });

  complaintForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const complaintDetails = document.getElementById("complaintDetails").value;
      const tag = document.getElementById("tag").value;
      const authorities = Array.from(document.getElementById("authorities").selectedOptions).map(option => option.value);
      const imageFiles = document.getElementById("proof").files;

      const formData = {
          description: `${tag}: ${complaintDetails}`,
          authoriti_ids: authorities,
          geometry: {
              type: "Point",
              coordinates: [long, lat]
          },
          images: [] // Array to hold base64-encoded images
      };

      for (let i = 0; i < imageFiles.length; i++) {
          const base64Image = await convertToBase64(imageFiles[i]);
          formData.images.push(base64Image);
      }

      try {
          const response = await fetch("/api/complaint", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData)
          });

          const result = await response.json();
          if (response.ok) {
              alert("Complaint submitted successfully: " + result.complaintNumber);
              window.location.href = "/api/dashbord/public";
          } else {
              alert("Error: " + result.msg);
          }
      } catch (error) {
          alert("Error submitting complaint");
          console.error("Submit error:", error);
      }
  });
});

async function fetchAuthorities(lat, long) {
  try {
      const response = await fetch(`/api/authorities/nearby?lat=${lat}&long=${long}`);
      const authorities = await response.json();

      const select = document.getElementById("authorities");
      select.innerHTML = "";

      authorities.forEach((authority) => {
          const option = document.createElement("option");
          option.value = authority._id;
          option.textContent = authority.name;
          select.appendChild(option);
      });
  } catch (error) {
      console.error("Failed to fetch authorities:", error);
      alert("Error fetching authorities.");
  }
}

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
  });
}
