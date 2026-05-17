export interface HorarioDay {
  active: boolean;
  from: string;
  to: string;
}

export type DayKey = 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom';

export type HorarioForm = Record<DayKey, HorarioDay>;

export interface RegistrationForm {
  nombre_entrepreneur:             string;
  edad_emprendedor:                string;
  nombre_emprendimiento:           string;
  celular_ventas:                  string;
  tiempo_mercado:                  string;
  descripcion_detallada:           string;
  horario:                         HorarioForm;
  tipo_ubicacion:                  string;
  link_google_maps:                string;
  red_fb:                          string;
  red_ig:                          string;
  red_tt:                          string;
  reduce_empaques:                 string;
  actividades_sostenibles:         string;
  resuelve_problematica_ambiental: string;
  foto_principal_url:              string;
  catalogo_pdf_url:                string;
}

export const DAYS: DayKey[] = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];

export const DAY_LABEL: Record<DayKey, string> = {
  lun: 'Lun', mar: 'Mar', mie: 'Mié', jue: 'Jue',
  vie: 'Vie', sab: 'Sáb', dom: 'Dom',
};

export const EMPTY_HORARIO: HorarioForm = {
  lun: { active: true,  from: '08:00', to: '18:00' },
  mar: { active: true,  from: '08:00', to: '18:00' },
  mie: { active: true,  from: '08:00', to: '18:00' },
  jue: { active: true,  from: '08:00', to: '18:00' },
  vie: { active: true,  from: '08:00', to: '18:00' },
  sab: { active: false, from: '09:00', to: '13:00' },
  dom: { active: false, from: '09:00', to: '13:00' },
};

export const EMPTY_FORM: RegistrationForm = {
  nombre_entrepreneur:             '',
  edad_emprendedor:                '',
  nombre_emprendimiento:           '',
  celular_ventas:                  '',
  tiempo_mercado:                  '',
  descripcion_detallada:           '',
  horario:                         { ...EMPTY_HORARIO },
  tipo_ubicacion:                  '',
  link_google_maps:                '',
  red_fb:                          '',
  red_ig:                          '',
  red_tt:                          '',
  reduce_empaques:                 '',
  actividades_sostenibles:         '',
  resuelve_problematica_ambiental: '',
  foto_principal_url:              '',
  catalogo_pdf_url:                '',
};

export function buildHorarioSummary(horario: HorarioForm): string {
  const active = DAYS.filter(d => horario[d].active);
  if (active.length === 0) return 'Sin días configurados — cerrado.';

  const segments: string[] = [];
  let i = 0;
  while (i < active.length) {
    let j = i;
    while (
      j + 1 < active.length &&
      DAYS.indexOf(active[j + 1]) === DAYS.indexOf(active[j]) + 1 &&
      horario[active[j + 1]].from === horario[active[i]].from &&
      horario[active[j + 1]].to === horario[active[i]].to
    ) j++;
    const { from, to } = horario[active[i]];
    if (j > i) {
      segments.push(`${DAY_LABEL[active[i]]} a ${DAY_LABEL[active[j]]} ${from}–${to}`);
    } else {
      segments.push(`${DAY_LABEL[active[i]]} ${from}–${to}`);
    }
    i = j + 1;
  }
  return segments.join(' · ');
}

export function validateStep(step: number, form: RegistrationForm): Record<string, string> {
  const e: Record<string, string> = {};
  if (step === 0) {
    if (!form.nombre_entrepreneur.trim())
      e.nombre_entrepreneur = 'Ingresa tu nombre completo.';
    else if (form.nombre_entrepreneur.trim().length < 3)
      e.nombre_entrepreneur = 'Mínimo 3 caracteres.';
  }
  if (step === 1) {
    if (!form.nombre_emprendimiento.trim())
      e.nombre_emprendimiento = 'El nombre del emprendimiento es obligatorio.';
    if (!form.celular_ventas)
      e.celular_ventas = 'Ingresa un número de celular válido.';
    else if (!/^[67]\d{7}$/.test(form.celular_ventas))
      e.celular_ventas = 'Debe tener 8 dígitos y empezar con 6 o 7.';
    if (!form.descripcion_detallada.trim())
      e.descripcion_detallada = 'Describe brevemente tu negocio.';
    else if (form.descripcion_detallada.trim().length < 20)
      e.descripcion_detallada = 'Cuéntanos un poco más — mínimo 20 caracteres.';
  }
  if (step === 2) {
    if (!form.tipo_ubicacion)
      e.tipo_ubicacion = 'Selecciona el tipo de ubicación.';
    if (form.tipo_ubicacion === 'fisica' && !form.link_google_maps.trim())
      e.link_google_maps = 'Como tienes tienda física, necesitamos un enlace de Google Maps.';
    if (form.tipo_ubicacion === 'fisica' && form.link_google_maps && !/^https?:\/\//i.test(form.link_google_maps))
      e.link_google_maps = 'El enlace debe empezar con http:// o https://';
    const hasActiveDay = DAYS.some(d => form.horario[d].active);
    if (!hasActiveDay)
      e.horario = 'Selecciona al menos un día de atención.';
  }
  if (step === 3) {
    if (!form.reduce_empaques)
      e.reduce_empaques = 'Selecciona una opción sobre empaques.';
    if (!form.foto_principal_url.trim())
      e.foto_principal_url = 'Ingresa la URL de la foto de portada.';
    else if (!/^https?:\/\//i.test(form.foto_principal_url))
      e.foto_principal_url = 'La URL debe empezar con http:// o https://';
    if (form.catalogo_pdf_url && !/^https?:\/\//i.test(form.catalogo_pdf_url))
      e.catalogo_pdf_url = 'La URL debe empezar con http:// o https://';
  }
  return e;
}
