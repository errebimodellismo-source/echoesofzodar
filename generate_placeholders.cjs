const fs = require('fs');
const path = require('path');

const bPath = path.join(__dirname, 'public', 'assets', 'avatar');

// Basic SVG Template 256x256
const svgBase = (content) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${content}</svg>`;

const files = {
  'body/male_base.svg': svgBase(`<rect x="80" y="80" width="96" height="150" fill="#f5c298" rx="20"/><circle cx="128" cy="50" r="30" fill="#f5c298"/>`),
  'body/female_base.svg': svgBase(`<rect x="86" y="80" width="84" height="150" fill="#f1b581" rx="20"/><circle cx="128" cy="50" r="28" fill="#f1b581"/>`),
  'body/orc_base.svg': svgBase(`<rect x="70" y="70" width="116" height="160" fill="#719e59" rx="25"/><circle cx="128" cy="50" r="35" fill="#719e59"/>`),
  
  'face/scar.svg': svgBase(`<path d="M 110 30 L 120 70 M 115 30 L 125 70" stroke="darkred" stroke-width="2"/>`),
  'face/eyepatch.svg': svgBase(`<rect x="100" y="35" width="20" height="20" fill="#111" rx="5"/><line x1="80" y1="20" x2="150" y2="60" stroke="#111" stroke-width="3"/>`),
  
  'hair/short_brown.svg': svgBase(`<path d="M 98 40 Q 128 10 158 40 Q 148 20 128 20 Q 108 20 98 40 Z" fill="#523214"/>`),
  'hair/long_blonde.svg': svgBase(`<path d="M 100 20 Q 128 0 156 20 L 160 90 L 150 90 L 140 30 L 116 30 L 106 90 L 96 90 Z" fill="#ebd05b"/>`),
  'hair/mohawk_red.svg': svgBase(`<path d="M 120 20 Q 128 -20 136 20 Z" fill="#d12613"/>`),
  
  'outfit/warrior.svg': svgBase(`<rect x="75" y="85" width="106" height="80" fill="#5c5c5c" rx="5"/><rect x="85" y="90" width="86" height="70" fill="#8f8f8f" rx="5"/>`),
  'outfit/mage.svg': svgBase(`<rect x="82" y="85" width="92" height="140" fill="#2d427d" rx="10"/><rect x="110" y="85" width="36" height="140" fill="#e8d989" rx="2"/>`),
  'outfit/rogue.svg': svgBase(`<rect x="80" y="80" width="96" height="120" fill="#1e1e1e" rx="15"/><polygon points="90,80 166,80 128,110" fill="#0f0f0f"/>`),
};

// Write files
for (const [relPath, content] of Object.entries(files)) {
  const fullPath = path.join(bPath, relPath);
  fs.writeFileSync(fullPath, content);
}
console.log("SVG Placeholders generated.");
