
(function(){
'use strict';
var $ = function(id){ return document.getElementById(id); };
var CITIES = [{"n": "New York", "c": "United States", "z": "America/New_York"}, {"n": "Los Angeles", "c": "United States", "z": "America/Los_Angeles"}, {"n": "Chicago", "c": "United States", "z": "America/Chicago"}, {"n": "Houston", "c": "United States", "z": "America/Chicago"}, {"n": "Phoenix", "c": "United States", "z": "America/Phoenix"}, {"n": "Philadelphia", "c": "United States", "z": "America/New_York"}, {"n": "Dallas", "c": "United States", "z": "America/Chicago"}, {"n": "Miami", "c": "United States", "z": "America/New_York"}, {"n": "Atlanta", "c": "United States", "z": "America/New_York"}, {"n": "Boston", "c": "United States", "z": "America/New_York"}, {"n": "Washington DC", "c": "United States", "z": "America/New_York"}, {"n": "San Francisco", "c": "United States", "z": "America/Los_Angeles"}, {"n": "Seattle", "c": "United States", "z": "America/Los_Angeles"}, {"n": "Las Vegas", "c": "United States", "z": "America/Los_Angeles"}, {"n": "Denver", "c": "United States", "z": "America/Denver"}, {"n": "Minneapolis", "c": "United States", "z": "America/Chicago"}, {"n": "Detroit", "c": "United States", "z": "America/Detroit"}, {"n": "Nashville", "c": "United States", "z": "America/Chicago"}, {"n": "Salt Lake City", "c": "United States", "z": "America/Denver"}, {"n": "Portland", "c": "United States", "z": "America/Los_Angeles"}, {"n": "New Orleans", "c": "United States", "z": "America/Chicago"}, {"n": "Honolulu", "c": "United States", "z": "Pacific/Honolulu"}, {"n": "Anchorage", "c": "United States", "z": "America/Anchorage"}, {"n": "San Diego", "c": "United States", "z": "America/Los_Angeles"}, {"n": "London", "c": "United Kingdom", "z": "Europe/London"}, {"n": "Paris", "c": "France", "z": "Europe/Paris"}, {"n": "Berlin", "c": "Germany", "z": "Europe/Berlin"}, {"n": "Madrid", "c": "Spain", "z": "Europe/Madrid"}, {"n": "Rome", "c": "Italy", "z": "Europe/Rome"}, {"n": "Amsterdam", "c": "Netherlands", "z": "Europe/Amsterdam"}, {"n": "Dublin", "c": "Ireland", "z": "Europe/Dublin"}, {"n": "Lisbon", "c": "Portugal", "z": "Europe/Lisbon"}, {"n": "Stockholm", "c": "Sweden", "z": "Europe/Stockholm"}, {"n": "Athens", "c": "Greece", "z": "Europe/Athens"}, {"n": "Moscow", "c": "Russia", "z": "Europe/Moscow"}, {"n": "Istanbul", "c": "T\u00fcrkiye", "z": "Europe/Istanbul"}, {"n": "Dubai", "c": "United Arab Emirates", "z": "Asia/Dubai"}, {"n": "Mumbai", "c": "India", "z": "Asia/Kolkata"}, {"n": "Bangkok", "c": "Thailand", "z": "Asia/Bangkok"}, {"n": "Singapore", "c": "Singapore", "z": "Asia/Singapore"}, {"n": "Hong Kong", "c": "Hong Kong", "z": "Asia/Hong_Kong"}, {"n": "Shanghai", "c": "China", "z": "Asia/Shanghai"}, {"n": "Beijing", "c": "China", "z": "Asia/Shanghai"}, {"n": "Tokyo", "c": "Japan", "z": "Asia/Tokyo"}, {"n": "Seoul", "c": "South Korea", "z": "Asia/Seoul"}, {"n": "Sydney", "c": "Australia", "z": "Australia/Sydney"}, {"n": "Melbourne", "c": "Australia", "z": "Australia/Melbourne"}, {"n": "Brisbane", "c": "Australia", "z": "Australia/Brisbane"}, {"n": "Perth", "c": "Australia", "z": "Australia/Perth"}, {"n": "Auckland", "c": "New Zealand", "z": "Pacific/Auckland"}, {"n": "Toronto", "c": "Canada", "z": "America/Toronto"}, {"n": "Vancouver", "c": "Canada", "z": "America/Vancouver"}, {"n": "Mexico City", "c": "Mexico", "z": "America/Mexico_City"}, {"n": "S\u00e3o Paulo", "c": "Brazil", "z": "America/Sao_Paulo"}, {"n": "Buenos Aires", "c": "Argentina", "z": "America/Argentina/Buenos_Aires"}, {"n": "Santiago", "c": "Chile", "z": "America/Santiago"}, {"n": "Johannesburg", "c": "South Africa", "z": "Africa/Johannesburg"}, {"n": "Cairo", "c": "Egypt", "z": "Africa/Cairo"}, {"n": "Lagos", "c": "Nigeria", "z": "Africa/Lagos"}, {"n": "Nairobi", "c": "Kenya", "z": "Africa/Nairobi"}, {"n": "Reykjavik", "c": "Iceland", "z": "Atlantic/Reykjavik"}, {"n": "Jerusalem", "c": "Israel", "z": "Asia/Jerusalem"}, {"n": "Karachi", "c": "Pakistan", "z": "Asia/Karachi"}, {"n": "Jakarta", "c": "Indonesia", "z": "Asia/Jakarta"}];

/* ---------- pure time-zone logic (IANA rules via Intl) ---------- */
var _pf = {};
function partsFmt(zone){
  if(!_pf[zone]) _pf[zone] = new Intl.DateTimeFormat('en-US',{timeZone:zone,hourCycle:'h23',
    year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'});
  return _pf[zone];
}
function wallParts(zone, date){
  var p = {}, arr = partsFmt(zone).formatToParts(date);
  for(var i=0;i<arr.length;i++) p[arr[i].type] = arr[i].value;
  p.hour = (+p.hour) % 24;
  return p;
}
function offMin(zone, date){
  var p = wallParts(zone, date);
  var wall = Date.UTC(+p.year, +p.month-1, +p.day, p.hour, +p.minute, +p.second);
  return Math.round((wall - Math.floor(date.getTime()/1000)*1000)/60000);
}
function zoneYear(zone, date){ return +wallParts(zone, date).year; }
function stdOffMin(zone, date){
  var y = zoneYear(zone, date);
  var jan = offMin(zone, new Date(Date.UTC(y,0,15,12)));
  var jul = offMin(zone, new Date(Date.UTC(y,6,15,12)));
  return Math.min(jan, jul);
}
function isDST(zone, date){ return offMin(zone, date) > stdOffMin(zone, date); }
function fmtOff(mins){
  var sign = mins < 0 ? '-' : '+', a = Math.abs(mins);
  var h = Math.floor(a/60), m = a%60;
  return 'UTC' + sign + (h<10?'0':'') + h + ':' + (m<10?'0':'') + m;
}
function zoneDateStr(zone, date){
  var p = wallParts(zone, date);
  return p.year + '-' + p.month + '-' + p.day;
}
var _tf = {}, _df = {};
function snapshot(zone, date){
  if(!_tf[zone]){
    _tf[zone] = new Intl.DateTimeFormat('en-US',{timeZone:zone,hour:'numeric',minute:'2-digit',second:'2-digit',hour12:true});
    _df[zone] = new Intl.DateTimeFormat('en-US',{timeZone:zone,weekday:'long',year:'numeric',month:'long',day:'numeric'});
  }
  return { time: _tf[zone].format(date), date: _df[zone].format(date),
           off: fmtOff(offMin(zone, date)), dst: isDST(zone, date) };
}
function nextChange(zone, from){
  var base = offMin(zone, from), step = 6*3600*1000, t = from.getTime();
  for(var i=0;i<1600;i++){
    t += step;
    var o = offMin(zone, new Date(t));
    if(o !== base){
      var when = new Date(t);
      return { date: _df[zone] ? _df[zone].format(when) : when.toDateString(),
               forward: o > base, delta: Math.abs(o - base) };
    }
  }
  return null;
}
function convert(fz, tz, dateStr, timeStr){
  var dp = dateStr.split('-'), tp = timeStr.split(':');
  var wall = Date.UTC(+dp[0], +dp[1]-1, +dp[2], +tp[0], +tp[1]);
  var utc = wall - offMin(fz, new Date(wall))*60000;
  utc = wall - offMin(fz, new Date(utc))*60000;
  utc = wall - offMin(fz, new Date(utc))*60000;
  var when = new Date(utc);
  var s = snapshot(tz, when);
  var shift = Math.round((Date.parse(zoneDateStr(tz, when)) - Date.parse(dateStr))/86400000);
  return { time: s.time, date: s.date, off: s.off, dst: s.dst, shift: shift,
           fromOff: fmtOff(offMin(fz, when)) };
}
function time12(dateStr, timeStr){
  var dp = dateStr.split('-'), tp = timeStr.split(':');
  return new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit',hour12:true})
    .format(new Date(Date.UTC(+dp[0], +dp[1]-1, +dp[2], +tp[0], +tp[1])));
}

/* ---------- live clocks (home grid, city pages, local clock) ---------- */
var _nextCache = {};
function setText(el, sel, txt){ var n = el.querySelector(sel); if(n) n.textContent = txt; }
function tick(){
  var now = new Date();
  var clocks = document.querySelectorAll('.zclock');
  for(var i=0;i<clocks.length;i++){
    var el = clocks[i], z = el.getAttribute('data-zone');
    if(!z) continue;
    var s = snapshot(z, now);
    setText(el, '.zc-time', s.time);
    setText(el, '.zc-date', s.date);
    var badge = el.querySelector('.zc-dst');
    if(badge){
      if(s.dst){ badge.textContent = 'Daylight saving'; badge.className = 'badge zc-dst'; }
      else { badge.textContent = 'Standard time'; badge.className = 'badge off zc-dst'; }
    }
    setText(el, '.zc-off', s.off);
    var nx = el.querySelector('.zc-next');
    if(nx){
      if(!(z in _nextCache)) _nextCache[z] = nextChange(z, now);
      var c = _nextCache[z];
      nx.textContent = c ? ('Next clock change: ' + c.date + ' — clocks move ' +
        (c.forward ? 'forward ' : 'back ') + (c.delta === 60 ? '1 hour' : c.delta + ' minutes'))
        : 'This time zone does not change clocks.';
    }
  }
}

/* ---------- converter ---------- */
function cityByZone(zone){ for(var i=0;i<CITIES.length;i++) if(CITIES[i].z === zone) return i; return 0; }
function renderConv(){
  var f = $('conv-from'), t = $('conv-to'), d = $('conv-date'), tm = $('conv-time'),
      r = $('conv-result'), det = $('conv-detail');
  if(!f || !t || !d || !tm || !r) return;
  var fc = CITIES[+f.value], tc = CITIES[+t.value];
  if(!fc || !tc || !d.value || !tm.value) return;
  var res = convert(fc.z, tc.z, d.value, tm.value);
  r.textContent = time12(d.value, tm.value) + ' in ' + fc.n + ' = ' + res.time + ' in ' + tc.n;
  if(det){
    var shiftTxt = res.shift === 0 ? 'the same day' : (res.shift > 0 ? 'the next day' : 'the previous day');
    det.textContent = 'That is ' + res.date + ' in ' + tc.n + ' (' + shiftTxt + '), at ' + res.off +
      (res.dst ? ', with daylight saving in effect' : ', on standard time') +
      '. ' + fc.n + ' is at ' + res.fromOff + ' at that moment.';
  }
}
function initConv(){
  var f = $('conv-from'), t = $('conv-to'), d = $('conv-date'), tm = $('conv-time');
  if(!f || !t || !d || !tm) return;
  var opts = '';
  for(var i=0;i<CITIES.length;i++) opts += '<option value="' + i + '">' + CITIES[i].n + ', ' + CITIES[i].c + '</option>';
  f.innerHTML = opts; t.innerHTML = opts;
  var q = new URLSearchParams(location.search);
  f.value = q.get('from') ? cityByZone(q.get('from')) : cityByZone('America/New_York');
  t.value = q.get('to') ? cityByZone(q.get('to')) : cityByZone('Europe/London');
  if(!d.value) d.value = zoneDateStr(CITIES[+f.value].z, new Date());
  if(!tm.value) tm.value = '12:00';
  var els = [f, t, d, tm];
  for(var j=0;j<els.length;j++){ els[j].addEventListener('change', renderConv); els[j].addEventListener('input', renderConv); }
  var sw = $('conv-swap');
  if(sw) sw.addEventListener('click', function(){ var v = f.value; f.value = t.value; t.value = v; renderConv(); });
  renderConv();
}

/* ---------- boot ---------- */
var local = $('local-clock');
if(local){
  try { local.setAttribute('data-zone', Intl.DateTimeFormat().resolvedOptions().timeZone); } catch(e){}
}
initConv();
tick();
if(typeof setInterval !== 'undefined') setInterval(tick, 1000);

/* consent */
var c = $('consent');
if(c && typeof localStorage !== 'undefined' && !localStorage.getItem('wt-consent')){
  c.hidden = false;
  var ok = $('consent-ok');
  if(ok) ok.addEventListener('click', function(){ localStorage.setItem('wt-consent', '1'); c.hidden = true; });
}

window.WT = { offMin: offMin, stdOffMin: stdOffMin, isDST: isDST, fmtOff: fmtOff,
              snapshot: snapshot, convert: convert, nextChange: nextChange,
              zoneDateStr: zoneDateStr, renderConv: renderConv, cities: CITIES };
})();
