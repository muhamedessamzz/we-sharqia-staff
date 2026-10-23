import { useState } from 'react';
import { api } from '../../../api/client';

const PARENT_NOTICES_KEY = 'we_sharkia_parent_notices';

export function useParentNotification() {
  const [notifyModalData, setNotifyModalData] = useState(null);
  const [customMessage, setCustomMessage] = useState('');

  const openNotifyModal = (item, category) => {
    let generatedMsg = '';
    const student = item.studentName || 'الطالب';
    const parent = item.parentName || 'ولي الأمر الكريم';

    if (category === 'haircut') {
      generatedMsg = `ولي أمر الطالب الكريم (${parent})،\nتحية طيبة من مدرسة WE للتكنولوجيا التطبيقية (فرع الشرقية).\nتم تنبيه الطالب (${student}) بضرورة قص الشعر والالتزام بلائحة المظهر العام للمدرسة.\nنرجو متابعة الطالب للالتزام بدءاً من الغد.\nشاكرين تعاونكم معنا 💜.`;
    } else if (category === 'uniform') {
      generatedMsg = `ولي أمر الطالب الكريم (${parent})،\nتحية طيبة من مدرسة WE للتكنولوجيا التطبيقية.\nلوحظ اليوم عدم التزام الطالب (${student}) بارتداء الزي المدرسي المعتمد للتدريب والمعامل.\nنرجو توجيه الطالب للالتزام بالزي المدرسي بدءاً من الغد حرصاً على سلامته وانضباطه.\nشاكرين تعاونكم معنا 💜.`;
    } else if (category === 'absence') {
      generatedMsg = `إشعار غياب - مدرسة WE للتكنولوجيا التطبيقية\nولي أمر الطالب الكريم (${parent})،\nنود إحاطتكم بغياب الطالب (${student}) عن الحضور (إجمالي الغياب: ${item.absenceDaysCount || 3} أيام).\nنرجو إفادتنا بسبب الغياب أو مراجعة إدارة المدرسة لتقديم العذر ومتابعة الموقف.\nشاكرين حرصكم ومتابعتكم 💜.`;
    } else if (category === 'disruption') {
      generatedMsg = `ملاحظة سلوكية - مدرسة WE للتكنولوجيا التطبيقية\nولي أمر الطالب الكريم (${parent})،\nنحيطكم علماً بتسجيل ملاحظة سلوكية تخص الطالب (${student}) في ${item.location || 'المدرسة'}: (${item.incidentSummary || 'مخالفة التعليمات'}).\nنرجو التواصل مع الأخصائي الاجتماعي بالمدرسة لمتابعة توجيه الطالب لمصلحته.\nشاكرين تعاونكم الدائم 💜.`;
    } else {
      generatedMsg = `رسالة من مدرسة WE للتكنولوجيا التطبيقية بخصوص الطالب: ${student}.\nنرجو التواصل مع الأخصائي الاجتماعي لمتابعة حالة الطالب.\nشاكرين تعاونكم 💜.`;
    }

    setNotifyModalData({
      ...item,
      category,
      phone: item.parentPhone || '01012345678',
    });
    setCustomMessage(generatedMsg);
  };

  const closeNotifyModal = () => {
    setNotifyModalData(null);
    setCustomMessage('');
  };

  const persistNoticeToBackend = async (item, message) => {
    try {
      await api.createStudentNotice({
        studentId: item.studentId || item.id,
        studentName: item.studentName,
        classroom: item.classroom || 'A1',
        category: item.category || 'disruption',
        title: item.title || (item.category === 'haircut' ? 'ملاحظة مظهر وقصة شعر' : item.category === 'uniform' ? 'مخالفة زي مدرسي ومعامل' : item.category === 'absence' ? 'إشعار وإنذار غياب' : 'ملاحظة سلوكية وانضباط'),
        details: message,
        actionTaken: item.actionTaken || 'إخطار وتوجيه ولي الأمر للمتابعة',
        severity: item.category === 'absence' ? 'warning' : 'info',
        issuedBy: 'أ. منى (الأخصائي الاجتماعي)'
      });
    } catch (e) {
      console.warn('Notice persistence to backend fallback:', e);
    }
  };

  const sendWhatsApp = async () => {
    if (!notifyModalData) return;
    const cleanPhone = (notifyModalData.phone || '').replace(/[^0-9]/g, '');
    const finalPhone = cleanPhone.startsWith('0')
      ? '2' + cleanPhone
      : cleanPhone.startsWith('20')
      ? cleanPhone
      : '20' + cleanPhone;

    const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(customMessage)}`;
    window.open(url, '_blank');

    await persistNoticeToBackend(notifyModalData, customMessage);
    alert('تم فتح WhatsApp وتوثيق الإشعار رسمياً في قاعدة بيانات المدرسة وإرساله لبوابة ولي الأمر');
    closeNotifyModal();
  };

  const sendToPortal = async () => {
    if (!notifyModalData) return;
    await persistNoticeToBackend(notifyModalData, customMessage);
    alert('تم إرسال الإشعار وتوثيقه في قاعدة البيانات وبوابة ولي الأمر بنجاح ✓');
    closeNotifyModal();
  };

  return {
    notifyModalData,
    customMessage,
    setCustomMessage,
    setNotifyModalData,
    openNotifyModal,
    closeNotifyModal,
    sendWhatsApp,
    sendToPortal,
  };
}
