// Contact Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    setupFormValidation();
    setupLanguageToggle();
});

// Initialize contact form
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Add input animations
    setupInputAnimations();
    
    // Setup form field interactions
    setupFormInteractions();
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        <span data-ar="جاري الإرسال..." data-en="Sending...">جاري الإرسال...</span>
    `;
    submitBtn.disabled = true;
    
    try {
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form data
        if (!validateFormData(data)) {
            throw new Error('Invalid form data');
        }
        
        // Simulate form submission (replace with actual API call)
        await simulateFormSubmission(data);
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        form.reset();
        resetFormAnimations();
        
    } catch (error) {
        console.error('Form submission error:', error);
        showErrorMessage();
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Validate form data
function validateFormData(data) {
    const required = ['firstName', 'lastName', 'email', 'phone', 'projectType', 'message'];
    
    for (const field of required) {
        if (!data[field] || data[field].trim() === '') {
            showFieldError(field, 'هذا الحقل مطلوب');
            return false;
        }
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showFieldError('email', 'البريد الإلكتروني غير صحيح');
        return false;
    }
    
    // Validate phone
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(data.phone)) {
        showFieldError('phone', 'رقم الهاتف غير صحيح');
        return false;
    }
    
    // Check terms acceptance
    if (!data.terms) {
        showFieldError('terms', 'يجب الموافقة على الشروط');
        return false;
    }
    
    return true;
}

// Show field error
function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    if (!field) return;
    
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    // Remove existing error
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error class
    formGroup.classList.add('error');
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
    
    // Focus on field
    field.focus();
    
    // Remove error on input
    field.addEventListener('input', function() {
        formGroup.classList.remove('error');
        if (existingError) {
            existingError.remove();
        }
    }, { once: true });
}

// Simulate form submission
async function simulateFormSubmission(data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Log form data (replace with actual API call)
    console.log('Form submitted:', data);
    
    // Here you would typically send the data to your backend
    // Example:
    // const response = await fetch('/api/contact', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data)
    // });
    // 
    // if (!response.ok) {
    //     throw new Error('Failed to submit form');
    // }
    
    return { success: true };
}

// Show success message
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Add animation
        setTimeout(() => {
            successMessage.classList.add('show');
        }, 10);
    }
}

// Close success message
function closeSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.classList.remove('show');
        setTimeout(() => {
            successMessage.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Show error message
function showErrorMessage() {
    // Create and show error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span data-ar="حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى." 
                  data-en="An error occurred while sending the message. Please try again.">
                حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.
            </span>
            <button onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

// Setup input animations
function setupInputAnimations() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        const label = group.querySelector('label');
        
        if (!input || !label) return;
        
        // Handle focus/blur events
        input.addEventListener('focus', () => {
            group.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                group.classList.remove('focused');
            }
        });
        
        // Handle input events
        input.addEventListener('input', () => {
            if (input.value) {
                group.classList.add('has-value');
            } else {
                group.classList.remove('has-value');
            }
            
            // Remove error state on input
            group.classList.remove('error');
            const errorMessage = group.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
        
        // Initialize state
        if (input.value) {
            group.classList.add('has-value');
        }
    });
}

// Setup form interactions
function setupFormInteractions() {
    // Auto-format phone number
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.startsWith('966')) {
                value = '+' + value;
            } else if (value.startsWith('0')) {
                value = '+966' + value.substring(1);
            }
            e.target.value = value;
        });
    }
    
    // Dynamic project type handling
    const projectTypeSelect = document.getElementById('projectType');
    if (projectTypeSelect) {
        projectTypeSelect.addEventListener('change', function() {
            const messageTextarea = document.getElementById('message');
            if (messageTextarea && this.value) {
                updateMessagePlaceholder(this.value, messageTextarea);
            }
        });
    }
    
    // Character counter for message
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        const maxLength = 1000;
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.textContent = `0 / ${maxLength}`;
        messageTextarea.parentElement.appendChild(counter);
        
        messageTextarea.addEventListener('input', function() {
            const length = this.value.length;
            counter.textContent = `${length} / ${maxLength}`;
            
            if (length > maxLength * 0.9) {
                counter.classList.add('warning');
            } else {
                counter.classList.remove('warning');
            }
        });
    }
}

// Update message placeholder based on project type
function updateMessagePlaceholder(projectType, textarea) {
    const placeholders = {
        residential: 'اكتب تفاصيل المشروع السكني: عدد الوحدات، المساحة، الموقع، المتطلبات الخاصة...',
        commercial: 'اكتب تفاصيل المشروع التجاري: نوع النشاط، المساحة المطلوبة، الموقع، التجهيزات...',
        industrial: 'اكتب تفاصيل المشروع الصناعي: نوع الصناعة، المتطلبات التقنية، المساحة، المواصفات...',
        infrastructure: 'اكتب تفاصيل مشروع البنية التحتية: نوع المشروع، النطاق الجغرافي، المتطلبات...',
        renovation: 'اكتب تفاصيل مشروع الترميم: حالة المبنى الحالية، نوع الترميم المطلوب، المساحة...',
        consultation: 'اكتب تفاصيل الاستشارة المطلوبة: نوع المشروع، المرحلة الحالية، التحديات...',
        other: 'اكتب تفاصيل مشروعك، المتطلبات، والجدول الزمني المطلوب...'
    };
    
    textarea.placeholder = placeholders[projectType] || placeholders.other;
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Real-time validation
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const formGroup = field.closest('.form-group');
    
    // Remove existing error
    formGroup.classList.remove('error');
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        showFieldError(fieldName, 'هذا الحقل مطلوب');
        return false;
    }
    
    // Specific validations
    switch (fieldName) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                showFieldError(fieldName, 'البريد الإلكتروني غير صحيح');
                return false;
            }
            break;
            
        case 'phone':
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (value && !phoneRegex.test(value)) {
                showFieldError(fieldName, 'رقم الهاتف غير صحيح');
                return false;
            }
            break;
    }
    
    return true;
}

// Reset form animations
function resetFormAnimations() {
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('focused', 'has-value', 'error');
        const errorMessage = group.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    });
}

// Setup language toggle
function setupLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', function() {
            updateLanguageContent();
        });
    }
}

// Update language content
function updateLanguageContent() {
    const elements = document.querySelectorAll('[data-ar][data-en]');
    const currentLang = document.documentElement.lang;
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    
    elements.forEach(element => {
        const arText = element.getAttribute('data-ar');
        const enText = element.getAttribute('data-en');
        element.textContent = newLang === 'ar' ? arText : enText;
    });
    
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
}

// Export functions for global access
window.closeSuccessMessage = closeSuccessMessage;

