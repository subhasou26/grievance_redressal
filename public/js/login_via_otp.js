
document.addEventListener("DOMContentLoaded", function () {
    window.onload = function() {
      document.getElementById('otp-form').reset();
      document.getElementById('forgot-password-form').reset();
  };
  
  function showLoading() {
    document.getElementById("loading-screen").style.display = "flex";
  }
  
  // Hide the loading screen
  function hideLoading() {
    document.getElementById("loading-screen").style.display = "none";
  }
  
  document
    .getElementById("forgot-password-form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const formData = {
        phone: document.getElementById("phone").value,
      };
      showLoading();
      try {
        const response = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        const result = await response.json();
        console.log(response);
        if (response.ok) {
          alert("OTP has been sent to your registered phone no.");
        } else {
          alert("Error: " + result.msg);
        }
      } catch (error) {
        alert("Error sending sms");
      }
      hideLoading();
      document.getElementById("otp-field").style.display = "block";
    });
  
  document
    .getElementById("otp-form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const formData = {
        phone: document.getElementById("phone").value,
        otp:document.getElementById('otp').value,
        
      };
  
      try {
        const response = await fetch("/api/auth/login-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        const result = await response.json();
        if (response.ok) {

          console.log(response);
          
          window.location.href=`/api/dashbord/${result.role}`;
        } else {
          alert("Error: " + result.msg);
        }
      } catch (error) {
        alert("Error to reset password");
      }
    });
  
  });