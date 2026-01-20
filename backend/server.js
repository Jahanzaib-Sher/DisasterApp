const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Logging Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

const DATA_FILE = path.join(__dirname, 'data.json');

// Helper: Read Data
const readData = () => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            // Initialize with empty structure if not exists
            const initialData = { reports: [], contacts: [] };
            fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 4));
            return initialData;
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading data:", err);
        return { reports: [], contacts: [] };
    }
};

// Helper: Write Data
const writeData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4));
    } catch (err) {
        console.error("Error writing data:", err);
    }
};

// Routes
app.get('/', (req, res) => {
    res.send('Disaster Alert API is running...');
});

// --- REPORTS API ---

// Get all reports
app.get('/api/reports', (req, res) => {
    const data = readData();
    res.json(data.reports);
});

// Submit a report
app.post('/api/reports', (req, res) => {
    console.log('📨 POST /api/reports called');
    console.log('Request body:', JSON.stringify(req.body));
    
    const data = readData();
    const newReport = {
        ...req.body,
        id: Date.now().toString(),
        status: 'Pending',
        time: new Date().toLocaleTimeString()
    };
    
    // Log emergency SOS reports
    if (req.body.isEmergencySOS) {
        console.log('🚨🚨🚨 EMERGENCY SOS REPORT RECEIVED 🚨🚨🚨');
        console.log('Location:', newReport.location);
        console.log('Description:', newReport.description);
        console.log('Time:', newReport.time);
        console.log('Report ID:', newReport.id);
    }
    
    data.reports.unshift(newReport); // Add to beginning
    writeData(data);
    console.log('✅ Report saved. Total reports:', data.reports.length);
    res.status(201).json(newReport);
});

// Update report status (Approve/Reject/Mission Status)
app.patch('/api/reports/:id', (req, res) => {
    const { id } = req.params;
    const { status, severity, rejectionReason, approvedAt, rejectedAt, missionStatus, acceptedAt, completedAt } = req.body;
    const data = readData();

    let reportFound = false;

    data.reports = data.reports.map(report => {
        if (report.id === id) {
            reportFound = true;
            const updatedReport = {
                ...report,
                status: status ?? report.status,
                missionStatus: missionStatus ?? report.missionStatus
            };
            
            // Add severity if approving
            if (status === 'Approved') {
                updatedReport.severity = severity ?? 'High';
                updatedReport.approvedAt = approvedAt ?? new Date().toISOString();
            }
            
            // Add rejection reason if rejecting
            if (status === 'Rejected') {
                updatedReport.rejectionReason = rejectionReason ?? 'No reason provided';
                updatedReport.rejectedAt = rejectedAt ?? new Date().toISOString();
            }

            // Handle mission status updates
            if (missionStatus === 'Active') {
                updatedReport.missionStatus = 'Active';
                updatedReport.acceptedAt = acceptedAt ?? new Date().toISOString();
            }

            if (missionStatus === 'Completed') {
                updatedReport.missionStatus = 'Completed';
                updatedReport.completedAt = completedAt ?? new Date().toISOString();
            }
            
            return updatedReport;
        }
        return report;
    });

    if (!reportFound) {
        return res.status(404).json({ message: 'Report not found' });
    }

    writeData(data);
    const updated = data.reports.find(r => r.id === id);
    res.json({ message: 'Report updated', report: updated });
});

// --- CONTACTS API ---

// Get all contacts
app.get('/api/contacts', (req, res) => {
    const data = readData();
    res.json(data.contacts);
});

// Add a contact
app.post('/api/contacts', (req, res) => {
    const data = readData();
    const newContact = {
        ...req.body,
        id: Date.now().toString(),
        isEmergency: false // User added contacts are personal
    };
    data.contacts.push(newContact);
    writeData(data);
    res.status(201).json(newContact);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
