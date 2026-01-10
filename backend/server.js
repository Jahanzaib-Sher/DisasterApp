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
    const data = readData();
    const newReport = {
        ...req.body,
        id: Date.now().toString(),
        status: 'Pending',
        time: new Date().toLocaleTimeString()
    };
    data.reports.unshift(newReport); // Add to beginning
    writeData(data);
    res.status(201).json(newReport);
});

// Update report status (Approve/Reject)
app.patch('/api/reports/:id', (req, res) => {
    const { id } = req.params;
    const { status, severity } = req.body;
    const data = readData();

    let reportFound = false;
    data.reports = data.reports.map(report => {
        if (report.id === id) {
            reportFound = true;
            return {
                ...report,
                status: status || report.status,
                severity: severity || report.severity
            };
        }
        return report;
    });

    if (!reportFound) {
        return res.status(404).json({ message: 'Report not found' });
    }

    writeData(data);
    res.json({ message: 'Report updated', id, status });
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
