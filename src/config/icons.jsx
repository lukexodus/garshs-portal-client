import {
  GiEarthSpit,
  GiThink,
  GiPublicSpeaker,
  GiArchiveResearch,
  GiStrong,
  GiRead,
  GiBookshelf,
  GiSellCard,
  GiBuyCard,
} from "react-icons/gi";
import {
  TbMathSymbols,
  TbMathFunction,
  TbDevices2,
  TbMathMin,
  TbBusinessplan,
  TbShoppingCartDiscount,
} from "react-icons/tb";
import { BiAtom, BiStats, BiConversation } from "react-icons/bi";
import { FaDumbbell, FaMoneyBillWave, FaPalette } from "react-icons/fa";
import { IoIosPeople, IoIosPaper } from "react-icons/io";
import { HiBeaker } from "react-icons/hi";
import {
  RiBallPenFill,
  RiEnglishInput,
  RiPhoneFindFill,
  RiQuillPenFill,
} from "react-icons/ri";
import { BsTsunami } from "react-icons/bs";
import {
  MdHealthAndSafety,
  MdMapsHomeWork,
  MdNaturePeople,
} from "react-icons/md";
import { GoLaw } from "react-icons/go";
import { TfiLayoutMediaRight } from "react-icons/tfi";
import {
  GiOrganigram,
  GiReceiveMoney,
  GiMicroscope,
  GiDna1,
  GiMolecule,
} from "react-icons/gi";
import { SiMoleculer } from "react-icons/si";
import { VscSymbolOperator, VscCircuitBoard } from "react-icons/vsc";

import PhilippineFlag from "../components/svgs/PhilippineFlag";
import CPAR from "../components/svgs/CPAR";

export const subjectIcons = {
  earthScience: <GiEarthSpit />,
  philosophy: <GiThink />,
  generalMathematics: <TbMathSymbols />,
  komunikasyonAtPananaliksik: <BiConversation />,
  precalculus: <TbMathMin />,
  oralCommunication: <GiPublicSpeaker />,
  generalChemistry1: <BiAtom />,
  empowermentTechnologies: <TbDevices2 />,
  pe: <FaDumbbell />,
  pr1: <GiArchiveResearch />,
  basicCalculus: <TbMathFunction />,
  probabilityAndStatistics: <BiStats />,
  personalityDevelopment: <GiStrong />,
  drrr: <BsTsunami />,
  pagbasaAtPagsusuriNgTeksto: <GiRead />,
  generalChemistry2: <HiBeaker />,
  readingAndWriting: <RiBallPenFill />,

  entrepreneurship: <TbBusinessplan />,
  researchProject: <RiPhoneFindFill />,
  peAndHealth: <MdHealthAndSafety />,
  "21stCenturyLiterature": <GiBookshelf />,
  pagsulatSaFilipinoSaPilingLarangABM: <RiQuillPenFill />,
  pagsulatSaFilipinoSaPilingLarangSTEM: <RiQuillPenFill />,
  businessSimulation: <MdMapsHomeWork />,
  businessEthicsAndSocialResponsibility: <GoLaw />,
  businessFinance: <FaMoneyBillWave />,
  principlesOfMarketing: <TbShoppingCartDiscount />,
  fundamentalsOfABM1: <GiSellCard />,
  fundamentalsOfABM2: <GiBuyCard />,
  cpar: <FaPalette />,
  mil: <TfiLayoutMediaRight />,
  ucspSTEM: <IoIosPeople />,
  ucspABM: <IoIosPeople />,
  pr2: <IoIosPaper />,
  englishForAcademicAndProfessionalPurposes: <RiEnglishInput />,
  organizationAndManagement: <GiOrganigram />,
  businessMathematics: <VscSymbolOperator />,
  earthAndLifeScience: <MdNaturePeople />,
  appliedEconomics: <GiReceiveMoney />,
  physicalScience: <SiMoleculer />,
  generalBiology1: <GiMicroscope />,
  generalBiology2: <GiDna1 />,
  generalPhysics1: <GiMolecule />,
  generalPhysics2: <VscCircuitBoard />,
};

const customIconContainerClassName =
  "flex items-center justify-center pl-[1.5px] pr-[2.5px]";
const customIconClassName = "w-9 h-9 fill-indigo-600 hover:fill-indigo-400";

export const subjectIconsForSidebar = {
  earthScience: <GiEarthSpit />,
  philosophy: <GiThink />,
  generalMathematics: <TbMathSymbols />,
  komunikasyonAtPananaliksik: <BiConversation />,
  precalculus: <TbMathMin />,
  oralCommunication: <GiPublicSpeaker />,
  generalChemistry1: <BiAtom />,
  empowermentTechnologies: <TbDevices2 />,
  pe: <FaDumbbell />,
  pr1: <GiArchiveResearch />,
  basicCalculus: <TbMathFunction />,
  probabilityAndStatistics: <BiStats />,
  personalityDevelopment: <GiStrong />,
  drrr: <BsTsunami />,
  pagbasaAtPagsusuriNgTeksto: <GiRead />,
  generalChemistry2: <HiBeaker />,
  readingAndWriting: <RiBallPenFill />,

  entrepreneurship: <TbBusinessplan />,
  researchProject: <RiPhoneFindFill />,
  peAndHealth: <MdHealthAndSafety />,
  "21stCenturyLiterature": <GiBookshelf />,
  pagsulatSaFilipinoSaPilingLarangABM: <RiQuillPenFill />,
  pagsulatSaFilipinoSaPilingLarangSTEM: <RiQuillPenFill />,
  businessSimulation: <MdMapsHomeWork />,
  businessEthicsAndSocialResponsibility: <GoLaw />,
  businessFinance: <FaMoneyBillWave />,
  principlesOfMarketing: <TbShoppingCartDiscount />,
  fundamentalsOfABM1: <GiSellCard />,
  fundamentalsOfABM2: <GiBuyCard />,
  cpar: <FaPalette />,
  mil: <TfiLayoutMediaRight />,
  ucspSTEM: <IoIosPeople />,
  ucspABM: <IoIosPeople />,
  pr2: <IoIosPaper />,
  englishForAcademicAndProfessionalPurposes: <RiEnglishInput />,
  organizationAndManagement: <GiOrganigram />,
  businessMathematics: <VscSymbolOperator />,
  earthAndLifeScience: <MdNaturePeople />,
  appliedEconomics: <GiReceiveMoney />,
  physicalScience: <SiMoleculer />,
  generalBiology1: <GiMicroscope />,
  generalBiology2: <GiDna1 />,
  generalPhysics1: <GiMolecule />,
  generalPhysics2: <VscCircuitBoard />,
};
