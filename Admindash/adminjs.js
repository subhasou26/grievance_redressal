const menuBtn = document.getElementById('menu-btn');
        const navBar = document.getElementById('nav-bar');
        const createUserForm = document.getElementById('create-user-form');
        const createUserLink = document.getElementById('create-user-link');
        const profilecontainer = document.getElementById('profile-container');
	const profilebtn = document.getElementById('profile-button');
        menuBtn.addEventListener('click', function() {
            navBar.classList.toggle('visible');
        });
        

        // Show the Create User form when the link is clicked
        createUserLink.addEventListener('click', function(event) {
            event.preventDefault();
            createUserForm.style.display = createUserForm.style.display === 'none' || createUserForm.style.display === '' ? 'block' : 'none';
        });
	profilebtn.addEventListener('click', function(event) {
            event.preventDefault();
            profilecontainer.style.display = profilecontainer.style.display === 'none' || profilecontainer.style.display === '' ? 'block' : 'none';
        });
        // Toggle dark mode
        const themeSwitch = document.getElementById('theme-switch');
        themeSwitch.addEventListener('change', function() {
            document.body.classList.toggle('dark-mode');
        });
	function editName() {
            const nameParagraph = document.getElementById('name');
            const nameInput = document.getElementById('name-input');
            const button = document.querySelector('button');

            if (nameInput.classList.contains('edit-mode')) {
                // Switch to edit mode
                nameInput.classList.remove('edit-mode');
                nameParagraph.classList.add('edit-mode');
                nameInput.value = nameParagraph.textContent;
                button.textContent = 'Save';
            } else {
                // Save changes and switch back to view mode
                nameParagraph.textContent = nameInput.value;
                nameInput.classList.add('edit-mode');
                nameParagraph.classList.remove('edit-mode');
                button.textContent = 'Edit';
            }
        }

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