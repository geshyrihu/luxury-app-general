import fs from 'fs';
import path from 'path';

const MAP = {
  'hidden': 'd-none',
  'block': 'd-block',
  'flex': 'd-flex',
  'inline-flex': 'd-inline-flex',
  'grid': 'row',
  'flex-column': 'flex-column',
  'flex-row': 'flex-row',
  'flex-column-reverse': 'flex-column-reverse',
  'flex-row-reverse': 'flex-row-reverse',
  'align-items-center': 'align-items-center',
  'align-items-start': 'align-items-start',
  'align-items-end': 'align-items-end',
  'justify-content-center': 'justify-content-center',
  'justify-content-between': 'justify-content-between',
  'justify-content-start': 'justify-content-start',
  'justify-content-end': 'justify-content-end',
  'justify-content-evenly': 'justify-content-evenly',
  'justify-content-around': 'justify-content-around'
};

function mapClass(cls) {
  if (MAP[cls]) return MAP[cls];

  // md:block, md:hidden, md:flex, md:inline-flex
  let m = cls.match(/^(sm|md|lg|xl|xxl):(block|hidden|flex|inline-flex)$/);
  if (m) {
    const bp = m[1];
    const val = m[2];
    if (val === 'hidden') return `d-${bp}-none`;
    return `d-${bp}-${val}`;
  }

  // md:flex-row, md:align-items-center, etc
  m = cls.match(/^(sm|md|lg|xl|xxl):(flex-(?:row|column)(?:-reverse)?|align-items-[a-z]+|align-self-[a-z]+|align-content-[a-z]+|justify-content-[a-z]+)$/);
  if (m) {
    const bp = m[1];
    const util = m[2];
    if (util.startsWith('flex-')) return `flex-${bp}-${util.substring(5)}`;
    if (util.startsWith('align-items-')) return `align-items-${bp}-${util.substring(12)}`;
    if (util.startsWith('justify-content-')) return `justify-content-${bp}-${util.substring(16)}`;
    if (util.startsWith('align-self-')) return `align-self-${bp}-${util.substring(11)}`;
    if (util.startsWith('align-content-')) return `align-content-${bp}-${util.substring(14)}`;
  }

  // md:col-6
  m = cls.match(/^(sm|md|lg|xl|xxl):col-([0-9]{1,2})$/);
  if (m) {
    return `col-${m[1]}-${m[2]}`;
  }

  // flex-order-X or md:flex-order-X
  m = cls.match(/^(?:(sm|md|lg|xl|xxl):)?flex-order-([0-9]+)$/);
  if (m) {
     const bp = m[1];
     const size = m[2];
     if (bp) return `order-${bp}-${size}`;
     return `order-${size}`;
  }

  // mr-2, md:mr-2
  m = cls.match(/^(?:(sm|md|lg|xl|xxl):)?(m|p)(r|l|x|y|t|b)?-([0-5]|auto)$/);
  if (m) {
    const bp = m[1];
    const type = m[2];
    let dir = m[3] || '';
    const size = m[4];

    if (dir === 'r') dir = 'e';
    else if (dir === 'l') dir = 's';

    if (bp) {
      return `${type}${dir}-${bp}-${size}`;
    }
    return `${type}${dir}-${size}`;
  }

  return cls;
}

function processClasses(classStr) {
  return classStr.split(/(\s+)/).map(c => c.trim() ? mapClass(c) : c).join('');
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // class="..."
  content = content.replace(/(class=["'])([^"']*)(["'])/g, (match, p1, p2, p3) => {
    const newClasses = processClasses(p2);
    if (newClasses !== p2) {
        modified = true;
    }
    return p1 + newClasses + p3;
  });

  // [ngClass]="..."
  content = content.replace(/(\[ngClass\]=["'])([^"']*)(["'])/g, (match, p1, p2, p3) => {
    let innerModified = false;
    const newP2 = p2.replace(/(')([^']*)(')/g, (m, q1, q2, q3) => {
       const newInner = processClasses(q2);
       if (newInner !== q2) innerModified = true;
       return q1 + newInner + q3;
    });
    if (innerModified) {
        modified = true;
    }
    return p1 + newP2 + p3;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else {
      if (fullPath.endsWith('.html') || fullPath.endsWith('.ts')) {
        processFile(fullPath);
      }
    }
  }
}

const targetDir = path.join(process.cwd(), 'appsweb', 'angular', 'src', 'app');
console.log(`Starting migration in ${targetDir}...`);
walk(targetDir);
console.log('Migration complete.');
