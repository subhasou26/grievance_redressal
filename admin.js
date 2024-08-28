// Sample data for the complaints
const data = {
    totalActiveComplaints: 12,
    resolvedComplaints: 8,
    inProgressComplaints: 4
};

// Function to update the dashboard statistics
function updateDashboard() {
    document.getElementById('total-active-complaints').textContent = data.totalActiveComplaints;
    document.getElementById('resolved-complaints').textContent = data.resolvedComplaints;
    document.getElementById('in-progress-complaints').textContent = data.inProgressComplaints;
}

// Call the function to update the dashboard on page load
window.onload = updateDashboard;
