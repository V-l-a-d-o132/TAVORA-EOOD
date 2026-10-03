/* Standalone teaching simulation. No network, accounts or Academy progress calls. */
(function (global) {
  'use strict';
  const STORAGE_KEY = 'tavora-silk-request-lab-v1';
  const wait = (ms) => new Promise((resolve) => global.setTimeout(resolve, ms));
  const fields = (request) => ({ name: request.name, contact: request.contact, preferredDate: request.preferredDate });
  const sameFields = (a, b) => JSON.stringify(fields(a)) === JSON.stringify(fields(b));

  function makeMemoryStore(initial = []) {
    let records = initial.slice();
    return {
      all: () => records.slice(),
      save: (request) => { records = [...records, { ...request, state: 'запитване', confirmed: false }]; },
      clear: () => { records = []; },
    };
  }

  async function processRequest(request, mode, store, delay = wait) {
    if (!request.name.trim()) return { state: 'invalid', field: 'name', message: 'Въведи учебно име. Нов запис няма.' };
    const validContact = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.contact) || /^\+?[0-9 ()-]{7,20}$/.test(request.contact);
    if (!validContact) return { state: 'invalid', field: 'contact', message: 'Въведи валиден учебен контакт. Нов запис няма.' };
    if (mode === 'slow') await delay(1200);
    if (mode === 'error') return { state: 'error', message: 'Учебното изпращане не успя. Данните са запазени във формата. Можеш да повториш същата заявка.' };
    const previous = store.all().find((record) => record.id === request.id);
    if (previous && !sameFields(previous, request)) return { state: 'conflict', message: 'Този идентификатор вече е използван за други данни. Нужна е нова заявка.' };
    if (!previous) store.save(request);
    return {
      state: previous ? 'duplicate' : 'accepted', id: request.id,
      message: previous
        ? 'Това е същото учебно запитване. Втори запис не е създаден. Часът остава непотвърден.'
        : 'Учебното запитване е прието в локалния списък. Часът не е потвърден.',
    };
  }

  async function runChecks() {
    const store = makeMemoryStore();
    const request = { id: 'учебна-проверка-1', name: 'Учебен посетител', contact: 'test@example.invalid', preferredDate: '' };
    const checks = [];
    let result = await processRequest(request, 'success', store);
    checks.push({ label: 'Валиден вход: един запис, без потвърден час', passed: result.state === 'accepted' && store.all().length === 1 && store.all()[0].confirmed === false });
    result = await processRequest(request, 'success', store);
    checks.push({ label: 'Повторение: същият идентификатор, без втори запис', passed: result.state === 'duplicate' && result.id === request.id && store.all().length === 1 });
    result = await processRequest({ ...request, id: 'липсващ-контакт', contact: '' }, 'success', store);
    checks.push({ label: 'Липсващ контакт: обяснена грешка, без нов запис', passed: result.state === 'invalid' && result.field === 'contact' && store.all().length === 1 });
    result = await processRequest({ ...request, id: 'неуспех' }, 'error', store);
    checks.push({ label: 'Неуспех: няма съобщение за успех или нов запис', passed: result.state === 'error' && store.all().length === 1 });
    let observedWait = false;
    result = await processRequest({ ...request, id: 'забавяне' }, 'slow', store, async () => { observedWait = true; });
    checks.push({ label: 'Забавяне: изчакване преди приемане', passed: observedWait && result.state === 'accepted' && store.all().length === 2 });
    result = await processRequest({ ...request, name: 'Друг учебен посетител' }, 'success', store);
    checks.push({ label: 'Конфликт: същият идентификатор не приема различни данни', passed: result.state === 'conflict' && store.all().length === 2 });
    return checks;
  }

  function browserStore(storage, onStorageFailure) {
    let initial = [];
    try {
      const value = JSON.parse(storage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(value)) initial = value.filter((item) => item && typeof item.id === 'string' && typeof item.name === 'string' && typeof item.contact === 'string');
    } catch { onStorageFailure(); }
    const store = makeMemoryStore(initial);
    const persist = () => {
      try { storage.setItem(STORAGE_KEY, JSON.stringify(store.all())); }
      catch { onStorageFailure(); }
    };
    return { all: store.all, save: (item) => { store.save(item); persist(); }, clear: () => { store.clear(); persist(); } };
  }

  function init(document) {
    const form = document.getElementById('request-form');
    if (!form) return null;
    const byId = (id) => document.getElementById(id);
    const storageFailure = () => { byId('storage-note').textContent = 'Браузърът не позволява трайно запазване. Списъкът е само за тази отворена страница.'; };
    let storage;
    try { storage = global.localStorage; } catch { storageFailure(); }
    const store = storage ? browserStore(storage, storageFailure) : makeMemoryStore();
    if (storage && !byId('storage-note').textContent) byId('storage-note').textContent = 'Учебният списък се пази в този браузър. Изчистване на данните на браузъра ще го премахне.';
    let lastRequest = null;
    let busy = false;
    const newId = () => global.crypto && global.crypto.randomUUID ? global.crypto.randomUUID() : `учебна-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const renderRecords = () => {
      const records = store.all();
      byId('record-count').textContent = String(records.length);
      byId('records').replaceChildren(...records.map((record) => {
        const row = document.createElement('tr');
        [record.id, record.name, record.contact, record.preferredDate || 'неуточнена', 'Запитване; часът не е потвърден'].forEach((value, index) => {
          const cell = document.createElement('td'); cell.textContent = value;
          if (index === 0) cell.className = 'code';
          row.appendChild(cell);
        });
        return row;
      }));
    };
    const submit = async (repeat) => {
      if (busy) return;
      const input = { name: byId('name').value.trim(), contact: byId('contact').value.trim(), preferredDate: byId('date').value };
      const request = repeat && lastRequest ? lastRequest : { ...input, id: lastRequest && sameFields(input, lastRequest) ? lastRequest.id : newId() };
      busy = true;
      byId('send').disabled = true; byId('repeat').disabled = true; byId('clear').disabled = true;
      byId('status').textContent = 'Изпращане… още няма потвърждение.';
      byId('name').removeAttribute('aria-invalid'); byId('contact').removeAttribute('aria-invalid');
      try {
        const result = await processRequest(request, byId('mode').value, store);
        if (result.field) { byId(result.field).setAttribute('aria-invalid', 'true'); byId(result.field).focus(); }
        else lastRequest = request;
        byId('status').textContent = result.message + (result.id ? ` Идентификатор: ${result.id}` : '');
        renderRecords();
        return result;
      } finally {
        busy = false; byId('send').disabled = false; byId('repeat').disabled = !lastRequest; byId('clear').disabled = false;
      }
    };
    form.addEventListener('submit', (event) => { event.preventDefault(); void submit(false); });
    byId('repeat').addEventListener('click', () => { void submit(true); });
    byId('clear').addEventListener('click', () => {
      store.clear(); lastRequest = null; byId('repeat').disabled = true; renderRecords();
      byId('status').textContent = 'Изчистени са само учебните записи. Напредъкът в Академията не е променен.';
    });
    byId('run-checks').addEventListener('click', async () => {
      const results = await runChecks();
      byId('checks').replaceChildren(...results.map((result) => {
        const item = document.createElement('li'); item.className = result.passed ? 'passed' : 'failed';
        item.textContent = `${result.passed ? 'Преминато' : 'Нужна е поправка'}: ${result.label}`; return item;
      }));
    });
    renderRecords();
    return { store, submit };
  }

  global.TavoraRequestLab = { makeMemoryStore, processRequest, runChecks, init };
  if (global.document) init(global.document);
})(window);
