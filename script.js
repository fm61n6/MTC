// MTC Student Management System

let students = JSON.parse(localStorage.getItem("students")) || [];

const studentForm = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");
const searchInput = document.getElementById("searchInput");

// Save student records in the browser
function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

// Display students in the table
function displayStudents(list = students) {

    studentList.innerHTML = "";

    document.getElementById("emptyMessage").style.display =
        list.length === 0 ? "block" : "none";

    list.forEach(function(student) {

        let performance = student.marks >= 50 ? "Passed" : "Failed";

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.gender}</td>
            <td>${student.course}</td>
            <td>${student.marks}</td>
            <td>${performance}</td>
            <td>
                <button class="action-button"
                    onclick="updateStudent(${student.id})">
                    Update
                </button>

                <button class="action-button delete-button"
                    onclick="deleteStudent(${student.id})">
                    Delete
                </button>
            </td>
        `;

        studentList.appendChild(row);
    });

    updateDashboard();
}

// Register a new student
studentForm.addEventListener("submit", function(event) {

    event.preventDefault();

    let name = document.getElementById("fullName").value.trim();
    let age = Number(document.getElementById("age").value);
    let gender = document.getElementById("gender").value;
    let course = document.getElementById("course").value;
    let marks = Number(document.getElementById("marks").value);

    if (name === "" || age <= 0 || marks < 0 || marks > 100) {
        alert("Please enter valid student information.");
        return;
    }

    let student = {
        id: Date.now(),
        name: name,
        age: age,
        gender: gender,
        course: course,
        marks: marks
    };

    students.push(student);

    saveStudents();
    displayStudents();

    studentForm.reset();

    alert("Student registered successfully!");
});

// Delete a student
function deleteStudent(id) {

    let confirmDelete = confirm("Are you sure you want to delete this student?");

    if (!confirmDelete) {
        return;
    }

    students = students.filter(function(student) {
        return student.id !== id;
    });

    saveStudents();
    displayStudents(searchStudents());

    alert("Student deleted successfully!");
}

// Update student marks
function updateStudent(id) {

    let student = students.find(function(student) {
        return student.id === id;
    });

    if (!student) {
        return;
    }

    let newMarks = prompt("Enter new marks:", student.marks);

    if (newMarks === null || newMarks.trim() === "") {
        return;
    }

    newMarks = Number(newMarks);

    if (!Number.isFinite(newMarks) || newMarks < 0 || newMarks > 100) {
        alert("Please enter marks between 0 and 100.");
        return;
    }

    student.marks = newMarks;

    saveStudents();
    displayStudents(searchStudents());

    alert("Student marks updated successfully!");
}

// Search students by name
function searchStudents() {

    let searchValue = searchInput.value.toLowerCase().trim();

    return students.filter(function(student) {
        return student.name.toLowerCase().includes(searchValue);
    });
}

searchInput.addEventListener("input", function() {
    displayStudents(searchStudents());
});

// Update dashboard statistics
function updateDashboard() {

    let total = students.length;
    let passed = 0;
    let failed = 0;
    let totalMarks = 0;

    students.forEach(function(student) {

        totalMarks += student.marks;

        if (student.marks >= 50) {
            passed++;
        } else {
            failed++;
        }