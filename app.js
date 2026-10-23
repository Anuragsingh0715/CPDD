const records = {
  students: [
    {name:'Aarav Sharma', roll:'CSE22041', branch:'Computer Science', cgpa:'8.74', status:'Eligible'},
    {name:'Diya Nair', roll:'ECE22018', branch:'Electronics', cgpa:'9.12', status:'Placed'},
    {name:'Ishaan Verma', roll:'IT22053', branch:'Information Technology', cgpa:'8.31', status:'Shortlisted'},
    {name:'Meera Iyer', roll:'CSE22067', branch:'Computer Science', cgpa:'9.46', status:'Placed'}
  ],
  companies: [
    {name:'Northstar Technologies', sector:'Technology', contact:'Priya Menon', status:'Active'},
    {name:'Vertex Analytics', sector:'Data & Analytics', contact:'Karan Shah', status:'Active'},
    {name:'BluePeak Finance', sector:'Financial Services', contact:'Ritu Khanna', status:'Prospect'}
  ],
  drives: [
    {role:'Graduate Software Engineer', company:'Northstar Technologies', date:'04 Nov 2026', spoc:'Riya Kapoor', status:'Scheduled'},
    {role:'Data Analyst', company:'Vertex Analytics', date:'11 Nov 2026', spoc:'Arjun Nair', status:'Applications open'},
    {role:'Associate Engineer', company:'Greenline Manufacturing', date:'02 Dec 2026', spoc:'Sameer Shah', status:'Scheduled'}
  ],
  shortlists: [
    {student:'Ananya Rao', roll:'CSE22009', role:'Graduate Software Engineer', company:'Northstar Technologies', stage:'Technical round'},
    {student:'Aarav Sharma', roll:'CSE22041', role:'Graduate Software Engineer', company:'Northstar Technologies', stage:'Aptitude test'},
    {student:'Ishaan Verma', roll:'IT22053', role:'Data Analyst', company:'Vertex Analytics', stage:'Application review'}
  ],
  activities: [
    {activity:'Northstar Technologies drive scheduled', date:'20 Oct 2026', detail:'Graduate Software Engineer · SPOC: Riya Kapoor'},
    {activity:'Diya Nair marked as placed', date:'20 Oct 2026', detail:'Offer recorded for current placement season'},
    {activity:'Vertex Analytics applications opened', date:'19 Oct 2026', detail:'Data Analyst · Applications open'}
  ]
};
const sectionInfo = {
  dashboard: ['Dashboard','A quick overview of placement activity.'],
  students: ['Students','Student records, placement status, and eligibility.'],
  companies: ['Companies','Company contacts and employer engagement.'],
  drives: ['Placement drives','Upcoming campus drives, roles, and SPOCs.'],
  shortlists: ['Shortlists','Students shortlisted for each company drive.'],
  activities: ['Activities','Recent updates from the placement cell.']
};
const $ = selector => document.querySelector(selector);

function login(){ $('#loginView').hidden=true; $('#portalView').hidden=false; render('dashboard'); }
function logout(){ $('#portalView').hidden=true; $('#loginView').hidden=false; $('#loginForm').reset(); }
$('#loginForm').addEventListener('submit', event => { event.preventDefault(); login(); });
$('#logoutBtn').addEventListener('click', logout);
$('#forgotLink').addEventListener('click', event => { event.preventDefault(); alert('Password reset is not connected in this front-end demo.'); });

document.querySelectorAll('[data-section]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-section]').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  render(button.dataset.section);
  const nav = bootstrap.Collapse.getInstance($('#portalNav'));
  if (nav && window.innerWidth < 992) nav.hide();
}));

function statusBadge(status){
  const color = status === 'Placed' || status === 'Active' || status === 'Scheduled' ? 'success' : status === 'Shortlisted' || status === 'Applications open' ? 'primary' : 'secondary';
  return `<span class="badge text-bg-${color}">${status}</span>`;
}
function table(headers, rows){
  return `<div class="card border-0 shadow-sm"><div class="table-responsive"><table class="table table-hover align-middle mb-0"><thead><tr>${headers.map(h=>`<th>${h.label}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${headers.map(h=>`<td>${h.key==='status'?statusBadge(row[h.key]):row[h.key]}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
}
function dashboard(){
  const placed=records.students.filter(student=>student.status==='Placed').length;
  return `<div class="row g-3 mb-4">
    <div class="col-6 col-xl-3"><div class="card summary-card h-100"><div class="card-body"><div class="text-secondary small">Registered students</div><div class="display-6 fw-bold">${records.students.length}</div><div class="small text-secondary">Across all branches</div></div></div></div>
    <div class="col-6 col-xl-3"><div class="card summary-card h-100"><div class="card-body"><div class="text-secondary small">Students placed</div><div class="display-6 fw-bold">${placed}</div><div class="small text-secondary">Offers recorded</div></div></div></div>
    <div class="col-6 col-xl-3"><div class="card summary-card h-100"><div class="card-body"><div class="text-secondary small">Companies</div><div class="display-6 fw-bold">${records.companies.length}</div><div class="small text-secondary">In the directory</div></div></div></div>
    <div class="col-6 col-xl-3"><div class="card summary-card h-100"><div class="card-body"><div class="text-secondary small">Upcoming drives</div><div class="display-6 fw-bold">${records.drives.length}</div><div class="small text-secondary">Scheduled this season</div></div></div></div>
  </div><div class="row g-4"><div class="col-lg-7"><div class="d-flex justify-content-between align-items-center mb-3"><h2 class="h5 fw-bold mb-0">Upcoming drives</h2><button class="btn btn-sm btn-outline-primary" data-jump="drives">View drives</button></div>${table([{key:'role',label:'Role'},{key:'company',label:'Company'},{key:'date',label:'Date'},{key:'status',label:'Status'}],records.drives.slice(0,3))}</div><div class="col-lg-5"><h2 class="h5 fw-bold mb-3">Recent activities</h2><div class="list-group shadow-sm">${records.activities.map(a=>`<div class="list-group-item py-3"><div class="fw-semibold small">${a.activity}</div><div class="text-secondary small mt-1">${a.detail}</div><div class="text-secondary small mt-2">${a.date}</div></div>`).join('')}</div></div></div>`;
}
function render(section){
  const [title,description]=sectionInfo[section];
  $('#sectionTitle').textContent=title;
  $('#sectionDesc').textContent=description;
  const content=$('#sectionContent');
  if(section==='dashboard'){content.innerHTML=dashboard();content.querySelector('[data-jump]')?.addEventListener('click',()=>document.querySelector('[data-section="drives"]').click());return;}
  const columns={
    students:[['name','Student'],['roll','Roll number'],['branch','Branch'],['cgpa','CGPA'],['status','Placement status']],
    companies:[['name','Company'],['sector','Sector'],['contact','Company SPOC'],['status','Relationship']],
    drives:[['role','Role'],['company','Company'],['date','Date'],['spoc','CPDD SPOC'],['status','Status']],
    shortlists:[['student','Student'],['roll','Roll number'],['role','Role / drive'],['company','Company'],['stage','Selection stage']],
    activities:[['activity','Activity'],['detail','Details'],['date','Date']]
  }[section];
  content.innerHTML=table(columns.map(([key,label])=>({key,label})),records[section]);
}
