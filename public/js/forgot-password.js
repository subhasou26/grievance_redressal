
document.addEventListener("DOMContentLoaded", function () {
  window.onload = function() {
    document.getElementById('otp-form').reset();
    document.getElementById('forgot-password-form').reset();
};
document
  .getElementById("forgot-password-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = {
      email: document.getElementById("email").value,
    };

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log(response);
      if (response.ok) {
        alert("OTP has been sent to your registered email address.");
      } else {
        alert("Error: " + result.msg);
      }
    } catch (error) {
      alert("Error sending email");
    }

    document.getElementById("otp-field").style.display = "block";
  });

document
  .getElementById("otp-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = {
      email: document.getElementById("email").value,
      otp:document.getElementById('otp').value,
      newPassword:document.getElementById('newPassword').value,
    };

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Password reset succesfully");
        window.location.href="/api/auth/login";
      } else {
        alert("Error: " + result.msg);
      }
    } catch (error) {
      alert("Error to reset password");
    }
  });

});