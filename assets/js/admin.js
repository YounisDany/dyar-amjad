// Admin Panel JavaScript

// Admin credentials (في التطبيق الحقيقي، يجب أن تكون هذه البيانات محمية في قاعدة البيانات)
const adminCredentials = {
    username: 'admin',
    password: 'diyar2024'
};

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        showDashboard();
    }
    
    // Setup login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validate credentials
    if (username === adminCredentials.username && password === adminCredentials.password) {
        // Successful login
        if (rememberMe) {
            localStorage.setItem('adminLoggedIn', 'true');
        } else {
            sessionStorage.setItem('adminLoggedIn', 'true');
        }
        
        showSuccessMessage('تم تسجيل الدخول بنجاح');
        setTimeout(showDashboard, 1500);
    } else {
        // Failed login
        showErrorMessage('اسم المستخدم أو كلمة المرور غير صحيحة');
        shakeLoginForm();
    }
}

// Show dashboard and hide login
function showDashboard() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
    
    // Initialize dashboard animations
    AOS.refresh();
    
    // Load dashboard data
    loadDashboardData();
}

// Hide dashboard and show login
function showLogin() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('dashboardSection').style.display = 'none';
    
    // Clear form
    document.getElementById('loginForm').reset();
}

// Logout function
function logout() {
    localStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminLoggedIn');
    showLogin();
    showSuccessMessage('تم تسجيل الخروج بنجاح');
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleBtn.className = 'fas fa-eye';
    }
}

// Shake login form on error
function shakeLoginForm() {
    const loginCard = document.querySelector('.login-card');
    loginCard.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        loginCard.style.animation = '';
    }, 500);
}

// Show success message
function showSuccessMessage(message) {
    showNotification(message, 'success');
}

// Show error message
function showErrorMessage(message) {
    showNotification(message, 'error');
}

// Show notification
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Load dashboard data
function loadDashboardData() {
    // Simulate loading data
    updateStats();
    loadRecentActivity();
}

// Update dashboard statistics
function updateStats() {
    // This would normally fetch data from an API
    const stats = {
        activeProjects: 25,
        clients: 150,
        certificates: 12,
        newMessages: 8
    };
    
    // Update stat cards with animation
    animateCounter('.stat-card:nth-child(1) h3', stats.activeProjects);
    animateCounter('.stat-card:nth-child(2) h3', stats.clients, '+');
    animateCounter('.stat-card:nth-child(3) h3', stats.certificates);
    animateCounter('.stat-card:nth-child(4) h3', stats.newMessages);
}

// Animate counter
function animateCounter(selector, target, suffix = '') {
    const element = document.querySelector(selector);
    if (!element) return;
    
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 30);
}

// Load recent activity
function loadRecentActivity() {
    // This would normally fetch data from an API
    const activities = [
        {
            icon: 'fas fa-plus-circle',
            text: 'تم إضافة مشروع جديد: مجمع الرياض التجاري',
            time: 'منذ ساعتين'
        },
        {
            icon: 'fas fa-envelope',
            text: 'رسالة جديدة من العميل: شركة البناء المتطور',
            time: 'منذ 4 ساعات'
        },
        {
            icon: 'fas fa-edit',
            text: 'تم تحديث معلومات مشروع: فيلا الأمير',
            time: 'أمس'
        }
    ];
    
    // Activities are already in HTML, this is just for demonstration
}

// Dashboard menu functions
function openProjectsManager() {
    showNotification('سيتم فتح إدارة المشاريع قريباً', 'info');
}

function openClientsManager() {
    showNotification('سيتم فتح إدارة العملاء قريباً', 'info');
}

function openMessagesManager() {
    showNotification('سيتم فتح إدارة الرسائل قريباً', 'info');
}

function openContentManager() {
    showNotification('سيتم فتح إدارة المحتوى قريباً', 'info');
}

function openCertificatesManager() {
    showNotification('سيتم فتح إدارة الشهادات قريباً', 'info');
}

function openSettingsManager() {
    showNotification('سيتم فتح الإعدادات قريباً', 'info');
}

// Quick actions
function addNewProject() {
    showNotification('سيتم فتح نموذج إضافة مشروع جديد قريباً', 'info');
}

function viewMessages() {
    showNotification('سيتم فتح صندوق الرسائل قريباً', 'info');
}

function generateReport() {
    showNotification('جاري إنشاء التقرير الشهري...', 'info');
    setTimeout(() => {
        showNotification('تم إنشاء التقرير بنجاح', 'success');
    }, 2000);
}

function backupData() {
    showNotification('جاري إنشاء النسخة الاحتياطية...', 'info');
    setTimeout(() => {
        showNotification('تم إنشاء النسخة الاحتياطية بنجاح', 'success');
    }, 3000);
}

// Add CSS for shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        min-width: 300px;
        animation: slideIn 0.3s ease;
    }
    
    .notification.success {
        border-left: 4px solid #28a745;
        color: #28a745;
    }
    
    .notification.error {
        border-left: 4px solid #dc3545;
        color: #dc3545;
    }
    
    .notification.info {
        border-left: 4px solid #17a2b8;
        color: #17a2b8;
    }
    
    .notification button {
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        margin-left: auto;
        padding: 5px;
    }
    
    .notification button:hover {
        color: #666;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

