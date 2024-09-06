document.addEventListener('DOMContentLoaded', () => {
    const grievances = complaints;
    console.log(grievances);

    const grievancesList = document.getElementById('grievances-list');
    const totalRegisteredElement = document.getElementById('total-registered');
    const pendingGrievancesElement = document.getElementById('pending-grievances');
    const closedGrievancesElement = document.getElementById('closed-grievances');

    function displayGrievances(grievances) {
        grievancesList.innerHTML = '';
        grievances.forEach(grievance => {
            const row = `<tr>
                
                <td>${grievance.complaintNumber}</td>
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
    document.getElementById("lunch_complaint").addEventListener('click',function (event){
        window.location.href='/api/complaint';
    })
    document.getElementById("sign-out").addEventListener('click',function(){
        window.location.href='/api/auth/logout';
    })
});