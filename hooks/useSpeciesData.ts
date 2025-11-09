import { useState, useEffect } from 'react';
import { Species } from '../types';
import { parseSpeciesData } from '../data/sourceData';
/*
export const useSpeciesData = () => {
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const [speciesRes, woodDensityRes] = await Promise.all([
          fetch('/data/species.csv'),
          fetch('/data/wood_density.csv')
        ]);

        if (!speciesRes.ok || !woodDensityRes.ok) {
          throw new Error(`HTTP error! Could not fetch all required species data.`);
        }

        const speciesCsv = await speciesRes.text();
        const woodDensityCsv = await woodDensityRes.text();
        
        const parsedSpecies = parseSpeciesData(speciesCsv, woodDensityCsv);
        setSpecies(parsedSpecies);
      } catch (e) {
        console.error("Failed to fetch or parse species data:", e);
        setError("ไม่สามารถโหลดข้อมูลชนิดพันธุ์ได้");
      } finally {
        setLoading(false);
      }
    };

    fetchSpecies();
  }, []);

  return { species, loading, error };
};
*/

// 1. นำเนื้อหาจากไฟล์ "species.csv" ทั้งหมดมาวางที่นี่
const speciesCsvDataString = `Thai_Name,Botanical_NoAuthor,Botanical_Name,Count_Tags,Cout_GBH_2023,Cout_GBH_2025,Min_Height_2023,Mean_Height_2023,Max_Height_2023,Min_Height_2025,Mean_Height_2025,Max_Height_2025
กรวยป่า,Casearia grewiifolia,Casearia grewiifolia Vent.,7,7,7,5,8.13,14,5.8,9.1,12.2
กระดังงาไทย,Cananga odorata,"Cananga odorata (Lam.) Hook.f. & Thomson",2,2,2,17.3,18.8,20.3,21,21.6,22.2
กระถินณรงค์,Acacia auriculiformis,"Acacia auriculiformis A.Cunn. ex Benth.",90,37,88,4.5,9.9,17.2,1.1,10.87,61.1
กระถินยักษ์,Leucaena leucocephala,"Leucaena leucocephala (Lam.) de Wit",63,18,55,3.6,6.33,10,4,7.1,13.5
กระถินเทพา,Acacia mangium,Acacia mangium Willd.,119,3,119,10.2,12.13,14.2,0,11.88,24.8
กระทิง,Calophyllum inophyllum,Calophyllum inophyllum L.,31,19,31,3.5,10.07,17.2,5.1,10.07,17.6
กระทุ่ม,Neolamarckia cadamba,"Neolamarckia cadamba (Roxb.) Bosser",11,2,11,12,12,12,9.9,15.8,21.1
กระท่อมหมู,Mitragyna rotundifolia,"Mitragyna rotundifolia (Roxb.) Kuntze",92,70,88,3.6,8.53,16,4,8.65,20
กระทุ่มนา,Mitragyna diversifolia,"Mitragyna diversifolia (Wall. ex G.Don) Havil.",12,2,12,7.5,7.75,8,4.6,7.8,11
กระท้อน,Sandoricum koetjape,"Sandoricum koetjape (Burm.f.) Merr.",21,13,21,5,9.34,18.4,5.9,13.29,21.1
กระบก,Irvingia malayana,Irvingia malayana Oliv. ex A.W.Benn.,24,13,24,3.7,8.95,15,4.4,11.56,22
กระบาก,Anisoptera costata,Anisoptera costata Korth.,12,6,12,8,16.5,24,7.1,14.53,26
กระพี้จั่น,Millettia brandisiana,Millettia brandisiana Kurz,48,18,44,4,6.99,12,3,7.71,13.8
กระพี้นางนวล,Dalbergia cana,Dalbergia cana Graham ex Kurz,6,5,6,2,7.76,17.8,3.3,8.68,15.5
กระพี้เขาควาย,Dalbergia cultrata,Dalbergia cultrata T.S.Ralph,52,49,52,1.5,7.9,15.5,1.5,9.08,18.4
กระมอบ,Gardenia obtusifolia,Gardenia obtusifolia Roxb. ex Kurz,3,0,3,,,,4,4.87,6.1
กระเชา,Holoptelea integrifolia,"Holoptelea integrifolia (Roxb.) Planch.",6,3,6,12.1,14.13,15.5,4.3,17.2,24.6
กระเบากลัก,Hydnocarpus ilicifolius,Hydnocarpus ilicifolius King,19,0,19,,,,5.8,11.04,18
กระเบาน้ำ,Hydnocarpus castaneus,"Hydnocarpus castaneus Hook.f. & Thomson",4,0,4,,,,4.2,4.53,5.2
กระเบียน,Ceriscoides turgida,"Ceriscoides turgida (Roxb.) Tirveng.",7,0,7,,,,5.6,7.11,8.7
กระแจะ,Naringi crenulata,"Naringi crenulata (Roxb.) Nicolson",5,4,4,3.5,10.43,20,11.4,14.47,18
กระโดน,Careya arborea,Careya arborea Roxb.,15,10,15,5.5,8.88,14.3,2.3,9.1,23.6
กริม,Aporosa planchoniana,"Aporosa planchoniana Baill. ex Müll.Arg.",38,0,38,,,,4,8.09,16.2
กร่าง,Ficus altissima,Ficus altissima Blume,5,5,5,3,4.36,5.2,3,4.26,5.87
กฤษณา,Aquilaria crassna,Aquilaria crassna Pierre ex Lecomte,7,0,7,,,,2,7.29,16.6
กลึงกล่อม,Polyalthia suberosa,"Polyalthia suberosa (Roxb.) Thwaites",2,0,2,,,,3.1,4.6,6.1
กล้วยน้อย,Xylopia vielana,Xylopia vielana Pierre,3,0,3,,,,11.5,13.6,17
กะตังใบ,Leea indica,"Leea indica (Burm.f.) Merr.",1,1,1,2.7,2.7,2.7,5.2,5.2,5.2
กะทังใบใหญ่,Litsea grandis,"Litsea grandis (Nees) Hook.f.",3,2,3,6,6.25,6.5,8,8.87,10.3
กะลิง,Diospyros pilosanthera,Diospyros pilosanthera Blanco,5,4,5,6,6.95,7.8,5.5,6.98,10.2
กะอวม,Acronychia pedunculata,"Acronychia pedunculata (L.) Miq.",21,1,21,4.8,4.8,4.8,5.2,9.78,16.4
กะออก,Artocarpus elasticus,Artocarpus elasticus Reinw. ex Blume,5,5,5,5.5,16.8,25.3,7.2,17.1,30.1
กะอาม,Crypteronia paniculata,Crypteronia paniculata Blume,6,6,6,4.5,11.2,15,6,11.03,15
กะเจียน,Huberantha cerasoides,"Huberantha cerasoides (Roxb.) Chaowasku",46,31,44,3.2,7.34,12.9,4,8.46,25.8
กะเหรี่ยง,Ficus capillipes,Ficus capillipes Gagnep.,1,0,1,,,,14,14,14
กัดลิ้น,Walsura trichostemon,Walsura trichostemon Miq.,12,9,12,0,6.56,17,4.2,7.91,12.7
กันเกรา,Cyrtophyllum fragrans,"Cyrtophyllum fragrans (Roxb.) DC.",15,3,15,3.2,4.9,7.5,5,10.15,15.1
กัลปพฤกษ์,Cassia bakeriana,Cassia bakeriana Craib,32,20,28,2.3,7.88,12.7,3.34,10.23,15.9
กางขี้มอด,Albizia odoratissima,"Albizia odoratissima (L.f.) Benth.",4,3,4,6.2,9.37,13.2,6.8,9.68,13.8
กานพลู,Pellacalyx parkinsonii,Pellacalyx parkinsonii C.E.C.Fisch.,1,1,1,12.5,12.5,12.5,31.9,31.9,31.9
การบูร,Cinnamomum camphora,"Cinnamomum camphora (L.) J.Presl",1,1,0,9.2,9.2,9.2,,,
กาลน,Elaeocarpus floribundus,Elaeocarpus floribundus Blume,8,8,8,4.5,12.32,25.3,7.2,16.19,27.5
กาสามปีก,Vitex peduncularis,Vitex peduncularis Wall. ex Schauer,55,27,55,5.1,9.74,15,4.8,10.8,23.5
กาฬพฤกษ์,Cassia grandis,Cassia grandis L.f.,20,19,10,7,8.48,12,7.3,10.95,13
กำลังช้างเผือก,Hiptage candicans,Hiptage candicans Hook.f.,1,0,1,,,,3.8,3.8,3.8
กุ่มน้ำ,Crateva magna,"Crateva magna (Lour.) DC.",5,1,4,3.9,3.9,3.9,10.5,12.2,15.3
กุ่มบก,Crateva adansonii,Crateva adansonii DC.,18,7,18,1.8,4.14,6,3.2,7.72,13
กุ๊ก,Lannea coromandelica,"Lannea coromandelica (Houtt.) Merr.",82,32,79,2.2,8.85,15,2.9,9.74,24
ก่อคอแลน,Castanopsis nephelioides,Castanopsis nephelioides King ex Hook.f.,2,2,2,12.3,13.75,15.2,13.6,14.2,14.8
ก่อบ้าน,Castanopsis wallichii,Castanopsis wallichii King ex Hook.f.,1,1,1,28.3,28.3,28.3,,,
ก่อแพะ,Quercus kerrii,Quercus kerrii Craib,1,0,1,,,,7.8,7.8,7.8
ก้านเหลือง,Nauclea orientalis,"Nauclea orientalis (L.) L.",31,0,31,,,,7.2,15.33,76
ขนุน,Artocarpus heterophyllus,Artocarpus heterophyllus Lam.,12,5,12,6,7.36,8,4.5,8.19,11.5
ขนุนนก,Palaquium obovatum,"Palaquium obovatum (Griff.) Engl.",2,2,2,8.6,19.55,30.5,9.2,10.45,11.7
ขนุนป่า,Artocarpus chama,Artocarpus chama Buch.-Ham.,1,0,1,,,,18,18,18
ขมิ้นต้น,Adina trichotoma,"Adina trichotoma (Zoll. & Moritzi) Benth. & Hook.f. ex B.D.Jacks.",4,4,4,4,7.13,10.7,7.2,9.18,11.3
ขว้าว,Haldina cordifolia,"Haldina cordifolia (Roxb.) Ridsdale",17,15,17,4.3,11.88,20,5.1,11.95,17.1
ขันทองพยาบาท,Suregada multiflora,"Suregada multiflora (A.Juss.) Baill.",27,7,27,5.6,8.84,12.7,2.7,8.29,16.9
ขางน้ำผึ้ง,Claoxylon indicum,"Claoxylon indicum (Reinw. ex Blume) Hassk.",1,1,1,5,5,5,8,8,8
ขางหัวหมู,Miliusa velutina,"Miliusa velutina (DC.) Hook.f. & Thomson",6,3,6,5.2,10.07,15,5.6,11.75,19
ขานาง,Homalium tomentosum,"Homalium tomentosum (Vent.) Benth.",5,0,5,,,,8,12.5,14.7
ขามคัวะ,Pterospermum semisagittatum,Pterospermum semisagittatum Ham. ex Roxb.,2,0,2,,,,6,8.85,11.7
ขี้มอด,Dalbergia lanceolaria var. lakhonensis,"Dalbergia lanceolaria var. lakhonensis (Gagnep.) Niyomdham & P.H.Hô",8,3,8,8.9,10.63,14,5.6,12.04,22.2
ขี้หนอน,Zollingeria dongnaiensis,Zollingeria dongnaiensis Pierre,9,2,9,9.8,12.75,15.7,4.5,14.27,30
ขี้อ้าย,Terminalia triptera,Terminalia triptera Stapf,40,39,37,4.3,12.77,24.3,3.7,9.2,15.8
ขี้เหล็ก,Senna siamea,"Senna siamea (Lam.) H.S.Irwin & Barneby",169,71,162,5.6,9.98,21,2.9,9.97,23
ขี้เหล็กอเมริกัน,Senna spectabilis,"Senna spectabilis (DC.) H.S.Irwin & Barneby",1,0,1,,,,9.4,9.4,9.4
ข่อย,Streblus asper,Streblus asper Lour.,314,203,304,2,6.95,17.8,1.6,6.77,23.5
คงคาเดือด,Arfeuillea arborescens,Arfeuillea arborescens Pierre ex Radlk.,3,2,3,7,7.75,8.5,6.51,9.1,10.9
คอร์เดีย,Cordia sebestena,Cordia sebestena L.,2,1,2,2.9,2.9,2.9,4.6,5.05,5.5
คอเหี้ย,Xerospermum noronhianum,"Xerospermum noronhianum (Blume) Blume.",3,3,3,3.4,4.77,6.3,2.3,4.27,6.2
คอแลน,Nephelium hypoleucum,Nephelium hypoleucum Kurz,17,13,17,3.1,7,13,0,18.03,137.6
คันแหลน,Psydrax nitidus,"Psydrax nitidus (Craib) K.M.Wong",1,0,1,,,,6,6,6
คาง,Albizia lebbekoides,"Albizia lebbekoides (DC.) Benth.",18,4,18,3.6,7.22,10,4,12.78,21.1
คำมอกหลวง,Gardenia sootepensis,Gardenia sootepensis Hutch.,10,1,10,5.8,5.8,5.8,4,6.46,12.4
คำรอก,Ellipanthus tomentosus,Ellipanthus tomentosus Kurz,27,10,27,2.1,4.88,7.2,2.8,8.91,41
คำแสด,Mallotus philippensis,"Mallotus philippensis (Lam.) Müll.Arg.",12,12,8,6,8.22,12,4.1,8.18,12.5
คูน,Cassia fistula,Cassia fistula L.,340,136,339,0.4,7.25,17,2.2,8.27,19
คูนขาว,Cassia × nealiae,"Cassia × nealiae H.S.Irwin & Barneby",6,0,6,,,,4.2,4.63,5.1
ค่างเต้น,Canthiumera robusta,"Canthiumera robusta K.M.Wong & X.Y.Ng",23,23,23,6.7,9.13,12.5,5,11.62,20.9
งาไซ,Planchonella obovata,"Planchonella obovata (R.Br.) Pierre",1,1,1,7.6,7.6,7.6,6.8,6.8,6.8
งิ้วดอกขาว,Bombax anceps,Bombax anceps Pierre,31,16,30,4.2,10.18,19.9,5.2,12.4,32.5
จักจั่น,Millettia xylocarpa,Millettia xylocarpa Miq.,60,24,60,4,8.18,26.7,3,8.71,16.4
จักหัน,Orophea polycarpa,Orophea polycarpa A.DC.,2,0,2,,,,6,9,12
จันดำ,Diospyros venosa,Diospyros venosa Wall. ex A.DC.,1,1,1,5.31,5.31,5.31,5.8,5.8,5.8
จันทน์กะพ้อ,Vatica diospyroides,Vatica diospyroides Symington,4,1,4,4,4,4,2.9,4.63,8
จันทน์หอม,Mansonia gagei,Mansonia gagei J.R.Drumm.,2,0,2,,,,8.8,10,11.2
จามจุรี,Samanea saman,"Samanea saman (Jacq.) Merr.",150,76,146,3.8,11.33,17.7,3.7,13,26.7
จำปา,Magnolia champaca,"Magnolia champaca (L.) Baill. ex Pierre",3,2,3,5.3,6.9,8.5,2.2,4.7,7.2
จำปี,Magnolia × alba,"Magnolia × alba (DC.) Figlar",5,4,5,4.1,9.42,14.5,2.7,8.22,16.5
จิกน้ำ,Barringtonia acutangula,"Barringtonia acutangula (L.) Gaertn.",22,16,21,2.7,7.08,14,3.4,6.71,10.2
จิกสวน,Barringtonia racemosa,"Barringtonia racemosa (L.) Gaertn.",1,1,1,4,4,4,5.8,5.8,5.8
ฉนวน,Dalbergia nigrescens,Dalbergia nigrescens Kurz,14,7,14,2.5,11.67,16.8,3.2,10.51,26.4
ชงโค,Bauhinia purpurea,Bauhinia purpurea L.,28,24,26,2.3,7.55,16,3.8,8.02,12
ชมพูพันธุ์ทิพย์,Tabebuia rosea,"Tabebuia rosea (Bertol.) DC.",88,18,84,2.6,10.16,16,3.2,7.82,15.5
ชมพู่น้ำ,Syzygium siamense,"Syzygium siamense (Craib) Chantar. & J. Parn.",1,0,1,,,,7,7,7
ชะมวง,Garcinia cowa,Garcinia cowa Roxb. ex Choisy,9,4,9,5.9,6.15,6.5,6,7.74,13.8
ชะเนียง,Archidendron jiringa,"Archidendron jiringa (Jack) I.C.Nielsen",4,4,4,6.7,8.47,10.5,9.8,11.22,12.1
ชัยพฤกษ์,Cassia javanica,Cassia javanica L.,3,1,3,12.3,12.3,12.3,8.3,10.83,12.3
ชิงชัน,Dalbergia oliveri,Dalbergia oliveri Gamble ex Prain,13,0,13,,,,4.2,9.72,18
ชิงชี่,Capparis micracantha,Capparis micracantha DC.,1,0,1,,,,4,4,4
ช้างน้าว,Ochna integerrima,"Ochna integerrima (Lour.) Merr.",25,11,24,2.2,3.55,4.5,3,5.77,13.5
ซิลเวอร์โอ๊ค,Grevillea robusta,Grevillea robusta A.Cunn. ex R.Br.,12,0,12,,,,2,7.42,13
ดีหมี,Cleidion javanicum,Cleidion javanicum Blume,2,2,2,5,9,13,5.5,7,8.5
ตองเต่า,Pterospermum cinnamomeum,Pterospermum cinnamomeum Kurz,10,9,8,3.6,6.34,12,2.6,7.44,18
ตะขบบ้าน,Muntingia calabura,Muntingia calabura L.,8,8,8,8,8.5,9,6.5,10.48,12.5
ตะขบป่า,Flacourtia indica,"Flacourtia indica (Burm.f.) Merr.",5,3,5,5.2,9.33,11.6,6.4,8.28,12.7
ตะขบยักษ์,Flacourtia jangomas,"Flacourtia jangomas (Lour.) Raeusch.",2,2,2,5.5,6.75,8,10,10,10
ตะคร้อ,Schleichera oleosa,"Schleichera oleosa (Lour.) Oken",29,10,28,2,13.17,81,4.6,9.54,18
ตะคร้อหนาม,Sisyrolepis muricata,"Sisyrolepis muricata (Pierre) Leenh.",4,3,4,7,12.33,15,7.1,9.38,13.5
ตะคร้ำ,Garuga pinnata,Garuga pinnata Roxb.,19,15,18,4.1,14.31,52,5.1,11.52,20.12
ตะบูนขาว,Xylocarpus granatum,Xylocarpus granatum J.Koenig,8,3,8,4,4.83,5.5,3.7,5.23,7.2
ตะบูนดำ,Xylocarpus moluccensis,"Xylocarpus moluccensis (Lam.) M.Roem.",5,0,5,,,,3.8,6.58,9.5
ตะพุนเฒ่า,Vitex quinata,"Vitex quinata (Lour.) F.N.Williams",3,3,3,9,11.6,16.3,7.7,11.6,19.2
ตะเคียนทอง,Hopea odorata,Hopea odorata Roxb. ex G.Don,256,86,254,1.7,10.12,25.2,2.5,12.78,169
ตะแบกกราย,Terminalia pierrei,Terminalia pierrei Gagnep.,14,0,14,,,,3.9,10.06,16
ตะแบกนา,Lagerstroemia floribunda,Lagerstroemia floribunda Jack,141,40,140,2.5,7.61,18,0,9.94,20.8
ตะแบกเกรียบ,Lagerstroemia cochinchinensis,Lagerstroemia cochinchinensis Pierre,38,2,38,8.9,10.15,11.4,4,11.92,21.7
ตะแบกเปลือกบาง,Lagerstroemia duperreana,Lagerstroemia duperreana Pierre ex Gagnep.,4,4,4,6.5,11.22,14.4,7.3,12.63,16.2
ตะแบกเลือด,Terminalia mucronata,Terminalia mucronata Craib & Hutch.,31,14,31,5.8,8.6,12.3,3.5,9,12.9
ตะแบกแดง,Lagerstroemia calyculata,Lagerstroemia calyculata Kurz,2,2,2,6,8,10,9,10.05,11.1
ตะโกนา,Diospyros rhodocalyx,Diospyros rhodocalyx Kurz,67,24,67,1.9,6.61,13.5,1.18,7.93,17.2
ตะโกพนม,Diospyros castanea,"Diospyros castanea (Craib) H.R.Fletcher",11,9,11,6,8.34,11.7,6,8.75,16.4
ตะโกสวน,Diospyros malabarica,"Diospyros malabarica (Desr.) Kostel.",12,4,12,5,8.45,13.7,4.57,8.81,14.8
ตังหน,Calophyllum calaba,Calophyllum calaba L.,6,0,6,,,,5.1,9.75,19.7
ตับเต่าต้น,Diospyros ehretioides,Diospyros ehretioides Wall. ex G.Don,4,1,4,5.5,5.5,5.5,6.5,9.18,15
ตาตุ่มทะเล,Excoecaria agallocha,Excoecaria agallocha L.,10,0,10,,,,4,4.68,5.8
ตาตุ่มบก,Falconeria insignis,Falconeria insignis Royle,1,0,1,,,,17,17,17
ตานเสี้ยน,Xantolis siamensis,"Xantolis siamensis (H.R.Fletcher) P.Royen",9,0,9,,,,5.9,8.99,15.7
ตาเสือ,Aphanamixis polystachya,"Aphanamixis polystachya (Wall.) R.Parker",3,2,3,11,12.5,14,11.5,12.5,14
ตำเสาหนู,Tristaniopsis burmanica,"Tristaniopsis burmanica (Griff.) Peter G.Wilson & J.T.Waterh.",2,0,2,,,,10.9,10.9,10.9
ติ้วขน,Cratoxylum formosum subsp. pruniflorum,"Cratoxylum formosum subsp. pruniflorum (Kurz) Gogelein",65,35,61,4.2,13.41,16,4.2,11.27,19
ติ้วขาว,Cratoxylum formosum subsp. formosum,"Cratoxylum formosum subsp. formosum (Jack) Benth. & Hook.f. ex Dyer",7,7,7,7,10.07,16,6,10.17,15.9
ติ้วเกลี้ยง,Cratoxylum cochinchinense,"Cratoxylum cochinchinense (Lour.) Blume",50,21,49,5,9.68,14,5.1,8.38,13.1
ตีนนก,Vitex pinnata,Vitex pinnata L.,22,13,21,3.9,8.83,18.8,5,8.45,14
ตีนเป็ดทราย,Cerbera manghas,Cerbera manghas L.,7,7,7,4,4.97,5.4,4,4,4
ตีนเป็ดทะเล,Cerbera odollam,Cerbera odollam Gaertn.,70,52,68,3.3,6.64,13,3,6.99,13.4
ถั่วขาว,Bruguiera cylindrica,"Bruguiera cylindrica (L.) Blume",2,0,2,,,,7.2,7.55,7.9
ถ่านไฟผี,Diospyros montana,Diospyros montana Roxb.,11,5,11,4.2,6.6,9,5.7,8.59,11.7
ทองกวาว,Butea monosperma,"Butea monosperma (Lam.) Kuntze",36,3,36,8.7,11.9,16,3.6,7.86,23.7
ทองหลางน้ำ,Erythrina fusca,Erythrina fusca Lour.,2,2,2,5.5,6.15,6.8,7,8.6,10.2
ทองอุไร,Tecoma stans,"Tecoma stans (L.) Juss. ex Kunth",4,0,4,,,,4.1,4.8,5.7
ทองแมว,Gmelina elliptica,Gmelina elliptica Sm.,1,0,1,,,,7.2,7.2,7.2
ทิ้งถ่อน,Albizia procera,"Albizia procera (Roxb.) Benth.",13,9,13,4,11.1,19,7.5,15.85,27.6
ทุ้งฟ้า,Alstonia macrophylla,Alstonia macrophylla Wall. ex G.Don,3,2,3,8.7,15.5,22.3,8.1,13.57,20.5
ธนนไชย,Buchanania siamensis,Buchanania siamensis Miq.,6,2,6,8,8,8,5.4,8.55,11.7
นนทรี,Peltophorum pterocarpum,"Peltophorum pterocarpum (DC.) Backer ex K.Heyne",105,52,103,4.7,11.63,25.5,5.3,12.37,22.4
นวล,Garcinia merguensis,Garcinia merguensis Wight,4,0,4,,,,7.8,8.97,10.6
นวลเสี้ยน,Aporosa octandra,"Aporosa octandra (Buch.-Ham. ex D.Don) Vickery",7,0,7,,,,6,10.2,18.4
นั่งจ้อย,Diospyros curranii,Diospyros curranii Merr.,1,1,1,17.4,17.4,17.4,10,10,10
นิโครธ,Ficus benghalensis,Ficus benghalensis L.,4,4,4,4.5,5.75,7.5,5.3,7.08,9.7
นุ่น,Ceiba pentandra,"Ceiba pentandra (L.) Gaertn.",2,1,2,15,15,15,14.5,14.5,14.5
น้อยหน่า,Annona squamosa,Annona squamosa L.,5,0,5,,,,3.8,5.58,6.9
น้ำเกลี้ยง,Gluta laccifera,"Gluta laccifera (Pierre) Ding Hou",1,1,1,4.2,4.2,4.2,4.8,4.8,4.8
น้ำเต้าต้น,Crescentia cujete,Crescentia cujete L.,2,1,2,6,6,6,5.6,5.91,6.22
บุนนาค,Mesua ferrea,Mesua ferrea L.,11,1,11,5.7,5.7,5.7,8.9,12.01,15.7
บุหงาส่าหรี,Citharexylum flexuosum,"Citharexylum flexuosum (Ruiz & Pav.) D.Don",15,11,15,5.8,7.06,8.1,5,6.72,11.2
ประคำไก่,Drypetes roxburghii,"Drypetes roxburghii (Wall.) Hurus.",13,5,13,4.7,7.72,15,2.5,6.48,17
ประดู่บ้าน,Pterocarpus indicus,Pterocarpus indicus Willd.,319,63,316,3.6,8.46,17.3,2,9.14,197
ประดู่ป่า,Pterocarpus macrocarpus,Pterocarpus macrocarpus Kurz,592,181,588,2,10.97,23.4,2,12.23,202
ประดู่แดง,Barnebydendron riedelii,"Barnebydendron riedelii (Tul.) J.H.Kirkbr.",1,1,1,5.2,5.2,5.2,3,3,3
ประทัดทอง,Hamelia patens,Hamelia patens Jacq.,2,0,2,,,,8.1,8.15,8.2
ปรู๋,Alangium indochinense,Alangium indochinense W.J.de Wilde & Duyfjes,5,2,5,7.7,7.7,7.7,8.2,10.9,15.5
ปอขาว,Sterculia pexa,Sterculia pexa Pierre,1,1,1,17.1,17.1,17.1,9,9,9
ปอทะเล,Hibiscus tiliaceus,Hibiscus tiliaceus L.,9,8,9,4.1,6.7,10,4.7,8.18,13.8
ปออีเก้ง,Pterocymbium tinctorium,"Pterocymbium tinctorium (Blanco) Merr.",2,0,2,,,,18,18.5,19
ปอแก่นเทา,Grewia eriocarpa,Grewia eriocarpa Juss.,11,9,8,4.8,9.19,14,4.5,8.34,10.6
ปอแดง,Sterculia guttata,Sterculia guttata Roxb.,6,6,4,4.5,8.03,14.3,5,6.28,7
ปาโลแซนโตส,Triplaris cumingiana,Triplaris cumingiana Fisch. & C.A.Mey.,4,4,4,16,17.43,18.5,1.3,13.83,20.6
ปีบ,Millingtonia hortensis,Millingtonia hortensis L.f.,225,76,220,4,9.48,24.6,0,9.99,96
ปีบทอง,Mayodendron igneum,"Mayodendron igneum (Kurz) Kurz",10,10,10,5,7.91,24.3,5,7.14,15.9
ปีบยูนนาน,Radermachera yunnanensis,Radermachera yunnanensis C.Y.Wu & W.C.Yin,4,0,4,,,,2.5,2.9,3.5
ปูเล,Gyrocarpus americanus,Gyrocarpus americanus Jacq.,2,1,1,7.1,7.1,7.1,8.4,8.4,8.4
ผักหวานป่า,Melientha suavis,Melientha suavis Pierre,3,3,3,2.5,5.37,10,3.7,4.67,6
ผักเลือด,Ficus virens,Ficus virens Aiton,1,1,1,3.2,3.2,3.2,6.4,6.4,6.4
ผีเสื้อ,Alangium kurzii,Alangium kurzii Craib,1,1,1,7.5,7.5,7.5,9.7,9.7,9.7
ผ่าเสี้ยน,Vitex canescens,Vitex canescens Kurz,26,18,26,1.9,6.81,12.5,4.8,9.31,16
ฝาง,Caesalpinia sappan,Caesalpinia sappan L.,2,0,2,,,,4,5.35,6.7
ฝาดขาว,Lumnitzera racemosa,Lumnitzera racemosa Willd.,22,8,22,0,4.44,6,3.4,4.76,6.5
ฝิ่นแดง,Cleistanthus sumatranus,"Cleistanthus sumatranus (Miq.) Müll.Arg.",12,12,12,3,5.26,7,3.6,5.93,8.3
ฝีหมอบ,Beilschmiedia roxburghiana,Beilschmiedia roxburghiana Nees,12,7,12,5.9,11.34,15,4.6,11.35,15.8
พญารากดำ,Diospyros variegata,Diospyros variegata Kurz,5,0,5,,,,6,10.16,18
พระเจ้าห้าพระองค์,Dracontomelon dao,"Dracontomelon dao (Blanco) Merr. & Rolfe",4,0,4,,,,14.9,16.7,18.5
พฤกษ์,Albizia lebbeck,"Albizia lebbeck (L.) Benth.",35,10,32,3.3,8.77,20,5.2,13.58,24.5
พลองขี้ควาย,Memecylon coeruleum,Memecylon coeruleum Jack,1,1,1,3,3,3,2.8,2.8,2.8
พลองเหมือด,Memecylon edule,Memecylon edule Roxb.,51,48,50,3,5.11,10,3.8,5.69,8.6
พลองแก้มอ้น,Pternandra caerulescens,Pternandra caerulescens Jack,1,0,1,,,,10,10,10
พลับพลา,Microcos tomentosa,Microcos tomentosa Sm.,129,21,127,4,9.33,15,0,7.75,13.7
พะยอม,Anthoshorea roxburghii,"Anthoshorea roxburghii (G.Don) P.S.Ashton & J.Heck.",127,58,125,2.5,10.63,18.9,0,11.93,40.7
พะยูง,Dalbergia cochinchinensis,Dalbergia cochinchinensis Pierre,180,35,180,3.5,8.11,22,3.1,9.14,24
พะวา,Garcinia celebica,Garcinia celebica L.,39,38,39,3.8,6.24,10.5,0,6.76,11
พังแหรใหญ่,Trema orientale,"Trema orientale (L.) Blume",1,1,0,6,6,6,,,
พันชาด,Erythrophleum succirubrum,Erythrophleum succirubrum Gagnep.,11,0,11,,,,6.9,14.95,20.6
พิกุล,Mimusops elengi,Mimusops elengi L.,86,34,86,3.4,7.14,15.3,2.5,7.36,68.8
พุดจีบ,Tabernaemontana divaricata,"Tabernaemontana divaricata (L.) R.Br. ex Roem. & Schult.",3,3,2,2.3,2.7,3,2,2.5,3
พุดดง,Kopsia arborea,Kopsia arborea Blume,5,5,5,4,5.9,7.7,5.5,6.46,8.9
พุทรา,Ziziphus mauritiana,Ziziphus mauritiana Lam.,10,10,10,7.2,8.17,9.9,5.3,8.89,12
ฟันปลา,Litsea umbellata,"Litsea umbellata (Lour.) Merr.",13,13,13,6.3,9.16,13.2,9.6,11.63,13.7
มณฑา,Magnolia liliifera,"Magnolia liliifera (L.) Baill.",1,1,1,7.5,7.5,7.5,10.3,10.3,10.3
มะกล่ำตาไก่,Adenanthera microsperma,Adenanthera microsperma Teijsm. & Binn.,23,17,23,4.3,9.25,22.5,4,10.49,22.2
มะกล่ำต้น,Adenanthera pavonina,Adenanthera pavonina  L.,1,0,1,,,,18.6,18.6,18.6
มะกอกดอน,Schrebera swietenioides,Schrebera swietenioides Roxb.,3,3,3,7,9.83,15,4.2,10.5,17
มะกอกน้ำ,Elaeocarpus hygrophilus,Elaeocarpus hygrophilus Kurz,16,16,16,3.7,5.79,8,6.1,7.56,9.4
มะกอกป่า,Spondias pinnata,"Spondias pinnata (L.f.) Kurz",32,20,31,2,12.14,19,2.1,12.19,26.8
มะกอกฝรั่ง,Spondias dulcis,Spondias dulcis Parkinson,2,2,2,8,8.5,9,,,
มะกอกเกลื้อน,Canarium subulatum,Canarium subulatum Guillaumin,75,41,71,1.3,9.17,18,5.1,9.96,18.5
มะกัก,Spondias bipinnata,Spondias bipinnata Airy Shaw & Forman,20,0,20,,,,2.7,5.89,24
มะกา,Bridelia ovata,Bridelia ovata Decne.,20,2,19,6.8,6.9,7,3,5.46,14.5
มะขวิด,Limonia acidissima,Limonia acidissima L.,2,0,2,,,,10.3,11.4,12.5
มะขาม,Tamarindus indica,Tamarindus indica L.,128,48,126,3.5,7.32,16.5,2.5,10.27,25
มะขามป้อม,Phyllanthus emblica,Phyllanthus emblica L.,52,42,50,1.5,7.66,11,4,9.01,17
มะขามเทศ,Pithecellobium dulce,"Pithecellobium dulce (Roxb.) Benth.",35,23,34,6.2,10.97,16,2.8,9.97,16
มะคังขาว,Tamilnadia uliginosa,"Tamilnadia uliginosa (Retz.) Tirveng. & Sastre",2,2,2,3,4.25,5.5,3,4.65,6.3
มะคังแดง,Dioecrescis erythroclada,"Dioecrescis erythroclada (Kurz) Tirveng.",2,2,2,8,8.25,8.5,6.9,8.3,9.7
มะค่าแต้,Sindora siamensis,Sindora siamensis Teijsm. ex Miq.,115,31,114,3,7.13,13,3.1,9.89,22.4
มะค่าโมง,Afzelia xylocarpa,"Afzelia xylocarpa (Kurz) Craib",148,60,147,3,9.07,16.3,2,10.24,150
มะดัน,Garcinia schomburgkiana,Garcinia schomburgkiana Pierre,2,2,2,3.5,4.25,5,7.9,12.95,18
มะตาด,Dillenia indica,Dillenia indica L.,1,1,1,5.5,5.5,5.5,7.4,7.4,7.4
มะตูม,Aegle marmelos,"Aegle marmelos (L.) Corrêa",5,3,4,3.5,6.3,9.1,8,10.78,14.1
มะนาว,Citrus aurantifolia,"Citrus aurantifolia (Christm.) Swingle",1,0,1,,,,8.3,8.3,8.3
มะนาวผี,Atalantia monophylla,Atalantia monophylla DC.,24,20,23,3.2,8.08,12.1,4,6.63,9.5
มะปริง,Bouea oppositifolia,"Bouea oppositifolia (Roxb.) Meisn.",3,0,3,,,,3.5,10.4,16.2
มะฝ่อ,Mallotus nudiflorus,"Mallotus nudiflorus (L.) Kulju & Welzen",6,3,6,10,13.27,16,13,14.48,16.6
มะพร้าวนกกก,Horsfieldia glabra,"Horsfieldia glabra (Blume) Warb.",1,1,1,26.2,26.2,26.2,,,
มะพอก,Parinari anamensis,Parinari anamensis Hance,58,14,58,6,9.79,14,3.5,11.75,35
มะม่วง,Mangifera indica,Mangifera indica L.,57,15,57,2.32,9.25,24.2,1,9.56,22.2
มะม่วงป่า,Mangifera caloneura,Mangifera caloneura Kurz,9,3,9,8,8.83,10.5,7.2,10.39,15.5
มะม่วงหัวแมงวัน,Buchanania cochinchinensis,"Buchanania cochinchinensis (Lour.) M.R.Almeida",55,25,54,3.2,8.43,15,3.8,8.13,19
มะม่วงหิมพานต์,Anacardium occidentale,Anacardium occidentale L.,11,4,11,4.5,5.4,6.8,1.1,4.81,7.5
มะยมป่า,Ailanthus triphysa,"Ailanthus triphysa (Dennst.) Alston",3,1,3,10.5,10.5,10.5,17.4,20.33,25.6
มะรุม,Moringa oleifera,Moringa oleifera Lam.,3,2,3,6,6.1,6.2,7,7.7,8.4
มะหนามนึ้ง,Meyna pubescens,"Meyna pubescens (Kurz) Robyns",2,1,2,5.2,5.2,5.2,5,5.55,6.1
มะหวด,Lepisanthes rubiginosa,"Lepisanthes rubiginosa (Roxb.) Leenh.",30,11,30,4,6.25,10,2.3,6.33,13.5
มะหาด,Artocarpus lacucha,Artocarpus lacucha Roxb. ex Buch.-Ham.,16,9,16,1,7.69,15,3.7,10.21,17
มะหาดไทย,Artocarpus thailandicus,Artocarpus thailandicus C.C.Berg,1,0,1,,,,7.4,7.4,7.4
มะฮอกกานีใบใหญ่,Swietenia macrophylla,Swietenia macrophylla King,95,46,92,5,8.24,14.2,2.7,10.61,24.4
มะฮังใหญ่,Macaranga pruinosa,"Macaranga pruinosa (Miq.) Müll. Arg.",1,0,1,,,,6.7,6.7,6.7
มะเกลือ,Diospyros mollis,Diospyros mollis Griff.,51,17,51,5.7,10.52,21.3,2.5,10.53,21.8
มะเกี๋ยง,Syzygium nervosum,Syzygium nervosum A.Cunn. ex DC.,8,8,8,6,7.72,11,6.2,8.38,12
มะเดื่อกวาง,Ficus callosa,Ficus callosa Willd.,4,4,4,8,14.18,20.4,10.6,16.5,20.6
มะเดื่อปล้อง,Ficus hispida,Ficus hispida L.f.,2,2,2,4.5,6.75,9,4.93,7.31,9.7
มะเดื่ออุทุมพร,Ficus racemosa,Ficus racemosa L.,3,2,3,6.9,8.45,10,6.2,8.77,12.6
มะเฟือง,Averrhoa carambola,Averrhoa carambola L.,7,5,7,5.5,6.1,6.7,6,7.47,10.5
มะแฟน,Protium serratum,"Protium serratum (Wall. ex Colebr.) Engl.",3,1,3,10.2,10.2,10.2,18.4,20.07,21.8
มะไฟ,Baccaurea ramiflora,Baccaurea ramiflora Lour.,3,0,3,,,,4.3,7.07,9
มักน้ำนองต้น,Elaeodendron glaucum,"Elaeodendron glaucum (Rottb.) Pers.",1,1,1,14.7,14.7,14.7,12,12,12
มังคุด,Garcinia mangostana,Garcinia mangostana L.,3,0,3,,,,3.8,4.87,5.8
ยมชวน,Khaya senegalensis,"Khaya senegalensis (Desr.) A. Juss.",6,0,6,,,,14.7,18.3,20.4
ยมหอม,Toona ciliata,Toona ciliata M.Roem.,5,0,5,,,,3.3,10.96,15.1
ยมหิน,Chukrasia tabularis,Chukrasia tabularis A.Juss.,119,68,116,2.1,6.67,15.9,2.9,8.67,23
ยอบ้าน,Morinda citrifolia,Morinda citrifolia L.,4,1,4,6,6,6,4,4.85,5.6
ยอป่า,Morinda tomentosa,Morinda tomentosa B.Heyne ex Roth,19,4,19,2.8,4.13,4.7,3.4,6.77,9.8
ยอป่าใบเกลี้ยง,Morinda coreia,Morinda coreia Buch.-Ham.,21,7,21,4.5,9.79,16,0,8.24,15.6
ยอเถื่อน,Morinda elliptica,"Morinda elliptica (Hook.f.) Ridl.",6,3,6,6.3,8.53,12.1,5.8,9.98,14
ยางกราด,Dipterocarpus intricatus,Dipterocarpus intricatus Dyer,8,0,8,,,,6,14.5,19.8
ยางนา,Dipterocarpus alatus,Dipterocarpus alatus Roxb. ex G.Don,426,151,424,2,8.86,27,1.1,15.88,279
ยางพลวง,Dipterocarpus tuberculatus,Dipterocarpus tuberculatus Roxb.,47,22,44,2.2,8.27,20.4,2,12.23,23
ยางพารา,Hevea brasiliensis,"Hevea brasiliensis (Willd. ex A.Juss.) Müll.Arg.",99,58,99,7,14.99,18,5.3,12.69,20
ยางเหียง,Dipterocarpus obtusifolius,Dipterocarpus obtusifolius Teijsm. ex Miq.,67,11,67,5.5,13.45,20,3.8,11.94,87
ยางโอน,Monoon viride,"Monoon viride (Craib) B.Xue & R.M.K.Saunders",7,3,7,4.5,5.5,7,3.2,7.56,12.5
ยี่โถ,Nerium oleander,Nerium oleander L.,1,1,0,2.5,2.5,2.5,,,
ยูคาลิปตัส,Eucalyptus camaldulensis,Eucalyptus camaldulensis Dehnh.,28,11,28,10.2,14.34,26.6,9.4,15.82,31.5
ยูคาลิปตัสสีรุ้ง,Eucalyptus deglupta,Eucalyptus deglupta Blume.,1,0,1,,,,13.4,13.4,13.4
รกฟ้า,Terminalia elliptica,Terminalia elliptica Willd.,44,40,38,4,9.65,16,3,10.01,17.8
รักขาว,Semecarpus cochinchinensis,Semecarpus cochinchinensis Engl.,4,2,3,16,16.5,17,11.5,13.5,15.5
รักใหญ่,Gluta usitata,"Gluta usitata (Wall.) Ding Hou",40,29,39,4,7.82,15,4.6,8.31,13.5
รัง,Pentacme siamensis,"Pentacme siamensis (Miq.) Kurz",92,56,87,2.5,11.25,20.1,3,9.44,21
รำเพย,Cascabela thevetia,"Cascabela thevetia (L.) Lippold",4,4,1,3.8,5.3,6.2,6,6,6
ละมุดสีดา,Manilkara kauki,"Manilkara kauki (L.) Dubard",1,0,1,,,,13,13,13
ลั่นทมขาว,Plumeria obtusa,Plumeria obtusa L.,52,27,52,1.9,4.58,10.5,2,5.6,42
ลั่นทมแดง,Plumeria rubra,Plumeria rubra L.,27,8,27,3.4,3.98,5.2,3,4.36,6.5
ลาย,Microcos paniculata,Microcos paniculata L.,17,17,16,4,7.44,12,7.2,10.11,14.8
ลำดวน,Sphaerocoryne lefevrei,"Sphaerocoryne lefevrei (Baill.) D.M.Johnson & N.A.Murray",40,7,40,4.8,6.64,8.7,3.9,9.23,81
ลำบิด,Diospyros ferrea,"Diospyros ferrea (Willd.) Bakh.",3,0,3,,,,4.8,6.37,8.3
ลำบิดดง,Diospyros filipendula,Diospyros filipendula Pierre ex Lecomte,5,4,4,4.5,6.25,10,3,6.83,11.7
ลำพู,Sonneratia caseolaris,"Sonneratia caseolaris (L.) Engl.",102,24,96,4.5,10.54,19.5,3,7.44,18.5
ลำแพน,Sonneratia alba,Sonneratia alba J.Sm.,11,6,10,2.4,5.25,7.8,3.5,7.08,10.8
ลำไย,Dimocarpus longan,Dimocarpus longan Lour.,21,17,21,5,5.86,7,5.2,6.82,14
ศรีตรัง,Jacaranda obtusifolia,Jacaranda obtusifolia Bonpl.,16,5,16,3.1,10.34,17.8,0,7.02,17.6
ศรียะลา,Saraca thaipingensis,Saraca thaipingensis Cantley ex Prain,2,1,2,11.7,11.7,11.7,4.8,6.65,8.5
สกุณี,Terminalia calamansanai,"Terminalia calamansanai (Blanco) Rolfe",19,19,19,5,7.88,11.3,3.5,9.6,19.1
สตาร์แอปเปิ้ล,Chrysophyllum cainito,Chrysophyllum cainito L.,9,8,9,5.7,8.38,11.7,6.9,11.46,23.1
สนทราย,Baeckea frutescens,Baeckea frutescens L.,4,0,4,,,,7,10.73,13.1
สนทะเล,Casuarina equisetifolia,Casuarina equisetifolia L.,395,109,389,6.2,23.82,37.8,0,21.56,43.3
สนแผง,Chamaecyparis obtusa,"Chamaecyparis obtusa (Siebold & Zucc.) Endl.",2,0,2,,,,10,10.1,10.2
สบู่ดำ,Jatropha curcas,Jatropha curcas L.,1,0,1,,,,4.1,4.1,4.1
สมอพิเภก,Terminalia bellirica,"Terminalia bellirica (Gaertn.) Roxb.",20,12,20,3.3,10.3,19.8,3.6,12.7,24.4
สมอร่อง,Lagerstroemia subangulata,"Lagerstroemia subangulata (Craib) Furtado & Montien",1,0,1,,,,7.1,7.1,7.1
สมอไทย,Terminalia chebula,Terminalia chebula Retz.,21,11,21,3.4,5.92,12,3.2,7.73,15
สมัก,Syzygium polyanthum,"Syzygium polyanthum (Wight) Walp.",8,0,8,,,,6,12.01,18
สวอง,Vitex limonifolia,Vitex limonifolia Wall. ex C.B.Clarke,26,16,25,7.4,11.67,14.6,6,8.91,13
สองสลึง,Lophopetalum duperreanum,Lophopetalum duperreanum  Pierre,1,0,1,,,,5.1,5.1,5.1
สะตอ,Parkia speciosa,Parkia speciosa Hassk.,11,3,11,19.8,22.27,27,14.8,18.6,28.3
สะทางเล็ก,Xylopia pierrei,Xylopia pierrei Hance,2,0,2,,,,7,8.05,9.1
สะท้อนรอก,Elaeocarpus tectorius,"Elaeocarpus tectorius (Lour.) Poir.",2,0,2,,,,11,15.1,19.2
สะเดา,Azadirachta indica,Azadirachta indica A.Juss.,215,36,215,3,8.39,14.2,2.5,9.58,19.6
สะเดาปัก,Vatica harmandiana,Vatica harmandiana Pierre,106,96,106,3.7,6.28,11.2,3,7.26,21.6
สะเดาเทียม,Azadirachta excelsa,"Azadirachta excelsa (Jack) Jacobs",2,1,2,14.5,14.5,14.5,14.4,14.55,14.7
สะเต้า,Pterospermum grandiflorum,Pterospermum grandiflorum Craib,4,0,4,,,,6,11.75,15
สะแกนา,Combretum quadrangulare,Combretum quadrangulare Kurz,9,9,9,4.5,7.78,10.5,6.2,9.68,12.5
สะแกแสง,Cananga latifolia,Cananga latifolia Finet & Gagnep.,3,3,3,16,17,18.5,2.6,12.33,18.4
สัก,Tectona grandis,Tectona grandis L.f.,376,106,371,4,10.7,21.3,2.1,11.63,31.3
สังกะโต้ง,Aglaia lawii,"Aglaia lawii (Wight) C.J.Saldanha",2,0,2,,,,8.3,11.15,14
สัตตบรรณ,Alstonia scholaris,"Alstonia scholaris (L.) R.Br.",143,83,141,0.7,10.33,87.2,0,8.91,19.9
สั่งทำ,Diospyros buxifolia,"Diospyros buxifolia (Blume) Hiern",1,0,1,,,,16,16,16
สาธร,Imbralyx leucanthus,"Imbralyx leucanthus (Kurz) Z.Q.Song",26,16,20,0,8.51,13,3.5,7.77,12
สารภี,Mammea siamensis,"Mammea siamensis (Miq.) T.Anderson",7,5,7,3.8,5,6.2,2,7.09,14.2
สาละลังกา,Couroupita guianensis,Couroupita guianensis Aubl.,25,19,25,3,4.13,7.5,3.3,5.91,13.6
สำเภา,Chaetocarpus castanicarpus,"Chaetocarpus castanicarpus (Roxb.) Thwaites",5,5,5,3.5,5.28,6.3,0,4.78,6.9
สำโรง,Sterculia foetida,Sterculia foetida L.,25,17,25,5.6,13.54,16,6.3,12.23,24.4
สีเสียด,Senegalia catechu,"Senegalia catechu (L.f.) P.J.H.Hurter & Mabb.",4,2,4,8.2,11.35,14.5,4,9.25,17.6
สุพรรณิการ์,Cochlospermum religiosum,"Cochlospermum religiosum (L.) Alston",3,3,1,4.9,9.53,13.7,10.4,10.4,10.4
ส้มกบ,Hymenodictyon orixense,"Hymenodictyon orixense (Roxb.) Mabb.",16,15,15,2.4,8.17,19,4.2,8.19,15
ส้มโอ,Citrus maxima,"Citrus maxima (Burm.) Merr.",1,1,0,4.3,4.3,4.3,,,
ส้านชะวา,Dillenia suffruticosa,"Dillenia suffruticosa (Griff.) Martelli",4,0,4,,,,3.8,4.4,5
ส้านหิ่ง,Dillenia parviflora,Dillenia parviflora Griff.,1,1,1,19.7,19.7,19.7,19.8,19.8,19.8
ส้านใบเล็ก,Dillenia ovata,Dillenia ovata Wall. ex Hook.f. & Thomson,3,1,3,6.5,6.5,6.5,6.1,6.77,7.5
ส้านใหญ่,Dillenia obovata,"Dillenia obovata (Blume) Hoogland",5,1,4,8,8,8,7.8,11.15,15
หงอนไก่,Heritiera littoralis,Heritiera littoralis Aiton,1,0,1,,,,5.1,5.1,5.1
หนามแท่ง,Catunaregam tomentosa,"Catunaregam tomentosa (Blume ex DC.) Tirveng.",2,0,2,,,,6,7.1,8.2
หมักม่อ,Ridsdalea wittii,"Ridsdalea wittii (Craib) J.T.Pereira",2,0,2,,,,6.3,6.6,6.9
หมัน,Cordia cochinchinensis,Cordia cochinchinensis Gagnep.,10,9,10,6.5,11.12,21.3,5.6,7.89,11
หมันดง,Cordia dichotoma,Cordia dichotoma G.Forst.,16,15,15,3,6.33,13,3.23,6.25,10
หมันทะเล,Cordia subcordata,Cordia subcordata L.,3,3,1,3.5,4.67,5.5,6,6,6
หมีเหม็น,Litsea glutinosa,"Litsea glutinosa (Lour.) C.B.Rob.",27,15,26,5.5,9.7,18,4.2,9.94,24.5
หม่อน,Morus alba,Morus alba L.,1,1,1,4.5,4.5,4.5,,,
หลุมพอ,Intsia palembanica,Intsia palembanica Miq.,12,0,12,,,,7.8,11.91,20.5
หว้า,Syzygium cumini,"Syzygium cumini (L.) Skeels",66,37,63,3.4,6.59,15,3.9,8.99,24.6
หว้านา,Syzygium cinereum,"Syzygium cinereum (Kurz) Chantar. & J.Parn.",5,2,4,4,7,10,12.1,15.53,19.9
หัวแมงวัน,Buchanania reticulata,Buchanania reticulata Hance,1,0,1,,,,11,11,11
หัสคุณ,Micromelum minutum,"Micromelum minutum (G.Forst.) Wight & Arn.",15,0,15,,,,5,6.04,7.6
หางนกยูงฝรั่ง,Delonix regia,"Delonix regia (Bojer ex Hook.) Raf.",180,102,170,1.4,10.51,28.6,0,11.47,26.4
หาดหนุน,Artocarpus gomezianus,Artocarpus gomezianus Wall. ex Trécul,1,0,1,,,,11,11,11
หูกระจง,Terminalia ivorensis,Terminalia ivorensis A.Chev.,66,12,66,2.8,7.36,12,2.5,7.97,20.4
หูกวาง,Terminalia catappa,Terminalia catappa L.,28,21,28,2.4,11.37,27.3,4,12.94,37
อวบดำ,Tetrapilus salicifolius,"Tetrapilus salicifolius (Wall. ex G.Don) de Juana",67,66,67,3.5,5.69,8,0,6.23,8.6
อะราง,Peltophorum dasyrhachis,"Peltophorum dasyrhachis (Miq.) Kurz",60,21,56,4.7,10.22,16,3.6,10.31,21
อินจัน,Diospyros decandra,Diospyros decandra Lour.,13,4,13,4.3,9.32,13,4,11.35,18
อินทนิลน้ำ,Lagerstroemia speciosa,"Lagerstroemia speciosa (L.) Pers.",165,89,160,0,6.9,16,0,7.45,16.7
อินทนิลบก,Lagerstroemia macrocarpa,Lagerstroemia macrocarpa Kurz,42,10,40,1.9,6.75,10.3,4.6,9.6,23.5
อินทรชิต,Lagerstroemia loudonii,Lagerstroemia loudonii Teijsm. & Binn.,165,44,164,2.1,7.03,15,2.5,9.32,27
อีแปะ,Vitex scabra,Vitex scabra Wall. ex Schauer,1,0,1,,,,7,7,7
อโศกอินเดีย,Monoon longifolium,"Monoon longifolium (Sonn.) B.Xue & R.M.K.Saunders",43,35,43,2,6.07,10,2.5,6.56,16.9
เกด,Manilkara hexandra,"Manilkara hexandra (Roxb.) Dubard",6,2,6,5,7,9,5.79,10.06,13.8
เก็ดขาว,Dalbergia ovata,Dalbergia ovata Graham ex Benth.,6,1,6,6.3,6.3,6.3,3.6,7.72,12
เขลง,Dialium cochinchinense,Dialium cochinchinense Pierre,24,20,23,5.2,10.58,20.7,3.7,9.53,13.7
เข็มขาว,Ixora finlaysoniana,Ixora finlaysoniana Wall. ex G.Don,1,0,1,,,,3,3,3
เคล็ดหนู,Canthium horridum,Canthium horridum Blume,2,2,2,5.9,6.3,6.7,7.1,7.5,7.9
เคี่ยม,Cotylelobium lanceolatum,Cotylelobium lanceolatum Craib,3,0,3,,,,4.6,9.3,12.7
เค็ด,Catunaregam spathulifolia,Catunaregam spathulifolia Tirveng.,1,1,1,3.2,3.2,3.2,4.6,4.6,4.6
เงาะ,Nephelium lappaceum,Nephelium lappaceum L.,1,0,1,,,,2.6,2.6,2.6
เฉียงพร้านางแอ,Carallia brachiata,"Carallia brachiata (Lour.) Merr.",27,15,27,5,9.32,20.1,5.1,15.37,29
เชอร์รี่ไทย,Malpighia glabra,Malpighia glabra L.,3,2,3,4,4,4,3.5,4.7,5.6
เชียด,Cinnamomum iners,"Cinnamomum iners (Reinw. ex Nees & T.Nees) Blume",5,5,5,8.8,10.9,13.7,7.8,12.8,15.9
เซียนท้อ,Lucuma campechiana,Lucuma campechiana Kunth,1,0,1,,,,7.1,7.1,7.1
เดื่อฉิ่ง,Ficus fistulosa,Ficus fistulosa Reinw. ex Blume,3,3,3,4.5,7.83,10.4,8.7,9.6,10.5
เต็ง,Shorea obtusa,Shorea obtusa Wall. ex Blume,243,60,239,2.3,12.27,18,2.5,10.16,24.2
เต็งหนาม,Bridelia retusa,"Bridelia retusa (L.) A.Juss.",6,2,6,6,10,14,4.1,7.38,12.6
เทพทาโร,Cinnamomum parthenoxylon,"Cinnamomum parthenoxylon (Jack) Meisn.",2,2,2,6.5,6.85,7.2,7.2,8.95,10.7
เทียะ,Alstonia spatulata,Alstonia spatulata Blume,93,0,93,,,,2.5,5.4,16.2
เบาบับ,Adansonia digitata,Adansonia digitata L.,2,0,2,,,,5.8,7.75,9.7
เปล้าแพะ,Croton hutchinsonianus,Croton hutchinsonianus Hosseus,3,3,3,3.7,4.53,5.2,5.6,5.9,6.3
เปล้าใหญ่,Croton persimilis,Croton persimilis Müll.Arg.,3,1,3,6,6,6,4.6,6.97,8.3
เพกา,Oroxylum indicum,"Oroxylum indicum (L.) Kurz",50,16,50,3.8,9.66,19.6,0,10.19,21.5
เมา,Syzygium grande,"Syzygium grande (Wight) Walp.",19,1,19,8.2,8.2,8.2,6.2,9.97,13.6
เม่าสร้อย,Antidesma acidum,Antidesma acidum Retz.,1,0,1,,,,4.5,4.5,4.5
เม่าไข่ปลา,Antidesma ghaesembilla,Antidesma ghaesembilla Gaertn.,27,10,26,4,8.52,11,3.3,8.05,13.8
เลียงฝ้าย,Kydia calycina,Kydia calycina Roxb.,1,0,1,,,,18.2,18.2,18.2
เลียบ,Ficus subpisocarpa,Ficus subpisocarpa Gagnep.,6,3,5,5.9,10.33,15,0,8.66,17.9
เลี่ยน,Melia azedarach,Melia azedarach L.,5,0,5,,,,5.9,10.66,16.9
เลือดแรด,Knema globularia,"Knema globularia (Lam.) Warb.",3,3,3,6.5,8.17,10,3.4,5.53,7.2
เสม็ดขาว,Melaleuca cajuputi,Melaleuca cajuputi Powell,317,0,317,,,,2.5,8.95,54
เสม็ดแดง,Syzygium antisepticum,"Syzygium antisepticum (Blume) Merr. & L.M.Perry",36,2,36,5,5.25,5.5,5.6,8.44,11
เสลาเปลือกบาง,Lagerstroemia venusta,Lagerstroemia venusta Wall. ex C.B.Clarke,6,0,6,,,,4.1,7.72,18.2
เสลาเปลือกหนา,Lagerstroemia villosa,Lagerstroemia villosa Wall. ex Kurz,1,0,1,,,,15,15,15
เสียวใหญ่,Phyllanthus angkorensis,Phyllanthus angkorensis Beille,4,4,3,6.5,7.75,9,4.9,7.57,9.7
เสี้ยวดอกขาว,Bauhinia saccocalyx,Bauhinia saccocalyx Pierre,2,0,2,,,,8.8,48.4,88
เสี้ยวใหญ่,Piliostigma malabaricum,"Piliostigma malabaricum (Roxb.) Benth.",8,4,6,4.4,5.35,6.2,5.1,5.85,8
เหมือดจี้,Memecylon scutellatum,"Memecylon scutellatum (Lour.) Hook. & Arn.",1,0,1,,,,5.8,5.8,5.8
เหมือดวอน,Aporosa wallichii,Aporosa wallichii Hook.f.,6,6,4,4,8.92,13,7.1,10.28,13
เหมือดโลด,Aporosa villosa,"Aporosa villosa (Lindl.) Baill.",67,41,65,2.5,5.9,13.5,3.5,5.96,13
เหรียง,Parkia timoriana,"Parkia timoriana (DC.) Merr.",2,2,2,16,16.9,17.8,14,14,14
เหลืองปรีดียาธร,Tabebuia aurea,"Tabebuia aurea (Silva Manso) Benth. & Hook.f. ex S.Moore",45,24,38,2,4.17,7,2.2,7.28,67.3
เหลืองอินเดีย,Handroanthus chrysanthus,"Handroanthus chrysanthus (Jacq.) S.O.Grose",43,39,43,2.2,5.07,6.2,2.5,5.68,8.4
เหลืองเชียงราย,Handroanthus chrysotrichus,"Handroanthus chrysotrichus (Mart. ex DC.) Mattos",8,4,8,4.5,5.95,7.8,5,8.09,11.6
เอกมหาชัย,Simarouba amara,Simarouba amara Aubl.,4,0,4,,,,5.2,6.95,8.8
เอียน,Neolitsea zeylanica,"Neolitsea zeylanica (Nees) Merr.",1,0,1,,,,5.2,5.2,5.2
เเซะ,Adinobotrys atropurpureus,"Adinobotrys atropurpureus (Wall.) Dunn",1,1,1,15.8,15.8,15.8,14.2,14.2,14.2
แก้ว,Murraya paniculata,"Murraya paniculata (L.) Jack",11,2,11,4.2,4.25,4.3,2.8,4.26,5.2
แก้วมุกดา,Fagraea ceilanica,Fagraea ceilanica Thunb.,1,1,1,4.1,4.1,4.1,3.5,3.5,3.5
แข้งกวาง,Wendlandia tinctoria,"Wendlandia tinctoria (Roxb.) DC.",2,0,2,,,,5.5,7.75,10
แคทราย,Stereospermum neuranthum,Stereospermum neuranthum Kurz,2,2,1,5.4,6.8,8.2,14.3,14.3,14.3
แคนา,Dolichandrone serrulata,"Dolichandrone serrulata (Wall. ex DC.) Seem.",68,32,66,3,8.63,18,3,8.87,21.8
แคบิด,Fernandoa adenophylla,"Fernandoa adenophylla (Wall. ex G.Don) Steenis",5,3,5,7.2,9.17,12.5,3.5,7.5,10.4
แคฝรั่ง,Gliricidia sepium,"Gliricidia sepium (Jacq.) Kunth",5,3,5,6,6.2,6.3,4.8,7.94,12.8
แคยอดดำ,Stereospermum fimbriatum,"Stereospermum fimbriatum (Wall. ex G.Don) DC.",1,1,1,9.8,9.8,9.8,10.2,10.2,10.2
แครกฟ้า,Heterophragma sulfureum,Heterophragma sulfureum Kurz,4,3,4,3,5.67,8,3.3,8.1,13
แคหางค่าง,Markhamia stipulata,"Markhamia stipulata (Wall.) Seem.",26,20,21,5.5,10.51,18,4,10.19,22
แคแสด,Spathodea campanulata,Spathodea campanulata P.Beauv.,2,2,2,4.2,4.35,4.5,4.5,5.85,7.2
แจง,Maerua siamensis,"Maerua siamensis (Kurz) Pax",5,4,5,3.6,4.5,5.1,2.3,4.11,6.24
แดง,Xylia xylocarpa var. kerrii,"Xylia xylocarpa var. kerrii (Craib & Hutch.) I.C.Nielsen",174,106,173,1.8,8.89,23,2.1,9.86,22.5
แดงหิน,Pleurostylia opposita,"Pleurostylia opposita (Wall.) Alston",1,0,1,,,,6.9,6.9,6.9
แปรงล้างขวด,Melaleuca citrina,"Melaleuca citrina (Curtis) Dum.Cours.",2,1,2,6,6,6,6.7,7.25,7.8
แสงจันทร์,Pisonia grandis,Pisonia grandis R.Br.,2,0,2,,,,8,9.7,11.4
แสมขาว,Avicennia alba,Avicennia alba Blume,220,186,174,4,6.72,9,3,7.37,12
แสมดำ,Avicennia officinalis,Avicennia officinalis L.,1,0,1,,,,7,7,7
แสมทะเล,Avicennia marina,"Avicennia marina (Forssk.) Vierh.",41,1,41,6.5,6.5,6.5,5.8,8.47,11
แสมสาร,Senna garrettiana,"Senna garrettiana (Craib) H.S.Irwin & Barneby",36,13,33,7,10.55,22.6,5.2,9.55,15
แสลงใจ,Strychnos nux-blanda,Strychnos nux-blanda A.W.Hill,8,7,8,4.8,7.89,15,3.8,7.9,11.5
แหนนา,Terminalia glaucifolia,Terminalia glaucifolia Craib,19,4,19,14.5,14.85,15.5,4.2,12.89,23.8
แอ๊ดใบเล็ก,Erismanthus sinensis,Erismanthus sinensis Oliv.,2,0,2,,,,8,10,12
โกงกางใบเล็ก,Rhizophora apiculata,Rhizophora apiculata Blume,102,0,102,,,,5.7,8.5,10.7
โกงกางใบใหญ่,Rhizophora mucronata,Rhizophora mucronata Poir.,9,5,9,4.2,4.8,5.5,4,6.8,10.9
โปรงแดง,Ceriops tagal,"Ceriops tagal (Perr.) C.B.Rob.",91,0,91,,,,4.2,7.04,10
โพขี้นก,Ficus rumphii,Ficus rumphii Blume,14,3,14,9.5,11.4,15,4.5,11.06,23
โพทะเล,Thespesia populnea,"Thespesia populnea (L.) Sol. ex Corrêa",17,16,15,5,8.94,14,3.5,8.1,12.7
โพบาย,Balakata baccata,"Balakata baccata (Roxb.) Esser",2,2,2,16.7,18.2,19.7,18.7,20.55,22.4
โพศรีมหาโพ,Ficus religiosa,Ficus religiosa L.,33,11,32,6.9,9.08,16,5.2,10.72,19.2
โมกบ้าน,Wrightia religiosa,"Wrightia religiosa (Teijsm. & Binn.) Benth. ex Kurz",1,1,1,3,3,3,4.87,4.87,4.87
โมกมัน,Wrightia arborea,"Wrightia arborea (Dennst.) Mabb.",204,133,204,3.5,9.68,19,3.5,9.77,22.1
โมกใหญ่,Holarrhena pubescens,Holarrhena pubescens Wall. ex G.Don,8,4,8,2.7,5.35,7,4,17.34,73
โสกน้ำ,Saraca indica,Saraca indica L.,3,0,3,,,,6,7.5,9
โสกสะปัน,Brownea grandiceps,Brownea grandiceps Jacq.,1,1,1,6.3,6.3,6.3,10.6,10.6,10.6
ไกร,Ficus concinna,"Ficus concinna (Miq.) Miq.",11,5,11,8,10.72,13,5.5,11.12,18.3
ไข่เน่า,Vitex glabrata,Vitex glabrata R.Br.,3,0,3,,,,4.2,10.93,16.7
ไคร้ย้อย,Elaeocarpus grandiflorus,Elaeocarpus grandiflorus Sm.,1,1,1,2.5,2.5,2.5,4.6,4.6,4.6
ไทรขี้ใต้,Ilex cymosa,Ilex cymosa Blume,1,0,1,,,,11.1,11.1,11.1
ไทรย้อยใบทู่,Ficus microcarpa,Ficus microcarpa L.f.,44,23,42,2.3,6.07,14,1.6,6.44,14
ไทรย้อยใบแหลม,Ficus benjamina,Ficus benjamina L.,37,24,35,3.5,8.33,15,3,10.79,85
ไทรเลียบ,Ficus superba,"Ficus superba (Miq.) Miq.",6,3,6,13,13.33,14,3,8.38,15
ไทรใบดาบ,Ficus maclellandii,Ficus maclellandii King,10,1,10,7,7,7,3.5,8.01,14.9
ไฮ,Ficus geniculata,Ficus geniculata Kurz,8,7,8,2.5,7.43,10.5,4,8.61,12
,Antidesma sp.,Antidesma sp.,9,9,9,4.3,4.97,6,5.2,6.33,7.8
,Antidesma sp.Sisaket1,Antidesma sp.Sisaket1,2,0,2,,,,5.9,6.45,7
,Aporosa sp.,Aporosa sp.,1,1,1,6.4,6.4,6.4,6.7,6.7,6.7
,Aporosa sp.Chanthaburi1,Aporosa sp.Chanthaburi1,1,0,1,,,,4.2,4.2,4.2
,Artocarpus sp.BuengKan1,Artocarpus sp.BuengKan1,1,0,1,,,,,,
,Artocarpus sp.Chumphon1,Artocarpus sp.Chumphon1,3,0,3,,,,11.6,13.63,15.9
,Artocarpus sp.Trang1,Artocarpus sp.Trang1,1,0,1,,,,13.2,13.2,13.2
,Barringtonia sp.,Barringtonia sp.,2,2,2,7,7.5,8,10.6,12.3,14
,Bridelia sp.Chachoengsao1,Bridelia sp.Chachoengsao1,1,0,1,,,,5.4,5.4,5.4
,Catunaregam sp.MaeHongSon1,Catunaregam sp.MaeHongSon1,1,0,1,,,,5.5,5.5,5.5
,Chionanthus sp.Trat1,Chionanthus sp.Trat1,1,0,1,,,,8,8,8
,Cinnamomum sp.Trang1,Cinnamomum sp.Trang1,2,0,2,,,,9.2,10.05,10.9
,Cinnamomum sp.Trat1,Cinnamomum sp.Trat1,1,0,1,,,,20.4,20.4,20.4
,Croton sp.Trat1,Croton sp.Trat1,2,0,2,,,,6,6.25,6.5
,Dasymachalon sp.Trat1,Dasymachalon sp.Trat1,3,0,3,,,,6,6.33,7
,Diospyros sp.AmnatCharoen1,Diospyros sp.AmnatCharoen1,1,0,1,,,,7.9,7.9,7.9
,Diospyros sp.MahaSarakham1,Diospyros sp.MahaSarakham1,4,0,4,,,,2.7,5.75,7.7
,Diospyros sp.SaKaeo1,Diospyros sp.SaKaeo1,1,0,1,,,,13,13,13
,Diospyros sp.Trang 1,Diospyros sp.Trang 1,1,0,1,,,,9.5,9.5,9.5
,Diospyros sp.Trang2,Diospyros sp.Trang2,8,0,8,,,,8.1,10.15,12.4
,Diospyros sp.Trat1,Diospyros sp.Trat1,3,0,3,,,,8,10.3,14
,Ehretia sp.Ratchaburi1,Ehretia sp.Ratchaburi1,2,0,2,,,,4.5,4.6,4.7
,Elaeocarpus sp.AmnatCharoen1,Elaeocarpus sp.AmnatCharoen1,2,0,2,,,,14.5,17.45,20.4
,Flacourtia sp.,Flacourtia sp.,1,1,1,10.6,10.6,10.6,11.1,11.1,11.1
,Gluta sp.Buriram1,Gluta sp.Buriram1,1,0,1,,,,6.4,6.4,6.4
,Gluta sp.Trat1,Gluta sp.Trat1,18,0,18,,,,2.5,16.74,20.7
,Gmelina sp.AmnatCharoen1,Gmelina sp.AmnatCharoen1,1,0,1,,,,6.8,6.8,6.8
,Homalium sp.,Homalium sp.,1,1,1,3.5,3.5,3.5,4.6,4.6,4.6
,Lithocarpus sp.,Lithocarpus sp.,1,1,1,12.7,12.7,12.7,11.7,11.7,11.7
,Litsea sp.Trat1,Litsea sp.Trat1,1,0,1,,,,6,6,6
,Madhuca sp.Phrae1,Madhuca sp.Phrae1,8,0,8,,,,5.4,6.49,8.6
,Mangifera sp.,Mangifera sp.,2,2,1,4,5.5,7,8,8,8
,Memecylon sp.Trat1,Memecylon sp.Trat1,1,0,1,,,,13.4,13.4,13.4
,Millettia sp.1,Millettia sp.1,29,29,29,1.9,5.89,11.1,3.4,7.58,12.8
,Millettia sp.2,Millettia sp.2,1,1,1,7.4,7.4,7.4,8.1,8.1,8.1
,Millettia sp.Tak1,Millettia sp.Tak1,2,0,2,,,,2.5,3.95,5.4
,Premna sp.,Premna sp.,1,1,1,8.2,8.2,8.2,7.1,7.1,7.1
,Stereospermum sp.Trang1,Stereospermum sp.Trang1,1,0,1,,,,11.2,11.2,11.2
,Symplocos sp.MaeHongSon1,Symplocos sp.MaeHongSon1,1,0,1,,,,8.5,8.5,8.5
,Syzygium sp.Narathiwat1,Syzygium sp.Narathiwat1,60,0,60,,,,3.1,6.89,11.4
,Syzygium sp.Trang1,Syzygium sp.Trang1,10,0,10,,,,5.9,9.06,13.9
,Syzygium sp.Trang2,Syzygium sp.Trang2,1,0,1,,,,12.4,12.4,12.4
,Syzygium sp.Trat1,Syzygium sp.Trat1,6,0,6,,,,10.4,15.32,21.4
,Syzygium sp.Trat2,Syzygium sp.Trat2,4,0,4,,,,15.8,20.55,23.7
,Syzygium sp.พัฒนาราม,Syzygium sp.พัฒนาราม,1,1,1,12.7,12.7,12.7,11,11,11
,Unknown,Unknown,1,0,1,,,,15.8,15.8,15.8
,Unknown genus-Bignoniaceae-UthaiThani,Unknown genus-Bignoniaceae-UthaiThani,1,0,1,,,,18,18,18
,Unknown genus-Fabaceae-Uttaradit,Unknown genus-Fabaceae-Uttaradit,1,0,1,,,,5.6,5.6,5.6
,Unknown genus-Lauraceae-Trat-1,Unknown genus-Lauraceae-Trat-1,6,0,6,,,,9.3,15.32,20.3
,Unknown genus-Lauraceae-Trat-2,Unknown genus-Lauraceae-Trat-2,1,0,1,,,,20,20,20
,Unknown ป่ากลางกรุง ปตท,Unknown ป่ากลางกรุง ปตท,1,0,1,,,,10.4,10.4,10.4
,Unknown วิทยาลัยเกษตรอุดร,Unknown วิทยาลัยเกษตรอุดร,1,0,1,,,,22,22,22
,Unknown-genus-Anacardiaceae-MaeHongSon,Unknown-genus-Anacardiaceae-MaeHongSon,1,0,1,,,,13.5,13.5,13.5
,Unknown-genus-Phyllanthaceae-MaeHongSon,Unknown-genus-Phyllanthaceae-MaeHongSon,3,0,3,,,,6,7.07,9.2
,Unknown1 วัดป่าขมิ้น,Unknown1 วัดป่าขมิ้น,1,1,1,10.6,10.6,10.6,8.1,8.1,8.1
,Unknown1 วัดป่าหนองกุง,Unknown1 วัดป่าหนองกุง,1,1,1,5,5,5,4.2,4.2,4.2
,Unknown1 เขาน้ำซับ,Unknown1 เขาน้ำซับ,1,1,1,10.5,10.5,10.5,7.3,7.3,7.3
,Unknown2 วัดป่าหนองกุง,Unknown2 วัดป่าหนองกุง,1,1,1,5,5,5,2.6,2.6,2.6
,Unknown2 วิทยาลัยชุมชน,Unknown2 วิทยาลัยชุมชน,1,1,1,7,7,7,8,8,8
,Unknown3 วัดป่าหนองกุง,Unknown3 วัดป่าหนองกุง,1,1,1,6.5,6.5,6.5,8.5,8.5,8.5
,Unknown4 วัดป่าหนองกุง,Unknown4 วัดป่าหนองกุง,1,1,1,15,15,15,15,15,15
,Unknown5 วัดป่าหนองกุง,Unknown5 วัดป่าหนองกุง,1,1,1,12,12,12,9.2,9.2,9.2
,Xerospermum sp.Trat1,Xerospermum sp.Trat1,6,0,6,,,,4.6,9.25,16
,,,4,0,1,,,,,,
`; // <-- สิ้นสุดเครื่องหมาย ` (backtick)

// 2. นำเนื้อหาจากไฟล์ "wood_density.csv" ทั้งหมดมาวางที่นี่
const woodDensityCsvDataString = `No,Family,Genus,Species,Botanical_Name,Botanical_NoAuthor,Thai_Name,YCount,Y2023,Y2025,AiTaxonomy,Source,Specificity,WoodDensity_Forest,WoodDensity_Plantation,WD_Class,WD_ForestInRange
1,Acanthaceae,Avicennia,alba,Avicennia alba Blume,Avicennia alba,แสมขาว,2,1,1,TRUE,กรมป่าไม้(2548),Species,639,,3,
2,Acanthaceae,Avicennia,marina,Avicennia marina (Forssk.) Vierh.,Avicennia marina,แสมทะเล,2,1,1,FALSE,กรมป่าไม้(2548),Species,790,,2,
3,Acanthaceae,Avicennia,officinalis,Avicennia officinalis L.,Avicennia officinalis,แสมดำ,2,1,1,FALSE,กรมป่าไม้(2548),Genus,714.5,,2,
4,Achariaceae,Hydnocarpus,castaneus,Hydnocarpus castaneus Hook.f. & Thomson,Hydnocarpus castaneus,กระเบาน้ำ,1,0,1,FALSE,Global,Genus,634,,3,
5,Achariaceae,Hydnocarpus,ilicifolius,Hydnocarpus ilicifolius King,Hydnocarpus ilicifolius,กระเบากลัก,2,1,1,FALSE,กรมป่าไม้(2548),Species,1010,,1,
6,Anacardiaceae,Anacardium,occidentale,Anacardium occidentale L.,Anacardium occidentale,มะม่วงหิมพานต์,2,1,1,FALSE,"Zanne et al., 2009",Species,446.5,,3,
7,Anacardiaceae,Bouea,oppositifolia,Bouea oppositifolia (Roxb.) Meisn.,Bouea oppositifolia,มะปริง,1,0,1,FALSE,Global,Species,745,,2,
8,Anacardiaceae,Buchanania,arborescens,Buchanania arborescens (Blume) Blume,Buchanania arborescens,จ้าม่วง,1,1,0,FALSE,กรมป่าไม้(2548),Species,700,,2,
9,Anacardiaceae,Buchanania,cochinchinensis,Buchanania cochinchinensis (Lour.) M.R.Almeida,Buchanania cochinchinensis,มะม่วงหัวแมงวัน,2,1,1,FALSE,กรมป่าไม้(2548),Species,700,,2,
10,Anacardiaceae,Buchanania,reticulata,Buchanania reticulata Hance,Buchanania reticulata,หัวแมงวัน,1,0,1,FALSE,Global,Genus,411,,3,
11,Anacardiaceae,Buchanania,siamensis,Buchanania siamensis Miq.,Buchanania siamensis,ธนนไชย,2,1,1,FALSE,กรมป่าไม้(2548),Species,700,,2,
12,Anacardiaceae,Gluta,Unknown,Gluta sp.Buriram1,Gluta sp.Buriram1,,1,0,1,FALSE,Global,Genus,583,,3,
13,Anacardiaceae,Gluta,Unknown,Gluta sp.Trat1,Gluta sp.Trat1,,1,0,1,FALSE,Global,Genus,583,,3,
14,Anacardiaceae,Gluta,laccifera,Gluta laccifera (Pierre) Ding Hou,Gluta laccifera,น้ำเกลี้ยง,2,1,1,FALSE,IPCC(2006),Species,630,,3,
15,Anacardiaceae,Gluta,usitata,Gluta usitata (Wall.) Ding Hou,Gluta usitata,รักใหญ่,2,1,1,FALSE,Global,Species,740,,2,
16,Anacardiaceae,Lannea,coromandelica,Lannea coromandelica (Houtt.) Merr.,Lannea coromandelica,กุ๊ก,2,1,1,FALSE,IPCC(2006),Species,520,,3,
17,Anacardiaceae,Mangifera,Unknown,Mangifera sp.,Mangifera sp.,,1,0,1,FALSE,กรมป่าไม้(2548),Species,810,,2,
18,Anacardiaceae,Mangifera,caloneura,Mangifera caloneura Kurz,Mangifera caloneura,มะม่วงป่า,2,1,1,FALSE,IPCC(2006),Species,630,,3,
19,Anacardiaceae,Mangifera,indica,Mangifera indica L.,Mangifera indica,มะม่วง,2,1,1,FALSE,กรมป่าไม้(2548),Species,727,,2,
20,Anacardiaceae,Semecarpus,cochinchinensis,Semecarpus cochinchinensis Engl.,Semecarpus cochinchinensis,รักขาว,2,1,1,FALSE,Global,Species,358,,3,
21,Anacardiaceae,Semecarpus,curtisii,Semecarpus curtisii King,Semecarpus curtisii,รักเขา,1,1,0,FALSE,Global,Genus,358,,3,
22,Anacardiaceae,Spondias,bipinnata,Spondias bipinnata Airy Shaw & Forman,Spondias bipinnata,มะกัก,1,0,1,FALSE,Global,Genus,363,,3,
23,Anacardiaceae,Spondias,dulcis,Spondias dulcis Parkinson,Spondias dulcis,มะกอกฝรั่ง,2,1,1,FALSE,Global,Species,370,,3,
24,Anacardiaceae,Spondias,pinnata,Spondias pinnata (L.f.) Kurz,Spondias pinnata,มะกอกป่า,2,1,1,FALSE,Global,Species,294,,3,
25,Anacardiaceae,Toxicodendron,succedaneum,Toxicodendron succedaneum (L.) Kuntze,Toxicodendron succedaneum,มะเหลี่ยมหิน,1,1,0,FALSE,Global,Family,558,,3,
26,Anacardiaceae,Unknow,Unknown,Unknown-genus-Anacardiaceae-MaeHongSon,Unknown-genus-Anacardiaceae-MaeHongSon,,1,0,1,FALSE,Global,Family,558,,3,
27,Annonaceae,Annona,squamosa,Annona squamosa L.,Annona squamosa,น้อยหน่า,1,0,1,FALSE,Global,Species,618,,3,
28,Annonaceae,Cananga,latifolia,Cananga latifolia Finet & Gagnep.,Cananga latifolia,สะแกแสง,2,1,1,FALSE,กรมป่าไม้(2548),Species,530,,3,
29,Annonaceae,Cananga,odorata,Cananga odorata (Lam.) Hook.f. & Thomson,Cananga odorata,กระดังงาไทย,2,1,1,FALSE,กรมป่าไม้(2548),Genus,530,,3,
30,Annonaceae,Dasymachalon,Unknown,Dasymachalon sp.Trat1,Dasymachalon sp.Trat1,,1,0,1,FALSE,Global,Family,564,,3,
31,Annonaceae,Dracontomelon,dao,Dracontomelon dao (Blanco) Merr. & Rolfe,Dracontomelon dao,พระเจ้าห้าพระองค์,1,0,1,FALSE,Global,Species,400,,3,
32,Annonaceae,Huberantha,cerasoides,Huberantha cerasoides (Roxb.) Chaowasku,Huberantha cerasoides,กะเจียน,2,1,1,FALSE,Global,Family,564,,3,
33,Annonaceae,Miliusa,velutina,Miliusa velutina (DC.) Hook.f. & Thomson,Miliusa velutina,ขางหัวหมู,2,1,1,FALSE,กรมป่าไม้(2548),Species,540,,3,
34,Annonaceae,Mitrephora,winitii,Mitrephora winitii Craib,Mitrephora winitii,มหาพรหม,1,1,0,FALSE,Global,Genus,680,,2,
35,Annonaceae,Monoon,longifolium,Monoon longifolium (Sonn.) B.Xue & R.M.K.Saunders,Monoon longifolium,อโศกอินเดีย,2,1,1,TRUE,Adediji & Wilson (2024),Species,504.23,,3,
36,Annonaceae,Monoon,viride,Monoon viride (Craib) B.Xue & R.M.K.Saunders,Monoon viride,ยางโอน,2,1,1,FALSE,Global,Family,564,,3,
37,Annonaceae,Orophea,polycarpa,Orophea polycarpa A.DC.,Orophea polycarpa,จักหัน,1,0,1,FALSE,Global,Family,564,,3,
38,Annonaceae,Polyalthia,suberosa,Polyalthia suberosa (Roxb.) Thwaites,Polyalthia suberosa,กลึงกล่อม,1,0,1,FALSE,Global,Species,680,,2,
39,Annonaceae,Sphaerocoryne,lefevrei,Sphaerocoryne lefevrei (Baill.) D.M.Johnson & N.A.Murray,Sphaerocoryne lefevrei,ลำดวน,2,1,1,TRUE,Global,Family,564,,3,
40,Annonaceae,Xylopia,pierrei,Xylopia pierrei Hance,Xylopia pierrei,สะทางเล็ก,1,0,1,FALSE,Global,Genus,594,,3,
41,Annonaceae,Xylopia,vielana,Xylopia vielana Pierre,Xylopia vielana,กล้วยน้อย,1,0,1,FALSE,Global,Genus,594,,3,
42,Apocynaceae,Alstonia,macrophylla,Alstonia macrophylla Wall. ex G.Don,Alstonia macrophylla,ทุ้งฟ้า,2,1,1,FALSE,กรมป่าไม้(2548),Species,520,,3,
43,Apocynaceae,Alstonia,scholaris,Alstonia scholaris (L.) R.Br.,Alstonia scholaris,สัตตบรรณ,2,1,1,TRUE,กรมป่าไม้(2548),Species,400,,3,
44,Apocynaceae,Alstonia,spatulata,Alstonia spatulata Blume,Alstonia spatulata,เทียะ,1,0,1,FALSE,Global,Species,340,,3,
45,Apocynaceae,Cascabela,thevetia,Cascabela thevetia (L.) Lippold,Cascabela thevetia,รำเพย,2,1,1,FALSE,Global,Family,567,,3,
46,Apocynaceae,Cerbera,manghas,Cerbera manghas L.,Cerbera manghas,ตีนเป็ดทราย,2,1,1,FALSE,Global,Species,380,,3,
47,Apocynaceae,Cerbera,odollam,Cerbera odollam Gaertn.,Cerbera odollam,ตีนเป็ดทะเล,2,1,1,TRUE,Global,Species,300,,3,
48,Apocynaceae,Holarrhena,pubescens,Holarrhena pubescens Wall. ex G.Don,Holarrhena pubescens,โมกใหญ่,2,1,1,FALSE,Global,Species,732,,2,
49,Apocynaceae,Kopsia,arborea,Kopsia arborea Blume,Kopsia arborea,พุดดง,2,1,1,FALSE,Global,Family,567,,3,
50,Apocynaceae,Nerium,oleander,Nerium oleander L.,Nerium oleander,ยี่โถ,2,1,1,FALSE,Global,Species,600,,3,
51,Apocynaceae,Plumeria,obtusa,Plumeria obtusa L.,Plumeria obtusa,ลั่นทมขาว,2,1,1,FALSE,กรมป่าไม้(2548),Genus,930,,2,
52,Apocynaceae,Plumeria,rubra,Plumeria rubra L.,Plumeria rubra,ลั่นทมแดง,2,1,1,FALSE,กรมป่าไม้(2548),Genus,930,,2,
53,Apocynaceae,Tabernaemontana,divaricata,Tabernaemontana divaricata (L.) R.Br. ex Roem. & Schult.,Tabernaemontana divaricata,พุดจีบ,2,1,1,FALSE,Global,Species,750,,2,
54,Apocynaceae,Wrightia,arborea,Wrightia arborea (Dennst.) Mabb.,Wrightia arborea,โมกมัน,2,1,1,TRUE,กรมป่าไม้(2548),Genus,620,,3,
55,Apocynaceae,Wrightia,religiosa,Wrightia religiosa (Teijsm. & Binn.) Benth. ex Kurz,Wrightia religiosa,โมกบ้าน,2,1,1,FALSE,กรมป่าไม้(2548),Genus,620,,3,
56,Aquifoliaceae,Ilex,cymosa,Ilex cymosa Blume,Ilex cymosa,ไทรขี้ใต้,1,0,1,FALSE,Global,Species,488,,3,
57,Arecaceae,Cocos,nucifera,Cocos nucifera L.,Cocos nucifera,มะพร้าว,1,1,0,FALSE,IPCC(2006),Species,500,,3,
58,Bignoniaceae,Crescentia,cujete,Crescentia cujete L.,Crescentia cujete,น้ำเต้าต้น,2,1,1,FALSE,Global,Species,634,,3,
59,Bignoniaceae,Dolichandrone,serrulata,Dolichandrone serrulata (Wall. ex DC.) Seem.,Dolichandrone serrulata,แคนา,2,1,1,TRUE,Global,Species,441,,3,
60,Bignoniaceae,Dolichandrone,spathacea,Dolichandrone spathacea (L.f.) K.Schum.,Dolichandrone spathacea,แคทะเล,1,1,0,FALSE,Global,Species,430,,3,
61,Bignoniaceae,Fernandoa,adenophylla,Fernandoa adenophylla (Wall. ex G.Don) Steenis,Fernandoa adenophylla,แคบิด,2,1,1,FALSE,Global,Species,490,,3,
62,Bignoniaceae,Handroanthus,chrysanthus,Handroanthus chrysanthus (Jacq.) S.O.Grose,Handroanthus chrysanthus,เหลืองอินเดีย,2,1,1,FALSE,Global,Family,619,,3,
63,Bignoniaceae,Handroanthus,chrysotrichus,Handroanthus chrysotrichus (Mart. ex DC.) Mattos,Handroanthus chrysotrichus,เหลืองเชียงราย,2,1,1,FALSE,Global,Family,619,,3,
64,Bignoniaceae,Heterophragma,sulfureum,Heterophragma sulfureum Kurz,Heterophragma sulfureum,แครกฟ้า,2,1,1,FALSE,Global,Species,579,,3,
65,Bignoniaceae,Jacaranda,obtusifolia,Jacaranda obtusifolia Bonpl.,Jacaranda obtusifolia,ศรีตรัง,2,1,1,FALSE,Global,Species,480,,3,
66,Bignoniaceae,Markhamia,stipulata,Markhamia stipulata (Wall.) Seem.,Markhamia stipulata,แคหางค่าง,2,1,1,FALSE,Global,Species,676,,2,
67,Bignoniaceae,Mayodendron,igneum,Mayodendron igneum (Kurz) Kurz,Mayodendron igneum,ปีบทอง,2,1,1,FALSE,Global,Family,619,,3,
68,Bignoniaceae,Millingtonia,hortensis,Millingtonia hortensis L.f.,Millingtonia hortensis,ปีบ,2,1,1,TRUE,กรมป่าไม้(2548),Species,640,,3,
69,Bignoniaceae,Oroxylum,indicum,Oroxylum indicum (L.) Kurz,Oroxylum indicum,เพกา,2,1,1,FALSE,Global,Species,411,,3,
70,Bignoniaceae,Radermachera,yunnanensis,Radermachera yunnanensis C.Y.Wu & W.C.Yin,Radermachera yunnanensis,ปีบยูนนาน,1,0,1,FALSE,Global,Genus,483,,3,
71,Bignoniaceae,Spathodea,campanulata,Spathodea campanulata P.Beauv.,Spathodea campanulata,แคแสด,2,1,1,FALSE,IPCC(2006),Species,250,,3,
72,Bignoniaceae,Stereospermum,Unknown,Stereospermum sp.Trang1,Stereospermum sp.Trang1,,1,0,1,FALSE,กรมป่าไม้(2548),Genus,800,,2,
73,Bignoniaceae,Stereospermum,fimbriatum,Stereospermum fimbriatum (Wall. ex G.Don) DC.,Stereospermum fimbriatum,แคยอดดำ,2,1,1,FALSE,กรมป่าไม้(2548),Genus,800,,2,
74,Bignoniaceae,Stereospermum,neuranthum,Stereospermum neuranthum Kurz,Stereospermum neuranthum,แคทราย,2,1,1,FALSE,กรมป่าไม้(2548),Species,800,,2,
75,Bignoniaceae,Tabebuia,aurea,Tabebuia aurea (Silva Manso) Benth. & Hook.f. ex S.Moore,Tabebuia aurea,เหลืองปรีดียาธร,2,1,1,FALSE,Global,Species,760,,2,
76,Bignoniaceae,Tabebuia,rosea,Tabebuia rosea (Bertol.) DC.,Tabebuia rosea,ชมพูพันธุ์ทิพย์,2,1,1,TRUE,IPCC(2006),Species,540,,3,
77,Bignoniaceae,Tecoma,stans,Tecoma stans (L.) Juss. ex Kunth,Tecoma stans,ทองอุไร,1,0,1,FALSE,IPCC(2006),Species,466,,3,
78,Bignoniaceae,Unknow,Unknown,Unknown genus-Bignoniaceae-UthaiThani,Unknown genus-Bignoniaceae-UthaiThani,,1,0,1,FALSE,Global,Family,619,,3,
79,Boraginaceae,Cordia,cochinchinensis,Cordia cochinchinensis Gagnep.,Cordia cochinchinensis,หมัน,2,1,1,FALSE,IPCC(2006),Species,530,,3,
80,Boraginaceae,Cordia,dichotoma,Cordia dichotoma G.Forst.,Cordia dichotoma,หมันดง,2,1,1,FALSE,IPCC(2006),Species,530,,3,
81,Boraginaceae,Cordia,sebestena,Cordia sebestena L.,Cordia sebestena,คอร์เดีย,2,1,1,FALSE,IPCC(2006),Species,530,,3,
82,Boraginaceae,Cordia,subcordata,Cordia subcordata L.,Cordia subcordata,หมันทะเล,2,1,1,FALSE,IPCC(2006),Species,530,,3,
83,Boraginaceae,Ehretia,Unknown,Ehretia sp.Ratchaburi1,Ehretia sp.Ratchaburi1,,1,0,1,FALSE,Global,Genus,506,,3,
84,Boraginaceae,Ehretia,timorensis,Ehretia timorensis Decne.,Ehretia timorensis,ก่ายกอม,1,1,0,FALSE,Global,Genus,506,,3,
85,Burseraceae,Canarium,subulatum,Canarium subulatum Guillaumin,Canarium subulatum,มะกอกเกลื้อน,2,1,1,FALSE,กรมป่าไม้(2548),Genus,510,,3,
86,Burseraceae,Garuga,pinnata,Garuga pinnata Roxb.,Garuga pinnata,ตะคร้ำ,2,1,1,FALSE,กรมป่าไม้(2548),Genus,810,,2,
87,Burseraceae,Protium,serratum,Protium serratum (Wall. ex Colebr.) Engl.,Protium serratum,มะแฟน,2,1,1,FALSE,กรมป่าไม้(2548),Species,820,,2,
88,Calophyllaceae,Calophyllum,calaba,Calophyllum calaba L.,Calophyllum calaba,ตังหน,1,0,1,FALSE,Global,Species,591,,3,
89,Calophyllaceae,Calophyllum,inophyllum,Calophyllum inophyllum L.,Calophyllum inophyllum,กระทิง,2,1,1,TRUE,กรมป่าไม้(2548),Genus,690,,2,
90,Calophyllaceae,Mammea,siamensis,Mammea siamensis (Miq.) T.Anderson,Mammea siamensis,สารภี,2,1,1,TRUE,Global,Species,682,,2,
91,Calophyllaceae,Mesua,ferrea,Mesua ferrea L.,Mesua ferrea,บุนนาค,2,1,1,FALSE,กรมป่าไม้(2548),Genus,1120,,1,
92,Cannabaceae,Trema,orientale,Trema orientale (L.) Blume,Trema orientale,พังแหรใหญ่,2,1,1,FALSE,IPCC(2006),Species,310,,3,
93,Capparaceae,Capparis,micracantha,Capparis micracantha DC.,Capparis micracantha,ชิงชี่,2,1,1,FALSE,Global,Genus,691,,2,
94,Capparaceae,Crateva,adansonii,Crateva adansonii DC.,Crateva adansonii,กุ่มบก,2,1,1,FALSE,Global,Genus,467,,3,
95,Capparaceae,Crateva,magna,Crateva magna (Lour.) DC.,Crateva magna,กุ่มน้ำ,2,1,1,FALSE,Global,Genus,467,,3,
96,Capparaceae,Maerua,siamensis,Maerua siamensis (Kurz) Pax,Maerua siamensis,แจง,2,1,1,FALSE,Sulieman et al. (2020),Maerua crassifolia,530,,3,
97,Casuarinaceae,Casuarina,equisetifolia,Casuarina equisetifolia L.,Casuarina equisetifolia,สนทะเล,2,1,1,TRUE,IPCC(2006),Species,810,,2,
98,Celastraceae,Elaeodendron,glaucum,Elaeodendron glaucum (Rottb.) Pers.,Elaeodendron glaucum,มักน้ำนองต้น,2,1,1,FALSE,Global,Species,750,,2,
99,Celastraceae,Lophopetalum,duperreanum,Lophopetalum duperreanum  Pierre,Lophopetalum duperreanum,สองสลึง,1,0,1,FALSE,Global,Genus,516,,3,
100,Celastraceae,Pleurostylia,opposita,Pleurostylia opposita (Wall.) Alston,Pleurostylia opposita,แดงหิน,1,0,1,FALSE,Global,Species,660,,2,
101,Celastraceae,Siphonodon,celastrineus,Siphonodon celastrineus Griff.,Siphonodon celastrineus,มะดูก,1,1,0,FALSE,Global,Species,619,,3,
102,Chrysobalanaceae,Maranthes,corymbosa,Maranthes corymbosa Blume,Maranthes corymbosa,ชีขาดเพล,1,1,0,FALSE,Global,Species,798,,2,
103,Chrysobalanaceae,Parinari,anamensis,Parinari anamensis Hance,Parinari anamensis,มะพอก,2,1,1,FALSE,กรมป่าไม้(2548),,720,,2,
104,Clusiaceae,Garcinia,celebica,Garcinia celebica L.,Garcinia celebica,พะวา,2,1,1,FALSE,กรมป่าไม้(2548),,830,,2,
105,Clusiaceae,Garcinia,cowa,Garcinia cowa Roxb. ex Choisy,Garcinia cowa,ชะมวง,2,1,1,FALSE,กรมป่าไม้(2548),Genus,753.33,,2,
106,Clusiaceae,Garcinia,mangostana,Garcinia mangostana L.,Garcinia mangostana,มังคุด,1,0,1,FALSE,Global,Species,810,,2,
107,Clusiaceae,Garcinia,merguensis,Garcinia merguensis Wight,Garcinia merguensis,นวล,1,0,1,FALSE,Global,Species,780,,2,
108,Clusiaceae,Garcinia,schomburgkiana,Garcinia schomburgkiana Pierre,Garcinia schomburgkiana,มะดัน,2,1,1,FALSE,กรมป่าไม้(2548),Genus,753.33,,2,
109,Cochlospermaceae,Cochlospermum,religiosum,Cochlospermum religiosum (L.) Alston,Cochlospermum religiosum,สุพรรณิการ์,2,1,1,FALSE,Global,Species,234,,3,
110,Combretaceae,Combretum,quadrangulare,Combretum quadrangulare Kurz,Combretum quadrangulare,สะแกนา,2,1,1,FALSE,Global,Genus,791,,2,
111,Combretaceae,Lumnitzera,racemosa,Lumnitzera racemosa Willd.,Lumnitzera racemosa,ฝาดขาว,2,1,1,FALSE,Global,Species,710,,2,
112,Combretaceae,Terminalia,bellirica,Terminalia bellirica (Gaertn.) Roxb.,Terminalia bellirica,สมอพิเภก,2,1,1,TRUE,กรมป่าไม้(2548),Species,740,,2,
113,Combretaceae,Terminalia,calamansanai,Terminalia calamansanai (Blanco) Rolfe,Terminalia calamansanai,สกุณี,2,1,1,FALSE,กรมป่าไม้(2548),Genus,943.33,,2,
114,Combretaceae,Terminalia,catappa,Terminalia catappa L.,Terminalia catappa,หูกวาง,2,1,1,TRUE,กรมป่าไม้(2548),Genus,943.33,,2,
115,Combretaceae,Terminalia,chebula,Terminalia chebula Retz.,Terminalia chebula,สมอไทย,2,1,1,FALSE,กรมป่าไม้(2548),Species,880,,2,
116,Combretaceae,Terminalia,elliptica,Terminalia elliptica Willd.,Terminalia elliptica,รกฟ้า,2,1,1,FALSE,กรมป่าไม้(2548),Genus,943.33,,2,
117,Combretaceae,Terminalia,glaucifolia,Terminalia glaucifolia Craib,Terminalia glaucifolia,แหนนา,2,1,1,FALSE,กรมป่าไม้(2548),Genus,943.33,,2,
118,Combretaceae,Terminalia,ivorensis,Terminalia ivorensis A.Chev.,Terminalia ivorensis,หูกระจง,2,1,1,TRUE,กรมป่าไม้(2548),Genus,943.33,,2,
119,Combretaceae,Terminalia,mucronata,Terminalia mucronata Craib & Hutch.,Terminalia mucronata,ตะแบกเลือด,2,1,1,FALSE,กรมป่าไม้(2548),Species,1250,,1,
120,Combretaceae,Terminalia,pierrei,Terminalia pierrei Gagnep.,Terminalia pierrei,ตะแบกกราย,1,0,1,FALSE,กรมป่าไม้(2548),Genus,943.33,,2,
121,Combretaceae,Terminalia,triptera,Terminalia triptera Stapf,Terminalia triptera,ขี้อ้าย,2,1,1,FALSE,กรมป่าไม้(2548),Genus,943.33,,2,
122,Connaraceae,Ellipanthus,tomentosus,Ellipanthus tomentosus Kurz,Ellipanthus tomentosus,คำรอก,2,1,1,FALSE,Global,Family,500,,3,
123,Cornaceae,Alangium,indochinense,Alangium indochinense W.J.de Wilde & Duyfjes,Alangium indochinense,ปรู๋,2,1,1,FALSE,Global,Genus,617,,3,
124,Cornaceae,Alangium,kurzii,Alangium kurzii Craib,Alangium kurzii,ผีเสื้อ,1,0,1,FALSE,Global,Species,420,,3,
125,Cornaceae,Alangium,kurzii,Alangium kurzii Craib,Alangium kurzii,ฝาละมี,1,1,0,FALSE,Global,Species,420,,3,
126,Crypteroniaceae,Crypteronia,paniculata,Crypteronia paniculata Blume,Crypteronia paniculata,กะอาม,2,1,1,FALSE,กรมป่าไม้(2548),Genus,1000,,1,
127,Cupressaceae,Chamaecyparis,obtusa,Chamaecyparis obtusa (Siebold & Zucc.) Endl.,Chamaecyparis obtusa,สนแผง,1,0,1,FALSE,Global,Species,490,,3,
128,Dilleniaceae,Dillenia,indica,Dillenia indica L.,Dillenia indica,มะตาด,2,1,1,FALSE,IPCC(2006),Species,590,,3,
129,Dilleniaceae,Dillenia,obovata,Dillenia obovata (Blume) Hoogland,Dillenia obovata,ส้านใหญ่,2,1,1,FALSE,IPCC(2006),Species,590,,3,
130,Dilleniaceae,Dillenia,ovata,Dillenia ovata Wall. ex Hook.f. & Thomson,Dillenia ovata,ส้านใบเล็ก,2,1,1,FALSE,IPCC(2006),Species,590,,3,
131,Dilleniaceae,Dillenia,parviflora,Dillenia parviflora Griff.,Dillenia parviflora,ส้านหิ่ง,2,1,1,FALSE,IPCC(2006),Species,590,,3,
132,Dilleniaceae,Dillenia,suffruticosa,Dillenia suffruticosa (Griff.) Martelli,Dillenia suffruticosa,ส้านชะวา,1,0,1,FALSE,Global,Species,450,,3,
133,Dipterocarpaceae,Anisoptera,costata,Anisoptera costata Korth.,Anisoptera costata,กระบาก,2,1,1,FALSE,กรมป่าไม้(2548),Species,600,,3,
134,Dipterocarpaceae,Anthoshorea,roxburghii,Anthoshorea roxburghii (G.Don) P.S.Ashton & J.Heck.,Anthoshorea roxburghii,พะยอม,2,1,1,TRUE,กรมป่าไม้(2548),Species,840,,2,
135,Dipterocarpaceae,Cotylelobium,lanceolatum,Cotylelobium lanceolatum Craib,Cotylelobium lanceolatum,เคี่ยม,1,0,1,FALSE,Global,Species,780,,2,
136,Dipterocarpaceae,Dipterocarpus,Unknown,Dipterocarpus sp.,Dipterocarpus sp.,,1,1,0,FALSE,กรมป่าไม้(2548),Species,700,,2,
137,Dipterocarpaceae,Dipterocarpus,alatus,Dipterocarpus alatus Roxb. ex G.Don,Dipterocarpus alatus,ยางนา,2,1,1,TRUE,กรมป่าไม้(2548),Genus,832.5,,2,
138,Dipterocarpaceae,Dipterocarpus,intricatus,Dipterocarpus intricatus Dyer,Dipterocarpus intricatus,ยางกราด,1,0,1,FALSE,Global,Species,684,,2,
139,Dipterocarpaceae,Dipterocarpus,kerrii,Dipterocarpus kerrii King,Dipterocarpus kerrii,ยางมันหมู,1,1,0,FALSE,กรมป่าไม้(2548),Genus,832.5,,2,
140,Dipterocarpaceae,Dipterocarpus,obtusifolius,Dipterocarpus obtusifolius Teijsm. ex Miq.,Dipterocarpus obtusifolius,ยางเหียง,2,1,1,FALSE,กรมป่าไม้(2548),Species,900,,2,
141,Dipterocarpaceae,Dipterocarpus,tuberculatus,Dipterocarpus tuberculatus Roxb.,Dipterocarpus tuberculatus,ยางพลวง,2,1,1,FALSE,กรมป่าไม้(2548),Species,860,,2,
142,Dipterocarpaceae,Hopea,odorata,Hopea odorata Roxb.,Hopea odorata,ตะเคียนทอง,2,1,1,TRUE,กรมป่าไม้(2548),Species,800,,2,
143,Dipterocarpaceae,Pentacme,siamensis,Pentacme siamensis (Miq.) Kurz,Pentacme siamensis,รัง,2,1,1,TRUE,UW Kyis et al. (2002),Species,929,,2,
144,Dipterocarpaceae,Shorea,obtusa,Shorea obtusa Wall. ex Blume,Shorea obtusa,เต็ง,2,1,1,TRUE,กรมป่าไม้(2548),Species,1050,,1,
145,Dipterocarpaceae,Vatica,diospyroides,Vatica diospyroides Symington,Vatica diospyroides,จันทน์กะพ้อ,2,1,1,FALSE,กรมป่าไม้(2548),Genus,1060,,1,
146,Dipterocarpaceae,Vatica,harmandiana,Vatica harmandiana Pierre,Vatica harmandiana,สะเดาปัก,2,1,1,FALSE,กรมป่าไม้(2548),Genus,1060,,1,
147,Ebenaceae,Diospyros,Unknown,Diospyros sp.AmnatCharoen1,Diospyros sp.AmnatCharoen1,,1,0,1,FALSE,กรมป่าไม้(2548),Genus,1036,,1,
148,Ebenaceae,Diospyros,Unknown,Diospyros sp.MahaSarakham1,Diospyros sp.MahaSarakham1,,1,0,1,FALSE,กรมป่าไม้(2548),Genus,1036,,1,
149,Ebenaceae,Diospyros,Unknown,Diospyros sp.SaKaeo1,Diospyros sp.SaKaeo1,,1,0,1,FALSE,กรมป่าไม้(2548),Genus,1036,,1,
150,Ebenaceae,Diospyros,Unknown,Diospyros sp.Trang 1,Diospyros sp.Trang 1,,1,0,1,FALSE,กรมป่าไม้(2548),Genus,1036,,1,
151,Ebenaceae,Diospyros,Unknown,Diospyros sp.Trang2,Diospyros sp.Trang2,,1,0,1,FALSE,กรมป่าไม้(2548),Genus,1036,,1,
152,Ebenaceae,Diospyros,Unknown,Diospyros sp.Trat1,Diospyros sp.Trat1,,1,0,1,FALSE,กรมป่าไม้(2548),Genus,1036,,1,
153,Ebenaceae,Diospyros,buxifolia,Diospyros buxifolia (Blume) Hiern,Diospyros buxifolia,สั่งทำ,1,0,1,FALSE,กรมป่าไม้(2548),Genus,1036,,1,
154,Ebenaceae,Diospyros,castanea,Diospyros castanea (Craib) H.R.Fletcher,Diospyros castanea,ตะโกพนม,2,1,1,FALSE,กรมป่าไม้(2548),Genus,1036,,1,
155,Ebenaceae,Diospyros,coaetanea,Diospyros coaetanea H.R.Fletcher,Diospyros coaetanea,ลำตาควาย,1,1,0,FALSE,กรมป่าไม้(2548),Genus,1036,,1,
156,Ebenaceae,Diospyros,curranii,Diospyros curranii Merr.,Diospyros curranii,นั่งจ้อย,2,1,1,FALSE,กรมป่าไม้(2548),Genus,1036,,1,
157,Ebenaceae,Diospyros,decandra,Diospyros decandra Lour.,Diospyros decandra,อินจัน,2,1,1,FALSE,กรมป่าไม้(2548),Genus,1036,,1,
158,Ebenaceae,Diospyros,ehretioides,Diospyros ehretioides Wall. ex G.Don,Diospyros ehretioides,ตับเต่าต้น,2,1,1,FALSE,กรมป่าไม้(2548),Genus,1036,,1,
159,Ebenaceae,Diospyros,ferrea,Diospyros ferrea (Willd.) Bakh.,Diospyros ferrea,ลำบิด,1,0,1,FALSE,Global,Species,940,,2,
160,Ebenaceae,Diospyros,filipendula,Diospyros filipendula Pierre ex Lecomte,Diospyros filipendula,ลำบิดดง,2,1,1,FALSE,กรมป่าไม้(2548),Genus,1036,,1,
161,Ebenaceae,Diospyros,malabarica,Diospyros malabarica (Desr.) Kostel.,Diospyros malabarica,ตะโกสวน,2,1,1,FALSE,กรมป่าไม้(2548),Genus,1036,,1,
162,Ebenaceae,Diospyros,mollis,Diospyros mollis Griff.,Diospyros mollis,มะเกลือ,2,1,1,FALSE,กรมป่าไม้(2548),Species,1310,,1,
163,Ebenaceae,Diospyros,montana,Diospyros montana Roxb.,Diospyros montana,ถ่านไฟผี,2,1,1,FALSE,กรมป่าไม้(2548),Genus,1036,,1,
164,Ebenaceae,Diospyros,pilosanthera,Diospyros pilosanthera Blanco,Diospyros pilosanthera,กะลิง,2,1,1,FALSE,กรมป่าไม้(2548),Genus,1036,,1,
165,Ebenaceae,Diospyros,rhodocalyx,Diospyros rhodocalyx Kurz,Diospyros rhodocalyx,ตะโกนา,2,1,1,FALSE,กรมป่าไม้(2548),Genus,1036,,1,
166,Ebenaceae,Diospyros,transitoria,Diospyros transitoria Bakh.,Diospyros transitoria,มะพลับทอง,1,1,0,FALSE,กรมป่าไม้(2548),Species,960,,2,
167,Ebenaceae,Diospyros,variegata,Diospyros variegata Kurz,Diospyros variegata,พญารากดำ,1,0,1,FALSE,กรมป่าไม้(2548),Genus,1035,,1,
168,Ebenaceae,Diospyros,venosa,Diospyros venosa Wall. ex A.DC.,Diospyros venosa,จันดำ,2,1,1,FALSE,กรมป่าไม้(2548),Genus,1036,,1,
169,Ebenaceae,Diospyros,wallichii,Diospyros wallichii King & Gamble,Diospyros wallichii,ดำตะโก,1,1,0,FALSE,กรมป่าไม้(2548),Genus,1036,,1,
170,Elaeocarpaceae,Elaeocarpus,Unknown,Elaeocarpus sp.AmnatCharoen1,Elaeocarpus sp.AmnatCharoen1,,1,0,1,FALSE,Global,Genus,490,,3,
171,Elaeocarpaceae,Elaeocarpus,floribundus,Elaeocarpus floribundus Blume,Elaeocarpus floribundus,กาลน,2,1,1,FALSE,Global,Species,439,,3,
172,Elaeocarpaceae,Elaeocarpus,grandiflorus,Elaeocarpus grandiflorus Sm.,Elaeocarpus grandiflorus,ไคร้ย้อย,2,1,1,FALSE,Global,Genus,490,,3,
173,Elaeocarpaceae,Elaeocarpus,hygrophilus,Elaeocarpus hygrophilus Kurz,Elaeocarpus hygrophilus,มะกอกน้ำ,2,1,1,FALSE,Global,Genus,490,,3,
174,Elaeocarpaceae,Elaeocarpus,tectorius,Elaeocarpus tectorius (Lour.) Poir.,Elaeocarpus tectorius,สะท้อนรอก,1,0,1,FALSE,Global,Genus,490,,3,
175,Euphorbiaceae,Alchornea,Unknown,Alchornea sp.1,Alchornea sp.1,,1,1,0,FALSE,"Zanne et al., 2009",Genus,412.8,,3,
176,Euphorbiaceae,Balakata,baccata,Balakata baccata (Roxb.) Esser,Balakata baccata,โพบาย,2,1,1,FALSE,Global,Family,508,,3,
177,Euphorbiaceae,Claoxylon,indicum,Claoxylon indicum (Reinw. ex Blume) Hassk.,Claoxylon indicum,ขางน้ำผึ้ง,2,1,1,FALSE,Global,Species,350,,3,
178,Euphorbiaceae,Cleidion,javanicum,Cleidion javanicum Blume,Cleidion javanicum,ดีหมี,2,1,1,FALSE,Global,Species,450,,3,
179,Euphorbiaceae,Croton,Unknown,Croton sp.Trat1,Croton sp.Trat1,,1,0,1,FALSE,Global,Genus,514,,3,
180,Euphorbiaceae,Croton,hutchinsonianus,Croton hutchinsonianus Hosseus,Croton hutchinsonianus,เปล้าแพะ,2,1,1,FALSE,Global,Genus,515,,3,
181,Euphorbiaceae,Croton,persimilis,Croton persimilis Müll.Arg.,Croton persimilis,เปล้าใหญ่,2,1,1,FALSE,Global,Genus,515,,3,
182,Euphorbiaceae,Erismanthus,sinensis,Erismanthus sinensis Oliv.,Erismanthus sinensis,แอ๊ดใบเล็ก,1,0,1,FALSE,Global,Species,170,,3,
183,Euphorbiaceae,Excoecaria,agallocha,Excoecaria agallocha L.,Excoecaria agallocha,ตาตุ่มทะเล,1,0,1,FALSE,Global,Species,405,,3,
184,Euphorbiaceae,Falconeria,insignis,Falconeria insignis Royle,Falconeria insignis,ตาตุ่มบก,2,1,1,FALSE,Global,Species,310,,3,
185,Euphorbiaceae,Hevea,brasiliensis,Hevea brasiliensis (Willd. ex A.Juss.) Müll.Arg.,Hevea brasiliensis,ยางพารา,2,1,1,TRUE,กรมป่าไม้(2548),Species,700,,2,
186,Euphorbiaceae,Jatropha,curcas,Jatropha curcas L.,Jatropha curcas,สบู่ดำ,1,0,1,FALSE,Global,Species,170,,3,
187,Euphorbiaceae,Macaranga,pruinosa,Macaranga pruinosa (Miq.) Müll. Arg.,Macaranga pruinosa,มะฮังใหญ่,1,0,1,FALSE,Global,Species,310,,3,
188,Euphorbiaceae,Mallotus,nudiflorus,Mallotus nudiflorus (L.) Kulju & Welzen,Mallotus nudiflorus,มะฝ่อ,2,1,1,FALSE,Global,Species,503,,3,
189,Euphorbiaceae,Mallotus,philippensis,Mallotus philippensis (Lam.) Müll.Arg.,Mallotus philippensis,คำแสด,2,1,1,FALSE,IPCC(2006),Species,640,,3,
190,Euphorbiaceae,Suregada,multiflora,Suregada multiflora (A.Juss.) Baill.,Suregada multiflora,ขันทองพยาบาท,2,1,1,FALSE,Global,Species,647,,3,
191,Fabaceae,Acacia,auriculiformis,Acacia auriculiformis A.Cunn. ex Benth.,Acacia auriculiformis,กระถินณรงค์,2,1,1,TRUE,กรมป่าไม้(2548),Species,590,,3,
192,Fabaceae,Acacia,mangium,Acacia mangium Willd.,Acacia mangium,กระถินเทพา,2,1,1,TRUE,Global,Species,640,,3,
193,Fabaceae,Adenanthera,microsperma,Adenanthera microsperma Teijsm. & Binn.,Adenanthera microsperma,มะกล่ำตาไก่,2,1,1,FALSE,Global,Species,640,,3,
194,Fabaceae,Adenanthera,pavonina,Adenanthera pavonina  L.,Adenanthera pavonina,มะกล่ำต้น,1,0,1,FALSE,Global,Species,678,,2,
195,Fabaceae,Adinobotrys,atropurpureus,Adinobotrys atropurpureus (Wall.) Dunn,Adinobotrys atropurpureus,เเซะ,2,1,1,FALSE,กรมป่าไม้(2548),Species,850,,2,
196,Fabaceae,Afzelia,xylocarpa,Afzelia xylocarpa (Kurz) Craib,Afzelia xylocarpa,มะค่าโมง,2,1,1,TRUE,กรมป่าไม้(2548),Species,820,,2,
197,Fabaceae,Albizia,lebbeck,Albizia lebbeck (L.) Benth.,Albizia lebbeck,พฤกษ์,2,1,1,TRUE,กรมป่าไม้(2548),Genus,775,,2,
198,Fabaceae,Albizia,lebbekoides,Albizia lebbekoides (DC.) Benth.,Albizia lebbekoides,คาง,2,1,1,FALSE,กรมป่าไม้(2548),Species,730,,2,
199,Fabaceae,Albizia,odoratissima,Albizia odoratissima (L.f.) Benth.,Albizia odoratissima,กางขี้มอด,2,1,1,FALSE,กรมป่าไม้(2548),Genus,775,,2,
200,Fabaceae,Albizia,procera,Albizia procera (Roxb.) Benth.,Albizia procera,ทิ้งถ่อน,2,1,1,FALSE,Global,Species,573,,3,
201,Fabaceae,Antheroporum,harmandii,Antheroporum harmandii Gagnep.,Antheroporum harmandii,ทะลายเขา,1,1,0,FALSE,Global,Species,317,,3,
202,Fabaceae,Archidendron,jiringa,Archidendron jiringa (Jack) I.C.Nielsen,Archidendron jiringa,ชะเนียง,2,1,1,FALSE,Global,Species,317,,3,
203,Fabaceae,Barnebydendron,riedelii,Barnebydendron riedelii (Tul.) J.H.Kirkbr.,Barnebydendron riedelii,ประดู่แดง,2,1,1,FALSE,IPCC(2006),Species,670,,2,
204,Fabaceae,Bauhinia,purpurea,Bauhinia purpurea L.,Bauhinia purpurea,ชงโค,2,1,1,FALSE,กรมป่าไม้(2548),Species,790,,2,
205,Fabaceae,Bauhinia,saccocalyx,Bauhinia saccocalyx Pierre,Bauhinia saccocalyx,เสี้ยวดอกขาว,1,0,1,FALSE,Global,Genus,808,,2,
206,Fabaceae,Brownea,grandiceps,Brownea grandiceps Jacq.,Brownea grandiceps,โสกสะปัน,2,1,1,FALSE,Global,Brownea indet,1210,,1,
207,Fabaceae,Butea,monosperma,Butea monosperma (Lam.) Kuntze,Butea monosperma,ทองกวาว,2,1,1,TRUE,กรมป่าไม้(2548),Species,1130,,1,
208,Fabaceae,Caesalpinia,sappan,Caesalpinia sappan L.,Caesalpinia sappan,ฝาง,1,0,1,FALSE,Global,Species,835,,2,
209,Fabaceae,Cassia,bakeriana,Cassia bakeriana Craib,Cassia bakeriana,กัลปพฤกษ์,2,1,1,TRUE,Global,Genus,739,,2,
210,Fabaceae,Cassia,fistula,Cassia fistula L.,Cassia fistula,คูน,2,1,1,TRUE,Global,Species,798,,2,
211,Fabaceae,Cassia,grandis,Cassia grandis L.f.,Cassia grandis,กาฬพฤกษ์,2,1,1,FALSE,Global,Genus,739,,2,
212,Fabaceae,Cassia,javanica,Cassia javanica L.,Cassia javanica,ชัยพฤกษ์,2,1,1,FALSE,Global,Species,616,,3,
213,Fabaceae,Cassia,× nealiae,Cassia × nealiae H.S.Irwin & Barneby,Cassia × nealiae,คูนขาว,1,0,1,FALSE,Global,Genus,739,,2,
214,Fabaceae,Dalbergia,cana,Dalbergia cana Graham ex Kurz,Dalbergia cana,กระพี้นางนวล,2,1,1,FALSE,กรมป่าไม้(2548),Genus,1088.33,,1,
215,Fabaceae,Dalbergia,cochinchinensis,Dalbergia cochinchinensis Pierre,Dalbergia cochinchinensis,พะยูง,2,1,1,TRUE,กรมป่าไม้(2548),Species,1032,,1,
216,Fabaceae,Dalbergia,cultrata,Dalbergia cultrata T.S.Ralph,Dalbergia cultrata,กระพี้เขาควาย,2,1,1,FALSE,กรมป่าไม้(2548),Species,1090,,1,
217,Fabaceae,Dalbergia,lanceolaria var. lakhonensis,Dalbergia lanceolaria var. lakhonensis (Gagnep.) Niyomdham & P.H.Hô,Dalbergia lanceolaria var. lakhonensis,ขี้มอด,2,1,1,FALSE,Global,Species,561,,3,
218,Fabaceae,Dalbergia,nigrescens,Dalbergia nigrescens Kurz,Dalbergia nigrescens,ฉนวน,2,1,1,TRUE,กรมป่าไม้(2548),Genus,1088.33,,1,
219,Fabaceae,Dalbergia,oliveri,Dalbergia oliveri Gamble ex Prain,Dalbergia oliveri,ชิงชัน,1,0,1,FALSE,Global,Species,880,,2,
220,Fabaceae,Dalbergia,ovata,Dalbergia ovata Graham ex Benth.,Dalbergia ovata,เก็ดขาว,2,1,1,FALSE,Global,Species,675,,2,
221,Fabaceae,Delonix,regia,Delonix regia (Bojer ex Hook.) Raf.,Delonix regia,หางนกยูงฝรั่ง,2,1,1,TRUE,Global,Species,579,,3,
222,Fabaceae,Dialium,cochinchinense,Dialium cochinchinense Pierre,Dialium cochinchinense,เขลง,2,1,1,TRUE,กรมป่าไม้(2548),Species,1100,,1,
223,Fabaceae,Erythrina,fusca,Erythrina fusca Lour.,Erythrina fusca,ทองหลางน้ำ,2,1,1,FALSE,IPCC(2006),Species,270,,3,
224,Fabaceae,Erythrina,stricta,Erythrina stricta Roxb.,Erythrina stricta,ทองเดือนห้า,1,1,0,FALSE,IPCC(2006),Species,270,,3,
225,Fabaceae,Erythrophleum,succirubrum,Erythrophleum succirubrum Gagnep.,Erythrophleum succirubrum,พันชาด,1,0,1,FALSE,Global,Genus,819,,2,
226,Fabaceae,Gliricidia,sepium,Gliricidia sepium (Jacq.) Kunth,Gliricidia sepium,แคฝรั่ง,2,1,1,FALSE,Global,Species,617,,3,
227,Fabaceae,Imbralyx,leucanthus,Imbralyx leucanthus (Kurz) Z.Q.Song,Imbralyx leucanthus,สาธร,2,1,1,FALSE,The Wood Database (Ipe),Species,1110,,1,
228,Fabaceae,Intsia,palembanica,Intsia palembanica Miq.,Intsia palembanica,หลุมพอ,1,0,1,FALSE,Global,Species,659,,2,
229,Fabaceae,Leucaena,leucocephala,Leucaena leucocephala (Lam.) de Wit,Leucaena leucocephala,กระถินยักษ์,2,1,1,FALSE,IPCC(2006),Species,640,,3,
230,Fabaceae,Millettia,Unknown,Millettia sp.1,Millettia sp.1,,2,1,1,FALSE,กรมป่าไม้(2548),Genus,1200,,1,
231,Fabaceae,Millettia,Unknown,Millettia sp.2,Millettia sp.2,,2,1,1,FALSE,กรมป่าไม้(2548),Genus,1200,,1,
232,Fabaceae,Millettia,Unknown,Millettia sp.Tak1,Millettia sp.Tak1,,1,0,1,FALSE,กรมป่าไม้(2548),Genus,1200,,1,
233,Fabaceae,Millettia,brandisiana,Millettia brandisiana Kurz,Millettia brandisiana,กระพี้จั่น,2,1,1,FALSE,กรมป่าไม้(2548),Genus,1200,,1,
234,Fabaceae,Millettia,xylocarpa,Millettia xylocarpa Miq.,Millettia xylocarpa,จักจั่น,2,1,1,FALSE,กรมป่าไม้(2548),Genus,1200,,1,
235,Fabaceae,Parkia,speciosa,Parkia speciosa Hassk.,Parkia speciosa,สะตอ,2,1,1,FALSE,กรมป่าไม้(2548),Species,500,,3,
236,Fabaceae,Parkia,timoriana,Parkia timoriana (DC.) Merr.,Parkia timoriana,เหรียง,2,1,1,FALSE,กรมป่าไม้(2548),Genus,470,,3,
237,Fabaceae,Peltophorum,dasyrrhachis,Peltophorum dasyrhachis (Miq.) Kurz,Peltophorum dasyrhachis,อะราง,2,1,1,TRUE,Global,Species,595,,3,
238,Fabaceae,Peltophorum,pterocarpum,Peltophorum pterocarpum (DC.) Backer ex K.Heyne,Peltophorum pterocarpum,นนทรี,2,1,1,TRUE,Global,Species,565,,3,
239,Fabaceae,Piliostigma,malabaricum,Piliostigma malabaricum (Roxb.) Benth.,Piliostigma malabaricum,เสี้ยวใหญ่,2,1,1,FALSE,Orwa et al.2009,Species,742.5,,2,665-820
240,Fabaceae,Pithecellobium,dulce,Pithecellobium dulce (Roxb.) Benth.,Pithecellobium dulce,มะขามเทศ,2,1,1,FALSE,Global,Species,684,,2,
241,Fabaceae,Pterocarpus,indicus,Pterocarpus indicus Willd.,Pterocarpus indicus,ประดู่บ้าน,2,1,1,TRUE,กรมป่าไม้(2548),Genus,813.5,,2,
242,Fabaceae,Pterocarpus,macrocarpus,Pterocarpus macrocarpus Kurz,Pterocarpus macrocarpus,ประดู่ป่า,2,1,1,TRUE,กรมป่าไม้(2548),Genus,813.5,,2,
243,Fabaceae,Samanea,saman,Samanea saman (Jacq.) Merr.,Samanea saman,จามจุรี,2,1,1,TRUE,กรมป่าไม้(2548),Species,620,,3,
244,Fabaceae,Saraca,indica,Saraca indica L.,Saraca indica,โสกน้ำ,2,1,1,FALSE,Global,Species,648,,3,
245,Fabaceae,Saraca,thaipingensis,Saraca thaipingensis Cantley ex Prain,Saraca thaipingensis,ศรียะลา,2,1,1,FALSE,Global,Species,470,,3,
246,Fabaceae,Senegalia,catechu,Senegalia catechu (L.f.) P.J.H.Hurter & Mabb.,Senegalia catechu,สีเสียด,2,1,1,FALSE,Global,Acacia catechu(ชื่อเดิม),801,,2,
247,Fabaceae,Senna,garrettiana,Senna garrettiana (Craib) H.S.Irwin & Barneby,Senna garrettiana,แสมสาร,2,1,1,FALSE,Global,Genus,617,,3,
248,Fabaceae,Senna,siamea,Senna siamea (Lam.) H.S.Irwin & Barneby,Senna siamea,ขี้เหล็ก,2,1,1,TRUE,Global,Species,660,,2,
249,Fabaceae,Senna,spectabilis,Senna spectabilis (DC.) H.S.Irwin & Barneby,Senna spectabilis,ขี้เหล็กอเมริกัน,1,0,1,FALSE,Global,Genus,617,,3,
250,Fabaceae,Sindora,siamensis,Sindora siamensis Teijsm. ex Miq.,Sindora siamensis,มะค่าแต้,2,1,1,TRUE,กรมป่าไม้(2548),Genus,1100,,1,
251,Fabaceae,Tamarindus,indica,Tamarindus indica L.,Tamarindus indica,มะขาม,2,1,1,TRUE,กรมป่าไม้(2548),Species,781,,2,
252,Fabaceae,Unknow,Unknown,Unknown genus-Fabaceae-Uttaradit,Unknown genus-Fabaceae-Uttaradit,,1,0,1,FALSE,Global,Family,678,,2,
253,Fabaceae,Xylia,xylocarpa var. kerrii,Xylia xylocarpa var. kerrii (Craib & Hutch.) I.C.Nielsen,Xylia xylocarpa var. kerrii,แดง,2,1,1,TRUE,กรมป่าไม้(2548),,1010,,1,
254,Fagaceae,Castanopsis,nephelioides,Castanopsis nephelioides King ex Hook.f.,Castanopsis nephelioides,ก่อคอแลน,2,1,1,FALSE,Global,Species,520,,3,
255,Fagaceae,Castanopsis,wallichii,Castanopsis wallichii King ex Hook.f.,Castanopsis wallichii,ก่อบ้าน,2,1,1,FALSE,Global,Genus,550,,3,
256,Fagaceae,Lithocarpus,Unknown,Lithocarpus sp.,Lithocarpus sp.,,2,1,1,FALSE,Global,Species,668,,2,
257,Fagaceae,Quercus,kerrii,Quercus kerrii Craib,Quercus kerrii,ก่อแพะ,1,0,1,FALSE,Global,Genus,701,,2,
258,Gentianaceae,Cyrtophyllum,fragrans,Cyrtophyllum fragrans (Roxb.) DC.,Cyrtophyllum fragrans,กันเกรา,2,1,1,FALSE,iPlantz.com,Species,750,,2,650-850
259,Gentianaceae,Fagraea,ceilanica,Fagraea ceilanica Thunb.,Fagraea ceilanica,แก้วมุกดา,2,1,1,FALSE,กรมป่าไม้(2548),Genus,920,,2,
260,Hernandiaceae,Gyrocarpus,americanus,Gyrocarpus americanus Jacq.,Gyrocarpus americanus,ปูเล,2,1,1,FALSE,Global,Species,237,,3,
261,Hypericaceae,Cratoxylum,Unknown,Cratoxylum sp.,Cratoxylum sp.,ติ้ว,1,1,0,FALSE,กรมป่าไม้(2548),Species,800,,2,
262,Hypericaceae,Cratoxylum,cochinchinense,Cratoxylum cochinchinense (Lour.) Blume,Cratoxylum cochinchinense,ติ้วเกลี้ยง,2,1,1,FALSE,กรมป่าไม้(2548),Genus,800,,2,
263,Hypericaceae,Cratoxylum,formosum subsp. formosum,Cratoxylum formosum subsp. formosum (Jack) Benth. & Hook.f. ex Dyer,Cratoxylum formosum subsp. formosum,ติ้วขาว,2,1,1,FALSE,กรมป่าไม้(2548),Genus,800,,2,
264,Hypericaceae,Cratoxylum,formosum subsp. pruniflorum,Cratoxylum formosum subsp. pruniflorum (Kurz) Gogelein,Cratoxylum formosum subsp. pruniflorum,ติ้วขน,2,1,1,FALSE,กรมป่าไม้(2548),Genus,800,,2,
265,Irvingiaceae,Irvingia,malayana,Irvingia malayana Oliv. ex A.W.Benn.,Irvingia malayana,กระบก,2,1,1,FALSE,กรมป่าไม้(2548),Species,1040,,1,
266,Lamiaceae,Gmelina,Unknown,Gmelina sp.AmnatCharoen1,Gmelina sp.AmnatCharoen1,,1,0,1,FALSE,Global,Genus,464,,3,
267,Lamiaceae,Gmelina,arborea,Gmelina arborea Roxb.,Gmelina arborea,ซ้อ,1,1,0,FALSE,กรมป่าไม้(2548),Species,540,,3,
268,Lamiaceae,Gmelina,arborea,Gmelina elliptica Sm.,Gmelina elliptica,ทองแมว,1,0,1,FALSE,กรมป่าไม้(2548),Species,540,,3,
269,Lamiaceae,Premna,Unknown,Premna sp.,Premna sp.,,2,1,1,FALSE,กรมป่าไม้(2548),Genus,880,,2,
270,Lamiaceae,Premna,tomentosa,Premna tomentosa Willd.,Premna tomentosa,เกีย,1,1,0,FALSE,กรมป่าไม้(2548),Genus,880,,2,
271,Lamiaceae,Tectona,grandis,Tectona grandis L.f.,Tectona grandis,สัก,2,1,1,TRUE,กรมป่าไม้(2548),Species,642,650,3,
272,Lamiaceae,Vitex,canescens,Vitex canescens Kurz,Vitex canescens,ผ่าเสี้ยน,2,1,1,FALSE,กรมป่าไม้(2548),Genus,900,,2,
273,Lamiaceae,Vitex,glabrata,Vitex glabrata R.Br.,Vitex glabrata,ไข่เน่า,1,0,1,FALSE,Global,Species,580,,3,
274,Lamiaceae,Vitex,limonifolia,Vitex limonifolia Wall. ex C.B.Clarke,Vitex limonifolia,สวอง,2,1,1,FALSE,กรมป่าไม้(2548),Genus,900,,2,
275,Lamiaceae,Vitex,peduncularis,Vitex peduncularis Wall. ex Schauer,Vitex peduncularis,กาสามปีก,2,1,1,FALSE,กรมป่าไม้(2548),Genus,900,,2,
276,Lamiaceae,Vitex,pinnata,Vitex pinnata L.,Vitex pinnata,ตีนนก,2,1,1,FALSE,กรมป่าไม้(2548),Genus,900,,2,
277,Lamiaceae,Vitex,quinata,Vitex quinata (Lour.) F.N.Williams,Vitex quinata,ตะพุนเฒ่า,2,1,1,FALSE,กรมป่าไม้(2548),Genus,900,,2,
278,Lamiaceae,Vitex,scabra,Vitex scabra Wall. ex Schauer,Vitex scabra,อีแปะ,2,1,1,FALSE,กรมป่าไม้(2548),Genus,900,,2,
279,Lauraceae,Beilschmiedia,roxburghiana,Beilschmiedia roxburghiana Nees,Beilschmiedia roxburghiana,ฝีหมอบ,2,1,1,FALSE,IPCC(2006),Species,670,,2,
280,Lauraceae,Cinnamomum,Unknown,Cinnamomum sp.Trang1,Cinnamomum sp.Trang1,,1,0,1,FALSE,Global,Genus,470,,3,
281,Lauraceae,Cinnamomum,Unknown,Cinnamomum sp.Trat1,Cinnamomum sp.Trat1,,1,0,1,FALSE,Global,Genus,470,,3,
282,Lauraceae,Cinnamomum,camphora,Cinnamomum camphora (L.) J.Presl,Cinnamomum camphora,การบูร,2,1,1,FALSE,Global,Species,487,,3,
283,Lauraceae,Cinnamomum,iners,Cinnamomum iners (Reinw. ex Nees & T.Nees) Blume,Cinnamomum iners,เชียด,2,1,1,FALSE,Global,Species,499,,3,
284,Lauraceae,Cinnamomum,parthenoxylon,Cinnamomum parthenoxylon (Jack) Meisn.,Cinnamomum parthenoxylon,เทพทาโร,2,1,1,FALSE,Global,Species,580,,3,
285,Lauraceae,Litsea,Unknown,Litsea sp.Trat1,Litsea sp.Trat1,,1,0,1,FALSE,Global,Genus,425,,3,
286,Lauraceae,Litsea,glutinosa,Litsea glutinosa (Lour.) C.B.Rob.,Litsea glutinosa,หมีเหม็น,2,1,1,FALSE,IPCC(2006),Species,400,,3,
287,Lauraceae,Litsea,grandis,Litsea grandis (Nees) Hook.f.,Litsea grandis,กะทังใบใหญ่,2,1,1,FALSE,IPCC(2006),Species,400,,3,
288,Lauraceae,Litsea,umbellata,Litsea umbellata (Lour.) Merr.,Litsea umbellata,ฟันปลา,2,1,1,FALSE,IPCC(2006),Species,400,,3,
289,Lauraceae,Neolitsea,zeylanica,Neolitsea zeylanica (Nees) Merr.,Neolitsea zeylanica,เอียน,1,0,1,FALSE,Global,Genus,533,,3,
290,Lauraceae,Phoebe,tavoyana,Phoebe tavoyana Hook.f.,Phoebe tavoyana,กอหิน,1,1,0,FALSE,กรมป่าไม้(2548),Genus,750,,2,
291,Lauraceae,Unknow,Unknown,Unknown genus-Lauraceae-Trat-1,Unknown genus-Lauraceae-Trat-1,,1,0,1,FALSE,Global,Family,559,,3,
292,Lauraceae,Unknow,Unknown,Unknown genus-Lauraceae-Trat-2,Unknown genus-Lauraceae-Trat-2,,1,0,1,FALSE,Global,Family,559,,3,
293,Lecythidaceae,Barringtonia,Unknown,Barringtonia sp.,Barringtonia sp.,,2,1,1,FALSE,IPCC(2006),,480,,3,
294,Lecythidaceae,Barringtonia,acutangula,Barringtonia acutangula (L.) Gaertn.,Barringtonia acutangula,จิกน้ำ,2,1,1,TRUE,IPCC(2006),,480,,3,
295,Lecythidaceae,Barringtonia,racemosa,Barringtonia racemosa (L.) Gaertn.,Barringtonia racemosa,จิกสวน,2,1,1,FALSE,IPCC(2006),,480,,3,
296,Lecythidaceae,Careya,arborea,Careya arborea Roxb.,Careya arborea,กระโดน,2,1,1,TRUE,Global,Species,731,,2,
297,Lecythidaceae,Couroupita,guianensis,Couroupita guianensis Aubl.,Couroupita guianensis,สาละลังกา,2,1,1,FALSE,Global,Species,434,,3,
298,Loganiaceae,Strychnos,nux-blanda,Strychnos nux-blanda A.W.Hill,Strychnos nux-blanda,แสลงใจ,2,1,1,FALSE,Global,Species,744,,2,
299,Lythraceae,Lagerstroemia,calyculata,Lagerstroemia calyculata Kurz,Lagerstroemia calyculata,ตะแบกแดง,2,1,1,FALSE,กรมป่าไม้(2548),Species,680,,2,
300,Lythraceae,Lagerstroemia,cochinchinensis,Lagerstroemia cochinchinensis Pierre,Lagerstroemia cochinchinensis,ตะแบกเกรียบ,2,1,1,FALSE,กรมป่าไม้(2548),Genus,683.33,,2,
301,Lythraceae,Lagerstroemia,duperreana,Lagerstroemia duperreana Pierre ex Gagnep.,Lagerstroemia duperreana,ตะแบกเปลือกบาง,2,1,1,FALSE,กรมป่าไม้(2548),Genus,683.33,,2,
302,Lythraceae,Lagerstroemia,floribunda,Lagerstroemia floribunda Jack,Lagerstroemia floribunda,ตะแบกนา,2,1,1,TRUE,กรมป่าไม้(2548),Genus,683.33,,2,
303,Lythraceae,Lagerstroemia,loudonii,Lagerstroemia loudonii Teijsm. & Binn.,Lagerstroemia loudonii,อินทรชิต,2,1,1,TRUE,กรมป่าไม้(2548),Genus,683.33,,2,
304,Lythraceae,Lagerstroemia,macrocarpa,Lagerstroemia macrocarpa Kurz,Lagerstroemia macrocarpa,อินทนิลบก,2,1,1,FALSE,กรมป่าไม้(2548),Genus,683.33,,2,
305,Lythraceae,Lagerstroemia,speciosa,Lagerstroemia speciosa (L.) Pers.,Lagerstroemia speciosa,อินทนิลน้ำ,2,1,1,TRUE,กรมป่าไม้(2548),Species,650,,2,
306,Lythraceae,Lagerstroemia,subangulata,Lagerstroemia subangulata (Craib) Furtado & Montien,Lagerstroemia subangulata,สมอร่อง,2,1,1,FALSE,กรมป่าไม้(2548),Genus,683.33,,2,
307,Lythraceae,Lagerstroemia,venusta,Lagerstroemia venusta Wall. ex C.B.Clarke,Lagerstroemia venusta,เสลาเปลือกบาง,2,1,1,FALSE,กรมป่าไม้(2548),Genus,683.33,,2,
308,Lythraceae,Lagerstroemia,villosa,Lagerstroemia villosa Wall. ex Kurz,Lagerstroemia villosa,เสลาเปลือกหนา,1,0,1,FALSE,Global,Species,689,,2,
309,Lythraceae,Sonneratia,alba,Sonneratia alba J.Sm.,Sonneratia alba,ลำแพน,2,1,1,FALSE,Global,Species,509,,3,
310,Lythraceae,Sonneratia,caseolaris,Sonneratia caseolaris (L.) Engl.,Sonneratia caseolaris,ลำพู,2,1,1,FALSE,กรมป่าไม้(2548),Genus,473,,3,
311,Magnoliaceae,Magnolia,champaca,Magnolia champaca (L.) Baill. ex Pierre,Magnolia champaca,จำปา,2,1,1,FALSE,IPCC(2006),Species,520,,3,
312,Magnoliaceae,Magnolia,liliifera,Magnolia liliifera (L.) Baill.,Magnolia liliifera,มณฑา,2,1,1,FALSE,IPCC(2006),Species,520,,3,
313,Magnoliaceae,Magnolia,× alba,Magnolia × alba (DC.) Figlar,Magnolia × alba,จำปี,2,1,1,TRUE,IPCC(2006),Species,520,,3,
314,Malpighiaceae,Hiptage,candicans,Hiptage candicans Hook.f.,Hiptage candicans,กำลังช้างเผือก,1,0,1,FALSE,Global,Family,644,,3,
315,Malpighiaceae,Malpighia,glabra,Malpighia glabra L.,Malpighia glabra,เชอร์รี่ไทย,2,1,1,FALSE,Global,Family,644,,3,
316,Malvaceae,Adansonia,digitata,Adansonia digitata L.,Adansonia digitata,เบาบับ,1,0,1,FALSE,Global,Species,276,,3,
317,Malvaceae,Bombax,anceps,Bombax anceps Pierre,Bombax anceps,งิ้วดอกขาว,2,1,1,FALSE,Global,Species,413,,3,
318,Malvaceae,Ceiba,pentandra,Ceiba pentandra (L.) Gaertn.,Ceiba pentandra,นุ่น,2,1,1,FALSE,IPCC(2006),Species,230,,3,
319,Malvaceae,Grewia,eriocarpa,Grewia eriocarpa Juss.,Grewia eriocarpa,ปอแก่นเทา,2,1,1,FALSE,Global,Species,670,,2,
320,Malvaceae,Heritiera,littoralis,Heritiera littoralis Aiton,Heritiera littoralis,หงอนไก่,1,0,1,FALSE,Global,Species,848,,2,
321,Malvaceae,Hibiscus,tiliaceus,Hibiscus tiliaceus L.,Hibiscus tiliaceus,ปอทะเล,2,1,1,FALSE,กรมป่าไม้(2548),Genus,350,,3,
322,Malvaceae,Kydia,calycina,Kydia calycina Roxb.,Kydia calycina,เลียงฝ้าย,1,0,1,FALSE,Global,Species,258,,3,
323,Malvaceae,Mansonia,gagei,Mansonia gagei J.R.Drumm.,Mansonia gagei,จันทน์หอม,1,0,1,FALSE,Global,Species,882,,2,
324,Malvaceae,Microcos,paniculata,Microcos paniculata L.,Microcos paniculata,ลาย,2,1,1,FALSE,Global,Species,619,,3,
325,Malvaceae,Microcos,tomentosa,Microcos tomentosa Sm.,Microcos tomentosa,พลับพลา,2,1,1,FALSE,Global,Species,640,,3,
326,Malvaceae,Pterocymbium,tinctorium,Pterocymbium tinctorium (Blanco) Merr.,Pterocymbium tinctorium,ปออีเก้ง,1,0,1,FALSE,Global,Species,310,,3,
327,Malvaceae,Pterospermum,cinnamomeum,Pterospermum cinnamomeum Kurz,Pterospermum cinnamomeum,ตองเต่า,2,1,1,FALSE,กรมป่าไม้(2548),Genus,745,,2,
328,Malvaceae,Pterospermum,grandiflorum,Pterospermum grandiflorum Craib,Pterospermum grandiflorum,สะเต้า,2,1,1,FALSE,กรมป่าไม้(2548),Genus,745,,2,
329,Malvaceae,Pterospermum,pecteniforme,Pterospermum pecteniforme Kosterm.,Pterospermum pecteniforme,ยู,1,1,0,FALSE,กรมป่าไม้(2548),Genus,745,,2,
330,Malvaceae,Sterculia,Unknown,Sterculia sp.,Sterculia sp.,,1,1,0,FALSE,กรมป่าไม้(2548),Species,460,,3,
331,Malvaceae,Sterculia,foetida,Sterculia foetida L.,Sterculia foetida,สำโรง,2,1,1,FALSE,Global,Species,448,,3,
332,Malvaceae,Sterculia,guttata,Sterculia guttata Roxb.,Sterculia guttata,ปอแดง,2,1,1,FALSE,Global,Genus,427,,3,
333,Malvaceae,Sterculia,pexa,Sterculia pexa Pierre,Sterculia pexa,ปอขาว,2,1,1,FALSE,Global,Species,405,,3,
334,Malvaceae,Thespesia,populnea,Thespesia populnea (L.) Sol. ex Corrêa,Thespesia populnea,โพทะเล,2,1,1,FALSE,IPCC(2006),Species,520,,3,
335,Melastomataceae,Memecylon,Unknown,Memecylon sp.Trat1,Memecylon sp.Trat1,,1,0,1,FALSE,Global,Genus,768,,2,
336,Melastomataceae,Memecylon,coeruleum,Memecylon coeruleum Jack,Memecylon coeruleum,พลองขี้ควาย,2,1,1,FALSE,Global,Genus,768,,2,
337,Melastomataceae,Memecylon,edule,Memecylon edule Roxb.,Memecylon edule,พลองเหมือด,2,1,1,FALSE,Global,Species,675,,2,
338,Melastomataceae,Memecylon,scutellatum,Memecylon scutellatum (Lour.) Hook. & Arn.,Memecylon scutellatum,เหมือดจี้,1,0,1,FALSE,Global,Genus,768,,2,
339,Melastomataceae,Pternandra,caerulescens,Pternandra caerulescens Jack,Pternandra caerulescens,พลองแก้มอ้น,1,0,1,FALSE,Global,Genus,525,,3,
340,Meliaceae,Aglaia,lawii,Aglaia lawii (Wight) C.J.Saldanha,Aglaia lawii,สังกะโต้ง,1,0,1,FALSE,Global,Species,596,,3,
341,Meliaceae,Aphanamixis,polystachya,Aphanamixis polystachya (Wall.) R.Parker,Aphanamixis polystachya,ตาเสือ,2,1,1,FALSE,Global,Species,576,,3,
342,Meliaceae,Azadirachta,excelsa,Azadirachta excelsa (Jack) Jacobs,Azadirachta excelsa,สะเดาเทียม,2,1,1,FALSE,กรมป่าไม้(2548),Species,570,,3,
343,Meliaceae,Azadirachta,indica,Azadirachta indica A.Juss.,Azadirachta indica,สะเดา,2,1,1,TRUE,กรมป่าไม้(2548),Species,860,,2,
344,Meliaceae,Chukrasia,tabularis,Chukrasia tabularis A.Juss.,Chukrasia tabularis,ยมหิน,2,1,1,FALSE,กรมป่าไม้(2548),Genus,900,,2,
345,Meliaceae,Dysoxylum,Unknown,Dysoxylum sp.,Dysoxylum sp.,,1,1,0,FALSE,Global,Genus,591,,3,
346,Meliaceae,Khaya,senegalensis,Khaya senegalensis (Desr.) A. Juss.,Khaya senegalensis,ยมชวน,1,0,1,FALSE,Global,Species,626,,3,
347,Meliaceae,Melia,azedarach,Melia azedarach L.,Melia azedarach,เลี่ยน,1,0,1,FALSE,Global,Species,438,,3,
348,Meliaceae,Sandoricum,koetjape,Sandoricum koetjape (Burm.f.) Merr.,Sandoricum koetjape,กระท้อน,2,1,1,FALSE,กรมป่าไม้(2548),Genus,570,,3,
349,Meliaceae,Swietenia,macrophylla,Swietenia macrophylla King,Swietenia macrophylla,มะฮอกกานีใบใหญ่,2,1,1,TRUE,Global,Species,520,,3,
350,Meliaceae,Toona,ciliata,Toona ciliata M.Roem.,Toona ciliata,ยมหอม,1,0,1,FALSE,Global,Species,376,,3,
351,Meliaceae,Walsura,trichostemon,Walsura trichostemon Miq.,Walsura trichostemon,กัดลิ้น,2,1,1,FALSE,กรมป่าไม้(2548),Genus,1130,,1,
352,Meliaceae,Xylocarpus,granatum,Xylocarpus granatum J.Koenig,Xylocarpus granatum,ตะบูนขาว,2,1,1,FALSE,กรมป่าไม้(2548),,600,,3,
353,Meliaceae,Xylocarpus,moluccensis,Xylocarpus moluccensis (Lam.) M.Roem.,Xylocarpus moluccensis,ตะบูนดำ,1,0,1,FALSE,Global,Species,611,,3,
354,Moraceae,Artocarpus,Unknown,Artocarpus sp.BuengKan1,Artocarpus sp.BuengKan1,,1,0,1,FALSE,กรมป่าไม้(2548),Genus,566.67,,3,
355,Moraceae,Artocarpus,Unknown,Artocarpus sp.Chumphon1,Artocarpus sp.Chumphon1,,1,0,1,FALSE,กรมป่าไม้(2548),Genus,567.67,,3,
356,Moraceae,Artocarpus,Unknown,Artocarpus sp.Trang1,Artocarpus sp.Trang1,,1,0,1,FALSE,กรมป่าไม้(2548),Genus,568.67,,3,
357,Moraceae,Artocarpus,chama,Artocarpus chama Buch.-Ham.,Artocarpus chama,ขนุนป่า,1,0,1,FALSE,กรมป่าไม้(2548),Genus,569.67,,3,
358,Moraceae,Artocarpus,elasticus,Artocarpus elasticus Reinw. ex Blume,Artocarpus elasticus,กะออก,2,1,1,FALSE,กรมป่าไม้(2548),Genus,566.67,,3,
359,Moraceae,Artocarpus,gomezianus,Artocarpus gomezianus Wall. ex Trécul,Artocarpus gomezianus,หาดหนุน,2,1,1,FALSE,กรมป่าไม้(2548),Genus,566.67,,3,
360,Moraceae,Artocarpus,heterophyllus,Artocarpus heterophyllus Lam.,Artocarpus heterophyllus,ขนุน,2,1,1,TRUE,กรมป่าไม้(2548),Species,517,,3,
361,Moraceae,Artocarpus,integer,Artocarpus integer (Thunb.) Merr.,Artocarpus integer,จำปาดะ,1,1,0,FALSE,กรมป่าไม้(2548),Genus,566.67,,3,
362,Moraceae,Artocarpus,lacucha,Artocarpus lacucha Roxb. ex Buch.-Ham.,Artocarpus lacucha,มะหาด,2,1,1,FALSE,กรมป่าไม้(2548),Species,660,,2,
363,Moraceae,Artocarpus,thailandicus,Artocarpus thailandicus C.C.Berg,Artocarpus thailandicus,มะหาดไทย,1,0,1,FALSE,กรมป่าไม้(2548),Genus,569.67,,3,
364,Moraceae,Ficus,altissima,Ficus altissima Blume,Ficus altissima,กร่าง,2,1,1,FALSE,Global,Species,473,,3,
365,Moraceae,Ficus,benghalensis,Ficus benghalensis L.,Ficus benghalensis,นิโครธ,2,1,1,FALSE,Global,Species,494,,3,
366,Moraceae,Ficus,benjamina,Ficus benjamina L.,Ficus benjamina,ไทรย้อยใบแหลม,2,1,1,TRUE,IPCC(2006),Species,650,,2,
367,Moraceae,Ficus,callosa,Ficus callosa Willd.,Ficus callosa,มะเดื่อกวาง,2,1,1,FALSE,Global,Species,290,,3,
368,Moraceae,Ficus,capillipes,Ficus capillipes Gagnep.,Ficus capillipes,กะเหรี่ยง,1,0,1,FALSE,Global,Genus,421,,3,
369,Moraceae,Ficus,concinna,Ficus concinna (Miq.) Miq.,Ficus concinna,ไกร,2,1,1,FALSE,Global,Genus,421,,3,
370,Moraceae,Ficus,fistulosa,Ficus fistulosa Reinw. ex Blume,Ficus fistulosa,เดื่อฉิ่ง,2,1,1,FALSE,Global,Species,380,,3,
371,Moraceae,Ficus,geniculata,Ficus geniculata Kurz,Ficus geniculata,ไฮ,2,1,1,FALSE,Global,Genus,421,,3,
372,Moraceae,Ficus,hispida,Ficus hispida L.f.,Ficus hispida,มะเดื่อปล้อง,2,1,1,FALSE,Global,Species,382,,3,
373,Moraceae,Ficus,maclellandii,Ficus maclellandii King,Ficus maclellandii,ไทรใบดาบ,2,1,1,FALSE,Global,Genus,421,,3,
374,Moraceae,Ficus,microcarpa,Ficus microcarpa L.f.,Ficus microcarpa,ไทรย้อยใบทู่,2,1,1,FALSE,Global,Genus,421,,3,
375,Moraceae,Ficus,racemosa,Ficus racemosa L.,Ficus racemosa,มะเดื่ออุทุมพร,2,1,1,FALSE,Global,Species,363,,3,
376,Moraceae,Ficus,religiosa,Ficus religiosa L.,Ficus religiosa,โพศรีมหาโพ,2,1,1,TRUE,Global,Species,443,,3,
377,Moraceae,Ficus,rumphii,Ficus rumphii Blume,Ficus rumphii,โพขี้นก,2,1,1,TRUE,Global,Species,430,,3,
378,Moraceae,Ficus,subpisocarpa,Ficus subpisocarpa Gagnep.,Ficus subpisocarpa,เลียบ,2,1,1,FALSE,Global,Genus,421,,3,
379,Moraceae,Ficus,superba,Ficus superba (Miq.) Miq.,Ficus superba,ไทรเลียบ,2,1,1,FALSE,Global,Genus,421,,3,
380,Moraceae,Ficus,variegata,Ficus variegata Blume,Ficus variegata,ผูก,1,1,0,FALSE,Global,Species,327,,3,
381,Moraceae,Ficus,virens,Ficus virens Aiton,Ficus virens,ผักเลือด,2,1,1,FALSE,Global,Species,344,,3,
382,Moraceae,Morus,alba,Morus alba L.,Morus alba,หม่อน,2,1,1,FALSE,Global,Species,601,,3,
383,Moraceae,Streblus,asper,Streblus asper Lour.,Streblus asper,ข่อย,2,1,1,TRUE,Global,Species,622,,3,
384,Moringaceae,Moringa,oleifera,Moringa oleifera Lam.,Moringa oleifera,มะรุม,2,1,1,FALSE,Global,Species,262,,3,
385,Muntingiaceae,Muntingia,calabura,Muntingia calabura L.,Muntingia calabura,ตะขบบ้าน,2,1,1,FALSE,Global,Species,300,,3,
386,Myristicaceae,Horsfieldia,glabra,Horsfieldia glabra (Blume) Warb.,Horsfieldia glabra,มะพร้าวนกกก,2,1,1,FALSE,Global,Species,560,,3,
387,Myristicaceae,Knema,globularia,Knema globularia (Lam.) Warb.,Knema globularia,เลือดแรด,2,1,1,FALSE,Tropical tree(2014),Genus,530,,3,
388,Myrtaceae,Baeckea,frutescens,Baeckea frutescens L.,Baeckea frutescens,สนทราย,1,0,1,FALSE,Global,Species,810,,2,
389,Myrtaceae,Eucalyptus,camaldulensis,Eucalyptus camaldulensis Dehnh.,Eucalyptus camaldulensis,ยูคาลิปตัส,1,0,1,FALSE,กรมป่าไม้(2548),Species,1000,,1,
390,Myrtaceae,Eucalyptus,camaldulensis,Eucalyptus camaldulensis Dehnh.,Eucalyptus camaldulensis,ยููคาลิปตัส,1,1,0,FALSE,กรมป่าไม้(2548),Species,1000,,1,
391,Myrtaceae,Eucalyptus,deglupta,Eucalyptus deglupta Blume.,Eucalyptus deglupta,ยูคาลิปตัสสีรุ้ง,1,0,1,FALSE,Global,Species,449,,3,
392,Myrtaceae,Melaleuca,cajuputi,Melaleuca cajuputi Powell,Melaleuca cajuputi,เสม็ดขาว,1,0,1,FALSE,กรมป่าไม้(2548),Genus,732,,2,
393,Myrtaceae,Melaleuca,citrina,Melaleuca citrina (Curtis) Dum.Cours.,Melaleuca citrina,แปรงล้างขวด,2,1,1,FALSE,กรมป่าไม้(2548),Genus,732,,2,
394,Myrtaceae,Syzygium,Unknown,Syzygium sp.,Syzygium sp.,,1,1,0,FALSE,กรมป่าไม้(2548),Species,770,,2,
395,Myrtaceae,Syzygium,Unknown,Syzygium sp.Narathiwat1,Syzygium sp.Narathiwat1,,1,0,1,FALSE,กรมป่าไม้(2548),Species,771,,2,
396,Myrtaceae,Syzygium,Unknown,Syzygium sp.Trang1,Syzygium sp.Trang1,,1,0,1,FALSE,กรมป่าไม้(2548),Species,772,,2,
397,Myrtaceae,Syzygium,Unknown,Syzygium sp.Trang2,Syzygium sp.Trang2,,1,0,1,FALSE,กรมป่าไม้(2548),Species,773,,2,
398,Myrtaceae,Syzygium,Unknown,Syzygium sp.Trat1,Syzygium sp.Trat1,,1,0,1,FALSE,กรมป่าไม้(2548),Species,774,,2,
399,Myrtaceae,Syzygium,Unknown,Syzygium sp.Trat2,Syzygium sp.Trat2,,1,0,1,FALSE,กรมป่าไม้(2548),Species,775,,2,
400,Myrtaceae,Syzygium,Unknown,Syzygium sp.พัฒนาราม,Syzygium sp.พัฒนาราม,,1,0,1,FALSE,กรมป่าไม้(2548),Species,776,,2,
401,Myrtaceae,Syzygium,antisepticum,Syzygium antisepticum (Blume) Merr. & L.M.Perry,Syzygium antisepticum,เสม็ดแดง,2,1,1,FALSE,กรมป่าไม้(2548),Genus,816.67,,2,
402,Myrtaceae,Syzygium,cinereum,Syzygium cinereum (Kurz) Chantar. & J.Parn.,Syzygium cinereum,หว้านา,2,1,1,FALSE,กรมป่าไม้(2548),Genus,816.67,,2,
403,Myrtaceae,Syzygium,cumini,Syzygium cumini (L.) Skeels,Syzygium cumini,หว้า,2,1,1,TRUE,กรมป่าไม้(2548),Species,900,,2,
404,Myrtaceae,Syzygium,grande,Syzygium grande (Wight) Walp.,Syzygium grande,เมา,2,1,1,FALSE,กรมป่าไม้(2548),Species,780,,2,
405,Myrtaceae,Syzygium,ixoroides,Syzygium ixoroides Chantar. & J.Parn.,Syzygium ixoroides,หว้าใบเข็ม,1,1,0,FALSE,กรมป่าไม้(2548),Genus,816.67,,2,
406,Myrtaceae,Syzygium,nervosum,Syzygium nervosum A.Cunn. ex DC.,Syzygium nervosum,มะเกี๋ยง,2,1,1,FALSE,กรมป่าไม้(2548),Genus,816.67,,2,
407,Myrtaceae,Syzygium,polyanthum,Syzygium polyanthum (Wight) Walp.,Syzygium polyanthum,สมัก,1,0,1,FALSE,Global,Species,556,,3,
408,Myrtaceae,Syzygium,samarangense,Syzygium samarangense (Blume) Merr. & L.M.Perry,Syzygium samarangense,ชมพู่,1,1,0,FALSE,กรมป่าไม้(2548),Genus,816.67,,2,
409,Myrtaceae,Syzygium,siamense,Syzygium siamense (Craib) Chantar. & J. Parn.,Syzygium siamense,ชมพู่น้ำ,1,0,1,FALSE,กรมป่าไม้(2548),Genus,817.67,,2,
410,Myrtaceae,Syzygium,syzygioides,Syzygium syzygioides (Miq.) Merr. & L.M.Perry,Syzygium syzygioides,แดงคลอง,1,1,0,FALSE,กรมป่าไม้(2548),Genus,816.67,,2,
411,Myrtaceae,Tristaniopsis,burmanica,Tristaniopsis burmanica (Griff.) Peter G.Wilson & J.T.Waterh.,Tristaniopsis burmanica,ตำเสาหนู,1,0,1,FALSE,Global,Genus,780,,2,
412,Nyctaginaceae,Pisonia,grandis,Pisonia grandis R.Br.,Pisonia grandis,แสงจันทร์,1,0,1,FALSE,Global,Genus,344,,3,
413,Ochnaceae,Ochna,integerrima,Ochna integerrima (Lour.) Merr.,Ochna integerrima,ช้างน้าว,2,1,1,FALSE,Global,Species,744,,2,
414,Oleaceae,Chionanthus,Unknown,Chionanthus sp.Trat1,Chionanthus sp.Trat1,,1,0,1,FALSE,Global,Genus,705,,2,
415,Oleaceae,Schrebera,swietenioides,Schrebera swietenioides Roxb.,Schrebera swietenioides,มะกอกดอน,2,1,1,FALSE,IPCC(2006),Species,820,,2,
416,Oleaceae,Tetrapilus,salicifolius,Tetrapilus salicifolius (Wall. ex G.Don) de Juana,Tetrapilus salicifolius,อวบดำ,2,1,1,FALSE,Global,Family,681,,2,
417,Opiliaceae,Melientha,suavis,Melientha suavis Pierre,Melientha suavis,ผักหวานป่า,2,1,1,FALSE,Global,Family,735,,2,
418,Oxalidaceae,Averrhoa,carambola,Averrhoa carambola L.,Averrhoa carambola,มะเฟือง,2,1,1,FALSE,"Zanne et al., 2009",Species,576.8,,3,
419,Pentaphylacaceae,Eurya,acuminata,Eurya acuminata DC.,Eurya acuminata,ปลายสาน,1,1,0,FALSE,Global,Species,500,,3,
420,Peraceae,Chaetocarpus,castanicarpus,Chaetocarpus castanicarpus (Roxb.) Thwaites,Chaetocarpus castanicarpus,สำเภา,2,1,1,FALSE,Global,Genus,777,,2,
421,Phyllanthaceae,Antidesma,Unknown,Antidesma sp.,Antidesma sp.,,2,1,1,FALSE,IPCC(2006),Antidesma pleuricum,590,,3,
422,Phyllanthaceae,Antidesma,Unknown,Antidesma sp.Sisaket1,Antidesma sp.Sisaket1,,1,0,1,FALSE,Global,Genus,650,,2,
423,Phyllanthaceae,Antidesma,acidum,Antidesma acidum Retz.,Antidesma acidum,เม่าสร้อย,1,0,1,FALSE,Global,Genus,650,,2,
424,Phyllanthaceae,Antidesma,ghaesembilla,Antidesma ghaesembilla Gaertn.,Antidesma ghaesembilla,เม่าไข่ปลา,2,1,1,FALSE,Global,Species,610,,3,
425,Phyllanthaceae,Antidesma,montanum,Antidesma montanum Blume,Antidesma montanum,มะเม่าขน,1,1,0,FALSE,Global,Species,590,,3,
426,Phyllanthaceae,Aporosa,Unknown,Aporosa sp.,Aporosa sp.,,2,1,1,FALSE,Global,Family,610,,3,
427,Phyllanthaceae,Aporosa,Unknown,Aporosa sp.Chanthaburi1,Aporosa sp.Chanthaburi1,,1,0,1,FALSE,Global,Family,610,,3,
428,Phyllanthaceae,Aporosa,octandra,Aporosa octandra (Buch.-Ham. ex D.Don) Vickery,Aporosa octandra,นวลเสี้ยน,2,1,1,FALSE,Global,Family,610,,3,
429,Phyllanthaceae,Aporosa,planchoniana,Aporosa planchoniana Baill. ex Müll.Arg.,Aporosa planchoniana,กริม,1,0,1,FALSE,Global,Species,370,,3,
430,Phyllanthaceae,Aporosa,villosa,Aporosa villosa (Lindl.) Baill.,Aporosa villosa,เหมือดโลด,2,1,1,FALSE,Global,Family,610,,3,
431,Phyllanthaceae,Aporosa,wallichii,Aporosa wallichii Hook.f.,Aporosa wallichii,เหมือดวอน,2,1,1,FALSE,Global,Family,610,,3,
432,Phyllanthaceae,Baccaurea,ramiflora,Baccaurea ramiflora Lour.,Baccaurea ramiflora,มะไฟ,1,0,1,FALSE,Global,Genus,624,,3,
433,Phyllanthaceae,Bridelia,Unknown,Bridelia sp.Chachoengsao1,Bridelia sp.Chachoengsao1,,1,0,1,FALSE,Global,Genus,553,,3,
434,Phyllanthaceae,Bridelia,ovata,Bridelia ovata Decne.,Bridelia ovata,มะกา,2,1,1,FALSE,Global,Species,600,,3,
435,Phyllanthaceae,Bridelia,retusa,Bridelia retusa (L.) A.Juss.,Bridelia retusa,เต็งหนาม,2,1,1,FALSE,Global,Species,608,,3,
436,Phyllanthaceae,Cleistanthus,hirsutulus,Cleistanthus hirsutulus Hook.f.,Cleistanthus hirsutulus,แก้วน้ำ,1,1,0,FALSE,Global,Genus,633,,3,
437,Phyllanthaceae,Cleistanthus,polyphyllus,Cleistanthus polyphyllus F.N.Williams,Cleistanthus polyphyllus,นกนอน,1,1,0,FALSE,Global,Genus,633,,3,
438,Phyllanthaceae,Cleistanthus,sumatranus,Cleistanthus sumatranus (Miq.) Müll.Arg.,Cleistanthus sumatranus,ฝิ่นแดง,2,1,1,FALSE,Global,Species,640,,3,
439,Phyllanthaceae,Phyllanthus,angkorensis,Phyllanthus angkorensis Beille,Phyllanthus angkorensis,เสียวใหญ่,2,1,1,FALSE,Global,Genus,618,,3,
440,Phyllanthaceae,Phyllanthus,emblica,Phyllanthus emblica L.,Phyllanthus emblica,มะขามป้อม,2,1,1,FALSE,Global,Species,636,,3,
441,Phyllanthaceae,Unknow,Unknown,Unknown-genus-Phyllanthaceae-MaeHongSon,Unknown-genus-Phyllanthaceae-MaeHongSon,,1,0,1,FALSE,Global,Family,610,,3,
442,Polygonaceae,Triplaris,cumingiana,Triplaris cumingiana Fisch. & C.A.Mey.,Triplaris cumingiana,ปาโลแซนโตส,2,1,1,FALSE,Global,Species,530,,3,
443,Primulaceae,Aegiceras,corniculatum,Aegiceras corniculatum (L.) Blanco,Aegiceras corniculatum,เล็บนาง,1,1,0,FALSE,Global,Species,510,,3,
444,Proteaceae,Grevillea,robusta,Grevillea robusta A.Cunn. ex R.Br.,Grevillea robusta,ซิลเวอร์โอ๊ค,1,0,1,FALSE,Global,Species,521,,3,
445,Putranjivaceae,Drypetes,roxburghii,Drypetes roxburghii (Wall.) Hurus.,Drypetes roxburghii,ประคำไก่,2,1,1,FALSE,IPCC(2006),Species,630,,3,
446,Rhamnaceae,Ziziphus,mauritiana,Ziziphus mauritiana Lam.,Ziziphus mauritiana,พุทรา,2,1,1,FALSE,Global,Species,618,,3,
447,Rhizophoraceae,Bruguiera,cylindrica,Bruguiera cylindrica (L.) Blume,Bruguiera cylindrica,ถั่วขาว,1,0,1,FALSE,Global,Species,720,,2,
448,Rhizophoraceae,Bruguiera,gymnorhiza,Bruguiera gymnorhiza (L.) Lam. ex Savigny,Bruguiera gymnorhiza,พังกาหัวสุมดอกแดง,1,1,0,FALSE,กรมป่าไม้(2548),Species,856,,2,
449,Rhizophoraceae,Carallia,brachiata,Carallia brachiata (Lour.) Merr.,Carallia brachiata,เฉียงพร้านางแอ,2,1,1,FALSE,กรมป่าไม้(2548),Species,720,,2,
450,Rhizophoraceae,Ceriops,tagal,Ceriops tagal (Perr.) C.B.Rob.,Ceriops tagal,โปรงแดง,1,0,1,FALSE,Global,Family,740,,2,
451,Rhizophoraceae,Pellacalyx,parkinsonii,Pellacalyx parkinsonii C.E.C.Fisch.,Pellacalyx parkinsonii,กานพลู,2,1,1,FALSE,Global,Genus,437,,3,
452,Rhizophoraceae,Rhizophora,apiculata,Rhizophora apiculata Blume,Rhizophora apiculata,โกงกางใบเล็ก,2,1,1,TRUE,กรมป่าไม้(2548),Species,973,,2,
453,Rhizophoraceae,Rhizophora,mucronata,Rhizophora mucronata Poir.,Rhizophora mucronata,โกงกางใบใหญ่,2,1,1,TRUE,กรมป่าไม้(2548),Species,1090,,1,
454,Rubiaceae,Adina,trichotoma,Adina trichotoma (Zoll. & Moritzi) Benth. & Hook.f. ex B.D.Jacks.,Adina trichotoma,ขมิ้นต้น,2,1,1,FALSE,Global,Genus,746,,2,
455,Rubiaceae,Aidia,parvifolia,Aidia parvifolia (King & Gamble) K.M.Wong,Aidia parvifolia,แกงเลียงใบบาง,1,1,0,FALSE,Global,Genus,750,,2,
456,Rubiaceae,Canthium,horridum,Canthium horridum Blume,Canthium horridum,เคล็ดหนู,2,1,1,FALSE,Global,Genus,695,,2,
457,Rubiaceae,Canthiumera,robusta,Canthiumera robusta K.M.Wong & X.Y.Ng,Canthiumera robusta,ค่างเต้น,2,1,1,FALSE,Global,Genus Canthium,695,,2,
458,Rubiaceae,Catunaregam,Unknown,Catunaregam sp.MaeHongSon1,Catunaregam sp.MaeHongSon1,,1,0,1,FALSE,Global,Genus,750,,2,
459,Rubiaceae,Catunaregam,spathulifolia,Catunaregam spathulifolia Tirveng.,Catunaregam spathulifolia,เค็ด,2,1,1,FALSE,Global,Genus,751,,2,
460,Rubiaceae,Catunaregam,tomentosa,Catunaregam tomentosa (Blume ex DC.) Tirveng.,Catunaregam tomentosa,หนามแท่ง,2,1,1,FALSE,Global,Genus,751,,2,
461,Rubiaceae,Ceriscoides,turgida,Ceriscoides turgida (Roxb.) Tirveng.,Ceriscoides turgida,กระเบียน,1,0,1,FALSE,Global,Family,636,,3,
462,Rubiaceae,Dioecrescis,erythroclada,Dioecrescis erythroclada (Kurz) Tirveng.,Dioecrescis erythroclada,มะคังแดง,2,1,1,FALSE,Global,Family,636,,3,
463,Rubiaceae,Gardenia,obtusifolia,Gardenia obtusifolia Roxb. ex Kurz,Gardenia obtusifolia,กระมอบ,1,0,1,FALSE,Global,Species,758,,2,
464,Rubiaceae,Gardenia,sootepensis,Gardenia sootepensis Hutch.,Gardenia sootepensis,คำมอกหลวง,2,1,1,TRUE,กรมป่าไม้(2548),Genus,925,,2,
465,Rubiaceae,Gardenia,thailandica,Gardenia thailandica Tirveng.,Gardenia thailandica,พุดภูเก็ต,1,1,0,FALSE,กรมป่าไม้(2548),Genus,925,,2,
466,Rubiaceae,Haldina,cordifolia,Haldina cordifolia (Roxb.) Ridsdale,Haldina cordifolia,ขว้าว,2,1,1,FALSE,กรมป่าไม้(2548),Species,690,,2,
467,Rubiaceae,Hamelia,patens,Hamelia patens Jacq.,Hamelia patens,ประทัดทอง,1,0,1,FALSE,Global,Hamelia longipes,500,,3,
468,Rubiaceae,Hymenodictyon,orixense,Hymenodictyon orixense (Roxb.) Mabb.,Hymenodictyon orixense,ส้มกบ,2,1,1,FALSE,Global,Species,430,,3,
469,Rubiaceae,Ixora,Unknown,Ixora sp.1,Ixora sp.1,,1,1,0,FALSE,Global,Genus,793,,2,
470,Rubiaceae,Ixora,Unknown,Ixora sp.2,Ixora sp.2,,1,1,0,FALSE,Global,Genus,793,,2,
471,Rubiaceae,Ixora,finlaysoniana,Ixora finlaysoniana Wall. ex G.Don,Ixora finlaysoniana,เข็มขาว,1,0,1,FALSE,Global,Genus,793,,2,
472,Rubiaceae,Meyna,pubescens,Meyna pubescens (Kurz) Robyns,Meyna pubescens,มะหนามนึ้ง,2,1,1,FALSE,Global,Family,636,,3,
473,Rubiaceae,Mitragyna,diversifolia,Mitragyna diversifolia (Wall. ex G.Don) Havil.,Mitragyna diversifolia,กระทุ่มนา,2,1,1,FALSE,Global,Species,550,,3,
474,Rubiaceae,Mitragyna,rotundifolia,Mitragyna rotundifolia (Roxb.) Kuntze,Mitragyna rotundifolia,กระท่อมหมู,2,1,1,FALSE,Global,Genus,528,,3,
475,Rubiaceae,Morinda,citrifolia,Morinda citrifolia L.,Morinda citrifolia,ยอบ้าน,2,1,1,FALSE,Global,Species,630,,3,
476,Rubiaceae,Morinda,coreia,Morinda coreia Buch.-Ham.,Morinda coreia,ยอป่าใบเกลี้ยง,2,1,1,FALSE,Global,Genus,558,,3,
477,Rubiaceae,Morinda,elliptica,Morinda elliptica (Hook.f.) Ridl.,Morinda elliptica,ยอเถื่อน,2,1,1,FALSE,Global,Species,560,,3,
478,Rubiaceae,Morinda,tomentosa,Morinda tomentosa B.Heyne ex Roth,Morinda tomentosa,ยอป่า,2,1,1,FALSE,Global,Genus,558,,3,
479,Rubiaceae,Nauclea,orientalis,Nauclea orientalis (L.) L.,Nauclea orientalis,ก้านเหลือง,1,0,1,FALSE,Global,Species,483,,3,
480,Rubiaceae,Neolamarckia,cadamba,Neolamarckia cadamba (Roxb.) Bosser,Neolamarckia cadamba,กระทุ่ม,2,1,1,FALSE,World Agroforestry Centre,Species,425,,3,290-560
481,Rubiaceae,Psydrax,nitida,Psydrax nitida (Craib) K.M.Wong,Psydrax nitida,กะปะ,1,1,0,FALSE,Global,Genus,763,,2,
482,Rubiaceae,Psydrax,nitidus,Psydrax nitidus (Craib) K.M.Wong,Psydrax nitidus,คันแหลน,1,0,1,FALSE,Global,Genus,763,,2,
483,Rubiaceae,Ridsdalea,wittii,Ridsdalea wittii (Craib) J.T.Pereira,Ridsdalea wittii,หมักม่อ,1,0,1,FALSE,Global,Family,636,,3,
484,Rubiaceae,Tamilnadia,uliginosa,Tamilnadia uliginosa (Retz.) Tirveng. & Sastre,Tamilnadia uliginosa,มะคังขาว,2,1,1,FALSE,Global,genus Randia (เดิม),657,,2,
485,Rubiaceae,Wendlandia,tinctoria,Wendlandia tinctoria (Roxb.) DC.,Wendlandia tinctoria,แข้งกวาง,1,0,1,FALSE,Global,Genus,693,,2,
486,Rutaceae,Acronychia,pedunculata,Acronychia pedunculata (L.) Miq.,Acronychia pedunculata,กะอวม,2,1,1,FALSE,Global,Species,459,,3,
487,Rutaceae,Aegle,marmelos,Aegle marmelos (L.) Corrêa,Aegle marmelos,มะตูม,2,1,1,FALSE,IPCC(2006),Species,750,,2,
488,Rutaceae,Atalantia,monophylla,Atalantia monophylla DC.,Atalantia monophylla,มะนาวผี,2,1,1,FALSE,V. S. R. Naidu et al. (2019),Species,860,,2,
489,Rutaceae,Bergera,koenigii,Bergera koenigii L.,Bergera koenigii,โปร่งฟ้า,1,1,0,FALSE,Global,Family,640,,3,
490,Rutaceae,Citrus,aurantifolia,Citrus aurantifolia (Christm.) Swingle,Citrus aurantifolia,มะนาว,1,0,1,FALSE,Global,Genus,740,,2,
491,Rutaceae,Citrus,maxima,Citrus maxima (Burm.) Merr.,Citrus maxima,ส้มโอ,2,1,1,FALSE,"Zanne et al., 2009",Genus,740,,2,
492,Rutaceae,Limonia,acidissima,Limonia acidissima L.,Limonia acidissima,มะขวิด,1,0,1,FALSE,Global,Species,840,,2,
493,Rutaceae,Micromelum,minutum,Micromelum minutum (G.Forst.) Wight & Arn.,Micromelum minutum,หมุย,1,1,0,FALSE,Global,Species,660,,2,
494,Rutaceae,Micromelum,minutum,Micromelum minutum (G.Forst.) Wight & Arn.,Micromelum minutum,หัสคุณ,1,0,1,FALSE,Global,Species,660,,2,
495,Rutaceae,Murraya,paniculata,Murraya paniculata (L.) Jack,Murraya paniculata,แก้ว,2,1,1,FALSE,Global,Species,871,,2,
496,Rutaceae,Naringi,crenulata,Naringi crenulata (Roxb.) Nicolson,Naringi crenulata,กระแจะ,2,1,1,FALSE,Global,Family,640,,3,
497,Rutaceae,Tetradium,glabrifolium,Tetradium glabrifolium (Champ. ex Benth.) T.G.Hartley,Tetradium glabrifolium,มะแคด,1,1,0,FALSE,Global,Tetradium fraxinifolium,232,,3,
498,Salicaceae,Casearia,grewiifolia,Casearia grewiifolia Vent.,Casearia grewiifolia,กรวยป่า,2,1,1,FALSE,กรมป่าไม้(2548),Species,830,,2,
499,Salicaceae,Flacourtia,Unknown,Flacourtia sp.,Flacourtia sp.,,2,1,1,FALSE,Global,Genus,773,,2,
500,Salicaceae,Flacourtia,indica,Flacourtia indica (Burm.f.) Merr.,Flacourtia indica,ตะขบป่า,2,1,1,FALSE,Global,Species,737,,2,
501,Salicaceae,Flacourtia,jangomas,Flacourtia jangomas (Lour.) Raeusch.,Flacourtia jangomas,ตะขบยักษ์,2,1,1,FALSE,Global,Species,923,,2,
502,Salicaceae,Homalium,Unknown,Homalium sp.,Homalium sp.,,2,1,1,FALSE,Global,Genus,708,,2,
503,Salicaceae,Homalium,dasyanthum,Homalium dasyanthum (Turcz.) W.Theob.,Homalium dasyanthum,เขากวาง,1,1,0,FALSE,IPCC(2006),Species,760,,2,
504,Salicaceae,Homalium,tomentosum,Homalium tomentosum (Vent.) Benth.,Homalium tomentosum,ขานาง,1,0,1,FALSE,Global,Species,790,,2,
505,Sapindaceae,Arfeuillea,arborescens,Arfeuillea arborescens Pierre ex Radlk.,Arfeuillea arborescens,คงคาเดือด,2,1,1,FALSE,Global,Family,615,,3,
506,Sapindaceae,Dimocarpus,longan,Dimocarpus longan Lour.,Dimocarpus longan,ลำไย,2,1,1,FALSE,Global,Species,700,,2,
507,Sapindaceae,Lepisanthes,rubiginosa,Lepisanthes rubiginosa (Roxb.) Leenh.,Lepisanthes rubiginosa,มะหวด,2,1,1,FALSE,Global,Species,630,,3,
508,Sapindaceae,Nephelium,hypoleucum,Nephelium hypoleucum Kurz,Nephelium hypoleucum,คอแลน,2,1,1,FALSE,กรมป่าไม้(2548),Species,980,,2,
509,Sapindaceae,Nephelium,lappaceum,Nephelium lappaceum L.,Nephelium lappaceum,เงาะ,1,0,1,FALSE,Global,Species,710,,2,
510,Sapindaceae,Schleichera,oleosa,Schleichera oleosa (Lour.) Oken,Schleichera oleosa,ตะคร้อ,2,1,1,FALSE,กรมป่าไม้(2548),Genus,1100,,1,
511,Sapindaceae,Sisyrolepis,muricata,Sisyrolepis muricata (Pierre) Leenh.,Sisyrolepis muricata,ตะคร้อหนาม,2,1,1,FALSE,Global,genus Strombosia ชื่อพ้อง,747,,2,
512,Sapindaceae,Xerospermum,Unknown,Xerospermum sp.Trat1,Xerospermum sp.Trat1,,1,0,1,FALSE,Global,Xerospermum laevigatum,770,,2,
513,Sapindaceae,Xerospermum,noronhianum,Xerospermum noronhianum (Blume) Blume.,Xerospermum noronhianum,คอเหี้ย,2,1,1,FALSE,Global,Xerospermum laevigatum,770,,2,
514,Sapindaceae,Zollingeria,dongnaiensis,Zollingeria dongnaiensis Pierre,Zollingeria dongnaiensis,ขี้หนอน,2,1,1,FALSE,Global,Family,615,,3,
515,Sapotaceae,Chrysophyllum,cainito,Chrysophyllum cainito L.,Chrysophyllum cainito,สตาร์แอปเปิ้ล,2,1,1,FALSE,Global,Species,655,,2,
516,Sapotaceae,Lucuma,campechiana,Lucuma campechiana Kunth,Lucuma campechiana,เซียนท้อ,1,0,1,FALSE,Global,Family,615,,3,
517,Sapotaceae,Madhuca,Unknown,Madhuca sp.Phrae1,Madhuca sp.Phrae1,,1,0,1,FALSE,Global,Family,615,,3,
518,Sapotaceae,Manilkara,hexandra,Manilkara hexandra (Roxb.) Dubard,Manilkara hexandra,เกด,2,1,1,FALSE,กรมป่าไม้(2548),Species,1310,,1,
519,Sapotaceae,Manilkara,kauki,Manilkara kauki (L.) Dubard,Manilkara kauki,ละมุดสีดา,1,0,1,FALSE,Global,Species,830,,2,
520,Sapotaceae,Mimusops,elengi,Mimusops elengi L.,Mimusops elengi,พิกุล,2,1,1,TRUE,กรมป่าไม้(2548),,940,,2,
521,Sapotaceae,Palaquium,obovatum,Palaquium obovatum (Griff.) Engl.,Palaquium obovatum,ขนุนนก,2,1,1,FALSE,กรมป่าไม้(2548),Genus,720,,2,
522,Sapotaceae,Planchonella,obovata,Planchonella obovata (R.Br.) Pierre,Planchonella obovata,งาไซ,2,1,1,FALSE,Tropical tree(2014),Planchonella vitiensis,770,,2,
523,Sapotaceae,Xantolis,siamensis,Xantolis siamensis (H.R.Fletcher) P.Royen,Xantolis siamensis,ตานเสี้ยน,1,0,1,FALSE,Global,Family,615,,3,
524,Simaroubaceae,Ailanthus,triphysa,Ailanthus triphysa (Dennst.) Alston,Ailanthus triphysa,มะยมป่า,2,1,1,FALSE,กรมป่าไม้(2548),Species,470,,3,
525,Simaroubaceae,Simarouba,amara,Simarouba amara Aubl.,Simarouba amara,เอกมหาชัย,1,0,1,FALSE,Global,Species,383,,3,
526,Sterculiaceae,Pterospermum,semisagittatum,Pterospermum semisagittatum Ham. ex Roxb.,Pterospermum semisagittatum,ขามคัวะ,1,0,1,FALSE,Global,Species,620,,3,
527,Symplocaceae,Symplocos,Unknown,Symplocos sp.MaeHongSon1,Symplocos sp.MaeHongSon1,,1,0,1,FALSE,Global,Genus,531,,3,
528,Thymelaeaceae,Aquilaria,crassna,Aquilaria crassna Pierre ex Lecomte,Aquilaria crassna,กฤษณา,1,0,1,FALSE,,,347,,3,
529,Ulmaceae,Holoptelea,integrifolia,Holoptelea integrifolia (Roxb.) Planch.,Holoptelea integrifolia,กระเชา,2,1,1,FALSE,กรมป่าไม้(2548),Species,700,,2,
530,Unknown,Unknow,Unknown,Unknown,Unknown,,1,0,1,FALSE,,Average,540,,3,
531,Unknown,Unknow,Unknown,Unknown ป่ากลางกรุง ปตท,Unknown ป่ากลางกรุง ปตท,,1,0,1,FALSE,,Average,540,,3,
532,Unknown,Unknow,Unknown,Unknown วิทยาลัยเกษตรอุดร,Unknown วิทยาลัยเกษตรอุดร,,1,0,1,FALSE,,Average,540,,3,
533,Unknown,Unknow,Unknown,Unknown1 วัดป่าขมิ้น,Unknown1 วัดป่าขมิ้น,,2,1,1,FALSE,,Average,540,,3,
534,Unknown,Unknow,Unknown,Unknown1 วัดป่าหนองกุง,Unknown1 วัดป่าหนองกุง,,2,1,1,FALSE,,Average,540,,3,
535,Unknown,Unknow,Unknown,Unknown1 เขาน้ำซับ,Unknown1 เขาน้ำซับ,,2,1,1,FALSE,,Average,540,,3,
536,Unknown,Unknow,Unknown,Unknown2 วัดป่าหนองกุง,Unknown2 วัดป่าหนองกุง,,2,1,1,FALSE,,Average,540,,3,
537,Unknown,Unknow,Unknown,Unknown2 วิทยาลัยชุมชน,Unknown2 วิทยาลัยชุมชน,,2,1,1,FALSE,,Average,540,,3,
538,Unknown,Unknow,Unknown,Unknown3 วัดป่าหนองกุง,Unknown3 วัดป่าหนองกุง,,2,1,1,FALSE,,Average,540,,3,
539,Unknown,Unknow,Unknown,Unknown4 วัดป่าหนองกุง,Unknown4 วัดป่าหนองกุง,,2,1,1,FALSE,,Average,540,,3,
540,Unknown,Unknow,Unknown,Unknown5 วัดป่าหนองกุง,Unknown5 วัดป่าหนองกุง,,2,1,1,FALSE,,Average,540,,3,
541,Verbenaceae,Citharexylum,flexuosum,Citharexylum flexuosum (Ruiz & Pav.) D.Don,Citharexylum flexuosum,บุหงาส่าหรี,2,1,1,FALSE,"Zanne et al., 2009",Genus,662,,2,
542,Vitaceae,Leea,indica,Leea indica (Burm.f.) Merr.,Leea indica,กะตังใบ,2,1,1,FALSE,Global,Species,460,,3,`; // <-- สิ้นสุดเครื่องหมาย ` (backtick)

export const useSpeciesData = () => {
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // 3. ลบ fetch, async, await ทั้งหมด
      //    เรียกใช้ parseSpeciesData กับ string ที่เราสร้างไว้ 2 ตัวตรงๆ
      const parsedSpecies = parseSpeciesData(speciesCsvDataString, woodDensityCsvDataString);
      setSpecies(parsedSpecies);

    } catch (e: any) {
      console.error("Failed to parse species data:", e);
      setError("ไม่สามารถประมวลผลข้อมูลพรรณไม้ได้ (data error)");
    } finally {
      // 4. บอกว่าประมวลผล (loading) เสร็จแล้ว
      setLoading(false);
    }
  }, []); // 5. useEffect นี้จะทำงานแค่ครั้งเดียวเมื่อ component โหลด

  return { species, loading, error };
};