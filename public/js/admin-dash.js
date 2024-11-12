
// Toggle navigation bar visibility
const menuBtn = document.getElementById('menu-btn');
const navBar = document.getElementById('nav-bar');
const createUserForm = document.getElementById('create-user-form');
const createUserLink = document.getElementById('create-user-link');
const logout=document.getElementById("logout-btn");
const map=document.getElementById("map");
const combined_map=document.getElementById("combined-map");
menuBtn.addEventListener('click', function() {
    navBar.classList.toggle('visible');
});

logout.addEventListener("click",function(event){
    window.location.href="/api/auth/logout";
});

map.addEventListener("click",function (event){
    
    window.location.href="/api/complaint/map";
})
combined_map.addEventListener("click",function(){
    window.location.href="/api/complaint/combined-map";
})
// Show the Create User form when the link is clicked
createUserLink.addEventListener('click', function(event) {
    window.location.href="/api/admin/create-user";
    // event.preventDefault();
    // createUserForm.style.display = createUserForm.style.display === 'none' || createUserForm.style.display === '' ? 'block' : 'none';
});

// Toggle dark mode
const themeSwitch = document.getElementById('theme-switch');
themeSwitch.addEventListener('change', function() {
    document.body.classList.toggle('dark-mode');
});

// JavaScript for search functionality
const searchBar = document.getElementById('search-bar');
searchBar.addEventListener('input', function() {
    const filter = searchBar.value.toUpperCase();
    const table = document.querySelector('table');
    const tr = table.getElementsByTagName('tr');

    for (let i = 1; i < tr.length; i++) {
        const td = tr[i].getElementsByTagName('td')[1]; // Complaint No column
        if (td) {
            const txtValue = td.textContent || td.innerText;
            tr[i].style.display = txtValue.toUpperCase().indexOf(filter) > -1 ? '' : 'none';
        }
    }
});
