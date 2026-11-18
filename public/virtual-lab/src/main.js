import { LabEngine } from './core/lab-engine.js';
import { ProtocolTracker } from './core/protocol.js';
import { PcrChain, ACTIONS } from './core/pcr-chain.js';
import { MendelLab, PEA_ACTIONS } from './core/mendel.js';
import { FlyLab, FLY_ACTIONS } from './core/fly-lab.js';
import { evaluateClimate } from './core/climate.js';
import { Titration, TITRATION_ACTIONS } from './core/titration.js';
import { ZebrafishLab, ZF_ACTIONS } from './core/zebrafish.js';
import { SpectroLab, UV_ACTIONS } from './core/spectro-lab.js';
import { CentrifugeLab, CF_ACTIONS, LOADS } from './core/centrifuge-lab.js';
import { HplcLab, HPLC_ACTIONS } from './core/hplc-lab.js';
import { MicroscopeLab, MIC_ACTIONS } from './core/microscope-lab.js';
import { QpcrLab, QPCR_ACTIONS } from './core/qpcr-lab.js';
import { NanodropLab, ND_ACTIONS, ND_SAMPLES } from './core/nanodrop-lab.js';
import { VortexLab, VX_ACTIONS, VX_SAMPLES } from './core/vortex-lab.js';
import { PlateLab, PR_ACTIONS, PR_ASSAYS } from './core/plate-lab.js';
import { AutoclaveLab, AC_ACTIONS } from './core/autoclave-lab.js';
import { LcmsLab, MS_ACTIONS, MS_PREP } from './core/lcms-lab.js';
import { BscLab, BSC_ACTIONS } from './core/bsc-lab.js';
import { ColdLab, INV_ACTIONS, BACKUPS } from './core/cold-lab.js';
import { HeatLab, HP_ACTIONS, HP_CUPS } from './core/heat-lab.js';
import { BalanceLab, BAL_ACTIONS, BAL_FLASKS } from './core/balance-lab.js';
import { HoodLab, FH_ACTIONS, SASH_STOPS, BATHS } from './core/hood-lab.js';
import { Safety, PPE } from './core/safety.js';
import { EmergencyLab, EM_ACTIONS, FIRES, AGENTS, WASTES, BINS, SPILLS, SPILL_METHODS } from './core/emergency.js';
import { Session } from './core/session.js';
import { BiochemLab, BC_ACTIONS, TUBES, BATH_SETS } from './core/biochem.js';
import { EnzymeLab, EZ_ACTIONS } from './core/enzyme.js';
import { MicroLab, MB_ACTIONS } from './core/micro.js';
import { MolbioLab, MO_ACTIONS } from './core/molbio.js';
import { ProteomicsLab, PR_ACTIONS2, rfOf } from './core/proteomics.js';
import { gel2d, sdsGel } from './ui/protein-gel.js';
import { ChickLab, CK_ACTIONS } from './core/chick.js';
import { PurifyLab, PU_ACTIONS } from './core/purify.js';
import { FlameLab, FL_ACTIONS, FL_TARGETS } from './core/flame.js';
import { GeoLab, GEO_ACTIONS, decodeHeight, dms } from './core/geo.js';
import { DissectLab, DIS_ACTIONS } from './core/dissect.js';
import { DnaExtractLab, DX_ACTIONS } from './core/dna-extract.js';
import { SlideLab, SL_ACTIONS } from './core/slides.js';
import { GenChemLab, GC_ACTIONS } from './core/genchem.js';
import { PcrMixLab, PM_ACTIONS } from './core/pcrmix.js';
import { EcoSampleLab, ECO_ACTIONS } from './core/sampling.js';
import { MicroCountLab, VS_ACTIONS } from './core/microcount.js';
import { gramSvg } from './ui/gram-svg.js';
import { tubeSwatch } from './ui/tube-swatch.js';
import { slideSvg } from './ui/slide-svg.js';
import { dissectSvg } from './ui/dissect-svg.js';
import { ExosomeLab, EXO_ACTIONS } from './core/exosome.js';
import { StatsLab, ST_ACTIONS } from './core/stats-lab.js';
import { chickSvg } from './ui/chick-svg.js';
import { EvolutionLab, EV_ACTIONS } from './core/evolution.js';
import { barCi } from './ui/bar-ci.js';
import { FieldEcoLab, FE_ACTIONS } from './core/fieldeco.js';
import { stepsFromJournal, validateProtocol, slug, examScore, groupKeysOf } from './core/protocol-builder.js';
import { makeAssignment, makeSubmission, parseClassFile } from './core/classroom.js';
import { createProtocolEditor } from './ui/protocol-editor.js';
import { labReport, reportFileName } from './core/report.js';
import { flySvg } from '../figures/stereo/model.mjs';
import { CONTAINERS, ZONES, MACHINES_3D, FUME_HOOD, COLD_UNITS, ROOM, INSTRUMENT_BENCHES, BENCH } from './scene/layout.js';
import { createLabScene } from './scene/lab-scene.js';
import { createSplit } from './ui/split.js';
import { createNavConsole } from './ui/nav-console.js';
import { QUALITY } from './scene/quality.js';
import { createProtocolPanel } from './ui/protocol-panel.js';
import { createClimatePanel } from './ui/climate-panel.js';
import { createGardenPanel } from './ui/garden-panel.js';
import { createFlyPanel } from './ui/fly-panel.js';
import { createChemPanel } from './ui/chem-panel.js';
import { titrationChart } from './ui/titration-chart.js';
import { createZfPanel } from './ui/zf-panel.js';
import { embryoRow } from './ui/embryo-svg.js';
import { doseChart } from './ui/dose-chart.js';
import { createToolPanel } from './ui/tool-panel.js';
import { createHandPanel } from './ui/hand-panel.js';
import { createSound } from './ui/sound.js';
import { HAND, pourVolume, dropsVolume, Micropipette } from './core/handling.js';
import { PCR } from '../figures/thermocycler/model.mjs';
const PCR_CYCLES = PCR.cycles;
import { rng as seededRng } from './core/random.js';
import { LabOps, OPS_ACTIONS } from './core/labops.js';
import { LabClock, clockText, leftText } from './core/labclock.js';
import { RUN_SECONDS as PCR_SECONDS } from '../figures/thermocycler/model.mjs';
import { xyChart } from './ui/xy-chart.js';
import { sporeSvg, diskSvg } from './ui/micro-svg.js';
import { traceChart } from './ui/trace-chart.js';
import { curvesChart } from './ui/curves-chart.js';
import { esc } from './ui/format.js';

const $ = (sel) => document.querySelector(sel);
const loading = $('#loading');

async function loadJSON(name) {
  const res = await fetch(`data/${name}.json`);
  if (!res.ok) throw new Error(`data/${name}.json: HTTP ${res.status}`);
  return res.json();
}

// Lưới độ cao của bản đồ Cát Bà (data/catba/height.png, R × 256 + G = dm, B = phần đất). Đọc nguyên giá trị điểm ảnh,
// không đổi không gian màu. Không tải được thì bản đồ vẫn có ảnh nền nhưng phẳng, không đọc được độ cao.
async function loadHeight(meta) {
  try {
    const res = await fetch(`data/catba/${meta.height.file}`);
    if (!res.ok) return null;
    const bmp = await createImageBitmap(await res.blob(), { colorSpaceConversion: 'none', premultiplyAlpha: 'none' });
    const cv = document.createElement('canvas');
    cv.width = bmp.width;
    cv.height = bmp.height;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(bmp, 0, 0);
    return decodeHeight(ctx.getImageData(0, 0, bmp.width, bmp.height).data, bmp.width, bmp.height);
  } catch {
    return null;
  }
}

function fail(message, err) {
  loading.hidden = false;
  loading.classList.add('is-error');
  loading.textContent = message;
  if (err) console.error(err);
}

// Hình cận cảnh chi tiết của từng máy (dựng bằng bộ công cụ isometric, xem figures/).
const DETAILS = {
  pcr: { title: 'Máy PCR · chu trình nhiệt', file: 'figures/thermocycler/thermocycler' },
  gel: { title: 'Điện di gel agarose', file: 'figures/electrophoresis/electrophoresis' },
  geldoc: { title: 'Máy chụp ảnh gel · UV', file: 'figures/geldoc/geldoc' },
  spectro: { title: 'Máy quang phổ UV-Vis', file: 'figures/spectro/spectro', zone: 'optics-bench' },
  centrifuge: { title: 'Máy ly tâm', file: 'figures/centrifuge/centrifuge', zone: 'analysis-bench' },
  microscope: { title: 'Kính hiển vi quang học', file: 'figures/microscope/microscope', zone: 'optics-bench' },
  hplc: { title: 'Sắc ký lỏng hiệu năng cao (HPLC)', file: 'figures/hplc/hplc', zone: 'analysis-bench' },
  qpcr: { title: 'Máy real-time PCR (qPCR)', file: 'figures/qpcr/qpcr', zone: 'pcr-bench' },
  nanodrop: { title: 'Máy đo nồng độ DNA', file: 'figures/nanodrop/nanodrop', zone: 'analysis-bench' },
  platereader: { title: 'Máy đọc vi đĩa', file: 'figures/platereader/platereader', zone: 'analysis-bench' },
  lcms: { title: 'Sắc ký lỏng – khối phổ (LC-MS/MS)', file: 'figures/lcms/lcms', zone: 'analysis-bench' },
  bsc: { title: 'Tủ an toàn sinh học cấp II', file: 'figures/bsc/bsc', zone: 'bsc-area' },
  stereo: { title: 'Kính lúp soi nổi · phân loại ruồi giấm', file: 'figures/stereo/stereo', zone: 'organism' },
  fumehood: { title: 'Tủ hút khí độc', file: 'figures/fumehood/fumehood', zone: 'chem' },
  zebrafish: { title: 'Giá nuôi cá ngựa vằn', file: 'figures/zebrafish/zebrafish', zone: 'organism' },
  eyewash: { title: 'Trạm tắm và rửa mắt khẩn cấp', file: 'figures/eyewash/eyewash', zone: 'safety' },
  growthchamber: { title: 'Buồng sinh trưởng', file: 'figures/growthchamber/growthchamber', zone: 'greenhouse' },
  ln2: { title: 'Bình nitơ lỏng', file: 'figures/ln2/ln2', zone: 'cold' },
  ultrafreezer: { title: 'Tủ âm sâu −80 °C', file: 'figures/ultrafreezer/ultrafreezer', zone: 'cold' },
  hotplate: { title: 'Máy khuấy từ gia nhiệt', file: 'figures/hotplate/hotplate', zone: 'bench-chem' },
  balance: { title: 'Cân phân tích', file: 'figures/balance/balance', zone: 'bench-chem' },
  waterbath: { title: 'Bể ổn nhiệt · đun cách thuỷ', file: 'figures/waterbath/waterbath', zone: 'bench-bio' },
  shaker: { title: 'Tủ ấm lắc ổn nhiệt', file: 'figures/shaker/shaker', zone: 'bsc-area' },
  sdspage: { title: 'Điện di protein SDS-PAGE', file: 'figures/sdspage/sdspage', zone: 'analysis-bench' },
  fplc: { title: 'Sắc ký protein FPLC · thu phân đoạn', file: 'figures/fplc/fplc', zone: 'analysis-bench' },
  autoclave: { title: 'Nồi hấp tiệt trùng', file: 'figures/autoclave/autoclave', zone: 'sterile-area' },
  vortex: { title: 'Máy vortex và ly tâm mini', file: 'figures/vortex/vortex', zone: 'optics-bench' },
};
const FIGURE_OF = { 'pcr-run': 'pcr', 'gel-load': 'gel', 'gel-run': 'gel', 'gel-image': 'geldoc' };
const darkTheme = () => {
  const t = document.documentElement.dataset.theme;
  return t === 'dark' || (t !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
};
// run: dữ liệu ống/gel của người dùng (PcrChain.figureData), truyền cho hình qua địa chỉ #run=…
let replaying = false;
let detailOpener = null;

function openDetail(id, run = null) {
  const d = DETAILS[id];
  if (!d || replaying) return;
  const box = $('#detail');
  $('#detail-title').textContent = run ? `${d.title} · ống của bạn` : d.title;
  const hash = run ? `#run=${encodeURIComponent(JSON.stringify(run))}` : '';
  $('#detail-frame').src = `${d.file}${darkTheme() ? '' : '-light'}.html${hash}`;
  box.hidden = false;
  if (!detailOpener && document.activeElement !== document.body) detailOpener = document.activeElement;
  $('#detail-close').focus();
}

const FLY_FREE = { genes: ['w'] };

const CHEM_ACTIONS = { 'chem-take': 'Lấy từ tủ', ...TITRATION_ACTIONS };

function start({ substances, reactions, protocols: builtinProtocols, crops, pea, fly, tools, zf, crosses, storage, thermo, safety, biochem, enzyme, micro, molbio, proteins, chick, finch, fieldeco, purify, exosome, statsData, apparatus, flameData, catbaData, catbaMeta, catbaGrid, dissection, slidesData, genchem, sampling, microbe, facility, pcrmix }) {
  const ZF_FREE = { chemical: 'PG', series: zf.chemicals[0].series, perWell: 15, temp: 28.5, positive: false };
  const engine = new LabEngine({ substances, reactions, tools, thermo });
  const titration = new Titration(engine);
  const START_TOOLS = tools.tools.filter((t) => t.start).map((t) => t.id);
  const chemState = { taken: new Set(START_TOOLS), tool: 'pour', volume: 2 };
  // Thao tác tay (giai đoạn 7): micropipet và ống thuốc thử nhiễm DNA khuôn; số ngẫu nhiên theo seed của phiên
  let pipette = new Micropipette('P20');
  let handRng = Math.random;
  let pipState = { on: false, model: 'P20', volume: 20, stopA: 1, stopD: 2 };
  const stockTemplate = new Set();
  // Quy trình như phòng thật (src/core/labops.js): ra vào phòng, kho hoá chất, dụng cụ bẩn, nhãn, nhật ký thiết bị, cuối buổi
  const roomNames = { 'open-lab': 'phòng thí nghiệm chung', anteroom: 'phòng đệm', wing: 'hành lang khu máy', 'post-pcr': 'phòng sau PCR', wash: 'phòng rửa', analysis: 'phòng máy phân tích', bsl2: 'phòng vi sinh BSL-2', corridor: 'hành lang', store: 'kho hoá chất', husbandry: 'phòng nuôi sinh vật' };
  const labOps = new LabOps({ roomName: (id) => roomNames[id] ?? id, rules: facility?.ops ?? {} });
  const bottleName = (id) => { const x = substances.find((q) => q.id === id); return !x ? id : x.unknown || x.solvent || !x.formula ? x.label ?? x.name : `${x.formula} ${x.conc ?? ''}`.trim(); };
  const machineName = (id) => MACHINES_3D.find((m) => m.id === id)?.name ?? id;
  const containerName = (id) => CONTAINERS.find((c) => c.id === id)?.name ?? id;
  function syncOps() {
    const bottles = substances.filter((x) => x.kind === 'chem' && !x.solid && (x.shelf === 'chem' || chemState.taken.has(x.id))).map((x) => [x.id, bottleName(x.id), labOps.left(x.id), labOps.caps.has(x.id), labOps.bottleAge(x.id)]);
    const machines = (facility?.ops?.booking?.machines ?? []).map((id) => [id, machineName(id)]);
    handPanel?.opsState({ containers: CONTAINERS.map((c) => [c.id, c.name]), bottles, booking: { machines, now: labClock.now, list: labOps.bookings }, box: labOps.box });
  }
  function opsAction(action, p = {}) {
    if (action === 'refresh') { syncOps(); return; }
    if (action === 'ops-log') { showNotebook(labOps, 'nhat-ky-thiet-bi.csv'); return; }
    note('ops', action, p);
    let res = { events: [] };
    if (action === 'ops-wash') res = labOps.wash();
    if (action === 'ops-wipe') res = labOps.wipe();
    if (action === 'ops-refill') res = labOps.refill(p.substance);
    if (action === 'ops-label') { res = labOps.label(p.container, p.text); if (res.ok) lab.setContainerLabel(p.container, labOps.labels.get(p.container)); }
    if (action === 'ops-clean') res = labOps.clean(p.container);
    if (action === 'ops-cap') { res = labOps.closeCap(p.substance); if (res.ok) lab.setCap(p.substance, false); }
    if (action === 'ops-book') res = labOps.book(p.machine, machineName(p.machine), Number(p.t0), Number(p.minutes));
    if (action === 'ops-store') {
      const names = engine.contents(p.container).map((x) => x.formula ?? x.label ?? x.name);
      res = labOps.store(p.container, names, containerName(p.container));
      if (res.ok) {
        engine.empty(p.container);
        lab.setContainerLabel(p.container, '');
        lab.setAppearance(p.container, engine.appearance(p.container), { instant: true });
      }
    }
    if (action === 'ops-empty') {
      const gone = engine.empty(p.container);
      res = labOps.empty(p.container);
      lab.setContainerLabel(p.container, '');
      lab.setAppearance(p.container, engine.appearance(p.container), { instant: true });
      if (gone.length) res.events.push({ type: 'effect', text: `Đã đổ: ${gone.map((x) => x.formula ?? x.label ?? x.name).join(', ')}.` });
    }
    if (action === 'ops-end') {
      const on = MACHINES_3D.filter((m) => usedMachines.has(m.id) && !powerOff.has(m.id) && m.id !== 'shaker').map((m) => m.name);
      res = labOps.endSession({ machinesOn: on, worn: safetyCheck.worn, names: containerName, bottles: bottleName });
    }
    if (!replaying) panel.addMachine({ events: res.events }, null);
    syncOps();
  }
  // Máy đang tắt (bấm màn hình máy trong cảnh 3D để bật, tắt); id theo MACHINES_3D
  const powerOff = new Set();
  const usedMachines = new Set(); // máy đã chạy trong buổi: cuối buổi phải tắt
  // Đồng hồ chung theo thời gian thật (src/core/labclock.js): máy có thời gian chạy thì thẻ kết quả hiện khi máy chạy xong;
  // tua ×10, ×60 hoặc "Chờ xong". Khi chạy lại phiên hoặc chạy tự động (navigator.webdriver) thì cho kết quả ngay, trừ khi
  // địa chỉ có ?clock=real. Thời gian chạy lấy từ JOB_SECONDS, nếu không có thì từ trường seconds mà lõi trả về (nồi hấp,
  // qPCR, HPLC, LC-MS/MS).
  const labClock = new LabClock();
  const realClock = () => !replaying && (!navigator.webdriver || new URLSearchParams(location.search).get('clock') === 'real');
  const JOB_SECONDS = { 'cf-run': (p) => Number(p.minutes ?? 10) * 60, 'pcr-run': () => PCR_SECONDS, 'gel-run': (p, res) => (res.minutes ?? 30) * 60 };
  // Hoãn thẻ kết quả tới khi máy chạy xong; trả về true nếu đã hoãn
  function deferResult(action, params, res, prog, machineId, name) {
    const secs = JOB_SECONDS[action]?.(params, res) ?? res.seconds ?? 0;
    if (!(secs > 0) || res.ok === false || !realClock()) return false;
    const job = labClock.start(name, secs, { res, machineId });
    panel.addMachine({ events: [{ type: 'machine', label: 'Đang chạy', text: `${name}: khoảng ${leftText(secs)}. Kết quả hiện khi máy chạy xong; tua ×10, ×60 hoặc bấm "Chờ xong" ở đồng hồ.` }] }, prog);
    job.data.prog = prog;
    syncClock();
    return true;
  }
  function finishJobs(done) {
    for (const j of done) {
      panel.addMachine(j.data.res, null);
      lab.setScreen(j.data.machineId, { lines: ['Xong', clockText(labClock.now)] });
      sound?.beep();
    }
    if (done.length) syncClock();
  }
  function syncClock() {
    const el = document.getElementById('lab-clock');
    if (!el) return;
    el.querySelector('.clock-time').textContent = clockText(labClock.now);
    const run = labClock.running();
    el.querySelector('.clock-wait').disabled = !run.length;
    el.querySelector('.clock-jobs').textContent = run.map((j) => `${j.name} còn ${leftText(labClock.remaining(j))}`).join(' · ');
    for (const j of run) lab.setScreen(j.data.machineId, { lines: ['Đang chạy', `Còn ${leftText(labClock.remaining(j))}`] });
  }
  const FIG3D = { thermocycler: 'pcr', electrophoresis: 'gel' };
  const id3Of = (key) => FIG3D[MACHINES[key]?.figure] ?? MACHINES[key]?.figure;
  let handPanel = null;
  let sound = null;
  const syncPip = () => handPanel?.pipState({ ...pipState, tip: Boolean(pipette.tip), tipUsed: pipette.tip?.used ? substances.find((x) => x.id === pipette.tip.used)?.label ?? pipette.tip.used : null });
  function pipAction(kind, p = {}) {
    note('hand', kind, p);
    let res = { events: [] };
    if (kind === 'mode') pipState.on = Boolean(p.on);
    if (kind === 'model') { pipette.select(p.model); pipState.model = pipette.model; pipState.volume = pipette.volume; }
    if (kind === 'volume') { res = pipette.setVolume(p.uL); if (res.ok) pipState.volume = p.uL; }
    if (kind === 'tip') res = pipette.attachTip();
    if (kind === 'eject') res = pipette.ejectTip();
    if (kind === 'stops') { pipState.stopA = p.stopA; pipState.stopD = p.stopD; }
    if (kind === 'power') {
      if (p.on) powerOff.delete(p.id); else powerOff.add(p.id);
      lab?.setScreen(p.id, { on: p.on });
      res.events.push({ type: 'machine', text: `${p.on ? 'Bật' : 'Tắt'} ${MACHINES_3D.find((m) => m.id === p.id)?.name ?? p.id}.` });
    }
    if (res.events.length && !replaying) panel.addMachine({ events: res.events }, null);
    syncPip();
  }
  CONTAINERS.forEach((c) => engine.addContainer(c));
  // Protocol có sẵn và protocol tự soạn (lưu trong trình duyệt, khoá virtual-lab:protocols)
  const MINE = 'virtual-lab:protocols';
  const loadMine = () => {
    try {
      const list = JSON.parse(localStorage.getItem(MINE) ?? '[]');
      return Array.isArray(list) ? list.filter((p) => p?.id?.startsWith('my-') && Array.isArray(p.steps)) : [];
    } catch {
      return [];
    }
  };
  const protocols = [...builtinProtocols, ...loadMine()];
  const tracker = new ProtocolTracker(protocols[0]);
  const chain = new PcrChain({ substances, tubes: CONTAINERS.filter((c) => c.kind === 'tube') });
  const CLIMATE0 = { temp: 18, humidity: 65, light: 75, weather: 'sun', irrigation: 'auto' };
  let climateLevel = evaluateClimate(crops[0], CLIMATE0).tempLevel;
  let climateState = { ...CLIMATE0 };
  let climatePanel = null;
  const mendel = new MendelLab({ pea, setup: pea.free, climateLevel: () => climateLevel, species: crosses, climate: () => climateState, crops });
  const flies = new FlyLab({ fly, setup: FLY_FREE });
  const fish = new ZebrafishLab({ zf, setup: ZF_FREE });
  const spectro = new SpectroLab();
  const centri = new CentrifugeLab();
  const hplc = new HplcLab();
  const scope = new MicroscopeLab();
  const qpcr = new QpcrLab();
  const nd = new NanodropLab();
  const vx = new VortexLab();
  const pr = new PlateLab();
  const ac = new AutoclaveLab();
  const ms = new LcmsLab();
  const bsc = new BscLab();
  const coldLab = new ColdLab(storage);
  let ultOpenedAt = null;
  const heatLab = new HeatLab(engine);
  const bal = new BalanceLab();
  const hoodLab = new HoodLab(thermo.equilibria.N2O4_from_NO2);
  const safetyCheck = new Safety(safety);
  const emLab = new EmergencyLab(safety);
  const bc = new BiochemLab(biochem);
  const ez = new EnzymeLab(enzyme);
  const mb = new MicroLab(micro);
  const mo = new MolbioLab(molbio);
  const pt = new ProteomicsLab(proteins);
  const ck = new ChickLab(chick);
  const ev = new EvolutionLab(finch);
  const fe = new FieldEcoLab(fieldeco);
  const pu = new PurifyLab(purify);
  const fl = new FlameLab(engine, flameData);
  const exo = new ExosomeLab(exosome);
  const st = new StatsLab(statsData);
  const geo = new GeoLab(catbaData, catbaMeta, catbaGrid);
  const dis = new DissectLab(dissection);
  const dx = new DnaExtractLab();
  const sl = new SlideLab(slidesData);
  const gc = new GenChemLab(genchem);
  const pm = new PcrMixLab(pcrmix);
  const eco = new EcoSampleLab(sampling);
  const vs = new MicroCountLab(microbe);
  let slideUid = 0;
  const feSpecies = Object.fromEntries(Object.entries(fieldeco.sites).map(([k, v]) => [k, v.species]));
  // Phiên làm việc: nhật ký thao tác có seed, tự lưu vào trình duyệt, xuất/nhập file JSON (src/core/session.js)
  const STORE = 'virtual-lab:session';
  let session = new Session({ seed: Date.now() });
  function persist() {
    if (replaying) return;
    try {
      localStorage.setItem(STORE, session.stringify());
      panel.sessionState(session.length ? `Tự lưu trong trình duyệt · ${session.length} thao tác` : '');
    } catch {
      panel.sessionState('Trình duyệt không cho lưu: dùng "Lưu file phiên".');
    }
  }
  function note(kind, action, params = {}, opts) {
    if (replaying) return;
    session.record(kind, action, params, opts);
    persist();
  }
  // Máy ở Khu máy móc dùng bảng điều khiển chung: lõi mô phỏng, hình cận cảnh, khu camera
  const MACHINES = {
    uv: { lab: spectro, figure: 'spectro', zone: 'optics-bench', status: () => `${spectro.lambda} nm${spectro.blanked ? ' · đã trừ mẫu trắng' : ''}` },
    cf: { lab: centri, figure: 'centrifuge', zone: 'analysis-bench', status: () => (centri.last ? `lần chạy gần nhất ${Math.round(centri.last.rcf)} × g` : 'sẵn sàng') },
    hplc: { lab: hplc, figure: 'hplc', zone: 'analysis-bench', status: () => `${hplc.method.organic} % acetonitrile · ${String(hplc.method.flow).replace('.', ',')} mL/phút` },
    mic: { lab: scope, figure: 'microscope', zone: 'optics-bench', status: () => `${scope.objective}× · ${scope.specimen === 'onion' ? 'biểu bì hành' : 'phết máu'}${scope.oil ? ' · có dầu' : ''}` },
    qpcr: { lab: qpcr, figure: 'qpcr', zone: 'pcr-bench', status: () => (qpcr.result ? 'đã chạy 40 chu kỳ' : qpcr.wells ? `đĩa ${qpcr.wells.length} giếng` : 'chưa pha đĩa') },
    inv: { lab: coldLab, get figure() { return coldLab.figure; }, zone: 'cold', status: () => { const out = coldLab.inv.table().filter((r) => r.place === 'bench' || r.place === 'ice').length; return out ? `${out} ống đang ở ngoài` : 'mọi ống trong tủ'; } },
    bsc: { lab: bsc, figure: 'bsc', zone: 'bsc-area', status: () => `kính ${bsc.setting.sash} mm · ${bsc.state.message.charAt(0).toLowerCase()}${bsc.state.message.slice(1)}` },
    ms: { lab: ms, figure: 'lcms', zone: 'analysis-bench', status: () => `${ms.channel.analyte} kênh ${ms.channel.transition === 0 ? 'định lượng' : 'xác nhận'}${ms.cal ? ' · có đường chuẩn' : ''}` },
    ac: { lab: ac, figure: 'autoclave', zone: 'sterile-area', status: () => (ac.run ? `đã chạy ${ac.run.temp} °C, ${ac.run.holdMin} phút` : ac.load ? 'đã xếp mẻ hấp' : 'buồng trống') },
    pr: { lab: pr, figure: 'platereader', zone: 'analysis-bench', status: () => (pr.plate ? `${PR_ASSAYS[pr.plate.id].name}${pr.read ? ' · đã đọc' : ''}` : 'khay trống') },
    vx: { lab: vx, figure: 'vortex', zone: 'optics-bench', status: () => `trộn ${Math.round(vx.mixed * 100)} %${vx.drops > 0.01 ? ' · còn giọt bám nắp' : ''}` },
    hp: { lab: heatLab, figure: 'hotplate', zone: 'bench-chem', status: () => { const c = heatLab.last.cup; const T = engine.temperature(c); return `${HP_CUPS[c]} ${T.toFixed(0)} °C${T > 30 ? ' · đang nóng' : ''}`; } },
    bal: { lab: bal, figure: 'balance', zone: 'bench-chem', status: () => (bal.boat ? `${bal.tare === false ? 'chưa trừ bì' : 'đã trừ bì'} · cửa ${bal.doorsOpen ? 'mở' : 'đóng'}${bal.recorded !== null ? ` · đã ghi ${bal.recorded.toFixed(4).replace('.', ',')} g` : ''}` : 'đĩa trống') },
    fh: { lab: hoodLab, figure: 'fumehood', zone: 'chem', status: () => { const s = hoodLab.state(); return `kính ${s.sash} mm · ${s.fan ? `${s.velocity.toFixed(2).replace('.', ',')} m/s` : 'quạt tắt'}${s.alarms.length ? ' · báo động' : ''}`; } },
    em: { lab: emLab, figure: 'eyewash', zone: 'safety', status: () => (emLab.last.mode === 'off' ? 'sẵn sàng' : `vừa rửa ${emLab.last.minutes} phút`) },
    bc: { lab: bc, figure: 'waterbath', zone: 'bench-bio', status: () => { const n = bc.tubes.filter((t) => t.sample).length; return `bể ${bc.bath.setC === null ? 'tắt' : `${Math.round(bc.bath.waterC)} °C`} · ${n ? `${n} ống có mẫu` : 'giá trống'}`; } },
    ez: { lab: ez, figure: 'waterbath', zone: 'bench-bio', status: () => (ez.tubes.size ? `${ez.tubes.size} ống enzyme${ez.points.length ? ` · ${ez.points.length} điểm p-NPP` : ''}` : 'chưa pha ống') },
    mb: { lab: mb, figure: 'shaker', zone: 'bsc-area', status: () => `${mb.plates.length} đĩa${mb.plates.some((p) => p.sample) ? ` · ${mb.plates.filter((p) => p.sample).length} đĩa đã cấy` : ''}${mb.hours ? ` · ủ ${Math.round(mb.hours)} giờ` : ''}` },
    mo: { lab: mo, figure: 'gel', zone: 'pcr-bench', status: () => (mo.prep ? `${Math.round(mo.prep.conc)} ng/µL · ${mo.digests.length} lần cắt` : 'chưa tách plasmid') },
    pt: { lab: pt, figure: 'sdspage', zone: 'analysis-bench', status: () => (pt.spots.length ? `gel 2D ${pt.spots.length} spot${pt.peaks ? ` · ${pt.peaks.length} đỉnh MS` : ''}` : pt.gel ? 'gel SDS' : 'chưa chạy gel') },
    ck: { lab: ck, figure: null, zone: 'organism', status: () => (ck.eggs.length ? `${ck.eggs.length} trứng · ấp ${Math.round(ck.hours)} giờ` : 'máy ấp trống') },
    ev: { lab: ev, figure: null, zone: 'organism', status: () => (ev.cage ? `${ev.cage.finals.length} lồng ruồi` : 'số liệu Grant 1977') },
    vs: { lab: vs, figure: null, zone: 'bsc-area', status: () => `${vs.plates.length} đĩa đếm${vs.incubated ? ' · đã ủ' : ''}` },
    eco: { lab: eco, figure: null, zone: 'organism', status: () => `${eco.Q} cốc mọt · ${eco.samples.length} lần lấy mẫu` },
    pm: { lab: pm, figure: null, zone: 'pcr-bench', status: () => `${pm.mixed ? `master mix ${pm.mixed.reactions} phản ứng` : 'chưa pha mix'} · ${pm.tdLanes.length} làn PCR · ${Object.keys(pm.rapdRuns).length} mồi RAPD` },
    gc: { lab: gc, figure: null, zone: 'bench-chem', status: () => `${Object.keys(gc.sol).length} dung dịch · ${gc.trials.length} lần chuẩn độ` },
    sl: { lab: sl, figure: null, zone: 'optics-bench', status: () => (sl.spec ? `${sl.spec.name}${sl.view ? ` · ${sl.view.mag}×` : ''}` : 'chưa có tiêu bản') },
    dx: { lab: dx, figure: null, zone: 'bench-bio', status: () => (dx.s ? `${dx.s.done.length} bước · ${dx.s.done.includes('dissolve') ? 'đã có DNA' : 'đang tách'}` : 'chưa có mẫu') },
    dis: { lab: dis, figure: null, zone: 'dissect', status: () => (dis.spec ? `${dis.spec.name} · ${dis.state.open ? 'đã mở' : dis.state.cut ? 'đã cắt' : dis.state.place ? dissection.places[dis.state.place] : 'chưa đặt'} · thấy ${dis.state.seen.size}/${dis.spec.required.length} cơ quan` : 'khay trống') },
    geo: { lab: geo, figure: null, zone: 'catba', status: () => `${geo.layer === 'height' ? 'lớp độ cao' : 'ảnh vệ tinh'}${geo.grid ? '' : ' · chưa tải được độ cao'} · ${geo.notebook.rows.length} lần đọc` },
    fl: { lab: fl, figure: null, zone: 'bench-chem', status: () => `đèn ${fl.lamp.lit ? 'đang cháy' : 'đã tắt'} · còn khoảng ${Math.round(fl.lamp.fuel)} g cồn${fl.wire.clean ? '' : ' · dây đốt chưa làm sạch'}` },
    pu: { lab: pu, figure: 'fplc', zone: 'analysis-bench', status: () => (pu.history.length ? `${pu.history.map((h) => ({ crude: 'nọc thô', sec: 'SEC', cex: 'CEX', rp: 'RP-HPLC' })[h.step]).join(' → ')}${pu.run && !pu.run.pool ? ` · đang có sắc ký đồ ${pu.run.column.toUpperCase()}` : ''}` : 'chưa có mẫu') },
    exo: { lab: exo, figure: null, zone: 'analysis-bench', status: () => (exo.pool ? `EV gộp phân đoạn ${exo.pool.from}–${exo.pool.to}` : exo.fractions ? '20 phân đoạn' : exo.sample ? 'huyết tương đã chuẩn bị' : 'chưa có mẫu') },
    st: { lab: st, figure: null, zone: null, status: () => (st.ds ? `${st.ds.name} · ${st.ds.columns.length} cột` : 'chưa nạp số liệu') },
    fe: { lab: fe, figure: null, zone: 'field', status: () => `${Object.values(fe.samples).reduce((n, a) => n + a.length, 0)} ô đã đếm · ${fe.catches.length} lần đặt bẫy` },
    nd: { lab: nd, figure: 'nanodrop', zone: 'analysis-bench', status: () => `${nd.blank ? `mẫu trắng: ${nd.blank}` : 'chưa đo mẫu trắng'}${nd.dirty ? ' · bệ chưa lau' : ''}` },
  };
  const machineOf = (action) => ({ uv: 'uv', cf: 'cf', hplc: 'hplc', mic: 'mic', qpcr: 'qpcr', nd: 'nd', vx: 'vx', pr: 'pr', ac: 'ac', ms: 'ms', bsc: 'bsc', inv: 'inv', hp: 'hp', bal: 'bal', fh: 'fh', em: 'em', tt: 'bc', wb: 'bc', bc: 'bc', ez: 'ez', mb: 'mb', mo: 'mo', pt: 'pt', ck: 'ck', ev: 'ev', fe: 'fe', pu: 'pu', exo: 'exo', st: 'st', fl: 'fl', geo: 'geo', dis: 'dis', dx: 'dx', sl: 'sl', gc: 'gc', eco: 'eco', vs: 'vs', pm: 'pm' })[action.split('-')[0]];
  function runMachine(action, params = {}) {
    note('machine', action, params);
    const key = machineOf(action);
    const m = MACHINES[key];
    if (powerOff.has(id3Of(key))) {
      panel.addMachine({ events: [{ type: 'warning', label: 'Máy đang tắt', text: `${MACHINES_3D.find((x) => x.id === id3Of(key))?.name ?? 'Máy'} đang tắt: bấm vào màn hình máy trong phòng để bật trước khi chạy.` }] }, null);
      return;
    }
    // Biến nạp: tế bào khả biến lấy hoạt tính theo kho lạnh; làm "trong tủ an toàn sinh học" chỉ vô trùng khi tủ đang bảo vệ mẫu
    const extra = {};
    if (action === 'mb-transform') extra.activity = coldLab.activities(['competent']).competent;
    if ((action === 'mb-pour' || action === 'mb-spread') && (params.where ?? 'bsc') === 'bsc') extra.sterile = Boolean(bsc.state.product);
    if (action === 'st-load' && String(params.source).startsWith('nb:')) { const nb = NOTEBOOKS[Number(params.source.slice(3))]; extra.rows = nb?.[0].notebook.rows ?? []; extra.label = nb?.[1]; }
    const res = m.lab.do(action, { ...params, ...extra });
    if (action === 'mb-transform' && !coldLab.usable('competent')) res.events.push({ type: 'warning', label: 'Lưu ý', text: `Ống tế bào khả biến đang ở ${coldLab.placeName(coldLab.inv.placeOf('competent'))}: lấy ra hộp đá cho rã trước khi biến nạp.` });
    if (res.hazard) res.events.push(...safetyCheck.warnings(res.hazard, biochem.reagents[params.reagent]?.name ?? res.hazard, { concentrated: true }));
    if (action === 'fh-work') res.events.push(...safetyCheck.warnings('HNO3', 'HNO₃ đặc', { concentrated: true, extra: ['coat', 'gloves', 'goggles'] }));
    if (action === 'uv-curve' && res.fit) {
      res.html = xyChart({ points: res.points.map((p) => [p.c * 1e6, p.A]), fit: res.fit, unknown: res.result !== null && res.unknown ? [res.result / res.unknown.dilution, res.unknown.A] : null, xLabel: 'C (µM)', yLabel: `A${spectro.lambda}` });
    }
    if (action === 'hplc-calibrate' && res.fit) res.html = xyChart({ points: res.points, fit: res.fit, xLabel: 'caffeine (µg/mL)', yLabel: 'diện tích (mAU·s)' });
    else if (action.startsWith('hplc-pc') && res.pcTrace) res.html = traceChart(res.pcTrace, { peaks: res.peaks, yLabel: 'tín hiệu' });
    else if (action.startsWith('hplc-') && res.run) res.html = traceChart(hplc.trace(), { peaks: res.run.peaks });
    if (action === 'qpcr-run' && res.series) res.html = curvesChart(res.series, { threshold: res.threshold, xLabel: 'chu kỳ', yLabel: 'RFU (đã trừ nền)', aria: 'Đường khuếch đại qPCR' });
    if (action === 'qpcr-melt' && res.series) res.html = curvesChart(res.series, { xLabel: 'nhiệt độ (°C)', yLabel: '−dF/dT', aria: 'Đường nóng chảy' });
    if (action === 'ms-standards' && res.fit) res.html = xyChart({ points: res.points, fit: res.fit, xLabel: 'C (ng/mL)', yLabel: 'diện tích' });
    if (action === 'ms-sample' && res.trace) res.html = curvesChart([{ name: 'MRM', points: res.trace }], { xLabel: 'phút', yLabel: 'cps', xDigits: 1, aria: 'Sắc ký đồ MRM' });
    if (action === 'ac-run' && res.series) res.html = curvesChart(res.series, { threshold: res.threshold, xLabel: 'phút', yLabel: '°C', aria: 'Nhiệt độ buồng và dịch trong chai theo thời gian' });
    if (action === 'pr-analyse' && res.fit) res.html = xyChart({ points: res.points, fit: { a: res.fit.intercept, b: res.fit.slope }, xLabel: `C (${res.unit})`, yLabel: 'A − A(trắng)' });
    if (action === 'qpcr-quant' && res.curve) res.html = xyChart({ points: res.points, fit: { a: res.curve.intercept, b: res.curve.slope }, unknown: res.unknown, xLabel: 'log₁₀ số bản', yLabel: 'Ct' });
    if ((action === 'gc-eq' || action === 'gc-an-test' || action === 'gc-mohr-qual') && res.tubes) res.html = tubeSwatch(res.tubes);
    if (action === 'gc-cal-run' && res.series) res.html = curvesChart(res.series, { xLabel: 'giây', yLabel: '°C', zero: false, aria: 'Nhiệt độ trong nhiệt lượng kế theo thời gian, hiệu chỉnh Δt bằng đồ thị' });
    if (action === 'gc-rate-plot' && res.fit) res.html = xyChart({ points: res.points.map(([c, v]) => [c, v * 1000]), fit: { a: 0, b: res.fit.b * 1000 }, xLabel: '[Na₂S₂O₃] (M)', yLabel: 'v = 1/Δt (10⁻³ s⁻¹)' });
    if (action === 'gc-rate-plot' && res.series) res.html = curvesChart(res.series, { xLabel: '1/T (10⁻³ K⁻¹)', yLabel: 'lg(1/Δt)', xDigits: 3, aria: 'lg(1/Δt) theo 1/T' });
    if (action === 'vs-gram' && res.gram) res.html = gramSvg(res.gram, microbe.gram.colors, ++slideUid);
    if (action === 'vs-spore' && res.spore) res.html = sporeSvg(res.spore, microbe.spore.colors, ++slideUid);
    if (action === 'vs-disk' && res.plate) res.html = diskSvg(res.plate);
    if (action === 'vs-ferment' && res.tubes) res.html = tubeSwatch(res.tubes);
    if (action === 'pm-melt' && res.series) res.html = curvesChart(res.series, { xLabel: '°C', yLabel: 'A260 / A260 (40 °C)', zero: false, aria: 'Đường cong nóng chảy DNA đo bằng A260' });
    if (action === 'gc-titrate' && res.points) res.html = titrationChart(res.points, { vEq: res.vEq, reading: res.reading });
    if ((action === 'sl-view' || action === 'sl-find') && res.field) res.html = slideSvg(res.field, ++slideUid);
    if (key === 'dis' && dis.spec && ['dis-place', 'dis-cut', 'dis-open', 'dis-remove', 'dis-observe', 'dis-check'].includes(action)) res.html = dissectSvg(dis.spec, dis.figureData(), res.organ ?? null);
    if (action === 'geo-route' && res.series) res.html = curvesChart(res.series, { xLabel: 'km', yLabel: 'm', aria: 'Mặt cắt địa hình dọc đường chim bay' });
    if (action === 'fl-heat' && res.series) res.html = curvesChart(res.series, { xLabel: 'giây', yLabel: '°C', aria: 'Nhiệt độ trong vật chứa theo thời gian đun' });
    if ((action === 'hp-heat' || action === 'hp-cool') && res.series) res.html = curvesChart(res.series, { xLabel: 'phút', yLabel: '°C', aria: 'Nhiệt độ dung dịch theo thời gian' });
    if (action === 'nd-measure' && res.spectrum) res.html = curvesChart([{ name: 'phổ', points: res.spectrum }], { xLabel: 'bước sóng (nm)', yLabel: 'A (10 mm)', aria: 'Phổ hấp thụ 220–350 nm' });
    if (action === 'ev-stats') res.html = barCi(res.bars);
    if (action === 'fe-bat' && res.series) res.html = curvesChart(res.series, { xLabel: 'tần số (kHz)', yLabel: 'số lượt kêu', aria: 'Phân bố tần số sóng định vị của dơi' });
    if (action === 'fe-accum' && res.series) res.html = curvesChart(res.series, { xLabel: 'số lần thu', yLabel: 'số nhóm', aria: 'Đường tích luỹ số nhóm côn trùng' });
    if (action === 'fe-quadrat' || action === 'fe-assoc') lab.setQuadrats(fe.lastQuadrats);
    if (action === 'ev-cage') res.html = curvesChart(res.series, { xLabel: 'thế hệ', yLabel: 'tần số alen a', aria: 'Tần số alen a qua các thế hệ trong từng lồng' });
    if (action === 'ck-observe' && res.stage) res.html = `<div class="fly-row">${chickSvg(ck.lastObs, 220)}</div>`;
    if (action === 'pt-2d') res.html = gel2d(pt.gel, (k) => rfOf(k, pt.gel.percent));
    if (action === 'pt-sds') res.html = sdsGel(pt.gel, (k) => rfOf(k, pt.gel.percent));
    if (action === 'pu-column' && res.run) {
      const fr = res.run.activity.map((_, i) => i + 1);
      res.html = curvesChart([{ name: 'A280 (protein)', points: fr.map((x, i) => [x, res.run.a280[i]]) }, { name: 'hoạt độ FRET', kind: 'alt', points: fr.map((x, i) => [x, res.run.activity[i]]) }, ...(res.run.salt ? [{ name: 'NaCl (0–0,65 M)', kind: 'salt', points: fr.map((x, i) => [x, res.run.salt[i]]) }] : [])], { xLabel: 'phân đoạn', yLabel: 'tương đối (đỉnh = 1)', aria: `Sắc ký đồ ${res.run.column}: A280 và hoạt độ theo phân đoạn` });
    }
    if (action === 'pu-sds' && res.gel) res.html = sdsGel(res.gel, (k) => rfOf(k, 15));
    if (action === 'st-regress' && res.points) res.html = xyChart({ points: res.points, curve: res.curve, xLabel: st.ds.columns[params.x ?? 0]?.name ?? 'x', yLabel: st.ds.columns[params.y ?? 1]?.name ?? 'y' });
    if (res.r) res.html = `${res.html ?? ''}<details class="r-code"><summary>Mã R tương đương</summary><pre class="csv" tabindex="0">${esc(res.r)}</pre></details>`;
    if ((action === 'st-load' || action === 'st-paste') && res.columns) {
      toolPanels.st.setOptions('a', res.columns, 0);
      toolPanels.st.setOptions('b', res.columns, Math.min(1, res.columns.length - 1));
    }
    if (action === 'exo-sds' && res.gel) res.html = sdsGel(res.gel, (k) => rfOf(k, 10));
    if (action === 'exo-nta' && res.series) res.html = curvesChart(res.series, { xLabel: 'đường kính (nm)', yLabel: '% số hạt', aria: 'Phân bố kích thước hạt đo bằng NTA' });
    if (action === 'ez-lb' && res.fit) res.html = xyChart({ points: res.points, fit: res.fit, xLabel: '1/[S] (mM⁻¹)', yLabel: '1/v (phút/nmol)' });
    const prog = res.ok ? tracker.recordAction(action, params) : null;
    if (res.ok !== false && !replaying) res.events = [...labOps.checkRun(id3Of(key), machineName(id3Of(key)), labClock.now), ...(res.events ?? [])];
    if (!deferResult(action, params, res, prog, id3Of(key), MACHINES_3D.find((x) => x.id === id3Of(key))?.name ?? key)) panel.addMachine(res, prog);
    toolPanels[key].status(m.status());
    if (!labClock.running().some((j) => j.data.machineId === id3Of(key))) lab.setScreen(id3Of(key), { lines: [m.status()] });
    if (res.ok) { usedMachines.add(id3Of(key)); labOps.logRun(MACHINES_3D.find((x) => x.id === id3Of(key))?.name ?? key, m.status()); labOps.work(); }
    syncControls(key, action, params);
    if (key === 'inv') syncCold();
    if (key === 'hp' || key === 'bal') syncBench();
    if (key === 'fh') syncHood();
    if (key === 'bc') lab.setTubes(bc.figureData());
    if (key === 'ez') lab.setTubes(ez.figureData());
    if (m.zone && zone !== m.zone) lab.flyTo(m.zone);
    if (key === 'fl') syncFlame(action, res);
    if (key === 'dis') { syncDissect(action); if (!replaying && action !== 'dis-check') lab.focusDissect(); }
    if (key === 'geo') {
      syncMap();
      // Nhìn gần điểm vừa chọn; đường chim bay thì lùi xa theo chiều dài đường để thấy cả hai đầu
      if (action === 'geo-site' && res.ok && !replaying) lab.focusMap(geo.toMap(res.lat, res.lon));
      if (action === 'geo-route' && res.ok && !replaying) {
        const a = geo.sites.get(res.from);
        const b = geo.sites.get(res.to);
        lab.focusMap(geo.toMap((a.lat + b.lat) / 2, (a.lon + b.lon) / 2), Math.max(1, res.dist / 3000));
      }
    }
  }
  // Khay mổ trong cảnh theo trạng thái lõi; lấy mẫu mới thì danh sách cơ quan ở bảng đổi theo mẫu
  function syncDissect(action = null) {
    lab.setDissect(dis.figureData());
    lab.setLens(toolPanels.dis?.get('lens') === 'yes');
    if ((action === 'dis-take' || action === null) && dis.spec) toolPanels.dis?.setOptions('organ', organOptions(dis.sp), dis.spec.required[0]);
  }
  const organOptions = (sp) => dissection.specimens[sp].organs.map((o) => [o.id, o.sexed ? 'Tuyến sinh dục' : o.name]);
  // Bản đồ Cát Bà trong cảnh: lớp đang xem, điểm vừa đọc toạ độ, đường chim bay vừa đo
  function syncMap() {
    lab.setMapLayer(geo.layer);
    const p = geo.lastPick;
    lab.setMapMarker(p ? geo.toMap(p.lat, p.lon) : null, p ? `${dms(p.lat, p.lon)}${p.elev === null ? '' : ` · ${Math.round(p.elev)} m`}` : '');
    const r = geo.lastRoute;
    if (!r) return lab.setMapRoute(null);
    const a = geo.sites.get(r.from);
    const b = geo.sites.get(r.to);
    const pa = geo.toMap(a.lat, a.lon);
    const pb = geo.toMap(b.lat, b.lon);
    lab.setMapRoute(Array.from({ length: 81 }, (_, k) => ({ u: pa.u + ((pb.u - pa.u) * k) / 80, v: pa.v + ((pb.v - pa.v) * k) / 80 })));
  }
  // Làm mẫu hoặc chạy protocol thì ô chọn trên bảng máy theo đúng tham số vừa dùng.
  // Khu lạnh trong cảnh 3D: đồ trên kệ tủ theo kho đồ, ống thuốc thử trên bàn chỉ hiện khi đã lấy ra
  function syncCold() {
    const rows = coldLab.inv.table();
    lab.setInventory(rows.map((r) => ({ ...r, shape: storage.items[r.id].shape, color: storage.items[r.id].color })));
    lab.setBenchReagents(Object.fromEntries(rows.map((r) => [r.id, r.place === 'bench' || r.place === 'ice'])));
    lab.setIce(rows.some((r) => r.place === 'ice'));
  }
  // Bàn hoá học: màu cốc sau khi kết tủa tan hoặc kết tinh lại, mặt đế máy khuấy nóng, trạng thái cân
  function syncBench() {
    for (const c of Object.keys(HP_CUPS)) lab.setAppearance(c, engine.appearance(c));
    lab.setHotplate(heatLab.plateC);
    lab.setBenchTool('hotplate', heatLab.plateC > 50 ? `mặt đế ${Math.round(heatLab.plateC)} °C` : '');
    lab.setBenchTool('balance', bal.boat ? `${bal.figureData().reading.toFixed(4).replace('.', ',')} g` : '');
  }
  // Tủ hút trong cảnh: độ cao kính, đèn báo động, khí nâu trong tủ hoặc tràn ra
  function syncHood() {
    const s = hoodLab.state();
    const w = hoodLab.last;
    lab.setSash(s.sash);
    lab.setHood({ alarm: s.alarms.length > 0, text: MACHINES.fh.status(), gas: w.gas === 'NO2' ? { escaped: w.where !== 'hood' || w.ppm >= 1 } : null });
  }
  // Tham số đang chọn trên bảng Đèn cồn, cho thao tác bấm ngay trong cảnh 3D (que đóm: ống vừa đun)
  function toolParams(action) {
    const g = toolPanels.fl.get;
    return {
      'fl-heat': { target: g('tg'), seconds: g('sec'), even: g('even') === 'yes', gauze: g('gz') === 'yes' },
      'fl-test': { sample: g('sub'), cobalt: g('co') === 'yes' },
      'fl-burn': { tool: g('tool') },
      'fl-splint': { target: fl.last.target },
    }[action] ?? {};
  }
  // Bộ đun bằng đèn cồn trong cảnh: ngọn lửa, hoạt cảnh đun theo dòng thời gian của lõi, màu ngọn lửa, đốt Mg, que đóm
  function syncFlame(action, res) {
    lab.setLamp(fl.lamp.lit);
    // Đang chạy lại nhật ký phiên (mở lại trang): chỉ đặt trạng thái cuối, không chạy lại hoạt cảnh
    if (replaying) {
      if (res.target && engine.containers.has(res.target)) lab.setAppearance(res.target, engine.appearance(res.target), { instant: true });
      return;
    }
    if (action === 'fl-heat' && res.timeline) lab.playHeat(res.target, res.timeline, engine.appearance(res.target), engine.containers.get(res.target).capacity);
    if (action === 'fl-test' && res.flame !== undefined) lab.flameTest(res.flame);
    if (action === 'fl-burn' && res.burst) lab.burnMg();
    if (action === 'fl-splint' && res.splint) lab.splintTest(res.target, res.splint);
  }
  function syncControls(key, action, params) {
    const t = toolPanels[key];
    if (action === 'vs-gram') { if (params.fix) t.set('fix', params.fix); if ('lugol' in params) t.set('lugol', params.lugol ? 'yes' : 'no'); if (params.decolor) t.set('dec', params.decolor); if ('safranin' in params) t.set('saf', params.safranin ? 'yes' : 'no'); if (params.age) t.set('age', params.age); }
    if (action === 'vs-dilute') { if (params.to) t.set('to', params.to); if ('mix' in params) t.set('mix', params.mix ? 'yes' : 'no'); if ('tip' in params) t.set('tip', params.tip ? 'yes' : 'no'); }
    if (action === 'vs-plate') { if (params.dils) t.set('dils', params.dils.join(',')); if (params.agarC) t.set('agar', params.agarC); }
    if (action === 'vs-incubate' && params.hours) t.set('hrs', params.hours);
    if (action === 'vs-mpn' && 'confirm' in params) t.set('conf', params.confirm ? 'yes' : 'no');
    if (action === 'vs-hemo') { if (params.dil) t.set('dil', params.dil); if (params.squares) t.set('sq', params.squares); }
    if (action === 'vs-spore') { if (params.age) t.set('spage', params.age); if ('heat' in params) t.set('spheat', params.heat ? 'yes' : 'no'); if ('counter' in params) t.set('spctr', params.counter ? 'yes' : 'no'); }
    if (action === 'vs-disk') { if (params.strain) t.set('strain', params.strain); if (params.inoculum) t.set('inoc', params.inoculum); if (params.hours) t.set('dhrs', params.hours); if (params.spacing) t.set('space', params.spacing); }
    if (action === 'hplc-pc-phase' && params.ratio) t.set('ratio', params.ratio);
    if (action === 'hplc-pc-sample') { if ('spike' in params) t.set('spike', params.spike ? 'yes' : 'no'); if (params.dilution) t.set('pcdil', params.dilution); }
    if (action === 'pm-mix') { if (params.mode) t.set('mode', params.mode); if ('bufferMg' in params) t.set('bmg', params.bufferMg ? 'yes' : 'no'); }
    if (action === 'pm-td' && params.program) t.set('prog', params.program);
    if (action === 'pm-rapd') { if (params.primer) t.set('primer', params.primer); if (params.ta) t.set('rta', params.ta); }
    if (action === 'pm-melt') { if (params.species) t.set('sp', params.species); if (params.buffer) t.set('buf', params.buffer); if (params.rate) t.set('rate', params.rate); }
    if (action === 'vs-ferment') { if ('yeast' in params) t.set('yeast', params.yeast ? 'yes' : 'no'); if (params.temp) t.set('ftemp', params.temp); if (params.hours) t.set('fhrs', params.hours); }
    if (action === 'eco-sample') { if (params.n) t.set('n', params.n); if (params.how) t.set('how', params.how); }
    if (action === 'gc-precip' && params.anion) t.set('an', params.anion);
    if (action === 'gc-filter') { if (params.fold) t.set('fold', params.fold); if (params.paper) t.set('paper', params.paper); }
    if (action === 'gc-wash' && params.times) t.set('times', params.times);
    if (action === 'gc-prep') { if (params.solution) t.set('sol', params.solution); if (params.balance) t.set('bal', params.balance); if (params.fill) t.set('fill', params.fill); }
    if (action === 'gc-titrate') { if (params.analyte) t.set('ana', params.analyte); if (params.indicator) t.set('ind', params.indicator); if ('rinse' in params) t.set('rinse', params.rinse ? 'yes' : 'no'); if ('wait' in params) t.set('wait', params.wait ? 'yes' : 'no'); }
    if (action === 'gc-redox') { if ('heat' in params) t.set('heat', params.heat ? 'yes' : 'no'); if ('acid' in params) t.set('acid', params.acid ? 'yes' : 'no'); if ('rinse' in params) t.set('rinse', params.rinse ? 'yes' : 'no'); }
    if (action === 'gc-result' && params.of) t.set('of', params.of);
    if (action === 'gc-rate-conc') { if (params.tube) t.set('rtube', params.tube); if (params.cue) t.set('cue', params.cue); if ('dry' in params) t.set('dry', params.dry ? 'yes' : 'no'); }
    if (action === 'gc-rate-temp') { if ('dT' in params) t.set('dT', params.dT); if (params.soak) t.set('soak', params.soak); }
    if (action === 'gc-rate-cat' && params.add) t.set('cat', params.add);
    if (action === 'gc-rate-plot' && params.part) t.set('part', params.part);
    if (action === 'gc-an-test') { if (params.test) t.set('ion', params.test); if (params.slip) t.set('slip', params.slip); }
    if (action === 'gc-cal-run') { if (params.salt) t.set('salt', params.salt); if ('stuck' in params) t.set('stuck', params.stuck ? 'yes' : 'no'); }
    if (action === 'gc-cal-result' && params.method) t.set('calm', params.method);
    if (action === 'gc-mohr-salt' && params.ethanol) t.set('etoh', params.ethanol);
    if (action === 'gc-mohr-qual') { if (params.reagent) t.set('mq', params.reagent); if (params.salt) t.set('msalt', params.salt); }
    if (action === 'gc-mohr-titr' && 'acid' in params) t.set('macid', params.acid ? 'yes' : 'no');
    if (action === 'gc-mohr-ba') { if ('aging' in params) t.set('aging', params.aging ? 'yes' : 'no'); if ('wash' in params) t.set('bwash', params.wash ? 'yes' : 'no'); }
    if (action === 'gc-eq') { if (params.system) t.set('sys', params.system); if (params.add) t.set('add', params.add); if (params.temp) t.set('temp', params.temp); if (params.indicator) t.set('eqind', params.indicator); }
    if (action === 'sl-make') { if (params.slide) t.set('slide', params.slide); if (params.cut) t.set('cut', params.cut); if (params.cover) t.set('cover', params.cover); if ('stain' in params) t.set('stain', params.stain ? 'yes' : 'no'); if ('squash' in params) t.set('sq', params.squash ? 'yes' : 'no'); if ('dry' in params) t.set('dry', params.dry ? 'yes' : 'no'); }
    if (action === 'sl-view') { if (params.objective) t.set('obj', params.objective); if ('oil' in params) t.set('oil', params.oil ? 'yes' : 'no'); }
    if (action === 'sl-name' && params.answer) t.set('kind', params.answer);
    if (action === 'sl-find' && params.phase) t.set('phase', params.phase);
    if (action === 'dx-sample') { if (params.tissue) t.set('ts', params.tissue); if (params.mg) t.set('mg', params.mg); }
    if (action === 'dx-label' && params.where) t.set('lb', params.where);
    if (action === 'dx-grind' && 'hard' in params) t.set('gr', params.hard ? 'hard' : 'soft');
    if (action === 'dx-load' && params.tip) t.set('tip', params.tip);
    if (action === 'dx-incubate') { if (params.temp) t.set('tc', params.temp); if (params.min) t.set('im', params.min); }
    if (action === 'dx-ci') { if ('cool' in params) t.set('cool', params.cool ? 'yes' : 'no'); if (params.vortex) t.set('vx', params.vortex); }
    if (action === 'dx-spin' && params.rpm) t.set('rpm', params.rpm);
    if (action === 'dx-transfer' && 'touch' in params) t.set('tch', params.touch ? 'yes' : 'no');
    if (action === 'dx-iso' && params.ratio) t.set('iso', params.ratio);
    if (action === 'dx-wash') { if (params.ethanol) t.set('eth', params.ethanol); if ('gentle' in params) t.set('pour', params.gentle ? 'gentle' : 'rough'); }
    if (action === 'dx-dissolve' && params.ul) t.set('wul', params.ul);
    if (action === 'dx-gel' && params.minutes) t.set('gm', params.minutes);
    if (action === 'dis-take' && params.specimen) { t.set('sp', params.specimen); t.setOptions('organ', organOptions(params.specimen), dissection.specimens[params.specimen].required[0]); }
    if (action === 'dis-place' && params.side) t.set('side', params.side);
    if (action === 'dis-cut') { if (params.line) t.set('line', params.line); if (params.depth) t.set('depth', params.depth); }
    if (action === 'dis-observe') { if (params.organ) t.set('organ', params.organ); if ('lens' in params) { t.set('lens', params.lens ? 'yes' : 'no'); lab.setLens(Boolean(params.lens)); } }
    if (action === 'dis-clean' && params.bin) t.set('bin', params.bin);
    if (action === 'geo-site' && params.site) t.set('site', params.site);
    if (action === 'geo-route') { if (params.from) t.set('from', params.from); if (params.to) t.set('to', params.to); }
    if (action === 'geo-layer' && params.layer) t.set('layer', params.layer);
    if (action === 'pu-column') {
      if (params.column) t.set('col', params.column);
      if (params.pH != null) t.set('cph', params.pH);
      if (params.loadSalt != null) t.set('salt', params.loadSalt);
    }
    if (action === 'pu-assay') {
      if (params.dilution != null) t.set('dil', params.dilution);
      if (params.pH != null) t.set('ph', params.pH);
      if (params.additive) t.set('add', params.additive);
      if ('controls' in params) t.set('ctl', params.controls ? 'yes' : 'no');
    }
    if (action === 'pu-pool' && params.mode) t.set('pool', params.mode);
    if (action === 'fl-heat') {
      if (params.target) t.set('tg', params.target);
      if (params.seconds) t.set('sec', params.seconds);
      if ('even' in params) t.set('even', params.even ? 'yes' : 'no');
      if ('gauze' in params) t.set('gz', params.gauze ? 'yes' : 'no');
    }
    if (action === 'fl-test') { if (params.sample) t.set('sub', params.sample); if ('cobalt' in params) t.set('co', params.cobalt ? 'yes' : 'no'); }
    if (action === 'fl-light' && params.method) t.set('lm', params.method);
    if (action === 'fl-out' && params.method) t.set('om', params.method);
    if (action === 'fl-burn' && params.tool) t.set('tool', params.tool);
    if ((action === 'fl-splint' || action === 'fl-cool') && params.target) t.set('tg', params.target);
    if (action === 'fl-cool' && params.seconds) t.set('sec', params.seconds);
    if (action === 'fe-key' && Array.isArray(params.answers)) params.answers.forEach((v, i) => t.set(`${params.specimen}${i}`, v));
    if (action === 'fe-fish') { if (params.gear) t.set('gear', params.gear); if (params.tide) t.set('tide', params.tide); }
    if (action === 'fe-crab') { if (params.tide) t.set('tide', params.tide); if ('gloves' in params) t.set('glv', params.gloves ? 'yes' : 'no'); }
    if (action === 'fe-bat' && 'detector' in params) t.set('det', params.detector ? 'yes' : 'no');
    if (action === 'fe-birds') { if ('quiet' in params) t.set('quiet', params.quiet ? 'yes' : 'no'); if ('playback' in params) t.set('pb', params.playback ? 'yes' : 'no'); }
    if (action === 'st-load' && params.source) t.set('ds', params.source);
    if (['st-describe', 'st-ci'].includes(action) && params.col != null) t.set('a', params.col);
    if (action === 'st-ttest') { t.set('a', params.a ?? 0); t.set('b', params.b ?? 1); if (params.kind) t.set('kind', params.kind); }
    if (action === 'st-regress') { t.set('a', params.x ?? 0); t.set('b', params.y ?? 1); if (params.model) t.set('model', params.model); }
    if (action === 'st-ci') { if (params.conf) t.set('conf', params.conf); if (params.method) t.set('cim', params.method); }
    if (action === 'exo-plasma') {
      if (params.ul) t.set('ul', params.ul);
      if ('spin2' in params) t.set('sp', params.spin2 ? 'yes' : 'no');
      if ('filter' in params) t.set('fl', params.filter ? 'yes' : 'no');
    }
    if (action === 'exo-column' && 'dry' in params) t.set('dry', params.dry ? 'yes' : 'no');
    if (action === 'exo-pool' && params.from) t.set('pool', `${params.from}-${params.to}`);
    if (action === 'pt-compare') {
      if (params.loadRatio != null) t.set('lr', params.loadRatio);
      if ('normalize' in params) t.set('nm', params.normalize ? 'yes' : 'no');
    }
    if (action === 'pu-sds' && params.stain) t.set('st', params.stain);
    if (action === 'mic-view') {
      if (params.specimen) t.set('sp', params.specimen);
      if (params.objective) t.set('obj', params.objective);
      if ('oil' in params) t.set('oil', params.oil ? 'yes' : 'no');
    }
    if (action === 'qpcr-plate') {
      if (params.ntc) t.set('ntc', params.ntc);
      if (params.sample) t.set('sample', params.sample);
    }
    if (action === 'bsc-set') {
      if (params.sash != null) t.set('sash', params.sash);
      if ('fan' in params) t.set('fan', params.fan ? 'on' : 'off');
      if (params.grille) t.set('grille', params.grille);
    }
    if (action === 'ms-select') {
      if (params.analyte) t.set('analyte', params.analyte);
      if (params.transition != null) t.set('tr', params.transition);
    }
    if (action === 'ms-sample' && params.prep) t.set('prep', params.prep);
    if (action === 'ac-load') {
      if (params.loadL) t.set('loadL', params.loadL);
      if ('sealed' in params) t.set('cap', params.sealed ? 'sealed' : 'loose');
    }
    if (action === 'ac-run') {
      if (params.temp) t.set('temp', params.temp);
      if (params.holdMin) t.set('hold', params.holdMin);
      if ('purge' in params) t.set('purge', params.purge ? 'yes' : 'no');
    }
    if (action === 'pr-plate' && params.assay) t.set('assay', params.assay);
    if (action === 'pr-analyse' && params.range) t.set('range', params.range);
    if (action === 'vx-mix') {
      if (params.rpm) t.set('rpm', params.rpm);
      if (params.sample) t.set('sample', params.sample);
    }
    if (action === 'hp-heat') {
      if (params.cup) t.set('cup', params.cup);
      if (params.setC) t.set('set', params.setC);
      if ('probe' in params) t.set('probe', params.probe ? 'yes' : 'no');
    }
    if (action === 'hp-cool' && params.mode) t.set('mode', params.mode);
    if (action === 'inv-power') {
      if (params.hours) t.set('ph', params.hours);
      if (params.backup) t.set('bk', params.backup);
    }
    if (action === 'fh-set') {
      if (params.sash !== undefined) t.set('sash', params.sash);
      if (params.fan !== undefined) t.set('fan', params.fan === true || params.fan === 'yes' ? 'yes' : 'no');
      if (params.clutter !== undefined) t.set('clutter', params.clutter === true || params.clutter === 'yes' ? 'yes' : 'no');
    }
    if (action === 'fh-work' && params.where) t.set('where', params.where);
    if (action === 'bal-add' && params.target) t.set('target', params.target);
    if (action === 'bal-flask' && params.volume) t.set('vol', params.volume);
    if (action === 'nd-blank' && params.buffer) t.set('buf', params.buffer);
    if (key === 'bc') {
      const first = Array.isArray(params.tube) ? params.tube[0] : params.tubes?.[0] ?? params.tube;
      if (typeof first === 'number') t.set('tube', first);
      if (params.sample) t.set('sample', params.sample);
      if (params.reagent) t.set('reagent', params.reagent);
      if (params.minutes) t.set('min', params.minutes);
      if (params.setC) t.set('set', params.setC);
      if (params.index) t.set('index', params.index);
      if (params.part) t.set('part', params.part);
    }
    if (action === 'nd-measure' && params.sample) t.set('sample', params.sample);
    if (action === 'hplc-method') {
      if (params.organic) t.set('org', params.organic);
      if (params.flow) t.set('flow', params.flow);
    }
  }
  function machineFigure(key) {
    const m = MACHINES[key];
    lab.flyTo(m.zone);
    openDetail(m.figure, m.lab.figureData());
  }
  // Kiểm thử tự động (?test trong địa chỉ): lộ toạ độ màn hình của đồ trên bàn và máy
  if (new URLSearchParams(location.search).has('test')) window.__vlabTest = { screenOf: (kind, id) => lab.screenOf(kind, id), items: () => lab.benchItems(), pixelRatio: () => lab.pixelRatio(), advance: (s) => lab.advance(s), view: (p, t) => lab.setView(p, t), nav: () => lab.nav.view(), pour: (sub, c) => lab.demoPour(sub, c), tool: (t) => { chemState.tool = t; }, volume: (id) => engine.containers.get(id)?.volume, hand: (k, p) => pipAction(k, p), contents: (id) => engine.contents(id).map((x) => x.id) };
  const nav = $('#zone-nav');
  const climateBox = $('#climate');
  let zone = 'overview';

  const lab = createLabScene({
    container: $('#viewport'),
    substances,
    containers: CONTAINERS,
    apparatus: apparatus.items,
    facility,
    onHandPour: (substanceId, containerId) => handPourStart(substanceId, containerId),
    onPower: (id, on) => pipAction('power', { id, on }),
    onRoom: (id) => { if (replaying) return; const r = labOps.move(id, safetyCheck.worn); if (r.events.length) panel.addMachine({ events: r.events }, null); },
    onCap: (id) => { if (!replaying) opsAction('ops-cap', { substance: id }); },
    onFixture: (kind) => {
      if (kind === 'handsink' || kind === 'labsink') return opsAction('ops-wash');
      const item = { coats: 'coat', gloves: 'gloves', goggles: 'goggles' }[kind];
      runSafety({ item, on: safetyCheck.worn.has(item) ? 'no' : 'yes' });
    },
    safety,
    // Bản đồ Cát Bà: điểm khảo sát kèm vị trí trên bản đồ (u, v) và toạ độ độ-phút-giây cho thẻ chú thích
    catba: {
      data: { ...catbaData, sites: catbaData.sites.map((x) => ({ ...x, map: geo.toMap(x.lat, x.lon), dms: dms(x.lat, x.lon) })), waters: catbaData.waters.map((w) => ({ ...w, map: geo.toMap(w.lat, w.lon) })) },
      meta: catbaMeta,
      grid: catbaGrid,
      textureUrl: `data/catba/${catbaMeta.satellite.file}`,
    },
    onMapPick: (u, v) => {
      const ll = geo.fromMap(u, v);
      runMachine('geo-pick', { lat: Number(ll.lat.toFixed(5)), lon: Number(ll.lon.toFixed(5)) });
    },
    onMapSite: (id) => runMachine('geo-site', { site: id }),
    // Khu giải phẫu: bấm lọ mẫu, dụng cụ, nội quan trong cảnh chạy đúng thao tác như nút ở bảng
    dissection,
    onDissect: (kind, arg) => {
      const g = toolPanels.dis.get;
      if (kind === 'take') return runMachine('dis-take', { specimen: arg });
      if (kind === 'organ') return runMachine('dis-observe', { organ: arg, lens: g('lens') === 'yes' });
      if (arg === 'lens') {
        const on = g('lens') !== 'yes';
        toolPanels.dis.set('lens', on ? 'yes' : 'no');
        return lab.setLens(on);
      }
      const act = { cut: ['dis-cut', { line: g('line'), depth: g('depth') }], pin: ['dis-pin', {}], water: ['dis-water', {}], open: ['dis-open', {}], remove: ['dis-remove', {}], clean: ['dis-clean', { bin: 'bio' }] }[arg];
      if (act) runMachine(...act);
    },
    onPour: (substanceId, containerId) => pour(substanceId, containerId),
    onDetail: (id) => openDetail(id, ['pcr', 'gel', 'geldoc'].includes(id) ? chain.figureData(id) : id === 'stereo' ? stereoData() : id === 'ln2' || id === 'ultrafreezer' ? coldLab.figureData(id) : id === 'growthchamber' ? growthData() : id === 'zebrafish' ? fish.rackData() : Object.values(MACHINES).find((m) => m.figure === id)?.lab.figureData()),
    onAction: (action) => runAction(action),
    // Bộ đun trong cảnh: kéo ống nghiệm hoặc cốc lên đèn, bấm đèn để châm hoặc đậy nắp, bấm kẹp, que đóm, dây đốt
    onHeat: (id) => runMachine('fl-heat', { ...toolParams('fl-heat'), target: id }),
    onLamp: () => runMachine(fl.lamp.lit ? 'fl-out' : 'fl-light', { method: fl.lamp.lit ? 'cap' : 'match' }),
    onStation: (action) => runMachine(action, toolParams(action)),
    onHold: (id, machine) => {
      const hint = document.querySelector('.hint');
      if (!hint.dataset.base) hint.dataset.base = hint.textContent;
      if (id) hint.textContent = `Đang cầm ${CONTAINERS.find((c) => c.id === id)?.name ?? 'ống'}: bấm vào máy PCR để chạy, hoặc bộ điện di để nạp gel và chạy · bấm lại ống để đặt xuống`;
      else if (machine) hint.textContent = 'Bấm (không kéo) một ống PCR trên bàn sinh học phân tử để cầm, rồi bấm vào máy';
      else hint.textContent = hint.dataset.base;
    },
    // Cửa tủ −80 °C trong cảnh: đóng lại thì tính nhiệt độ theo số giây đã mở thật
    onDoor: (place, open) => {
      if (place !== 'ult') return;
      if (open) ultOpenedAt = performance.now();
      else if (ultOpenedAt !== null) {
        runMachine('inv-door', { seconds: Math.max(5, Math.round((performance.now() - ultOpenedAt) / 1000)), inner: 'closed' });
        ultOpenedAt = null;
      }
    },
    onPick: (item) => {
      if (item.startsWith('chem:')) return runChem('chem-take', { item: item.slice(5) });
      if (!coldLab.usable(item)) runMachine('inv-move', { item, to: 'ice' });
    },
    onZone(id) {
      zone = id;
      for (const b of nav.querySelectorAll('button')) b.setAttribute('aria-pressed', String(b.dataset.zone === id));
      climateBox.hidden = id !== 'greenhouse';
    },
  });

  // Khi chạy lại phiên, camera đứng yên: chỉ bay tới khu khi người dùng thao tác
  const flyNow = lab.flyTo;
  lab.flyTo = (id) => { if (!replaying) flyNow(id); };

  // Rót một chất vào cốc hoặc ống. Khi chạy lại phiên, dụng cụ và thể tích lấy từ nhật ký thay vì bảng hoá học
  function pour(substanceId, containerId, use = null) {
    if (!coldLab.usable(substanceId)) {
      panel.addMachine({ events: [{ type: 'warning', text: `${storage.items[substanceId].name} đang ở ${coldLab.placeName(coldLab.inv.placeOf(substanceId))}: lấy ra hộp đá trước khi hút.` }] }, null);
      return { appearance: engine.appearance(containerId), gas: null };
    }
    const tool = use?.tool ?? chemState.tool;
    const volume = use?.volume ?? chemState.volume;
    // Thuốc thử sinh học cho bằng micropipet (bảng Thao tác tay): chưa gắn tip thì không hút được; tip dùng lại mang chất cũ
    // vào ống thuốc thử; ống thuốc thử đã nhiễm DNA khuôn thì mọi ống pha từ nó đều có DNA khuôn (đối chứng âm lên băng)
    const subDef = substances.find((x) => x.id === substanceId);
    const pipEvents = [];
    if (subDef?.kind === 'bio' && pipState.on) {
      const carried = pipette.tip?.used ?? null;
      const a = pipette.aspirate(substanceId, pipState.stopA);
      if (!a.ok) {
        note('pour', 'pour', { substance: substanceId, container: containerId, tool, volume });
        panel.addMachine({ events: a.events }, null);
        syncPip();
        return { appearance: engine.appearance(containerId), gas: null };
      }
      if (a.contaminated && carried === 'template' && substanceId !== 'template') stockTemplate.add(substanceId);
      pipEvents.push(...a.events, ...pipette.dispense(pipState.stopD).events);
      syncPip();
    }
    note('pour', 'pour', { substance: substanceId, container: containerId, tool, volume });
    // Kho: chai 100 mL vơi dần; dụng cụ bẩn (đổ bỏ chưa rửa) thì cảnh báo
    const opsEvents = [];
    let vol = volume;
    if (subDef?.kind === 'chem' && !subDef.solid) {
      const t = labOps.take(substanceId, Number(vol) || 0);
      opsEvents.push(...t.events, ...labOps.checkExpiry(substanceId, bottleName(substanceId)));
      // Lấy hoá chất thì mở nắp chai; đậy lại bằng cách bấm nắp trên bàn hoặc nút Đậy nắp
      if (labOps.openCap(substanceId)) lab.setCap(substanceId, true);
      if (!t.ok) { panel.addMachine({ events: t.events }, null); syncOps(); return { appearance: engine.appearance(containerId), gas: null }; }
      vol = t.got;
    }
    opsEvents.push(...labOps.fill(containerId).events);
    const res = engine.pour(substanceId, containerId, { tool, volume: vol });
    res.events.unshift(...pipEvents, ...opsEvents);
    syncOps();
    if (stockTemplate.has(substanceId) && !engine.contents(containerId).some((x) => x.id === 'template')) {
      engine.pour('template', containerId, { tool, volume });
      res.events.push({ type: 'warning', label: 'Nhiễm DNA khuôn', text: `Ống ${subDef.label ?? subDef.name} đã dính DNA khuôn từ tip dùng lại: ống vừa pha cũng có DNA khuôn, đối chứng âm sẽ lên băng.` });
    }
    res.showPH = chemState.taken.has('phmeter');
    const sub = substances.find((x) => x.id === substanceId);
    if (sub?.kind === 'chem') res.events.push(...safetyCheck.warnings(substanceId, sub.unknown ? sub.label : `${sub.formula} ${sub.conc}`.trim()));
    const prog = tracker.record(substanceId, containerId);
    panel.addResult(res, prog);
    if (containerId === 'flask') syncChem();
    const fxInfo = { gas: res.gas, gases: res.gases.map((id) => substances.find((x) => x.id === id)).filter(Boolean), T: res.T };
    if (use) lab.setAppearance(containerId, engine.appearance(containerId), fxInfo);
    return { appearance: engine.appearance(containerId), ...fxInfo };
  }

  // Thao tác máy dùng đúng các ống người dùng vừa pha trên bàn
  function runAction(action) {
    note('pcr', action);
    if (powerOff.has(FIGURE_OF[action])) {
      panel.addMachine({ events: [{ type: 'warning', label: 'Máy đang tắt', text: `${MACHINES_3D.find((x) => x.id === FIGURE_OF[action])?.name ?? 'Máy'} đang tắt: bấm vào màn hình máy để bật.` }] }, null);
      return;
    }
    const contentsOf = (id) => engine.contents(id).map((s) => s.id);
    const res = {
      'pcr-run': () => chain.runPcr(contentsOf, (ids) => coldLab.activities(ids)),
      'gel-load': () => chain.loadGel(),
      'gel-run': () => chain.runGel(),
      'gel-image': () => chain.imageGel(),
    }[action]();
    const progA = tracker.recordAction(action);
    if (res.ok !== false && !replaying) res.events = [...labOps.checkRun(FIGURE_OF[action], machineName(FIGURE_OF[action]), labClock.now), ...(res.events ?? [])];
    if (!deferResult(action, {}, res, progA, FIGURE_OF[action], MACHINES_3D.find((x) => x.id === FIGURE_OF[action])?.name ?? action)) panel.addMachine(res, progA);
    usedMachines.add(FIGURE_OF[action]);
    labOps.work();
    lab.setScreen(FIGURE_OF[action], { lines: { 'pcr-run': [`Xong ${PCR_CYCLES} chu kỳ`, 'Giữ 4 °C'], 'gel-load': ['Đã nạp giếng'], 'gel-run': ['Chạy xong'], 'gel-image': ['Đã chụp ảnh gel'] }[action] });
    if (zone !== 'pcr-bench') lab.flyTo('pcr-bench');
    // Mở hình cận cảnh của máy vừa dùng, hiện đúng ống hoặc gel của người dùng
    const fig = FIGURE_OF[action];
    const run = chain.figureData(fig);
    if (run) openDetail(fig, run);
  }

  // Thao tác ở khu trồng trọt (thí nghiệm Mendel)
  function runPea(action, params = {}) {
    note('pea', action, params);
    const res = mendel.do(action, params);
    let prog = null;
    if (action === 'pea-grow') {
      // Chỉ ghi nhận giai đoạn mà bước đang chờ cần; tua qua nhiều giai đoạn không được tính trước cho các bước sau
      // (ví dụ tua tới khi chín đi qua "có nụ" nhưng bước "tới khi có nụ" sau đó là của nhóm cây gieo sau)
      const cur = tracker.protocol?.steps[tracker.current]?.expect;
      const want = cur?.action === 'pea-grow' && (res.reached ?? []).includes(cur.until) ? cur.until : params.until;
      if (want) prog = tracker.recordAction('pea-grow', { until: want });
    } else prog = tracker.recordAction(action, params);
    panel.addMachine(res, prog);
    syncGarden();
    if (zone !== 'greenhouse') lab.flyTo('greenhouse');
  }
  // Buồng sinh trưởng nhận khí hậu đang đặt và tuổi của nhóm cây gieo gần nhất (đêm lạnh hơn ngày 4 °C: minh hoạ;
  // ánh sáng 100 % ứng với 1000 µmol/m²/s, quang kỳ 16 giờ: minh hoạ)
  function growthData() {
    const st = climateState;
    const groups = [...mendel.garden.groups.values()].filter((g) => !g.harvested);
    const last = groups.reduce((a, b) => (!a || b.sownDay >= a.sownDay ? b : a), null);
    const light = (st.light / 100) * ({ sun: 1, cloud: 0.5, rain: 0.3 }[st.weather] ?? 1);
    const tall = last ? mendel.garden.snapshot().groups.find((g) => g.id === last.id)?.look?.[0]?.tall !== false : true;
    return { dayC: st.temp, nightC: st.temp - 4, rh: st.humidity, ppfd: Math.round(light * 1000), photoperiod: 16, day: last ? mendel.clock.day - last.sownDay : 0, variety: tall ? 'tall' : 'dwarf', name: last ? `Nhóm ${last.id}` : 'Đậu Hà Lan' };
  }
  function syncGarden() {
    const st = { ...mendel.state(), stageNames: pea.stages };
    garden.render(st, (stage) => pea.stages[stage]);
    lab.setGarden(st);
  }
  function showNotebook(lab = mendel, file = 'so-thi-nghiem-mendel.csv') {
    const csv = lab.notebook.toCSV();
    const url = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' }));
    panel.addMachine({
      action: 'notebook',
      events: [{ type: 'info', label: 'Sổ', text: `${lab.notebook.rows.length} dòng ghi${lab.clock ? `, ngày ảo ${lab.clock.day}` : lab.hours !== undefined ? `, ${Math.round(lab.hours)} giờ sau thụ tinh` : ''}. Mở bằng Excel hoặc R để vẽ biểu đồ, tính lại χ².` }],
      html: `<pre class="csv" tabindex="0">${csv.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c])}</pre>
        <div class="g-row"><a class="btn btn-ghost" href="${url}" download="${file}">Tải CSV</a><button type="button" class="btn btn-ghost" data-copy>Sao chép</button></div>`,
    }, null);
    const btn = $('#log [data-copy]');
    btn?.addEventListener('click', () => {
      navigator.clipboard?.writeText(csv).then(() => { btn.textContent = 'Đã sao chép'; }, () => { btn.textContent = 'Không sao chép được: chọn chữ trong khung và sao chép tay'; });
    });
  }

  // Bàn hoá học: lấy đồ từ tủ, chuẩn độ bằng buret
  function runChem(action, params = {}) {
    if (action === 'ppe-wear') return runSafety(params);
    note('chem', action, params);
    let res;
    let prog = null;
    if (action === 'chem-take') {
      const tool = tools.tools.find((t) => t.id === params.item);
      const sub = substances.find((x) => x.id === params.item);
      if (chemState.taken.has(params.item)) res = { events: [{ type: 'info', text: 'Đã có trên bàn.' }] };
      else if (tool) {
        chemState.taken.add(tool.id);
        if (tool.id === 'burette') lab.setBuret(true, 0);
        res = { ok: true, events: [{ type: 'machine', label: 'Tủ dụng cụ', text: `Lấy ${tool.name} ra bàn.` }, { type: 'effect', text: tool.effect }] };
      } else if (sub) {
        chemState.taken.add(sub.id);
        lab.addReagent(sub);
        res = { ok: true, events: [{ type: 'machine', label: 'Tủ hoá chất', text: `Lấy chai ${sub.unknown ? sub.label : sub.formula} ${sub.conc} ra bàn.` }, { type: 'info', text: sub.note }] };
      }
      if (res.ok) prog = tracker.recordAction(action, params);
      if (zone !== 'bench-chem') lab.flyTo('bench-chem');
    } else if (action === 'titr-fill') {
      if (!chemState.taken.has('burette')) res = { events: [{ type: 'warning', text: 'Chưa có buret trên bàn: lấy buret từ tủ dụng cụ.' }] };
      else {
        res = titration.fill();
        prog = tracker.recordAction(action);
      }
    } else if (action === 'titr-add') {
      res = titration.add(params.volume ?? 1);
      const p = tracker.recordAction(action);
      if (p && p.status !== 'off') prog = p;
      lab.setAppearance('flask', engine.appearance('flask'));
      if (res.quiet && !prog) return syncChem();
    } else if (action === 'titr-end') {
      res = titration.end();
      if (res.ok) {
        prog = tracker.recordAction(action);
        if (chemState.taken.has('phmeter')) res.html = titrationChart(res.points, { vEq: res.vEq, reading: res.reading });
        else res.events.push({ type: 'info', text: 'Lấy máy đo pH từ tủ dụng cụ trước khi chuẩn độ để vẽ được đường cong pH.' });
      }
    }
    panel.addMachine({ action, day: undefined, ...res }, prog);
    syncChem();
  }
  function syncChem() {
    const ap = engine.appearance('flask');
    const ind = engine.contents('flask').some((x) => x.indicator);
    const box = engine.containers.get('flask');
    const text = box.volume ? `${box.volume.toFixed(1).replace('.', ',')} mL, ${ap.liquidColor ? (ind ? 'hồng' : 'có màu') : 'không màu'}` : 'trống';
    chemPanel.render({ ...chemState, worn: safetyCheck.worn, titration: { filled: titration.filled, delivered: titration.delivered, left: titration.left }, flask: { text, pH: engine.pH('flask') } });
    lab.setBuret(chemState.taken.has('burette'), titration.filled ? titration.left / titration.capacity : 0);
    lab.setChemTaken(chemState.taken);
  }

  // Đồ bảo hộ: mặc hoặc bỏ; thiếu thì thẻ kết quả của bước nguy hiểm có cảnh báo
  function runSafety(params) {
    note('ppe', 'ppe-wear', params);
    const res = safetyCheck.do('ppe-wear', params);
    const prog = res.ok ? tracker.recordAction('ppe-wear', params) : null;
    panel.addMachine(res, prog && prog.status !== 'off' ? prog : null);
    syncChem();
    lab.setHands({ gloves: safetyCheck.worn.has('gloves') });
  }

  // Thử độc tính trên phôi cá ngựa vằn
  function runZf(action, params = {}) {
    note('zf', action, params);
    const res = fish.do(action, params);
    if (action === 'zf-observe' && res.observation) {
      const unit = fish.chemical().unit;
      res.html = embryoRow(res.observation, (r) => (r.positive ? '3,4-DCA 4' : `${String(r.c).replace('.', ',')} ${unit}`));
    }
    if (action === 'zf-analyze' && res.curve) res.html = doseChart(res.curve);
    const prog = res.ok ? tracker.recordAction(action, params) : null;
    panel.addMachine({ ...res, day: undefined }, prog);
    syncZf();
    if (zone !== 'organism') lab.flyTo('organism');
  }
  function syncZf() {
    zfPanel.render(fish.state(), fish.setup);
  }

  // Thao tác ở khu nuôi sinh vật (ruồi giấm, Morgan)
  function runFly(action, params = {}) {
    note('fly', action, params);
    // Đếm từ bảng điều khiển: dùng cách đọc kết quả của bước protocol tương ứng (χ², hoán vị gen…)
    if (action === 'fly-count' && !params.expect) {
      const st = tracker.protocol?.steps.find((s) => s.expect.action === 'fly-count' && s.expect.vial === params.vial);
      if (st) params = { ...params, expect: st.expect.expect };
    }
    const res = flies.do(action, params);
    let prog = null;
    if (action === 'fly-grow') {
      for (const st of res.reached ?? []) {
        const p = tracker.recordAction('fly-grow', { until: st });
        if (p && p.status !== 'off') prog = p;
      }
    } else if (res.ok) prog = tracker.recordAction(action, params);
    if (action === 'fly-count' && res.table?.classes) {
      lastFlies = res.table.classes;
      res.html = flyIcons(res.table.classes);
    }
    panel.addMachine(res, prog);
    syncFlies();
    if (zone !== 'organism') lab.flyTo('organism');
  }
  // Ruồi theo nhãn lớp kiểu hình ("♀ mắt trắng, thân đen…"): hình vẽ từ figures/stereo/model.mjs
  let lastFlies = null;
  const flyOf = (label) => ({ sex: label.startsWith('♂') ? 'M' : 'F', white: /mắt trắng/.test(label), black: /thân đen/.test(label), vestigial: /cánh cụt/.test(label) });
  function flyIcons(classes) {
    const shown = classes.filter((c) => c.n);
    return `<div class="fly-row">${shown.map((c) => `<figure class="fly-fig">${flySvg(flyOf(c.label), 56)}<figcaption>${c.label}<br><b>${c.n}</b></figcaption></figure>`).join('')}</div>`;
  }
  function stereoData() {
    if (!lastFlies) return null;
    const total = lastFlies.reduce((t, c) => t + c.n, 0);
    const flies = [];
    for (const c of lastFlies) for (let i = 0; i < Math.round((c.n / Math.max(1, total)) * 40); i++) flies.push(flyOf(c.label));
    return { flies: flies.slice(0, 60), zoom: 2, co2Minutes: 3 };
  }
  function syncFlies() {
    const st = flies.state();
    flyPanel.render(st);
    lab.setFlies(st);
  }

  // Đặt lại mọi lõi bằng seed của phiên: phiên mới (Làm lại, đổi protocol) hoặc phiên mở lại từ file
  function resetAll(next = null) {
    session = next ?? new Session({ protocol: tracker.protocol?.id ?? null, seed: Date.now(), start: { climate: { ...climateState } } });
    const seed = (name) => session.seedFor(name);
    engine.reset(seed('engine'));
    pipette = new Micropipette('P20', seededRng(seed('pip')));
    handRng = seededRng(seed('hand'));
    pipState = { on: false, model: 'P20', volume: 20, stopA: 1, stopD: 2 };
    stockTemplate.clear();
    labOps.reset();
    for (const c of CONTAINERS) lab.setContainerLabel(c.id, '');
    for (const id of powerOff) lab?.setScreen(id, { on: true });
    powerOff.clear();
    usedMachines.clear();
    labClock.reset();
    syncClock();
    syncPip();
    titration.reset();
    chemState.taken = new Set(START_TOOLS);
    chain.reset(seed('pcr'));
    flies.setUp(tracker.protocol?.fly ?? FLY_FREE, seed('fly'));
    fish.setUp(tracker.protocol?.zf ?? ZF_FREE, seed('zf'));
    syncZf();
    spectro.reset(seed('uv'), tracker.protocol?.uv?.sample ?? 'pnp');
    centri.reset();
    hplc.reset(seed('hplc'));
    scope.reset(seed('mic'));
    qpcr.reset(seed('qpcr'));
    nd.reset(seed('nd'));
    vx.reset();
    pr.reset(seed('pr'));
    ac.reset(seed('ac'));
    ms.reset(seed('ms'));
    bsc.reset();
    coldLab.reset(tracker.protocol?.inv?.start ?? {});
    heatLab.reset();
    bal.reset(seed('bal'));
    hoodLab.reset();
    safetyCheck.reset();
    lab?.setHands({ gloves: safetyCheck.worn.has('gloves') });
    emLab.reset();
    bc.reset(seed('bc'));
    ez.reset(seed('ez'));
    mb.reset(seed('mb'));
    mo.reset(seed('mo'));
    pt.reset(seed('pt'));
    ck.reset(seed('ck'));
    ev.reset(seed('ev'));
    fe.reset(seed('fe'));
    pu.reset(seed('pu'));
    fl.reset();
    geo.reset();
    syncMap();
    dis.reset(seed('dis'));
    dx.reset(seed('dx'));
    sl.reset(seed('sl'));
    gc.reset(seed('gc'));
    pm.reset(seed('pm'));
    eco.reset(seed('eco'));
    vs.reset(seed('vs'));
    syncDissect();
    exo.reset(seed('exo'));
    st.reset();
    toolPanels.st?.setOptions('a', [[0, 'cột 1']], 0);
    toolPanels.st?.setOptions('b', [[1, 'cột 2']], 1);
    lab.setFieldPlants(fe.plants, feSpecies);
    lab.setQuadrats([]);
    lab.setTubes(bc.figureData());
    syncHood();
    syncBench();
    syncCold();
  lab.setFlyStages(fly.lifecycle.stages);
    for (const [k, m] of Object.entries(MACHINES)) toolPanels[k].status(m.status());
    flyPanel.setGenes(flies.setup.genes);
    syncFlies();
    mendel.setUp(tracker.protocol?.mendel ?? pea.free, seed('pea'));
    climatePanel?.setCrop(crops.find((c) => c.id === (mendel.setup.species ?? 'pea')) ?? crops[0]);
    garden.setTraits(mendel.setup.traits, mendel.garden.traits);
    syncGarden();
    tracker.reset();
    lab.resetBench();
    syncChem();
    panel.clear();
    panel.renderSteps(tracker);
    if (!next) persist();
  }

  const panel = createProtocolPanel($('#pane-protocol'), {
    protocols,
    groups: [
      { id: 'chem', title: 'Bàn hoá học · tủ và dụng cụ', actions: CHEM_ACTIONS, custom: true },
      { id: 'pcr', title: 'Thao tác máy · Khu máy móc', actions: ACTIONS },
      { id: 'garden', title: 'Khu trồng trọt · lai đậu Hà Lan', actions: { ...PEA_ACTIONS, notebook: 'Sổ thí nghiệm' }, custom: true },
      { id: 'fly', title: 'Khu nuôi sinh vật · ruồi giấm', actions: FLY_ACTIONS, custom: true },
      { id: 'zf', title: 'Khu nuôi sinh vật · phôi cá ngựa vằn', actions: ZF_ACTIONS, custom: true },
      { id: 'uv', title: 'Máy quang phổ UV-Vis', actions: UV_ACTIONS, custom: true },
      { id: 'cf', title: 'Máy ly tâm', actions: CF_ACTIONS, custom: true },
      { id: 'hplc', title: 'HPLC', actions: HPLC_ACTIONS, custom: true },
      { id: 'mic', title: 'Kính hiển vi', actions: MIC_ACTIONS, custom: true },
      { id: 'qpcr', title: 'qPCR', actions: QPCR_ACTIONS, custom: true },
      { id: 'nd', title: 'Đo nồng độ DNA', actions: ND_ACTIONS, custom: true },
      { id: 'vx', title: 'Vortex, ly tâm mini', actions: VX_ACTIONS, custom: true },
      { id: 'pr', title: 'Máy đọc vi đĩa', actions: PR_ACTIONS, custom: true },
      { id: 'ac', title: 'Nồi hấp', actions: AC_ACTIONS, custom: true },
      { id: 'ms', title: 'LC-MS/MS', actions: MS_ACTIONS, custom: true },
      { id: 'bsc', title: 'Tủ an toàn sinh học', actions: BSC_ACTIONS, custom: true },
      { id: 'inv', title: 'Tủ lạnh, tủ đông', actions: INV_ACTIONS, custom: true },
      { id: 'hp', title: 'Máy khuấy từ gia nhiệt', actions: HP_ACTIONS, custom: true },
      { id: 'bal', title: 'Cân phân tích', actions: BAL_ACTIONS, custom: true },
      { id: 'fh', title: 'Tủ hút khí độc', actions: FH_ACTIONS, custom: true },
      { id: 'em', title: 'An toàn, sự cố', actions: EM_ACTIONS, custom: true },
      { id: 'bc', title: 'Giá ống nghiệm, bể ổn nhiệt', actions: BC_ACTIONS, custom: true },
      { id: 'ez', title: 'Enzyme', actions: EZ_ACTIONS, custom: true },
      { id: 'mb', title: 'Vi sinh, biến nạp', actions: MB_ACTIONS, custom: true },
      { id: 'mo', title: 'Plasmid', actions: MO_ACTIONS, custom: true },
      { id: 'pt', title: 'Proteomics', actions: PR_ACTIONS2, custom: true },
      { id: 'ck', title: 'Phôi gà', actions: CK_ACTIONS, custom: true },
      { id: 'ev', title: 'Tiến hoá', actions: EV_ACTIONS, custom: true },
      { id: 'fe', title: 'Thực địa', actions: FE_ACTIONS, custom: true },
      { id: 'fl', title: 'Đèn cồn, ống nghiệm', actions: FL_ACTIONS, custom: true },
      { id: 'geo', title: 'Bản đồ Cát Bà', actions: GEO_ACTIONS, custom: true },
      { id: 'dis', title: 'Giải phẫu động vật', actions: DIS_ACTIONS, custom: true },
      { id: 'dx', title: 'Tách DNA thực vật', actions: DX_ACTIONS, custom: true },
      { id: 'pm', title: 'PCR mở rộng', actions: PM_ACTIONS, custom: true },
      { id: 'sl', title: 'Tiêu bản hiển vi', actions: SL_ACTIONS, custom: true },
      { id: 'gc', title: 'Thực tập hoá đại cương', actions: GC_ACTIONS, custom: true },
      { id: 'eco', title: 'Phương pháp lấy mẫu', actions: ECO_ACTIONS, custom: true },
      { id: 'vs', title: 'Vi sinh: nhuộm Gram, đếm vi sinh vật', actions: VS_ACTIONS, custom: true },
      { id: 'pu', title: 'Tinh sạch enzyme', actions: PU_ACTIONS, custom: true },
      { id: 'exo', title: 'Bóng ngoại bào', actions: EXO_ACTIONS, custom: true },
      { id: 'st', title: 'Phân tích số liệu', actions: ST_ACTIONS, custom: true },
    ],
    onAction: runAction,
    onSelect(id) {
      endAssignment();
      tracker.set(protocols.find((p) => p.id === id) ?? null);
      showTools();
      resetAll();
    },
    // Đang làm bài tập thì làm lại với đúng seed chung của lớp
    onReset: () => resetAll(assignment && tracker.protocol?.id === assignment.protocol.id ? new Session({ protocol: assignment.protocol.id, seed: assignment.seed, start: { climate: { ...climateState } } }) : null),
    onSave() {
      download(new Blob([session.stringify()], { type: 'application/json' }), `phien-virtual-lab-${today()}.json`);
      panel.sessionState(`Đã lưu file · ${session.length} thao tác`);
    },
    onOpen(text, name) {
      let cls = null;
      try {
        cls = parseClassFile(text);
      } catch (err) {
        return panel.notice(`Không mở được ${name}: ${err.message}`, 'warning');
      }
      if (cls?.kind === 'assignment') return openAssignment(cls);
      if (cls?.kind === 'submission') return reviewSubmission(cls);
      let next;
      try {
        next = Session.parse(text);
      } catch (err) {
        return panel.notice(`Không mở được ${name}: ${err.message}`, 'warning');
      }
      restore(next, `file ${name}`);
    },
    onReport: showReport,
    onExam: (on) => panel.notice(on ? 'Chế độ kiểm tra: thẻ kết quả không còn phần giải thích và tác dụng, không có nút làm mẫu. Làm xong bấm "Nộp bài".' : 'Đã tắt chế độ kiểm tra.'),
    onSubmit() {
      const r = examNow();
      panel.notice(`Điểm: ${String(r.score).replace('.', ',')}/10. Làm đúng ${r.done}/${r.total} bước${r.early ? `, ${r.early} bước sai thứ tự` : ''}; ${r.off} thao tác ngoài protocol, ${r.warnings} cảnh báo trong thẻ kết quả.`, r.score >= 5 ? 'info' : 'warning');
    },
    // Giáo viên: xuất protocol đang chọn thành gói bài tập, cả lớp cùng một seed nên cùng số liệu ngẫu nhiên
    onAssign() {
      const p = tracker.protocol;
      if (!p) return panel.notice('Chọn một protocol trước khi xuất bài tập.', 'warning');
      const a = makeAssignment({ protocol: p, seed: (Date.now() ^ (Math.random() * 2 ** 32)) >>> 0, exam: true });
      download(new Blob([JSON.stringify(a, null, 1)], { type: 'application/json' }), `bai-tap-${slug(p.title).replace(/^my-/, '')}-${a.id}.json`);
      panel.notice(`Đã xuất gói bài tập "${p.title}" (mã ${a.id}). Gửi file cho học sinh: mở bằng "Mở file phiên", làm ở chế độ kiểm tra rồi bấm "Xuất bài nộp".`);
    },
    // Học sinh: xuất bài nộp gồm nhật ký phiên và điểm tự chấm
    onHandIn(student) {
      if (!assignment) return;
      if (!student.trim()) return panel.notice('Nhập họ tên trước khi xuất bài nộp.', 'warning');
      const score = examNow();
      const sub = makeSubmission({ assignment, student, session, score });
      download(new Blob([JSON.stringify(sub)], { type: 'application/json' }), `bai-nop-${slug(student).replace(/^my-/, '')}-${assignment.id}.json`);
      panel.notice(`Đã xuất bài nộp của ${student.trim()}: ${session.length} thao tác, điểm tự chấm ${String(score.score).replace('.', ',')}/10.`);
    },
    onGoto: () => lab.flyTo(tracker.protocol?.zone ?? 'bench-chem'),
    onDemo(i) {
      const p = tracker.protocol;
      const { substance, container, action, ...params } = p.steps[i].expect;
      if (action?.startsWith('pea-')) return runPea(action, params);
      if (action?.startsWith('fly-')) return runFly(action, params);
      if (action?.startsWith('zf-')) return runZf(action, params);
      if (action === 'ppe-wear') return runSafety(params);
      if (action && machineOf(action)) return runMachine(action, params);
      if (action === 'chem-take' || action?.startsWith('titr-')) {
        // Làm mẫu bước chuẩn độ: nhỏ nhanh từng mL khi còn xa điểm tương đương, rồi từng giọt tới khi hồng nhạt
        if (action === 'titr-add') return demoTitrate();
        return runChem(action, params);
      }
      if (action) return runAction(action);
      if (params.tool) {
        chemState.tool = params.tool;
        chemState.volume = params.volume ?? chemState.volume;
        syncChem();
      }
      if (zone === p.zone) lab.demoPour(substance, container);
      else {
        lab.flyTo(p.zone);
        setTimeout(() => lab.demoPour(substance, container), 1050);
      }
    },
  });
  panel.renderSteps(tracker);
  // Nhóm thao tác hiện theo protocol: PCR, khu trồng trọt, hoặc cả hai ở chế độ tự do
  function showTools() {
    const p = tracker.protocol;
    if (!p) return panel.showGroups(['chem', 'pcr', 'garden', 'fly', 'zf', 'uv', 'cf', 'hplc', 'mic', 'qpcr', 'nd', 'vx', 'pr', 'ac', 'ms', 'bsc', 'inv', 'hp', 'bal', 'fh', 'em', 'bc', 'ez', 'mb', 'mo', 'pt', 'ck', 'ev', 'fe', 'pu', 'exo', 'st', 'fl', 'geo', 'dis', 'dx', 'sl', 'gc', 'eco', 'vs', 'pm']);
    const acts = p.steps.map((s) => s.expect.action ?? '');
    panel.showGroups([p.zone === 'bench-chem' && 'chem', acts.some((a) => a in ACTIONS) && 'pcr', p.mendel && 'garden', p.fly && 'fly', p.zf && 'zf', p.uv && 'uv', p.cf && 'cf', p.hplc && 'hplc', p.mic && 'mic', p.qpcr && 'qpcr', p.nd && 'nd', p.vx && 'vx', p.pr && 'pr', p.ac && 'ac', p.ms && 'ms', p.bsc && 'bsc', p.inv && 'inv', p.hp && 'hp', p.bal && 'bal', p.fh && 'fh', p.em && 'em', p.bc && 'bc', p.ez && 'ez', p.mb && 'mb', p.mo && 'mo', p.pt && 'pt', p.ck && 'ck', p.ev && 'ev', p.fe && 'fe', p.pu && 'pu', p.exo && 'exo', p.st && 'st', p.fl && 'fl', p.geo && 'geo', p.dis && 'dis', p.dx && 'dx', p.sl && 'sl', p.gc && 'gc', p.eco && 'eco', p.vs && 'vs', p.pm && 'pm'].filter(Boolean));
  }
  const today = () => new Date().toLocaleDateString('sv');
  function download(blob, file) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = file;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  // Báo cáo Markdown theo mẫu lab-report của vault, kèm CSV của các sổ thí nghiệm có dữ liệu
  const NOTEBOOKS = [[mendel, 'Sổ vườn đậu'], [flies, 'Sổ ruồi giấm'], [fish, 'Sổ phôi cá ngựa vằn'], [spectro, 'Sổ máy quang phổ'], [centri, 'Sổ máy ly tâm'], [hplc, 'Sổ HPLC'], [scope, 'Sổ kính hiển vi'], [qpcr, 'Sổ qPCR'], [nd, 'Sổ đo DNA'], [vx, 'Sổ vortex'], [pr, 'Sổ máy đọc vi đĩa'], [ac, 'Sổ nồi hấp'], [ms, 'Sổ LC-MS/MS'], [bsc, 'Sổ tủ an toàn sinh học'], [coldLab, 'Sổ kho lạnh'], [heatLab, 'Sổ máy khuấy từ'], [bal, 'Sổ cân phân tích'], [hoodLab, 'Sổ tủ hút'], [emLab, 'Sổ sự cố'], [bc, 'Sổ hoá sinh'], [ez, 'Sổ enzyme'], [mb, 'Sổ vi sinh'], [mo, 'Sổ plasmid'], [pt, 'Sổ proteomics'], [ck, 'Sổ phôi gà'], [ev, 'Sổ tiến hoá'], [fe, 'Sổ thực địa'], [pu, 'Sổ tinh sạch enzyme'], [exo, 'Sổ bóng ngoại bào'], [st, 'Sổ phân tích'], [fl, 'Sổ đèn cồn'], [geo, 'Sổ bản đồ Cát Bà'], [dis, 'Sổ giải phẫu'], [dx, 'Sổ tách DNA'], [sl, 'Sổ tiêu bản'], [gc, 'Sổ hoá đại cương'], [eco, 'Sổ lấy mẫu'], [vs, 'Sổ vi sinh']];
  function showReport() {
    const p = tracker.protocol;
    const date = today();
    const md = labReport({
      protocol: p,
      steps: p ? p.steps.map((st, i) => ({ text: st.text, state: tracker.state(i) })) : [],
      entries: panel.entries(),
      notebooks: NOTEBOOKS.map(([l, name]) => ({ name, csv: l.notebook?.rows.length ? l.notebook.toCSV() : '' })),
      date,
      finished: tracker.finished,
    });
    const file = reportFileName(p, date);
    const url = URL.createObjectURL(new Blob([md], { type: 'text/markdown;charset=utf-8' }));
    panel.notice(`Báo cáo ${file}: ${panel.entries().length} thẻ kết quả. Chép vào vault (mục Biology Project and Lab Report) hoặc mở bằng trình soạn Markdown.`, 'info', `<pre class="csv" tabindex="0">${md.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c])}</pre>
      <div class="g-row"><a class="btn btn-ghost" href="${url}" download="${file.replace(/"/g, '')}">Tải báo cáo .md</a><button type="button" class="btn btn-ghost" data-copy-report>Sao chép</button></div>`);
    const btn = document.querySelector('#log [data-copy-report]');
    btn?.addEventListener('click', () => {
      navigator.clipboard?.writeText(md).then(() => { btn.textContent = 'Đã sao chép'; }, () => { btn.textContent = 'Không sao chép được: chọn chữ trong khung và sao chép tay'; });
    });
  }
  // Chạy lại nhật ký của một phiên: đặt lại các lõi bằng seed cũ, khí hậu lúc bắt đầu, rồi từng thao tác theo thứ tự
  const DISPATCH = {
    pour: (a, p) => pour(p.substance, p.container, p),
    pcr: (a) => runAction(a),
    pea: runPea,
    fly: runFly,
    zf: runZf,
    chem: runChem,
    machine: runMachine,
    ppe: (a, p) => runSafety(p),
    climate: (a, p) => climatePanel.setState(p),
    'zf-setup': (a, p) => zfSetup(p),
    hand: (a, p) => pipAction(a, p),
    ops: (a, p) => opsAction(a, p),
  };
  function examNow() {
    const p = tracker.protocol;
    return examScore({ steps: p ? p.steps.map((st, i) => ({ state: tracker.state(i) })) : [], entries: panel.entries() });
  }
  // Gói bài tập: thêm protocol của gói (nếu là protocol giáo viên tự soạn), bật chế độ kiểm tra, bắt đầu phiên với seed chung
  let assignment = null;
  const CLASS = 'virtual-lab:assignment';
  function endAssignment() {
    if (!assignment) return;
    assignment = null;
    panel.classBar(null);
    try { localStorage.removeItem(CLASS); } catch { /* bỏ qua */ }
  }
  function useAssignmentProtocol(p) {
    const same = protocols.find((x) => x.id === p.id);
    if (same && JSON.stringify(same.steps) === JSON.stringify(p.steps)) return same.id;
    const id = same ? `${p.id}-bai-tap` : p.id;
    protocols.push({ ...p, id });
    panel.setProtocols(protocols);
    return id;
  }
  function openAssignment({ data, intact }) {
    const id = useAssignmentProtocol(data.protocol);
    assignment = { ...data, protocol: { ...data.protocol, id } };
    try { localStorage.setItem(CLASS, JSON.stringify(assignment)); } catch { /* bỏ qua */ }
    tracker.set(protocols.find((p) => p.id === id));
    showTools();
    panel.setExam(Boolean(data.exam));
    panel.classBar(data.title);
    resetAll(new Session({ protocol: id, seed: data.seed, start: { climate: { ...climateState } } }));
    persist();
    lab.flyTo(tracker.protocol.zone ?? 'bench-chem');
    panel.notice(`Đã mở bài tập "${data.title}"${data.exam ? ' ở chế độ kiểm tra' : ''}.${intact ? '' : ' Cảnh báo: mã của gói không khớp nội dung, file có thể đã bị sửa.'} Làm xong nhập họ tên rồi bấm "Xuất bài nộp".`, intact ? 'info' : 'warning');
  }
  // Giáo viên: mở bài nộp, kiểm mã băm, chạy lại nhật ký với đúng seed rồi chấm lại
  function reviewSubmission({ data, session: next, intact }) {
    useAssignmentProtocol(data.assignment.protocol);
    restore(next, `bài nộp của ${data.student}`);
    const r = examNow();
    const self = data.score?.score;
    const same = self === r.score;
    panel.notice(`Bài nộp của ${data.student || '(không tên)'} · bài tập ${data.assignment.title} (mã ${data.assignment.id}). ${intact ? 'Mã băm khớp: file chưa bị sửa.' : 'Mã băm KHÔNG khớp: file đã bị sửa sau khi xuất.'} Chấm lại bằng cách chạy lại nhật ký: ${String(r.score).replace('.', ',')}/10 (đúng ${r.done}/${r.total} bước${r.early ? `, ${r.early} sai thứ tự` : ''}; ${r.off} thao tác ngoài protocol, ${r.warnings} cảnh báo)${same ? ', trùng điểm tự chấm.' : `; điểm tự chấm trong file là ${self}.`}`, intact && same ? 'info' : 'warning');
  }
  function restore(next, from) {
    replaying = true;
    tracker.set(protocols.find((p) => p.id === next.protocol) ?? null);
    showTools();
    if (next.start?.climate) climatePanel.setState(next.start.climate);
    resetAll(next);
    const r = next.replay((k, a, p) => {
      if (!DISPATCH[k]) throw new Error(`thao tác lạ "${k}"`);
      DISPATCH[k](a, p);
    });
    replaying = false;
    if (!r.ok) next.journal.length = r.at;
    persist();
    const when = next.savedAt ? new Date(next.savedAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : '';
    panel.notice(r.ok
      ? `Đã mở lại phiên từ ${from}${when ? ` (lưu lúc ${when})` : ''}: chạy lại ${r.at} thao tác với đúng seed cũ. Bấm "Làm lại" để bắt đầu phiên mới.`
      : `Mở lại phiên từ ${from} dừng ở thao tác ${r.at + 1} (${r.error}): giữ ${r.at} thao tác đầu.`, r.ok ? 'info' : 'warning');
  }

  // Trình soạn protocol: ghi lại thao tác từ nhật ký phiên
  const actionNames = Object.assign({}, CHEM_ACTIONS, ACTIONS, PEA_ACTIONS, FLY_ACTIONS, ZF_ACTIONS, UV_ACTIONS, CF_ACTIONS, HPLC_ACTIONS, MIC_ACTIONS, QPCR_ACTIONS, ND_ACTIONS, VX_ACTIONS, PR_ACTIONS, AC_ACTIONS, MS_ACTIONS, BSC_ACTIONS, INV_ACTIONS, HP_ACTIONS, BAL_ACTIONS, FH_ACTIONS, EM_ACTIONS, BC_ACTIONS, EZ_ACTIONS, MB_ACTIONS, MO_ACTIONS, PR_ACTIONS2, CK_ACTIONS, EV_ACTIONS, FE_ACTIONS, PU_ACTIONS, EXO_ACTIONS, ST_ACTIONS, FL_ACTIONS, GEO_ACTIONS, DIS_ACTIONS, DX_ACTIONS, SL_ACTIONS, GC_ACTIONS, ECO_ACTIONS, VS_ACTIONS, PM_ACTIONS, { 'ppe-wear': 'Mặc đồ bảo hộ' });
  const nameMap = { ...actionNames, ...Object.fromEntries(substances.map((x) => [x.id, x.formula ? `${x.formula} ${x.conc ?? ''}`.trim() : x.name])), ...Object.fromEntries(CONTAINERS.map((c) => [c.id, c.name])) };
  let recordFrom = null;
  createProtocolEditor(panel.editorRoot(), {
    zones: ZONES.filter((z) => z.id !== 'overview'),
    mine: () => protocols.filter((p) => p.id.startsWith('my-')),
    onRecord(on) {
      if (on) { recordFrom = session.length; return null; }
      const res = stepsFromJournal(session.journal.slice(recordFrom ?? session.length), nameMap);
      recordFrom = null;
      return res;
    },
    onSave(draft) {
      const p = { ...groupKeysOf(draft.steps), ...draft, id: draft.id ?? slug(draft.title) };
      const errors = validateProtocol(p, { actions: new Set(Object.keys(actionNames)), substances: new Set(substances.map((x) => x.id)), containers: new Set(CONTAINERS.map((c) => c.id)), builtinIds: new Set(builtinProtocols.map((x) => x.id)) });
      if (errors.length) return errors;
      const i = protocols.findIndex((x) => x.id === p.id);
      if (i >= 0) protocols[i] = p;
      else protocols.push(p);
      try { localStorage.setItem(MINE, JSON.stringify(protocols.filter((x) => x.id.startsWith('my-')))); } catch { return ['Trình duyệt không cho lưu: dùng "Tải JSON".']; }
      panel.setProtocols(protocols);
      return [];
    },
    onDelete(id) {
      const i = protocols.findIndex((x) => x.id === id);
      if (i >= 0) protocols.splice(i, 1);
      try { localStorage.setItem(MINE, JSON.stringify(protocols.filter((x) => x.id.startsWith('my-')))); } catch { /* bỏ qua */ }
      panel.setProtocols(protocols);
    },
  });

  const garden = createGardenPanel(panel.toolRoot('garden'), { pea, onAction: runPea, onNotebook: showNotebook });
  garden.setTraits(mendel.setup.traits);
  const chemPanel = createChemPanel(panel.toolRoot('chem'), {
    substances,
    ppe: PPE,
    ghs: (id) => safetyCheck.label(id),
    tools,
    onAction: runChem,
    onTool(tool, volume) {
      chemState.tool = tool;
      chemState.volume = volume;
    },
  });
  function demoTitrate() {
    if (!titration.filled) runChem('titr-fill');
    const box = engine.containers.get('flask');
    const n = box.amounts.get('HClx') ?? 0;
    const vEq = titration.n0 !== null ? (titration.n0 / 0.1) * 1000 : (n / 0.1) * 1000;
    let guard = 0;
    while (titration.pinkAt === null && titration.left > 0 && guard++ < 600) {
      const gap = vEq - titration.delivered;
      runChem('titr-add', { volume: gap > 1.5 ? 1 : gap > 0.4 ? 0.1 : 0 });
    }
  }
  const toolPanels = {
    uv: createToolPanel(panel.toolRoot('uv'), {
      id: 'uv',
      title: 'Máy quang phổ UV-Vis · đo quang',
      rows: [
        { label: 'Bước sóng', items: [{ select: 'lambda', aria: 'Bước sóng (nm)', options: [300, 340, 380, 405, 450, 500].map((v) => [v, `${v} nm`]), value: 405 }, { button: 'Đo mẫu trắng', action: 'uv-blank', params: (g) => ({ lambda: g('lambda') }) }] },
        { label: 'Đo', items: [{ button: 'Đo dãy chuẩn', action: 'uv-standards', params: (g) => ({ lambda: g('lambda') }) }, { select: 'dil', aria: 'Pha loãng mẫu', options: [[1, 'không pha loãng'], [10, 'pha loãng 10 lần']], value: 1 }, { button: 'Đo mẫu chưa biết', action: 'uv-unknown', params: (g) => ({ lambda: g('lambda'), dilution: g('dil') }) }] },
        { label: 'Kết quả', items: [{ button: 'Dựng đường chuẩn', action: 'uv-curve' }] },
      ],
      onAction: runMachine,
      onFigure: () => machineFigure('uv'),
      onNotebook: () => showNotebook(spectro, 'so-thi-nghiem-quang-pho.csv'),
    }),
    cf: createToolPanel(panel.toolRoot('cf'), {
      id: 'cf',
      title: 'Máy ly tâm',
      rows: [
        { label: 'Nạp ống', items: [{ select: 'load', aria: 'Cách xếp ống', options: Object.entries(LOADS).map(([k, v]) => [k, v.name]), value: 'pair' }] },
        { label: 'Chương trình', items: [{ select: 'rcf', aria: 'Lực ly tâm', options: [1000, 2000, 5000, 12000, 21300].map((v) => [v, `${v.toLocaleString('fr-FR')} × g`]), value: 5000 }, { select: 'min', aria: 'Thời gian', options: [1, 5, 10, 20].map((v) => [v, `${v} phút`]), value: 10 }, { button: 'Chạy', action: 'cf-run', params: (g) => ({ load: g('load'), rcf: g('rcf'), minutes: g('min') }) }] },
      ],
      onAction: runMachine,
      onFigure: () => machineFigure('cf'),
      onNotebook: () => showNotebook(centri, 'so-ly-tam.csv'),
    }),
  };
  toolPanels.hplc = createToolPanel(panel.toolRoot('hplc'), {
    id: 'hplc',
    title: 'HPLC · cột C18',
    rows: [
      { label: 'Phương pháp', items: [{ select: 'org', aria: 'Phần trăm acetonitrile', options: [5, 10, 20, 30, 40].map((v) => [v, `${v} % acetonitrile`]), value: 10 }, { select: 'flow', aria: 'Lưu lượng', options: [0.5, 1, 1.5, 2].map((v) => [v, `${String(v).replace('.', ',')} mL/phút`]), value: 1 }, { button: 'Đặt', action: 'hplc-method', params: (g) => ({ organic: g('org'), flow: g('flow') }) }] },
      { label: 'Tiêm', items: [{ button: 'Dãy chuẩn caffeine', action: 'hplc-standards' }, { button: 'Mẫu nước giải khát', action: 'hplc-sample' }, { button: 'Dựng đường chuẩn', action: 'hplc-calibrate' }] },
      { label: 'Viên thuốc', items: [{ select: 'ratio', aria: 'Tỉ lệ đệm pH 3 : methanol', options: [['50:50', 'đệm : MeOH 50 : 50'], ['60:40', 'đệm : MeOH 60 : 40'], ['70:30', 'đệm : MeOH 70 : 30']], value: '70:30' }, { button: 'Đặt pha động', action: 'hplc-pc-phase', params: (g) => ({ ratio: g('ratio') }) }, { button: 'Dãy chuẩn paracetamol + caffeine', action: 'hplc-pc-std' }, { select: 'spike', aria: 'Mẫu', options: [['no', 'mẫu viên thuốc'], ['yes', 'mẫu thêm chuẩn']], value: 'no' }, { select: 'pcdil', aria: 'Pha loãng', options: [[20, 'pha loãng 20 lần'], [40, 'pha loãng 40 lần']], value: 20 }, { button: 'Tiêm mẫu', action: 'hplc-pc-sample', params: (g) => ({ spike: g('spike') === 'yes', dilution: g('pcdil') }) }, { button: 'Tính hàm lượng, thu hồi', action: 'hplc-pc-calc' }] },
    ],
    onAction: runMachine,
    onFigure: () => machineFigure('hplc'),
    onNotebook: () => showNotebook(hplc, 'so-hplc.csv'),
  });
  toolPanels.mic = createToolPanel(panel.toolRoot('mic'), {
    id: 'mic',
    title: 'Kính hiển vi quang học',
    rows: [
      { label: 'Mẫu', items: [{ select: 'sp', aria: 'Mẫu', options: [['onion', 'biểu bì vảy hành'], ['blood', 'phết máu']], value: 'onion' }, { select: 'obj', aria: 'Vật kính', options: [4, 10, 40, 100].map((v) => [v, `vật kính ${v}×`]), value: 4 }, { select: 'oil', aria: 'Dầu soi', options: [['no', 'không dầu'], ['yes', 'có dầu soi']], value: 'no' }] },
      { label: 'Lấy nét', items: [{ button: 'Núm thô', action: 'mic-view', params: (g) => ({ specimen: g('sp'), objective: g('obj'), oil: g('oil') === 'yes', focus: 'coarse' }) }, { button: 'Núm tinh', action: 'mic-view', params: (g) => ({ specimen: g('sp'), objective: g('obj'), oil: g('oil') === 'yes', focus: 'fine' }) }, { button: 'Chỉ đổi vật kính', action: 'mic-view', params: (g) => ({ specimen: g('sp'), objective: g('obj'), oil: g('oil') === 'yes', focus: 'none' }) }] },
    ],
    onAction: runMachine,
    onFigure: () => machineFigure('mic'),
    onNotebook: () => showNotebook(scope, 'so-kinh-hien-vi.csv'),
  });
  toolPanels.qpcr = createToolPanel(panel.toolRoot('qpcr'), {
    id: 'qpcr',
    title: 'Máy real-time PCR · SYBR Green',
    rows: [
      { label: 'Đĩa', items: [{ select: 'ntc', aria: 'Giếng NTC', options: [['clean', 'có NTC'], ['contam', 'NTC (nước bị nhiễm)'], ['none', 'không có NTC']], value: 'clean' }, { select: 'sample', aria: 'Mẫu', options: [['clean', 'mẫu sạch'], ['inhibited', 'mẫu lẫn chất ức chế']], value: 'clean' }, { button: 'Pha đĩa', action: 'qpcr-plate', params: (g) => ({ ntc: g('ntc'), sample: g('sample') }) }] },
      { label: 'Chạy', items: [{ button: 'Chạy 40 chu kỳ', action: 'qpcr-run' }, { button: 'Đường nóng chảy', action: 'qpcr-melt' }, { button: 'Định lượng', action: 'qpcr-quant' }] },
    ],
    onAction: runMachine,
    onFigure: () => machineFigure('qpcr'),
    onNotebook: () => showNotebook(qpcr, 'so-qpcr.csv'),
  });
  toolPanels.nd = createToolPanel(panel.toolRoot('nd'), {
    id: 'nd',
    title: 'Máy đo nồng độ DNA · đo trên bệ',
    rows: [
      { label: 'Mẫu trắng', items: [{ select: 'buf', aria: 'Dung dịch đệm', options: [['TE', 'TE'], ['EB', 'EB (Tris 10 mM)'], ['water', 'nước']], value: 'TE' }, { button: 'Đo mẫu trắng', action: 'nd-blank', params: (g) => ({ buffer: g('buf') }) }] },
      { label: 'Mẫu', items: [{ select: 'sample', aria: 'Mẫu', options: Object.entries(ND_SAMPLES).map(([k, v]) => [k, v.name]), value: 'plasmid' }, { select: 'vol', aria: 'Thể tích nhỏ lên bệ', options: [[0.5, '0,5 µL'], [1, '1 µL'], [1.5, '1,5 µL'], [2, '2 µL']], value: 1.5 }] },
      { label: 'Đo', items: [{ button: 'Đo mẫu', action: 'nd-measure', params: (g) => ({ sample: g('sample'), volume: g('vol') }) }, { button: 'Lau bệ', action: 'nd-wipe' }] },
    ],
    onAction: runMachine,
    onFigure: () => machineFigure('nd'),
    onNotebook: () => showNotebook(nd, 'so-do-dna.csv'),
  });
  toolPanels.vx = createToolPanel(panel.toolRoot('vx'), {
    id: 'vx',
    title: 'Máy vortex · máy ly tâm mini',
    rows: [
      { label: 'Vortex', items: [{ select: 'sample', aria: 'Ống', options: Object.entries(VX_SAMPLES).map(([k, v]) => [k, v.name]), value: 'mix' }, { select: 'rpm', aria: 'Tốc độ', options: [600, 1000, 1800, 2500, 3200].map((v) => [v, `${v.toLocaleString('fr-FR')} rpm`]), value: 2500 }, { select: 'sec', aria: 'Thời gian trộn', options: [2, 5, 10].map((v) => [v, `${v} s`]), value: 10 }, { button: 'Ấn ống lên cup', action: 'vx-mix', params: (g) => ({ sample: g('sample'), rpm: g('rpm'), seconds: g('sec') }) }] },
      { label: 'Ly tâm mini', items: [{ select: 'spin', aria: 'Thời gian đóng nắp', options: [3, 5, 10].map((v) => [v, `${v} s`]), value: 10 }, { button: 'Đóng nắp, ly tâm', action: 'vx-spin', params: (g) => ({ seconds: g('spin') }) }] },
    ],
    onAction: runMachine,
    onFigure: () => machineFigure('vx'),
    onNotebook: () => showNotebook(vx, 'so-vortex.csv'),
  });
  toolPanels.hp = createToolPanel(panel.toolRoot('hp'), {
    id: 'hp',
    title: 'Máy khuấy từ gia nhiệt · đun và làm nguội cốc',
    rows: [
      { label: 'Đun', items: [{ select: 'cup', aria: 'Cốc', options: Object.entries(HP_CUPS), value: 'beaker-a' }, { select: 'set', aria: 'Nhiệt độ đặt', options: [40, 60, 80, 95].map((v) => [v, `${v} °C`]), value: 95 }, { select: 'probe', aria: 'Đầu dò nhiệt', options: [['yes', 'có đầu dò'], ['no', 'không đầu dò']], value: 'yes' }, { select: 'min', aria: 'Thời gian', options: [5, 10, 20].map((v) => [v, `${v} phút`]), value: 10 }, { button: 'Đặt cốc lên, đun', action: 'hp-heat', params: (g) => ({ cup: g('cup'), setC: g('set'), probe: g('probe') === 'yes', minutes: g('min') }) }] },
      { label: 'KNO₃', items: [{ select: 'kw', aria: 'Lượng nước', options: [[20, '20 g KNO₃ + 20 mL nước'], [50, '20 g KNO₃ + 50 mL nước']], value: 20 }, { select: 'kh', aria: 'Đun tới', options: [[40, 'đun 40 °C'], [80, 'đun 80 °C']], value: 80 }, { select: 'kc', aria: 'Làm lạnh tới', options: [[25, 'nguội 25 °C'], [0, 'nước đá 0 °C']], value: 0 }, { button: 'Kết tinh lại', action: 'hp-kno3', params: (g) => ({ grams: 20, waterMl: g('kw'), hotC: g('kh'), coolC: g('kc') }) }] },
      { label: 'Làm nguội', items: [{ select: 'mode', aria: 'Cách làm nguội', options: [['air', 'để nguội ở nhiệt độ phòng'], ['ice', 'ngâm chậu nước đá']], value: 'air' }, { select: 'cmin', aria: 'Thời gian', options: [5, 15, 30].map((v) => [v, `${v} phút`]), value: 30 }, { button: 'Nhấc cốc ra, làm nguội', action: 'hp-cool', params: (g) => ({ cup: g('cup'), mode: g('mode'), minutes: g('cmin') }) }, { button: 'Quan sát tinh thể', action: 'hp-look', params: (g) => ({ cup: g('cup') }) }] },
    ],
    onAction: runMachine,
    onFigure: () => machineFigure('hp'),
    onNotebook: () => showNotebook(heatLab, 'so-may-khuay-tu.csv'),
  });
  // Đèn cồn: đun ống nghiệm, cốc; thử màu ngọn lửa; đốt Mg; que đóm. Cũng bấm được ngay trong cảnh (đèn, kẹp, que đóm).
  const chemLabel = (x) => `${(x.formula ?? x.label).replace(/(\d+)/g, (d) => [...d].map((c) => '₀₁₂₃₄₅₆₇₈₉'[c]).join(''))}${x.conc ? ` ${x.conc}` : ''}`;
  toolPanels.fl = createToolPanel(panel.toolRoot('fl'), {
    id: 'fl',
    title: 'Đèn cồn · đun ống nghiệm, cốc, thử màu ngọn lửa',
    rows: [
      { label: 'Đèn', items: [{ select: 'lm', aria: 'Cách châm', options: [['match', 'châm bằng diêm'], ['lamp', 'châm từ đèn khác (sai)']], value: 'match' }, { button: 'Mở nắp, châm đèn', action: 'fl-light', params: (g) => ({ method: g('lm') }) }, { select: 'om', aria: 'Cách tắt', options: [['cap', 'đậy nắp'], ['blow', 'thổi tắt (sai)']], value: 'cap' }, { button: 'Tắt đèn', action: 'fl-out', params: (g) => ({ method: g('om') }) }] },
      { label: 'Đun', items: [{ select: 'tg', aria: 'Vật chứa', options: Object.entries(FL_TARGETS), value: 'tt-1' }, { select: 'sec', aria: 'Thời gian', options: [10, 20, 30, 60, 120, 180, 300].map((v) => [v, v < 60 ? `${v} giây` : `${v / 60} phút`]), value: 30 }, { select: 'even', aria: 'Cách hơ', options: [['yes', 'hơ đều cả ống trước'], ['no', 'đun ngay ở đáy']], value: 'yes' }, { select: 'gz', aria: 'Lưới', options: [['yes', 'cốc trên lưới tản nhiệt'], ['no', 'cốc không có lưới']], value: 'yes' }, { button: 'Đun', action: 'fl-heat', params: (g) => ({ target: g('tg'), seconds: g('sec'), even: g('even') === 'yes', gauze: g('gz') === 'yes' }) }, { button: 'Để nguội', action: 'fl-cool', params: (g) => ({ target: g('tg'), seconds: g('sec') }) }, { button: 'Que đóm vào miệng ống', action: 'fl-splint', params: (g) => ({ target: g('tg') }) }] },
      { label: 'Màu lửa', items: [{ button: 'Làm sạch dây (HCl, hơ lửa)', action: 'fl-clean' }, { select: 'sub', aria: 'Mẫu thử', options: substances.filter((x) => x.kind === 'chem' && x.flame && !x.solid).map((x) => [x.id, `${chemLabel(x)}`]), value: 'NaCl' }, { select: 'co', aria: 'Kính cobalt', options: [['no', 'mắt thường'], ['yes', 'qua kính cobalt']], value: 'no' }, { button: 'Nhúng dây, đưa vào lửa', action: 'fl-test', params: (g) => ({ sample: g('sub'), cobalt: g('co') === 'yes' }) }] },
      { label: 'Đốt Mg', items: [{ select: 'tool', aria: 'Cầm bằng', options: [['tongs', 'kẹp sắt'], ['hand', 'tay (sai)']], value: 'tongs' }, { button: 'Đốt băng magnesium', action: 'fl-burn', params: (g) => ({ tool: g('tool') }) }] },
    ],
    onAction: runMachine,
    onNotebook: () => showNotebook(fl, 'so-den-con.csv'),
  });
  toolPanels.fh = createToolPanel(panel.toolRoot('fh'), {
    id: 'fh',
    title: 'Tủ hút khí độc · Cu với HNO₃ đặc',
    rows: [
      { label: 'Tủ', items: [{ select: 'sash', aria: 'Độ mở kính', options: SASH_STOPS.map((v) => [v, v ? `kính mở ${v} mm${v === 457 ? ' (chặn)' : ''}` : 'kính đóng']), value: 457 }, { select: 'fan', aria: 'Quạt hút', options: [['yes', 'quạt chạy'], ['no', 'quạt tắt']], value: 'yes' }, { select: 'clutter', aria: 'Đồ trong tủ', options: [['no', 'lòng tủ gọn'], ['yes', 'chai lọ sát vách ngăn']], value: 'no' }, { button: 'Chỉnh tủ', action: 'fh-set', params: (g) => ({ sash: g('sash'), fan: g('fan'), clutter: g('clutter') }) }] },
      { label: 'Bảo hộ', items: [{ select: 'ppe', aria: 'Đồ bảo hộ', options: Object.entries(PPE), value: 'goggles' }, { select: 'on', aria: 'Mặc hay bỏ', options: [['yes', 'mặc'], ['no', 'bỏ ra']], value: 'yes' }, { button: 'Mặc / bỏ', action: 'ppe-wear', params: (g) => ({ item: g('ppe'), on: g('on') }) }] },
      { label: 'Ống kín', items: [{ select: 'bath', aria: 'Ngâm ống vào', options: Object.entries(BATHS).map(([k, v]) => [k, `${v.name} (${v.T} °C)`]), value: 'ice' }, { button: 'Ngâm ống NO₂', action: 'fh-tube', params: (g) => ({ bath: g('bath') }) }] },
      { label: 'Phản ứng', items: [{ select: 'where', aria: 'Làm ở đâu', options: [['hood', 'trong tủ hút'], ['bench', 'trên bàn hở']], value: 'hood' }, { button: 'Cho 2 g phoi Cu vào HNO₃ đặc', action: 'fh-work', params: (g) => ({ where: g('where') }) }] },
    ],
    onAction: (a, p) => (a === 'ppe-wear' ? runSafety(p) : runMachine(a, p)),
    onFigure: () => machineFigure('fh'),
    onNotebook: () => showNotebook(hoodLab, 'so-tu-hut.csv'),
  });
  toolPanels.em = createToolPanel(panel.toolRoot('em'), {
    id: 'em',
    title: 'An toàn · xử lý sự cố',
    rows: [
      { label: 'Rửa mắt', items: [{ select: 'reach', aria: 'Thời gian tới trạm', options: [[10, 'tới trạm trong 10 s'], [30, 'tới trạm mất 30 s']], value: 10 }, { select: 'min', aria: 'Thời gian rửa', options: [2, 5, 15].map((v) => [v, `rửa ${v} phút`]), value: 15 }, { select: 'wc', aria: 'Nhiệt độ nước', options: [[8, 'nước 8 °C'], [25, 'nước 25 °C'], [45, 'nước 45 °C']], value: 25 }, { button: 'Rửa mắt', action: 'em-eyewash', params: (g) => ({ reachS: g('reach'), minutes: g('min'), waterC: g('wc') }) }] },
      { label: 'Chữa cháy', items: [{ select: 'fire', aria: 'Đám cháy', options: Object.entries(FIRES).map(([k, v]) => [k, v.name]), value: 'electrical' }, { select: 'agent', aria: 'Chất chữa cháy', options: Object.entries(AGENTS), value: 'CO2' }, { button: 'Dập lửa', action: 'em-fire', params: (g) => ({ fire: g('fire'), agent: g('agent') }) }] },
      { label: 'Tràn hoá chất', items: [{ select: 'spill', aria: 'Chất tràn', options: Object.entries(SPILLS).map(([k, v]) => [k, v.name]), value: 'acid' }, { select: 'method', aria: 'Cách xử lý', options: Object.entries(SPILL_METHODS), value: 'kit' }, { button: 'Xử lý', action: 'em-spill', params: (g) => ({ spill: g('spill'), method: g('method') }) }] },
      { label: 'Chất thải', items: [{ select: 'item', aria: 'Chất thải', options: Object.entries(WASTES).map(([k, v]) => [k, v.name]), value: 'needle' }, { select: 'bin', aria: 'Thùng', options: Object.entries(BINS), value: 'sharps' }, { button: 'Bỏ vào thùng', action: 'em-waste', params: (g) => ({ item: g('item'), bin: g('bin') }) }] },
    ],
    onAction: runMachine,
    onFigure: () => machineFigure('em'),
    onNotebook: () => showNotebook(emLab, 'so-su-co.csv'),
  });
  toolPanels.bal = createToolPanel(panel.toolRoot('bal'), {
    id: 'bal',
    title: 'Cân phân tích · pha dung dịch chuẩn',
    rows: [
      { label: 'Đĩa cân', items: [{ button: 'Đặt thuyền cân', action: 'bal-boat' }, { button: 'Trừ bì', action: 'bal-tare' }, { select: 'door', aria: 'Cửa kính', options: [['no', 'đóng cửa'], ['yes', 'mở cửa']], value: 'no' }, { button: 'Cửa kính', action: 'bal-door', params: (g) => ({ open: g('door') }) }] },
      { label: 'Cân NaCl', items: [{ select: 'target', aria: 'Khối lượng cần cân', options: [[0.5844, '0,5844 g (cho 100 mL)'], [0.0584, '0,0584 g (cho 10 mL)']], value: 0.5844 }, { button: 'Xúc NaCl', action: 'bal-add', params: (g) => ({ target: g('target') }) }, { button: 'Ghi số cân', action: 'bal-read' }] },
      { label: 'Định mức', items: [{ select: 'vol', aria: 'Bình định mức', options: Object.entries(BAL_FLASKS).reverse().map(([k, v]) => [Number(k), v.name]), value: 100 }, { button: 'Hoà tan, định mức', action: 'bal-flask', params: (g) => ({ volume: g('vol') }) }] },
    ],
    onAction: runMachine,
    onFigure: () => machineFigure('bal'),
    onNotebook: () => showNotebook(bal, 'so-can-phan-tich.csv'),
  });
  toolPanels.pr = createToolPanel(panel.toolRoot('pr'), {
    id: 'pr',
    title: 'Máy đọc vi đĩa · đo độ hấp thụ',
    rows: [
      { label: 'Đĩa', items: [{ select: 'assay', aria: 'Phép thử', options: Object.entries(PR_ASSAYS).map(([k, v]) => [k, v.name]), value: 'bradford' }, { button: 'Pha đĩa', action: 'pr-plate', params: (g) => ({ assay: g('assay') }) }, { button: 'Đọc đĩa', action: 'pr-read' }] },
      { label: 'Kết quả', items: [{ select: 'range', aria: 'Khoảng chuẩn dùng để fit', options: [['linear', 'chỉ khoảng tuyến tính'], ['all', 'cả dãy chuẩn']], value: 'linear' }, { button: 'Dựng đường chuẩn', action: 'pr-analyse', params: (g) => ({ range: g('range') }) }] },
    ],
    onAction: runMachine,
    onFigure: () => machineFigure('pr'),
    onNotebook: () => showNotebook(pr, 'so-doc-vi-dia.csv'),
  });
  toolPanels.ac = createToolPanel(panel.toolRoot('ac'), {
    id: 'ac',
    title: 'Nồi hấp tiệt trùng',
    rows: [
      { label: 'Mẻ hấp', items: [{ select: 'loadL', aria: 'Lượng dịch', options: [[1.5, '1,5 L môi trường'], [5, '5 L môi trường']], value: 1.5 }, { select: 'cap', aria: 'Nắp chai', options: [['loose', 'nắp nới lỏng'], ['sealed', 'nắp vặn chặt']], value: 'loose' }, { button: 'Xếp mẻ hấp', action: 'ac-load', params: (g) => ({ loadL: g('loadL'), sealed: g('cap') === 'sealed' }) }] },
      { label: 'Chu trình', items: [{ select: 'temp', aria: 'Nhiệt độ tiệt trùng', options: [115, 121, 134].map((v) => [v, `${v} °C`]), value: 121 }, { select: 'hold', aria: 'Thời gian giữ', options: [5, 15, 20, 25, 30].map((v) => [v, `${v} phút`]), value: 25 }, { select: 'purge', aria: 'Đuổi khí', options: [['yes', 'có đuổi khí'], ['no', 'không đuổi khí']], value: 'yes' }, { button: 'Chạy', action: 'ac-run', params: (g) => ({ temp: g('temp'), holdMin: g('hold'), purge: g('purge') === 'yes' }) }] },
      { label: 'Kiểm tra', items: [{ button: 'Ủ chỉ thị sinh học', action: 'ac-bi' }] },
    ],
    onAction: runMachine,
    onFigure: () => machineFigure('ac'),
    onNotebook: () => showNotebook(ac, 'so-noi-hap.csv'),
  });
  toolPanels.ms = createToolPanel(panel.toolRoot('ms'), {
    id: 'ms',
    title: 'LC-MS/MS · ba tứ cực',
    rows: [
      { label: 'Kênh MRM', items: [{ select: 'analyte', aria: 'Chất', options: ['caffeine', 'theobromine', 'theophylline', 'paracetamol'].map((v) => [v, v]), value: 'caffeine' }, { select: 'tr', aria: 'Cặp ion', options: [[0, 'mảnh định lượng'], [1, 'mảnh xác nhận']], value: 0 }, { button: 'Chọn kênh', action: 'ms-select', params: (g) => ({ analyte: g('analyte'), transition: g('tr') }) }] },
      { label: 'Tiêm', items: [{ button: 'Dãy chuẩn', action: 'ms-standards' }, { select: 'prep', aria: 'Xử lý mẫu', options: Object.entries(MS_PREP).map(([k, v]) => [k, v.name]), value: 'dilute-is' }, { button: 'Mẫu huyết tương', action: 'ms-sample', params: (g) => ({ prep: g('prep') }) }] },
    ],
    onAction: runMachine,
    onFigure: () => machineFigure('ms'),
    onNotebook: () => showNotebook(ms, 'so-lcms.csv'),
  });
  toolPanels.bsc = createToolPanel(panel.toolRoot('bsc'), {
    id: 'bsc',
    title: 'Tủ an toàn sinh học cấp II',
    rows: [
      { label: 'Cài đặt', items: [{ select: 'sash', aria: 'Độ mở kính', options: [[0, 'kính đóng'], [203, 'kính 203 mm (8")'], [254, 'kính 254 mm'], [445, 'kính 445 mm (mở hết)']], value: 0 }, { select: 'fan', aria: 'Quạt', options: [['on', 'quạt chạy'], ['off', 'quạt tắt']], value: 'on' }, { select: 'grille', aria: 'Lưới trước', options: [['clear', 'lưới thông'], ['blocked', 'lưới bị che']], value: 'clear' }, { button: 'Đặt', action: 'bsc-set', params: (g) => ({ sash: g('sash'), fan: g('fan') === 'on', grille: g('grille') }) }] },
      { label: 'Làm việc', items: [{ button: 'Thao tác với mẫu', action: 'bsc-work' }, { button: 'Bật đèn UV', action: 'bsc-uv' }] },
    ],
    onAction: runMachine,
    onFigure: () => machineFigure('bsc'),
    onNotebook: () => showNotebook(bsc, 'so-tu-an-toan-sinh-hoc.csv'),
  });
  const drops = [[0.05, '1 giọt'], [0.1, '2 giọt'], [0.15, '3 giọt'], [0.25, '5 giọt'], [0.4, '8 giọt'], [0.5, '10 giọt'], [1, '1 mL'], [2, '2 mL'], [3, '3 mL'], [5, '5 mL'], [10, '10 mL']];
  const tubeOpts = Array.from({ length: TUBES }, (_, i) => [i + 1, `ống ${i + 1}`]);
  const scopeOf = (g) => (g('scope') === 'all' ? 'all' : g('tube'));
  toolPanels.bc = createToolPanel(panel.toolRoot('bc'), {
    id: 'bc',
    title: 'Giá ống nghiệm · bể ổn nhiệt (hoá sinh)',
    rows: [
      { label: 'Bể', items: [{ select: 'set', aria: 'Nhiệt độ bể', options: BATH_SETS.map((v) => [v, v >= 100 ? 'sôi 100 °C' : `${v} °C`]), value: 100 }, { button: 'Đặt nhiệt độ', action: 'wb-set', params: (g) => ({ setC: g('set') }) }] },
      { label: 'Mẫu', items: [{ select: 'tube', aria: 'Ống nghiệm', options: tubeOpts, value: 1 }, { select: 'sample', aria: 'Mẫu', options: [...Object.entries(biochem.samples).map(([k, v]) => [k, v.name]), ...[1, 2, 3, 4, 5].map((k) => [`x${k}`, `lọ ${k} (mất nhãn)`])], value: 'glc1' }, { select: 'smL', aria: 'Lượng mẫu', options: drops, value: 1 }, { button: 'Cho mẫu', action: 'tt-fill', params: (g) => ({ tube: g('tube'), sample: g('sample'), mL: g('smL') }) }] },
      { label: 'Thuốc thử', items: [{ select: 'reagent', aria: 'Thuốc thử', options: Object.entries(biochem.reagents).map(([k, v]) => [k, v.name]), value: 'fehling' }, { select: 'rmL', aria: 'Lượng thuốc thử', options: drops, value: 1 }, { select: 'mode', aria: 'Cách cho', options: [['mix', 'lắc đều'], ['layer', 'nhỏ theo thành ống']], value: 'mix' }, { button: 'Thêm vào ống', action: 'tt-add', params: (g) => ({ tube: g('tube'), reagent: g('reagent'), mL: g('rmL'), mode: g('mode') }) }] },
      { label: 'Đun', items: [{ select: 'scope', aria: 'Ống nào', options: [['one', 'ống đang chọn'], ['all', 'cả giá']], value: 'one' }, { select: 'min', aria: 'Thời gian', options: [0.25, 0.5, 1, 2, 3, 5, 10, 15, 20, 30].map((v) => [v, v < 1 ? `${v * 60} giây` : `${v} phút`]), value: 2 }, { select: 'how', aria: 'Cách đun', options: [['bath', 'cách thuỷ'], ['flame', 'hơ lửa đèn cồn']], value: 'bath' }, { button: 'Đun', action: 'tt-heat', params: (g) => ({ tube: scopeOf(g), minutes: g('min'), mode: g('how') }) }, { button: 'Làm nguội', action: 'tt-cool', params: (g) => ({ tube: scopeOf(g) }) }, { button: 'Chờ', action: 'tt-wait', params: (g) => ({ tube: scopeOf(g), minutes: g('min') }) }] },
      { label: 'Ống', items: [{ select: 'to', aria: 'Hút sang ống', options: tubeOpts, value: 2 }, { button: 'Hút 0,5 mL sang', action: 'tt-take', params: (g) => ({ from: g('tube'), to: g('to'), mL: 0.5 }) }, { button: 'Rửa ống', action: 'tt-clear', params: (g) => ({ tube: scopeOf(g) }) }] },
      { label: 'Lọ mất nhãn', items: [{ select: 'bottle', aria: 'Lọ', options: [1, 2, 3, 4, 5].map((k) => [k, `lọ ${k}`]), value: 1 }, { select: 'answer', aria: 'Kết luận', options: Object.entries(biochem.unknowns.names), value: 'glc1' }, { button: 'Kết luận', action: 'tt-guess', params: (g) => ({ bottle: g('bottle'), answer: g('answer') }) }] },
      { label: 'Chỉ số lipid', items: [{ select: 'index', aria: 'Chỉ số', options: [['acid', 'chỉ số acid'], ['sap', 'chỉ số xà phòng hoá'], ['iodine', 'chỉ số iod']], value: 'acid' }, { select: 'reflux', aria: 'Ống sinh hàn', options: [['yes', 'có ống sinh hàn hồi lưu'], ['no', 'không có ống sinh hàn']], value: 'yes' }, { select: 'ireag', aria: 'Thuốc thử iod', options: [['wijs', 'Wijs 25 mL'], ['lab', 'iod loãng 5 mL (như bài)']], value: 'wijs' }, { button: 'Chuẩn độ', action: 'bc-index', params: (g) => ({ index: g('index'), reflux: g('reflux') === 'yes', reagent: g('ireag') }) }] },
      { label: 'Vitamin C', items: [{ select: 'part', aria: 'Bộ phận cây thìa là', options: Object.entries(biochem.vitc.parts).map(([k, v]) => [k, v.name]), value: 'young' }, { select: 'acid', aria: 'Dịch chiết', options: [['yes', 'chiết bằng HCl 5 %'], ['no', 'chiết bằng nước']], value: 'yes' }, { select: 'starch', aria: 'Chỉ thị', options: [['yes', 'có hồ tinh bột'], ['no', 'không có hồ tinh bột']], value: 'yes' }, { button: 'Chuẩn độ iod', action: 'bc-vitc', params: (g) => ({ part: g('part'), acid: g('acid') === 'yes', starch: g('starch') === 'yes' }) }] },
    ],
    onAction: runMachine,
    onFigure: () => machineFigure('bc'),
    onNotebook: () => showNotebook(bc, 'so-hoa-sinh.csv'),
  });
  const tubeNo = Array.from({ length: 10 }, (_, i) => [i + 1, `ống ${i + 1}`]);
  toolPanels.ez = createToolPanel(panel.toolRoot('ez'), {
    id: 'ez',
    title: 'Enzyme · amylase, urease, saccharase, lipase',
    rows: [
      { label: 'Ống', items: [{ select: 'tube', aria: 'Ống', options: tubeNo, value: 1 }, { select: 'enz', aria: 'Enzyme', options: [...Object.entries(enzyme.enzymes).filter(([k]) => k !== 'lipase').map(([k, v]) => [k, v.name]), ['none', 'nước cất (đối chứng)']], value: 'saliva' }, { select: 'em', aria: 'Thể tích enzyme', options: [[0.1, '0,1 mL'], [0.5, '0,5 mL'], [1, '1 mL']], value: 1 }, { select: 'sub', aria: 'Cơ chất', options: Object.entries(enzyme.substrates).filter(([k]) => k !== 'pnpp').map(([k, v]) => [k, v.name]), value: 'starch1' }, { select: 'sm', aria: 'Thể tích cơ chất', options: [[1, '1 mL'], [2, '2 mL'], [3, '3 mL'], [4, '4 mL']], value: 3 }] },
      { label: 'Điều kiện', items: [{ select: 'T', aria: 'Nhiệt độ ủ', options: [4, 25, 37, 50, 55, 80, 100].map((v) => [v, `${v} °C`]), value: 37 }, { select: 'med', aria: 'Ủ ở đâu', options: Object.entries(enzyme.media).filter(([k]) => !k.startsWith('_')).map(([k, v]) => [k, v.name]), value: 'bath' }, { select: 'pH', aria: 'Đệm', options: [['none', 'không đệm'], ...[5.3, 5.6, 6.2, 6.5, 6.8, 7.2, 7.7, 8.4].map((v) => [v, `đệm pH ${String(v).replace('.', ',')}`])], value: 'none' }, { select: 'add', aria: 'Chất thêm', options: Object.entries(enzyme.additives).map(([k, v]) => [k, v.name]), value: 'none' }] },
      { label: 'Xử lý trước', items: [{ select: 'preT', aria: 'Xử lý enzyme ở', options: [['none', 'không xử lý'], [4, '4 °C'], [25, '25 °C (phòng)'], [80, '80 °C'], [100, '100 °C']], value: 'none' }, { select: 'preMin', aria: 'Thời gian xử lý', options: [[5, '5 phút'], [10, '10 phút'], [30, '30 phút']], value: 30 }, { select: 'prePH', aria: 'Đệm khi xử lý', options: [['none', 'không đệm khi xử lý'], ...[5.3, 6.5, 8.4].map((v) => [v, `xử lý trong đệm pH ${String(v).replace('.', ',')}`])], value: 'none' }, { button: 'Pha ống', action: 'ez-setup', params: (g) => ({ tube: g('tube'), enzyme: g('enz') === 'none' ? 'saliva' : g('enz'), control: g('enz') === 'none', enzMl: g('em'), substrate: g('sub'), subMl: g('sm'), T: g('T'), medium: g('med'), pH: g('pH') === 'none' ? null : g('pH'), bufMl: g('pH') === 'none' ? 0 : 5, additive: g('add'), addMl: g('add') === 'none' ? 0 : 0.5, preT: g('preT') === 'none' ? null : g('preT'), preMin: g('preT') === 'none' ? 0 : g('preMin'), preMedium: g('preT') === 4 ? 'ice' : g('preT') === 25 ? 'room' : 'bath', prePH: g('prePH') === 'none' ? null : g('prePH'), preBufMl: g('prePH') === 'none' ? 0 : 0.9 }) }] },
      { label: 'Theo dõi', items: [{ select: 'min', aria: 'Ủ bao lâu', options: [3, 9, 12, 15, 21, 30].map((v) => [v, `${v} phút`]), value: 15 }, { select: 'every', aria: 'Thử Lugol mỗi', options: [[1, 'thử mỗi 1 phút'], [3, 'thử mỗi 3 phút']], value: 3 }, { button: 'Ủ, thử Lugol', action: 'ez-run', params: (g) => ({ minutes: g('min'), every: g('every') }) }, { button: 'Thử ống', action: 'ez-test', params: (g) => ({ tube: g('tube') }) }, { button: 'Wohlgemuth', action: 'ez-wohl', params: (g) => ({ T: g('T') === 37 ? 37 : 50, minutes: 30 }) }, { button: 'Rửa các ống', action: 'ez-clear' }] },
      { label: 'Lipase p-NPP', items: [{ select: 'S', aria: 'Nồng độ p-NPP', options: [0.2, 0.3, 0.5, 1, 2].map((v) => [v, `${String(v).replace('.', ',')} mM`]), value: 1 }, { select: 'ug', aria: 'Lượng enzyme', options: [[1, '1 µg'], [5, '5 µg'], [20, '20 µg']], value: 1 }, { select: 'lmin', aria: 'Thời gian ủ', options: [[10, '10 phút'], [30, '30 phút']], value: 10 }, { select: 'ladd', aria: 'Phụ gia', options: Object.keys(enzyme.enzymes.lipase.additives).map((k) => [k, k === 'none' ? 'không phụ gia' : k]), value: 'none' }, { select: 'stop', aria: 'Dừng phản ứng', options: [['base', 'dừng bằng Na₂CO₃'], ['acid', 'dừng bằng HCl']], value: 'base' }, { select: 'buf', aria: 'Đệm', options: [['yes', 'có đệm Tris pH 7,5'], ['no', 'quên đệm']], value: 'yes' }, { select: 'lpre', aria: 'Xử lý nhiệt enzyme', options: [['none', 'không xử lý nhiệt'], ['60', 'ủ enzyme 60 °C 190 phút trước']], value: 'none' }, { button: 'Đo A405', action: 'ez-pnpp', params: (g) => ({ S: g('S'), ug: g('ug'), minutes: g('lmin'), additive: g('ladd'), stop: g('stop'), buffer: g('buf') === 'yes', preT: g('lpre') === 'none' ? null : 60, preMin: g('lpre') === 'none' ? 0 : 190 }) }, { button: 'Lineweaver–Burk', action: 'ez-lb' }] },
    ],
    onAction: runMachine,
    onFigure: () => machineFigure('ez'),
    onNotebook: () => showNotebook(ez, 'so-enzyme.csv'),
  });
  toolPanels.mb = createToolPanel(panel.toolRoot('mb'), {
    id: 'mb',
    title: 'Vi sinh · biến nạp plasmid vào E. coli',
    rows: [
      { label: 'Môi trường', items: [{ select: 'ac', aria: 'Hấp tiệt trùng', options: [['yes', 'có hấp 121 °C'], ['no', 'không hấp']], value: 'yes' }, { button: 'Pha LB agar', action: 'mb-medium', params: (g) => ({ autoclave: g('ac') === 'yes' }) }] },
      { label: 'Đổ đĩa', items: [{ select: 'kind', aria: 'Loại đĩa', options: [['LB+', 'LB + ampicillin'], ['LB-', 'LB không kháng sinh']], value: 'LB+' }, { select: 'agar', aria: 'Nhiệt độ thạch khi cho kháng sinh', options: [45, 55, 65, 75].map((v) => [v, `thạch ${v} °C`]), value: 55 }, { select: 'where', aria: 'Làm ở đâu', options: [['bsc', 'trong tủ an toàn sinh học'], ['bench', 'trên bàn hở']], value: 'bsc' }, { button: 'Đổ 1 đĩa', action: 'mb-pour', params: (g) => ({ kind: g('kind'), agarC: g('agar'), n: 1, where: g('where') }) }] },
      { label: 'Biến nạp', items: [{ select: 'iceMin', aria: 'Ủ đá', options: [[10, 'đá 10 phút'], [20, 'đá 20 phút'], [30, 'đá 30 phút']], value: 30 }, { select: 'shC', aria: 'Nhiệt độ sốc', options: [[40, '40 °C'], [42, '42 °C'], [44, '44 °C']], value: 42 }, { select: 'shS', aria: 'Thời gian sốc', options: [[0, 'không sốc'], [30, '30 giây'], [45, '45 giây'], [80, '80 giây']], value: 30 }, { select: 'mix', aria: 'Cách trộn', options: [['flick', 'búng nhẹ'], ['vortex', 'vortex']], value: 'flick' }, { select: 'med', aria: 'Môi trường phục hồi', options: [['SOC', 'SOC'], ['LB', 'LB']], value: 'SOC' }, { select: 'out', aria: 'Phục hồi', options: [[0, 'không phục hồi'], [30, 'phục hồi 30 phút'], [60, 'phục hồi 60 phút']], value: 60 }, { button: 'Biến nạp', action: 'mb-transform', params: (g) => ({ dnaPg: 100, mix: g('mix'), iceMin: g('iceMin'), shockC: g('shC'), shockS: g('shS'), medium: g('med'), outMin: g('out') }) }] },
      { label: 'Cấy trải', items: [{ select: 'pk', aria: 'Đĩa', options: [['LB+', 'đĩa LB+'], ['LB-', 'đĩa LB−']], value: 'LB+' }, { select: 'dil', aria: 'Pha loãng', options: [1, 10, 100, 1000, 10000].map((v) => [v, v === 1 ? 'không pha loãng' : `pha loãng ${v.toLocaleString('fr-FR')} lần`]), value: 100 }, { select: 'spr', aria: 'Que gạt', options: [['flamed', 'que gạt đã hơ lửa'], ['none', 'que gạt chưa tiệt trùng']], value: 'flamed' }, { button: 'Cấy 100 µL', action: 'mb-spread', params: (g) => ({ kind: g('pk'), volUl: 100, dilution: g('dil'), where: g('where'), spreader: g('spr') }) }] },
      { label: 'Ủ, đếm', items: [{ select: 'h', aria: 'Thời gian ủ', options: [8, 16, 24, 36].map((v) => [v, `${v} giờ`]), value: 16 }, { button: 'Ủ 37 °C', action: 'mb-incubate', params: (g) => ({ hours: g('h'), T: 37 }) }, { button: 'Đếm khuẩn lạc', action: 'mb-count' }] },
    ],
    onAction: runMachine,
    onFigure: () => machineFigure('mb'),
    onNotebook: () => showNotebook(mb, 'so-bien-nap.csv'),
  });
  const enzOpts = Object.keys(molbio.enzymes).map((k) => [k, k]);
  toolPanels.mo = createToolPanel(panel.toolRoot('mo'), {
    id: 'mo',
    title: 'Plasmid · tách, cắt, điện di',
    rows: [
      { label: 'Tách', items: [{ select: 'pl', aria: 'Plasmid', options: [['pUC19-ins', 'pUC19 + đoạn chèn 1 kb'], ['pUC19', 'pUC19']], value: 'pUC19-ins' }, { select: 'lys', aria: 'Thời gian ly giải', options: [[3, 'ly giải 3 phút'], [12, 'ly giải 12 phút']], value: 3 }, { select: 'mix', aria: 'Trộn', options: [['invert', 'đảo nhẹ'], ['vortex', 'lắc vortex']], value: 'invert' }, { select: 'rn', aria: 'RNase A', options: [['yes', 'có RNase A'], ['no', 'quên RNase A']], value: 'yes' }, { button: 'Tách plasmid', action: 'mo-miniprep', params: (g) => ({ plasmid: g('pl'), cultureMl: 3, lysisMin: g('lys'), mix: g('mix'), rnase: g('rn') === 'yes', elutionUl: 50 }) }] },
      { label: 'Cắt', items: [{ select: 'e1', aria: 'Enzyme 1', options: enzOpts, value: 'EcoRI' }, { select: 'e2', aria: 'Enzyme 2', options: [['none', 'không có enzyme 2'], ...enzOpts], value: 'HindIII' }, { select: 'u', aria: 'Đơn vị enzyme', options: [[1, '1 đơn vị'], [10, '10 đơn vị']], value: 10 }, { button: 'Cắt 1 µg', action: 'mo-digest', params: (g) => ({ enzymes: g('e2') === 'none' ? [g('e1')] : [g('e1'), g('e2')], units: g('u'), hours: 1 }) }] },
      { label: 'Điện di', items: [{ select: 'min', aria: 'Thời gian chạy', options: [[20, '20 phút'], [40, '40 phút'], [90, '90 phút']], value: 40 }, { button: 'Chạy gel', action: 'mo-gel', params: (g) => ({ lanes: ['L', 'P', ...mo.digests.map((_, i) => `RE${i + 1}`)].slice(0, 8), volts: 100, minutes: g('min') }) }] },
    ],
    onAction: runMachine,
    onFigure: () => machineFigure('mo'),
    onNotebook: () => showNotebook(mo, 'so-plasmid.csv'),
  });
  toolPanels.pt = createToolPanel(panel.toolRoot('pt'), {
    id: 'pt',
    title: 'Proteomics · 2D-PAGE, MALDI-TOF',
    rows: [
      { label: 'SDS-PAGE', items: [{ select: 'smp', aria: 'Mẫu', options: [['plasma', 'huyết tương'], ['albumin', 'albumin tinh khiết']], value: 'plasma' }, { select: 'red', aria: 'Khử', options: [['yes', 'khử bằng DTT'], ['no', 'không khử']], value: 'yes' }, { button: 'Chạy SDS-PAGE', action: 'pt-sds', params: (g) => ({ sample: g('smp'), reduce: g('red') === 'yes', percent: 10, loadUg: 20 }) }] },
      { label: '2D', items: [{ select: 'vh', aria: 'Vôn giờ IEF', options: [[3000, 'IEF 3 000 Vh'], [10000, 'IEF 10 000 Vh']], value: 10000 }, { select: 'eq', aria: 'Cân bằng', options: [['yes', 'có cân bằng DTT, IAA'], ['no', 'bỏ cân bằng']], value: 'yes' }, { select: 'urea', aria: 'Đệm urea', options: [['cool', 'đệm urea để nguội'], ['warm', 'làm ấm đệm urea']], value: 'cool' }, { button: 'Chạy 2D', action: 'pt-2d', params: (g) => ({ loadUg: 170, ipg: '3-10', vh: g('vh'), equilibrate: g('eq') === 'yes', ureaWarm: g('urea') === 'warm', percent: 10 }) }, { button: 'Tính %V', action: 'pt-spots', params: () => ({ top: 10 }) }] },
      { label: 'So sánh', items: [{ select: 'lr', aria: 'Lượng nạp gel thứ hai', options: [[1, 'gel 2 nạp bằng gel 1'], [2, 'gel 2 nạp gấp đôi']], value: 2 }, { select: 'nm', aria: 'Cách so', options: [['yes', 'so %V'], ['no', 'so thể tích thô']], value: 'yes' }, { button: 'So hai gel', action: 'pt-compare', params: (g) => ({ loadRatio: g('lr'), normalize: g('nm') === 'yes' }) }] },
      { label: 'Spot', items: [{ select: 'spot', aria: 'Spot', options: proteins.proteins.filter((p) => p.abundance > 0).map((p) => [p.id, p.name]), value: 'TRFE' }, { select: 'gl', aria: 'Găng tay', options: [['yes', 'đeo găng'], ['no', 'không đeo găng']], value: 'yes' }, { button: 'Thuỷ phân trong gel', action: 'pt-digest', params: (g) => ({ spot: g('spot'), destain: true, reduce: true, alkylate: true, trypsinMin: 960, gloves: g('gl') === 'yes' }) }] },
      { label: 'MS', items: [{ select: 'mx', aria: 'Chất nền', options: [['CHCA', 'CHCA'], ['DHB', '2,5-DHB'], ['SA', 'sinapinic acid']], value: 'CHCA' }, { select: 'cal', aria: 'Hiệu chuẩn', options: [['internal', 'hiệu chuẩn nội'], ['external', 'hiệu chuẩn ngoại']], value: 'internal' }, { button: 'Đo MALDI-TOF', action: 'pt-maldi', params: (g) => ({ matrix: g('mx'), calibration: g('cal'), peaks: 15 }) }, { select: 'tol', aria: 'Sai số', options: [['50', '± 50 ppm'], ['1.2', '± 1,2 Da']], value: '50' }, { button: 'Tra cứu PMF', action: 'pt-pmf', params: (g) => ({ tolPpm: String(g('tol')) === '50' ? 50 : null, tolDa: String(g('tol')) === '50' ? null : 1.2, missed: 1, cam: true }) }] },
    ],
    onAction: runMachine,
    onFigure: () => machineFigure('pt'),
    onNotebook: () => showNotebook(pt, 'so-proteomics.csv'),
  });
  toolPanels.ck = createToolPanel(panel.toolRoot('ck'), {
    id: 'ck',
    title: 'Phôi gà · máy ấp trứng',
    rows: [
      { label: 'Máy ấp', items: [{ button: 'Xếp 6 trứng', action: 'ck-set', params: () => ({ n: 6 }) }, { select: 'T', aria: 'Nhiệt độ ấp', options: [34, 37.8, 40.5].map((v) => [v, `${String(v).replace('.', ',')} °C`]), value: 37.8 }, { select: 'turn', aria: 'Đảo trứng', options: [['yes', 'tự đảo trứng'], ['no', 'không đảo']], value: 'yes' }, { select: 'h', aria: 'Ấp thêm', options: [6, 12, 18, 24, 48].map((v) => [v, `${v} giờ`]), value: 24 }, { button: 'Ấp', action: 'ck-incubate', params: (g) => ({ hours: g('h'), T: g('T'), rh: 55, turning: g('turn') === 'yes' }) }, { button: 'Soi đèn', action: 'ck-candle' }] },
      { label: 'Phôi', items: [{ select: 'egg', aria: 'Trứng', options: [1, 2, 3, 4, 5, 6].map((v) => [v, `trứng ${v}`]), value: 1 }, { select: 'alb', aria: 'Rút lòng trắng', options: [['yes', 'rút 3 mL lòng trắng trước'], ['no', 'không rút lòng trắng']], value: 'yes' }, { button: 'Mở cửa sổ vỏ', action: 'ck-window', params: (g) => ({ egg: g('egg'), removeAlbumin: g('alb') === 'yes' }) }, { button: 'Quan sát', action: 'ck-observe', params: (g) => ({ egg: g('egg') }) }] },
    ],
    onAction: runMachine,
    onNotebook: () => showNotebook(ck, 'so-phoi-ga.csv'),
  });
  toolPanels.ev = createToolPanel(panel.toolRoot('ev'), {
    id: 'ev',
    title: 'Tiến hoá · chim sẻ Darwin, lồng ruồi',
    rows: [
      { label: 'Chim sẻ', items: [{ select: 'n', aria: 'Cỡ mẫu mỗi nhóm', options: [[50, '50 con mỗi nhóm'], [20, '20 con'], [8, '8 con']], value: 50 }, { button: 'Thống kê mô tả', action: 'ev-stats', params: (g) => ({ n: g('n') }) }, { select: 'tr', aria: 'Đặc điểm', options: finch.traits.map(([k, v]) => [k, v]), value: 'beak' }, { button: 'F-test, t-test', action: 'ev-ttest', params: (g) => ({ trait: g('tr'), n: g('n') }) }, { button: 'R = h²S', action: 'ev-breeder', params: () => ({ trait: 'beak' }) }] },
      { label: 'Lồng ruồi', items: [{ select: 'N', aria: 'Số ruồi mỗi lồng', options: [[8, '8 con'], [100, '100 con'], [1000, '1000 con']], value: 100 }, { select: 's', aria: 'Chọn lọc', options: [[0, 'không chọn lọc'], [0.5, 'aa chết 50 %'], [1, 'aa chết hết']], value: 0 }, { select: 'gens', aria: 'Số thế hệ', options: [[20, '20 thế hệ'], [60, '60 thế hệ']], value: 20 }, { select: 'cages', aria: 'Số lồng', options: [[3, '3 lồng'], [5, '5 lồng']], value: 3 }, { button: 'Nuôi các lồng', action: 'ev-cage', params: (g) => ({ q0: 0.5, N: g('N'), s: g('s'), h: 0, gens: g('gens'), cages: g('cages') }) }, { button: 'Hardy–Weinberg', action: 'ev-hwe', params: () => ({ cage: 1 }) }] },
    ],
    onAction: runMachine,
    onNotebook: () => showNotebook(ev, 'so-tien-hoa.csv'),
  });
  toolPanels.fe = createToolPanel(panel.toolRoot('fe'), {
    id: 'fe',
    title: 'Thực địa Cát Bà · ô tiêu chuẩn, bẫy côn trùng',
    rows: [
      { label: 'Điểm', items: [{ select: 'site', aria: 'Điểm khảo sát', options: Object.entries(fieldeco.sites).map(([k, v]) => [k, v.name]), value: 'land' }, { button: 'Đo độ muối, pH', action: 'fe-env', params: (g) => ({ site: g('site') }) }] },
      { label: 'Ô tiêu chuẩn', items: [{ select: 'size', aria: 'Kích thước ô', options: [1, 2, 5].map((v) => [v, `ô ${v} × ${v} m`]), value: 2 }, { select: 'n', aria: 'Số ô', options: [[5, '5 ô'], [10, '10 ô'], [30, '30 ô']], value: 5 }, { select: 'sp', aria: 'Loài đếm', options: [...new Map(Object.values(fieldeco.sites).flatMap((s) => s.species.map((x) => [x[0], `${x[1]} (${x[0]})`]))).entries()], value: 'Kandelia obovata' }, { button: 'Đặt ô, đếm', action: 'fe-quadrat', params: (g) => ({ site: g('site'), size: g('size'), n: g('n'), species: g('sp') }) }, { button: 'Liên kết trang – ô rô', action: 'fe-assoc', params: (g) => ({ site: 'land', a: 'Kandelia obovata', b: 'Acanthus ilicifolius', size: g('size'), n: 30 }) }, { button: 'Chỉ số đa dạng', action: 'fe-diversity', params: (g) => ({ site: g('site') }) }] },
      { label: 'Dơi, chim', items: [{ select: 'det', aria: 'Máy ghi siêu âm', options: [['yes', 'có máy ghi siêu âm'], ['no', 'không có máy']], value: 'yes' }, { button: 'Ghi dơi ở cửa hang', action: 'fe-bat', params: (g) => ({ detector: g('det') === 'yes', minutes: 10 }) }, { select: 'quiet', aria: 'Đi trên tuyến', options: [['yes', 'đi yên lặng'], ['no', 'nói chuyện ồn ào']], value: 'yes' }, { select: 'pb', aria: 'Loa phát tiếng chim', options: [['yes', 'có loa phát tiếng'], ['no', 'không loa']], value: 'yes' }, { button: 'Điều tra chim 4 giờ', action: 'fe-birds', params: (g) => ({ hours: 4, quiet: g('quiet') === 'yes', playback: g('pb') === 'yes', session: 'morning' }) }] },
      { label: 'Bãi triều', items: [{ select: 'tide', aria: 'Thuỷ triều', options: [['low', 'triều rút'], ['high', 'triều lên']], value: 'low' }, { select: 'gear', aria: 'Cách bắt cá', options: [['net', 'lưới, vợt'], ['pump', 'ống hút bùn'], ['look', 'quan sát mặt bùn']], value: 'net' }, { button: 'Thu cá', action: 'fe-fish', params: (g) => ({ gear: g('gear'), tide: g('tide') }) }, { select: 'glv', aria: 'Găng tay', options: [['yes', 'đeo găng'], ['no', 'tay trần']], value: 'yes' }, { button: 'Thu cua', action: 'fe-crab', params: (g) => ({ tide: g('tide'), dig: true, gloves: g('glv') === 'yes' }) }] },
      ...Object.entries(fieldeco.keys).filter(([k]) => !k.startsWith('_')).map(([k, K]) => ({ label: k === 'ardisia' ? 'Khoá cây' : 'Khoá nấm', items: [...K.couplets.map((c, i) => ({ select: `${k}${i}`, aria: c.q, options: c.opts.map(([t], j) => [j, t]), value: 0 })), { button: 'Định loại', action: 'fe-key', params: (g) => ({ specimen: k, answers: K.couplets.map((_, i) => g(`${k}${i}`)) }) }] })),
      { label: 'Côn trùng', items: [{ select: 'trap', aria: 'Loại bẫy', options: Object.entries(fieldeco.insects.traps), value: 'net' }, { select: 'h', aria: 'Thời gian', options: [[2.5, '2,5 giờ'], [24, '24 giờ']], value: 2.5 }, { button: 'Thu mẫu', action: 'fe-trap', params: (g) => ({ trap: g('trap'), hours: g('h') }) }, { button: 'Đường tích luỹ', action: 'fe-accum' }] },
    ],
    onAction: runMachine,
    onNotebook: () => showNotebook(fe, 'so-thuc-dia.csv'),
  });
  // Vi sinh vật học: nhuộm Gram, pha loãng và đếm khuẩn lạc, MPN coliform, buồng đếm (giáo trình Thí nghiệm vi sinh vật học)
  toolPanels.vs = createToolPanel(panel.toolRoot('vs'), {
    id: 'vs',
    title: 'Vi sinh · nhuộm, đếm, kháng sinh đồ, lên men',
    rows: [
      { label: 'Nhuộm Gram', items: [{ select: 'fix', aria: 'Cố định', options: [['gentle', 'hơ nhẹ cố định'], ['hard', 'hơ trực tiếp lâu (sai)']], value: 'gentle' }, { select: 'lugol', aria: 'Lugol', options: [['yes', 'có Lugol 1 phút'], ['no', 'quên Lugol (sai)']], value: 'yes' }, { select: 'dec', aria: 'Tẩy cồn', options: [[5, 'tẩy cồn 5 giây'], [30, 'tẩy cồn 30 giây'], [90, 'tẩy cồn 90 giây']], value: 30 }, { select: 'saf', aria: 'Thuốc nhuộm phụ', options: [['yes', 'safranin 30 giây'], ['no', 'quên safranin (sai)']], value: 'yes' }, { select: 'age', aria: 'Tuổi canh trường', options: [[24, 'canh trường 24 giờ'], [72, 'canh trường 72 giờ']], value: 24 }, { button: 'Nhuộm, soi 100×', action: 'vs-gram', params: (g) => ({ fix: g('fix'), lugol: g('lugol') === 'yes', decolor: g('dec'), safranin: g('saf') === 'yes', age: g('age') }) }] },
      { label: 'Nhuộm bào tử', items: [{ select: 'spage', aria: 'Tuổi canh trường', options: [['2w', 'B. subtilis 2 tuần tuổi'], ['24h', 'B. subtilis 24 giờ (sai)']], value: '2w' }, { select: 'spheat', aria: 'Hơ nóng', options: [['yes', 'hơ tới bốc hơi'], ['no', 'không hơ (sai)']], value: 'yes' }, { select: 'spctr', aria: 'Nhuộm bổ sung', options: [['yes', 'xanh methylene'], ['no', 'quên xanh methylene (sai)']], value: 'yes' }, { button: 'Nhuộm bào tử, soi 100×', action: 'vs-spore', params: (g) => ({ age: g('spage'), heat: g('spheat') === 'yes', counter: g('spctr') === 'yes' }) }] },
      { label: 'Kháng sinh đồ', items: [{ select: 'strain', aria: 'Chủng', options: [['atcc', 'E. coli ATCC 25922'], ['puc', 'E. coli mang pUC19']], value: 'atcc' }, { select: 'inoc', aria: 'Huyền phù', options: [['std', 'huyền phù chuẩn'], ['heavy', 'cấy quá dày (sai)']], value: 'std' }, { select: 'space', aria: 'Đặt khoanh', options: [['even', 'khoanh cách đều'], ['close', 'khoanh sát nhau (sai)']], value: 'even' }, { select: 'dhrs', aria: 'Thời gian ủ', options: [[18, 'ủ 37 °C 18 giờ'], [6, 'ủ 6 giờ (sai)']], value: 18 }, { button: 'Đặt khoanh, ủ, đo vòng', action: 'vs-disk', params: (g) => ({ strain: g('strain'), inoculum: g('inoc'), spacing: g('space'), hours: g('dhrs') }) }] },
      { label: 'Lên men rượu', items: [{ select: 'yeast', aria: 'Men giống', options: [['yes', 'cấy men giống'], ['no', 'quên cấy men (sai)']], value: 'yes' }, { select: 'ftemp', aria: 'Nhiệt độ ủ', options: [[30, 'ủ 30 °C'], [4, 'để tủ lạnh 4 °C (sai)']], value: 30 }, { select: 'fhrs', aria: 'Thời gian', options: [[24, '24 giờ'], [48, '48 giờ']], value: 24 }, { button: 'Lên men, thử CO₂ và ethanol', action: 'vs-ferment', params: (g) => ({ yeast: g('yeast') === 'yes', temp: g('ftemp'), hours: g('fhrs') }) }] },
      { label: 'Pha loãng', items: [{ select: 'to', aria: 'Pha loãng tới', options: [4, 5, 6].map((v) => [v, `tới 10⁻${'⁰¹²³⁴⁵⁶'[v]}`]), value: 5 }, { select: 'mix', aria: 'Lắc trộn', options: [['yes', 'lắc trộn mỗi ống'], ['no', 'không lắc (sai)']], value: 'yes' }, { select: 'tip', aria: 'Đầu tip', options: [['yes', 'đổi tip mỗi lần'], ['no', 'dùng một tip (sai)']], value: 'yes' }, { button: 'Pha loãng thập phân', action: 'vs-dilute', params: (g) => ({ to: g('to'), mix: g('mix') === 'yes', tip: g('tip') === 'yes' }) }] },
      { label: 'Đổ đĩa, ủ, đếm', items: [{ select: 'dils', aria: 'Độ pha loãng đổ đĩa', options: [['1,2', '10⁻¹ và 10⁻²'], ['2,3', '10⁻² và 10⁻³'], ['3,4', '10⁻³ và 10⁻⁴'], ['4,5', '10⁻⁴ và 10⁻⁵']], value: '3,4' }, { select: 'agar', aria: 'Nhiệt độ PCA', options: [[45, 'PCA 45 °C'], [60, 'PCA 60 °C (sai)']], value: 45 }, { button: 'Đổ đĩa 1 mL', action: 'vs-plate', params: (g) => ({ dils: String(g('dils')).split(',').map(Number), agarC: g('agar'), method: 'pour' }) }, { select: 'hrs', aria: 'Thời gian ủ', options: [[24, 'ủ 24 giờ'], [72, 'ủ 72 giờ']], value: 72 }, { button: 'Ủ 30 °C', action: 'vs-incubate', params: (g) => ({ temp: 30, hours: g('hrs') }) }, { button: 'Đếm, tính CFU/g', action: 'vs-count' }] },
      { label: 'MPN coliform', items: [{ select: 'conf', aria: 'Khẳng định', options: [['yes', 'khẳng định trên BGBL'], ['no', 'chỉ đọc LSB (sai)']], value: 'yes' }, { button: 'Cấy 3 × 3 ống', action: 'vs-mpn', params: (g) => ({ confirm: g('conf') === 'yes' }) }] },
      { label: 'Buồng đếm', items: [{ select: 'dil', aria: 'Pha loãng dịch nấm men', options: [1, 5, 10, 100].map((v) => [v, v === 1 ? 'không pha loãng' : `pha loãng ${v} lần`]), value: 5 }, { select: 'sq', aria: 'Số ô lớn đếm', options: [[1, 'đếm 1 ô lớn'], [5, 'đếm 5 ô lớn']], value: 5 }, { button: 'Đếm nấm men', action: 'vs-hemo', params: (g) => ({ dil: g('dil'), squares: g('sq') }) }] },
    ],
    onAction: runMachine,
    onNotebook: () => showNotebook(vs, 'so-vi-sinh.csv'),
  });
  // Phương pháp lấy mẫu: ước lượng số mọt trong 26 cốc (báo cáo Cơ sở sinh thái học Bài 2 của chủ dự án)
  toolPanels.eco = createToolPanel(panel.toolRoot('eco'), {
    id: 'eco',
    title: 'Phương pháp lấy mẫu · đếm mọt',
    rows: [
      { label: 'Lấy mẫu', items: [{ select: 'n', aria: 'Số cốc', options: [3, 5, 8, 10].map((v) => [v, `${v} cốc`]), value: 10 }, { select: 'how', aria: 'Cách chọn cốc', options: [['random', 'bốc thăm ngẫu nhiên'], ['pick', 'chọn cốc nhiều mọt (sai)'], ['report', 'số liệu trong báo cáo']], value: 'random' }, { button: 'Lấy mẫu, đếm', action: 'eco-sample', params: (g) => ({ n: g('n'), how: g('how') }) }, { button: 'Đếm toàn bộ', action: 'eco-count' }] },
    ],
    onAction: runMachine,
    onNotebook: () => showNotebook(eco, 'so-lay-mau.csv'),
  });
  // Thực tập hoá đại cương: Bài 1 cân, kết tủa, lọc, rửa; Bài 2 pha dung dịch chuẩn và chuẩn độ
  toolPanels.gc = createToolPanel(panel.toolRoot('gc'), {
    id: 'gc',
    title: 'Thực tập hoá đại cương · Bài 1, 2, 4, 5A, 7, 9 · muối Mohr',
    rows: [
      { label: 'Cân', items: [{ button: 'Pipet 10 mL nước, cân', action: 'gc-weigh' }] },
      { label: 'Kết tủa', items: [{ select: 'an', aria: 'Thuốc thử', options: [['CO3', 'Na₂CO₃ 0,2 M'], ['SO4', 'Na₂SO₄ 0,4 M'], ['PO4', 'Na₃PO₄ 0,15 M']], value: 'CO3' }, { button: 'Trộn với CaCl₂', action: 'gc-precip', params: (g) => ({ anion: g('an') }) }, { select: 'fold', aria: 'Gấp giấy lọc', options: [['fluted', 'giấy gấp rãnh'], ['cone', 'giấy gấp côn']], value: 'fluted' }, { select: 'paper', aria: 'Mép giấy lọc', options: [['below', 'mép giấy thấp hơn mép phễu'], ['above', 'mép giấy cao hơn mép phễu (sai)']], value: 'below' }, { button: 'Lọc', action: 'gc-filter', params: (g) => ({ fold: g('fold'), paper: g('paper') }) }, { select: 'times', aria: 'Số lần rửa', options: [1, 2, 3].map((v) => [v, `rửa ${v} lần`]), value: 3 }, { button: 'Rửa, thử AgNO₃', action: 'gc-wash', params: (g) => ({ times: g('times') }) }] },
      { label: 'Pha', items: [{ select: 'sol', aria: 'Dung dịch', options: [['oxalic', 'oxalic acid chuẩn 0,02500 M'], ['NaOH', 'NaOH khoảng 0,05 M'], ['HCl', 'HCl khoảng 0,05 M'], ['KMnO4', 'KMnO₄ khoảng 0,004 M']], value: 'oxalic' }, { select: 'bal', aria: 'Cân', options: [['analytical', 'cân phân tích'], ['technical', 'cân kỹ thuật']], value: 'analytical' }, { select: 'fill', aria: 'Thêm nước', options: [['mark', 'thêm nước tới vạch'], ['over', 'thêm quá vạch (sai)']], value: 'mark' }, { button: 'Pha', action: 'gc-prep', params: (g) => ({ solution: g('sol'), balance: g('bal'), fill: g('fill') }) }] },
      { label: 'Chuẩn độ', items: [{ select: 'ana', aria: 'Chất cần chuẩn', options: [['oxalic', '10 mL oxalic acid'], ['HCl', '10 mL HCl']], value: 'oxalic' }, { select: 'ind', aria: 'Chất chỉ thị', options: [['pp', 'phenolphthalein'], ['mo', 'methyl orange']], value: 'pp' }, { select: 'rinse', aria: 'Tráng buret', options: [['yes', 'tráng buret bằng dung dịch chuẩn'], ['no', 'chỉ tráng nước cất (sai)']], value: 'yes' }, { select: 'wait', aria: 'Điểm cuối', options: [['yes', 'đợi màu bền 30 giây'], ['no', 'dừng khi thấy màu (sai)']], value: 'yes' }, { button: 'Chuẩn độ bằng NaOH', action: 'gc-titrate', params: (g) => ({ analyte: g('ana'), indicator: g('ind'), rinse: g('rinse') === 'yes', wait: g('wait') === 'yes' }) }] },
      { label: 'KMnO₄', items: [{ select: 'heat', aria: 'Đun', options: [['yes', 'đun 60–70 °C'], ['no', 'không đun']], value: 'yes' }, { select: 'acid', aria: 'Acid', options: [['yes', 'thêm 5 mL H₂SO₄ 20 %'], ['no', 'không thêm acid (sai)']], value: 'yes' }, { button: 'Chuẩn độ KMnO₄', action: 'gc-redox', params: (g) => ({ heat: g('heat') === 'yes', acid: g('acid') === 'yes', rinse: g('rinse') === 'yes' }) }] },
      { label: 'Cân bằng', items: [{ select: 'sys', aria: 'Hệ cân bằng', options: [['co', 'CoCl₂ (phức cobalt)'], ['acetic', 'CH₃COOH 0,1 M'], ['ammonia', 'NH₃ 0,1 M'], ['nacl', 'NaCl bão hoà']], value: 'co' }, { select: 'add', aria: 'Thêm chất', options: [['none', 'không thêm'], ['hcl', 'HCl đặc'], ['nh4cl', 'NH₄Cl tinh thể'], ['acetate', 'CH₃COONa tinh thể'], ['naoh', 'NaOH 1 M'], ['zncl2', 'ZnCl₂ 1 M']], value: 'hcl' }, { select: 'temp', aria: 'Nhiệt độ', options: [['room', 'nhiệt độ phòng'], ['hot', 'cốc nước nóng'], ['cold', 'cốc nước lạnh']], value: 'room' }, { select: 'eqind', aria: 'Chất chỉ thị', options: [['mo', 'methyl orange'], ['pp', 'phenolphthalein']], value: 'mo' }, { button: 'Làm thí nghiệm', action: 'gc-eq', params: (g) => ({ system: g('sys'), add: g('add'), temp: g('temp'), indicator: g('eqind') }) }] },
      { label: 'Anion', items: [{ select: 'ion', aria: 'Thí nghiệm', options: [['PO4', 'B: PO₄³⁻'], ['CO3', 'C: CO₃²⁻'], ['S', 'D: S²⁻'], ['I', 'E: I⁻'], ['Cl', 'F: Cl⁻'], ['NO3', 'G: NO₃⁻ (vòng nâu)']], value: 'PO4' }, { select: 'slip', aria: 'Cách làm', options: [['none', 'làm đúng'], ['nowait', 'không đợi (B, E)'], ['touch', 'đũa chạm thành ống (C)'], ['nonh3', 'bỏ bước NH₃ (F)'], ['noag2so4', 'bỏ Ag₂SO₄ (G)'], ['shake', 'lắc ống (G)']], value: 'none' }, { button: 'Thử mẫu 1 và mẫu 2', action: 'gc-an-test', params: (g) => ({ test: g('ion'), slip: g('slip') }) }, { button: 'Kết luận mẫu 2', action: 'gc-an-answer' }] },
      { label: 'Nhiệt lượng kế', items: [{ select: 'salt', aria: 'Muối', options: [['KNO3', 'KNO₃ khoảng 7 g'], ['KCl', 'KCl khoảng 6 g']], value: 'KNO3' }, { select: 'stuck', aria: 'Ămpun', options: [['no', 'muối rơi hết vào nước'], ['yes', 'muối dính thành ămpun (sai)']], value: 'no' }, { button: 'Đo nhiệt độ 3 giai đoạn', action: 'gc-cal-run', params: (g) => ({ salt: g('salt'), grams: g('salt') === 'KNO3' ? 7 : 6, stuck: g('stuck') === 'yes' }) }, { select: 'calm', aria: 'Cách lấy Δt', options: [['graph', 'Δt hiệu chỉnh bằng đồ thị'], ['raw', 'Δt đọc thẳng (sai)']], value: 'graph' }, { button: 'Tính C_k và ΔH(KCl)', action: 'gc-cal-result', params: (g) => ({ method: g('calm') }) }] },
      { label: 'Muối Mohr', items: [{ select: 'etoh', aria: 'Cồn rửa tinh thể', options: [[10, 'rửa 10 mL cồn'], [30, 'rửa 30 mL cồn (sai)']], value: 10 }, { button: 'Lọc, rửa tinh thể', action: 'gc-mohr-salt', params: (g) => ({ ethanol: g('etoh') }) }, { select: 'msalt', aria: 'Muối', options: [['mohr', 'muối Mohr'], ['feso4', 'FeSO₄·7H₂O']], value: 'mohr' }, { select: 'mq', aria: 'Thuốc thử', options: [['naoh', 'NaOH 30 %'], ['bacl2', 'BaCl₂ 0,1 M'], ['air', 'NaOH, để ngoài không khí'], ['h2o2', 'H₂O₂ 10 %'], ['kmno4', 'KMnO₄ 0,1 M'], ['k2cr2o7', 'K₂Cr₂O₇ 0,1 M']], value: 'naoh' }, { button: 'Định tính', action: 'gc-mohr-qual', params: (g) => ({ reagent: g('mq'), salt: g('msalt') }) }, { select: 'macid', aria: 'Acid hoá', options: [['yes', 'thêm 5 mL H₂SO₄ (1:2)'], ['no', 'không acid hoá (sai)']], value: 'yes' }, { button: 'Chuẩn độ Fe²⁺', action: 'gc-mohr-titr', params: (g) => ({ acid: g('macid') === 'yes' }) }, { select: 'aging', aria: 'Già hoá kết tủa', options: [['yes', 'già hoá 15–20 phút'], ['no', 'lọc ngay (sai)']], value: 'yes' }, { select: 'bwash', aria: 'Rửa kết tủa', options: [['yes', 'rửa nước nóng, cồn'], ['no', 'không rửa (sai)']], value: 'yes' }, { button: 'Kết tủa, cân BaSO₄', action: 'gc-mohr-ba', params: (g) => ({ aging: g('aging') === 'yes', wash: g('bwash') === 'yes' }) }, { button: 'Công thức thực nghiệm', action: 'gc-mohr-formula' }] },
      { label: 'Tốc độ', items: [{ select: 'rtube', aria: 'Ống trong bảng', options: [1, 2, 3, 4, 5].map((v) => [v, `ống ${v}`]), value: 1 }, { select: 'cue', aria: 'Mốc bấm giờ', options: [['first', 'bắt đầu vẩn đục'], ['opaque', 'đợi đục hẳn (sai)']], value: 'first' }, { select: 'dry', aria: 'Ống nghiệm', options: [['yes', 'ống khô'], ['no', 'ống còn ướt (sai)']], value: 'yes' }, { button: 'Na₂S₂O₃ + H₂SO₄', action: 'gc-rate-conc', params: (g) => ({ tube: Number(g('rtube')), cue: g('cue'), dry: g('dry') === 'yes' }) }, { select: 'dT', aria: 'Nhiệt độ', options: [0, 10, 20, 30].map((v) => [v, v ? `t phòng + ${v} °C` : 't phòng']), value: 0 }, { select: 'soak', aria: 'Thời gian ngâm', options: [['5', 'ngâm 5 phút'], ['1', 'ngâm 1 phút (sai)']], value: '5' }, { button: 'KMnO₄ + oxalic acid', action: 'gc-rate-temp', params: (g) => ({ dT: Number(g('dT')), soak: Number(g('soak')) }) }, { select: 'cat', aria: 'Chất thêm', options: [['water', '3 giọt nước cất'], ['cuso4', '3 giọt CuSO₄'], ['mnso4', 'ít MnSO₄']], value: 'water' }, { button: 'Thử xúc tác', action: 'gc-rate-cat', params: (g) => ({ add: g('cat') }) }, { select: 'part', aria: 'Đồ thị', options: [['conc', 'v theo nồng độ'], ['temp', 'lg(1/Δt) theo 1/T']], value: 'conc' }, { button: 'Vẽ đồ thị', action: 'gc-rate-plot', params: (g) => ({ part: g('part') }) }] },
      { label: 'Kết quả', items: [{ select: 'of', aria: 'Tính nồng độ', options: [['NaOH', 'C(NaOH)'], ['HCl', 'C(HCl)'], ['KMnO4', 'C(KMnO₄)']], value: 'NaOH' }, { button: 'Tính nồng độ', action: 'gc-result', params: (g) => ({ of: g('of') }) }] },
    ],
    onAction: runMachine,
    onNotebook: () => showNotebook(gc, 'so-hoa-dai-cuong.csv'),
  });
  // PCR mở rộng theo tài liệu Drive: master mix theo bảng, touch-down, RAPD, đường cong nóng chảy DNA
  toolPanels.pm = createToolPanel(panel.toolRoot('pm'), {
    id: 'pm',
    title: 'PCR mở rộng · master mix, touch-down, RAPD, nóng chảy',
    rows: [
      { label: 'Master mix', items: [{ select: 'mode', aria: 'Cách pha', options: [['master', 'pha chung 100 phản ứng'], ['single', 'pha từng ống (sai)']], value: 'master' }, { select: 'bmg', aria: 'MgCl₂', options: [['no', 'buffer không có MgCl₂, thêm MgCl₂'], ['yes', 'buffer có sẵn MgCl₂ mà vẫn thêm (sai)']], value: 'no' }, { button: 'Tính và pha mix', action: 'pm-mix', params: (g) => ({ n: 100, mode: g('mode'), bufferMg: g('bmg') === 'yes' }) }] },
      { label: 'Touch-down', items: [{ select: 'prog', aria: 'Chương trình nhiệt', options: [['std55', '35 chu kỳ 55 °C'], ['std65', '35 chu kỳ 65 °C'], ['td1', 'touch-down sơ đồ 1'], ['td2', 'touch-down sơ đồ 2']], value: 'td1' }, { button: 'Chạy PCR, điện di', action: 'pm-td', params: (g) => ({ program: g('prog') }) }] },
      { label: 'RAPD', items: [{ select: 'primer', aria: 'Mồi ngẫu nhiên', options: [['OPA-02', 'mồi OPA-02'], ['OPA-04', 'mồi OPA-04']], value: 'OPA-02' }, { select: 'rta', aria: 'Nhiệt độ bắt mồi', options: [[36, 'bắt mồi 36 °C'], [55, 'bắt mồi 55 °C (sai)']], value: 36 }, { button: 'RAPD 6 giống', action: 'pm-rapd', params: (g) => ({ primer: g('primer'), ta: g('rta') }) }, { button: 'Ma trận Dice, cây UPGMA', action: 'pm-tree' }] },
      { label: 'Nóng chảy DNA', items: [{ select: 'sp', aria: 'DNA của loài', options: [['dicty', 'Dictyostelium (22 % GC)'], ['sce', 'S. cerevisiae (39 % GC)'], ['spneu', 'S. pneumoniae (42 % GC)'], ['ecoli', 'E. coli (51 % GC)']], value: 'ecoli' }, { select: 'buf', aria: 'Đệm', options: [['ssc', 'SSC 1X'], ['low', 'SSC 0,1X']], value: 'ssc' }, { select: 'rate', aria: 'Tốc độ đun', options: [['slow', '0,5 °C mỗi phút'], ['fast', '5 °C mỗi phút (sai)']], value: 'slow' }, { button: 'Đun, đo A260', action: 'pm-melt', params: (g) => ({ species: g('sp'), buffer: g('buf'), rate: g('rate') }) }] },
    ],
    onAction: runMachine,
    onNotebook: () => showNotebook(pm, 'so-pcr-mo-rong.csv'),
  });
  // Tiêu bản hiển vi ảo theo ảnh thực hành Thực vật học và Sinh học tế bào của chủ dự án
  toolPanels.sl = createToolPanel(panel.toolRoot('sl'), {
    id: 'sl',
    title: 'Tiêu bản hiển vi',
    rows: [
      { label: 'Tiêu bản', items: [{ select: 'slide', aria: 'Tiêu bản', options: Object.entries(slidesData.slides).map(([k, v]) => [k, v.name]), value: 'root-monocot' }, { select: 'cut', aria: 'Lát cắt', options: [['thin', 'cắt lát mỏng'], ['thick', 'cắt lát dày (sai)']], value: 'thin' }, { select: 'cover', aria: 'Đậy lá kính', options: [['slow', 'hạ lá kính từ từ'], ['drop', 'thả lá kính rơi (sai)']], value: 'slow' }, { select: 'stain', aria: 'Nhuộm', options: [['yes', 'có nhuộm'], ['no', 'không nhuộm']], value: 'yes' }, { select: 'sq', aria: 'Ép dàn', options: [['yes', 'ép dàn (tiêu bản ép)'], ['no', 'không ép (sai)']], value: 'yes' }, { select: 'dry', aria: 'Cố định vết quét', options: [['yes', 'để khô se rồi cố định'], ['no', 'cố định khi còn ướt (sai)']], value: 'yes' }, { button: 'Làm tiêu bản', action: 'sl-make', params: (g) => ({ slide: g('slide'), cut: g('cut'), cover: g('cover'), stain: g('stain') === 'yes', squash: g('sq') === 'yes', dry: g('dry') === 'yes' }) }] },
      { label: 'Quan sát', items: [{ select: 'obj', aria: 'Vật kính', options: [4, 10, 40, 100].map((v) => [v, `vật kính ${v}×`]), value: 4 }, { select: 'oil', aria: 'Dầu soi', options: [['no', 'không dầu'], ['yes', 'có dầu soi']], value: 'no' }, { button: 'Xem', action: 'sl-view', params: (g) => ({ objective: g('obj'), oil: g('oil') === 'yes' }) }] },
      { label: 'Nhận dạng', items: [{ select: 'kind', aria: 'Loại lát cắt', options: Object.entries(slidesData.kinds), value: 'root-monocot' }, { button: 'Nhận dạng', action: 'sl-name', params: (g) => ({ answer: g('kind') }) }] },
      { label: 'Phân bào', items: [{ select: 'phase', aria: 'Kỳ phân bào', options: [...Object.entries(slidesData.phases.meiosis).map(([k, v]) => [k, `Giảm phân · ${v[0]}`]), ...Object.entries(slidesData.phases.mitosis).map(([k, v]) => [k, `Nguyên phân · ${v[0]}`])], value: 'm1' }, { button: 'Tìm tế bào', action: 'sl-find', params: (g) => ({ phase: g('phase') }) }, { button: 'Đếm các kỳ', action: 'sl-count' }] },
    ],
    onAction: runMachine,
    onNotebook: () => showNotebook(sl, 'so-tieu-ban.csv'),
  });
  // Tách DNA thực vật bằng CTAB rồi điện di kiểm tra (báo cáo thực hành "Bài 5–6. Tách ADN từ thực vật" của chủ dự án)
  toolPanels.dx = createToolPanel(panel.toolRoot('dx'), {
    id: 'dx',
    title: 'Tách DNA thực vật · CTAB',
    rows: [
      { label: 'Mẫu', items: [{ select: 'ts', aria: 'Mô thực vật', options: [['leaf', 'lá non'], ['flower', 'hoa'], ['fruit', 'quả']], value: 'leaf' }, { select: 'mg', aria: 'Khối lượng mẫu', options: [10, 50, 100, 200].map((v) => [v, `${v} mg`]), value: 50 }, { button: 'Cân mẫu', action: 'dx-sample', params: (g) => ({ tissue: g('ts'), mg: g('mg') }) }, { select: 'lb', aria: 'Ghi tên ống', options: [['both', 'ghi trên nắp và thân'], ['cap', 'chỉ ghi trên nắp'], ['none', 'không ghi']], value: 'both' }, { button: 'Ghi tên ống', action: 'dx-label', params: (g) => ({ where: g('lb') }) }] },
      { label: 'Ly giải', items: [{ select: 'gr', aria: 'Cách nghiền', options: [['soft', 'nghiền vừa đến đồng nhất'], ['hard', 'nghiền rất mạnh, lâu']], value: 'soft' }, { button: 'Nghiền với 1 mL CTAB', action: 'dx-grind', params: (g) => ({ ctab: 1, hard: g('gr') === 'hard' }) }, { select: 'tip', aria: 'Đầu tip', options: [['cut', 'tip đã cắt rộng'], ['normal', 'tip thường']], value: 'cut' }, { button: 'Hút dịch chiết', action: 'dx-load', params: (g) => ({ tip: g('tip') }) }, { select: 'tc', aria: 'Nhiệt độ ủ', options: [37, 65, 95].map((v) => [v, `${v} °C`]), value: 65 }, { select: 'im', aria: 'Thời gian ủ', options: [5, 15, 30].map((v) => [v, `${v} phút`]), value: 15 }, { button: 'Ủ ở bể ổn nhiệt', action: 'dx-incubate', params: (g) => ({ temp: g('tc'), min: g('im') }) }] },
      { label: 'Tách pha', items: [{ select: 'cool', aria: 'Để nguội', options: [['yes', 'để nguội rồi mới thêm'], ['no', 'thêm ngay khi còn nóng']], value: 'yes' }, { select: 'vx', aria: 'Thời gian vortex', options: [[30, 'vortex 30 s'], [120, 'vortex 2 phút']], value: 30 }, { button: 'Thêm 500 µL CI', action: 'dx-ci', params: (g) => ({ cool: g('cool') === 'yes', ul: 500, vortex: g('vx') }) }, { select: 'rpm', aria: 'Tốc độ ly tâm', options: [[5000, '5 000 rpm'], [13000, '13 000 rpm']], value: 13000 }, { button: 'Ly tâm 10 phút 4 °C', action: 'dx-spin', params: (g) => ({ rpm: g('rpm'), min: 10, temp: 4 }) }, { select: 'tch', aria: 'Cách hút', options: [['no', 'không chạm mặt phân cách'], ['yes', 'hút sát, chạm lớp giữa']], value: 'no' }, { button: 'Hút dịch nổi', action: 'dx-transfer', params: (g) => ({ touch: g('tch') === 'yes' }) }] },
      { label: 'Kết tủa', items: [{ select: 'iso', aria: 'Thể tích isopropanol', options: [[0.3, '0,3 thể tích'], [0.6, '0,6 thể tích'], [1, '1 thể tích'], [1.5, '1,5 thể tích']], value: 0.6 }, { button: 'Thêm isopropanol', action: 'dx-iso', params: (g) => ({ ratio: g('iso') }) }, { button: 'Đặt trên đá 5 phút', action: 'dx-ice', params: () => ({ min: 5 }) }, { select: 'eth', aria: 'Nồng độ ethanol', options: [[70, 'ethanol 70 %'], [100, 'ethanol 100 %']], value: 70 }, { select: 'pour', aria: 'Cách đổ', options: [['gentle', 'đảo nhẹ, đổ cẩn thận'], ['rough', 'lắc mạnh, đổ nhanh']], value: 'gentle' }, { button: 'Rửa cặn', action: 'dx-wash', params: (g) => ({ ethanol: g('eth'), gentle: g('pour') === 'gentle' }) }, { select: 'wul', aria: 'Thể tích nước hoà', options: [30, 50, 100].map((v) => [v, `${v} µL nước`]), value: 50 }, { button: 'Để khô, hoà tan', action: 'dx-dissolve', params: (g) => ({ ul: g('wul') }) }] },
      { label: 'Kiểm tra', items: [{ button: 'Xử lý RNase A', action: 'dx-rnase' }, { button: 'Đo A260/A280', action: 'dx-measure' }, { select: 'gm', aria: 'Thời gian điện di', options: [[20, '20 phút'], [40, '40 phút'], [60, '60 phút']], value: 40 }, { button: 'Điện di 100 V', action: 'dx-gel', params: (g) => ({ volts: 100, minutes: g('gm') }) }] },
    ],
    onAction: runMachine,
    onNotebook: () => showNotebook(dx, 'so-tach-dna.csv'),
  });
  // Giải phẫu động vật: lấy mẫu, đặt, ghim, cắt, đổ nước, phanh, gỡ ống tiêu hoá, quan sát, kiểm tra, dọn
  toolPanels.dis = createToolPanel(panel.toolRoot('dis'), {
    id: 'dis',
    title: 'Giải phẫu động vật · khay mổ',
    rows: [
      { label: 'Mẫu', items: [{ select: 'sp', aria: 'Mẫu vật', options: Object.entries(dissection.specimens).map(([k, v]) => [k, `${v.name} (${v.lesson.split(', ')[1]})`]), value: 'earthworm' }, { button: 'Lấy mẫu ra khay', action: 'dis-take', params: (g) => ({ specimen: g('sp') }) }] },
      { label: 'Đặt, ghim', items: [{ select: 'side', aria: 'Tư thế mẫu', options: Object.entries(dissection.places), value: 'dorsal' }, { button: 'Đặt mẫu', action: 'dis-place', params: (g) => ({ side: g('side') }) }, { button: 'Ghim', action: 'dis-pin' }] },
      { label: 'Cắt', items: [{ select: 'line', aria: 'Đường cắt', options: Object.entries(dissection.lines), value: 'mid' }, { select: 'depth', aria: 'Độ sâu', options: [['shallow', 'cắt nông, mũi kéo hướng lên'], ['deep', 'cắt sâu (sai)']], value: 'shallow' }, { button: 'Cắt', action: 'dis-cut', params: (g) => ({ line: g('line'), depth: g('depth') }) }, { button: 'Đổ nước ngập', action: 'dis-water' }, { button: 'Phanh, ghim mép', action: 'dis-open' }, { button: 'Gỡ ống tiêu hoá', action: 'dis-remove' }] },
      { label: 'Quan sát', items: [{ select: 'organ', aria: 'Cơ quan', options: organOptions('earthworm'), value: 'hau' }, { select: 'lens', aria: 'Kính lúp', options: [['no', 'mắt thường'], ['yes', 'qua kính lúp']], value: 'no' }, { button: 'Quan sát', action: 'dis-observe', params: (g) => ({ organ: g('organ'), lens: g('lens') === 'yes' }) }, { button: 'Kiểm tra đủ cơ quan', action: 'dis-check' }] },
      { label: 'Dọn', items: [{ select: 'bin', aria: 'Bỏ mẫu vào', options: [['bio', 'túi rác sinh học'], ['general', 'thùng rác thường (sai)']], value: 'bio' }, { button: 'Dọn khay', action: 'dis-clean', params: (g) => ({ bin: g('bin') }) }] },
    ],
    onAction: runMachine,
    onNotebook: () => showNotebook(dis, 'so-giai-phau.csv'),
  });
  // Bản đồ vệ tinh Cát Bà: điểm khảo sát của bài thực tập, đường chim bay giữa hai điểm, lớp ảnh vệ tinh hoặc độ cao
  const siteOpts = catbaData.sites.map((x) => [x.id, x.name]);
  toolPanels.geo = createToolPanel(panel.toolRoot('geo'), {
    id: 'geo',
    title: 'Bản đồ vệ tinh quần đảo Cát Bà',
    rows: [
      { label: 'Điểm', items: [{ select: 'site', aria: 'Điểm khảo sát', options: siteOpts, value: 'trungtrang' }, { button: 'Xem toạ độ, độ cao', action: 'geo-site', params: (g) => ({ site: g('site') }) }] },
      { label: 'Đường chim bay', items: [{ select: 'from', aria: 'Điểm đầu', options: siteOpts, value: 'vqg' }, { select: 'to', aria: 'Điểm cuối', options: siteOpts, value: 'aoech' }, { button: 'Đo, vẽ mặt cắt', action: 'geo-route', params: (g) => ({ from: g('from'), to: g('to') }) }] },
      { label: 'Lớp', items: [{ select: 'layer', aria: 'Lớp bản đồ', options: [['sat', 'ảnh vệ tinh'], ['height', 'tô màu độ cao']], value: 'sat' }, { button: 'Đổi lớp', action: 'geo-layer', params: (g) => ({ layer: g('layer') }) }] },
    ],
    onAction: runMachine,
    onNotebook: () => showNotebook(geo, 'so-ban-do-cat-ba.csv'),
  });
  toolPanels.pu = createToolPanel(panel.toolRoot('pu'), {
    id: 'pu',
    title: 'Tinh sạch protease · SEC, CEX, RP-HPLC',
    rows: [
      { label: 'Mẫu', items: [{ button: 'Nọc thô 3 mL', action: 'pu-venom', params: () => ({ ul: 3000 }) }, { select: 'dil', aria: 'Pha loãng', options: [[1, 'không pha loãng'], [10, 'pha loãng 10 lần'], [100, 'pha loãng 100 lần']], value: 100 }, { select: 'ph', aria: 'pH đo', options: [4, 5, 6, 7, 8.5].map((v) => [v, `pH ${String(v).replace('.', ',')}`]), value: 6 }, { select: 'add', aria: 'Chất thêm', options: Object.entries(purify.enzyme.additives).map(([k, v]) => [k, v.name]), value: 'none' }, { select: 'ctl', aria: 'Đối chứng', options: [['yes', 'có đối chứng âm, dương'], ['no', 'không đối chứng']], value: 'yes' }, { button: 'Đo FRET', action: 'pu-assay', params: (g) => ({ dilution: g('dil'), minutes: 60, pH: g('ph'), additive: g('add'), controls: g('ctl') === 'yes' }) }] },
      { label: 'Cột', items: [{ select: 'col', aria: 'Cột', options: Object.entries(purify.columns).map(([k, v]) => [k, v.name]), value: 'sec' }, { select: 'cph', aria: 'pH đệm CEX', options: [[5, 'đệm pH 5,0'], [8, 'đệm pH 8,0']], value: 5 }, { select: 'salt', aria: 'Muối trong mẫu', options: [[0, 'mẫu không thêm muối'], [0.5, 'mẫu có 0,5 M NaCl']], value: 0 }, { button: 'Chạy cột', action: 'pu-column', params: (g) => ({ column: g('col'), pH: g('cph'), loadSalt: g('salt') }) }] },
      { label: 'Gộp', items: [{ select: 'pool', aria: 'Cách gộp', options: [['auto', 'phân đoạn ≥ 20 % đỉnh hoạt độ'], ['narrow', 'chỉ đỉnh ± 1'], ['wide', 'mọi phân đoạn ≥ 2 %']], value: 'auto' }, { button: 'Gộp phân đoạn', action: 'pu-pool', params: (g) => ({ mode: g('pool') }) }, { select: 'st', aria: 'Nhuộm', options: [['silver', 'nhuộm bạc'], ['coomassie', 'Coomassie']], value: 'silver' }, { button: 'SDS-PAGE', action: 'pu-sds', params: (g) => ({ stain: g('st') }) }, { button: 'Bảng tinh sạch', action: 'pu-table' }] },
    ],
    onAction: runMachine,
    onFigure: () => machineFigure('pu'),
    onNotebook: () => showNotebook(pu, 'so-tinh-sach.csv'),
  });
  toolPanels.exo = createToolPanel(panel.toolRoot('exo'), {
    id: 'exo',
    title: 'Bóng ngoại bào · Sepharose CL-4B',
    rows: [
      { label: 'Huyết tương', items: [{ select: 'ul', aria: 'Thể tích huyết tương', options: [[45, '45 µL'], [500, '500 µL']], value: 45 }, { select: 'sp', aria: 'Ly tâm 10000 × g', options: [['yes', 'ly tâm 10000 × g'], ['no', 'bỏ ly tâm 10000 × g']], value: 'yes' }, { select: 'fl', aria: 'Lọc 0,22 µm', options: [['yes', 'lọc 0,22 µm'], ['no', 'không lọc']], value: 'yes' }, { button: 'Chuẩn bị', action: 'exo-plasma', params: (g) => ({ ul: g('ul'), spin2: g('sp') === 'yes', filter: g('fl') === 'yes' }) }] },
      { label: 'Cột', items: [{ select: 'dry', aria: 'Mặt gel', options: [['no', 'giữ gel luôn ướt'], ['yes', 'để gel khô']], value: 'no' }, { button: 'Chạy cột 3 mL', action: 'exo-column', params: (g) => ({ dry: g('dry') === 'yes' }) }, { button: 'SDS-PAGE 6–15', action: 'exo-sds', params: () => ({ from: 6, to: 15 }) }] },
      { label: 'EV', items: [{ select: 'pool', aria: 'Phân đoạn gộp', options: [['8-10', 'gộp 8–10'], ['8-12', 'gộp 8–12'], ['14-16', 'gộp 14–16']], value: '8-10' }, { button: 'Gộp', action: 'exo-pool', params: (g) => { const [from, to] = String(g('pool')).split('-').map(Number); return { from, to }; } }, { button: 'NTA', action: 'exo-nta' }, { button: 'Western blot', action: 'exo-wb' }] },
    ],
    onAction: runMachine,
    onNotebook: () => showNotebook(exo, 'so-bong-ngoai-bao.csv'),
  });
  toolPanels.st = createToolPanel(panel.toolRoot('st'), {
    id: 'st',
    title: 'Phân tích số liệu · thống kê, hồi quy, mã R',
    rows: [
      { label: 'Số liệu', items: [{ select: 'ds', aria: 'Bộ số liệu', options: [...statsData.datasets.map((d) => [`ex:${d.id}`, d.name]), ...NOTEBOOKS.map(([, name], i) => [`nb:${i}`, name])], value: 'ex:height' }, { button: 'Nạp', action: 'st-load', params: (g) => ({ source: g('ds') }) }] },
      { label: 'Cột', items: [{ select: 'a', aria: 'Cột thứ nhất (x)', options: [[0, 'cột 1']], value: 0 }, { select: 'b', aria: 'Cột thứ hai (y)', options: [[1, 'cột 2']], value: 1 }] },
      { label: 'Mô tả', items: [{ button: 'Thống kê mô tả', action: 'st-describe', params: (g) => ({ col: g('a') }) }, { select: 'conf', aria: 'Độ tin cậy', options: [[0.95, '95 %'], [0.99, '99 %'], [0.9, '90 %']], value: 0.95 }, { select: 'cim', aria: 'Phân phối', options: [['t', 'phân phối t'], ['z', 'z (như CONFIDENCE)']], value: 't' }, { button: 'Khoảng tin cậy', action: 'st-ci', params: (g) => ({ col: g('a'), conf: g('conf'), method: g('cim') }) }] },
      { label: 'Kiểm định', items: [{ select: 'kind', aria: 'Kiểu t', options: [['equal', 't, phương sai bằng nhau'], ['welch', 't Welch'], ['paired', 't ghép cặp']], value: 'equal' }, { button: 'F-Test và t-Test', action: 'st-ttest', params: (g) => ({ a: g('a'), b: g('b'), kind: g('kind') }) }, { button: 'ANOVA các cột', action: 'st-anova', params: () => ({ cols: 'all' }) }, { button: 'χ² bảng tần số', action: 'st-chi2' }] },
      { label: 'Hồi quy', items: [{ select: 'model', aria: 'Mô hình', options: [['linear', 'tuyến tính'], ['poly2', 'đa thức bậc 2'], ['poly3', 'đa thức bậc 3'], ['poly4', 'đa thức bậc 4'], ['hyper', 'hyperbol y = a + b/x'], ['exp', 'mũ y = a·eᵇˣ'], ['mm', 'Michaelis–Menten'], ['ll4', 'logistic 4 tham số (ED50)']], value: 'linear' }, { button: 'Hồi quy y theo x', action: 'st-regress', params: (g) => ({ x: g('a'), y: g('b'), model: g('model') }) }] },
    ],
    onAction: runMachine,
    onNotebook: () => showNotebook(st, 'so-phan-tich.csv'),
  });
  {
    const box = document.createElement('details');
    box.className = 'csv-paste';
    box.innerHTML = '<summary>Dán số liệu CSV</summary><label class="sr-only" for="st-paste-text">Số liệu CSV</label><textarea id="st-paste-text" rows="5" placeholder="T;H&#10;16;56,5&#10;18;41"></textarea><button type="button" class="btn btn-ghost" id="st-paste-load">Nạp số liệu dán vào</button>';
    panel.toolRoot('st').append(box);
    box.querySelector('#st-paste-load').addEventListener('click', () => runMachine('st-paste', { csv: box.querySelector('#st-paste-text').value }));
  }
  const placeOpts = storage.places.map((pl) => [pl.id, pl.name]);
  toolPanels.inv = createToolPanel(panel.toolRoot('inv'), {
    id: 'inv',
    title: 'Tủ lạnh, tủ đông · bảo quản thuốc thử',
    rows: [
      { label: 'Bộ PCR', items: [{ button: 'Lấy ra hộp đá', action: 'inv-kit', params: () => ({ to: 'ice' }) }, { button: 'Cất về tủ', action: 'inv-kit', params: () => ({ to: 'store' }) }] },
      { label: 'Một ống', items: [{ select: 'item', aria: 'Ống', options: Object.entries(storage.items).map(([k, v]) => [k, v.name]), value: 'taq' }, { select: 'to', aria: 'Chuyển tới', options: placeOpts, value: 'bench' }, { button: 'Chuyển', action: 'inv-move', params: (g) => ({ item: g('item'), to: g('to') }) }] },
      { label: 'Tủ −80 °C', items: [{ select: 'ds', aria: 'Mở cửa bao lâu', options: [15, 30, 60, 150].map((v) => [v, `mở cửa ${v} s`]), value: 30 }, { select: 'inner', aria: 'Cửa trong', options: [['closed', 'cửa trong đóng'], ['open', 'mở cả cửa trong']], value: 'closed' }, { button: 'Mở rồi đóng cửa', action: 'inv-door', params: (g) => ({ seconds: g('ds'), inner: g('inner') }) }] },
      { label: 'Sự cố', items: [{ select: 'ph', aria: 'Mất điện bao lâu', options: [2, 6, 12, 24].map((v) => [v, `mất điện ${v} giờ`]), value: 12 }, { select: 'bk', aria: 'Dự phòng', options: Object.entries(BACKUPS), value: 'none' }, { button: 'Cắt điện', action: 'inv-power', params: (g) => ({ hours: g('ph'), backup: g('bk') }) }] },
      { label: 'Bình LN2', items: [{ select: 'ld', aria: 'Số ngày', options: [30, 60, 90, 115, 130].map((v) => [v, `${v} ngày sau`]), value: 30 }, { select: 'refill', aria: 'Nạp lại', options: [['no', 'không nạp'], ['yes', 'rồi nạp đầy']], value: 'no' }, { button: 'Kiểm tra bình', action: 'inv-ln2', params: (g) => ({ days: g('ld'), refill: g('refill') }) }] },
      { label: 'Thời gian', items: [{ select: 'h', aria: 'Chờ bao lâu', options: [0.5, 1, 2, 4, 8, 24, 72].map((v) => [v, v < 1 ? '30 phút' : `${v} giờ`]), value: 4 }, { button: 'Chờ', action: 'inv-wait', params: (g) => ({ hours: g('h') }) }, { button: 'Kiểm tra hoạt tính', action: 'inv-check' }] },
    ],
    onAction: runMachine,
    onFigure: () => machineFigure('inv'),
    onNotebook: () => showNotebook(coldLab, 'so-kho-lanh.csv'),
  });
  for (const [k, m] of Object.entries(MACHINES)) toolPanels[k].status(m.status());
  syncCold();
  const zfPanel = createZfPanel(panel.toolRoot('zf'), {
    zf,
    onAction: runZf,
    onSetup: zfSetup,
    onNotebook: () => showNotebook(fish, 'so-thi-nghiem-ca-ngua-van.csv'),
  });
  function zfSetup(setup) {
    note('zf-setup', 'setup', setup);
    const chem = zf.chemicals.find((c) => c.id === setup.chemical);
    fish.setUp({ ...fish.setup, ...setup, series: chem.series }, session.seedFor('zf-setup'));
    syncZf();
  }
  const flyPanel = createFlyPanel(panel.toolRoot('fly'), { fly, onAction: runFly, onNotebook: () => showNotebook(flies, 'so-thi-nghiem-ruoi-giam.csv') });
  flyPanel.setGenes(flies.setup.genes);
  showTools();
  syncGarden();
  syncFlies();
  syncChem();
  syncZf();

  climatePanel = createClimatePanel(climateBox, {
    crop: crops[0],
    initial: CLIMATE0,
    onChange: (state, ev) => {
      if (JSON.stringify(state) !== JSON.stringify(climateState)) note('climate', 'set', state, { merge: true });
      climateLevel = ev.tempLevel;
      climateState = state;
      lab.setClimate(state, ev);
    },
    onClose: () => { climateBox.hidden = true; },
  });

  nav.innerHTML = ZONES.map((z) => `<button type="button" data-zone="${z.id}" aria-pressed="${z.id === 'overview'}">${z.name}</button>`).join('');
  nav.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-zone]');
    if (b) lab.flyTo(b.dataset.zone);
  });

  const closeDetail = () => {
    $('#detail').hidden = true;
    $('#detail-frame').src = 'about:blank';
    detailOpener?.focus?.();
    detailOpener = null;
  };
  $('#detail-close').addEventListener('click', closeDetail);

  // Danh sách khu và thiết bị: thay cho cảnh 3D khi dùng bàn phím hoặc trình đọc màn hình
  const devices = $('#devices');
  const toggle = $('#list-toggle');
  const showDevices = (open) => {
    devices.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) devices.querySelector('button:not(.icon-btn)')?.focus();
  };
  $('#devices-list').innerHTML = ZONES.map((z) => {
    const items = Object.entries(DETAILS).filter(([, d]) => (d.zone ?? 'pcr-bench') === z.id);
    return `<section><h3>${esc(z.name)}</h3><div class="chips"><button type="button" data-go="${z.id}">Đến khu</button>${items
      .map(([id, d]) => `<button type="button" data-detail="${id}" data-zone="${z.id}">Cận cảnh: ${esc(d.title)}</button>`)
      .join('')}</div></section>`;
  }).join('');
  devices.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.id === 'devices-close') return showDevices(false), toggle.focus();
    if (b.dataset.go) lab.flyTo(b.dataset.go);
    if (b.dataset.detail) { lab.flyTo(b.dataset.zone); detailOpener = b; openDetail(b.dataset.detail); }
  });
  toggle.addEventListener('click', () => showDevices(devices.hidden));
  // Màn hẹp: các nút ít dùng (tên dụng cụ, tự nhìn gần, hướng dẫn, âm thanh, vân bề mặt, hình ảnh) gom vào "Tuỳ chọn"
  {
    const more = $('#more-toggle');
    const box = $('#view-more');
    more.addEventListener('click', () => {
      const open = !box.classList.contains('open');
      box.classList.toggle('open', open);
      more.setAttribute('aria-expanded', String(open));
    });
  }
  // Nút "Tên dụng cụ": bật nhãn tên cho mọi dụng cụ, máy, tủ có chú thích (data/apparatus.json)
  const namesBtn = $('#names-toggle');
  namesBtn.addEventListener('click', () => {
    const on = namesBtn.getAttribute('aria-pressed') !== 'true';
    namesBtn.setAttribute('aria-pressed', String(on));
    lab.setNames(on);
  });
  const focusBtn = $('#focus-toggle');
  focusBtn.addEventListener('click', () => {
    const on = focusBtn.getAttribute('aria-pressed') !== 'true';
    focusBtn.setAttribute('aria-pressed', String(on));
    lab.setAutoFocus(on);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!$('#detail').hidden) closeDetail();
    else if (!devices.hidden) { showDevices(false); toggle.focus(); }
  });
  // Mức hình ảnh: ?q= trong địa chỉ, rồi lựa chọn đã lưu, mặc định Tự động (chạy tự động bằng trình duyệt điều khiển thì Thấp)
  const qSel = $('#quality-select');
  qSel.innerHTML = QUALITY.map(([v, t]) => `<option value="${v}">${t}</option>`).join('');
  let qChoice = new URLSearchParams(location.search).get('q');
  if (!qChoice) { try { qChoice = localStorage.getItem('vlab.quality'); } catch { qChoice = null; } }
  if (!QUALITY.some(([v]) => v === qChoice)) qChoice = navigator.webdriver ? 'low' : 'auto';
  qSel.value = qChoice;
  lab.setQuality(qChoice);
  qSel.addEventListener('change', () => {
    lab.setQuality(qSel.value);
    try { localStorage.setItem('vlab.quality', qSel.value); } catch { /* bỏ qua */ }
  });
  // Bảng Di chuyển (đi lại tự do, bản đồ nhỏ) và nút bật tắt vân bề mặt
  createNavConsole({ host: $('.pane-lab'), toggle: $('#nav-toggle'), lab, onZone: (id) => lab.flyTo(id) });
  // Bảng Thao tác tay (src/ui/hand-panel.js): lượng rót theo thời gian giữ nút, số giọt, micropipet, xếp ống vào rotor
  let holdAt = 0;
  let pouring = false;
  let dropCount = 0;
  handPanel = createHandPanel({
    host: $('.pane-lab'),
    toggle: $('#hand-toggle'),
    onPourHold(ctx, down) {
      if (!ctx) return;
      pouring = down;
      if (down) {
        holdAt = performance.now();
        lab.handFlow(true, { ml0: engine.containers.get(ctx.container).volume, rate: HAND.pour.rate });
        return;
      }
      const secs = (performance.now() - holdAt) / 1000;
      lab.handFlow(false);
      const v = pourVolume(secs, handRng);
      if (v <= 0) {
        lab.setAppearance(ctx.container, engine.appearance(ctx.container), { instant: true });
        handPanel.reading('Chai chưa nghiêng đủ lâu: chưa có giọt nào chảy ra. Giữ nút lâu hơn.');
        return;
      }
      pour(ctx.substance, ctx.container, { tool: 'hand', volume: v });
      const box = engine.containers.get(ctx.container);
      handPanel.reading(`Mực trong ${box.name}: khoảng ${Math.round(box.volume)} mL theo vạch trên cốc. Giữ tiếp để rót thêm, hoặc bấm "Xong".`);
    },
    onDrop(ctx) {
      if (!ctx) return;
      dropCount += 1;
      lab.dropOne(ctx.substance, ctx.container);
      pour(ctx.substance, ctx.container, { tool: 'drops', volume: dropsVolume(1, handRng) });
      handPanel.reading(`Đã nhỏ ${dropCount} giọt vào ${engine.containers.get(ctx.container).name}.`);
    },
    onStir(ctx, on) { if (ctx) lab.stir(ctx.container, on); },
    onDone() { lab.handEnd(); lab.stir(null, false); },
    onPipette: (kind, p) => pipAction(kind, p),
    onOps: (action, p) => opsAction(action, p),
    onRotorRun(tubes) {
      if (!tubes.length) { panel.addMachine({ events: [{ type: 'warning', text: 'Chưa đặt ống nào vào rotor.' }] }, null); return; }
      const g = toolPanels.cf.get;
      runMachine('cf-run', { rcf: Number(g('rcf')), minutes: Number(g('min')), tubes });
    },
  });
  syncPip();
  syncOps();
  // Âm thanh (src/ui/sound.js): bật bằng nút "Âm thanh"; nguồn đặt đúng chỗ máy trong phòng
  {
    const posOf = (id) => { const m = MACHINES_3D.find((x) => x.id === id); return [m.x, m.floor ? m.z : (m.bench === 'A' ? INSTRUMENT_BENCHES[0] : INSTRUMENT_BENCHES[1]).z]; };
    const running = (id) => () => labClock.running().some((j) => j.data.machineId === id);
    sound = createSound({
      listener: () => lab.nav.view().pos,
      sources: [
        { kind: 'fan', pos: [FUME_HOOD.x, FUME_HOOD.z], freq: 420, level: 0.06, range: 7 },
        ...COLD_UNITS.map((c) => ({ kind: 'hum', pos: [ROOM.minX + c.d / 2, c.z], level: 0.03, range: 5 })),
        { kind: 'whine', pos: posOf('centrifuge'), freq: 250, level: 0.05, range: 6, active: running('centrifuge') },
        { kind: 'fan', pos: posOf('pcr'), freq: 650, level: 0.03, range: 4, active: running('pcr') },
        { kind: 'fan', pos: [BENCH.x - 2.9, BENCH.z], freq: 2600, level: 0.05, range: 3, active: () => pouring },
      ],
    });
    const btn = $('#sound-toggle');
    btn.addEventListener('click', () => btn.setAttribute('aria-pressed', String(sound.set(btn.getAttribute('aria-pressed') !== 'true'))));
  }
  // Đồng hồ: chạy theo thời gian thật; mỗi nửa giây cập nhật giờ, việc đang chạy, màn hình máy
  {
    const el = $('#lab-clock');
    el.querySelector('.clock-speed').addEventListener('change', (e) => { labClock.setSpeed(Number(e.target.value)); syncClock(); });
    el.querySelector('.clock-wait').addEventListener('click', () => { finishJobs(labClock.waitNext()); syncClock(); });
    let last = performance.now();
    let lastSlot = 0;
    setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      finishJobs(labClock.tick(dt));
      syncClock();
      updateGuide();
      // Giờ đặt lịch máy trong bảng Thao tác tay tính từ giờ hiện tại: cập nhật mỗi nửa giờ đồng hồ phòng
      const slot = Math.floor(labClock.now / 1800);
      if (slot !== lastSlot) { lastSlot = slot; syncOps(); }
    }, 500);
  }
  // Hướng dẫn trong cảnh: vòng cam quanh dụng cụ, nhãn trên máy hoặc khu của bước protocol đang chờ (tắt được)
  let guideShown = '';
  let guideWanted = true;
  function updateGuide() {
    const p = tracker.protocol;
    const i = tracker.current;
    const st = guideWanted && p && i >= 0 ? p.steps[i] : null;
    let g = null;
    if (st) {
      const e = st.expect ?? {};
      const text = `Bước ${i + 1}: ${st.text.length > 70 ? `${st.text.slice(0, 68)}…` : st.text}`;
      const mid = e.action && (FIGURE_OF[e.action] ?? (machineOf(e.action) && id3Of(machineOf(e.action))));
      if (e.container && CONTAINERS.some((c) => c.id === e.container)) g = { container: e.container, text };
      else if (mid && lab.machineIds().includes(mid)) g = { machine: mid, text };
      else g = { zone: p.zone ?? 'bench-chem', text };
    }
    const key = JSON.stringify(g);
    if (key === guideShown) return;
    guideShown = key;
    lab.setGuide(g);
  }
  {
    const btn = $('#guide-toggle');
    try { if (localStorage.getItem('vlab.guide') === 'off') guideWanted = false; } catch { /* bỏ qua */ }
    btn.setAttribute('aria-pressed', String(guideWanted));
    btn.addEventListener('click', () => {
      guideWanted = !guideWanted;
      btn.setAttribute('aria-pressed', String(guideWanted));
      try { localStorage.setItem('vlab.guide', guideWanted ? 'on' : 'off'); } catch { /* bỏ qua */ }
      updateGuide();
    });
  }
  // Thả chai lên cốc khi đang chọn "Rót bằng tay" hoặc "Ống nhỏ giọt (đếm từng giọt)": bảng Thao tác tay điều khiển
  function handPourStart(substanceId, containerId) {
    if (!['hand', 'drops'].includes(chemState.tool) || replaying) return false;
    const sub = substances.find((x) => x.id === substanceId);
    if (sub?.kind !== 'chem' || sub.solid) return false;
    dropCount = 0;
    const name = sub.unknown || sub.solvent || !sub.formula ? sub.label ?? sub.name : `${sub.formula.replace(/(\d+)/g, (d) => [...d].map((c) => '₀₁₂₃₄₅₆₇₈₉'[c]).join(''))} ${sub.conc ?? ''}`.trim();
    handPanel.showPour({ substance: substanceId, container: containerId, mode: chemState.tool === 'hand' ? 'pour' : 'drops', label: `${name} → ${engine.containers.get(containerId).name}` });
    return true;
  }
  const texBtn = $('#tex-toggle');
  try { if (localStorage.getItem('vlab.tex') === 'off') { texBtn.setAttribute('aria-pressed', 'false'); lab.setTextures(false); } } catch { /* bỏ qua */ }
  texBtn.addEventListener('click', () => {
    const on = texBtn.getAttribute('aria-pressed') !== 'true';
    texBtn.setAttribute('aria-pressed', String(on));
    lab.setTextures(on);
    try { localStorage.setItem('vlab.tex', on ? 'on' : 'off'); } catch { /* bỏ qua */ }
  });
  createSplit({ root: $('#split'), divider: $('#divider') });
  loading.hidden = true;

  // Mở thẳng một khu hoặc một hình cận cảnh bằng địa chỉ, ví dụ index.html#greenhouse, index.html#pcr
  const openFromHash = () => {
    const id = location.hash.slice(1);
    if (ZONES.some((z) => z.id === id)) lab.flyTo(id);
    else if (DETAILS[id]) { lab.flyTo(DETAILS[id].zone ?? 'pcr-bench'); openDetail(id); }
  };
  window.addEventListener('hashchange', openFromHash);
  // Mở lại phiên tự lưu lần trước (nếu có thao tác), không thì bắt đầu phiên mới với protocol đầu tiên
  let saved = null;
  try {
    const text = localStorage.getItem(STORE);
    if (text) saved = Session.parse(text);
  } catch {
    saved = null;
  }
  // Bài tập đang làm dở (đã mở gói trước khi tải lại trang)
  try {
    const a = JSON.parse(localStorage.getItem(CLASS) ?? 'null');
    if (a && saved?.protocol === a.protocol.id) {
      useAssignmentProtocol(a.protocol);
      assignment = a;
      panel.classBar(a.title);
      panel.setExam(Boolean(a.exam));
    }
  } catch { /* bỏ qua */ }
  if (saved?.length) restore(saved, 'lần làm trước');
  else if (assignment) {
    tracker.set(protocols.find((p) => p.id === assignment.protocol.id) ?? null);
    showTools();
    resetAll(new Session({ protocol: assignment.protocol.id, seed: assignment.seed, start: { climate: { ...climateState } } }));
  } else resetAll();
  openFromHash();
}

try {
  const [substances, reactions, protocols, crops, pea, fly, tools, zf, crosses, storage, thermo, safety, biochem, enzyme, micro, molbio, proteins, chick, finch, fieldeco, purify, exosome, statsData, apparatus, flameData, catbaData, catbaMeta, dissection, slidesData, genchem, sampling, microbe, facility, pcrmix] = await Promise.all(['substances', 'reactions', 'protocols', 'crops', 'pea', 'fly', 'tools', 'zebrafish', 'crosses', 'storage', 'thermo', 'safety', 'biochem', 'enzyme', 'micro', 'molbio', 'proteins', 'chick', 'finch', 'fieldeco', 'purify', 'exosome', 'stats', 'apparatus', 'flame', 'catba', 'catba/grid', 'dissection', 'slides', 'genchem', 'sampling', 'microbe', 'facility', 'pcrmix'].map(loadJSON));
  const catbaGrid = await loadHeight(catbaMeta);
  try {
    start({ substances, reactions, protocols, crops, pea, fly, tools, zf, crosses, storage, thermo, safety, biochem, enzyme, micro, molbio, proteins, chick, finch, fieldeco, purify, exosome, statsData, apparatus, flameData, catbaData, catbaMeta, catbaGrid, dissection, slidesData, genchem, sampling, microbe, facility, pcrmix });
  } catch (err) {
    fail('Không dựng được cảnh 3D. Trình duyệt cần hỗ trợ WebGL.', err);
  }
} catch (err) {
  fail('Không tải được dữ liệu phòng thí nghiệm. Hãy mở trang qua máy chủ web (xem README), không mở trực tiếp file index.html.', err);
}

// Bản web: service worker lưu các file đã tải để mở lại khi mất mạng (xem sw.js).
// Bỏ qua ở bản cài (app://) và khi trình duyệt không cho đăng ký (khung nhúng, chế độ riêng tư).
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
