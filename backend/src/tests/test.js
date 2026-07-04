require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/database');

const OK   = (msg) => console.log('  OK  ' + msg);
const FAIL = (msg) => console.log('  XX  ' + msg);
const INFO = (msg) => console.log('\n>> ' + msg);
const SEP  = ()    => console.log('  ' + '-'.repeat(50));

const http  = require('http');
const https = require('https');

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const BASE = process.env.TEST_URL || 'http://localhost:5000';
    const url  = new URL(BASE + path);
    const lib  = url.protocol === 'https:' ? https : http;
    const payload = body ? JSON.stringify(body) : null;
    const headers = { 'Content-Type': 'application/json' };
    if (token)   headers['Authorization'] = 'Bearer ' + token;
    if (payload) headers['Content-Length'] = Buffer.byteLength(payload);

    const req = lib.request({
      hostname: url.hostname,
      port:     url.port || (url.protocol === 'https:' ? 443 : 80),
      path:     url.pathname,
      method,
      headers,
    }, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

let passed = 0;
let failed = 0;

function check(ok, desc, detail) {
  if (ok) { OK(desc);  passed++; }
  else    { FAIL(desc + (detail ? ' -> ' + detail : '')); failed++; }
}

async function runTests() {
  console.log('\nAulaVirtual Pro - Sistema de pruebas');
  console.log('BD:       ' + MONGO_URI);
  console.log('Servidor: ' + (process.env.TEST_URL || 'http://localhost:5000'));
  console.log('='.repeat(54));

  let tokenAdmin = null, tokenInstructor = null, tokenAlumno = null;
  let cursoId = null, leccionId = null, quizId = null;

  // 1. Ruta base
  INFO('1. Ruta base');
  SEP();
  try {
    const r = await request('GET', '/');
    check(r.status === 200, 'GET /  -> servidor responde 200');
  } catch (e) {
    FAIL('GET /  -> servidor no responde. Corre: npm run dev');
    failed++;
    return finalReport();
  }

  // 2. Autenticacion
  INFO('2. Autenticacion');
  SEP();

  const rAdmin = await request('POST', '/api/v1/auth/login', { email: 'admin@aulavirtual.com', password: 'password123' });
  check(rAdmin.status === 200,                    'POST /auth/login -> admin OK');
  check(!!rAdmin.body.token,                      'Token JWT recibido (admin)');
  check(rAdmin.body.usuario && rAdmin.body.usuario.rol === 'admin', 'Rol admin verificado');
  tokenAdmin = rAdmin.body.token;

  const rInst = await request('POST', '/api/v1/auth/login', { email: 'carlos@aulavirtual.com', password: 'password123' });
  check(rInst.status === 200, 'POST /auth/login -> instructor OK');
  tokenInstructor = rInst.body.token;

  const rAlum = await request('POST', '/api/v1/auth/login', { email: 'maria@aulavirtual.com', password: 'password123' });
  check(rAlum.status === 200, 'POST /auth/login -> alumno OK');
  tokenAlumno = rAlum.body.token;

  const rBad = await request('POST', '/api/v1/auth/login', { email: 'noexiste@test.com', password: 'mal' });
  check(rBad.status === 401, 'POST /auth/login -> credenciales invalidas devuelve 401');

  const emailTest = 'test_' + Date.now() + '@prueba.com';
  const rReg = await request('POST', '/api/v1/auth/register', { nombre: 'Usuario Test', email: emailTest, password: 'test1234' });
  check(rReg.status === 201, 'POST /auth/register -> usuario nuevo creado (201)');
  check(!!rReg.body.token,   'Token recibido tras registro');

  const rDup = await request('POST', '/api/v1/auth/register', { nombre: 'Dup', email: emailTest, password: 'test1234' });
  check(rDup.status === 409, 'POST /auth/register -> email duplicado devuelve 409');

  // 3. Cursos
  INFO('3. Cursos');
  SEP();

  const rCursos = await request('GET', '/api/v1/cursos');
  check(rCursos.status === 200,          'GET /cursos -> lista OK');
  check(Array.isArray(rCursos.body),     'Respuesta es un array');
  check(rCursos.body.length > 0,         'Hay ' + rCursos.body.length + ' cursos en la BD');

  if (rCursos.body.length > 0) {
    cursoId = rCursos.body[0]._id;

    const rDet = await request('GET', '/api/v1/cursos/' + cursoId);
    check(rDet.status === 200,               'GET /cursos/:id -> detalle OK');
    check(Array.isArray(rDet.body.modulos),  'Curso incluye modulos');
    leccionId = rDet.body.modulos && rDet.body.modulos[0] && rDet.body.modulos[0].lecciones && rDet.body.modulos[0].lecciones[0] && rDet.body.modulos[0].lecciones[0]._id;
    check(!!leccionId, 'Primera leccion encontrada: ' + leccionId);
  }

  const rNF = await request('GET', '/api/v1/cursos/000000000000000000000000');
  check(rNF.status === 404, 'GET /cursos/:id -> ID inexistente devuelve 404');

  const rCrear = await request('POST', '/api/v1/cursos', { titulo: 'Curso test ' + Date.now(), descripcion: 'Test' }, tokenInstructor);
  check(rCrear.status === 201, 'POST /cursos -> instructor puede crear (201)');
  const cursoTestId = rCrear.body._id || (rCrear.body.curso && rCrear.body.curso._id);

  const rCrearAlum = await request('POST', '/api/v1/cursos', { titulo: 'No deberia' }, tokenAlumno);
  check(rCrearAlum.status === 403, 'POST /cursos -> alumno recibe 403');

  const rCrearSin = await request('POST', '/api/v1/cursos', { titulo: 'Sin token' });
  check(rCrearSin.status === 401, 'POST /cursos -> sin token devuelve 401');

  if (cursoTestId) {
    const rUpd = await request('PUT', '/api/v1/cursos/' + cursoTestId, { titulo: 'Actualizado', descripcion: 'OK' }, tokenInstructor);
    check(rUpd.status === 200, 'PUT /cursos/:id -> actualizacion OK');

    const rDel = await request('DELETE', '/api/v1/cursos/' + cursoTestId, null, tokenAdmin);
    check(rDel.status === 200 || rDel.status === 204, 'DELETE /cursos/:id -> eliminacion OK (admin)');
  }

  // 4. Progreso
  INFO('4. Progreso del alumno');
  SEP();

  if (cursoId) {
    const rProg = await request('GET', '/api/v1/progreso/' + cursoId, null, tokenAlumno);
    check(rProg.status === 200 || rProg.status === 404, 'GET /progreso/:cursoId -> responde ' + rProg.status);

    if (leccionId) {
      const rMarcar = await request('POST', '/api/v1/cursos/' + cursoId + '/lecciones/' + leccionId + '/completar', null, tokenAlumno);
      check(rMarcar.status === 200 || rMarcar.status === 201, 'POST /cursos/:id/lecciones/:id/completar -> ' + rMarcar.status);

      const rProgAct = await request('GET', '/api/v1/progreso/' + cursoId, null, tokenAlumno);
      check(rProgAct.status === 200, 'GET /progreso/:cursoId -> progreso actualizado OK');
      check(Array.isArray(rProgAct.body.leccionesCompletadas), 'Respuesta tiene leccionesCompletadas');

      const rProgInst = await request('POST', '/api/v1/cursos/' + cursoId + '/lecciones/' + leccionId + '/completar', null, tokenInstructor);
      check(rProgInst.status === 403, 'POST /cursos/:id/lecciones/:id/completar -> instructor recibe 403');
    }
  }

  // 5. Quiz
  INFO('5. Quiz');
  SEP();

  if (cursoId) {
    const Quiz = require('../models/Quiz');
    const quizDoc = await Quiz.findOne({ cursoId: cursoId });
    quizId = quizDoc && quizDoc._id && quizDoc._id.toString();

    if (quizId && quizDoc) {
      check(true, 'Quiz encontrado en BD: ' + quizDoc.titulo);

      const respuestas = quizDoc.preguntas.map(function() { return 0; });
      const rQuiz = await request('POST', '/api/v1/quiz/' + quizId + '/submit', { respuestas: respuestas }, tokenAlumno);
      check(rQuiz.status === 200 || rQuiz.status === 201, 'POST /quiz/:id/submit -> ' + rQuiz.status);
      check(typeof rQuiz.body.calificacion === 'number', 'Respuesta incluye calificacion numerica');

      const rResult = await request('GET', '/api/v1/quiz/' + quizId + '/resultado', null, tokenAlumno);
      check(rResult.status === 200, 'GET /quiz/:id/resultado -> resultado OK');
    } else {
      FAIL('No se encontro quiz - corre: npm run seed');
      failed++;
    }
  }

  // 6. Reporte admin
  INFO('6. Reporte de administrador');
  SEP();

  const rRep = await request('GET', '/api/v1/reportes/admin', null, tokenAdmin);
  check(rRep.status === 200,           'GET /reportes/admin -> admin OK');
  check(Array.isArray(rRep.body),      'Reporte es un array de alumnos');
  if (Array.isArray(rRep.body) && rRep.body.length > 0) {
    check(!!rRep.body[0].alumno,                    'Cada entrada tiene .alumno');
    check(Array.isArray(rRep.body[0].progresos),    'Cada entrada tiene .progresos');
    check(Array.isArray(rRep.body[0].calificaciones), 'Cada entrada tiene .calificaciones');
  }

  const rRepAlum = await request('GET', '/api/v1/reportes/admin', null, tokenAlumno);
  check(rRepAlum.status === 403, 'GET /reportes/admin -> alumno recibe 403');

  const rRepSin = await request('GET', '/api/v1/reportes/admin');
  check(rRepSin.status === 401, 'GET /reportes/admin -> sin token devuelve 401');

  // 7. Seguridad
  INFO('7. Seguridad general');
  SEP();

  const r404 = await request('GET', '/api/v1/ruta-inexistente');
  check(r404.status === 404, 'Ruta inexistente devuelve 404');

  const rTok = await request('GET', '/api/v1/reportes/admin', null, 'token.falso.invalido');
  check(rTok.status === 401, 'Token invalido devuelve 401');

  finalReport();
}

function finalReport() {
  const total = passed + failed;
  console.log('\n' + '='.repeat(54));
  console.log('  RESULTADO: ' + passed + '/' + total + ' pruebas pasaron');
  if (failed === 0) {
    console.log('  Todo funciona correctamente.');
  } else {
    console.log('  ' + failed + ' prueba(s) fallaron. Revisa los XX arriba.');
  }
  console.log('='.repeat(54) + '\n');
}

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    await runTests();
  } catch (err) {
    console.error('No se pudo conectar a MongoDB: ' + err.message);
    console.error('Verifica database.js o tu archivo .env');
  } finally {
    await mongoose.disconnect();
  }
}

main();
