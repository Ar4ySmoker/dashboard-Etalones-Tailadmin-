import { useState, useEffect } from 'react';
import { createHandleChange } from '@/src/utils/handlePartnerChange';  // Предположительно, это функция для создания обработчиков изменений

const usePartnerData = (partner: any) => {
  // Поля для основных данных партнера
  const [selectName, setSelectName] = useState(partner?.name || '');
  const [selectPhone, setSelectPhone] = useState(partner?.phone || '');
  const [selectViber, setSelectViber] = useState(partner?.viber || '');
  const [selectTelegram, setSelectTelegram] = useState(partner?.telegram || '');
  const [selectWhatsapp, setSelectWhatsapp] = useState(partner?.whatsapp || '');
  const [selectEmail, setSelectEmail] = useState(partner?.email || '');
  const [selectCompanyName, setSelectCompanyName] = useState(partner?.companyName || '');
  const [selectNumberDE, setSelectNumberDE] = useState(partner?.numberDE || '');
  const [selectLocation, setSelectLocation] = useState(partner?.location || '');
  const [selectSite, setSelectSite] = useState(partner?.site || '');
  const [contractType, setContractType] = useState(partner?.contract?.typeC || '');
  const [contractPrice, setContractPrice] = useState(partner?.contract?.sum || '');

  // Поля для профессий партнера
  const [professions, setProfessions] = useState(partner?.professions || []);

  // Обработчики изменений для основных данных партнера
  const handleChangeName = createHandleChange(setSelectName);
  const handleChangePhone = createHandleChange(setSelectPhone);
  const handleChangeViber = createHandleChange(setSelectViber);
  const handleChangeTelegram = createHandleChange(setSelectTelegram);
  const handleChangeWhatsapp = createHandleChange(setSelectWhatsapp);
  const handleChangeEmail = createHandleChange(setSelectEmail);
  const handleChangeCompanyName = createHandleChange(setSelectCompanyName);
  const handleChangeNumberDE = createHandleChange(setSelectNumberDE);
  const handleChangeLocation = createHandleChange(setSelectLocation);
  const handleChangeSite = createHandleChange(setSelectSite);
  const handleChangeContractType = createHandleChange(setContractType);
  const handleChangeContractPrice = createHandleChange(setContractPrice);

  // Обработчики для профессий партнера
  const handleProfessionChange = (selectedName: string, id: string) => {
    setProfessions((prevProfessions: any[]) =>
      prevProfessions.map((profession: { _id: { $oid: string }; }) =>
        profession._id.$oid === id ? { ...profession, name: selectedName } : profession
      )
    );
  };

  const handleExperienceChange = (selectedExperience: string, id: string) => {
    setProfessions((prevProfessions: any[]) =>
      prevProfessions.map((profession: { _id: { $oid: string }; }) =>
        profession._id.$oid === id ? { ...profession, experience: selectedExperience } : profession
      )
    );
  };

  const handleSkillsChange = (id: string, skills: string) => {
    setProfessions((prevProfessions: any[]) =>
      prevProfessions.map((profession: { _id: { $oid: string }; }) =>
        profession._id.$oid === id ? { ...profession, skills } : profession
      )
    );
  };

  const handleDrivePChange = (selectedDriveP: string[], id: string) => {
    setProfessions((prevProfessions: any[]) =>
      prevProfessions.map((profession: { _id: { $oid: string }; }) =>
        profession._id.$oid === id ? { ...profession, drivePermis: selectedDriveP } : profession
      )
    );
  };

  const handleLangues = (selectedLangues: string[], id: string) => {
    setProfessions((prevProfessions: any[]) =>
      prevProfessions.map((profession: { _id: { $oid: string }; }) =>
        profession._id.$oid === id ? { ...profession, langue: selectedLangues } : profession
      )
    );
  };

  const handleSalaryChange = (salary: string, id: string) => {
    setProfessions((prevProfessions: any[]) =>
      prevProfessions.map((profession: { _id: { $oid: string }; }) =>
        profession._id.$oid === id ? { ...profession, salary } : profession
      )
    );
  };

  const handleRentPriceChange = (rentPrice: string, id: string) => {
    setProfessions((prevProfessions: any[]) =>
      prevProfessions.map((profession: { _id: { $oid: string }; }) =>
        profession._id.$oid === id ? { ...profession, rentPrice } : profession
      )
    );
  };

  const handleAvansChange = (avans: string, id: string) => {
    setProfessions((prevProfessions: any[]) =>
      prevProfessions.map((profession: { _id: { $oid: string }; }) =>
        profession._id.$oid === id ? { ...profession, avans } : profession
      )
    );
  };

  const handleWorkwearChange = (workwear: string, id: string) => {
    setProfessions((prevProfessions: any[]) =>
      prevProfessions.map((profession: { _id: { $oid: string }; }) =>
        profession._id.$oid === id ? { ...profession, workwear } : profession
      )
    );
  };

  const handleWorkHoursChange = (workHours: string, id: string) => {
    setProfessions((prevProfessions: any[]) =>
      prevProfessions.map((profession: { _id: { $oid: string }; }) =>
        profession._id.$oid === id ? { ...profession, workHours } : profession
      )
    );
  };

  const handleGetStartChange = (getStart: Date, id: string) => {
    setProfessions((prevProfessions: any[]) =>
      prevProfessions.map((profession: { _id: { $oid: string }; }) =>
        profession._id.$oid === id ? { ...profession, getStart } : profession
      )
    );
  };

  // Новые обработчики для работы с другими полями профессий
  const handlePlaceChange = (place: number, id: string) => {
    setProfessions((prevProfessions: any[]) =>
      prevProfessions.map((profession: { _id: { $oid: string }; }) =>
        profession._id.$oid === id ? { ...profession, place } : profession
      )
    );
  };

  const handleCandidatesChange = (candidates: string[], id: string) => {
    setProfessions((prevProfessions: any[]) =>
      prevProfessions.map((profession: { _id: { $oid: string }; }) =>
        profession._id.$oid === id ? { ...profession, candidates } : profession
      )
    );
  };

  const handleInterviewChange = (interview: string[], id: string) => {
    setProfessions((prevProfessions: any[]) =>
      prevProfessions.map((profession: { _id: { $oid: string }; }) =>
        profession._id.$oid === id ? { ...profession, interview } : profession
      )
    );
  };

  // Синхронизация локального состояния с пропсами partner
  useEffect(() => {
    if (partner) {
      setSelectName(partner.name || '');
      setSelectPhone(partner.phone || '');
      setSelectViber(partner.viber || '');
      setSelectTelegram(partner.telegram || '');
      setSelectWhatsapp(partner.whatsapp || '');
      setSelectEmail(partner.email || '');
      setSelectCompanyName(partner.companyName || '');
      setSelectNumberDE(partner.numberDE || '');
      setSelectLocation(partner.location || '');
      setSelectSite(partner.site || '');
      if (partner.contract) {
        setContractType(partner.contract.typeC || '');
        setContractPrice(partner.contract.sum || '');
      }
      setProfessions(partner.professions || []);
    }
  }, [partner]);

  return {
    // Основные данные партнера
    selectName,
    selectPhone,
    selectViber,
    selectTelegram,
    selectWhatsapp,
    selectEmail,
    selectCompanyName,
    selectNumberDE,
    selectLocation,
    selectSite,
    contractType,
    contractPrice,
    // Обработчики для основных данных
    handleChangeName,
    handleChangePhone,
    handleChangeViber,
    handleChangeTelegram,
    handleChangeWhatsapp,
    handleChangeEmail,
    handleChangeCompanyName,
    handleChangeNumberDE,
    handleChangeLocation,
    handleChangeSite,
    handleChangeContractType,
    handleChangeContractPrice,
    // Профессии
    professions,
    // Обработчики для профессий
    handleProfessionChange,
    handleExperienceChange,
    handleSkillsChange,
    handleDrivePChange,
    handleLangues,
    handleSalaryChange,
    handleRentPriceChange,
    handleAvansChange,
    handleWorkwearChange,
    handleWorkHoursChange,
    handleGetStartChange,
    handlePlaceChange,  // Новый обработчик
    handleCandidatesChange,  // Новый обработчик
    handleInterviewChange,  // Новый обработчик
  };
};

export default usePartnerData;
