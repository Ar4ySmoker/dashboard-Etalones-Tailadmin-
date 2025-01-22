import { connectDB } from '@/src/lib/db';
import Partner from '@/src/models/Partner';
import { NextResponse } from 'next/server';

// Интерфейсы для типизации
interface ProfessionEntry {
  name: string;
  location: string;
  skills: string;
  experience: string;
  place: number;
  salary: string;
  rentPrice: string;
  avans: string;
  workwear: string;
  drivePermis: string[];
  langue: string[];
  workHours: string;
  getStart: string | Date;
  candidates: any[]; // Вы можете заменить на более специфичный тип
  interview: any[]; // Вы можете заменить на более специфичный тип
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Получаем форму данных
    const formData = await request.formData();
    await connectDB();

    // Получаем старого партнера
    const oldPartner = await Partner.findById(id).lean();
    if (!oldPartner) {
      return NextResponse.json({ message: "Partner not found" }, { status: 404 });
    }

    console.log(`Old Partner Retrieved: ${JSON.stringify(oldPartner)}`);

    // Обрабатываем профессии
    const professionEntries = JSON.parse(formData.get('professions') as string);
    const professionsData: ProfessionEntry[] = [];

    for (let i = 0; i < professionEntries.length; i++) {
      const prof = professionEntries[i];

      // Собираем данные профессии
      professionsData.push({
        name: prof.name || '',
        location: prof.location || '',
        skills: prof.skills || '',
        experience: prof.experience || '',
        place: prof.place || 0,
        salary: prof.salary || '',
        rentPrice: prof.rentPrice || '',
        avans: prof.avans || '',
        workwear: prof.workwear || '',
        drivePermis: prof.drivePermis || [],
        langue: prof.langue || [],
        workHours: prof.workHours || '',
        getStart: prof.getStart || new Date(),  // Устанавливаем текущую дату по умолчанию
        candidates: prof.candidates || [],
        interview: prof.interview || [],
      });
    }

    // Обновляем партнера в базе данных
    await Partner.findByIdAndUpdate(
      id,
      {
        $set: {
          professions: professionsData, // Обновляем профессии
        },
      },
      { new: true }
    );

    console.log('Partner professions updated in database');

    return NextResponse.json({ message: "Partner updated" }, { status: 200 });
  } catch (error: any) {
    console.error('Error processing the request:', error);
    return NextResponse.json({ message: 'Error processing request', error: error.message }, { status: 500 });
  }
}
