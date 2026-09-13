const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.{tsx,ts}');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('HeroUIProvider') || content.includes('onClick=') || content.includes('classNames=')) {
    content = content.replace(/<HeroUIProvider>/g, '');
    content = content.replace(/<\/HeroUIProvider>/g, '');
    content = content.replace(/import \{ HeroUIProvider \} from [\"']@heroui\/react[\"'];?\n/g, '');
    content = content.replace(/HeroUIProvider, /g, '');
    content = content.replace(/, HeroUIProvider/g, '');
    content = content.replace(/onClick=/g, 'onPress=');
    content = content.replace(/classNames=/g, 'className=');
    fs.writeFileSync(f, content);
  }
});
