document.addEventListener('DOMContentLoaded', () => {
    fetch('php/get_attendance.php')
        .then(response => response.json())
        .then(data => {
            displayCompactAttendance(data);
        })
        .catch(error => {
            console.error('Error loading attendance:', error);
            document.getElementById('attendance-list').innerHTML = "<p>Error loading attendance records.</p>";
        });

    function displayCompactAttendance(records) {
        const container = document.getElementById('attendance-list');
        container.innerHTML = '';

        // Sort by date
        records.sort((a, b) => a.date.localeCompare(b.date));

        // Group by date
        const grouped = {};
        records.forEach(record => {
            if (!grouped[record.date]) {
                grouped[record.date] = [];
            }
            grouped[record.date].push(record);
        });

        for (const date in grouped) {
            const dateHeader = document.createElement('h3');
            dateHeader.textContent = ` ${date}`;
            container.appendChild(dateHeader);

            const table = document.createElement('table');
            table.classList.add('attendance-table');

            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `
                <th>Staff Name</th>
                <th>Status</th>
            `;
            table.appendChild(headerRow);

            // Separate present and absent staff
            const presentNames = grouped[date]
                .filter(r => r.present == 1)
                .map(r => r.staff_name)
                .join(', ');

            const absentNames = grouped[date]
                .filter(r => r.present == 0)
                .map(r => r.staff_name)
                .join(', ');

            if (presentNames) {
                const presentRow = document.createElement('tr');
                presentRow.innerHTML = `
                    <td>${presentNames}</td>
                    <td class="present">Present</td>
                `;
                table.appendChild(presentRow);
            }

            if (absentNames) {
                const absentRow = document.createElement('tr');
                absentRow.innerHTML = `
                    <td>${absentNames}</td>
                    <td class="absent">Absent</td>
                `;
                table.appendChild(absentRow);
            }

            container.appendChild(table);
        }
    }
});
