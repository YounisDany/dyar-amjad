# -*- coding: utf-8 -*-

# ملف يولد 51 كارد مشروع بترقيم الصور من img/1.jpg إلى img/51.jpg

template = """
    <div class="project-card" data-category="completed" data-aos="fade-up" data-aos-delay="100">
        <div class="project-image">
            <img src="img/{i}.jpg" alt="مشروع منجز">
            <div class="project-overlay">
                <div class="project-status completed" data-ar="مكتمل" data-en="Completed">مكتمل</div>
                <div class="project-actions">
                    <button class="view-project" onclick="openProjectModal('project{i}')" data-ar="عرض التفاصيل" data-en="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <a href="https://wa.me/966567829308?text=مرحباً%20🌟%20أرغب%20بمعرفة%20تفاصيل%20المشروع"
                       target="_blank"
                       style="background-color:#25D366; color:#fff; padding:10px 14px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; text-decoration:none; font-size:18px; margin-left:8px;">
                       <i class="fab fa-whatsapp"></i>
                    </a>
                </div>
            </div>
        </div>
        <div class="project-info">
            <p class="project-details" data-ar="تم الإنجاز بواسطة ديار أمجاد العقارية" data-en="Delivered by Diyar Amjad Real Estate">
                تم الإنجاز بواسطة ديار أمجاد العقارية
            </p>
        </div>
    </div>
"""

# إنشاء محتوى الملف
output = '<div class="projects-grid">\n    <!-- start loop -->\n'
for i in range(1, 52):  # من 1 إلى 51
    output += template.format(i=i) + "\n"
output += "</div>"

# حفظ الملف
with open("projects.html", "w", encoding="utf-8") as f:
    f.write(output)

print("projects.html file created successfully with 51 cards.")


