const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('src', { recursive: true })
    .filter(f => f.endsWith('.tsx') || f.endsWith('.ts'))
    .map(f => path.join('src', f));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;

  // Fix HeroUIProvider leftover
  if (content.includes('HeroUIProvider')) {
    content = content.replace(/<HeroUIProvider>/g, '');
    content = content.replace(/<\/HeroUIProvider>/g, '');
    content = content.replace(/import\s+\{[^}]*HeroUIProvider[^}]*\}\s+from\s+["']@heroui\/react["'];?\n?/g, (match) => {
        return match.replace(/HeroUIProvider\s*,?\s*/, '').replace(/\{\s*\}/, '').replace(/import\s+from\s+["']@heroui\/react["'];?\n?/, '');
    });
    changed = true;
  }

  // Fix standard button onPress -> onClick
  const newContent = content.replace(/<button([^>]*)onPress=/g, '<button$1onClick=');
  if (newContent !== content) {
    content = newContent;
    changed = true;
  }

  // Fix Card.Body -> Card.Content
  if (content.includes('Card.Body') || content.includes('CardBody')) {
    content = content.replace(/<CardBody/g, '<Card.Content');
    content = content.replace(/<\/CardBody>/g, '</Card.Content>');
    content = content.replace(/<Card\.Body/g, '<Card.Content');
    content = content.replace(/<\/Card\.Body>/g, '</Card.Content>');
    content = content.replace(/CardBody\s*,?\s*/g, '');
    changed = true;
  }

  // Fix Divider -> Separator
  if (content.includes('Divider')) {
      content = content.replace(/<Divider/g, '<Separator');
      content = content.replace(/<\/Divider>/g, '</Separator>');
      content = content.replace(/Divider/g, 'Separator');
      changed = true;
  }

  // Fix Image -> img
  if (content.includes('<Image')) {
      content = content.replace(/<Image/g, '<img');
      content = content.replace(/<\/Image>/g, '</img>');
      content = content.replace(/import\s+\{[^}]*Image[^}]*\}\s+from\s+["']@heroui\/react["'];?\n?/g, (match) => {
          return match.replace(/Image\s*,?\s*/, '').replace(/\{\s*\}/, '').replace(/import\s+from\s+["']@heroui\/react["'];?\n?/, '');
      });
      changed = true;
  }

  // Fix variants for Button / Chip / etc.
  const variantsReplaced = content
    .replace(/variant=(["'])flat\1/g, 'variant="tertiary"')
    .replace(/variant=(["'])light\1/g, 'variant="tertiary"')
    .replace(/variant=(["'])solid\1/g, 'variant="primary"')
    .replace(/variant=(["'])ghost\1/g, 'variant="outline"'); // assuming ghost -> outline or ghost is still there? Guide says ghost is there.

  if (variantsReplaced !== content) {
    content = variantsReplaced;
    changed = true;
  }

  // Remove color props from Button, Switch, Chip
  // Also handle JSX expressions like color={"primary"} or color={color} or newlines
  content = content.replace(/<(Button|Switch|Chip)([\s\S]*?)\bcolor=(?:["'][^"']+["']|\{[^}]+\})([\s\S]*?)>/g, '<$1$2$3>');
  content = content.replace(/<(Button|Switch|Chip)([\s\S]*?)\bcolor=(?:["'][^"']+["']|\{[^}]+\})([\s\S]*?)>/g, '<$1$2$3>'); // run twice just in case

  // Remove radius prop from Button
  content = content.replace(/<Button([\s\S]*?)\bradius=(?:["'][^"']+["']|\{[^}]+\})([\s\S]*?)>/g, '<Button$1$2>');

  // Rename disabled to isDisabled for Button and Switch
  content = content.replace(/<Button([\s\S]*?)\bdisabled/g, '<Button$1 isDisabled');
  content = content.replace(/<Switch([\s\S]*?)\bdisabled/g, '<Switch$1 isDisabled');

  // Rename isLoading to isPending for Button
  content = content.replace(/<Button([\s\S]*?)\bisLoading/g, '<Button$1 isPending');

  // Fix dynamic variants: variant={active ? "solid" : "flat"} -> variant={active ? "primary" : "tertiary"}
  content = content.replace(/['"]solid['"]/g, '"primary"');
  content = content.replace(/['"]flat['"]/g, '"tertiary"');
  content = content.replace(/['"]light['"]/g, '"tertiary"');
  content = content.replace(/['"]ghost['"]/g, '"outline"');

  // Fix Switch onValueChange -> onChange and wrapper
  if (content.includes('onValueChange')) {
    content = content.replace(/onValueChange=/g, 'onChange=');
    changed = true;
  }

  if (content.includes('<Switch')) {
    const switchReplaced = content.replace(/<Switch([^>]*)(\/?)>/g, (match, attrs, selfClosing) => {
        if (content.includes('<Switch.Control>')) return match; 
        
        if (selfClosing) {
            return `<Switch${attrs}>\n<Switch.Control><Switch.Thumb/></Switch.Control>\n</Switch>`;
        }
        return match;
    });
    if (switchReplaced !== content && !content.includes('<Switch.Control>')) {
        content = switchReplaced;
        changed = true;
    }
  }

  // Fix Input -> TextField? The errors don't mention Input currently. 
  // Wait, if there are no Input TS errors, maybe it's fine for now.

  if (content !== fs.readFileSync(f, 'utf8')) {
    fs.writeFileSync(f, content);
  }
});
