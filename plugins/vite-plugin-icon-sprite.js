import { promises as fs } from 'fs';
import path from 'path';

const pluginName = 'icon-sprite-plugin';

export default function IconSpritePlugin() {
  async function generateIconSprite() {
    const iconsDir = path.join(process.cwd(), 'src', 'icons');
    const spriteFilePath = path.join(iconsDir, 'sprite.svg');
    const relativeSpritePath = path.relative('.', iconsDir);

    try {
      await fs.access(iconsDir);
    } catch (error) {
      console.error(`⚠️ icons folder not found: ${relativeSpritePath}`);
      return;
    }

    const files = await fs.readdir(iconsDir);
    let symbols = '';

    for (const file of files) {
      if (file === 'sprite.svg' || !file.endsWith('.svg')) continue;

      const filePath = path.join(iconsDir, file);
      let svgContent = await fs.readFile(filePath, 'utf8');
      const id = path.basename(file, '.svg');

      svgContent = svgContent
        .replace(/id="[^"]*"/g, '')
        .replace(/fill="[^"]*"/g, '')
        .replace(/<svg([^>]*)>/, `<symbol id="${id}"$1>`)
        .replace('</svg>', '</symbol>');

      symbols += svgContent + '\n';
    }

    const sprite = `<svg width="0" height="0" style="display: none">\n${symbols}</svg>`;

    await fs.writeFile(spriteFilePath, sprite, 'utf8');
  }

  return {
    name: pluginName,
    buildStart() {
      return generateIconSprite();
    },
    configureServer(server) {
      server.watcher.add(path.join(process.cwd(), 'src', 'icons', '*.svg'));
      server.watcher.on('all', async (event, changedPath) => {
        if (changedPath.endsWith('.svg') && (event === 'add' || event === 'unlink')) {
          const fileName = path.basename(changedPath);
          await generateIconSprite();
        }
      });
    }
  };
}
