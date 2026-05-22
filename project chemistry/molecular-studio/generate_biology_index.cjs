const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'public', 'models', 'biology');
const outputFilePath = path.join(__dirname, 'src', 'subjects', 'biology', 'data', 'models.json');

if (!fs.existsSync(modelsDir)) {
  console.error(`Directory not found: ${modelsDir}`);
  process.exit(1);
}

const directories = fs.readdirSync(modelsDir).filter(f => fs.statSync(path.join(modelsDir, f)).isDirectory());

const models = directories.map(dir => {
  const dirPath = path.join(modelsDir, dir);
  const files = fs.readdirSync(dirPath);
  
  const fbx = files.find(f => f.endsWith('.fbx'));
  const baseColor = files.find(f => f.endsWith('.png') && !f.includes('_emission') && !f.includes('_metallic') && !f.includes('_normal') && !f.includes('_roughness'));
  const normal = files.find(f => f.includes('_normal.png'));
  const roughness = files.find(f => f.includes('_roughness.png'));
  const metallic = files.find(f => f.includes('_metallic.png'));
  const emission = files.find(f => f.includes('_emission.png'));

  // Create a human readable name from the folder name
  // e.g. Meshy_AI_Anatomical_Heart_with_0518112453_texture_fbx -> Anatomical Heart with
  let name = dir.replace(/^Meshy_AI_/, '').replace(/_\d+_texture_fbx$/, '').replace(/_/g, ' ').trim();
  
  // Clean up hanging words like "with" or "and" if they are at the end
  name = name.replace(/ (with|and|with renal art)$/i, '').trim();

  return {
    id: dir,
    name: name,
    path: `/models/biology/${dir}/`,
    fbx: fbx,
    textures: {
      baseColor, normal, roughness, metallic, emission
    }
  };
});

fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
fs.writeFileSync(outputFilePath, JSON.stringify(models, null, 2));
console.log(`Successfully indexed ${models.length} biology models to ${outputFilePath}`);
