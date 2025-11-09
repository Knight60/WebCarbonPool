import { Plot, Species } from '../types';

export const parseCsvLine = (line: string): string[] => {
    const columns: string[] = [];
    let currentColumn = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
                currentColumn += '"';
                i++; 
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            columns.push(currentColumn);
            currentColumn = '';
        } else {
            currentColumn += char;
        }
    }
    columns.push(currentColumn);
    return columns;
};

const typeMap: { [key: string]: Plot['type'] } = {
  'P': 'สวนสาธารณะ',
  'M': 'พื้นที่สีเขียวอรรถประโยชน์',
  'S': 'พื้นที่สีเขียวริมเส้นทางสัญจร',
};

const getRegion = (plotCode: string): Plot['region'] => {
  if (plotCode.startsWith('C10')) return 'กรุงเทพมหานคร';
  const prefix = plotCode.charAt(0);
  switch (prefix) {
    case 'C': return 'กลาง';
    case 'E': return 'ตะวันออก';
    case 'I': return 'ตะวันออกเฉียงเหนือ';
    case 'N': return 'เหนือ';
    case 'S': return 'ใต้';
    case 'W': return 'ตะวันตก';
    default: return 'กลาง';
  }
};

export const parsePlotData = (csvText: string): Plot[] => {
  return csvText
    .split('\n')
    .slice(1)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('X'))
    .map(line => {
      const columns = parseCsvLine(line);
      if (columns.length < 15) return null;

      const plotCode = columns[2];
      const typeKey = columns[7];

      const plot: Plot = {
        no: parseInt(columns[0], 10),
        id: plotCode,
        name: columns[3],
        province: columns[4],
        amphoe: columns[5],
        tambon: columns[6],
        type: typeMap[typeKey] || 'ไม่ระบุ',
        lat: parseFloat(columns[8]),
        lon: parseFloat(columns[9]),
        gmap: columns[10],
        tagCount: parseInt(columns[11], 10),
        spCount: parseInt(columns[12], 10),
        shannon: parseFloat(columns[13]),
        biomass: columns[14],
        region: getRegion(plotCode),
      };
      
      if (Object.values(plot).some(v => typeof v === 'number' && isNaN(v))) {
          return null;
      }
      return plot;
    })
    .filter((plot): plot is Plot => plot !== null);
};


const parseFloatOrNull = (value: string): number | null => {
  if (!value || value.trim() === '') return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
};

const parseIntOrNull = (value: string): number | null => {
  if (!value || value.trim() === '') return null;
  const num = parseInt(value, 10);
  return isNaN(num) ? null : num;
};

export const parseSpeciesData = (speciesCsv: string, woodDensityCsv: string): Species[] => {
    const woodDensityMap = new Map<string, { family: string; woodDensity: number | null }>();
    woodDensityCsv.split('\n').slice(1).forEach(line => {
        const columns = parseCsvLine(line);
        if (columns.length > 13) {
            const thaiName = columns[6];
            const botanicalNoAuthor = columns[5];
            const key = `${thaiName}|${botanicalNoAuthor}`;
            const family = columns[1] || 'N/A';
            const woodDensity = parseFloatOrNull(columns[13]);
            if (thaiName && botanicalNoAuthor) {
                woodDensityMap.set(key, { family, woodDensity });
            }
        }
    });

    return speciesCsv
        .split('\n')
        .slice(1)
        .map(line => line.trim())
        .filter(line => line && line.split(',').some(cell => cell.trim() !== ''))
        .map((line, index) => {
            const columns = parseCsvLine(line);
            const thaiName = columns[0] || 'N/A';
            const botanicalNoAuthor = columns[1] || 'N/A';
            const key = `${thaiName}|${botanicalNoAuthor}`;
            const extraData = woodDensityMap.get(key) || { family: 'N/A', woodDensity: null };

            const species: Species = {
                no: index + 1,
                id: `${botanicalNoAuthor || 'unknown'}-${index}`,
                thaiName: thaiName,
                botanicalNoAuthor: botanicalNoAuthor,
                botanicalName: (columns[2] || 'N/A').replace(/^"|"$/g, ''),
                family: extraData.family,
                tagCount: parseIntOrNull(columns[3]),
                woodDensity: extraData.woodDensity,
                countGbh2023: parseIntOrNull(columns[4]),
                countGbh2025: parseIntOrNull(columns[5]),
                minHeight2023: parseFloatOrNull(columns[6]),
                meanHeight2023: parseFloatOrNull(columns[7]),
                maxHeight2023: parseFloatOrNull(columns[8]),
                minHeight2025: parseFloatOrNull(columns[9]),
                meanHeight2025: parseFloatOrNull(columns[10]),
                maxHeight2025: parseFloatOrNull(columns[11]),
            };
            return species;
        });
};
