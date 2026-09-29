import os
import zipfile

def create_zip():
    exclude_dirs = {'.git', 'node_modules', '.next', '.vercel'}
    zip_name = 'PosyanduWeb_cPanel.zip'
    
    print("Creating zip file, this may take a moment...")
    with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk('.'):
            # Modify dirs in-place to skip excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for file in files:
                if file == zip_name or file.endswith('.bak') or file == 'create_zip.js' or file == 'create_zip.py':
                    continue
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, '.')
                zipf.write(file_path, arcname)
    print("Done!")

if __name__ == '__main__':
    create_zip()
