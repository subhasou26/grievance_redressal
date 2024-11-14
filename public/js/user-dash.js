document.addEventListener('DOMContentLoaded', () => {
    const grievances = complaints;
    console.log(grievances);

   
    const totalRegisteredElement = document.getElementById('total-registered');
    const pendingGrievancesElement = document.getElementById('pending-grievances');
    const closedGrievancesElement = document.getElementById('closed-grievances');


    function updateStatistics(grievances) {
        const totalRegistered = grievances.length;
        const pendingGrievances = grievances.filter(grievance => grievance.status.toLowerCase() === 'pending').length;
        const closedGrievances = grievances.filter(grievance => grievance.status.toLowerCase() === 'resolved').length;

        totalRegisteredElement.textContent = totalRegistered;
        pendingGrievancesElement.textContent = pendingGrievances;
        closedGrievancesElement.textContent = closedGrievances;
    }

   // displayGrievances(grievances);

    updateStatistics(grievances);

    window.searchGrievance = function() {
        const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
        const filteredGrievances = grievances.filter(grievance => 
            grievance.complaintNumber.toLowerCase().includes(searchInput)
        );
        
        updateStatistics(filteredGrievances); 
    };
    document.getElementById("lunch_complaint").addEventListener('click',function (event){
        window.location.href='/api/complaint';
    })
    document.getElementById("sign-out").addEventListener('click',function(){
        window.location.href='/api/auth/logout';
    })
});

document.addEventListener("DOMContentLoaded", function() {
    const complaintRows = document.querySelectorAll("#complaints-table-body tr");
    const modal = document.getElementById("complaint-modal");
    const modalClose = document.getElementById("modal-close");
    const complaintNumberElem = document.getElementById("modal-complaint-number");
    const descriptionElem = document.getElementById("modal-description");
    const statusElem = document.getElementById("modal-status");
    const responceElam=document.getElementById("modal-responce");
   

    // Function to open the modal and populate it with complaint details
    complaintRows.forEach(row => {
        row.addEventListener("click", function() {
            const complaintNumber = this.querySelector("td:nth-child(1)").innerText;
            const description = this.querySelector("td:nth-child(2)").innerText;
            const status = this.querySelector("td:nth-child(3)").innerText;
            const responce=this.querySelector("td:nth-child(5)").innerText;
            // Set selected complaint id (this would come from your server in a real app)
            
            // Populate modal with complaint details
            complaintNumberElem.innerText = complaintNumber;
            descriptionElem.innerText = description;
            statusElem.innerText = status;
            responceElam.innerText=responce;
            // Show the modal
            modal.style.display = "block";
        });
    });

    // Close the modal
    modalClose.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // Submit solution to update complaint
   
});