import { IncomingForm } from 'formidable';
import { connectDB } from '@/src/lib/db';
import  Candidate  from '@/src/models/Candidate';
import Partner from '@/src/models/Partner';
import Manager from '@/src/models/Manager';
import Document from '@/src/models/Document';
import { NextResponse } from 'next/server';
import { CommentEntry } from '@/src/components/forms/interfaces/FormCandidate.interface';
// Интерфейсы для типизации
interface CandidateUpdate {
  partners?: string;
  manager?: string;
  [key: string]: any;
}

interface CandidateDoc {
  _id: string;
  partners?: string;
  manager?: string;
  comment?: CommentEntry[];
  documents: {
    docType: any;
    dateExp: any;
    dateOfIssue: any;
    numberDoc: any; file: string 
}[];
  // Добавьте другие поля, если необходимо
}
//Работал пут без файла
// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   const { id } = params;
//   try {
//     // Получаем тело запроса
//     const body = await request.json();
//     console.log('Request Body:', body);  // Логируем тело запроса

//     // Подключаемся к базе данных
//     await connectDB();

//     // Получаем старого кандидата
//     const oldCandidate = await Candidate.findById(id).lean() as CandidateDoc | null;

//     if (!oldCandidate) {
//       return NextResponse.json({ message: "Candidate not found" }, { status: 404 });
//     }

//     // Обновляем информацию о комментариях
//     if (body.comment) {
//       // Если у старого кандидата уже есть комментарии, добавляем новый
//       if (Array.isArray(oldCandidate.comment)) {
//         oldCandidate.comment.push(...body.comment);
//       } else {
//         // Если комментариев нет, создаем новый массив
//         oldCandidate.comment = body.comment;
//       }
//     }

//     // Обновляем кандидата, включая обновленный массив комментариев
//     await Candidate.findByIdAndUpdate(id, {
//       ...body,  // Все остальные поля из body
//       comment: oldCandidate.comment,  // Обновляем комментарии
//     }, { new: true });

//     return NextResponse.json({ message: "Candidate updated" }, { status: 200 });
//   } catch (error: any) {
//     console.error('Error parsing JSON or processing the request:', error);
//     return NextResponse.json({ message: 'Error processing request', error: error.message }, { status: 500 });
//   }
// }
// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   const { id } = params;

//   try {
//     // Получаем форму данных
//     const formData = await request.formData();
//     console.log('Form Data:', formData);  // Логируем данные формы
//     const documents = formData.getAll('documents');
//     console.log('Received documents:', documents); // Логируем документы

//     // Подключаемся к базе данных
//     await connectDB();

//     // Получаем старого кандидата
//     const oldCandidate = await Candidate.findById(id).lean() as CandidateDoc | null;

//     if (!oldCandidate) {
//       return NextResponse.json({ message: "Candidate not found" }, { status: 404 });
//     }

//     console.log(`Old Candidate Retrieved: ${JSON.stringify(oldCandidate)}`);

//     // Обрабатываем документы
//     const documentEntries = JSON.parse(formData.get('documents') as string);
//     const documentsData = [];

//     for (let i = 0; i < documentEntries.length; i++) {
//       const doc = documentEntries[i];
//       const file = formData.get(`documents[${i}][file]`);

//       if (file && file instanceof Blob) {
//         console.log(`File received: ${file.name} (${file.type})`);

//         // Преобразуем файл в буфер
//         const bufferData = await file.arrayBuffer();
//         const buffer = Buffer.from(bufferData);

//         // Сохраняем файл в коллекции документов
//         const document = new Document({
//           name: file.name, // Имя файла
//           data: buffer,    // Данные файла
//           contentType: file.type,  // Тип контента файла
//         });

//         const savedDocument = await document.save();

//         console.log(`Document saved with ID: ${savedDocument._id}`);

//         // Добавляем ID файла в массив документов
//         documentsData.push({
//           docType: doc.docType || '',
//           dateExp: doc.dateExp || '',
//           dateOfIssue: doc.dateOfIssue || '',
//           numberDoc: doc.numberDoc || '',
//           file: savedDocument._id,  // Сохраняем ID сохраненного файла
//         });
//       } else {
//         documentsData.push({
//           docType: doc.docType || '',
//           dateExp: doc.dateExp || '',
//           dateOfIssue: doc.dateOfIssue || '',
//           numberDoc: doc.numberDoc || '',
//           file: null,  // Если файл не передан, сохраняем null
//         });
//       }
//     }

//     // Обновляем кандидата в базе данных, добавляем новые документы
//     await Candidate.findByIdAndUpdate(id, {
//       $set: {
//         documents: documentsData, // Обновляем документы с правильными ID
//       },
//     }, { new: true });

//     console.log('Candidate document list updated in database');

//     return NextResponse.json({ message: "Candidate updated" }, { status: 200 });
//   } catch (error: any) {
//     console.error('Error processing the request:', error);
//     return NextResponse.json({ message: 'Error processing request', error: error.message }, { status: 500 });
//   }
// }
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Получаем форму данных
    const formData = await request.formData();
    console.log('Form Data:', formData);  // Логируем данные формы
    const documents = formData.getAll('documents');
    console.log('Received documents:', documents); // Логируем документы

    // Подключаемся к базе данных
    await connectDB();

    // Получаем старого кандидата
    const oldCandidate = await Candidate.findById(id).lean() as CandidateDoc | null;

    if (!oldCandidate) {
      return NextResponse.json({ message: "Candidate not found" }, { status: 404 });
    }

    console.log(`Old Candidate Retrieved: ${JSON.stringify(oldCandidate)}`);

    // Обрабатываем документы
    const documentEntries = JSON.parse(formData.get('documents') as string);
    const documentsData = [];

    for (let i = 0; i < documentEntries.length; i++) {
      const doc = documentEntries[i];
      const file = formData.get(`documents[${i}][file]`);

      if (file && file instanceof Blob) {
        console.log(`File received: ${file.name} (${file.type})`);

        // Преобразуем файл в буфер
        const bufferData = await file.arrayBuffer();
        const buffer = Buffer.from(bufferData);

        // Сохраняем файл в коллекции документов
        const document = new Document({
          name: file.name, // Имя файла
          data: buffer,    // Данные файла
          contentType: file.type,  // Тип контента файла
        });

        const savedDocument = await document.save();

        console.log(`Document saved with ID: ${savedDocument._id}`);

        // Добавляем ID файла в массив документов
        documentsData.push({
          docType: doc.docType || '',
          dateExp: doc.dateExp || '',
          dateOfIssue: doc.dateOfIssue || '',
          numberDoc: doc.numberDoc || '',
          file: savedDocument._id,  // Сохраняем ID сохраненного файла
        });
      } else {
        // Если нет файла, оставляем старые документы без изменений
        const existingDoc = oldCandidate.documents?.[i];

        if (existingDoc) {
          documentsData.push({
            docType: doc.docType || existingDoc.docType,
            dateExp: doc.dateExp || existingDoc.dateExp,
            dateOfIssue: doc.dateOfIssue || existingDoc.dateOfIssue,
            numberDoc: doc.numberDoc || existingDoc.numberDoc,
            file: existingDoc.file,  // Оставляем старое значение file
          });
        } else {
          // Если это новый документ без файла, то добавляем его как новый
          documentsData.push({
            docType: doc.docType || '',
            dateExp: doc.dateExp || '',
            dateOfIssue: doc.dateOfIssue || '',
            numberDoc: doc.numberDoc || '',
            file: null,  // Если файл не передан, сохраняем null
          });
        }
      }
    }

    // Обновляем кандидата в базе данных, добавляем новые документы
    await Candidate.findByIdAndUpdate(id, {
      $set: {
        documents: documentsData, // Обновляем документы с правильными ID
      },
    }, { new: true });

    console.log('Candidate document list updated in database');

    return NextResponse.json({ message: "Candidate updated" }, { status: 200 });
  } catch (error: any) {
    console.error('Error processing the request:', error);
    return NextResponse.json({ message: 'Error processing request', error: error.message }, { status: 500 });
  }
}





export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  await connectDB();

  const candidate = await Candidate.findById(id)
    .populate(['comment', 'manager', 'professions', 'langue', 'partners', 'tasks', 'documents']) 
    .lean() as CandidateDoc | null;
  if (!candidate) {
    return NextResponse.json({ message: "Candidate not found" }, { status: 404 });
  }

  return NextResponse.json({ candidate }, { status: 200 });
}