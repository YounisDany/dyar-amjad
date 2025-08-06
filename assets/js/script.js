// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Language Toggle Functionality
let currentLang = 'ar';

document.addEventListener('DOMContentLoaded', function() {
    const langToggle = document.getElementById('langToggle');
    const langText = document.getElementById('langText');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const header = document.getElementById('header');

    // Language Toggle
    if (langToggle) {
        langToggle.addEventListener('click', function() {
            currentLang = currentLang === 'ar' ? 'en' : 'ar';
            toggleLanguage();
        });
    }

    // Mobile Menu Toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Header Scroll Effect
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !phone || !message) {
                alert(currentLang === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
                return;
            }
            
            // Here you would typically send the data to a server
            alert(currentLang === 'ar' ? 'تم إرسال رسالتك بنجاح!' : 'Your message has been sent successfully!');
            this.reset();
        });
    }

    // Project Filter Functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all' || card.classList.contains(filter)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Counter Animation
    const counters = document.querySelectorAll('.stat-number');
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current) + (counter.textContent.includes('+') ? '+' : '');
                    setTimeout(updateCounter, 20);
                } else {
                    counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
                }
            };
            
            updateCounter();
        });
    };

    // Intersection Observer for counter animation
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('.statistics, .overview-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }

    // Load projects from Google Sheets (placeholder function)
    loadProjectsFromGoogleSheets();
});

// Language Toggle Function
function toggleLanguage() {
    const body = document.body;
    const langText = document.getElementById('langText');
    const html = document.documentElement;
    
    if (currentLang === 'en') {
        body.classList.add('en');
        body.classList.remove('ar');
        html.setAttribute('lang', 'en');
        html.setAttribute('dir', 'ltr');
        if (langText) langText.textContent = 'العربية';
    } else {
        body.classList.add('ar');
        body.classList.remove('en');
        html.setAttribute('lang', 'ar');
        html.setAttribute('dir', 'rtl');
        if (langText) langText.textContent = 'English';
    }
    
    // Update all text elements
    updateTextContent();
}

// Update Text Content Based on Language
function updateTextContent() {
    const elements = document.querySelectorAll('[data-ar][data-en]');
    
    elements.forEach(element => {
        const arText = element.getAttribute('data-ar');
        const enText = element.getAttribute('data-en');
        
        if (currentLang === 'ar') {
            element.textContent = arText;
        } else {
            element.textContent = enText;
        }
    });
}

// Modal Functions
function openModal(img) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    if (modal && modalImg) {
        modal.style.display = 'block';
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    
    if (modal) {
        modal.style.display = 'none';
        
        // Restore body scroll
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside the image
document.addEventListener('click', function(e) {
    const modal = document.getElementById('imageModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Load Projects from Google Sheets (Placeholder)
async function loadProjectsFromGoogleSheets() {
    const projectsGrid = document.getElementById('projectsGrid');
    
    if (!projectsGrid) return;
    
    // This is a placeholder function
    // In a real implementation, you would fetch data from Google Sheets API
    const sampleProjects = [
        {
            title: 'مجمع سكني فاخر',
            titleEn: 'Luxury Residential Complex',
            description: 'مشروع سكني متكامل يضم 200 وحدة سكنية',
            descriptionEn: 'Integrated residential project with 200 housing units',
            category: 'residential',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            year: '2023',
            location: 'الرياض'
        },
        {
            title: 'مركز تجاري حديث',
            titleEn: 'Modern Shopping Center',
            description: 'مركز تجاري على مساحة 50000 متر مربع',
            descriptionEn: 'Shopping center covering 50,000 square meters',
            category: 'commercial',
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            year: '2022',
            location: 'جدة'
        },
        {
            title: 'مشروع طرق وبنية تحتية',
            titleEn: 'Roads and Infrastructure Project',
            description: 'تطوير شبكة طرق بطول 25 كيلومتر',
            descriptionEn: 'Development of 25-kilometer road network',
            category: 'infrastructure',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            year: '2023',
            location: 'الدمام'
        }
    ];
    
    // Render projects
    projectsGrid.innerHTML = sampleProjects.map(project => `
        <div class="project-card ${project.category}">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
            </div>
            <div class="project-info">
                <h3 data-ar="${project.title}" data-en="${project.titleEn}">${project.title}</h3>
                <p data-ar="${project.description}" data-en="${project.descriptionEn}">${project.description}</p>
                <div class="project-meta">
                    <span data-ar="السنة: ${project.year}" data-en="Year: ${project.year}">السنة: ${project.year}</span>
                    <span data-ar="الموقع: ${project.location}" data-en="Location: ${project.location}">الموقع: ${project.location}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update text content for new elements
    updateTextContent();
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy Loading for Images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', debounce(() => {
    const scrollBtn = document.querySelector('.scroll-to-top');
    if (scrollBtn) {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    }
}, 100));

