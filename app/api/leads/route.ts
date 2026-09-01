import { leads } from '@/db/schema';
import { getBindings, getDb } from '@/db';

export const runtime = 'edge';

const allowedExtensions = new Set(['pdf', 'dwg', 'dxf', 'zip', 'rar', 'xlsx', 'xls']);
const maxFileSize = 25 * 1024 * 1024;
const maxEmailAttachmentSize = 10 * 1024 * 1024;
const leadEmail = 'krim.lidersev@gmail.com';

function numberField(form: FormData, name: string) {
  const value = Number(form.get(name));
  return Number.isFinite(value) ? value : 0;
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const workType = form.get('workType') === 'facade' ? 'facade' : 'masonry';
    const volume = Math.round(numberField(form, 'volume'));
    const days = Math.round(numberField(form, 'days'));
    const address = String(form.get('address') ?? '').trim();
    const phone = String(form.get('phone') ?? '').trim();
    const attachment = form.get('project');

    if (volume < 100 || days < 7 || address.length < 5 || phone.length < 6) {
      return Response.json({ error: 'Проверьте параметры объекта и контактные данные.' }, { status: 400 });
    }

    const productivity = workType === 'facade' ? 10 : 7;
    const rate = workType === 'facade' ? 2600 : 2900;
    const people = Math.max(4, Math.ceil(volume / (days * productivity)));
    const estimateAmount = volume * rate;
    const id = crypto.randomUUID();

    let fileName: string | null = null;
    let fileKey: string | null = null;
    let fileSize: number | null = null;
    let fileType: string | null = null;

    if (attachment instanceof File && attachment.size > 0) {
      const extension = attachment.name.split('.').pop()?.toLowerCase() ?? '';
      if (!allowedExtensions.has(extension) || attachment.size > maxFileSize) {
        return Response.json({ error: 'Файл должен быть PDF, DWG, Excel или архивом до 25 МБ.' }, { status: 400 });
      }

      const safeName = attachment.name.replace(/[^a-zA-Z0-9а-яА-ЯёЁ._-]/g, '_');
      fileName = attachment.name;
      fileKey = `projects/${id}/${safeName}`;
      fileSize = attachment.size;
      fileType = attachment.type || 'application/octet-stream';

      const { files } = getBindings();
      await files.put(fileKey, attachment.stream(), {
        httpMetadata: { contentType: fileType },
        customMetadata: { leadId: id, originalName: attachment.name },
      });
    }

    try {
      const db = await getDb();
      await db.insert(leads).values({
        id,
        createdAt: new Date(),
        workType,
        volume,
        days,
        people,
        estimateAmount,
        address,
        phone,
        fileName,
        fileKey,
        fileSize,
        fileType,
        status: 'new',
      });
    } catch (error) {
      if (fileKey) {
        const { files } = getBindings();
        await files.delete(fileKey);
      }
      throw error;
    }

    try {
      const notification = new FormData();
      notification.set('_subject', `Новая заявка с сайта: ${workType === 'facade' ? 'фасад' : 'кладка'}`);
      notification.set('_template', 'table');
      notification.set('_captcha', 'false');
      notification.set('Тип работ', workType === 'facade' ? 'Фасадные работы' : 'Кладка газоблока');
      notification.set('Объём', `${volume} ${workType === 'facade' ? 'м²' : 'м³'}`);
      notification.set('Срок выполнения', `${days} дней`);
      notification.set('Расчётная бригада', `${people} человек`);
      notification.set('Предварительная стоимость', `${estimateAmount.toLocaleString('ru-RU')} ₽`);
      notification.set('Адрес объекта', address);
      notification.set('Телефон заказчика', phone);
      notification.set('Номер заявки', id);
      notification.set('Дата заявки', new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }));

      if (fileName) {
        notification.set('Файл проекта', fileName);
      }
      if (attachment instanceof File && attachment.size > 0 && attachment.size <= maxEmailAttachmentSize) {
        notification.set('attachment', attachment, attachment.name);
      }

      const emailResponse = await fetch(`https://formsubmit.co/ajax/${leadEmail}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: notification,
      });

      if (!emailResponse.ok) {
        console.error('Lead email notification failed', emailResponse.status, await emailResponse.text());
      }
    } catch (emailError) {
      console.error('Lead email notification failed', emailError);
    }

    return Response.json({ ok: true, id, people, estimateAmount });
  } catch (error) {
    console.error('Lead submission failed', error);
    return Response.json({ error: 'Не удалось отправить заявку. Попробуйте ещё раз.' }, { status: 500 });
  }
}
