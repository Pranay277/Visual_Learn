const fs = require('fs');
const https = require('https');

const url = 'https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json';

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const parsedData = JSON.parse(data);
      const elements = parsedData.elements.map(e => {
        // Map category to our group names for coloring
        let group = 'post-transition';
        if (e.category.includes('alkali metal')) group = 'alkali';
        else if (e.category.includes('alkaline earth metal')) group = 'alkaline';
        else if (e.category.includes('transition metal')) group = 'transition';
        else if (e.category.includes('noble gas')) group = 'noble';
        else if (e.category.includes('halogen')) group = 'halogen';
        else if (e.category.includes('metalloid')) group = 'metalloid';
        else if (e.category.includes('nonmetal')) group = 'nonmetal';
        else if (e.category.includes('lanthanide')) group = 'lanthanide';
        else if (e.category.includes('actinide')) group = 'actinide';

        return {
          atomic: e.number,
          symbol: e.symbol,
          name: e.name,
          mass: e.atomic_mass,
          group: group,
          config: e.electron_configuration_semantic || e.electron_configuration,
          col: e.xpos,
          row: e.ypos,
          summary: e.summary,
          electronegativity: e.electronegativity_pauling || null,
          radius: e.atomic_radius || null,
          ionization: e.ionization_energies ? e.ionization_energies[0] : null
        };
      });

      const fileContent = `export const elementsData = ${JSON.stringify(elements, null, 2)};\n\n` +
      `export const groupColors = {
  nonmetal: '#10b981',
  noble: '#8b5cf6',
  alkali: '#ef4444',
  alkaline: '#f59e0b',
  metalloid: '#06b6d4',
  halogen: '#3b82f6',
  'post-transition': '#64748b',
  transition: '#eab308',
  lanthanide: '#ec4899',
  actinide: '#d946ef'
};`;

      fs.writeFileSync('./src/data/periodicTableData.js', fileContent);
      console.log('Successfully fetched and wrote all 118 elements.');
    } catch (e) {
      console.error('Error parsing JSON', e);
    }
  });
}).on('error', (e) => {
  console.error('Error fetching data', e);
});
