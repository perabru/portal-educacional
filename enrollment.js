/** Regras de escolha de disciplinas compartilhadas pelo cadastro e pelo portal. */
export const SCHOOL_OPTIONS=['UNIVAP','MAXIMUS'];
export const YEAR_OPTIONS=['1º ano','2º ano','3º ano','Outros'];
export const COURSE_YEAR_OPTIONS=['1º ano','2º ano','3º ano','1º e 2º anos','Todos os anos','Outros'];
export const normalizeClass=value=>String(value??'').trim().toUpperCase().replace(/\s+/g,' ');
export const validClass=value=>/^[A-Z0-9 _-]{1,35}$/.test(normalizeClass(value));
export function courseClasses(course){
 const raw=course?.turmas;
 const values=Array.isArray(raw)?raw:raw&&typeof raw==='object'?Object.keys(raw).filter(key=>raw[key]===true):typeof raw==='string'?raw.split(/[,;\n]/):[];
 return [...new Set(values.map(normalizeClass).filter(validClass))];
}
export function yearMatches(courseYear,studentYear){
 const value=String(courseYear??'').trim();
 return YEAR_OPTIONS.includes(studentYear)&&(value===studentYear||value==='Todos os anos'||(value==='1º e 2º anos'&&['1º ano','2º ano'].includes(studentYear)));
}
export function courseMatchesEnrollment(course,profile,{ignoreClass=false}={}){
 if(!course||!profile||course.ativo===false||!SCHOOL_OPTIONS.includes(profile.instituicao)||String(course.instituicao||'UNIVAP').toUpperCase()!==profile.instituicao||!yearMatches(course.ano,profile.ano))return false;
 const classes=courseClasses(course);
 return ignoreClass||!classes.length||classes.includes(normalizeClass(profile.turma));
}
