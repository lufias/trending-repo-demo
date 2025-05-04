import { promises as fs } from 'fs';
import path from 'path';

async function renameFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      await renameFiles(fullPath);
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.jsx')) {
        const newPath = fullPath.replace('.jsx', '.tsx');
        await fs.rename(fullPath, newPath);
        console.log(`Renamed ${fullPath} to ${newPath}`);
      } else if (entry.name.endsWith('.js') && 
                !entry.name.includes('.config.js') && 
                !entry.name.includes('vite.config.js')) {
        const newPath = fullPath.replace('.js', '.ts');
        await fs.rename(fullPath, newPath);
        console.log(`Renamed ${fullPath} to ${newPath}`);
      }
    }
  }
}

renameFiles('./src').catch(console.error); 