import { leads } from '@/db/schema';
import { getBindings, getDb } from '@/db';

export const runtime = 'edge';

const allowedExtensions = new Set(['pdf', 'dwg', 'dxf', 'zip', 'rar', 'xlsx', 'xls']);
const maxFileSize = 25 * 1024 * 1024;

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

    return Response.json({ ok: true, id, people, estimateAmount });
  } catch (error) {
    console.error('Lead submission failed', error);
    return Response.json({ error: 'Не удалось отправить заявку. Попробуйте ещё раз.' }, { status: 500 });
  }
}
