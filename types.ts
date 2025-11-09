export type Page = 'home' | 'plots' | 'species' | 'spatial' | 'taxonomy' | 'data';

export interface Plot {
  no: number;
  id: string; // PlotCode
  name: string;
  province: string;
  amphoe: string;
  tambon: string;
  type: 'สวนสาธารณะ' | 'พื้นที่สีเขียวอรรถประโยชน์' | 'พื้นที่สีเขียวริมเส้นทางสัญจร' | 'ไม่ระบุ';
  lat: number;
  lon: number;
  gmap: string;
  tagCount: number;
  spCount: number;
  shannon: number;
  biomass: string; // Keep as string due to comma formatting
  region: 'เหนือ' | 'ตะวันออกเฉียงเหนือ' | 'กลาง' | 'ตะวันตก' | 'ตะวันออก' | 'ใต้' | 'กรุงเทพมหานคร';
}

export interface Species {
  no: number;
  id: string; // for react key
  thaiName: string;
  botanicalNoAuthor: string;
  botanicalName: string;
  family: string;
  tagCount: number | null;
  woodDensity: number | null;
  countGbh2023: number | null;
  countGbh2025: number | null;
  minHeight2023: number | null;
  meanHeight2023: number | null;
  maxHeight2023: number | null;
  minHeight2025: number | null;
  meanHeight2025: number | null;
  maxHeight2025: number | null;
}

export interface APIEndpoint {
  name: string;
  method: 'GET' | 'POST';
  path: string;
  description: string;
  exampleResponse: string;
}
