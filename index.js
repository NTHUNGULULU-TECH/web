
/**
 Asset Management System - Staff Web
 

 - Employee authentication (name + ID)
 - Dashboard with asset statistics
 - Asset listing and search
 - Issue reporting
 - Session management
 */


const staffLink = document.getElementById('staff-link');
const AppData = {
  


  assets: [
    { id: 'LP1001', type: 'Laptop', model: 'Dell XPS 15', status: 'Available', assignedTo: 'Ernest Mpate', image:'zt/dell_xps_17.jfif' },
    { id: 'LP1002', type: 'Camera', model: 'Canon EOS R8', status: 'Assigned', assignedTo: 'McLean Kasambala', image:'zt/Canon_EOS_R8.webp' },
    { id: 'MN2001', type: 'Camera', model: 'Nikon Z6III', status: 'Available', assignedTo: '', image:'zt//zt/Nikon_Z6III.webp' },
    { id: 'DN7001', type: 'Drone', model: 'DJI Air 3"', status: 'Assigned', assignedTo: 'Promise Harare', image:'zt/DJI_Air_3.JFIF' },
    { id: 'KB3001', type: 'Computer', model: 'Vibox I-6', status: 'Available', assignedTo: '', image:'zt/Vibox_I-6.JFIF' },
    { id: 'KB3002', type: 'Computer', model: 'Asus Desktop', status: 'Assigned', assignedTo: '', image:'zt/Asus-Desktop.jfif' },
    { id: 'MS4001', type: 'Drone', model: 'DJI Phanthom 3', status: 'Available', assignedTo: '', image:'zt/DJI_Phanthom_3.JFIF' },
    { id: 'MS4002', type: 'Camera', model: 'Sony Video Camera', status: 'Assigned', assignedTo: 'Joyce Chipeta', image:'zt/vidCam.jpg' },
    { id: 'DCK5001', type: 'FPV', model: 'FPV Drone', status: 'Available', assignedTo: '', image:'zt/droneFPV.JFIF' },
    { id: 'HP06001', type: 'Van', model: 'Mercedes Benz Van', status: 'Assigned', assignedTo: 'Sangwani Soko', image:'zt/Van1.jfif' }
],

employees:  [
    { id: 'NT0001', position: 'Manager', status: 'Available', name: 'McLean Kasambala', role: 'Admin' },
    { id: 'NT0002', position: 'Human Resource Officer',  status: 'Holiday', name: 'Chatewa Banda', role: 'Admin' },
    { id: 'NT0003', position: 'Financial Officer',  status: 'Available', name: 'P Zibophe', role: 'Staff' },
    { id: 'NT0004', position: 'Estate',  status: 'Available', name: 'Promise Harare', role: 'Staff' },
    { id: 'NT0005', position: 'Media_Operator', status: 'Dismissed', name: 'Yohane John', role: 'Staff' },
    { id: 'NT0006', position: 'Media_Operator', status: 'Available', name: 'Ernest Mpate', role: 'Staff' },
    { id: 'NT0007', position: 'Media-Operator', status: 'Suspended', name: 'Mavuto Jere', role: 'Staff' },
    { id: 'NT0008', position: 'Media_Operator', status: 'Fired', name: 'Mwandida Banda', role: 'Staff' },
    { id: 'NT0009', position: 'Technical_Officer', status: 'Available', name: 'Joyce Chipeta', role: 'Staff' },
    { id: 'NT0010', position: 'Marketing_Manager', status: 'Medical_Leave', name: 'Sangwani Soko', role: 'Staff' }
],

  // Reported issues
  issues: [
    { id: 1, assetId: 'M2001', employeeId: '1001', issueType: 'hardware', description: 'Flickering display', status: 'open', date: '2023-05-15', urgent: true },
    { id: 2, assetId: 'A1002', employeeId: '1002', issueType: 'software', description: 'Battery not charging', status: 'resolved', date: '2023-04-28', urgent: false }
  ]
};

//const userRole = AuthService.currentUser?.role|| "guest";

// authenticatION
const AuthService = {
  currentUser: null,

  login(name, id, remember) {
    const user = AppData.employees.find(emp => 
      emp.name.toLowerCase() === name.toLowerCase() && 
      emp.id === id
    );

    if (user) {
      this.currentUser = user;
      if (remember) {
        localStorage.setItem('rememberedName', name);
        localStorage.setItem('rememberedId', id);
      }
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  },

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  },

  checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
      return true;
    }
    return false;
  },

  getRememberedCredentials() {
    return {
      name: localStorage.getItem('rememberedName'),
      id: localStorage.getItem('rememberedId')
    };
  }
};


// ASSET SERVICE

const AssetService = {
  getAssets() {
    return AppData.assets;
  },

  searchAssets(query) {
    const q = query.toLowerCase();
    return AppData.assets.filter(asset => 
      asset.id.toLowerCase().includes(q) ||
      asset.type.toLowerCase().includes(q) ||
      asset.model.toLowerCase().includes(q) ||
      asset.status.toLowerCase().includes(q) ||
      asset.assignedTo.toLowerCase().includes(q)
    );
  },

  getAssetStats() {
    const total = AppData.assets.length;
    const available = AppData.assets.filter(a => a.status === 'Available').length;
    return {
      total,
      available,
      assigned: total - available
    };
  },

  addAsset(newAsset) {
    
    if (this.getAssets().some(a => a.id === newAsset.id)) {
      return { success: false, message: 'Asset ID already exists' };
    }
    
    AppData.assets.push(newAsset);
    return { success: true, message: 'Asset added successfully' };
  },

  removeAsset(assetId) {
    const index = AppData.assets.findIndex(a => a.id === assetId);
    if (index === -1) {
      return { success: false, message: 'Asset not found' };
    }
    
    if (AppData.assets[index].status === 'Assigned') {
      return { success: false, message: 'Cannot remove assigned asset' };
    }
    
    AppData.assets.splice(index, 1);
    return { success: true, message: 'Asset removed successfully' };
  },

  reportIssue(assetId, issueType, description, urgent) {
    const newIssue = {
      id: AppData.issues.length + 1,
      assetId,
      employeeId: AuthService.currentUser.id,
      issueType,
      description,
      status: 'open',
      date: new Date().toISOString().split('T')[0],
      urgent
    };
    AppData.issues.push(newIssue);
    return newIssue;
  },

  getUserReports(employeeId) {
    return AppData.issues.filter(issue => issue.employeeId === employeeId);
  }
};

// UI COMPONENTS

const UIComponents = {
  // Login Page
  renderLoginPage() {
    return `
      <div class="login-container">
        <div class="login-header text-center">
          <img class= "nav-logo" src="zt/ntlogo-w.jpg" alt="company-logo" class="login-logo" style = "width: 150px; height: auto;">
          <br><br><h2>Asset Management System</h2>
          <p class="text-muted">Staff Login</p>
        </div>
        
        <form id="loginForm">
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="employeeName" placeholder="John Doe" required>
            <label for="employeeName">Full Name</label>
          </div>
          
          <div class="form-floating mb-3">
            <input type="password" class="form-control" id="employeeId" placeholder="ID Number" required>
            <label for="employeeId">Employee ID Number</label>
          </div>
          
          <div class="d-grid gap-2 mb-3">
            <button type="submit" class="btn btn-primary btn-login">
              <i class="bi bi-box-arrow-in-right me-2"></i> Login
            </button>
          </div>
          
          <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" id="rememberMe">
            <label class="form-check-label" for="rememberMe">Remember me</label>
          </div>
        </form>
        
        <div class="footer-links">
          <p class="text-muted">Contact IT support if you need assistance</p>
        </div>
      </div>
    `;
  },

  // Dashboard
  renderDashboard() {
    const stats = AssetService.getAssetStats();
    
    return `
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card text-white bg-primary mb-3">
            <div class="card-body">
              <h5 class="card-title">Total Assets</h5>
              <p class="card-text display-6">${stats.total}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-white bg-success mb-3">
            <div class="card-body">
              <h5 class="card-title">Available</h5>
              <p class="card-text display-6">${stats.available}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-white bg-warning mb-3">
            <div class="card-body">
              <h5 class="card-title">Assigned</h5>
              <p class="card-text display-6">${stats.assigned}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header">
          <i class="bi bi-bell-fill me-2"></i>Recent Activity
        </div>
        <div class="card-body">
          <ul class="list-group list-group-flush">
            <li class="list-group-item">
              <i class="bi bi-check-circle-fill text-success me-2"></i>
              Laptop #LP1003 was assigned to Ernest Mpate
            </li>
            <li class="list-group-item">
              <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
              Monitor #M2005 reported with issue
            </li>
            <li class="list-group-item">
              <i class="bi bi-check-circle-fill text-success me-2"></i>
              Drone #D3001 returned to inventory
            </li>
          </ul>
        </div>
      </div>
    `;
    
    
  },

  // Assets List
  renderAssetsList() {
    const assets = AssetService.getAssets();
    const isAdmin = AuthService.currentUser?.role === 'Admin';
    
    const rows = assets.map(asset => `
      <tr data-asset-id="${asset.id}">
        <td>${asset.id}</td>
        <td>${asset.type}</td>
        <td>${asset.model}</td>
        <td>
          ${asset.status === 'Available' ? 
            '<span class="badge bg-success">Available</span>' : 
            '<span class="badge bg-primary">Assigned</span>'}
        </td>
        <td>${asset.assignedTo || '-'}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary view-asset" data-id="${asset.id}">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-sm btn-outline-secondary report-asset" data-id="${asset.id}">
            <i class="bi bi-exclamation-triangle"></i>
          </button>
          ${isAdmin ? `
            <button class="btn btn-sm btn-outline-danger remove-asset" data-id="${asset.id}">
              <i class="bi bi-trash"></i>
            </button>
          ` : ''}
        </td>
      </tr>
    `).join('');
  
    return `
      <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span><i class="bi bi-laptop me-2"></i>All Assets</span>
          ${isAdmin ? `
            <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
              <button class="btn btn-success rounded-circle" id="add-asset-btn" style="width: 56px; height: 56px;">
                <i class="bi bi-plus-lg fs-4"></i>
              </button>
            </div>
          ` : ''}
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Asset ID</th>
                  <th>Type</th>
                  <th>Model</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  renderStaffList() {
    const isAdmin = AuthService.currentUser?.role === 'Admin';
    
    return `
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span><i class="bi bi-people-fill me-2"></i>Staff List</span>
          <div class="input-group" style="width: 300px;">
            <input type="text" class="form-control" placeholder="Search staff..." 
                   id="staff-search" aria-label="Search staff">
            <button class="btn btn-outline-secondary" type="button" id="staff-search-btn">
              <i class="bi bi-search"></i>
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Name</th>
                  ${isAdmin ? '<th>Actions</th>' : ''}
                </tr>
              </thead>
              <tbody id="staffTableBody">
                <!-- Populated dynamically -->
              </tbody>
            </table>
          </div>
        </div>
        ${isAdmin ? `
          <div class="card-footer text-end">
            <button class="btn btn-success" id="add-staff-btn">
              <i class="bi bi-plus-lg me-1"></i> Add New Staff Member
            </button>
          </div>
        ` : ''}
      </div>
    `;
  },
  
  // Report Issue
  renderReportForm() {
    const assets = AssetService.getAssets().filter(a => a.status === 'Assigned');
    const userReports = AssetService.getUserReports(AuthService.currentUser?.id || '');

    const assetOptions = assets.map(asset => 
      `<option value="${asset.id}">${asset.type} #${asset.id} (${asset.model})</option>`
    ).join('');

    const reportRows = userReports.map(report => `
      <tr>
        <td>${report.date}</td>
        <td>${report.assetId}</td>
        <td>${report.description}</td>
        <td>
          <span class="badge ${report.status === 'open' ? 'bg-warning' : 'bg-success'}">
            ${report.status}
          </span>
        </td>
      </tr>
    `).join('');

    return `
      <div class="card mb-4">
        <div class="card-header">
          <i class="bi bi-clipboard-data me-2"></i>Report Asset Issue
        </div>
        <div class="card-body">
          <form id="report-form">
            <div class="mb-3">
              <label for="asset-select" class="form-label">Select Asset</label>
              <select class="form-select" id="asset-select" required>
                <option value="" selected disabled>Choose asset...</option>
                ${assetOptions}
              </select>
            </div>
            <div class="mb-3">
              <label for="issue-type" class="form-label">Issue Type</label>
              <select class="form-select" id="issue-type" required>
                <option value="" selected disabled>Select issue type...</option>
                <option value="hardware">Hardware Failure</option>
                <option value="software">Software Problem</option>
                <option value="physical">Physical Damage</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="issue-description" class="form-label">Description</label>
              <textarea class="form-control" id="issue-description" rows="3" required 
                placeholder="Describe the issue in detail..."></textarea>
            </div>
            <div class="mb-3 form-check">
              <input type="checkbox" class="form-check-input" id="urgent-check">
              <label class="form-check-label" for="urgent-check">Mark as urgent</label>
            </div>
            <button type="submit" class="btn btn-primary">
              <i class="bi bi-send-fill me-1"></i> Submit Report
            </button>
          </form>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <i class="bi bi-list-check me-2"></i>Your Recent Reports
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Asset</th>
                  <th>Issue</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${reportRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
};

// MAIN WEB CONTROLLER
const AssetManagementApp = {
  init() {
    this.setupEventListeners();
    this.checkAuthentication();
    this.populateStaffTable();
  },

  checkAuthentication() {
    if (!AuthService.checkAuth()) {
      this.showLoginPage();
    } else {
      this.showMainApp();
      this.showSection('dashboard');
    }
  },

  showLoginPage() {
    document.body.innerHTML = UIComponents.renderLoginPage();
    this.setupLoginEvents();
    
    // Auto-fill remembered credentials
    const remembered = AuthService.getRememberedCredentials();
    if (remembered.name && remembered.id) {
      document.getElementById('employeeName').value = remembered.name;
      document.getElementById('employeeId').value = remembered.id;
      document.getElementById('rememberMe').checked = true;
    }
  },

  populateStaffTable(employees = AppData.employees) {
    const tbody = document.getElementById('staffTableBody');
    if (!tbody) return;
  
    const isAdmin = AuthService.currentUser?.role === 'Admin';
    
    tbody.innerHTML = employees.map(staff => `
      <tr data-staff-id="${staff.id}">
        <td>${staff.id}</td>
        <td>${staff.position.replace(/_/g, ' ')}</td>
        <td>${this.getStatusBadge(staff.status)}</td>
        <td>${staff.name}</td>
        ${isAdmin ? `
          <td>
            <button class="btn btn-sm btn-outline-danger remove-staff" 
                    data-id="${staff.id}" title="Remove staff">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        ` : ''}
      </tr>
    `).join('');
    
    // Add no-results message if empty
    if (employees.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="${isAdmin ? 5 : 4}" class="text-center text-muted py-4">
            No staff members found
          </td>
        </tr>
      `;
    }
  },
  
  showMainApp() {
    document.body.innerHTML = `
      <div class="container-fluid">
        <div class="row">
          <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
  <div class="container-fluid">
    <img src="zt/ntlogob.jpg" alt="company-logo0" class="navbar-logo">
    <a class="navbar-brand" href="#">NTHUNGULULU MEDIA</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" href="#" id="dashboard-link">
            <i class="bi bi-speedometer2 me-1"></i>Dashboard
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" id="assets-link">
            <i class="bi bi-laptop me-1"></i>Assets
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" id="report-link">
            <i class="bi bi-clipboard-data me-1"></i>Report
          </a>
        </li>
        <li class="nav-item dropdown ms-lg-auto">
          <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown">
            <i class="bi bi-person-circle me-1"></i>User
          </a>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><span class="dropdown-item disabled">Logged in as <strong id="username-display">User</strong></span></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" id="logout-link"><i class="bi bi-box-arrow-right me-1"></i>Logout</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
          <main class="container-fluid mt-3">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 class="h2" id="page-title">Dashboard</h1>
              <div class="btn-toolbar mb-2 mb-md-0">
                <div class="btn-group me-2">
                  
                  <button class="btn btn-sm btn-outline-secondary" id="staff-link">

                    <i class="bi bi-person-circle me-1"></i> 
                    ${AuthService.currentUser.name} (${AuthService.currentUser.role})  </button>
                  
                </div>
              </div>
            </div>
            <div id="app-content"></div>
          </main>
        </div>
      </div>
    `;
  },

  showAssetDetails(assetId) {
    const asset = AppData.assets.find(a => a.id === assetId);
    const defaultImage = 'default-asset.jpg';
    
    const modalContent = `
      <div class="modal fade" id="assetDetailsModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${asset.type}: ${asset.model}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6 text-center">
                  <img src="${asset.image || defaultImage}" 
                       alt="${asset.model}"
                       class="img-fluid rounded"
                       style="max-height: 300px;"
                       onerror="this.onerror=null;this.src='${defaultImage}'">
                </div>
                <div class="col-md-6">
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item"><strong>Asset ID:</strong> ${asset.id}</li>
                    <li class="list-group-item"><strong>Status:</strong> 
                      <span class="badge ${asset.status === 'Available' ? 'bg-success' : 'bg-primary'}">
                        ${asset.status}
                      </span>
                    </li>
                    <li class="list-group-item"><strong>Assigned To:</strong> ${asset.assignedTo || 'None'}</li>
                    <li class="list-group-item"><strong>Last Maintenance:</strong> 02-04-2025</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">View Full History</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // showing the modal
    document.body.insertAdjacentHTML('beforeend', modalContent);
    const modal = new bootstrap.Modal(document.getElementById('assetDetailsModal'));
    modal.show();
    
    // Removing modal from DOM after it's closed
    document.getElementById('assetDetailsModal').addEventListener('hidden.bs.modal', () => {
      document.getElementById('assetDetailsModal').remove();
    });
  },

  showReportFormWithAsset(assetId) {
    this.showSection('report');
    // Pre selecting kaya zanu izo kusankhilatu the asset in the report form
    const select = document.getElementById('asset-select');
    if (select) {
      select.value = assetId;
    }
  },

  showSection(section) {
    if (!AuthService.currentUser) return;

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.getElementById(`${section}-link`).classList.add('active');

    // Update page title
    const titles = {
      dashboard: 'Dashboard',
      assets: 'Assets List',
      report: 'Report Issue',
      staff: 'Staff List'
    };
    document.getElementById('page-title').textContent = titles[section];

    // Render content
    const contentDiv = document.getElementById('app-content');
    switch(section) {
      case 'dashboard':
        contentDiv.innerHTML = UIComponents.renderDashboard();
        break;
      case 'assets':
        contentDiv.innerHTML = UIComponents.renderAssetsList();
        this.setupAssetSearch();
        break;
      case 'report':
        contentDiv.innerHTML = UIComponents.renderReportForm();
        this.setupReportForm();
        break;
      case 'staff' :
        contentDiv.innerHTML = UIComponents.renderStaffList();
        this.populateStaffTable();
        this.setupStaffSearch();
        break;
    }
  },

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.id === 'dashboard-link' || e.target.closest('#dashboard-link')) {
        e.preventDefault();
        this.showSection('dashboard');
      }
      else if (e.target.id === 'assets-link' || e.target.closest('#assets-link')) {
        e.preventDefault();
        this.showSection('assets');
      }
      else if (e.target.id === 'report-link' || e.target.closest('#report-link')) {
        e.preventDefault();
        this.showSection('report');
      }
      else if (e.target.id === 'logout-link' || e.target.closest('#logout-link')) {
        e.preventDefault();
        this.logout();
      }
      
      else if (e.target.id === 'staff-link' || e.target.closest('#staff-link')) {
        e.preventDefault();
        this.showSection('staff');
        document.getElementById('staff-content').classList.remove('d-none');
      }
      
    });
    
  },

  setupLoginEvents() {
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('employeeName').value.trim();
      const id = document.getElementById('employeeId').value.trim();
      const remember = document.getElementById('rememberMe').checked;

      if (!name || !id) {
        alert('Please enter both your name and ID number');
        return;
      }

      if (AuthService.login(name, id, remember)) {
        this.showMainApp();
        this.showSection('dashboard');
      } else {
        alert('Invalid credentials. Please try again.');
      }
    });
  },

  setupAssetSearch() {
    // Ensure search elements exist
    if (!document.getElementById('asset-search-container')) {
      const searchHtml = `
        <div class="input-group" style="width: 300px;" id="asset-search-container">
          <input type="text" class="form-control" placeholder="Search assets..." id="asset-search">
          <button class="btn btn-outline-secondary" type="button" id="search-btn">
            <i class="bi bi-search"></i>
          </button>
        </div>
      `;
      
      const cardHeader = document.querySelector('#app-content .card-header');
      if (cardHeader) {
        cardHeader.insertAdjacentHTML('beforeend', searchHtml);
      }
    }
  
    // Setup event listeners
    const searchInput = document.getElementById('asset-search');
    const searchBtn = document.getElementById('search-btn');
  
    if (searchInput && searchBtn) {
      const performSearch = () => {
        const query = searchInput.value.trim().toLowerCase();
        const results = query ? 
          AppData.assets.filter(assets => 
            assets.id.toLowerCase().includes(query) ||
            assets.type.toLowerCase().includes(query) ||
            assets.model.toLowerCase().includes(query) ||
            assets.status.toLowerCase().includes(query) ||
            (assets.assignedTo && assets.assignedTo.toLowerCase().includes(query))
          ) : AppData.assets;
        
        this.renderAssetTable(results);
      };
  
      searchInput.addEventListener('input', performSearch);
      searchBtn.addEventListener('click', performSearch);
    }
  },
  
  renderAssetTable(assets) {
    const tbody = document.querySelector('#app-content table tbody');
    if (tbody) {
      tbody.innerHTML = assets.map(asset => `
        <tr data-asset-id="${asset.id}">
          <td>${asset.id}</td>
          <td>${asset.type}</td>
          <td>${asset.model}</td>
          <td>
            ${asset.status === 'Available' ? 
              '<span class="badge bg-success">Available</span>' : 
              '<span class="badge bg-primary">Assigned</span>'}
          </td>
          <td>${asset.assignedTo || '-'}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary view-asset" data-id="${asset.id}">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn btn-sm btn-outline-secondary report-asset" data-id="${asset.id}">
              <i class="bi bi-exclamation-triangle"></i>
            </button>
            ${AuthService.currentUser?.role === 'Admin' ? `
              <button class="btn btn-sm btn-outline-danger remove-asset" data-id="${asset.id}">
                <i class="bi bi-trash"></i>
              </button>
            ` : ''}
          </td>
        </tr>
      `).join('');
    }
  },
  
  setupStaffSearch() {
    const staffSearch = document.getElementById('staff-search');
    const staffSearchBtn = document.getElementById('staff-search-btn');
  
    // Verify elements exist
    if (!staffSearch || !staffSearchBtn) {
      console.error("Staff search elements not found!");
      return;
    }
  
    const performSearch = () => {
      // Show loading state
      const originalBtnContent = staffSearchBtn.innerHTML;
      staffSearchBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
      staffSearchBtn.disabled = true;
  
      const query = staffSearch.value.trim().toLowerCase();
      
      try {
        // Filter staff based on search query
        const results = query ? 
          AppData.employees.filter(staff => 
            (staff.id && staff.id.toLowerCase().includes(query)) ||
            (staff.position && staff.position.toLowerCase().includes(query)) ||
            (staff.status && staff.status.toLowerCase().includes(query)) ||
            (staff.name && staff.name.toLowerCase().includes(query))
          ) : AppData.employees;
        
        // Update the table
        this.populateStaffTable(results);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        // Reset button state
        staffSearchBtn.innerHTML = originalBtnContent;
        staffSearchBtn.disabled = false;
      }
    };
    // Add event listeners
    staffSearch.addEventListener('input', performSearch);
    staffSearchBtn.addEventListener('click', performSearch);
    
    // Optional: Add debounce for better performance
    staffSearch.addEventListener('input', this.debounce(performSearch, 300));
  },
  
  logout() {
    if (confirm('Are you sure you want to logout?')) {
      AuthService.logout();
      this.showLoginPage();
    }
  },
  setupAssetManagement() {
    // Add Asset button
    document.addEventListener('click', (e) => {
      if (e.target.closest('#add-asset-btn')) {
        e.preventDefault();
        this.showAddAssetModal();
      }
      
      if (e.target.closest('.remove-asset')) {
        e.preventDefault();
        const assetId = e.target.closest('button').dataset.id;
        this.handleRemoveAsset(assetId);
      }
      if (e.target.closest('.view-asset')) {
        e.preventDefault();
        const assetId = e.target.closest('button').dataset.id;
        this.showAssetDetails(assetId);
      }
      if (e.target.closest('.report-asset')) {
        e.preventDefault();
        const assetId = e.target.closest('button').dataset.id;
        this.renderReportForm();
      }
    });
  },

  showAddAssetModal() {
    const modalContent = `
      <div class="modal fade" id="addAssetModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add New Asset</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="add-asset-form">
                <div class="mb-3">
                  <label for="asset-id" class="form-label">Asset ID</label>
                  <input type="text" class="form-control" id="asset-id" required>
                </div>
                <div class="mb-3">
                  <label for="asset-type" class="form-label">Type</label>
                  <select class="form-select" id="asset-type" required>
                    <option value="">Select type...</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Keyboard">Keyboard</option>
                    <option value="Mouse">Mouse</option>
                    <option value="Drone">Drone</option>
                    <option value="Dock">Dock</option>
                    <option value="Headphones">Headphones</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="asset-model" class="form-label">Model</label>
                  <input type="text" class="form-control" id="asset-model" required>
                </div>
                <div class="mb-3">
                  <label for="asset-image" class="form-label">Image URL (optional)</label>
                  <input type="text" class="form-control" id="asset-image">
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="confirm-add-asset">Add Asset</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
    const modal = new bootstrap.Modal(document.getElementById('addAssetModal'));
    modal.show();
    
    //form submission
    document.getElementById('confirm-add-asset').addEventListener('click', () => {
      this.handleAddAsset();
    });
    
    // Clean up modal after close
    document.getElementById('addAssetModal').addEventListener('hidden.bs.modal', () => {
      document.getElementById('addAssetModal').remove();
    });
  },

  handleAddAsset() {
    const id = document.getElementById('asset-id').value.trim();
    const type = document.getElementById('asset-type').value;
    const model = document.getElementById('asset-model').value.trim();
    const image = document.getElementById('asset-image').value.trim();
    
    if (!id || !type || !model) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newAsset = {
      id,
      type,
      model,
      status: 'Available',
      assignedTo: '',
      image: image || null
    };
    
    const result = AssetService.addAsset(newAsset);
    const modal = bootstrap.Modal.getInstance(document.getElementById('addAssetModal'));
    
    if (result.success) {
      modal.hide(); // Properly hide the modal first
      modal._element.addEventListener('hidden.bs.modal', () => {
        modal.dispose(); // Clean up the modal instance
        document.getElementById('addAssetModal').remove(); // Remove from DOM
        this.showSection('assets'); // Refresh the view
      });
    } else {
      alert(result.message);
    }
  },

  handleRemoveAsset(assetId) {
    if (!confirm('Are you sure you want to remove this asset?')) return;
    
    const result = AssetService.removeAsset(assetId);
    if (result.success) {
      alert(result.message);
      this.showSection('assets'); // Refresh the view
    } else {
      alert(result.message);
    }
  },

  setupStaffManagement() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('#add-staff-btn')) {
        e.preventDefault();
        this.showAddStaffModal();
      }
      
      if (e.target.closest('.remove-staff')) {
        e.preventDefault();
        const staffId = e.target.closest('button').dataset.id;
        this.handleRemoveStaff(staffId);
      }
    });
  },
  
  showAddStaffModal() {
    const modalContent = `
      <div class="modal fade" id="addStaffModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add New Staff Member</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="add-staff-form">
                <div class="mb-3">
                  <label for="staff-id" class="form-label">Staff ID</label>
                  <input type="text" class="form-control" id="staff-id" required>
                </div>
                <div class="mb-3">
                  <label for="staff-name" class="form-label">Full Name</label>
                  <input type="text" class="form-control" id="staff-name" required>
                </div>
                <div class="mb-3">
                  <label for="staff-position" class="form-label">Position</label>
                  <input type="text" class="form-control" id="staff-position" required>
                </div>
                <div class="mb-3">
                  <label for="staff-status" class="form-label">Status</label>
                  <select class="form-select" id="staff-status" required>
                    <option value="Available">Available</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Medical_Leave">Medical Leave</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="staff-role" class="form-label">Role</label>
                  <select class="form-select" id="staff-role" required>
                    <option value="User">Regular User</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="confirm-add-staff">Add Staff</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
    const modal = new bootstrap.Modal(document.getElementById('addStaffModal'));
    modal.show();
    
    document.getElementById('confirm-add-staff').addEventListener('click', () => {
      this.handleAddStaff();
    });
    
    document.getElementById('addStaffModal').addEventListener('hidden.bs.modal', () => {
      modal.dispose();
      document.getElementById('addStaffModal').remove();
    });
  },
  
  handleAddStaff() {
    const id = document.getElementById('staff-id').value.trim();
    const name = document.getElementById('staff-name').value.trim();
    const position = document.getElementById('staff-position').value.trim();
    const status = document.getElementById('staff-status').value;
    const role = document.getElementById('staff-role').value;
    
    if (!id || !name || !position) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Check if staff ID already exists
    if (AppData.employees.some(emp => emp.id === id)) {
      alert('Staff ID already exists');
      return;
    }
    
    const newStaff = {
      id,
      name,
      position,
      status,
      role
    };
    
    AppData.employees.push(newStaff);
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('addStaffModal'));
    modal.hide();
    
    this.showSection('staff'); // Refresh the view
  },
  
  handleRemoveStaff(staffId) {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    
    const index = AppData.employees.findIndex(emp => emp.id === staffId);
    if (index === -1) {
      alert('Staff member not found');
      return;
    }
    
    // Prevent removing yourself
    if (staffId === AuthService.currentUser.id) {
      alert('You cannot remove your own account');
      return;
    }
    
    AppData.employees.splice(index, 1);
    this.showSection('staff'); 
  },

  getStatusBadge(status) {
    const badgeClasses = {
      'Available': 'bg-success',
      'Dismissed': 'bg-secondary',
      'Medical_Leave': 'bg-info',
      'Holiday': 'bg-primary',
      'Suspended': 'bg-warning',
      'Fired': 'bg-dark'
    };
    const displayStatus = status.replace('_', ' ');
    return `<span class="badge ${badgeClasses[status] || 'bg-light'}">${displayStatus}</span>`;
  },
  
  init() {
    this.setupEventListeners();
    this.setupAssetManagement(); // Add this line
    this.checkAuthentication();
    this.setupStaffManagement();
  }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => AssetManagementApp.init());