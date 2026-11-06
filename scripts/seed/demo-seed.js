// Demo data for the local Docker Compose setup. Run by the "seed" service.
//
// Every person, address and document here is fictional. Do not run this
// against a shared or production database.
//
// The demo admin is not created here: the backend creates "admin" on first
// start using ADMIN_DEFAULT_PASSWORD (see docker-compose.yml).

const fs = require('fs');

const DEMO_MARKER = 'demo-seed'; // stored in meta.tabletId
const SEED_DIR = '/seed';

if (db.submissions.countDocuments({ 'meta.tabletId': DEMO_MARKER }) > 0) {
  print('Demo data already present, nothing to do.');
  quit(0);
}

const signature = {
  contentType: 'image/png',
  base64: fs.readFileSync(`${SEED_DIR}/demo-signature.png`).toString('base64'),
};

const hoursAgo = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000);

const symptom = (key, label, option = null, severity = 4, onset = '2-3 Tage', notes = null) => ({
  key, label, option, severity, onset, notes,
});

const patients = [
  {
    firstName: 'Max', lastName: 'Mustermann', birthDate: '1985-03-14', status: 'NEW', hours: 1,
    symptoms: [
      symptom('cough', 'Husten', 'Ohne Schleim', 5, '2-3 Tage', 'Vor allem nachts.'),
      symptom('headache', 'Kopfschmerzen', 'Druck', 3, 'Seit heute'),
    ],
    allergies: ['Pollen'], medications: ['Ibuprofen'], conditions: ['Asthma'],
    attachment: 'Medikamentenplan-Muster.pdf',
  },
  {
    firstName: 'Erika', lastName: 'Mustermann', birthDate: '1964-08-12', status: 'NEW', hours: 3,
    symptoms: [symptom('fever', 'Fieber')],
    allergies: ['Nüsse'], medications: ['Paracetamol'], conditions: [],
  },
  {
    firstName: 'Hans', lastName: 'Beispiel', birthDate: '1971-02-03', status: 'NEW', hours: 7,
    symptoms: [symptom('back', 'Rückenschmerzen', 'Unten')],
    allergies: [], medications: ['Ibuprofen'], conditions: ['Bluthochdruck'],
  },
  {
    firstName: 'Anna', lastName: 'Beispiel', birthDate: '1990-11-27', status: 'NEW', hours: 9,
    symptoms: [symptom('throat', 'Halsschmerzen')],
    allergies: ['Hausstaub'], medications: [], conditions: [],
  },
  {
    firstName: 'Peter', lastName: 'Platzhalter', birthDate: '1958-06-30', status: 'VIEWED', hours: 26,
    symptoms: [symptom('dizzy', 'Schwindel', 'Drehschwindel')],
    allergies: [], medications: ['ASS'], conditions: ['Herzkrankheit'],
  },
  {
    firstName: 'Maria', lastName: 'Musterfrau', birthDate: '1982-04-19', status: 'VIEWED', hours: 28,
    symptoms: [symptom('rash', 'Ausschlag', 'Juckend')],
    allergies: ['Latex'], medications: [], conditions: [],
  },
  {
    firstName: 'Otto', lastName: 'Normalverbraucher', birthDate: '1949-12-01', status: 'VIEWED', hours: 32,
    symptoms: [symptom('breath', 'Atemnot', 'Bei Belastung')],
    allergies: [], medications: ['Metformin'], conditions: ['Diabetes'],
  },
  {
    firstName: 'Lisa', lastName: 'Demo', birthDate: '2001-07-08', status: 'DONE', hours: 50,
    symptoms: [symptom('nausea', 'Übelkeit')],
    allergies: ['Penicillin'], medications: [], conditions: [],
  },
  {
    firstName: 'Karl', lastName: 'Testmann', birthDate: '1976-09-15', status: 'DONE', hours: 53,
    symptoms: [symptom('chest', 'Brustschmerzen', 'Links')],
    allergies: [], medications: ['ASS'], conditions: ['Bluthochdruck'],
  },
  {
    firstName: 'Sabine', lastName: 'Beispielfrau', birthDate: '1968-01-22', status: 'DONE', hours: 57,
    symptoms: [symptom('cough', 'Husten', 'Mit Schleim')],
    allergies: ['Pollen'], medications: [], conditions: ['Asthma'],
  },
  {
    firstName: 'Tom', lastName: 'Musterkind', birthDate: '2012-05-05', status: 'DONE', hours: 74,
    symptoms: [symptom('fever', 'Fieber')],
    allergies: [], medications: ['Paracetamol'], conditions: [],
  },
  {
    firstName: 'Greta', lastName: 'Musterhaus', birthDate: '1995-03-11', status: 'DONE', hours: 78,
    symptoms: [symptom('headache', 'Kopfschmerzen', 'Stechend')],
    allergies: [], medications: [], conditions: [],
  },
];

// Same layout GridFsTemplate writes, so the admin download endpoint can serve it.
function storeFile(fileName, submissionId, uploadedAt) {
  const content = fs.readFileSync(`${SEED_DIR}/${fileName}`);
  const fileId = new ObjectId();

  db.getCollection('fs.files').insertOne({
    _id: fileId,
    filename: fileName,
    length: NumberLong(String(content.length)),
    chunkSize: 261120,
    uploadDate: uploadedAt,
    metadata: { _contentType: 'application/pdf', submissionId: submissionId.toHexString() },
  });
  db.getCollection('fs.chunks').insertOne({
    files_id: fileId,
    n: 0,
    data: BinData(0, content.toString('base64')),
  });

  return {
    _id: fileId,
    fileName,
    contentType: 'application/pdf',
    size: NumberLong(String(content.length)),
    uploadedAt,
  };
}

for (const p of patients) {
  const createdAt = hoursAgo(p.hours);
  const _id = new ObjectId();

  db.submissions.insertOne({
    _id,
    createdAt,
    updatedAt: createdAt,
    status: p.status,
    formVersion: 'v1',
    patientData: {
      firstName: p.firstName,
      lastName: p.lastName,
      birthDate: p.birthDate,
      phone: '+49 000 1234567',
      email: `${p.firstName}.${p.lastName}@example.com`.toLowerCase(),
      address: { street: 'Musterstraße', houseNumber: '1', zip: '12345', city: 'Musterstadt' },
    },
    medical: {
      allergies: p.allergies,
      medications: p.medications,
      preExistingConditions: p.conditions,
      symptoms: p.symptoms,
    },
    consents: { gdprAccepted: true, dataSharingAccepted: false, acceptedAt: createdAt },
    signature,
    meta: { tabletId: DEMO_MARKER, language: 'de' },
    attachments: p.attachment ? [storeFile(p.attachment, _id, createdAt)] : [],
    _class: 'mohammad.development.praxis.modules.patient.Submission',
  });
}

print(`Seeded ${patients.length} fictional demo patients.`);
