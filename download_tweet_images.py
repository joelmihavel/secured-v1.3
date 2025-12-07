#!/usr/bin/env python3
"""
Download tweet images from Google Drive URLs in CSV file and optimize to WebP.
Uses gdown for reliable Google Drive downloads and Pillow for WebP conversion.
"""
import csv
import os
import subprocess
import sys
from pathlib import Path

def install_dependencies():
    """Install required packages if not already installed"""
    packages = ['gdown', 'Pillow']
    for package in packages:
        try:
            __import__(package.lower() if package == 'Pillow' else package)
        except ImportError:
            print(f"Installing {package} package...")
            try:
                subprocess.check_call([sys.executable, "-m", "pip", "install", "--break-system-packages", package])
            except Exception as e:
                print(f"Failed to install {package}: {e}")
                print(f"Please install manually: pip3 install --break-system-packages {package}")
                return False
    return True

def get_file_id(google_drive_url):
    """Extract file ID from Google Drive URL"""
    try:
        if '/file/d/' in google_drive_url:
            file_id = google_drive_url.split('/file/d/')[1].split('/')[0]
            return file_id
        return None
    except Exception as e:
        print(f"Error parsing URL {google_drive_url}: {e}")
        return None

def download_and_optimize_image(url, save_path):
    """Download an image from Google Drive URL and convert to WebP"""
    try:
        import gdown
        from PIL import Image
        
        file_id = get_file_id(url)
        if not file_id:
            print(f"Could not extract file ID from URL: {url}")
            return False
        
        # Ensure the directory exists
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        
        # Download to temporary file first
        temp_path = save_path.replace('.webp', '.tmp')
        download_url = f"https://drive.google.com/uc?id={file_id}"
        print(f"Downloading: {download_url}")
        
        gdown.download(download_url, temp_path, quiet=False)
        
        # Check if file was downloaded
        if not os.path.exists(temp_path) or os.path.getsize(temp_path) == 0:
            print(f"✗ Failed to download (empty or missing file)")
            return False
        
        # Convert to WebP
        print(f"Converting to WebP...")
        img = Image.open(temp_path)
        
        # Convert RGBA to RGB if necessary
        if img.mode == 'RGBA':
            # Create a white background
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])  # 3 is the alpha channel
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Save as WebP with optimization
        img.save(save_path, 'WEBP', quality=85, method=6)
        
        # Remove temporary file
        os.remove(temp_path)
        
        print(f"✓ Successfully downloaded and optimized: {save_path}")
        return True
    
    except Exception as e:
        print(f"✗ Error processing {url}: {e}")
        # Clean up temp file if it exists
        temp_path = save_path.replace('.webp', '.tmp')
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return False

def main():
    # Install dependencies if needed
    if not install_dependencies():
        print("Cannot proceed without required packages.")
        return
    
    # Paths - using aboutUs.csv for team images
    csv_path = 'public/aboutUs.csv'
    output_dir = 'public/team-images'
    
    # Create output directory if it doesn't exist
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    # Read CSV and download images
    successful = 0
    total = 0
    
    print("\n" + "="*60)
    print("Starting download of team images...")
    print("="*60)
    
    with open(csv_path, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        
        for idx, row in enumerate(reader, 1):
            # aboutUs.csv uses "Image Links" column
            image_url = row.get('Image Links', '').strip()
            
            # Skip rows with empty image URL
            if not image_url:
                print(f"\n⊘ Skipping row {idx} - no image URL")
                continue
            
            total += 1
            
            # Generate filename using index
            filename = f"team_{idx}.webp"
            
            save_path = os.path.join(output_dir, filename)
            
            # Download and optimize the image
            print(f"\n{'='*60}")
            print(f"Processing: Team Member {idx}")
            if download_and_optimize_image(image_url, save_path):
                successful += 1
    
    # Summary
    print(f"\n{'='*60}")
    print(f"✓ Downloaded and optimized {successful}/{total} images successfully!")
    print(f"📁 Images saved to: {output_dir}/")
    print("="*60)

if __name__ == '__main__':
    main()
