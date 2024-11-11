// document.addEventListener("DOMContentLoaded", function () {
//   const pincodeElement = document.getElementById("pincode");
//   const locationButton = document.getElementById("get-location");
//   const complaintForm = document.getElementById("complaintForm");

//   // Fetch authorities based on pincode
// //   pincodeElement.addEventListener("input", async function () {
// //       const pincode = pincodeElement.value;
// //       if (pincode) {
// //           try {
// //               await fetchAuthorities(pincode);
// //           } catch (error) {
// //               console.error("Failed to fetch authorities:", error);
// //               alert("Error fetching authorities.");
// //           }
// //       } else {
// //           alert("Please enter a valid pincode.");
// //       }
// //   });

// //   // Handle geolocation retrieval
// // locationButton.addEventListener("click", function () {
// //     if (navigator.geolocation) {
// //         navigator.geolocation.getCurrentPosition(
// //             function (position) {
// //                 lat = position.coords.latitude;
// //                 long = position.coords.longitude;

// //                 console.log("Latitude:", lat, "Longitude:", long);
// //                 alert(`Location retrieved:\nLatitude: ${lat}\nLongitude: ${long}`);

// //                 // Fetch authorities if pincode is available
// //                 if (pincode) {
// //                     fetchAuthorities(pincode, lat, long);
// //                 }
// //             },
// //             function (error) {
// //                 console.error("Error retrieving location:", error);
// //                 alert("Failed to retrieve location. Please enable location services.");
// //             },
// //             { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
// //         );
// //     } else {
// //         alert("Geolocation is not supported by this browser.");
// //     }
// // });
// let pincode = '';
// let lat, long;

// pincodeElement.addEventListener("input", function () {
//     pincode = pincodeElement.value;
//     if (pincode && lat !== undefined && long !== undefined) {
//         fetchAuthorities(pincode, lat, long);
//     }
// });

// locationButton.addEventListener("click", function () {
//     navigator.geolocation.getCurrentPosition(
//         function (position) {
//             lat = position.coords.latitude;
//             long = position.coords.longitude;

//             alert(`Location retrieved:\nLatitude: ${lat}\nLongitude: ${long}`);

//             if (pincode && lat !== undefined && long !== undefined) {
//                 fetchAuthorities(pincode, lat, long);
//             } else {
//                 alert("Please enter a valid pincode.");
//             }
//         },
//         function (error) {
//             console.error("Error retrieving location:", error);
//             alert("Failed to retrieve location. Please enable location services.");
//         }
//     );
// });


//   // Handle form submission
//   complaintForm.addEventListener("submit", async function (event) {
//       event.preventDefault();

//       navigator.geolocation.getCurrentPosition(async function (position) {
//           const lat = position.coords.latitude;
//           const long = position.coords.longitude;

//           const complaintDetails = document.getElementById("complaintDetails").value;
//           const tag = document.getElementById("tag").value;
//           const authorities = Array.from(document.getElementById("authorities").selectedOptions).map(option => option.value);

//           const formData = {
//               description: `${tag}: ${complaintDetails}`,
//               authoriti_ids: authorities,
//               geometry: {
//                   type: "Point",
//                   coordinates: [long, lat]
//               }
//           };

//           try {
//               const response = await fetch("/api/complaint", {
//                   method: "POST",
//                   headers: { "Content-Type": "application/json" },
//                   body: JSON.stringify(formData)
//               });

//               const result = await response.json();
//               if (response.ok) {
//                   alert("Complaint submitted successfully: " + result.complaintNumber);
//                   window.location.href = "/api/dashbord/public";
//               } else {
//                   alert("Error: " + result.msg);
//               }
//           } catch (error) {
//               alert("Error submitting complaint");
//           }
//       }, function () {
//           alert("Failed to retrieve location. Please enable location services and try again.");
//       });
//   });
// });

// // async function fetchAuthorities(pincode) {
// //   const response = await fetch(`/api/authorities/nearby?zipcode=${pincode}`);
// //   const authorities = await response.json();

// //   const select = document.getElementById("authorities");
// //   select.innerHTML = "";  // Clear previous options

// //   authorities.forEach((authority) => {
// //       const option = document.createElement("option");
// //       option.value = authority._id;
// //       option.textContent = authority.name;
// //       select.appendChild(option);
// //   });
// // }


// async function fetchAuthorities(pincode, lat, long) {
//   try {
//       // Ensure pincode, lat, and long are being sent in the request
//       const response = await fetch(`/api/authorities/nearby?pincode=${pincode}&lat=${lat}&long=${long}&radius=5`);
//       const authorities = await response.json();

//       const select = document.getElementById("authorities");
//       select.innerHTML = "";  // Clear previous options

//       if (authorities.length === 0) {
//           const option = document.createElement("option");
//           option.textContent = "No authorities found in this area.";
//           select.appendChild(option);
//           return;
//       }

//       // Populate select with all matching authorities
//       authorities.forEach((authority) => {
//           const option = document.createElement("option");
//           option.value = authority._id;
//           option.textContent = authority.name;
//           select.appendChild(option);
//       });
//   } catch (error) {
//       console.error("Failed to fetch authorities:", error);
//       alert("Error fetching authorities.");
//   }
// }


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

        const formData = {
            description: `${tag}: ${complaintDetails}`,
            authoriti_ids: authorities,
            geometry: {
                type: "Point",
                coordinates: [long, lat]
            }
        };

        try {
            const response = await fetch("/api/complaint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            if (response.ok) {
                alert("Complaint submitted successfully: " + result.complaintNumber);
            } else {
                alert("Error: " + result.msg);
            }
        } catch (error) {
            alert("Error submitting complaint");
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
