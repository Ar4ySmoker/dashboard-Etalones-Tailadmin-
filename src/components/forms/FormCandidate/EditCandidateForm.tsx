'use client'
import React, { useContext, useEffect, useState } from 'react';
import DefaultInput from '../../inputs/DefaultInput/DefaultInput';
import { CirclePlus,  X } from 'lucide-react';
import Select from '../../inputs/Select/Select';
import { useNotifications } from '@/src/context/NotificationContext';
import { v4 as uuidv4Original } from 'uuid';
import DefaultInputH from '../../inputs/DefaultInputH/DefaultInputH';
import MultiSelect from '../../FormElements/MultiSelect';
import { useSession } from 'next-auth/react';
import {drivePermis, status, documentsOptions, citizenshipOptions} from '@/src/config/constants'
import {DriveOption, DocumentEntry, Comment, Profession, Language} from "../interfaces/FormCandidate.interface"
  
const EditCandidateForm = ({id, candidate, professions, partners}: any) => {
  const { data: session } = useSession();
    const managerId = session?.managerId;
    const [selectedStatus, setSelectedStatus] = useState(candidate?.status);
    useEffect(() => {
      // Обновить выбранный статус, если данные кандидата изменились
      setSelectedStatus(candidate?.status);
    }, [candidate?.status]);
  
    const handleChange = (selectedOption: { value: any; }) => {
      setSelectedStatus(selectedOption.value);
    };
  const [selectedDrive, setSelectedDrive] = useState<DriveOption[]>([]);
  const [documentEntries, setDocumentEntries] = useState<DocumentEntry[]>(candidate?.documents || []);
  const [langues, setLangues] = useState<Language[]>([]);
  const addLanguage = () => {
    setLangues([...langues, { name: 'Не знает языков', level: '' }]);
  };
  
  const handleLanguageChange = (index: number, field: keyof Language, value: string) => {
    const updatedLangues = [...langues];
    updatedLangues[index] = { ...updatedLangues[index], [field]: value };
    setLangues(updatedLangues);
  };
  
  const removeLanguage = (index: number) => {
    const updatedLangues = langues.filter((_, i) => i !== index);
    setLangues(updatedLangues);
  };
  const addDocumentEntry = () => {
    setDocumentEntries([...documentEntries, {
      docType: 'Нет документов', dateExp: '', dateOfIssue: '', numberDoc: '',
      file: undefined
    }]);
  };

  const handleDocumentChange = (index: number, field: string, value: string) => {
    const newEntries = [...documentEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setDocumentEntries(newEntries);
  };

  const removeDocumentEntry = (index: number) => {
    const newEntries = documentEntries.filter((_, i) => i !== index);
    setDocumentEntries(newEntries);
  };
  const [professionEntries, setProfessionEntries] = useState(candidate?.professions || []);

  const addProfessionEntry = () => {
    setProfessionEntries([...professionEntries, { name: 'Нет профессии', experience: '' }]);
  };

  const handleProfessionChange = (index: number, field: string, value: string) => {
    const newEntries = [...professionEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setProfessionEntries(newEntries);
  };

  const removeProfessionEntry = (index: number) => {
    const newEntries = professionEntries.filter((_: any, i: any) => i !== index);
    setProfessionEntries(newEntries);
  };
    const { addNotification } = useNotifications();
    const [phone, setPhone] = useState('');
    const generateId = () => uuidv4();  
    // console.log(generateId)
    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(event.target.value);
      };
    
      const handlePhoneBlur = async () => {
        if (phone.trim() === '') {
          return;
        }
    
        try {
          // Отправка запроса на сервер для поиска по номеру телефона
          const response = await fetch('/api/checkPhone', {
            method: 'POST',  // Используем POST
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone }), // Отправляем номер телефона в теле запроса
          });
    
          const data = await response.json();

          if (data.candidate) {
            addNotification({
              title: "Обновлено",
              content: `Кандидат с таким номером уже существует. Имя: ${data.candidate.name} Номер: ${data.candidate.phone}`,
              type: "error", // Пример успешного уведомления
              id: uuidv4Original(), // Генерация уникального id
            });
          } else if (data.message === 'Номер свободен') {
            addNotification({
              title: 'Номер свободен',
              content: 'Этот номер еще не зарегистрирован.',
              type: 'success',
              id: uuidv4Original(),
            });
          } else {
            addNotification({
              title: 'Ошибка',
              content: 'Произошла неизвестная ошибка.',
              type: 'error',
              id: uuidv4Original(),
            });
          }
                } catch (error) {
          console.error('Ошибка при поиске:', error);
        }
      };
    
      const [showAdditionalPhone, setAdditionalPhone] = useState(true);
      const [additionalPhones, setAdditionalPhones] = useState(candidate?.additionalPhones || []);
    
    // Функция для добавления нового телефона
  const addAdditionalPhone = () => {
    setAdditionalPhones([...additionalPhones, ""]);
  };

  // Функция для изменения значения дополнительного телефона
  const handleAdditionalPhoneChange = (index: number, value: string) => {
    const phones = [...additionalPhones];
    phones[index] = value;
    setAdditionalPhones(phones);
  };

  // Функция для удаления телефона
  const removeAdditionalPhone = (index: number) => {
    const phones = additionalPhones.filter((_: any, i: number) => i !== index);
    setAdditionalPhones(phones);
  };
  
  const handleSubmit = async(event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const body = {
      name: formData.get('name') || '',
      phone: formData.get('phone') || '',
      additionalPhones: additionalPhones.filter((phone: string) => phone.trim() !== ''),
      ageNum: formData.get('ageNum') || '',
      status: formData.get('status') || '',
      professions: professionEntries.filter((profession: { name: string; experience: string; }) => profession.name.trim() !== '' || profession.experience.trim() !== ''),
      documents: documentEntries.filter(document => document.docType.trim() !== '' || document.dateExp.trim() !== '' || document.dateOfIssue.trim() !== '' || document.numberDoc.trim() !== ''),
      drivePermis: selectedDrive.map(d => d.value).join(', '),
      citizenship: formData.get('citizenship'),
      leaving: formData.get('leaving'),
      langue: langues.filter(lang => lang.name.trim() !== '' || lang.level.trim() !== ''),
      locations: formData.get('locations'),
      cardNumber: formData.get('cardNumber'),
      comment: formData.get('comment') ? [{
        text: formData.get('comment'),
        date: new Date()
      }] : [],
      manager: managerId,
    };
    try {
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
    } catch (error) {
      console.error('Ошибка при добавлении кандидата:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-black-2 dark:text-white">
      <h2 className="text-center text-white text-2xl font-semibold mb-6">Добавить нового кандидата</h2>
      
      <form onSubmit={handleSubmit}
      className="grid grid-cols-[1fr_2fr_1fr] gap-4">
        
        {/* Личные данные */}
        <div className=" text-white">
          <h3 className="font-semibold text-lg mb-2 text-black-2 dark:text-white">Личные данные</h3>
          <DefaultInput id="name" label="ФИО" placeholder="Иван Иванов" defaultValue={candidate?.name}/>
          
          <div className='relative'>
          <DefaultInput id="phone" label="Телефон" type="text" placeholder="+373696855446"
          defaultValue={candidate?.phone}
          onChange={handlePhoneChange}
          onBlur={handlePhoneBlur}/>
          <button type="button" className="absolute top-0 right-0 text-green-400 hover:text-green-700 transition duration-300 ease-in-out" onClick={addAdditionalPhone}><CirclePlus width={20} height={20} /></button>
          </div>
          
          {additionalPhones.map((phone: string | undefined, index: any) => (
            <div key={index} className="flex gap-2">
              <DefaultInput
                defaultValue={candidate?.additionalPhone}
                label={`${index + 1} телефон`}
                id={`additionalPhone${index}`}
                name={`additionalPhone${index}`}
                type="phone"
                placeholder={phone}
                value={phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAdditionalPhoneChange(index, e.target.value)}
              />
              
              <button
                type="button"
                className="btn-xs self-end pb-0.5 text-red-500 hover:text-red-700 transition duration-300 ease-in-out"
                onClick={() => removeAdditionalPhone(index)}
              >
                <X />
              </button>
            </div>
          ))}

          <DefaultInput id="ageNum" label="Возраст" type="text" placeholder="33" defaultValue={candidate?.ageNum} />
          <Select label={'Статус первого диалога'} id="status" name="status" options={status} value={selectedStatus}  // Используем value для управления
      onChange={handleChange} />
          
        </div>

        {/* Работа */}
        <div className=" flex flex-col gap-1">
          {/* <h3 className="font-semibold text-white text-lg mb-2">Профессии / Документы</h3> */}
          <label htmlFor="professions">
                        <div className="flex justify-between items-start m-2">
                          <h3 className="font-bold text-md text-black-2 dark:text-white">Профессии</h3>
                          <button
                            className="btn-xs text-green-500 hover:text-green-700 transition duration-300 ease-in-out"
                            type="button"
                            onClick={addProfessionEntry}
                          >
                            <CirclePlus />
                          </button>
                        </div>
                        {professionEntries.map((prof: { name: any; experience: any; }, index: any | null | undefined) => (
                          <div key={index} className='flex w-full  gap-1 pr-2'>
                            <label htmlFor="profession">
                              <select className="text-sm  border-stroke rounded-lg border-[1.5px]  bg-transparent px-5 py-1 text-black-2 dark:text-white outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input  dark:focus:border-primary" value={prof.name || ''} onChange={e => handleProfessionChange(index, 'name', e.target.value || '')}>
                                <option>Нет профессии</option>
                                {professions.map((profession: { _id: React.Key ; name: string  }) => (
                                  <option key={profession._id} value={profession.name}>{profession.name}</option>
                                ))}
                              </select>
                            </label>
                            <label htmlFor="experience">
                              <select className="text-sm   border-stroke rounded-lg border-[1.5px]  bg-transparent px-5 py-1 text-black-2 dark:text-white outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input  dark:focus:border-primary" value={prof.experience || ''} onChange={e => handleProfessionChange(index, 'experience', e.target.value || '')}>
                                <option >Без опыта</option>
                                <option >Меньше года</option>
                                <option >Более года</option>
                                <option >От 2-х лет</option>
                                <option >Более 10-ти лет</option>
                              </select>
                            </label>
                            <button
                              className=" btn-xs text-red-500 hover:text-red-700 transition duration-300 ease-in-out"
                              type="button" onClick={() => removeProfessionEntry(index)}><X /></button>
                          </div>
                        ))}
                      </label>

                      <div className='flex justify-between items-start m-2'>
                          <h3 className="my-3 text-md font-bold">Документы</h3>
                          <button className="btn-xs text-green-500 hover:text-green-700 transition duration-300 ease-in-out" type="button" onClick={addDocumentEntry}>
                            <CirclePlus />
                          </button>
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                          {documentEntries.map((doc, index) => (
                            <div key={index} className=" flex ">
                              <p className="">{`${index + 1}.`}</p>&nbsp;
                              <label htmlFor="nameDocument" className="flex flex-col items-center gap-2 relative">
                                <div className='flex  justify-center items-center'>
                                <select className="text-sm  h-[25px] border-stroke rounded-lg border-[1.5px]  bg-transparent px-5 py-1 text-black-2 dark:text-white outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input  dark:focus:border-primary" 
                                value={doc.docType || ''} onChange={e => handleDocumentChange(index, 'docType', e.target.value || '')}>
                                  <option value="Не указано">Не указано</option>
                                  <option value="Виза">Виза</option>
                                  <option value="Песель">Песель</option>
                                  <option value="Паспорт">Паспорт</option>
                                  <option value="Паспорт ЕС">Паспорт ЕС</option>
                                  <option value="Паспорт Биометрия Украины">Паспорт Биометрия Украины</option>
                                  <option value="Параграф 24">Параграф 24</option>
                                  <option value="Карта побыту">Карта побыту</option>
                                  <option value="Геверба">Геверба</option>
                                  <option value="Карта сталого побыта">Карта сталого побыта</option>
                                  <option value="Приглашение">Приглашение</option>
                                </select>
                                <DefaultInputH placeholder='Номер документа' id='nunberDoc' label='#:' type="text" defaultValue={doc.numberDoc} onChange={(e: { target: { value: any; }; }) => handleDocumentChange(index, 'numberDoc', e.target.value)} />
                                </div>
                                <div className='flex justify-center items-center gap-3'>
                                <DefaultInput id='dateOfIssue' label='Выдан' type="date" defaultValue={doc.dateOfIssue} onChange={(e: { target: { value: any; }; }) => handleDocumentChange(index, 'dateOfIssue', e.target.value)} />
                                <DefaultInput id='documDate' label='До' type="date" defaultValue={doc.dateExp} onChange={(e: { target: { value: any; }; }) => handleDocumentChange(index, 'dateExp', e.target.value)} />
                                </div>
                                <button className="absolute right-2 top-8 btn-xs text-red-500 hover:text-red-700 transition duration-300 ease-in-out self-end flex"
                                  type="button" onClick={() => removeDocumentEntry(index)}><X /></button>
                              </label>
                            </div>
                          ))}
                        </div>
                        <p>Комментарий</p>
                        <div>
                          <p>Предыдущие Комментарий</p>
                          {candidate?.comment.map((comment: { author: any; text: any; date: any; }, index: any | null | undefined) => (
                            <div key={index} className="flex flex-col gap-2 items-start">
                              <p className="text-sm">{comment.author}</p>
                              <p className="text-sm">{comment.text}</p>
                              <p className="text-sm">{comment.date}</p>
                            </div>
                          ))}
                        </div>
                        <textarea
                         id="comment" name="comment"
                          rows={6}
                          placeholder="Оставьте свой комментарий"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        ></textarea>

        </div>

        {/* Дополнительно */}
        <div >
          <h3 className="font-semibold text-lg mb-2">Дополнительно</h3>
          <Select label={'Гражданство'} id="citizenship" name="citizenship" placeholder='Выберите гражданство' options={citizenshipOptions} />
          <DefaultInput id='leaving' label='Готов выехать' type="date"  />
          <DefaultInput label="Местоположение" id='locations' name='locations' />
          <MultiSelect label='Водительское удостоверение' options={drivePermis} placeholder="Категории В/У" className="w-full my-1 text-sm" onChange={(selected: string[]) => setSelectedDrive(selected.map(value => ({ label: value, value })))} id='drivePermis' />
          <DefaultInput id='cardNumber' label='Номер счёта' type="text" />
          <div className='flex justify-between items-center m-2'>
  <h3 className="my-3 text-md font-bold">Языки</h3>
  <button className="btn-xs text-green-500 hover:text-green-700 transition duration-300 ease-in-out" type="button" onClick={addLanguage}>
    <CirclePlus />
  </button>
</div>

{/* Отображение списка языков */}
<div className='flex flex-col gap-2 w-full'>
  {langues.map((lang, index) => (
    <div key={index} className="flex flex-col gap-2">
      <label htmlFor={`langue-${index}`} className="flex flex-col gap-1 items-start relative">
        {/* Язык */}
        <div className='flex flex-col justify-between items-start '>
          <div>Знание языка</div>
          <select
            id={`langue-${index}`}
            name={`langue-${index}`}
            className="text-sm w-[250px] h-[25px] border-stroke rounded-lg border-[1.5px] bg-transparent px-5 py-1 text-black-2 dark:text-white outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            value={lang.name}
            onChange={(e) => handleLanguageChange(index, 'name', e.target.value)}
          >
            <option value='Не знает языков'>Не знает языков</option>
            <option value='Немецкий'>Немецкий</option>
            <option value='Английский'>Английский</option>
            <option value='Польский'>Польский</option>
            <option value='Турецкий'>Турецкий</option>
            <option value='Французский'>Французский</option>
            <option value='Итальянский'>Итальянский</option>
          </select>
        </div>
        
        {/* Уровень */}
        <div className='flex flex-col justify-between items-start '>
          <div>Уровень</div>
          <select
            className="text-sm h-[25px] w-[250px] border-stroke rounded-lg border-[1.5px] bg-transparent px-5 py-1 text-black-2 dark:text-white outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            value={lang.level}
            onChange={(e) => handleLanguageChange(index, 'level', e.target.value)}
          >
            <option value=''>Выберите уровень</option>
            <option value='Самоучка'>Самоучка</option>
            <option value='Уровень А1'>Уровень А1</option>
            <option value='Уровень А2'>Уровень А2</option>
            <option value='Уровень B1'>Уровень B1</option>
            <option value='Уровень B2'>Уровень B2</option>
          </select>
        </div>
        {/* Кнопка для удаления языка */}
      <button
        className="absolute right-2 btn-xs text-red-500 hover:text-red-700 transition duration-300 ease-in-out self-end flex"
        type="button"
        onClick={() => removeLanguage(index)}
      >
        <X />
      </button>
      </label>

      
    </div>
  ))}
</div>

        </div>
        
        
        {/* Кнопка отправки формы */}
        <div className="col-span-full mt-6 text-center">
          <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-md">
            Добавить
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCandidateForm;
function uuidv4(): string {
    throw new Error('Function not implemented.');
}

