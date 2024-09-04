document.addEventListener('DOMContentLoaded', () => {
    const grievances = [
        { sn: 1, complaintNumber: 'CN123', receivedDate: '2024-08-01', description: 'Complaint about service', status: 'Pending' },
        { sn: 2, complaintNumber: 'CN124', receivedDate: '2024-08-02', description: 'Complaint about pension', status: 'Closed' },
        { sn: 3, complaintNumber: 'CN125', receivedDate: '2024-08-03', description: 'Complaint about staff', status: 'Pending' },
        { sn: 4, complaintNumber: 'CN126', receivedDate: '2024-08-04', description: 'Complaint about policy', status: 'Closed' },
    ];

    const grievancesList = document.getElementById('grievances-list');
    const totalRegisteredElement = document.getElementById('total-registered');
    const pendingGrievancesElement = document.getElementById('pending-grievances');
    const closedGrievancesElement = document.getElementById('closed-grievances');

    function displayGrievances(grievances) {
        grievancesList.innerHTML = '';
        grievances.forEach(grievance => {
            const row = `<tr>
                <td>${grievance.sn}</td>
                <td>${grievance.complaintNumber}</td>
                <td>${grievance.receivedDate}</td>
                <td>${grievance.description}</td>
                <td>${grievance.status}</td>
            </tr>`;
            grievancesList.insertAdjacentHTML('beforeend', row);
        });
    }

    function updateStatistics(grievances) {
        const totalRegistered = grievances.length;
        const pendingGrievances = grievances.filter(grievance => grievance.status.toLowerCase() === 'pending').length;
        const closedGrievances = grievances.filter(grievance => grievance.status.toLowerCase() === 'closed').length;

        totalRegisteredElement.textContent = totalRegistered;
        pendingGrievancesElement.textContent = pendingGrievances;
        closedGrievancesElement.textContent = closedGrievances;
    }

    displayGrievances(grievances);

    updateStatistics(grievances);

    window.searchGrievance = function() {
        const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
        const filteredGrievances = grievances.filter(grievance => 
            grievance.complaintNumber.toLowerCase().includes(searchInput)
        );
        displayGrievances(filteredGrievances);
        updateStatistics(filteredGrievances); 
    };
});