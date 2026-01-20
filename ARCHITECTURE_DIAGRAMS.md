# Admin Approval & Rejection - Architecture & Flow Diagrams

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Native App                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              DisasterContext (Global State)              │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ - reports[]                                              │  │
│  │ - pendingReports[] ← filter(status='Pending')           │  │
│  │ - approvedReports[] ← filter(status='Approved')         │  │
│  │ - rejectedReports[] ← filter(status='Rejected') ✨ NEW  │  │
│  │ - allReportsCount ✨ NEW                                │  │
│  │                                                         │  │
│  │ Methods:                                                │  │
│  │ - addReport(report)                                     │  │
│  │ - approveReport(id, severity) ✨ ENHANCED             │  │
│  │ - rejectReport(id, reason) ✨ ENHANCED                │  │
│  │ - addContact(name, phone)                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│           ▲                                      │               │
│           │ useDisaster()                        │               │
│           │                                      ▼               │
│  ┌──────────────────────────────────┐  ┌─────────────────────┐ │
│  │    AdminDashboard Screen ✨       │  │  ReportCard ✨      │ │
│  ├──────────────────────────────────┤  ├─────────────────────┤ │
│  │ - Statistics Panel               │  │ - Report Display    │ │
│  │ - Pending Reports List           │  │ - Status Badge      │ │
│  │ - Severity Modal ✨ NEW          │  │ - Severity Badge    │ │
│  │ - Rejection Reason Modal ✨ NEW  │  │ - Reject Reason     │ │
│  │ - Action Buttons                 │  │ - Action Buttons    │ │
│  └──────────────────────────────────┘  └─────────────────────┘ │
│           │                                                      │
│           └──────────────────────────────────────────────────┐  │
│                                                              │  │
└──────────────────────────────────────────────────────────────┼──┘
                                                               │
                    API Calls (fetch)                          │
                                                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Express.js Backend                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  GET /api/reports                                              │
│  POST /api/reports                                             │
│  PATCH /api/reports/:id ✨ ENHANCED                           │
│  GET /api/contacts                                             │
│  POST /api/contacts                                            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                          File System                            │
│                     data.json Storage                           │
│  ✨ Now stores: severity, timestamps, rejection reasons      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Report Status Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Report Lifecycle                           │
└─────────────────────────────────────────────────────────────────┘

Step 1: User Creates Report
┌──────────────────────┐
│ ReportScreen         │
│ - Select type        │
│ - Enter description  │
│ - Get location       │
│ - Submit             │
└──────────┬───────────┘
           │ addReport()
           ▼
┌──────────────────────┐
│ Backend: POST /      │
│ api/reports          │
│ Create with status   │
│ = "Pending"          │
└──────────┬───────────┘
           │
           ▼
    [🟡 PENDING]


Step 2: Admin Reviews Report
┌──────────────────────┐
│ AdminDashboard       │
│ Shows pending list   │
│ Admin selects        │
│ Approve or Reject    │
└──────────┬───────────┘
           │
       ┌───┴────┬──────────────┐
       │        │              │
       ▼        ▼              ▼


Option A: APPROVE          Option B: REJECT         Option C: NO ACTION
┌────────────────────┐    ┌────────────────────┐   Status stays Pending
│ Admin taps         │    │ Admin taps         │
│ Approve button     │    │ Reject button      │
└────────┬───────────┘    └────────┬───────────┘
         │                         │
         ▼                         ▼
┌────────────────────┐    ┌────────────────────┐
│ Modal: Select      │    │ Modal: Select      │
│ Severity Level     │    │ Rejection Reason   │
│ - Critical         │    │ - Insufficient     │
│ - High (default)   │    │ - Duplicate        │
│ - Medium           │    │ - False alarm      │
│ - Low              │    │ - Invalid loc      │
└────────┬───────────┘    │ - Other            │
         │                └────────┬───────────┘
         ▼                         ▼
┌────────────────────┐    ┌────────────────────┐
│ Confirm Approval   │    │ Confirm Rejection  │
│ as [Severity]?     │    │ as [Reason]?       │
│ [Cancel] [Approve] │    │ [Cancel] [Reject]  │
└────────┬───────────┘    └────────┬───────────┘
         │                         │
         ▼                         ▼
┌────────────────────┐    ┌────────────────────┐
│ Backend PATCH      │    │ Backend PATCH      │
│ - status:          │    │ - status:          │
│   "Approved"       │    │   "Rejected"       │
│ - severity:        │    │ - rejectionReason: │
│   [selected]       │    │   [selected]       │
│ - approvedAt:      │    │ - rejectedAt:      │
│   timestamp        │    │   timestamp        │
└────────┬───────────┘    └────────┬───────────┘
         │                         │
         ▼                         ▼
    [🟢 APPROVED]           [🔴 REJECTED]
    ↓                       ↓
  Visible to:             Hidden from:
  - Rescue Teams          - Public Alerts
  - Public Alerts         - Rescue Teams
  - Statistics            (But stored in DB)
```

---

## 🔄 Admin Approval Workflow (Detailed)

```
START: Admin in AdminDashboard
│
├─→ Dashboard Loads
│   │
│   ├─→ Fetch all reports from API
│   │
│   ├─→ Display Statistics
│   │   ├─ Total: 5
│   │   ├─ Pending: 3 ✨ Highlighted
│   │   ├─ Approved: 2
│   │   └─ Rejected: 0
│   │
│   └─→ Display Pending Reports List
│       ├─ Report 1: Fire
│       ├─ Report 2: Flood
│       └─ Report 3: Earthquake
│
├─→ Admin taps [✓] on Fire Report
│   │
│   ├─→ setSelectedReportId = "123"
│   │
│   ├─→ setShowSeverityModal = true
│   │
│   └─→ Modal Appears: "Select Severity Level"
│       ├─ ⭕ Critical  (Red)
│       ├─ ⭕ High      (Orange)    ← Default selected
│       ├─ ⭕ Medium    (Yellow)
│       └─ ⭕ Low       (Green)
│
├─→ Admin selects "Critical"
│   │
│   ├─→ setSelectedSeverity = "Critical"
│   │
│   ├─→ UI updates: Selected option highlighted
│   │
│   └─→ Admin taps "Approve" button
│
├─→ Confirmation Alert Appears
│   │
│   ├─ Title: "Confirm"
│   ├─ Message: "Approve this report as Critical severity?"
│   ├─ [Cancel] [Approve]
│   │
│   └─→ Admin taps "Approve"
│
├─→ API Call: PATCH /api/reports/123
│   │
│   ├─ Method: PATCH
│   ├─ URL: http://localhost:3000/api/reports/123
│   ├─ Headers: {'Content-Type': 'application/json'}
│   ├─ Body: {
│   │    "status": "Approved",
│   │    "severity": "Critical",
│   │    "approvedAt": "2026-01-21T10:30:00.000Z"
│   │ }
│   │
│   └─→ Backend Processing
│       ├─ Read data.json
│       ├─ Find report with id=123
│       ├─ Update fields:
│       │  - status: "Approved"
│       │  - severity: "Critical"
│       │  - approvedAt: timestamp
│       ├─ Write data.json
│       └─ Return: {"message": "...", "report": {...updated report...}}
│
├─→ Frontend receives successful response
│   │
│   ├─→ Update local state:
│   │   setReports(prev =>
│   │     prev.map(r =>
│   │       r.id === "123"
│   │         ? {...r, status:'Approved', severity:'Critical', ...}
│   │         : r
│   │     )
│   │   )
│   │
│   ├─→ Show Success Alert
│   │   "Success"
│   │   "Report approved and sent to Rescue Teams!"
│   │   [OK]
│   │
│   ├─→ Close Severity Modal
│   │
│   ├─→ Recalculate Filtered Lists
│   │   ├─ pendingReports: 3 → 2
│   │   ├─ approvedReports: 2 → 3
│   │   └─ Statistics update
│   │
│   └─→ Re-render AdminDashboard
│       ├─ Statistics show: Pending: 2, Approved: 3
│       ├─ Fire Report disappears from pending list
│       └─ User sees updated lists
│
└─→ END: Report successfully approved
    Report now visible to Rescue Teams & Public Alerts
```

---

## 🔄 Admin Rejection Workflow (Detailed)

```
START: Admin in AdminDashboard
│
├─→ Admin taps [✗] on Flood Report
│   │
│   ├─→ setSelectedReportId = "456"
│   │
│   ├─→ setShowRejectModal = true
│   │
│   └─→ Modal Appears: "Rejection Reason (Optional)"
│       ├─ ⭕ Insufficient information
│       ├─ ⭕ Duplicate report
│       ├─ ⭕ False alarm
│       ├─ ⭕ Invalid location
│       └─ ⭕ Other
│
├─→ Admin selects "False alarm"
│   │
│   ├─→ setRejectReason = "False alarm"
│   │
│   ├─→ UI updates: Radio button filled, option highlighted
│   │
│   └─→ Admin taps "Reject" button
│
├─→ Confirmation Alert Appears
│   │
│   ├─ Title: "Confirm Rejection"
│   ├─ Message: "Reject with reason: \"False alarm\"?"
│   ├─ [Cancel] [Reject]
│   │
│   └─→ Admin taps "Reject"
│
├─→ API Call: PATCH /api/reports/456
│   │
│   ├─ Method: PATCH
│   ├─ URL: http://localhost:3000/api/reports/456
│   ├─ Headers: {'Content-Type': 'application/json'}
│   ├─ Body: {
│   │    "status": "Rejected",
│   │    "rejectionReason": "False alarm",
│   │    "rejectedAt": "2026-01-21T10:31:00.000Z"
│   │ }
│   │
│   └─→ Backend Processing
│       ├─ Read data.json
│       ├─ Find report with id=456
│       ├─ Update fields:
│       │  - status: "Rejected"
│       │  - rejectionReason: "False alarm"
│       │  - rejectedAt: timestamp
│       ├─ Write data.json
│       └─ Return: {"message": "...", "report": {...updated report...}}
│
├─→ Frontend receives successful response
│   │
│   ├─→ Update local state:
│   │   setReports(prev =>
│   │     prev.map(r =>
│   │       r.id === "456"
│   │         ? {...r, status:'Rejected', rejectionReason:'False alarm', ...}
│   │         : r
│   │     )
│   │   )
│   │
│   ├─→ Show Rejection Alert
│   │   "Rejected"
│   │   "Report has been rejected."
│   │   [OK]
│   │
│   ├─→ Close Rejection Modal
│   │
│   ├─→ Recalculate Filtered Lists
│   │   ├─ pendingReports: 2 → 1
│   │   ├─ rejectedReports: 0 → 1
│   │   └─ Statistics update
│   │
│   └─→ Re-render AdminDashboard
│       ├─ Statistics show: Pending: 1, Rejected: 1
│       ├─ Flood Report disappears from pending list
│       └─ User sees updated lists
│
└─→ END: Report successfully rejected
    Report hidden from Rescue Teams & Public Alerts
    But stored in database with rejection reason
```

---

## 📊 Data Structure Evolution

### Before Enhancement:
```json
{
  "id": "1234567890",
  "type": "Fire",
  "description": "Building on fire",
  "location": "33.6844, 73.0479",
  "status": "Pending",
  "time": "10:30 AM",
  "image": null
}
```

### After Enhancement (Approved):
```json
{
  "id": "1234567890",
  "type": "Fire",
  "description": "Building on fire",
  "location": "33.6844, 73.0479",
  "status": "Approved",
  "severity": "Critical",              ← ✨ NEW
  "approvedAt": "2026-01-21T10:30:00.000Z",  ← ✨ NEW
  "time": "10:30 AM",
  "image": null
}
```

### After Enhancement (Rejected):
```json
{
  "id": "5678901234",
  "type": "Flood",
  "description": "Street flooding",
  "location": "33.7000, 73.0500",
  "status": "Rejected",
  "rejectionReason": "False alarm",    ← ✨ NEW
  "rejectedAt": "2026-01-21T10:31:00.000Z",  ← ✨ NEW
  "time": "10:15 AM",
  "image": null
}
```

---

## 🎯 Component Hierarchy

```
App
├── DisasterProvider (Context)
│   └── SafeAreaProvider
│       └── AppNavigator
│           ├── LoginScreen
│           │   (on login as 'admin')
│           ├── AdminDashboard ✨ ENHANCED
│           │   ├── Statistics Grid
│           │   │   ├── StatCard (Total)
│           │   │   ├── StatCard (Pending)
│           │   │   ├── StatCard (Approved)
│           │   │   └── StatCard (Rejected)
│           │   ├── Pending Reports List
│           │   │   └── ReportCard ✨ NEW (Multiple)
│           │   ├── SeverityModal ✨ NEW
│           │   │   ├── SeverityOption (x4)
│           │   │   └── Buttons
│           │   └── RejectModal ✨ NEW
│           │       ├── ReasonOption (x5)
│           │       └── Buttons
│           └── Other Screens...
```

---

## 🔐 Security & Validation

```
Admin Action
    │
    ├─→ Client-side Validation
    │   ├─ Report ID exists?
    │   ├─ Severity level valid?
    │   ├─ Rejection reason valid?
    │   └─ User role is 'admin'?
    │
    ├─→ Server-side Validation
    │   ├─ Request body valid?
    │   ├─ Report exists in data.json?
    │   ├─ Status transition valid?
    │   └─ Timestamp format valid?
    │
    ├─→ Error Handling
    │   ├─ Network error → Show alert
    │   ├─ Server error → Show alert
    │   ├─ Validation error → Show alert
    │   └─ Success → Update UI & show alert
    │
    └─→ User Feedback
        ├─ Loading state (optional)
        ├─ Success alert
        ├─ Error alert (if failed)
        └─ Real-time UI update
```

