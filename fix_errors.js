const fs = require('fs');
const log = fs.readFileSync('logs.txt', 'utf8');

const regex = /src\/app\/.*?\.ts/g;
let match;
const files = new Set();
while ((match = regex.exec(log)) !== null) {
    files.add(match[0]);
}

files.forEach(file => {
    let content = fs.readFileSync('appsweb/angular/' + file, 'utf8');
    
    // Items to remove from imports
    const toRemove = [
        'MobileActionMenu', 'MobileListItem', 'MobileButtonLabelItem', 
        'MobileButtonLabelEdit', 'MobileButtonLabelDelete', 'MobileButtonIcon', 
        'DataViewMobile', 'IonLabel', 'MobileButtonLabelViewPdf', 
        'CustomInputSelectSignal', 'IonItemOption', 'IonItemOptions',
        'TableEmptyMessage', 'TableCaption', 'LxWebDirective', 
        'LxMobileDirective', 'IonContent', 'IonList', 'IonItem', 
        'IonItemSliding', 'IonSearchbar', 'InputSelect'
    ];
    
    toRemove.forEach(item => {
        // Remove from imports array: , Item, or Item, or just Item
        const r1 = new RegExp(`\\b${item}\\b\\s*,?`, 'g');
        content = content.replace(r1, '');
    });
    
    // Add signal import if missing
    if (file.includes('product-output-list.ts') && !content.includes(' signal }')) {
        content = content.replace(/import {([^}]+)} from '@angular\/core';/, (m, p1) => {
            return `import {${p1}, signal} from '@angular/core';`;
        });
    }

    // Fix RadioComunicacion properties
    if (file.includes('radio-comunicacion-list.ts')) {
        content = content.replace(/item\.applicationUser\?/g, '(<any>item).applicationUser?');
        content = content.replace(/item\.departament\?/g, '(<any>item).departament?');
    }

    fs.writeFileSync('appsweb/angular/' + file, content, 'utf8');
    console.log('Fixed', file);
});

// For the HTML error
let htmlFile = 'appsweb/angular/src/app/modules/recruitment.luxuryapp/candidates/candidate-applications/mobile/candidate-application-list-mobile.html';
let htmlContent = fs.readFileSync(htmlFile, 'utf8');
htmlContent = htmlContent.replace(/\[showClear\]="true"/g, ''); // just remove it or fix it
fs.writeFileSync(htmlFile, htmlContent, 'utf8');
console.log('Fixed HTML');

