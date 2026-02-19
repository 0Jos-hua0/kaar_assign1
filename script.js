document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const studentForm = document.getElementById('student-form');
    const studentTableBody = document.getElementById('student-body');
    const noDataMsg = document.getElementById('no-data-msg');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    // State
    let students = JSON.parse(localStorage.getItem('students')) || [];

    // Initialize UI
    renderTable();

    // Event Listeners
    studentForm.addEventListener('submit', handleFormSubmit);
    hamburger.addEventListener('click', toggleMenu);

    // Form Handling
    function handleFormSubmit(e) {
        e.preventDefault();

        // Get values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const course = document.getElementById('course').value;
        const age = document.getElementById('age').value;

        // Validation Validation (Basic checks, more complex can be added)
        if (!name || !email || !course || !age) {
            alert('Please fill in all fields.');
            return;
        }

        if (age < 16) {
            alert('Student must be at least 16 years old.');
            return;
        }

        // Create student object
        const newStudent = {
            id: Date.now(), // Unique ID based on timestamp
            name,
            email,
            course,
            age
        };

        // Add to state
        students.push(newStudent);

        // Update localStorage
        saveData();

        // Update UI
        renderTable();

        // Reset Form
        studentForm.reset();
        alert('Student registered successfully!');
    }

    // Render Table
    function renderTable() {
        // Clear current body
        studentTableBody.innerHTML = '';

        if (students.length === 0) {
            noDataMsg.classList.remove('hidden');
            document.getElementById('student-table').classList.add('hidden'); // Optional: Hide table header if empty
        } else {
            noDataMsg.classList.add('hidden');
            document.getElementById('student-table').classList.remove('hidden');

            students.forEach((student, index) => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${escapeHtml(student.name)}</td>
                    <td>${escapeHtml(student.email)}</td>
                    <td>${escapeHtml(student.course)}</td>
                    <td>${escapeHtml(student.age)}</td>
                    <td>
                        <button class="action-btn" onclick="deleteStudent(${student.id})">Delete</button>
                    </td>
                `;

                studentTableBody.appendChild(row);
            });
        }
    }

    // Global Delete Function (attached to window to be accessible from inline onclick)
    window.deleteStudent = function(id) {
        if (confirm('Are you sure you want to delete this student?')) {
            students = students.filter(student => student.id !== id);
            saveData();
            renderTable();
        }
    };

    // localStorage Helper
    function saveData() {
        localStorage.setItem('students', JSON.stringify(students));
    }

    // Mobile Menu Toggle
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    }

    // XSS Prevention Helper
    function escapeHtml(text) {
        if (!text) return text;
        return text
            .toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
