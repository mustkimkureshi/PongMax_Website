document.addEventListener('DOMContentLoaded', function () {
    // Add Staff Member Module
    const staffForm = document.getElementById('staff-form');

    function fetchStaffMembers() {
        fetch('php/get_staff.php')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error fetching staff members:', data.error);
                    return;
                }
                updateLeaveStaffSelect(data);
                updatePayrollStaffSelect(data);
            })
            .catch(error => {
                console.error('Error fetching staff members:', error);
            });
    }

    staffForm?.addEventListener('submit', function (event) {
        event.preventDefault();
        const staffName = document.getElementById('staff-name').value;
        if (staffName) {
            fetch('php/add_staff.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `staff-name=${encodeURIComponent(staffName)}`
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message || data.error);
                fetchStaffMembers();
                staffForm.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while adding the staff member.');
            });
        } else {
            alert('Please enter a staff name.');
        }
    });

    // Mark Attendance Module
    const attendanceForm = document.getElementById('attendance-form');
    const attendanceStaffList = document.getElementById('attendance-staff-list');

    function fetchStaffMembersForAttendance() {
        fetch('php/get_staff.php')
            .then(response => response.json())
            .then(data => {
                attendanceStaffList.innerHTML = '';
                data.forEach(staff => {
                    const label = document.createElement('label');
                    label.innerHTML = `<input type="checkbox" name="staff_id[]" value="${staff.id}">${staff.name}`;
                    attendanceStaffList.appendChild(label);
                });
            })
            .catch(error => {
                console.error('Error fetching staff members:', error);
            });
    }

    attendanceForm?.addEventListener('submit', function (event) {
        event.preventDefault();
        const attendanceDate = document.getElementById('attendance-date').value;
        const staffCheckboxes = document.querySelectorAll('input[name="staff_id[]"]:checked');
        const staffIds = Array.from(staffCheckboxes).map(checkbox => checkbox.value);
        if (!attendanceDate || staffIds.length === 0) {
            alert('Please select a date and at least one staff member.');
            return;
        }
        const formData = new URLSearchParams();
        formData.append('date', attendanceDate);
        staffIds.forEach(id => formData.append('staff_id[]', id));
        formData.append('present', '1');
        fetch('php/mark_attendance.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message || data.error);
            attendanceForm.reset();
        })
        .catch(error => {
            console.error('Error marking attendance:', error);
            alert('An error occurred while marking attendance.');
        });
    });

    // Manage Leave Module
    const leaveForm = document.getElementById('leave-form');
    const leaveStaffSelect = document.getElementById('leave-staff-name');
    function updateLeaveStaffSelect(staffMembers) {
        leaveStaffSelect.innerHTML = '';
        staffMembers.forEach(staff => {
            const option = document.createElement('option');
            option.value = staff.id;
            option.textContent = staff.name;
            leaveStaffSelect.appendChild(option);
        });
    }

    leaveForm?.addEventListener('submit', function (event) {
        event.preventDefault();
        const staffId = leaveStaffSelect.value;
        const leaveStartDate = document.getElementById('leave-start-date').value;
        const leaveEndDate = document.getElementById('leave-end-date').value;
        const currentDate = new Date().toISOString().split('T')[0];
        if (leaveStartDate < currentDate || leaveEndDate < currentDate) {
            alert('Leave dates cannot be in the past.');
            return;
        }
        fetch('php/apply_leave.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `staff_id=${staffId}&start_date=${leaveStartDate}&end_date=${leaveEndDate}`
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            leaveForm.reset();
        })
        .catch(error => {
            console.error('Error applying leave:', error);
        });
    });

    // Manage Payroll Module
    const payrollForm = document.getElementById('payroll-form');
    const payrollStaffSelect = document.getElementById('payroll-staff-name');


    function updatePayrollStaffSelect(staffMembers) {
        payrollStaffSelect.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select Staff';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        payrollStaffSelect.appendChild(defaultOption);
        staffMembers.forEach(staff => {
            const option = document.createElement('option');
            option.value = staff.id;
            option.textContent = staff.name;
            payrollStaffSelect.appendChild(option);
        });
    }

    payrollForm?.addEventListener('submit', function (event) {
        event.preventDefault();
        const staffId = payrollStaffSelect.value;
        const payrollAmount = document.getElementById('payroll-amount').value;
        fetch('php/process_payroll.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `staff_id=${staffId}&amount=${payrollAmount}`
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            payrollForm.reset();
        })
        .catch(error => {
            console.error('Error processing payroll:', error);
        });
    });

    // Initialize Modules
    fetchStaffMembers();
    fetchStaffMembersForAttendance();
});
