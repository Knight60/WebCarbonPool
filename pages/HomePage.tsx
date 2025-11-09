import React, { useMemo } from 'react';
import { MapIcon, CodeIcon, ChartBarIcon, TableIcon, TreeIcon, ScaleIcon, ChartPieIcon, MapPinIcon } from '../components/icons';
import { Plot, Species } from '../types';
import { useSurveyData } from '../hooks/useSurveyData';
import { useSpeciesData } from '../hooks/useSpeciesData';

// --- Page Components ---

const StatCard: React.FC<{ value: string; label: string; description: string }> = ({ value, label, description }) => (
  <div className="bg-emerald-50 p-6 rounded-xl shadow-sm text-center transition-transform hover:scale-105">
    <p className="text-3xl md:text-4xl font-bold text-emerald-600">{value}</p>
    <p className="mt-1 text-sm font-semibold text-slate-700">{label}</p>
    <p className="mt-2 text-xs text-slate-500">{description}</p>
  </div>
);

const ObjectiveCard: React.FC<{ icon: React.ElementType; title: string; description:string }> = ({ icon: Icon, title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 mb-4">
            <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-base text-slate-600 flex-grow">{description}</p>
    </div>
);

const GreenAreaTypeCard: React.FC<{ icon: React.ElementType; title: string; description: string; bgColor: string }> = ({ icon: Icon, title, description, bgColor }) => (
  <div className={`${bgColor} p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col`}>
    <div className="flex items-center mb-4">
      <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-emerald-100 text-emerald-600">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="ml-4 text-lg font-semibold text-slate-900">{title}</h3>
    </div>
    <p className="text-base text-slate-600 flex-grow">{description}</p>
  </div>
);

const RegionPlotChart: React.FC<{ plots: Plot[] }> = ({ plots }) => {
  const regionData = useMemo(() => {
    const counts: Record<string, number> = {
      'เหนือ': 0,
      'ตะวันออกเฉียงเหนือ': 0,
      'กลาง': 0,
      'ตะวันตก': 0,
      'ตะวันออก': 0,
      'ใต้': 0,
      'กรุงเทพมหานคร': 0,
    };

    plots.forEach(plot => {
      if (counts[plot.region] !== undefined) {
        counts[plot.region]++;
      }
    });
    
    const centralCount = counts['กลาง'] + counts['กรุงเทพมหานคร'];

    const data = [
      { name: 'ตะวันออกเฉียงเหนือ', count: counts['ตะวันออกเฉียงเหนือ'], color: 'bg-emerald-600', textColor: 'text-white' },
      { name: 'กลาง', count: centralCount, color: 'bg-emerald-500', textColor: 'text-white' },
      { name: 'เหนือ', count: counts['เหนือ'], color: 'bg-teal-500', textColor: 'text-white' },
      { name: 'ใต้', count: counts['ใต้'], color: 'bg-teal-400', textColor: 'text-white' },
      { name: 'ตะวันออก', count: counts['ตะวันออก'], color: 'bg-cyan-500', textColor: 'text-white' },
      { name: 'ตะวันตก', count: counts['ตะวันตก'], color: 'bg-sky-400', textColor: 'text-white' },
    ].sort((a, b) => b.count - a.count);

    return data;
  }, [plots]);

  const totalPlots = plots.length;
  const maxCount = useMemo(() => Math.max(...regionData.map(r => r.count), 1), [regionData]);

  return (
    <div className="w-full h-full flex flex-col justify-center p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
      <h4 className="text-lg font-semibold text-slate-700 mb-4 text-center">จำนวนแปลงสำรวจรายภาค</h4>
      <div className="space-y-2.5">
        {regionData.map(region => (
          <div key={region.name} className="flex items-center gap-3 group">
            <span className="w-32 text-sm text-slate-600 text-right flex-shrink-0">{region.name}</span>
            <div className="flex-grow bg-slate-200 rounded-full h-7">
              <div
                className={`${region.color} h-7 rounded-full flex items-center justify-start px-3 transition-all duration-500 ease-out`}
                style={{ width: `${(region.count / maxCount) * 100}%` }}
              >
                <span className={`text-sm font-bold ${region.textColor}`}>{region.count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-4 text-sm font-semibold text-slate-600">รวมทั้งสิ้น {totalPlots} แปลง</div>
    </div>
  );
};

const SummaryCard: React.FC<{ icon: React.ElementType; value: string; label: string; color: string }> = ({ icon: Icon, value, label, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transition-all hover:shadow-lg hover:scale-105">
    <div className={`p-3 rounded-full ${color}`}>
      <Icon className="h-8 w-8 text-white" />
    </div>
    <div>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  </div>
);

const PlotTypeChart: React.FC<{ data: { label: string; count: number; color: string }[] }> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const maxCount = Math.max(...data.map(item => item.count), 1);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <ChartPieIcon className="w-6 h-6 text-emerald-600" />
        <span>สัดส่วนแปลงสำรวจตามประเภท</span>
      </h3>
      <div className="space-y-4 flex-grow flex flex-col justify-center">
        {data.map(item => (
          <div key={item.label}>
            <div className="flex justify-between mb-1 text-sm">
              <span className="font-medium text-slate-700">{item.label}</span>
              <span className="text-slate-500">{item.count} แปลง ({(item.count / total * 100).toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div className={`${item.color} h-3 rounded-full transition-all duration-500 ease-out`} style={{ width: `${(item.count / maxCount) * 100}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SurveySummaryDashboard: React.FC<{ plots: Plot[] }> = ({ plots }) => {
  const summary = useMemo(() => {
    const plotsByType: Record<string, number> = {
      'สวนสาธารณะ': 0,
      'พื้นที่สีเขียวอรรถประโยชน์': 0,
      'พื้นที่สีเขียวริมเส้นทางสัญจร': 0,
      'ไม่ระบุ': 0,
    };
    let totalTrees = 0;
    let totalBiomassKg = 0;

    for (const plot of plots) {
      if (plotsByType[plot.type] !== undefined) {
        plotsByType[plot.type]++;
      }
      totalTrees += plot.tagCount || 0;
      const biomassValue = parseFloat(String(plot.biomass).replace(/,/g, ''));
      if (!isNaN(biomassValue)) {
        totalBiomassKg += biomassValue;
      }
    }

    const plotTypeData = [
      { label: 'พื้นที่สีเขียวอรรถประโยชน์', count: plotsByType['พื้นที่สีเขียวอรรถประโยชน์'], color: 'bg-yellow-500' },
      { label: 'สวนสาธารณะ', count: plotsByType['สวนสาธารณะ'], color: 'bg-green-500' },
      { label: 'พื้นที่สีเขียวริมเส้นทางสัญจร', count: plotsByType['พื้นที่สีเขียวริมเส้นทางสัญจร'], color: 'bg-sky-500' },
    ].sort((a, b) => b.count - a.count);

    return {
      plotTypeData,
      totalTrees,
      totalBiomassTonnes: totalBiomassKg / 1000,
    };
  }, [plots]);

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center">
        สรุปข้อมูลแปลงสำรวจ
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="space-y-6 flex flex-col justify-around">
          <SummaryCard 
            icon={TreeIcon} 
            value={summary.totalTrees.toLocaleString('en-US')} 
            label="จำนวนต้นไม้ที่สำรวจทั้งหมด" 
            color="bg-green-500" 
          />
          <SummaryCard 
            icon={ScaleIcon} 
            value={summary.totalBiomassTonnes.toLocaleString('en-US', { maximumFractionDigits: 0 })} 
            label="มวลชีวภาพสะสมทั้งหมด (ตัน)" 
            color="bg-blue-500" 
          />
        </div>
        <div>
          <PlotTypeChart data={summary.plotTypeData} />
        </div>
      </div>
    </section>
  );
};

const FamilyDistributionChart: React.FC<{ 
  title: string;
  data: { name: string; count: number }[];
  totalCount: number;
  unitLabel: string;
}> = ({ title, data, totalCount, unitLabel }) => {
  const maxCount = Math.max(...data.map(item => item.count), 1);
  const colors = ['bg-emerald-600', 'bg-emerald-500', 'bg-teal-500', 'bg-teal-400', 'bg-cyan-500', 'bg-sky-400'];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <ChartBarIcon className="w-6 h-6 text-emerald-600" />
        <span>{title}</span>
      </h3>
      <div className="space-y-3 flex-grow flex flex-col justify-center">
        {data.map((item, index) => (
          <div key={item.name}>
            <div className="flex justify-between mb-1 text-sm">
              <span className="font-medium text-slate-700">{item.name}</span>
              <span className="text-slate-500">{item.count.toLocaleString()} {unitLabel} ({(item.count / totalCount * 100).toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4">
              <div
                className={`${colors[index % colors.length]} h-4 rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MiniStatCard: React.FC<{ value: string; label: string; }> = ({ value, label }) => (
  <div className="bg-teal-50 p-4 rounded-lg text-center transition-transform hover:scale-105">
    <p className="text-2xl md:text-3xl font-bold text-teal-700">{value}</p>
    <p className="text-xs font-medium text-slate-600 mt-1">{label}</p>
  </div>
);

const SpeciesSummaryDashboard: React.FC<{ species: Species[] }> = ({ species }) => {
  const summary = useMemo(() => {
    const familyTreeCounts: Record<string, number> = {};
    
    const validSpecies = species.filter(s => 
        s.botanicalNoAuthor && s.botanicalNoAuthor !== 'N/A' && 
        s.family && s.family !== 'N/A'
    );

    const uniqueBotanicalNames = new Set<string>();
    const uniqueGenera = new Set<string>();
    const uniqueFamilies = new Set<string>();
    let totalTrees = 0;

    for (const s of validSpecies) {
      uniqueBotanicalNames.add(s.botanicalNoAuthor);

      const genus = s.botanicalNoAuthor.split(' ')[0];
      if (genus) {
        uniqueGenera.add(genus);
      }

      uniqueFamilies.add(s.family);

      const treeCount = s.tagCount || 0;
      familyTreeCounts[s.family] = (familyTreeCounts[s.family] || 0) + treeCount;
      totalTrees += treeCount;
    }

    const speciesPerFamily: Record<string, Set<string>> = {};
    for (const s of validSpecies) {
        if (!speciesPerFamily[s.family]) {
            speciesPerFamily[s.family] = new Set();
        }
        speciesPerFamily[s.family].add(s.botanicalNoAuthor);
    }
    const familySpeciesCounts: Record<string, number> = {};
    for (const family in speciesPerFamily) {
        familySpeciesCounts[family] = speciesPerFamily[family].size;
    }

    const familyTreeData = Object.entries(familyTreeCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const familySpeciesData = Object.entries(familySpeciesCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return {
      speciesCount: uniqueBotanicalNames.size,
      genusCount: uniqueGenera.size,
      familyCount: uniqueFamilies.size,
      familyTreeData,
      familySpeciesData,
      totalTrees,
    };
  }, [species]);

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center">
        สรุปข้อมูลชนิดพันธุ์
      </h2>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-center space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-2 text-center">ภาพรวมความหลากหลายทางชีวภาพ</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <MiniStatCard value={summary.familyCount.toLocaleString('en-US')} label="วงศ์ (Family)" />
                <MiniStatCard value={summary.genusCount.toLocaleString('en-US')} label="สกุล (Genus)" />
                <MiniStatCard value={summary.speciesCount.toLocaleString('en-US')} label="ชนิด (Species)" />
                <MiniStatCard value="97,909" label="ภาพถ่าย" />
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <FamilyDistributionChart 
            title="วงศ์ (Family) ที่พบมากที่สุด 6 อันดับแรก (ตามจำนวนต้น)"
            data={summary.familyTreeData} 
            totalCount={summary.totalTrees}
            unitLabel="ต้น"
          />
          <FamilyDistributionChart 
            title="วงศ์ (Family) ที่พบมากที่สุด 6 อันดับแรก (ตามจำนวนชนิด)"
            data={summary.familySpeciesData} 
            totalCount={summary.speciesCount}
            unitLabel="ชนิด"
          />
        </div>
      </div>
    </section>
  );
};


// --- Main HomePage Component ---

const HomePage: React.FC = () => {
  const { plots, loading: plotsLoading, error: plotsError } = useSurveyData();
  const { species, loading: speciesLoading, error: speciesError } = useSpeciesData();

  const objectives = [
    { title: 'จัดตั้งแปลงสำรวจถาวร', description: 'จัดตั้งและติดตามแปลงสำรวจถาวร 210 แปลงทั่วประเทศ เพื่อประเมินพื้นที่สีเขียวในเมืองอย่างเป็นระบบ', icon: TableIcon },
    { title: 'พัฒนาสมการและประเมินผล', description: 'พัฒนาวิธีการคำนวณและสมการกลาง เพื่อประมวลผลการสะสมคาร์บอนของพื้นที่สีเขียวในเมือง', icon: ChartBarIcon },
    { title: 'จัดทำเส้นฐานอ้างอิง', description: 'จัดทำเส้นฐานอ้างอิง (Reference Level) สำหรับการประเมินการสะสมคาร์บอน (Carbon Pool) ในพื้นที่สีเขียว', icon: MapIcon },
    { title: 'พัฒนาระบบและแพลตฟอร์ม', description: 'พัฒนาระบบดิจิทัลเพื่อการประเมินและรายงานผลการสะสมคาร์บอนของพื้นที่สีเขียวในเมืองอย่างต่อเนื่อง', icon: CodeIcon },
  ];

  const greenAreaTypes = [
    { title: 'สวนสาธารณะ', description: 'พื้นที่สีเขียวขนาดใหญ่ที่เปิดให้ประชาชนทั่วไปเข้าใช้เพื่อการพักผ่อนหย่อนใจ ออกกำลังกาย และจัดกิจกรรมต่างๆ เป็นปอดสำคัญของเมืองที่ช่วยดูดซับมลพิษและสร้างสภาพแวดล้อมที่ดี', icon: MapPinIcon, bgColor: 'bg-white' },
    { title: 'พื้นที่สีเขียวอรรถประโยชน์', description: 'พื้นที่สีเขียวในบริเวณหน่วยงานต่างๆ เช่น โรงเรียน มหาวิทยาลัย วัด หรือสถานที่ราชการ ซึ่งนอกจากจะสร้างความร่มรื่นแล้ว ยังใช้เป็นแหล่งเรียนรู้และพื้นที่กิจกรรมสำหรับองค์กรนั้นๆ', icon: TableIcon, bgColor: 'bg-white' },
    { title: 'พื้นที่สีเขียวริมเส้นทางสัญจร', description: 'แนวต้นไม้บริเวณริมถนน เกาะกลางถนน หรือทางเท้า มีบทบาทสำคัญในการลดอุณหภูมิในเมือง ลดมลพิษทางอากาศและเสียง ทั้งยังสร้างทัศนียภาพที่สวยงาม', icon: MapIcon, bgColor: 'bg-white' },
    { title: 'สวนหย่อมและพื้นที่ว่าง', description: 'พื้นที่สีเขียวขนาดเล็กที่แทรกตัวอยู่ในชุมชนเมืองหรือพื้นที่ว่างที่ได้รับการพัฒนา เป็นจุดพักผ่อนขนาดเล็กที่เข้าถึงง่าย ช่วยเพิ่มพื้นที่สีเขียวในบริเวณที่มีความหนาแน่นสูง', icon: ChartPieIcon, bgColor: 'bg-slate-50' },
    { title: 'พื้นที่สีเขียวในที่ส่วนบุคคล', description: 'สวนในบริเวณบ้านพักอาศัย พื้นที่สีเขียวของโครงการเอกชน เช่น คอนโดมิเนียม หรืออาคารสำนักงาน ซึ่งมีส่วนสำคัญอย่างยิ่งต่อภาพรวมของพื้นที่สีเขียวในเมือง', icon: TreeIcon, bgColor: 'bg-slate-50' },
    { title: 'พื้นที่สีเขียวเฉพาะทาง', description: 'พื้นที่ที่มีวัตถุประสงค์เฉพาะ เช่น สวนพฤกษศาสตร์เพื่อการอนุรักษ์พันธุ์พืช, พื้นที่เกษตรกรรมในเมือง, หรือพื้นที่สีเขียวรอบโบราณสถาน ซึ่งมีความสำคัญทั้งในเชิงนิเวศและวัฒนธรรม', icon: ChartBarIcon, bgColor: 'bg-slate-50' },
  ];

  const renderContent = () => {
    const loading = plotsLoading || speciesLoading;
    const error = plotsError || speciesError;

    if (loading) {
      return (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      );
    }

    return (
      <>
        {/* Project Scope Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center">ขอบเขตโครงการ</h2>
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm flex flex-col lg:flex-row items-center gap-8">
              <div className="w-full lg:w-1/2">
                  <h3 className="text-xl font-semibold text-slate-700">การวางแปลงสำรวจ</h3>
                  <p className="text-slate-600 mt-2">โครงการได้จัดตั้งแปลงสำรวจถาวรจำนวน 210 แปลง กระจายตัวอยู่ทั่วทุกภูมิภาคของประเทศไทย ครอบคลุมพื้นที่สีเขียวในเมือง 3 ประเภทหลัก ได้แก่:</p>
                  <ul className="list-disc list-inside text-slate-600 mt-4 space-y-2">
                      <li><strong>สวนสาธารณะ:</strong> พื้นที่สีเขียวที่จัดไว้เพื่อการพักผ่อนหย่อนใจ</li>
                      <li><strong>พื้นที่สีเขียวอรรถประโยชน์:</strong> เช่น พื้นที่ในวัด โรงเรียน สถานที่ราชการ</li>
                      <li><strong>พื้นที่สีเขียวริมเส้นทางสัญจร:</strong> เช่น เกาะกลางถนน แนวต้นไม้ริมทาง</li>
                  </ul>
                  <p className="text-slate-600 mt-4">การกระจายตัวของแปลงสำรวจนี้ช่วยให้สามารถประเมินการสะสมคาร์บอนได้อย่างครอบคลุมและเป็นตัวแทนของพื้นที่สีเขียวในเมืองของประเทศไทย</p>
              </div>
              <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
                  <RegionPlotChart plots={plots} />
              </div>
          </div>
        </section>

        {/* Green Area Types Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center">ประเภทพื้นที่สีเขียว</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {greenAreaTypes.map((type) => (
              <GreenAreaTypeCard key={type.title} icon={type.icon} title={type.title} description={type.description} bgColor={type.bgColor} />
            ))}
          </div>
        </section>

        {/* Operational Procedure Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center">ขั้นตอนการดำเนินงาน</h2>
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">การวางแปลงสำรวจและการเก็บข้อมูลภาคสนาม</h3>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                โครงการได้ดำเนินการจัดตั้งแปลงสำรวจถาวรขนาด 40x40 เมตร (1 ไร่) จำนวนทั้งสิ้น 210 แปลงทั่วประเทศ โดยใช้วิธีการวางแผนอย่างเป็นระบบ (Systematic Sampling) เพื่อให้ครอบคลุมพื้นที่สีเขียวในเมือง 3 ประเภทหลัก ได้แก่ สวนสาธารณะ, พื้นที่สีเขียวอรรถประโยชน์ และพื้นที่สีเขียวริมเส้นทางสัญจร การวางแปลงในลักษณะนี้ช่วยให้ได้ข้อมูลที่เป็นตัวแทนของความหลากหลายของพรรณไม้และการสะสมคาร์บอนในบริบทของเมืองไทย
              </p>
              <p>
                ภายในแต่ละแปลงสำรวจ ต้นไม้ทุกต้นที่มีขนาดเส้นผ่านศูนย์กลางเพียงอก (DBH) ตั้งแต่ 4.5 เซนติเมตรขึ้นไป จะได้รับการติดหมายเลข (Tagging) และตรวจวัดข้อมูลพื้นฐานที่สำคัญ เช่น การวัดขนาดเส้นผ่านศูนย์กลางลำต้น และการวัดความสูงของต้นไม้ ข้อมูลเหล่านี้เป็นปัจจัยหลักที่ใช้ในการคำนวณมวลชีวภาพ (Biomass) และประเมินปริมาณการสะสมคาร์บอนของต้นไม้แต่ละต้นและของทั้งแปลงสำรวจ
              </p>
              <p>
                นอกเหนือจากการตรวจวัดเชิงปริมาณแล้ว โครงการยังให้ความสำคัญกับการเก็บข้อมูลเชิงคุณภาพ โดยมีการถ่ายภาพพรรณไม้แต่ละชนิดที่พบในแปลงสำรวจอย่างละเอียด ภาพถ่ายจะประกอบด้วยส่วนต่างๆ ของพืช เช่น ใบ ดอก ผล และลักษณะเปลือกไม้ เพื่อใช้ในการระบุและยืนยันชนิดพันธุ์ให้ถูกต้องแม่นยำ ภาพถ่ายเหล่านี้ถือเป็นข้อมูลตั้งต้นที่สำคัญอย่างยิ่งในการพัฒนาระบบปัญญาประดิษฐ์ (AI Taxonomy) สำหรับจำแนกชนิดพันธุ์ไม้อัตโนมัติ และสร้างเป็นคลังข้อมูลภาพถ่ายพรรณไม้ในเมืองที่สมบูรณ์ต่อไป
              </p>
            </div>
          </div>
        </section>

        {/* --- Survey Summary Dashboard --- */}
        <SurveySummaryDashboard plots={plots} />

        {/* --- Species Summary Dashboard --- */}
        <SpeciesSummaryDashboard species={species} />

        {/* --- Carbon Assessment Section --- */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center">การประเมินปริมาณคาร์บอนสะสม</h2>
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">การพัฒนาสมการกลาง (Central Allometric Equation)</h3>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                หัวใจสำคัญของการประเมินปริมาณคาร์บอนสะสมคือการคำนวณมวลชีวภาพเหนือพื้นดิน (Above-Ground Biomass: AGB) ของต้นไม้แต่ละต้น โครงการได้พัฒนาระบบสมการกลาง (Central Allometric Equation) ที่มีความแม่นยำสูง เพื่อใช้ประเมินมวลชีวภาพในส่วนต่างๆ ของต้นไม้ ได้แก่ ลำต้น (Stem) กิ่ง (Branch) และใบ (Leaf) ซึ่งทำให้การประเมินการกักเก็บคาร์บอนมีความสมบูรณ์และสอดคล้องกับลักษณะของพรรณไม้ในเมืองของประเทศไทยมากยิ่งขึ้น
              </p>
              <p>
                สมการเหล่านี้ได้รับการพัฒนาขึ้นโดยใช้เทคโนโลยีการสแกนด้วยเลเซอร์ภาคพื้นดิน (Terrestrial Laser Scanning: TLS) ซึ่งสามารถสร้างแบบจำลองสามมิติของต้นไม้และคำนวณปริมาตรและมวลชีวภาพได้อย่างแม่นยำ ข้อมูลที่ได้จาก TLS ถูกนำมาสร้างแบบจำลองทางสถิติร่วมกับข้อมูลความหนาแน่นของเนื้อไม้ (Wood Density) จากเอกสารอ้างอิง ทำให้ได้แบบจำลองที่มีความน่าเชื่อถือสูง (R² = 0.991) สำหรับการประเมินมวลชีวภาพจากข้อมูลที่เก็บรวบรวมได้ง่ายจากภาคสนาม
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-6">
                {/* Left Column: Equations */}
                <div className="bg-slate-100 p-6 rounded-lg text-left font-mono text-slate-800 tracking-wider space-y-2 self-start">
                  <p>W<sub>S</sub> = 0.000201 × (WD × D<sup>2</sup>H)<sup>0.891</sup></p>
                  <p>W<sub>B</sub> = 0.0000043 × (WD × D<sup>2</sup>H)<sup>1.102</sup></p>
                  <p>W<sub>L</sub> = (28 / (W<sub>S</sub> + W<sub>B</sub> + 0.025))<sup>-1</sup></p>
                  <p>W<sub>T</sub> = W<sub>S</sub> + W<sub>B</sub> + W<sub>L</sub></p>
                </div>

                {/* Right Column: Definitions */}
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">โดยที่:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li><strong>W<sub>S</sub></strong>: มวลชีวภาพเหนือพื้นดินในส่วนลำต้น (กก.)</li>
                    <li><strong>W<sub>B</sub></strong>: มวลชีวภาพเหนือพื้นดินในส่วนกิ่ง (กก.)</li>
                    <li><strong>W<sub>L</sub></strong>: มวลชีวภาพเหนือพื้นดินในส่วนใบ (กก.)</li>
                    <li><strong>W<sub>T</sub></strong>: มวลชีวภาพเหนือพื้นดินทั้งหมด (กก.)</li>
                    <li><strong>D</strong>: ขนาดเส้นผ่านศูนย์กลางเพียงอก (DBH) ที่ 1.30 เมตร (ซม.)</li>
                    <li><strong>H</strong>: ความสูงทั้งหมดของต้นไม้ (เมตร)</li>
                    <li><strong>WD</strong>: ความหนาแน่นของเนื้อไม้ (กก./ม.<sup>3</sup>)</li>
                  </ul>
                  <p className="text-xs text-slate-500 mt-4">* สมการ W<sub>L</sub> เป็นสูตรพรรณไม้ทั่วไปจาก Ogawa et al. (1965)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Carbon Assessment using Satellite Imagery Section --- */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center">
            การประเมินปริมาณคาร์บอนด้วยภาพถ่ายจากดาวเทียม
          </h2>
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-1/2">
              <h3 className="text-xl font-semibold text-slate-700 mb-4">การวิเคราะห์เชิงพื้นที่ด้วย AI และข้อมูลดาวเทียม</h3>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  นอกเหนือจากการสำรวจภาคสนามในแปลงถาวร โครงการยังใช้เทคโนโลยีการสำรวจระยะไกล (Remote Sensing) โดยวิเคราะห์ข้อมูลจากภาพถ่ายดาวเทียมความละเอียดสูงร่วมกับปัญญาประดิษฐ์ (AI) เพื่อประเมินการสะสมคาร์บอนในภาพรวมครอบคลุมพื้นที่ในเขตเมืองทั่วประเทศ วิธีการนี้ช่วยให้เราสามารถขยายผลการประเมินจากระดับแปลงสำรวจไปสู่ระดับภูมิทัศน์เมือง ทำให้มองเห็นภาพรวมของพื้นที่สีเขียวและการกักเก็บคาร์บอนในวงกว้าง
                </p>
                <p>
                  แบบจำลอง AI ได้รับการฝึกฝนให้สามารถจำแนกประเภทการใช้ประโยชน์ที่ดินและระบุประเภทของพื้นที่สีเขียวรูปแบบต่างๆ จากภาพถ่ายดาวเทียม เช่น สวนสาธารณะ พื้นที่เกษตรกรรม หรือหย่อมไม้ในเมือง จากนั้นจึงนำข้อมูลเหล่านี้มาประยุกต์ใช้กับสมการที่ได้จากการสำรวจภาคสนาม เพื่อประเมินปริมาณการสะสมคาร์บอน (Carbon Stock) ในแต่ละพื้นที่ ผลลัพธ์ที่ได้จะถูกนำมาแสดงผลในรูปแบบแผนที่เชิงพื้นที่ (Spatial Map) ซึ่งแสดงการกระจายตัวของคาร์บอนที่สะสมอยู่ในมวลชีวภาพของพรรณไม้
                </p>
                <p>
                  ข้อมูลเชิงพื้นที่นี้มีประโยชน์อย่างยิ่งต่อการวางแผนและกำหนดนโยบายด้านสิ่งแวดล้อมของเมือง ช่วยให้ผู้มีส่วนเกี่ยวข้องสามารถระบุพื้นที่ที่มีศักยภาพในการกักเก็บคาร์บอนสูง พื้นที่ที่ควรส่งเสริมให้มีการเพิ่มพื้นที่สีเขียว หรือติดตามการเปลี่ยนแปลงของพื้นที่สีเขียวเมื่อเวลาผ่านไป ซึ่งเป็นเครื่องมือสำคัญในการขับเคลื่อนเมืองไปสู่เป้าหมายการพัฒนาที่ยั่งยืนและเป็นมิตรต่อสิ่งแวดล้อม
                </p>
              </div>
            </div>
            <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
                <img src="./data/AiSpatial.png" alt="แผนที่แสดงผลการวิเคราะห์เชิงพื้นที่" className="rounded-lg shadow-lg w-full h-auto object-cover" />
            </div>
          </div>
        </section>

        {/* --- AI Taxonomy Section --- */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center">
            การจำแนกชนิดพันธุ์ไม้ด้วยปัญญาประดิษฐ์
          </h2>
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-1/2">
                <img src="./data/AiTaxonomy.png" alt="AI Taxonomy plant identification app interface on a smartphone" className="rounded-lg shadow-lg w-full h-auto object-cover" />
            </div>
            <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
              <h3 className="text-xl font-semibold text-slate-700 mb-4">การพัฒนาแบบจำลอง AI เพื่อการระบุชนิดพันธุ์พืช</h3>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  การระบุชนิดพันธุ์พืชให้ถูกต้องแม่นยำเป็นขั้นตอนพื้นฐานที่สำคัญในการประเมินความหลากหลายทางชีวภาพและการสะสมคาร์บอน แต่ต้องอาศัยความเชี่ยวชาญเฉพาะทาง โครงการจึงได้พัฒนาระบบ "AI Taxonomy" ซึ่งเป็นแบบจำลองปัญญาประดิษฐ์ที่ทำหน้าที่เป็นผู้เชี่ยวชาญด้านพฤกษศาสตร์ดิจิทัล ช่วยให้การจำแนกชนิดพันธุ์ไม้ในเมืองเป็นเรื่องง่ายและเข้าถึงได้สำหรับทุกคน
                </p>
                <p>
                  ผู้ใช้งานสามารถถ่ายภาพหรืออัปโหลดรูปภาพส่วนต่างๆ ของพืช เช่น ใบ ดอก หรือผล ผ่านแพลตฟอร์ม จากนั้นระบบ AI จะวิเคราะห์ลักษณะทางสัณฐานวิทยาที่ปรากฏในภาพ แล้วเปรียบเทียบกับฐานข้อมูลขนาดใหญ่เพื่อระบุชนิดพันธุ์ที่เป็นไปได้มากที่สุด พร้อมแสดงผลเป็นชื่อสามัญ ชื่อวิทยาศาสตร์ และข้อมูลเบื้องต้น
                </p>
                <p>
                  หัวใจของระบบนี้คือคลังข้อมูลภาพถ่ายพรรณไม้กว่า 97,000 ภาพ ที่ถูกเก็บรวบรวมอย่างละเอียดจากแปลงสำรวจถาวรทั่วประเทศ ข้อมูลภาพถ่ายชุดนี้ถูกนำมาใช้ฝึกฝนแบบจำลองการเรียนรู้เชิงลึก (Deep Learning) ทำให้ AI มีความสามารถในการจดจำและแยกแยะลักษณะเฉพาะของพรรณไม้ในบริบทของเมืองไทยได้อย่างแม่นยำ
                </p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <div className="space-y-12 md:space-y-16 th-font">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-700">โครงการประเมินการสะสมคาร์บอนในพื้นที่สีเขียว</h1>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">ขับเคลื่อนประเทศไทยสู่เป้าหมายความเป็นกลางทางคาร์บอน (Carbon Neutrality) ภายในปี 2050 และการปล่อยก๊าซเรือนกระจกสุทธิเป็นศูนย์ (Net Zero) ในปี 2065</p>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard value="46.9M" label="ตันคาร์บอน" description="ปริมาณคาร์บอนสะสม (Carbon Stock) ปี 2566" />
        <StatCard value="4.6M" label="ตัน CO₂/ปี" description="การดูดซับคาร์บอนสุทธิ (Carbon Sink) ปี 2566" />
        <StatCard value="210" label="แปลง" description="แปลงสำรวจถาวรทั่วประเทศ" />
        <StatCard value="395+" label="ชนิดพันธุ์" description="ฐานข้อมูลพรรณไม้ในเมือง" />
      </section>

      {/* Objectives Section */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center">วัตถุประสงค์โครงการ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {objectives.map((obj) => (
            <ObjectiveCard key={obj.title} icon={obj.icon} title={obj.title} description={obj.description} />
          ))}
        </div>
      </section>

      {renderContent()}

      {/* Partners Section */}
      <section className="bg-white p-8 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">หน่วยงานที่เกี่ยวข้อง</h2>
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-slate-500 font-medium">
            <p>กรมการเปลี่ยนแปลงสภาพภูมิอากาศและสิ่งแวดล้อม (สส.)</p>
            <p>คณะวนศาสตร์ มหาวิทยาลัยเกษตรศาสตร์</p>
            <p>กรมพัฒนาที่ดิน</p>
            <p>องค์กรปกครองส่วนท้องถิ่น</p>
            <p>GISTDA</p>
            <p>อบก.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
