#!/usr/bin/env python3
"""
Script to compress and convert all images in 'public/All Neighbourhoods' to WebP format
using ffmpeg, replace images in 'public/Neighbourhoods', and cleanup source directory.
"""

import os
import subprocess
import shutil
from pathlib import Path

# Define directories
BASE_DIR = Path(__file__).parent
SOURCE_DIR = BASE_DIR / "public" / "All Neighbourhoods"
DEST_DIR = BASE_DIR / "public" / "Neighbourhoods"

# WebP conversion settings - high compression for sketches
WEBP_QUALITY = 75  # Lower value = higher compression, 75 is good for sketches
WEBP_METHOD = 6    # Compression method (0-6), 6 is slowest but best compression

def convert_to_webp(input_path: Path, output_path: Path) -> bool:
    """
    Convert an image to WebP format using ffmpeg with high compression.
    
    Args:
        input_path: Path to the input image
        output_path: Path to save the WebP output
        
    Returns:
        True if conversion was successful, False otherwise
    """
    try:
        # Use ffmpeg to convert with high compression
        cmd = [
            'ffmpeg',
            '-i', str(input_path),
            '-c:v', 'libwebp',
            '-quality', str(WEBP_QUALITY),
            '-compression_level', str(WEBP_METHOD),
            '-y',  # Overwrite output file if exists
            str(output_path)
        ]
        
        result = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        if result.returncode == 0:
            # Get file sizes for reporting
            original_size = input_path.stat().st_size
            compressed_size = output_path.stat().st_size
            reduction = ((original_size - compressed_size) / original_size) * 100
            
            print(f"✓ Converted: {input_path.name}")
            print(f"  Original: {original_size / 1024:.1f} KB → WebP: {compressed_size / 1024:.1f} KB")
            print(f"  Reduction: {reduction:.1f}%")
            return True
        else:
            print(f"✗ Failed to convert {input_path.name}")
            print(f"  Error: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"✗ Error converting {input_path.name}: {e}")
        return False

def main():
    """Main execution function."""
    
    # Verify source directory exists
    if not SOURCE_DIR.exists():
        print(f"❌ Source directory not found: {SOURCE_DIR}")
        return
    
    # Create destination directory if it doesn't exist
    DEST_DIR.mkdir(parents=True, exist_ok=True)
    
    # Get all image files from source directory
    image_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff'}
    image_files = [
        f for f in SOURCE_DIR.iterdir() 
        if f.is_file() and f.suffix.lower() in image_extensions
    ]
    
    if not image_files:
        print(f"⚠️  No images found in {SOURCE_DIR}")
        return
    
    print(f"\n🖼️  Found {len(image_files)} images to convert\n")
    print("=" * 60)
    
    # Convert each image
    successful_conversions = 0
    for image_file in image_files:
        # Create output filename with .webp extension
        output_filename = image_file.stem + '.webp'
        output_path = DEST_DIR / output_filename
        
        if convert_to_webp(image_file, output_path):
            successful_conversions += 1
        print()  # Empty line for readability
    
    print("=" * 60)
    print(f"\n✅ Successfully converted {successful_conversions}/{len(image_files)} images")
    
    # Ask for confirmation before deleting source directory
    if successful_conversions == len(image_files):
        print(f"\n🗑️  Deleting source directory: {SOURCE_DIR}")
        try:
            shutil.rmtree(SOURCE_DIR)
            print("✓ Source directory deleted successfully")
        except Exception as e:
            print(f"✗ Failed to delete source directory: {e}")
    else:
        print(f"\n⚠️  Not all images were converted successfully.")
        print(f"   Source directory '{SOURCE_DIR}' has been preserved.")
        print(f"   Please review the errors above before manually deleting.")

if __name__ == "__main__":
    # Check if ffmpeg is available
    try:
        subprocess.run(['ffmpeg', '-version'], 
                      stdout=subprocess.PIPE, 
                      stderr=subprocess.PIPE, 
                      check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Error: ffmpeg is not installed or not in PATH")
        print("   Install with: brew install ffmpeg")
        exit(1)
    
    main()
