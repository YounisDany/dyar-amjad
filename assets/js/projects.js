// Projects JavaScript with Google Sheets Integration

// Google Sheets Configuration
const GOOGLE_SHEETS_CONFIG = {
    // Replace with your Google Sheets CSV URL
    // Example: 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv&gid=0'
    csvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2wpwrHzYACcyEl83Xfdmf7QQx3yIAdYkQtceeOFkQtR9dVI4zh_mim4Bep37fG7iio1xYo_B-8cAU/pub?output=csv', // Add your Google Sheets CSV URL here
    enabled: true // Set to true when you have configured the CSV URL
};

// Project data fallback (used when Google Sheets is not configured)
const fallbackProjects = [
    {
        id: 'project1',
        nameAr: 'مجمع سكني فاخر',
        nameEn: 'Luxury Residential Complex',
        descriptionAr: 'مجمع سكني متكامل يضم 200 وحدة سكنية مع مرافق ترفيهية وخدمية متنوعة',
        descriptionEn: 'Integrated residential complex with 200 housing units and various recreational and service facilities',
        locationAr: 'الرياض، المملكة العربية السعودية',
        locationEn: 'Riyadh, Saudi Arabia',
        category: 'residential',
        status: 'completed',
        area: '50,000 م²',
        duration: '24 شهر',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        startDate: '2022-01-01',
        endDate: '2023-12-31'
    },
    {
        id: 'project2',
        nameAr: 'مركز تجاري حديث',
        nameEn: 'Modern Shopping Center',
        descriptionAr: 'مركز تجاري عصري يضم محلات تجارية ومطاعم ومرافق ترفيهية على أحدث طراز',
        descriptionEn: 'Modern shopping center with retail stores, restaurants, and entertainment facilities in the latest style',
        locationAr: 'جدة، المملكة العربية السعودية',
        locationEn: 'Jeddah, Saudi Arabia',
        category: 'commercial',
        status: 'ongoing',
        area: '75,000 م²',
        duration: '30 شهر',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        startDate: '2023-06-01',
        endDate: '2025-12-31'
    },
    {
        id: 'project3',
        nameAr: 'مصنع متطور',
        nameEn: 'Advanced Factory',
        descriptionAr: 'مصنع حديث للصناعات الغذائية مجهز بأحدث التقنيات ومعايير السلامة العالمية',
        descriptionEn: 'Modern food industry factory equipped with the latest technologies and international safety standards',
        locationAr: 'الدمام، المملكة العربية السعودية',
        locationEn: 'Dammam, Saudi Arabia',
        category: 'industrial',
        status: 'completed',
        area: '30,000 م²',
        duration: '18 شهر',
        imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        startDate: '2021-03-01',
        endDate: '2022-09-30'
    },
    {
        id: 'project4',
        nameAr: 'مشروع طرق حيوي',
        nameEn: 'Vital Road Project',
        descriptionAr: 'تطوير شبكة طرق حيوية تربط المناطق الرئيسية مع تحسين البنية التحتية',
        descriptionEn: 'Development of vital road network connecting main areas with infrastructure improvement',
        locationAr: 'مكة المكرمة، المملكة العربية السعودية',
        locationEn: 'Makkah, Saudi Arabia',
        category: 'infrastructure',
        status: 'ongoing',
        area: '25 كم',
        duration: '36 شهر',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        startDate: '2023-01-01',
        endDate: '2026-01-01'
    }
];

// Global variables
let allProjects = [];
let currentLanguage = 'ar';

// Initialize projects when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeProjects();
    setupFilterButtons();
    setupLanguageToggle();
});

// Initialize projects
async function initializeProjects() {
    try {
        if (GOOGLE_SHEETS_CONFIG.enabled && GOOGLE_SHEETS_CONFIG.csvUrl) {
            // Try to load from Google Sheets
            await loadProjectsFromGoogleSheets();
        } else {
            // Use fallback projects
            allProjects = fallbackProjects;
            displayProjects(allProjects);
            hideLoadingIndicator();
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        // Fallback to static projects
        allProjects = fallbackProjects;
        displayProjects(allProjects);
        hideLoadingIndicator();
    }
}

// Load projects from Google Sheets
async function loadProjectsFromGoogleSheets() {
    try {
        const response = await fetch(GOOGLE_SHEETS_CONFIG.csvUrl);
        const csvText = await response.text();
        const projects = parseCSVToProjects(csvText);
        
        if (projects.length > 0) {
            allProjects = projects;
            displayProjects(allProjects);
        } else {
            throw new Error('No projects found in Google Sheets');
        }
        
        hideLoadingIndicator();
    } catch (error) {
        console.error('Error loading from Google Sheets:', error);
        throw error;
    }
}

// Parse CSV data to projects array
function parseCSVToProjects(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(header => header.trim());
    const projects = [];
    
    // Create column mapping based on your exact headers
    const columnMap = {
        timestamp: headers.indexOf('طابع زمني'),
        nameAr: headers.indexOf('اسم المشروع'),
        nameEn: headers.indexOf('اسم المشروع (إنجليزي)'),
        descriptionAr: headers.indexOf('الوصف'),
        descriptionEn: headers.indexOf('الوصف (إنجليزي)'),
        locationAr: headers.indexOf('الموقع'),
        locationEn: headers.indexOf('الموقع (انجليزي)'),
        category: headers.indexOf('النوع'),
        status: headers.indexOf('الحالة'),
        area: headers.indexOf('المساحة'),
        duration: headers.indexOf('المدة'),
        imageUrl: headers.indexOf('الصورة'),
        startDate: headers.indexOf('تاريخ البداية'),
        endDate: headers.indexOf('تاريخ الانتهاء')
    };
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(val => val.trim());
        
        const project = {
            id: `project_${i}_${values[columnMap.timestamp] || Date.now()}`,
            nameAr: values[columnMap.nameAr] || '',
            nameEn: values[columnMap.nameEn] || values[columnMap.nameAr] || '',
            descriptionAr: values[columnMap.descriptionAr] || '',
            descriptionEn: values[columnMap.descriptionEn] || values[columnMap.descriptionAr] || '',
            locationAr: values[columnMap.locationAr] || '',
            locationEn: values[columnMap.locationEn] || values[columnMap.locationAr] || '',
            category: (values[columnMap.category] || 'general').toLowerCase(),
            status: (values[columnMap.status] || 'completed').toLowerCase(),
            area: values[columnMap.area] || '',
            duration: values[columnMap.duration] || '',
            imageUrl: values[columnMap.imageUrl] || 'https://via.placeholder.com/800x600?text=No+Image',
            startDate: values[columnMap.startDate] || '',
            endDate: values[columnMap.endDate] || '',
            timestamp: values[columnMap.timestamp] || ''
        };
        
        projects.push(project);
    }
    
    // Sort by timestamp (newest first) if available, otherwise by start date
    projects.sort((a, b) => {
        if (a.timestamp && b.timestamp) {
            return new Date(b.timestamp) - new Date(a.timestamp);
        }
        return new Date(b.startDate) - new Date(a.startDate);
    });
    
    return projects;
}

// Display projects in the grid
function displayProjects(projects) {
    const projectsGrid = document.getElementById('projects-grid');
    const fallbackGrid = document.getElementById('fallback-projects');
    
    if (projects === fallbackProjects) {
        // Show fallback grid
        projectsGrid.style.display = 'none';
        fallbackGrid.style.display = 'grid';
        return;
    }
    
    // Clear existing content
    projectsGrid.innerHTML = '';
    
    if (projects.length === 0) {
        projectsGrid.innerHTML = `
            <div class="no-projects">
                <i class="fas fa-folder-open"></i>
                <p data-ar="لا توجد مشاريع متاحة" data-en="No projects available">لا توجد مشاريع متاحة</p>
            </div>
        `;
        return;
    }
    
    projects.forEach((project, index) => {
        const projectCard = createProjectCard(project, index);
        projectsGrid.appendChild(projectCard);
    });
    
    // Re-initialize AOS for new elements
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Create project card element
function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-category', `${project.category} ${project.status}`);
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', (index % 4 + 1) * 100);
    
    const statusText = project.status === 'completed' ? 
        (currentLanguage === 'ar' ? 'مكتمل' : 'Completed') : 
        (currentLanguage === 'ar' ? 'جاري' : 'Ongoing');
    
    const projectName = currentLanguage === 'ar' ? project.nameAr : project.nameEn;
    const projectDescription = currentLanguage === 'ar' ? project.descriptionAr : project.descriptionEn;
    const projectLocation = currentLanguage === 'ar' ? project.locationAr : project.locationEn;
    
    card.innerHTML = `
        <div class="project-image">
            <img src="${project.imageUrl}" alt="${projectName}" loading="lazy">
            <div class="project-overlay">
                <div class="project-status ${project.status}">${statusText}</div>
                <div class="project-actions">
                    <button class="view-project" onclick="openProjectModal('${project.id}')" 
                            data-ar="عرض التفاصيل" data-en="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="project-info">
            <h3>${projectName}</h3>
            <p class="project-location">${projectLocation}</p>
            <p class="project-description">${projectDescription}</p>
            <div class="project-meta">
                <span class="project-area" data-ar="المساحة: ${project.area}" data-en="Area: ${project.area}">
                    ${currentLanguage === 'ar' ? 'المساحة: ' : 'Area: '}${project.area}
                </span>
                <span class="project-duration" data-ar="المدة: ${project.duration}" data-en="Duration: ${project.duration}">
                    ${currentLanguage === 'ar' ? 'المدة: ' : 'Duration: '}${project.duration}
                </span>
            </div>
        </div>
    `;
    
    return card;
}

// Setup filter buttons
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterProjects(filter);
        });
    });
}

// Filter projects
function filterProjects(filter) {
    let filteredProjects;
    
    if (filter === 'all') {
        filteredProjects = allProjects;
    } else {
        filteredProjects = allProjects.filter(project => 
            project.category === filter || project.status === filter
        );
    }
    
    // Animate out current projects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
        }, index * 50);
    });
    
    // Display filtered projects after animation
    setTimeout(() => {
        displayProjects(filteredProjects);
        
        // Animate in new projects
        const newProjectCards = document.querySelectorAll('.project-card');
        newProjectCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 300);
}

// Open project modal
function openProjectModal(projectId) {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;
    
    const modal = document.getElementById('projectModal');
    const modalContent = document.getElementById('modalProjectContent');
    
    const projectName = currentLanguage === 'ar' ? project.nameAr : project.nameEn;
    const projectDescription = currentLanguage === 'ar' ? project.descriptionAr : project.descriptionEn;
    const projectLocation = currentLanguage === 'ar' ? project.locationAr : project.locationEn;
    
    const statusText = project.status === 'completed' ? 
        (currentLanguage === 'ar' ? 'مكتمل' : 'Completed') : 
        (currentLanguage === 'ar' ? 'جاري' : 'Ongoing');
    
    modalContent.innerHTML = `
        <div class="project-modal-header">
            <div class="project-modal-image">
                <img src="${project.imageUrl}" alt="${projectName}">
                <div class="project-status-badge ${project.status}">${statusText}</div>
            </div>
            <div class="project-modal-info">
                <h2>${projectName}</h2>
                <p class="modal-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${projectLocation}
                </p>
                <div class="project-modal-meta">
                    <div class="meta-item">
                        <i class="fas fa-ruler-combined"></i>
                        <span>${currentLanguage === 'ar' ? 'المساحة' : 'Area'}: ${project.area}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${currentLanguage === 'ar' ? 'المدة' : 'Duration'}: ${project.duration}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${currentLanguage === 'ar' ? 'البداية' : 'Start'}: ${project.startDate}</span>
                    </div>
                    ${project.endDate ? `
                    <div class="meta-item">
                        <i class="fas fa-calendar-check"></i>
                        <span>${currentLanguage === 'ar' ? 'الانتهاء' : 'End'}: ${project.endDate}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
        <div class="project-modal-description">
            <h3 data-ar="وصف المشروع" data-en="Project Description">
                ${currentLanguage === 'ar' ? 'وصف المشروع' : 'Project Description'}
            </h3>
            <p>${projectDescription}</p>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close project modal
function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Hide loading indicator
function hideLoadingIndicator() {
    const loadingIndicator = document.querySelector('.loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

// Setup language toggle for projects page
function setupLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', function() {
            currentLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
            updateLanguageContent();
            displayProjects(allProjects);
        });
    }
}

// Update language content
function updateLanguageContent() {
    const elements = document.querySelectorAll('[data-ar][data-en]');
    elements.forEach(element => {
        const arText = element.getAttribute('data-ar');
        const enText = element.getAttribute('data-en');
        element.textContent = currentLanguage === 'ar' ? arText : enText;
    });
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('projectModal');
    if (event.target === modal) {
        closeProjectModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeProjectModal();
    }
});

// Export functions for global access
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;

