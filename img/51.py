import os

folder = r"C:\Users\lqmas\Downloads\dyar"  # غيّر للمجلد حقك
files = os.listdir(folder)

# نخلي الملفات بترتيب ثابت (عشان ما تلخبط)
files = sorted(files)

i = 1
for file in files:
    ext = os.path.splitext(file)[1]  # الامتداد (.jpg / .png)
    new_name = f"{i}{ext}"
    old_path = os.path.join(folder, file)
    new_path = os.path.join(folder, new_name)
    os.rename(old_path, new_path)
    i += 1

print("تمت إعادة التسمية من 1 إلى", i-1)
