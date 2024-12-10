// Тип для профессии
export type Profession = {
    id: string;
    name: string;
    experience: string;
    _id: string; 
  };
  
  // Тип для документа
  export type Document = {
    id: string;
    docType: string;
    dateExp: string; // Если дата не указана, можно оставить пустым, или использовать тип Date
    numberDoc: string;
    _id: string; // Также ObjectId или строка
    
  };
  
  // Тип для языков (если это поле также может быть описано по подобному принципу)
  export type Language = {
    name: string;
    level: string;
  };
  
  // Тип для статуса партнёра (statusFromPartner)
  export type StatusFromPartner = {
    status: string;
    who: string;
  };
  
  // Тип для комментариев
  export type Comment = string[]; // Массив строк для комментариев
  
  // Тип для даты, которая используется в MongoDB (например, для createdAt и updatedAt)
  export type DateField = {
    $date: {
      $numberLong: string; // Строка, представляющая число в миллисекундах
    };
  };
  
  // Основной тип для кандидата
  export type Candidate = {
    docType: any;
    id: string;
    _id: {
      $oid: string; // ID в MongoDB
    };
    name: string;
    phone: string;
    age: string;
    leaving: string | null; // Если нет данных, то null
    drivePermis: string;
    cardNumber: string;
    workHours: string;
    locations: string;
    professions: Profession[]; // Массив профессий
    documents: Document[]; // Массив документов
    langue: Language; // Языковая информация
    manager: {
      $oid: string; // ID менеджера
    };
    status: string;
    comment: Comment; // Массив комментариев
    commentMng: Comment; // Массив комментариев менеджера (если есть)
    statusFromPartner: StatusFromPartner; // Статус партнёра
    createdAt: any; // Дата создания
    updatedAt: any; // Дата обновления
    __v: number; // Версия, используемая MongoDB
  };
  