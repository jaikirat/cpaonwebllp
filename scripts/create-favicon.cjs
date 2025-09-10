#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create a simple 16x16 favicon.ico
// This is a minimal valid ICO file structure
const icoHeader = Buffer.from([
  0x00, 0x00, // Reserved, must be 0
  0x01, 0x00, // Type: 1 for ICO
  0x01, 0x00, // Number of images: 1
]);

const dirEntry = Buffer.from([
  0x10, // Width: 16 pixels
  0x10, // Height: 16 pixels
  0x00, // Colors in palette: 0 (no palette)
  0x00, // Reserved
  0x01, 0x00, // Color planes: 1
  0x20, 0x00, // Bits per pixel: 32
  0x00, 0x04, 0x00, 0x00, // Size of image data: 1024 bytes
  0x16, 0x00, 0x00, 0x00, // Offset to image data: 22 bytes
]);

// Create a simple 16x16 RGBA image (all transparent)
// BMP header for the image
const bmpHeader = Buffer.from([
  0x28, 0x00, 0x00, 0x00, // Size of this header: 40 bytes
  0x10, 0x00, 0x00, 0x00, // Width: 16
  0x20, 0x00, 0x00, 0x00, // Height: 32 (16*2 for XOR and AND masks)
  0x01, 0x00, // Planes: 1
  0x20, 0x00, // Bits per pixel: 32
  0x00, 0x00, 0x00, 0x00, // Compression: none
  0x00, 0x04, 0x00, 0x00, // Image size: 1024 bytes
  0x00, 0x00, 0x00, 0x00, // X pixels per meter
  0x00, 0x00, 0x00, 0x00, // Y pixels per meter
  0x00, 0x00, 0x00, 0x00, // Colors used: 0
  0x00, 0x00, 0x00, 0x00, // Important colors: 0
]);

// Create image data: 16x16 pixels, each 4 bytes (BGRA)
// Simple pattern with blue center
const imageData = Buffer.alloc(16 * 16 * 4);
for (let y = 0; y < 16; y++) {
  for (let x = 0; x < 16; x++) {
    const offset = ((15 - y) * 16 + x) * 4; // Flip vertically for BMP format

    // Create a simple pattern
    if (x >= 4 && x < 12 && y >= 4 && y < 12) {
      // Blue square in center
      imageData[offset] = 255;     // Blue
      imageData[offset + 1] = 100; // Green
      imageData[offset + 2] = 50;  // Red
      imageData[offset + 3] = 255; // Alpha
    } else {
      // Transparent elsewhere
      imageData[offset] = 0;       // Blue
      imageData[offset + 1] = 0;   // Green
      imageData[offset + 2] = 0;   // Red
      imageData[offset + 3] = 0;   // Alpha (transparent)
    }
  }
}

// AND mask (all zeros for 32-bit images with alpha)
const andMask = Buffer.alloc(16 * 16 / 8); // 1 bit per pixel

// Combine all parts
const icoData = Buffer.concat([
  icoHeader,
  dirEntry,
  bmpHeader,
  imageData,
  andMask,
]);

// Write the favicon
const faviconPath = path.join(__dirname, '..', 'public', 'favicon.ico');
fs.writeFileSync(faviconPath, icoData);
console.log('Created favicon.ico successfully');