import { useState, useEffect, useCallback } from "react";

// ─── API CONFIG ───────────────────────────────────────────────────────────────
const API_URL = window.location.origin.includes('localhost') ? "http://localhost:3001/api" : "/api";

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    dashboard: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    users: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    salary: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    clock: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    calendar: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    warning: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    logout: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    shield: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    check: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
    x: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    eye: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    eyeoff: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
    star: <svg width={size} height={size} fill={color} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    plus: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    edit: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    crown: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M2 20h20M4 20l2-8 6 4 6-4 2 8"/><circle cx="12" cy="8" r="2"/></svg>,
    building: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>,
    mail: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    phone: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.4 2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  };
  return icons[name] || null;
};

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    title: "Demo Office Management System",
    login: "Login", register: "Register", logout: "Logout", back: "Back to Login",
    email: "Email Address", password: "Password", name: "Full Name", phone: "Phone Number", dept: "Department",
    experience: "Work Experience", quitReason: "Reason for leaving last job", expertise: "Expertise Area",
    createAccount: "Create Account", joinTeam: "Join the team — fill in your details",
    pendingTitle: "Application Under Review", pendingMsg: "Your application has been received and is currently being reviewed by our HR team. We will notify you once you are approved.",
    enrollments: "Enrollments", dashboard: "Dashboard", workers: "Workers", salary: "Salary", hours: "Hours", leaves: "Leaves", penalties: "Penalties",
    approve: "Approve", reject: "Reject", setSalary: "Set Monthly Salary", setJob: "Set Job Title",
    welcome: "Welcome back", newWorker: "New worker?", language: "Language"
  },
  hi: {
    title: "कार्यालय प्रबंधन प्रणाली",
    login: "लॉगिन", register: "पंजीकरण", logout: "लॉगआउट", back: "लॉगिन पर वापस जाएं",
    email: "ईमेल पता", password: "पासवर्ड", name: "पूरा नाम", phone: "फ़ोन नंबर", dept: "विभाग",
    experience: "कार्य अनुभव", quitReason: "पिछली नौकरी छोड़ने का कारण", expertise: "विशेषज्ञता क्षेत्र",
    createAccount: "खाता बनाएं", joinTeam: "टीम में शामिल हों - नीचे अपना विवरण भरें",
    pendingTitle: "आवेदन की समीक्षा की जा रही है", pendingMsg: "आपका आवेदन प्राप्त हो गया है और वर्तमान में हमारी एचआर टीम द्वारा इसकी समीक्षा की जा रही है। स्वीकृत होने पर हम आपको सूचित करेंगे।",
    enrollments: "नामांकन", dashboard: "डैशबोर्ड", workers: "कर्मचारी", salary: "वेतन", hours: "घंटे", leaves: "छुट्टियां", penalties: "जुर्माना",
    approve: "स्वीकार करें", reject: "अस्वीकार करें", setSalary: "मासिक वेतन निर्धारित करें", setJob: "नौकरी का शीर्षक निर्धारित करें",
    welcome: "वापसी पर स्वागत है", newWorker: "नए कर्मचारी?", language: "भाषा"
  },
  es: {
    title: "Sistema de Gestión de Oficina",
    login: "Acceso", register: "Registro", logout: "Cerrar sesión", back: "Volver al inicio",
    email: "Correo electrónico", password: "Contraseña", name: "Nombre completo", phone: "Teléfono", dept: "Departamento",
    experience: "Experiencia laboral", quitReason: "Razón por la que dejó su último trabajo", expertise: "Área de especialización",
    createAccount: "Crear cuenta", joinTeam: "Únete al equipo — rellena tus datos",
    pendingTitle: "Solicitud en Revisión", pendingMsg: "Su solicitud ha sido recibida y está siendo revisada por nuestro equipo de RRHH. Le notificaremos una vez sea aprobada.",
    enrollments: "Inscripciones", dashboard: "Panel", workers: "Trabajadores", salary: "Salario", hours: "Horas", leaves: "Permisos", penalties: "Sanciones",
    approve: "Aprobar", reject: "Rechazar", setSalary: "Establecer Salario Mensual", setJob: "Establecer Cargo",
    welcome: "Bienvenido de nuevo", newWorker: "¿Nuevo trabajador?", language: "Idioma"
  },
  zh: {
    title: "办公管理系统",
    login: "登录", register: "注册", logout: "注销", back: "返回登录",
    email: "电子邮件", password: "密码", name: "姓名", phone: "电话", dept: "部门",
    experience: "工作经验", quitReason: "离职原因", expertise: "专业领域",
    createAccount: "创建账户", joinTeam: "加入团队 — 请填写您的详细信息",
    pendingTitle: "申请审核中", pendingMsg: "我们已收到您的申请，人力资源团队正在进行审核。获得批准后我们将通知您。",
    enrollments: "入职申请", dashboard: "仪表板", workers: "员工", salary: "薪水", hours: "工时", leaves: "请假", penalties: "罚款",
    approve: "批准", reject: "拒绝", setSalary: "设置月薪", setJob: "设置职位",
    welcome: "欢迎回来", newWorker: "新员工？", language: "语言"
  },
  ru: {
    title: "Система управления офисом",
    login: "Вход", register: "Регистрация", logout: "Выход", back: "Назад ко входу",
    email: "Электронная почта", password: "Пароль", name: "Полное имя", phone: "Телефон", dept: "Отдел",
    experience: "Опыт работы", quitReason: "Причина ухода с прошлой работы", expertise: "Область знаний",
    createAccount: "Создать аккаунт", joinTeam: "Присоединяйтесь к команде — заполните данные",
    pendingTitle: "Заявка на рассмотрении", pendingMsg: "Ваша заявка получена и находится на рассмотрении у нашего HR-отдела. Мы сообщим вам об одобрении.",
    enrollments: "Заявки", dashboard: "Панель", workers: "Сотрудники", salary: "Зарплата", hours: "Часы", leaves: "Отпуска", penalties: "Штрафы",
    approve: "Одобрить", reject: "Отклонить", setSalary: "Установить зарплату", setJob: "Установить должность",
    welcome: "С возвращением", newWorker: "Новый сотрудник?", language: "Язык"
  },
  ro: {
    title: "Sistem de Management de Birou",
    login: "Autentificare", register: "Înregistrare", logout: "Deconectare", back: "Înapoi la autentificare",
    email: "Adresă de email", password: "Parolă", name: "Nume complet", phone: "Număr de telefon", dept: "Departament",
    experience: "Experiență de muncă", quitReason: "Motivul plecării de la ultimul loc de muncă", expertise: "Domeniu de expertiză",
    createAccount: "Creează cont", joinTeam: "Alătură-te echipei — completează detaliile",
    pendingTitle: "Cerere în curs de revizuire", pendingMsg: "Cererea dvs. a fost primită și este în curs de revizuire de către echipa noastră de HR. Vă vom notifica imediat ce sunteți aprobat.",
    enrollments: "Înscrieri", dashboard: "Panou control", workers: "Angajați", salary: "Salariu", hours: "Ore", leaves: "Concedii", penalties: "Penalizări",
    approve: "Aprobă", reject: "Respinge", setSalary: "Setează salariul lunar", setJob: "Setează titlul postului",
    welcome: "Bine ai revenit", newWorker: "Angajat nou?", language: "Limbă"
  }
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ─── RESPONSIVE ────────────────────────────────────────────────────────── */
  @media (max-width: 1024px) {
    .dashboard-layout { grid-template-columns: 1fr; }
    .sidebar { position: fixed; left: -280px; top: 0; bottom: 0; z-index: 1000; transition: left 0.3s ease; box-shadow: 20px 0 50px rgba(0,0,0,0.3); }
    .sidebar.open { left: 0; }
    .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 999; }
    .top-nav { padding: 12px 20px; }
    .mobile-menu-btn { display: flex !important; }
    .stats-grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
  }

  @media (max-width: 768px) {
    .login-container { flex-direction: column; overflow-y: auto; }
    .login-hero { height: 280px; padding: 40px 20px; border-radius: 0 0 40px 40px; }
    .hero-logo-wrap { display: none; }
    .hero-title { font-size: 2rem; }
    .login-form-side { padding: 40px 20px; }
    .panel-grid { grid-template-columns: 1fr !important; }
    .card-row { flex-direction: column; }
    .modal-content { width: 95%; margin: 10px; padding: 20px; }
    .form-row { grid-template-columns: 1fr; }
    .table-container { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .stat-card { padding: 20px; }
  }

  @media (max-width: 480px) {
    .hero-title { font-size: 1.6rem; }
    .top-nav h2 { font-size: 1.1rem; }
    .btn { padding: 10px 16px; font-size: 0.9rem; }
    .status-badge { padding: 4px 8px; font-size: 0.75rem; }
  }

  :root {
    --bg: #07080f;
    --surface: #0e1120;
    --surface2: #151829;
    --surface3: #1c2138;
    --border: #252a3d;
    --border2: #2e3450;
    --accent: #4f8ef7;
    --accent2: #7c6ff7;
    --accent3: #f75f8e;
    --gold: #f7c948;
    --green: #3dd68c;
    --red: #f75f5f;
    --orange: #f7954f;
    --text: #eef0f8;
    --text2: #8b92b5;
    --text3: #555e85;
    --glow: rgba(79,142,247,0.15);
    --glow2: rgba(124,111,247,0.12);
    --radius: 14px;
    --radius-sm: 8px;
    --transition: 0.25s cubic-bezier(0.4,0,0.2,1);
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
    --shadow-glow: 0 0 40px rgba(79,142,247,0.15);
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }

  .oms-root { min-height: 100vh; }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes slideIn { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
  @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(79,142,247,0.4); } 50% { box-shadow: 0 0 0 12px rgba(79,142,247,0); } }
  @keyframes shimmer { from { background-position: -200% center; } to { background-position: 200% center; } }
  @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
  @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
  @keyframes countUp { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
  @keyframes progressFill { from { width:0; } to { width:var(--w); } }

  .animate-fadeUp { animation: fadeUp 0.5s ease both; }
  .animate-fadeIn { animation: fadeIn 0.4s ease both; }
  .animate-slideIn { animation: slideIn 0.4s ease both; }
  .animate-float { animation: float 3s ease-in-out infinite; }
  .animate-spin { animation: spin 1s linear infinite; }

  /* ── LOGIN PAGE ── */
  .login-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
  }
  @media (max-width: 768px) { .login-page { grid-template-columns: 1fr; } .login-hero { display:none; } }

  .login-hero {
    background: linear-gradient(135deg, #0a0e1f 0%, #0e1530 50%, #0a1020 100%);
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: 60px; position: relative; overflow: hidden;
  }
  .login-hero::before {
    content:''; position:absolute; inset:0;
    background: radial-gradient(ellipse at 30% 50%, rgba(79,142,247,0.12) 0%, transparent 60%),
                radial-gradient(ellipse at 70% 20%, rgba(124,111,247,0.1) 0%, transparent 50%);
  }
  .login-hero-grid {
    position: absolute; inset: 0; opacity: 0.05;
    background-image: linear-gradient(var(--border) 1px, transparent 1px),
                      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .hero-logo-wrap {
    position: relative; z-index:1; text-align:center; animation: float 4s ease-in-out infinite;
  }
  .hero-logo-icon {
    width: 90px; height: 90px; border-radius: 24px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px; box-shadow: 0 0 60px rgba(79,142,247,0.4);
  }
  .hero-title { font-family: 'Syne', sans-serif; font-size: 2.8rem; font-weight: 800; line-height: 1.1; margin-bottom: 16px; }
  .hero-title span { background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .hero-subtitle { color: var(--text2); font-size: 1.05rem; line-height: 1.6; text-align:center; }
  .hero-stats {
    display: flex; gap: 32px; margin-top: 48px; position:relative; z-index:1;
  }
  .hero-stat { text-align:center; }
  .hero-stat-num { font-family:'Syne',sans-serif; font-size:1.8rem; font-weight:800; color:var(--accent); }
  .hero-stat-label { font-size:0.75rem; color:var(--text3); text-transform:uppercase; letter-spacing:0.1em; }

  .login-form-side {
    display: flex; flex-direction:column; justify-content:center; align-items:center;
    padding: 60px 40px; background: var(--bg);
  }
  .login-card {
    width: 100%; max-width: 420px; animation: fadeUp 0.6s ease both;
  }
  .login-badge {
    display: inline-flex; align-items:center; gap:8px; padding: 6px 14px;
    background: rgba(79,142,247,0.1); border: 1px solid rgba(79,142,247,0.2);
    border-radius: 100px; font-size: 0.78rem; color:var(--accent); margin-bottom:24px;
    letter-spacing: 0.05em; font-weight: 500;
  }
  .login-heading { font-family:'Syne',sans-serif; font-size:2.2rem; font-weight:800; margin-bottom:8px; }
  .login-sub { color:var(--text2); font-size:0.95rem; margin-bottom:36px; }

  /* ── FORM ELEMENTS ── */
  .form-group { margin-bottom: 20px; }
  .form-label { display:block; font-size:0.82rem; font-weight:500; color:var(--text2); margin-bottom:8px; letter-spacing:0.03em; text-transform:uppercase; }
  .form-input-wrap { position:relative; }
  .form-input {
    width:100%; padding: 14px 16px; background:var(--surface);
    border: 1px solid var(--border); border-radius:var(--radius-sm);
    color:var(--text); font-family:'DM Sans',sans-serif; font-size:0.95rem;
    outline:none; transition: border-color var(--transition), box-shadow var(--transition);
  }
  .form-input:focus { border-color:var(--accent); box-shadow: 0 0 0 3px rgba(79,142,247,0.12); }
  .form-input.has-icon { padding-right: 44px; }
  .input-icon { position:absolute; right:14px; top:50%; transform:translateY(-50%); color:var(--text3); cursor:pointer; transition:color var(--transition); }
  .input-icon:hover { color:var(--text2); }
  .form-hint { font-size:0.78rem; color:var(--text3); margin-top:6px; }

  /* ── BUTTONS ── */
  .btn {
    display:inline-flex; align-items:center; justify-content:center; gap:8px;
    padding: 13px 24px; border-radius:var(--radius-sm); font-family:'DM Sans',sans-serif;
    font-size:0.92rem; font-weight:600; cursor:pointer; border:none; outline:none;
    transition: all var(--transition); white-space:nowrap;
  }
  .btn-primary {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color:#fff; width:100%;
    box-shadow: 0 4px 20px rgba(79,142,247,0.3);
  }
  .btn-primary:hover { transform:translateY(-1px); box-shadow:0 8px 30px rgba(79,142,247,0.4); }
  .btn-primary:active { transform:translateY(0); }
  .btn-ghost { background:transparent; color:var(--text2); border:1px solid var(--border); }
  .btn-ghost:hover { background:var(--surface); color:var(--text); border-color:var(--border2); }
  .btn-danger { background:rgba(247,95,95,0.1); color:var(--red); border:1px solid rgba(247,95,95,0.2); }
  .btn-danger:hover { background:rgba(247,95,95,0.2); }
  .btn-success { background:rgba(61,214,140,0.1); color:var(--green); border:1px solid rgba(61,214,140,0.2); }
  .btn-success:hover { background:rgba(61,214,140,0.2); }
  .btn-sm { padding: 8px 14px; font-size:0.82rem; border-radius: 6px; }
  .btn-icon { padding: 10px; border-radius: 8px; }
  .btn:disabled { opacity:0.5; cursor:not-allowed; }

  /* ── OTP SCREEN ── */
  .otp-wrap { text-align:center; }
  .otp-icon-ring {
    width:80px; height:80px; border-radius:50%; margin:0 auto 24px;
    background:rgba(79,142,247,0.1); border: 2px solid rgba(79,142,247,0.3);
    display:flex; align-items:center; justify-content:center;
    animation: pulse 2s infinite;
  }
  .otp-inputs { display:flex; gap:10px; justify-content:center; margin:28px 0; }
  .otp-input {
    width:50px; height:58px; text-align:center; font-family:'Syne',sans-serif;
    font-size:1.5rem; font-weight:700; background:var(--surface);
    border: 2px solid var(--border); border-radius:var(--radius-sm);
    color:var(--text); outline:none; transition:all var(--transition);
  }
  .otp-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(79,142,247,0.15); }
  .otp-demo-box {
    background: linear-gradient(135deg, rgba(79,142,247,0.08), rgba(124,111,247,0.08));
    border:1px solid rgba(79,142,247,0.2); border-radius:var(--radius-sm);
    padding:14px 20px; margin-bottom:24px; font-size:0.88rem; color:var(--text2);
  }
  .otp-demo-code { font-family:'Syne',sans-serif; font-size:1.4rem; font-weight:800; color:var(--accent); display:block; margin-top:4px; }

  /* ── LAYOUT ── */
  .app-layout { display:flex; min-height:100vh; }

  .sidebar {
    width: 260px; min-height:100vh; background:var(--surface);
    border-right:1px solid var(--border); display:flex; flex-direction:column;
    position:fixed; left:0; top:0; bottom:0; z-index:100;
    transition:transform var(--transition);
  }
  .sidebar-logo {
    padding:24px 20px; border-bottom:1px solid var(--border);
    display:flex; align-items:center; gap:12px;
  }
  .sidebar-logo-icon {
    width:38px; height:38px; border-radius:10px;
    background:linear-gradient(135deg,var(--accent),var(--accent2));
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }
  .sidebar-logo-text { font-family:'Syne',sans-serif; font-size:1rem; font-weight:700; }
  .sidebar-logo-sub { font-size:0.7rem; color:var(--text3); }

  .sidebar-nav { flex:1; padding:16px 12px; overflow-y:auto; }
  .nav-section-label { font-size:0.68rem; font-weight:600; color:var(--text3); letter-spacing:0.12em; text-transform:uppercase; padding:8px 8px 4px; margin-top:8px; }
  .nav-item {
    display:flex; align-items:center; gap:12px; padding:11px 12px;
    border-radius:var(--radius-sm); cursor:pointer; font-size:0.88rem; font-weight:500;
    color:var(--text2); transition:all var(--transition); margin-bottom:2px;
  }
  .nav-item:hover { background:var(--surface2); color:var(--text); }
  .nav-item.active { background:rgba(79,142,247,0.12); color:var(--accent); border: 1px solid rgba(79,142,247,0.18); }
  .nav-item.active svg { color:var(--accent); }

  .sidebar-footer { padding:16px 12px; border-top:1px solid var(--border); }
  .sidebar-user {
    display:flex; align-items:center; gap:10px; padding:10px 12px;
    border-radius:var(--radius-sm); background:var(--surface2);
  }
  .avatar {
    width:36px; height:36px; border-radius:50%; display:flex;
    align-items:center; justify-content:center; font-family:'Syne',sans-serif;
    font-size:0.78rem; font-weight:700; flex-shrink:0;
  }
  .avatar-admin { background:linear-gradient(135deg,var(--accent),var(--accent2)); }
  .avatar-worker { background:linear-gradient(135deg,var(--green),#22c78b); }
  .avatar-lg { width:52px; height:52px; font-size:1.1rem; }
  .sidebar-user-info { flex:1; min-width:0; }
  .sidebar-user-name { font-size:0.85rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .sidebar-user-role {
    font-size:0.7rem; color:var(--text3); text-transform:capitalize;
    display:inline-flex; align-items:center; gap:4px;
  }
  .role-dot { width:6px; height:6px; border-radius:50%; background:var(--green); display:inline-block; }

  /* ── MAIN CONTENT ── */
  .main-content { margin-left:260px; flex:1; padding:32px; min-height:100vh; background:var(--bg); }

  .page-header { margin-bottom:28px; animation:fadeUp 0.4s ease both; }
  .page-title { font-family:'Syne',sans-serif; font-size:1.7rem; font-weight:800; margin-bottom:4px; }
  .page-subtitle { color:var(--text2); font-size:0.9rem; }

  /* ── STAT CARDS ── */
  .stat-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:16px; margin-bottom:28px; }
  .stat-card {
    background:var(--surface); border:1px solid var(--border); border-radius:var(--radius);
    padding:20px; position:relative; overflow:hidden; cursor:default;
    transition:all var(--transition); animation:fadeUp 0.4s ease both;
  }
  .stat-card:hover { border-color:var(--border2); transform:translateY(-2px); box-shadow:var(--shadow); }
  .stat-card::after {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
  }
  .stat-card.blue::after { background:linear-gradient(90deg,var(--accent),var(--accent2)); }
  .stat-card.green::after { background:linear-gradient(90deg,var(--green),#22c78b); }
  .stat-card.gold::after { background:linear-gradient(90deg,var(--gold),#f7a848); }
  .stat-card.red::after { background:linear-gradient(90deg,var(--red),var(--accent3)); }
  .stat-card.purple::after { background:linear-gradient(90deg,var(--accent2),#9b6ff7); }
  .stat-icon {
    width:42px; height:42px; border-radius:10px; display:flex; align-items:center; justify-content:center;
    margin-bottom:14px;
  }
  .stat-icon.blue { background:rgba(79,142,247,0.1); color:var(--accent); }
  .stat-icon.green { background:rgba(61,214,140,0.1); color:var(--green); }
  .stat-icon.gold { background:rgba(247,201,72,0.1); color:var(--gold); }
  .stat-icon.red { background:rgba(247,95,95,0.1); color:var(--red); }
  .stat-icon.purple { background:rgba(124,111,247,0.1); color:var(--accent2); }
  .stat-value { font-family:'Syne',sans-serif; font-size:1.7rem; font-weight:800; margin-bottom:4px; animation:countUp 0.6s ease both; }
  .stat-label { font-size:0.8rem; color:var(--text3); text-transform:uppercase; letter-spacing:0.07em; }
  .stat-trend { position:absolute; top:20px; right:16px; font-size:0.75rem; padding:3px 8px; border-radius:100px; }
  .stat-trend.up { background:rgba(61,214,140,0.1); color:var(--green); }
  .stat-trend.down { background:rgba(247,95,95,0.1); color:var(--red); }

  /* ── CARDS ── */
  .card {
    background:var(--surface); border:1px solid var(--border); border-radius:var(--radius);
    padding:24px; animation:fadeUp 0.5s ease both;
  }
  .card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
  .card-title { font-family:'Syne',sans-serif; font-size:1rem; font-weight:700; }
  .card-subtitle { font-size:0.8rem; color:var(--text3); margin-top:2px; }

  /* ── TABLES ── */
  .table-wrap { overflow-x:auto; border-radius:var(--radius); }
  table { width:100%; border-collapse:collapse; font-size:0.88rem; }
  th { padding:12px 16px; text-align:left; font-size:0.72rem; font-weight:600; color:var(--text3); text-transform:uppercase; letter-spacing:0.08em; background:var(--surface2); border-bottom:1px solid var(--border); white-space:nowrap; }
  td { padding:14px 16px; border-bottom:1px solid var(--border); color:var(--text2); vertical-align:middle; }
  tr:last-child td { border-bottom:none; }
  tr { transition:background var(--transition); }
  tr:hover td { background:var(--surface2); }

  /* ── BADGES ── */
  .badge { display:inline-flex; align-items:center; gap:4px; padding:4px 10px; border-radius:100px; font-size:0.75rem; font-weight:600; }
  .badge-admin { background:rgba(247,201,72,0.1); color:var(--gold); border:1px solid rgba(247,201,72,0.2); }
  .badge-worker { background:rgba(79,142,247,0.1); color:var(--accent); border:1px solid rgba(79,142,247,0.2); }
  .badge-approved { background:rgba(61,214,140,0.1); color:var(--green); }
  .badge-pending { background:rgba(247,149,79,0.1); color:var(--orange); }
  .badge-rejected { background:rgba(247,95,95,0.1); color:var(--red); }

  /* ── PROGRESS BAR ── */
  .progress-wrap { background:var(--surface2); border-radius:100px; height:6px; overflow:hidden; }
  .progress-bar { height:100%; border-radius:100px; background:linear-gradient(90deg,var(--accent),var(--accent2)); transition:width 1s ease; }

  /* ── MODAL ── */
  .modal-backdrop {
    position:fixed; inset:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(6px);
    z-index:1000; display:flex; align-items:center; justify-content:center;
    animation:fadeIn 0.2s ease;
  }
  .modal {
    background:var(--surface); border:1px solid var(--border2); border-radius:18px;
    padding:32px; width:100%; max-width:480px; max-height:90vh; overflow-y:auto;
    animation:fadeUp 0.3s ease;
    box-shadow: 0 24px 64px rgba(0,0,0,0.6);
  }
  .modal-title { font-family:'Syne',sans-serif; font-size:1.2rem; font-weight:700; margin-bottom:20px; }
  .modal-actions { display:flex; gap:12px; margin-top:24px; justify-content:flex-end; }

  /* ── TOAST ── */
  .toast {
    position:fixed; bottom:24px; right:24px; z-index:9999;
    background:var(--surface2); border:1px solid var(--border2);
    border-radius:12px; padding:14px 20px; display:flex; align-items:center; gap:12px;
    box-shadow:var(--shadow); animation:slideIn 0.3s ease;
    font-size:0.9rem; min-width:280px; max-width:400px;
  }
  .toast.success { border-left:3px solid var(--green); }
  .toast.error { border-left:3px solid var(--red); }
  .toast.info { border-left:3px solid var(--accent); }

  /* ── WORKER DASHBOARD SPECIAL ── */
  .worker-hero {
    background:linear-gradient(135deg,rgba(79,142,247,0.08),rgba(124,111,247,0.08));
    border:1px solid rgba(79,142,247,0.15); border-radius:18px;
    padding:28px; margin-bottom:24px; display:flex; align-items:center; gap:20px;
    animation:fadeUp 0.4s ease;
  }
  .worker-hero-info { flex:1; }
  .worker-hero-name { font-family:'Syne',sans-serif; font-size:1.5rem; font-weight:800; }
  .worker-hero-dept { color:var(--text2); font-size:0.9rem; margin-top:4px; }

  /* ── HOURS CHART ── */
  .hours-bars { display:flex; align-items:flex-end; gap:8px; height:80px; }
  .hour-bar-wrap { display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; }
  .hour-bar { width:100%; border-radius:4px 4px 0 0; background:linear-gradient(180deg,var(--accent),var(--accent2)); transition:height 0.8s ease; min-height:4px; }
  .hour-label { font-size:0.65rem; color:var(--text3); }

  /* ── LEAVE APPLY SECTION ── */
  .leave-type-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px; }
  .leave-type-btn {
    padding:12px; border-radius:var(--radius-sm); border:1px solid var(--border);
    background:var(--surface2); color:var(--text2); cursor:pointer; text-align:center;
    font-size:0.85rem; font-weight:500; transition:all var(--transition);
  }
  .leave-type-btn.selected { border-color:var(--accent); background:rgba(79,142,247,0.1); color:var(--accent); }
  .leave-type-btn:hover { border-color:var(--border2); color:var(--text); }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width:6px; height:6px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--border2); border-radius:100px; }
  ::-webkit-scrollbar-thumb:hover { background:var(--text3); }

  .divider { height:1px; background:var(--border); margin:20px 0; }
  .text-accent { color:var(--accent); }
  .text-green { color:var(--green); }
  .text-red { color:var(--red); }
  .text-gold { color:var(--gold); }
  .text-muted { color:var(--text2); }
  .text-sm { font-size:0.82rem; }
  .font-bold { font-weight:700; }
  .font-syne { font-family:'Syne',sans-serif; }
  .flex { display:flex; }
  .flex-col { flex-direction:column; }
  .items-center { align-items:center; }
  .justify-between { justify-content:space-between; }
  .gap-2 { gap:8px; }
  .gap-3 { gap:12px; }
  .gap-4 { gap:16px; }
  .mt-1 { margin-top:4px; }
  .mt-2 { margin-top:8px; }
  .mt-4 { margin-top:16px; }
  .mb-1 { margin-bottom:4px; }
  .mb-2 { margin-bottom:8px; }
  .mb-4 { margin-bottom:16px; }
  .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .col-span-2 { grid-column:span 2; }
  select.form-input { cursor:pointer; }
  .two-col { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
  @media (max-width:900px) { .two-col { grid-template-columns:1fr; } }
`;

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ message, type = "info", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const icons = { success: "check", error: "x", info: "shield" };
  const colors = { success: "var(--green)", error: "var(--red)", info: "var(--accent)" };
  return (
    <div className={`toast ${type}`}>
      <Icon name={icons[type]} size={18} color={colors[type]} />
      <span>{message}</span>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState(localStorage.getItem("oms_lang") || "en");
  const [screen, setScreen] = useState("login"); // login | otp | admin | worker | register | pending
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingLogin, setPendingLogin] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
  }, []);

  const refreshUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      if(res.ok) {
        const data = await res.json();
        setUsers(data);
        return data;
      }
    } catch (err) { console.error("Failed to load users", err); }
  };

  const t = (key) => TRANSLATIONS[lang][key] || key;

  const changeLanguage = (l) => {
    setLang(l);
    localStorage.setItem("oms_lang", l);
  };

  useEffect(() => { refreshUsers(); }, []);

  const handleLoginSubmit = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || "Login failed", "error"); return; }
      
      setPendingLogin(data.user);
      setScreen("otp");
      showToast(`OTP sent to your email!`, "info");
    } catch (err) {
      showToast("Server error. Is it running?", "error");
    }
  };

  const handleOTPVerify = async (code) => {
    try {
      const res = await fetch(`${API_URL}/auth/verify`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingLogin.email, code })
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || "Invalid OTP", "error"); return; }

      setCurrentUser(pendingLogin);
      setActiveTab("dashboard");
      
      if (pendingLogin.status === 'PENDING') {
        setScreen("pending");
      } else {
        setScreen(pendingLogin.role === "admin" ? "admin" : "worker");
      }
      
      showToast(`${t('welcome')}, ${pendingLogin.name}!`, "success");
    } catch (err) {
      showToast("Verification failed", "error");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPendingLogin(null);
    setScreen("login");
    showToast("Logged out successfully", "info");
  };

  const updateUsers = (newUsers) => { saveUsers(newUsers); setUsers(newUsers); };

  return (
    <div className="oms-root">
      <style>{styles}</style>
      {screen === "login" && <LoginPage onLogin={handleLoginSubmit} onRegister={() => setScreen("register")} showToast={showToast} t={t} lang={lang} setLang={changeLanguage} />}
      {screen === "register" && <RegisterPage onBack={() => setScreen("login")} onRegistered={async (user) => { await refreshUsers(); setPendingLogin(user); setScreen("otp"); showToast(`Account created! OTP sent to your email.`, "success"); }} showToast={showToast} t={t} lang={lang} />}
      {screen === "otp" && <OTPPage user={pendingLogin} onVerify={handleOTPVerify} onBack={() => setScreen("login")} showToast={showToast} t={t} />}
      {screen === "pending" && <PendingPage user={currentUser} onLogout={handleLogout} t={t} />}
      {screen === "admin" && <AdminDashboard user={currentUser} users={users} updateUsers={updateUsers} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} showToast={showToast} t={t} lang={lang} setLang={changeLanguage} refreshUsers={refreshUsers} />}
      {screen === "worker" && <WorkerDashboard user={currentUser} users={users} updateUsers={updateUsers} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} showToast={showToast} t={t} lang={lang} setLang={changeLanguage} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin, onRegister, showToast, t, lang, setLang }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!email || !password) { showToast("Please fill all fields", "error"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(email, password); }, 800);
  };

  return (
    <div className="login-page">
      <div className="login-hero">
        <div className="login-hero-grid" />
        <div className="hero-logo-wrap">
          <div className="hero-logo-icon">
            <Icon name="building" size={42} color="#fff" />
          </div>
          <h1 className="hero-title">{t('title')}</h1>
          <p className="hero-subtitle">Enterprise-grade workforce management platform built for modern organizations.</p>
          <div style={{fontSize: "0.82rem", color: "var(--text3)", marginTop: 12, letterSpacing: "0.02em", opacity: 0.8}}>Developed by <span style={{color: "var(--accent)", fontWeight: 600}}>Shiven Gupta</span></div>
        </div>
      </div>
      <div className="login-form-side">
        <div style={{position:"absolute", top:20, right:20}}>
           <LanguageSelector current={lang} onSelect={setLang} t={t} />
        </div>
        <div className="login-card">
          <div className="login-badge"><Icon name="shield" size={12} />&nbsp;SECURE ACCESS PORTAL</div>
          <h2 className="login-heading">{t('welcome')}</h2>
          <p className="login-sub">Sign in to your account to continue</p>

          <div className="form-group">
            <label className="form-label">{t('email')}</label>
            <div className="form-input-wrap">
              <input className="form-input has-icon" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
              <span className="input-icon"><Icon name="mail" size={16} /></span>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('password')}</label>
            <div className="form-input-wrap">
              <input className="form-input has-icon" type={showPass ? "text" : "password"} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
              <span className="input-icon" onClick={() => setShowPass(!showPass)}>
                <Icon name={showPass ? "eyeoff" : "eye"} size={16} />
              </span>
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <><span className="animate-spin" style={{display:"inline-block",width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%"}}></span> Verifying...</> : <><Icon name="shield" size={16} /> {t('login')} with 2FA</>}
          </button>

          <div className="divider" />
          <div style={{textAlign:"center"}}>
            <span className="text-muted text-sm">{t('newWorker')} </span>
            <button className="btn btn-ghost btn-sm" style={{display:"inline-flex",marginLeft:8}} onClick={onRegister}>{t('createAccount')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LanguageSelector({ current, onSelect, t }) {
  const langs = [
    { id: 'en', label: 'English', flag: '🇺🇸' },
    { id: 'hi', label: 'Hindi', flag: '🇮🇳' },
    { id: 'ro', label: 'Romanian', flag: '🇷🇴' },
    { id: 'zh', label: 'Chinese', flag: '🇨🇳' },
    { id: 'es', label: 'Spanish', flag: '🇪🇸' },
    { id: 'ru', label: 'Russian', flag: '🇷🇺' }
  ];
  return (
    <div className="flex items-center gap-2" style={{background:'var(--surface2)', padding:'4px 12px', borderRadius:100, border:'1px solid var(--border)'}}>
      <Icon name="shield" size={14} color="var(--accent)" />
      <select 
        value={current} 
        onChange={(e) => onSelect(e.target.value)}
        style={{background:'transparent', border:'none', color:'var(--text)', fontSize:'0.8rem', fontWeight:600, outline:'none', cursor:'pointer'}}
      >
        {langs.map(l => <option key={l.id} value={l.id} style={{background:'var(--surface)'}}>{l.flag} {l.label}</option>)}
      </select>
    </div>
  );
}

// ─── REGISTER PAGE ────────────────────────────────────────────────────────────
function RegisterPage({ onBack, onRegistered, showToast, t, lang }) {
  const [form, setForm] = useState({ name:"", email:"", password:"", phone:"", department:"Engineering", experience:"", quit_reason:"", expertise:"", lang: lang || "en" });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({...f,[k]:v}));
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");

  const handleRegister = async () => {
    const fullPhone = countryCode + phone;
    if (!form.name || !form.email || !form.password || !phone || !form.experience || !form.expertise) { 
      showToast("Please fill all required fields", "error"); 
      return; 
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, phone: fullPhone })
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) { showToast(data.error || "Registration failed", "error"); return; }
      onRegistered(data.user);
    } catch (err) {
      setLoading(false);
      showToast("Server connection error", "error");
    }
  };

  const countries = [
    { code: "+91", label: "🇮🇳 +91" },
    { code: "+1", label: "🇺🇸 +1" },
    { code: "+44", label: "🇬🇧 +44" },
    { code: "+40", label: "🇷🇴 +40" },
    { code: "+86", label: "🇨🇳 +86" },
    { code: "+7", label: "🇷🇺 +7" },
    { code: "+34", label: "🇪🇸 +34" },
  ];

  return (
    <div className="login-page" style={{gridTemplateColumns:"1fr"}}>
      <div className="login-form-side" style={{padding:"40px"}}>
        <div className="login-card" style={{maxWidth:600}}>
          <button className="btn btn-ghost btn-sm" style={{marginBottom:20}} onClick={onBack}>← {t('back')}</button>
          <div className="login-badge"><Icon name="plus" size={12} />&nbsp;{t('register').toUpperCase()}</div>
          <h2 className="login-heading">{t('createAccount')}</h2>
          <p className="login-sub">{t('joinTeam')}</p>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">{t('name')}</label><input className="form-input" placeholder="John Doe" value={form.name} onChange={e=>set("name",e.target.value)} /></div>
            <div className="form-group"><label className="form-label">{t('dept')}</label>
              <select className="form-input" value={form.department} onChange={e=>set("department",e.target.value)}>
                {["Engineering","Design","Marketing","Sales","HR","Finance","Operations"].map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">{t('email')}</label><input className="form-input" type="email" placeholder="you@company.com" value={form.email} onChange={e=>set("email",e.target.value)} /></div>
            
            <div className="form-group">
              <label className="form-label">{t('phone')}</label>
              <div style={{display:"flex", gap:8}}>
                <select className="form-input" style={{width:100, padding:'0 8px'}} value={countryCode} onChange={e=>setCountryCode(e.target.value)}>
                  {countries.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                </select>
                <input className="form-input" style={{flex:1}} placeholder="9876543210" value={phone} onChange={e=>setPhone(e.target.value)} />
              </div>
            </div>
            
            <div className="form-group col-span-2"><label className="form-label">{t('experience')}</label><textarea className="form-input" style={{height:80, resize:'none'}} placeholder="Describe your work experience..." value={form.experience} onChange={e=>set("experience",e.target.value)} /></div>
            <div className="form-group col-span-2"><label className="form-label">{t('expertise')}</label><input className="form-input" placeholder="e.g. React, Node.js, System Architecture" value={form.expertise} onChange={e=>set("expertise",e.target.value)} /></div>
            <div className="form-group col-span-2"><label className="form-label">{t('quitReason')}</label><input className="form-input" placeholder="Why did you leave your last role?" value={form.quit_reason} onChange={e=>set("quit_reason",e.target.value)} /></div>
            
            <div className="form-group col-span-2"><label className="form-label">{t('password')}</label><input className="form-input" type="password" placeholder="Secure password" value={form.password} onChange={e=>set("password",e.target.value)} /></div>
          </div>
          <button className="btn btn-primary" onClick={handleRegister} disabled={loading} style={{marginTop:20}}>
            {loading ? "Creating Account..." : <><Icon name="plus" size={16}/> {t('register')}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function PendingPage({ user, onLogout, t }) {
  return (
    <div style={{minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--bg)", padding:24}}>
      <div className="login-card" style={{maxWidth:500, textAlign:'center'}}>
        <div className="animate-float" style={{marginBottom:24}}>
          <Icon name="shield" size={64} color="var(--accent)" />
        </div>
        <h2 className="login-heading">{t('pendingTitle')}</h2>
        <p className="text-muted" style={{lineHeight:1.6, marginBottom:32}}>
          {t('pendingMsg')}
        </p>
        <div style={{background:'var(--surface2)', padding:16, borderRadius:12, marginBottom:32, textAlign:'left'}}>
          <div className="text-sm text-muted mb-1">{t('name')}</div>
          <div className="font-bold mb-2">{user?.name}</div>
          <div className="text-sm text-muted mb-1">{t('email')}</div>
          <div className="font-bold">{user?.email}</div>
        </div>
        <button className="btn btn-ghost" onClick={onLogout}>
          <Icon name="logout" size={16} /> {t('logout')}
        </button>
      </div>
    </div>
  );
}

// ─── OTP PAGE ─────────────────────────────────────────────────────────────────
function OTPPage({ user, onVerify, onBack, showToast }) {
  const [digits, setDigits] = useState(["","","","","",""]);

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const newDigits = [...digits];
    newDigits[i] = val.slice(-1);
    setDigits(newDigits);
    if (val && i < 5) document.getElementById(`otp-${i+1}`)?.focus();
    if (newDigits.every(d => d !== "")) {
      setTimeout(() => onVerify(newDigits.join("")), 200);
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) document.getElementById(`otp-${i-1}`)?.focus();
  };

  const handleResend = async () => {
    try {
      await fetch(`${API_URL}/auth/resend`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email: user.email })
      });
      showToast(`New OTP sent to your email!`, "info");
    } catch (err) {
      showToast("Failed to resend OTP", "error");
    }
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)",padding:24}}>
      <div className="login-card otp-wrap">
        <div className="otp-icon-ring"><Icon name="shield" size={36} color="var(--accent)" /></div>
        <h2 className="login-heading" style={{textAlign:"center"}}>Two-Factor Verification</h2>
        <p className="text-muted text-sm" style={{textAlign:"center",marginBottom:20}}>
          Enter the 6-digit OTP sent to <strong className="text-accent">{user?.email}</strong>
        </p>
        <div className="otp-inputs">
          {digits.map((d, i) => (
            <input key={i} id={`otp-${i}`} className="otp-input" maxLength={1} value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)} autoFocus={i === 0} />
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => onVerify(digits.join(""))}>
          <Icon name="check" size={16} /> Verify & Login
        </button>
        <div style={{textAlign:"center",marginTop:16,display:"flex",gap:12,justifyContent:"center"}}>
          <button className="btn btn-ghost btn-sm" onClick={onBack}>← Back</button>
          <button className="btn btn-ghost btn-sm" onClick={handleResend}>Resend OTP</button>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ user, items, activeTab, setActiveTab, onLogout, t, lang, setLang }) {
  return (
    <div className="sidebar animate-slideIn">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon"><Icon name="building" size={20} color="#fff" /></div>
        <div>
          <div className="sidebar-logo-text">OfficeMS</div>
          <div className="sidebar-logo-sub">{t('title')}</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {items.map((item, idx) => (
          item.section
            ? <div key={idx} className="nav-section-label">{item.section}</div>
            : <div key={idx} className={`nav-item ${activeTab === item.id ? "active" : ""}`} onClick={() => setActiveTab(item.id)}>
                <Icon name={item.icon} size={18} />
                {t(item.id) || item.label}
                {item.id === "enrollments" && <EnrollmentBadge users={item.users} />}
              </div>
        ))}
        <div className="divider" style={{margin:'16px 8px'}} />
        <div style={{padding:'0 12px'}}>
          <LanguageSelector current={lang} onSelect={setLang} t={t} />
        </div>
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className={`avatar ${user.role === "admin" ? "avatar-admin" : "avatar-worker"}`}>{user.avatar}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-role">
              <span className="role-dot" />
              {user.role === "admin" ? "Administrator" : "Worker"}
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onLogout} title="Logout">
            <Icon name="logout" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function EnrollmentBadge({ users }) {
  const pending = users?.filter(u => u.status === 'PENDING').length || 0;
  if (!pending) return null;
  return (
    <span style={{marginLeft:'auto', background:'var(--accent)', color:'#fff', fontSize:'0.65rem', padding:'2px 6px', borderRadius:100, fontWeight:800}}>
      {pending}
    </span>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard({ user, users, updateUsers, activeTab, setActiveTab, onLogout, showToast, t, lang, setLang, refreshUsers }) {
  const workers = users.filter(u => u.role === "worker");
  const admins = users.filter(u => u.role === "admin");
  const enrollments = users.filter(u => u.status === "PENDING");
  const pendingLeaves = workers.flatMap(w => (w.leaves||[]).filter(l => l.status === "pending").map(l => ({...l, worker: w})));
  const totalPenalties = workers.reduce((s, w) => s + (w.penalties||[]).reduce((a,p) => a+p.amount, 0), 0);

  const navItems = [
    { section: "OVERVIEW" },
    { id: "dashboard", icon: "dashboard", label: "Dashboard" },
    { section: "MANAGEMENT" },
    { id: "enrollments", icon: "shield", label: "Enrollments", users },
    { id: "workers", icon: "users", label: "Workers" },
    { id: "salary", icon: "salary", label: "Salary & Packages" },
    { id: "hours", icon: "clock", label: "Working Hours" },
    { id: "leaves", icon: "calendar", label: "Leave Management" },
    { id: "penalties", icon: "warning", label: "Penalties" },
    { section: "SYSTEM" },
    { id: "admins", icon: "crown", label: "Admin Roles" },
  ];

  return (
    <div className="app-layout">
      <Sidebar user={user} items={navItems} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} t={t} lang={lang} setLang={setLang} />
      <main className="main-content">
        {activeTab === "dashboard" && <AdminHome workers={workers} admins={admins} pendingLeaves={pendingLeaves} totalPenalties={totalPenalties} setActiveTab={setActiveTab} t={t} enrollments={enrollments} />}
        {activeTab === "enrollments" && <EnrollmentsPanel enrollments={enrollments} showToast={showToast} refresh={refreshUsers} t={t} />}
        {activeTab === "workers" && <WorkersPanel workers={workers.filter(w=>w.status==='APPROVED')} users={users} updateUsers={updateUsers} showToast={showToast} t={t} refresh={refreshUsers} />}
        {activeTab === "salary" && <SalaryPanel workers={workers.filter(w=>w.status==='APPROVED')} users={users} updateUsers={updateUsers} showToast={showToast} t={t} />}
        {activeTab === "hours" && <HoursPanel workers={workers.filter(w=>w.status==='APPROVED')} users={users} updateUsers={updateUsers} showToast={showToast} t={t} />}
        {activeTab === "leaves" && <LeavesPanel workers={workers.filter(w=>w.status==='APPROVED')} users={users} updateUsers={updateUsers} showToast={showToast} t={t} />}
        {activeTab === "penalties" && <PenaltiesPanel workers={workers.filter(w=>w.status==='APPROVED')} users={users} updateUsers={updateUsers} showToast={showToast} t={t} refresh={refreshUsers} />}
        {activeTab === "admins" && <AdminsPanel workers={workers} admins={admins} users={users} updateUsers={updateUsers} showToast={showToast} t={t} />}
      </main>
    </div>
  );
}

function AdminHome({ workers, admins, pendingLeaves, totalPenalties, setActiveTab, t, enrollments }) {
  const totalSalary = workers.reduce((s,w) => s+w.salary, 0);
  return (
    <div>
      <div className="page-header">
        <div className="page-title">{t('dashboard')}</div>
        <div className="page-subtitle">Complete workforce overview & management center</div>
      </div>
      <div className="stat-grid">
        <StatCard color="blue" icon="users" value={workers.length} label={t('workers')} trend="+2 this month" trendType="up" delay={0} />
        <StatCard color="gold" icon="salary" value={`₹${(totalSalary/1000).toFixed(0)}K`} label={t('salary')} trend="Total" trendType="up" delay={1} />
        <StatCard color="orange" icon="shield" value={enrollments.length} label={t('enrollments')} trend="Needs review" trendType="down" delay={2} onClick={()=>setActiveTab("enrollments")} />
        <StatCard color="red" icon="warning" value={`₹${(totalPenalties/1000).toFixed(1)}K`} label={t('penalties')} trend="This month" trendType="down" delay={3} />
        <StatCard color="purple" icon="crown" value={admins.length} label="Administrators" delay={4} />
      </div>
      <div className="two-col" style={{marginTop:0}}>
        <div className="card">
          <div className="card-header"><div><div className="card-title">Pending Leave Requests</div><div className="card-subtitle">{pendingLeaves.length} awaiting approval</div></div>
            <button className="btn btn-ghost btn-sm" onClick={()=>setActiveTab("leaves")}>View All</button>
          </div>
          {pendingLeaves.length === 0 ? <div className="text-muted text-sm" style={{padding:"20px 0",textAlign:"center"}}>No pending leaves 🎉</div> :
            pendingLeaves.slice(0,4).map(l => (
              <div key={l.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                <div className={`avatar avatar-worker`} style={{fontSize:"0.7rem"}}>{l.worker.avatar}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:"0.88rem",fontWeight:600}}>{l.worker.name}</div>
                  <div className="text-muted text-sm">{l.type} · {l.from} → {l.to}</div>
                </div>
                <span className="badge badge-pending">Pending</span>
              </div>
            ))}
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Team Departments</div></div>
          {["Engineering","Design","Marketing","Sales","HR","Finance","Operations"].map(dept => {
            const count = workers.filter(w=>w.department===dept).length;
            const pct = workers.length ? Math.round(count/workers.length*100) : 0;
            if (count === 0) return null;
            return (
              <div key={dept} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:"0.85rem"}}>{dept}</span>
                  <span className="text-muted text-sm">{count} workers</span>
                </div>
                <div className="progress-wrap"><div className="progress-bar" style={{width:`${pct}%`}} /></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EnrollmentsPanel({ enrollments, showToast, refresh, t }) {
  const [selected, setSelected] = useState(null);

  const handleApprove = async (id, salary, job) => {
    try {
      const res = await fetch(`${API_URL}/admin/approve-user`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id, salary, package: job })
      });
      if (res.ok) {
        showToast("User approved successfully!", "success");
        await refresh();
        setSelected(null);
      }
    } catch (err) { showToast("Approval failed", "error"); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">{t('enrollments')}</div>
        <div className="page-subtitle">Review and approve new worker applications</div>
      </div>
      <div className="grid-2" style={{gridTemplateColumns:'repeat(auto-fill, minmax(350px, 1fr))'}}>
        {enrollments.length === 0 ? <div className="card col-span-2 text-muted" style={{textAlign:'center', padding:60}}>No pending enrollments</div> :
          enrollments.map(e => (
            <div key={e.id} className="card animate-fadeUp">
              <div className="flex items-center gap-3 mb-4">
                <div className="avatar avatar-worker avatar-lg">{e.avatar}</div>
                <div>
                  <div className="font-bold" style={{fontSize:'1.1rem'}}>{e.name}</div>
                  <div className="text-muted text-sm">{e.email}</div>
                  <div className="text-accent text-sm font-bold mt-1">{e.department}</div>
                </div>
              </div>
              <div className="divider" style={{margin:'12px 0'}} />
              <div className="mb-4">
                <div className="text-xs text-muted uppercase font-bold mb-1">{t('experience')}</div>
                <div className="text-sm" style={{lineHeight:1.5}}>{e.experience}</div>
              </div>
              <div className="mb-4">
                <div className="text-xs text-muted uppercase font-bold mb-1">{t('expertise')}</div>
                <div className="text-sm">{e.expertise}</div>
              </div>
              <div className="mb-4">
                <div className="text-xs text-muted uppercase font-bold mb-1">{t('quitReason')}</div>
                <div className="text-sm italic">"{e.quit_reason}"</div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-primary" style={{flex:1}} onClick={() => setSelected(e)}>
                   {t('approve')}
                </button>
                <button className="btn btn-ghost" style={{flex:1}} onClick={() => showToast("Application rejected", "info")}>
                   {t('reject')}
                </button>
              </div>
            </div>
          ))
        }
      </div>
      {selected && <ApproveModal user={selected} onApprove={handleApprove} onClose={() => setSelected(null)} t={t} />}
    </div>
  );
}

function ApproveModal({ user, onApprove, onClose, t }) {
  const [salary, setSalary] = useState(45000);
  const [job, setJob] = useState("Junior Engineer");
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">{t('approve')} — {user.name}</div>
        <div className="form-group">
          <label className="form-label">{t('setSalary')} (₹)</label>
          <input className="form-input" type="number" value={salary} onChange={e => setSalary(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">{t('setJob')}</label>
          <input className="form-input" placeholder="e.g. Senior Developer" value={job} onChange={e => setJob(e.target.value)} />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{width:'auto'}} onClick={() => onApprove(user.id, salary, job)}>
            Confirm Approval
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ color, icon, value, label, trend, trendType, delay = 0, onClick }) {
  return (
    <div className={`stat-card ${color}`} style={{animationDelay:`${delay*0.08}s`, cursor: onClick ? 'pointer' : 'default'}} onClick={onClick}>
      <div className={`stat-icon ${color}`}><Icon name={icon} size={20} /></div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {trend && <span className={`stat-trend ${trendType}`}>{trend}</span>}
    </div>
  );
}

// ─── WORKERS PANEL ────────────────────────────────────────────────────────────
function WorkersPanel({ workers, users, updateUsers, showToast, refresh }) {
  const [editWorker, setEditWorker] = useState(null);
  const [search, setSearch] = useState("");
  const filtered = workers.filter(w => w.name.toLowerCase().includes(search.toLowerCase()) || w.email.toLowerCase().includes(search.toLowerCase()));

  const handleSave = (updated) => {
    const newUsers = users.map(u => u.id === updated.id ? {...u,...updated} : u);
    updateUsers(newUsers);
    setEditWorker(null);
    showToast("Worker updated successfully", "success");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this worker?")) return;
    try {
      const res = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast("Worker removed", "info");
        await refresh();
      } else {
        showToast("Delete failed", "error");
      }
    } catch (err) { showToast("Server error", "error"); }
  };

  return (
    <div>
      <div className="page-header" style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div><div className="page-title">Workers</div><div className="page-subtitle">Manage all registered workers</div></div>
      </div>
      <div className="card">
        <div className="card-header">
          <input className="form-input" style={{maxWidth:280}} placeholder="Search workers..." value={search} onChange={e=>setSearch(e.target.value)} />
          <span className="badge badge-worker">{filtered.length} workers</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Worker</th><th>Department</th><th>Package</th><th>Salary</th><th>Joined</th><th>Role</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(w => (
                <tr key={w.id}>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div className="avatar avatar-worker" style={{width:32,height:32,fontSize:"0.7rem"}}>{w.avatar}</div>
                      <div>
                        <div style={{fontWeight:600,color:"var(--text)"}}>{w.name}</div>
                        <div className="text-sm text-muted">{w.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{w.department}</td>
                  <td><span className="badge badge-worker">{w.package}</span></td>
                  <td style={{fontWeight:600,color:"var(--green)"}}>₹{w.salary?.toLocaleString()}</td>
                  <td>{w.joiningDate}</td>
                  <td><span className={`badge ${w.role==="admin"?"badge-admin":"badge-worker"}`}>{w.role}</span></td>
                  <td>
                    <div style={{display:"flex",gap:6}}>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={()=>setEditWorker({...w})} title="Edit"><Icon name="edit" size={14} /></button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={()=>handleDelete(w.id)} title="Remove"><Icon name="trash" size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editWorker && <EditWorkerModal worker={editWorker} onSave={handleSave} onClose={()=>setEditWorker(null)} />}
    </div>
  );
}

function EditWorkerModal({ worker, onSave, onClose }) {
  const [form, setForm] = useState({...worker});
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">Edit Worker — {worker.name}</div>
        <div className="grid-2">
          <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e=>set("name",e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Department</label>
            <select className="form-input" value={form.department} onChange={e=>set("department",e.target.value)}>
              {["Engineering","Design","Marketing","Sales","HR","Finance","Operations"].map(d=><option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Package</label>
            <select className="form-input" value={form.package} onChange={e=>set("package",e.target.value)}>
              {["Junior","Mid","Senior","Lead","Executive"].map(p=><option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Monthly Salary (₹)</label><input className="form-input" type="number" value={form.salary} onChange={e=>set("salary",+e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone||""} onChange={e=>set("phone",e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Joining Date</label><input className="form-input" type="date" value={form.joiningDate} onChange={e=>set("joiningDate",e.target.value)} /></div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{width:"auto"}} onClick={()=>onSave(form)}><Icon name="check" size={16}/>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

// ─── SALARY PANEL ─────────────────────────────────────────────────────────────
function SalaryPanel({ workers, users, updateUsers, showToast }) {
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [bonus, setBonus] = useState(0);
  const [editSalary, setEditSalary] = useState(null);

  const getSalaryBreakdown = (w) => {
    const penalties = (w.penalties||[]).reduce((a,p)=>a+p.amount,0);
    return { base: w.salary, bonus: w.bonus||0, penalties, net: w.salary + (w.bonus||0) - penalties };
  };

  const handleUpdateBonus = () => {
    const newUsers = users.map(u => u.id === selectedWorker.id ? {...u, bonus: +bonus} : u);
    updateUsers(newUsers);
    showToast("Bonus updated", "success");
    setSelectedWorker(null);
  };

  return (
    <div>
      <div className="page-header"><div className="page-title">Salary & Packages</div><div className="page-subtitle">Monthly payroll management with bonuses and deductions</div></div>
      <div className="card">
        <div className="card-header"><div className="card-title">Monthly Salary Overview</div><div className="text-sm text-muted">April 2025</div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Worker</th><th>Package</th><th>Base Salary</th><th>Bonus</th><th>Penalties</th><th>Net Salary</th><th>Actions</th></tr></thead>
            <tbody>
              {workers.map(w => {
                const bd = getSalaryBreakdown(w);
                return (
                  <tr key={w.id}>
                    <td><div style={{fontWeight:600,color:"var(--text)"}}>{w.name}</div><div className="text-sm text-muted">{w.department}</div></td>
                    <td><span className="badge badge-worker">{w.package}</span></td>
                    <td>₹{bd.base.toLocaleString()}</td>
                    <td style={{color:"var(--green)"}}>+₹{bd.bonus.toLocaleString()}</td>
                    <td style={{color:"var(--red)"}}>-₹{bd.penalties.toLocaleString()}</td>
                    <td style={{fontWeight:700,color:"var(--accent)",fontSize:"1rem"}}>₹{bd.net.toLocaleString()}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={()=>{setSelectedWorker(w);setBonus(w.bonus||0);}}>
                        <Icon name="edit" size={13}/>Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {selectedWorker && (
        <div className="modal-backdrop" onClick={()=>setSelectedWorker(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">Salary Details — {selectedWorker.name}</div>
            <div style={{background:"var(--surface2)",borderRadius:10,padding:16,marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span className="text-muted">Base Salary</span><span style={{fontWeight:600}}>₹{selectedWorker.salary.toLocaleString()}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span className="text-muted">Current Bonus</span><span style={{fontWeight:600,color:"var(--green)"}}>₹{(selectedWorker.bonus||0).toLocaleString()}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span className="text-muted">Penalties</span><span style={{fontWeight:600,color:"var(--red)"}}>₹{(selectedWorker.penalties||[]).reduce((a,p)=>a+p.amount,0).toLocaleString()}</span></div>
              <div className="divider" /><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700}}>Net Salary</span><span style={{fontWeight:800,color:"var(--accent)",fontSize:"1.1rem"}}>₹{(selectedWorker.salary+(selectedWorker.bonus||0)-(selectedWorker.penalties||[]).reduce((a,p)=>a+p.amount,0)).toLocaleString()}</span></div>
            </div>
            <div className="form-group"><label className="form-label">Set Bonus (₹)</label><input className="form-input" type="number" value={bonus} onChange={e=>setBonus(e.target.value)} /></div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={()=>setSelectedWorker(null)}>Cancel</button>
              <button className="btn btn-primary" style={{width:"auto"}} onClick={handleUpdateBonus}><Icon name="check" size={16}/>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HOURS PANEL ──────────────────────────────────────────────────────────────
function HoursPanel({ workers, users, updateUsers, showToast }) {
  const [selected, setSelected] = useState(workers[0]?.id || "");
  const [addForm, setAddForm] = useState({ date: "", hours: "" });

  const worker = workers.find(w=>w.id===selected);
  const hours = worker?.workingHours || [];
  const totalHours = hours.reduce((s,h)=>s+h.hours,0);
  const avgHours = hours.length ? (totalHours/hours.length).toFixed(1) : 0;

  const handleAddHours = () => {
    if (!addForm.date || !addForm.hours) { showToast("Fill both fields", "error"); return; }
    const newUsers = users.map(u => u.id===selected ? {...u, workingHours:[...(u.workingHours||[]),{date:addForm.date,hours:+addForm.hours}]} : u);
    updateUsers(newUsers);
    setAddForm({date:"",hours:""});
    showToast("Hours logged", "success");
  };

  return (
    <div>
      <div className="page-header"><div className="page-title">Working Hours</div><div className="page-subtitle">Track and manage employee working hours</div></div>
      <div style={{marginBottom:20}}>
        <select className="form-input" style={{maxWidth:280}} value={selected} onChange={e=>setSelected(e.target.value)}>
          {workers.map(w=><option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
      </div>
      {worker && (
        <>
          <div className="stat-grid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
            <StatCard color="blue" icon="clock" value={`${totalHours}h`} label="Total Hours" delay={0} />
            <StatCard color="green" icon="clock" value={`${avgHours}h`} label="Daily Average" delay={1} />
            <StatCard color="gold" icon="clock" value={hours.length} label="Days Logged" delay={2} />
          </div>
          <div className="two-col">
            <div className="card">
              <div className="card-header"><div className="card-title">Hours Chart</div><div className="text-sm text-muted">Last {Math.min(hours.length,7)} days</div></div>
              <div className="hours-bars" style={{height:100}}>
                {hours.slice(-7).map((h,i) => (
                  <div key={i} className="hour-bar-wrap">
                    <div className="hour-bar" style={{height:`${(h.hours/12)*100}%`}} />
                    <div className="hour-label">{h.date.slice(8)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-header"><div className="card-title">Add Hours</div></div>
              <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={addForm.date} onChange={e=>setAddForm(f=>({...f,date:e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Hours Worked</label><input className="form-input" type="number" min="0" max="24" step="0.5" value={addForm.hours} onChange={e=>setAddForm(f=>({...f,hours:e.target.value}))} /></div>
              <button className="btn btn-primary" onClick={handleAddHours}><Icon name="plus" size={16}/>Log Hours</button>
            </div>
          </div>
          <div className="card" style={{marginTop:24}}>
            <div className="card-header"><div className="card-title">Hours Log</div></div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Date</th><th>Hours</th><th>Status</th></tr></thead>
                <tbody>
                  {[...hours].reverse().map((h,i) => (
                    <tr key={i}>
                      <td>{h.date}</td>
                      <td style={{fontWeight:600}}>{h.hours}h</td>
                      <td><span className={`badge ${h.hours>=8?"badge-approved":"badge-pending"}`}>{h.hours>=8?"Full Day":"Partial"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── LEAVES PANEL ─────────────────────────────────────────────────────────────
function LeavesPanel({ workers, users, updateUsers, showToast }) {
  const allLeaves = workers.flatMap(w => (w.leaves||[]).map(l=>({...l,worker:w})));
  const pending = allLeaves.filter(l=>l.status==="pending");
  const handled = allLeaves.filter(l=>l.status!=="pending");

  const handleAction = (workerId, leaveId, status) => {
    const newUsers = users.map(u => u.id===workerId
      ? {...u, leaves: (u.leaves||[]).map(l => l.id===leaveId ? {...l,status} : l)}
      : u);
    updateUsers(newUsers);
    showToast(`Leave ${status}`, status==="approved"?"success":"info");
  };

  return (
    <div>
      <div className="page-header"><div className="page-title">Leave Management</div><div className="page-subtitle">Approve or reject employee leave requests</div></div>
      <div className="card" style={{marginBottom:24}}>
        <div className="card-header"><div><div className="card-title">Pending Requests</div><div className="card-subtitle">{pending.length} awaiting action</div></div></div>
        {pending.length===0 ? <div className="text-muted text-sm" style={{padding:"20px 0",textAlign:"center"}}>No pending leave requests 🎉</div> :
        <div className="table-wrap"><table>
          <thead><tr><th>Worker</th><th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Actions</th></tr></thead>
          <tbody>{pending.map(l=>(
            <tr key={l.id}>
              <td><div style={{fontWeight:600,color:"var(--text)"}}>{l.worker.name}</div><div className="text-sm text-muted">{l.worker.department}</div></td>
              <td>{l.type}</td><td>{l.from}</td><td>{l.to}</td>
              <td className="text-muted">{l.reason}</td>
              <td><div style={{display:"flex",gap:6}}>
                <button className="btn btn-success btn-sm" onClick={()=>handleAction(l.worker.id,l.id,"approved")}><Icon name="check" size={13}/>Approve</button>
                <button className="btn btn-danger btn-sm" onClick={()=>handleAction(l.worker.id,l.id,"rejected")}><Icon name="x" size={13}/>Reject</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table></div>}
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Leave History</div></div>
        <div className="table-wrap"><table>
          <thead><tr><th>Worker</th><th>Type</th><th>Period</th><th>Status</th></tr></thead>
          <tbody>{handled.map(l=>(
            <tr key={l.id}>
              <td style={{fontWeight:600,color:"var(--text)"}}>{l.worker.name}</td>
              <td>{l.type}</td><td>{l.from} → {l.to}</td>
              <td><span className={`badge badge-${l.status}`}>{l.status}</span></td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
    </div>
  );
}

// ─── PENALTIES PANEL ──────────────────────────────────────────────────────────
function PenaltiesPanel({ workers, users, updateUsers, showToast, refresh }) {
  const [form, setForm] = useState({ workerId: "", reason:"", amount:"" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  useEffect(() => {
    if (workers.length > 0 && !form.workerId) {
      set("workerId", workers[0].id);
    }
  }, [workers]);

  const allPenalties = workers.flatMap(w=>(w.penalties||[]).map(p=>({...p,worker:w})));

  const handleAdd = async () => {
    if (!form.workerId || !form.reason || !form.amount) { 
      showToast(form.workerId ? "Fill all fields" : "Select a worker","error"); 
      return; 
    }
    try {
      const res = await fetch(`${API_URL}/penalties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, date: new Date().toISOString().split("T")[0] })
      });
      if (res.ok) {
        showToast("Penalty added","success");
        setForm(f=>({...f,reason:"",amount:""}));
        await refresh();
      } else {
        showToast("Failed to add penalty", "error");
      }
    } catch (err) { showToast("Server error", "error"); }
  };

  const handleRemove = async (workerId, penId) => {
    try {
      const res = await fetch(`${API_URL}/penalties/${penId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast("Penalty removed","info");
        await refresh();
      } else {
        showToast("Failed to remove penalty", "error");
      }
    } catch (err) { showToast("Server error", "error"); }
  };

  return (
    <div>
      <div className="page-header"><div className="page-title">Penalty Management</div><div className="page-subtitle">Apply and track worker penalties</div></div>
      <div className="two-col">
        <div className="card">
          <div className="card-header"><div className="card-title">Add Penalty</div></div>
          <div className="form-group"><label className="form-label">Worker</label>
            <select className="form-input" value={form.workerId} onChange={e=>set("workerId",e.target.value)}>
              {workers.map(w=><option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Reason</label><input className="form-input" placeholder="e.g. Late arrival" value={form.reason} onChange={e=>set("reason",e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Amount (₹)</label><input className="form-input" type="number" placeholder="1000" value={form.amount} onChange={e=>set("amount",e.target.value)} /></div>
          <button className="btn btn-primary" onClick={handleAdd}><Icon name="plus" size={16}/>Add Penalty</button>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Penalty Summary</div></div>
          {workers.map(w => {
            const total = (w.penalties||[]).reduce((s,p)=>s+p.amount,0);
            return total > 0 ? (
              <div key={w.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                <span style={{fontWeight:600}}>{w.name}</span>
                <span style={{color:"var(--red)",fontWeight:700}}>₹{total.toLocaleString()}</span>
              </div>
            ) : null;
          })}
        </div>
      </div>
      <div className="card" style={{marginTop:24}}>
        <div className="card-header"><div className="card-title">All Penalties</div></div>
        <div className="table-wrap"><table>
          <thead><tr><th>Worker</th><th>Reason</th><th>Amount</th><th>Date</th><th>Action</th></tr></thead>
          <tbody>{allPenalties.map(p=>(
            <tr key={p.id}>
              <td style={{fontWeight:600,color:"var(--text)"}}>{p.worker.name}</td>
              <td className="text-muted">{p.reason}</td>
              <td style={{color:"var(--red)",fontWeight:600}}>₹{p.amount.toLocaleString()}</td>
              <td>{p.date}</td>
              <td><button className="btn btn-danger btn-sm btn-icon" onClick={()=>handleRemove(p.worker.id,p.id)}><Icon name="trash" size={13}/></button></td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
    </div>
  );
}

// ─── ADMINS PANEL ─────────────────────────────────────────────────────────────
function AdminsPanel({ workers, admins, users, updateUsers, showToast }) {
  const handlePromote = (id) => {
    const newUsers = users.map(u => u.id===id ? {...u,role:"admin"} : u);
    updateUsers(newUsers);
    showToast("Worker promoted to Admin", "success");
  };
  const handleDemote = (id) => {
    if (id==="admin-001") { showToast("Cannot demote the Super Admin","error"); return; }
    const newUsers = users.map(u => u.id===id ? {...u,role:"worker"} : u);
    updateUsers(newUsers);
    showToast("Admin demoted to Worker","info");
  };

  return (
    <div>
      <div className="page-header"><div className="page-title">Admin Role Management</div><div className="page-subtitle">Promote workers to admin or revoke admin access</div></div>
      <div className="two-col">
        <div className="card">
          <div className="card-header"><div><div className="card-title">Current Admins</div><div className="card-subtitle">{admins.length} administrators</div></div></div>
          {admins.map(a=>(
            <div key={a.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
              <div className="avatar avatar-admin">{a.avatar}</div>
              <div style={{flex:1}}><div style={{fontWeight:600}}>{a.name}</div><div className="text-sm text-muted">{a.email}</div></div>
              <span className="badge badge-admin"><Icon name="crown" size={11}/>Admin</span>
              {a.id!=="admin-001" && <button className="btn btn-danger btn-sm" onClick={()=>handleDemote(a.id)}>Revoke</button>}
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-header"><div><div className="card-title">Promote Worker</div><div className="card-subtitle">Grant admin access</div></div></div>
          {workers.map(w=>(
            <div key={w.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
              <div className="avatar avatar-worker" style={{width:32,height:32,fontSize:"0.7rem"}}>{w.avatar}</div>
              <div style={{flex:1}}><div style={{fontWeight:600}}>{w.name}</div><div className="text-sm text-muted">{w.department}</div></div>
              <button className="btn btn-ghost btn-sm" onClick={()=>handlePromote(w.id)}><Icon name="crown" size={13}/>Promote</button>
            </div>
          ))}
          {workers.length===0 && <div className="text-muted text-sm" style={{padding:"20px 0",textAlign:"center"}}>No workers to promote</div>}
        </div>
      </div>
    </div>
  );
}

// ─── WORKER DASHBOARD ─────────────────────────────────────────────────────────
function WorkerDashboard({ user, users, updateUsers, activeTab, setActiveTab, onLogout, showToast, t, lang, setLang }) {
  const currentUser = users.find(u=>u.id===user.id) || user;
  const navItems = [
    { section: "MY WORKSPACE" },
    { id: "dashboard", icon: "dashboard", label: "Overview" },
    { id: "hours", icon: "clock", label: "Working Hours" },
    { id: "leaves", icon: "calendar", label: "Leave Applications" },
    { id: "salary", icon: "salary", label: "My Package & Salary" },
    { id: "penalties", icon: "warning", label: "Penalties" },
  ];

  return (
    <div className="app-layout">
      <Sidebar user={currentUser} items={navItems} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} t={t} lang={lang} setLang={setLang} />
      <main className="main-content">
        {activeTab === "dashboard" && <WorkerHome user={currentUser} setActiveTab={setActiveTab} t={t} />}
        {activeTab === "hours" && <WorkerHours user={currentUser} t={t} />}
        {activeTab === "leaves" && <WorkerLeaves user={currentUser} users={users} updateUsers={updateUsers} showToast={showToast} t={t} />}
        {activeTab === "salary" && <WorkerSalary user={currentUser} t={t} />}
        {activeTab === "penalties" && <WorkerPenalties user={currentUser} t={t} />}
      </main>
    </div>
  );
}

function WorkerHome({ user, setActiveTab, t }) {
  const hours = user.workingHours || [];
  const totalHours = hours.reduce((s,h)=>s+h.hours,0);
  const pending = (user.leaves||[]).filter(l=>l.status==="pending").length;
  const penalties = (user.penalties||[]).reduce((s,p)=>s+p.amount,0);
  const net = user.salary + (user.bonus||0) - penalties;

  return (
    <div>
      <div className="page-header"><div className="page-title">{t('dashboard')}</div><div className="page-subtitle">{t('welcome')}, {user.name} 👋</div></div>
      <div className="worker-hero">
        <div className={`avatar avatar-worker avatar-lg`}>{user.avatar}</div>
        <div className="worker-hero-info">
          <div className="worker-hero-name">{user.name}</div>
          <div className="worker-hero-dept">{user.department} · {user.package} Package</div>
          <div style={{display:"flex",gap:12,marginTop:12}}>
            <span className="badge badge-worker"><Icon name="mail" size={11}/>{user.email}</span>
            {user.phone && <span className="badge badge-worker"><Icon name="phone" size={11}/>{user.phone}</span>}
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:"0.75rem",color:"var(--text3)",marginBottom:4}}>Net Salary</div>
          <div style={{fontFamily:"Syne,sans-serif",fontSize:"1.8rem",fontWeight:800,color:"var(--green)"}}>₹{net.toLocaleString()}</div>
          <div style={{fontSize:"0.75rem",color:"var(--text3)"}}>April 2025</div>
        </div>
      </div>
      <div className="stat-grid">
        <StatCard color="blue" icon="clock" value={`${totalHours}h`} label="Total Hours Logged" delay={0} />
        <StatCard color="green" icon="salary" value={`₹${user.salary.toLocaleString()}`} label="Base Salary" delay={1} />
        <StatCard color="orange" icon="calendar" value={pending} label="Pending Leaves" delay={2} />
        <StatCard color="red" icon="warning" value={`₹${penalties.toLocaleString()}`} label="Total Penalties" delay={3} />
      </div>
      <div className="two-col">
        <div className="card">
          <div className="card-header"><div className="card-title">Recent Hours</div><button className="btn btn-ghost btn-sm" onClick={()=>setActiveTab("hours")}>View All</button></div>
          <div className="hours-bars">
            {hours.slice(-6).map((h,i)=>(
              <div key={i} className="hour-bar-wrap">
                <div className="hour-bar" style={{height:`${(h.hours/12)*100}%`}}/>
                <div className="hour-label">{h.date.slice(8)}/{h.date.slice(5,7)}</div>
              </div>
            ))}
            {hours.length===0 && <div className="text-muted text-sm" style={{margin:"auto"}}>No hours logged yet</div>}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Leave Status</div><button className="btn btn-ghost btn-sm" onClick={()=>setActiveTab("leaves")}>Manage</button></div>
          {(user.leaves||[]).length===0 ? <div className="text-muted text-sm" style={{padding:"20px 0",textAlign:"center"}}>No leave applications</div> :
          (user.leaves||[]).slice(-4).map(l=>(
            <div key={l.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
              <div><div style={{fontSize:"0.87rem",fontWeight:600}}>{l.type}</div><div className="text-sm text-muted">{l.from} → {l.to}</div></div>
              <span className={`badge badge-${l.status}`}>{l.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkerHours({ user, t }) {
  const hours = user.workingHours || [];
  const total = hours.reduce((s,h)=>s+h.hours,0);
  const avg = hours.length ? (total/hours.length).toFixed(1) : 0;
  return (
    <div>
      <div className="page-header"><div className="page-title">My Working Hours</div><div className="page-subtitle">Your attendance and time log</div></div>
      <div className="stat-grid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        <StatCard color="blue" icon="clock" value={`${total}h`} label="Total Hours" delay={0}/>
        <StatCard color="green" icon="clock" value={`${avg}h`} label="Daily Average" delay={1}/>
        <StatCard color="gold" icon="clock" value={hours.length} label="Days Present" delay={2}/>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Hours Chart</div><div className="text-sm text-muted">Recent activity</div></div>
        <div className="hours-bars" style={{height:120}}>
          {hours.slice(-10).map((h,i)=>(
            <div key={i} className="hour-bar-wrap">
              <div className="hour-bar" style={{height:`${(h.hours/12)*100}%`}}/>
              <div className="hour-label">{h.date.slice(8)}</div>
            </div>
          ))}
          {hours.length===0 && <div className="text-muted text-sm" style={{margin:"auto"}}>No data yet</div>}
        </div>
      </div>
      <div className="card" style={{marginTop:24}}>
        <div className="card-header"><div className="card-title">Detailed Log</div></div>
        <div className="table-wrap"><table>
          <thead><tr><th>Date</th><th>Hours</th><th>Status</th></tr></thead>
          <tbody>{[...hours].reverse().map((h,i)=>(
            <tr key={i}><td>{h.date}</td><td style={{fontWeight:600}}>{h.hours}h</td><td><span className={`badge ${h.hours>=8?"badge-approved":"badge-pending"}`}>{h.hours>=8?"Full Day":"Partial"}</span></td></tr>
          ))}</tbody>
        </table></div>
      </div>
    </div>
  );
}

function WorkerLeaves({ user, users, updateUsers, showToast, t }) {
  const currentUser = users.find(u=>u.id===user.id)||user;
  const [form, setForm] = useState({ type:"Casual Leave", from:"", to:"", reason:"" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const leaveTypes = ["Casual Leave","Sick Leave","Emergency Leave","Maternity/Paternity Leave","Annual Leave"];

  const handleApply = () => {
    if (!form.from || !form.to || !form.reason) { showToast("Fill all fields","error"); return; }
    const newLeave = { id:"l-"+Date.now(), type:form.type, from:form.from, to:form.to, reason:form.reason, status:"pending" };
    const newUsers = users.map(u => u.id===user.id ? {...u,leaves:[...(u.leaves||[]),newLeave]} : u);
    updateUsers(newUsers);
    setForm(f=>({...f,from:"",to:"",reason:""}));
    showToast("Leave application submitted","success");
  };

  return (
    <div>
      <div className="page-header"><div className="page-title">Leave Applications</div><div className="page-subtitle">Apply for leave and track your requests</div></div>
      <div className="two-col">
        <div className="card">
          <div className="card-header"><div className="card-title">Apply for Leave</div></div>
          <div className="form-group">
            <label className="form-label">Leave Type</label>
            <div className="leave-type-grid">
              {leaveTypes.map(t=>(
                <div key={t} className={`leave-type-btn ${form.type===t?"selected":""}`} onClick={()=>set("type",t)}>{t}</div>
              ))}
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">From Date</label><input className="form-input" type="date" value={form.from} onChange={e=>set("from",e.target.value)}/></div>
            <div className="form-group"><label className="form-label">To Date</label><input className="form-input" type="date" value={form.to} onChange={e=>set("to",e.target.value)}/></div>
          </div>
          <div className="form-group"><label className="form-label">Reason</label><input className="form-input" placeholder="Brief reason for leave" value={form.reason} onChange={e=>set("reason",e.target.value)}/></div>
          <button className="btn btn-primary" onClick={handleApply}><Icon name="calendar" size={16}/>Submit Application</button>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Leave Balance</div></div>
          {[{type:"Casual Leave",total:12,used:2},{type:"Sick Leave",total:15,used:1},{type:"Emergency Leave",total:5,used:0}].map(lb=>(
            <div key={lb.type} style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:"0.87rem",fontWeight:500}}>{lb.type}</span>
                <span className="text-sm text-muted">{lb.total-lb.used}/{lb.total} remaining</span>
              </div>
              <div className="progress-wrap"><div className="progress-bar" style={{width:`${((lb.total-lb.used)/lb.total)*100}%`,background:"linear-gradient(90deg,var(--green),#22c78b)"}}/></div>
            </div>
          ))}
        </div>
      </div>
      <div className="card" style={{marginTop:24}}>
        <div className="card-header"><div className="card-title">My Applications</div></div>
        {(currentUser.leaves||[]).length===0 ? <div className="text-muted text-sm" style={{padding:"20px 0",textAlign:"center"}}>No leave applications yet</div> :
        <div className="table-wrap"><table>
          <thead><tr><th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Status</th></tr></thead>
          <tbody>{[...(currentUser.leaves||[])].reverse().map(l=>(
            <tr key={l.id}>
              <td style={{fontWeight:500}}>{l.type}</td><td>{l.from}</td><td>{l.to}</td>
              <td className="text-muted">{l.reason}</td>
              <td><span className={`badge badge-${l.status}`}>{l.status}</span></td>
            </tr>
          ))}</tbody>
        </table></div>}
      </div>
    </div>
  );
}

function WorkerSalary({ user, t }) {
  const penalties = (user.penalties||[]).reduce((s,p)=>s+p.amount,0);
  const net = user.salary + (user.bonus||0) - penalties;
  const months = ["April 2025","March 2025","February 2025"];
  return (
    <div>
      <div className="page-header"><div className="page-title">My Package & Salary</div><div className="page-subtitle">View your compensation details</div></div>
      <div className="two-col">
        <div className="card">
          <div className="card-header"><div className="card-title">Current Month Breakdown</div><div className="badge badge-worker">April 2025</div></div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {[{label:"Base Salary",value:`₹${user.salary.toLocaleString()}`,color:"var(--text)"},{label:"Performance Bonus",value:`+₹${(user.bonus||0).toLocaleString()}`,color:"var(--green)"},{label:"Penalties",value:`-₹${penalties.toLocaleString()}`,color:"var(--red)"}].map(row=>(
              <div key={row.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
                <span className="text-muted">{row.label}</span>
                <span style={{fontWeight:700,color:row.color,fontSize:"1rem"}}>{row.value}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",background:"rgba(61,214,140,0.05)",borderRadius:10,paddingLeft:12,paddingRight:12}}>
              <span style={{fontWeight:700,fontSize:"1rem"}}>Net Salary</span>
              <span style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"1.5rem",color:"var(--green)"}}>₹{net.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Package Details</div></div>
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontFamily:"Syne,sans-serif",fontSize:"1rem",color:"var(--text3)",marginBottom:8}}>Current Package</div>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 24px",background:"linear-gradient(135deg,rgba(79,142,247,0.1),rgba(124,111,247,0.1))",border:"1px solid rgba(79,142,247,0.2)",borderRadius:100}}>
              <Icon name="star" size={18} color="var(--gold)"/>
              <span style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"1.3rem"}}>{user.package}</span>
            </div>
          </div>
          <div className="divider"/>
          <div><div style={{fontSize:"0.78rem",color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Package Benefits</div>
            {["Health Insurance","Annual Bonus Eligible","Performance Reviews","Flexible Hours"].map(b=>(
              <div key={b} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <Icon name="check" size={14} color="var(--green)"/>
                <span style={{fontSize:"0.87rem"}}>{b}</span>
              </div>
            ))}
          </div>
          <div className="divider"/>
          <div style={{fontSize:"0.8rem",color:"var(--text3)"}}>Joined: <strong className="text-accent">{user.joiningDate}</strong></div>
        </div>
      </div>
      <div className="card" style={{marginTop:24}}>
        <div className="card-header"><div className="card-title">Salary History</div></div>
        <div className="table-wrap"><table>
          <thead><tr><th>Month</th><th>Base</th><th>Bonus</th><th>Deductions</th><th>Net</th><th>Status</th></tr></thead>
          <tbody>{months.map(m=>(
            <tr key={m}>
              <td style={{fontWeight:500}}>{m}</td>
              <td>₹{user.salary.toLocaleString()}</td>
              <td style={{color:"var(--green)"}}>+₹{(user.bonus||0).toLocaleString()}</td>
              <td style={{color:"var(--red)"}}>-₹{penalties.toLocaleString()}</td>
              <td style={{fontWeight:700,color:"var(--accent)"}}>₹{net.toLocaleString()}</td>
              <td><span className="badge badge-approved">Paid</span></td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
    </div>
  );
}

function WorkerPenalties({ user, t }) {
  const penalties = user.penalties || [];
  const total = penalties.reduce((s,p)=>s+p.amount,0);
  return (
    <div>
      <div className="page-header"><div className="page-title">My Penalties</div><div className="page-subtitle">View applied penalties and deductions</div></div>
      {total > 0 && (
        <div style={{background:"rgba(247,95,95,0.06)",border:"1px solid rgba(247,95,95,0.15)",borderRadius:14,padding:"20px 24px",marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"1.1rem",color:"var(--red)"}}>Total Deductions This Month</div>
            <div className="text-sm text-muted mt-1">These amounts will be deducted from your net salary</div>
          </div>
          <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"2rem",color:"var(--red)"}}>₹{total.toLocaleString()}</div>
        </div>
      )}
      <div className="card">
        <div className="card-header"><div className="card-title">Penalty History</div></div>
        {penalties.length===0 ? (
          <div style={{textAlign:"center",padding:"40px 0"}}>
            <Icon name="check" size={36} color="var(--green)"/>
            <div style={{fontFamily:"Syne,sans-serif",fontWeight:700,marginTop:12}}>No Penalties!</div>
            <div className="text-muted text-sm mt-1">You're doing great. Keep it up!</div>
          </div>
        ) : (
          <div className="table-wrap"><table>
            <thead><tr><th>Reason</th><th>Amount</th><th>Date</th></tr></thead>
            <tbody>{penalties.map(p=>(
              <tr key={p.id}>
                <td>{p.reason}</td>
                <td style={{color:"var(--red)",fontWeight:600}}>₹{p.amount.toLocaleString()}</td>
                <td>{p.date}</td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}
