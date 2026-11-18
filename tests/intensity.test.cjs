"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),world=require("../renderer.js");
const demo=JSON.parse(fs.readFileSync(path.join(__dirname,"../fixtures/demo-activity.json"),"utf8"));
function verifiedSample(){
 const raw=structuredClone(demo);
 raw.source="github";raw.repositories=[];raw.activity=[];
 const levels=["NONE","FIRST_QUARTILE","SECOND_QUARTILE","THIRD_QUARTILE","FOURTH_QUARTILE"];
 const dates=["2026-11-09","2026-11-10","2026-11-11","2026-11-12","2026-11-13"];
 const counts=[0,1,4,15,130];
 raw.contribution_calendar={
  from:dates[0],to:dates.at(-1),
  total_contributions:counts.reduce((a,b)=>a+b,0),
  days:dates.map((date,i)=>({date,count:counts[i],level:levels[i]}))
 };
 return raw;
}
function tile(svg,date){
 const marker='data-date="'+date+'"',start=svg.indexOf(marker);
 assert.notEqual(start,-1,"date missing: "+date);
 const next=svg.indexOf('data-date="',start+marker.length);
 return svg.slice(start,next===-1?undefined:next);
}
test("five distinct source-backed silhouettes in both worlds and palettes",()=>{
 const data=verifiedSample(),expected={
  archipelago:["quiet","sandbar","woodland","workshop","citadel"],
  village:["quiet","sprout","cottage","workshop","townhall"]
 };
 const dates=data.contribution_calendar.days.map(x=>x.date);
 for(const layout of ["archipelago","village"])for(const theme of ["dark","light"]){
  const svg=world.render(data,{layout,theme,animated:false});
  assert.equal((svg.match(/data-date="/g)||[]).length,371);
  assert.match(svg,/REAL GITHUB CONTRIBUTIONS/);
  assert.doesNotMatch(svg,/SYNTHETIC DEMO/);
  for(let i=0;i<5;i++){
   const art=tile(svg,dates[i]);
   assert.match(art,new RegExp('data-level="'+i+'"'));
   assert.match(art,new RegExp('data-units="'+data.contribution_calendar.days[i].count+'"'));
   assert.match(art,new RegExp('data-art-level="'+i+'"'));
   assert.match(art,new RegExp('data-silhouette="'+expected[layout][i]+'"'));
  }
  assert.match(svg,/>Q1<\/text>/);
  assert.match(svg,/>Q4<\/text>/);
  assert.doesNotMatch(tile(svg,"2026-11-08"),/data-art-level=/,"unknown history must not acquire invented art");
  assert.doesNotMatch(tile(svg,"2026-11-19"),/data-art-level=/,"future dates must not acquire real activity art");
  assert.ok(svg.length<350000,"SVG over profile-ready size budget");
  assert.equal(svg,world.render(data,{layout,theme,animated:false}),"output must be deterministic");
 }
});
test("levels govern silhouette, not arbitrary fixed-count buckets",()=>{
 const data=verifiedSample();
 const high=structuredClone(data);
 high.contribution_calendar.days[1].count=100;
 high.contribution_calendar.total_contributions+=99;
 for(const layout of ["archipelago","village"]){
  const svg=world.render(high,{layout});
  assert.match(tile(svg,"2026-11-10"),/data-level="1"/);
  assert.match(tile(svg,"2026-11-10"),/data-units="100"/);
  assert.match(tile(svg,"2026-11-10"),/data-art-level="1"/);
  assert.match(tile(svg,"2026-11-13"),/data-art-level="4"/);
 }
});
test("exact count provides monotonic accent detail without changing official tier",()=>{
 const base=verifiedSample(),smaller=structuredClone(base),medium=structuredClone(base);
 smaller.contribution_calendar.days[4].count=8;
 smaller.contribution_calendar.total_contributions-=122;
 medium.contribution_calendar.days[4].count=24;
 medium.contribution_calendar.total_contributions-=106;
 for(const layout of ["archipelago","village"]){
  const one=tile(world.render(smaller,{layout}),"2026-11-13");
  const two=tile(world.render(medium,{layout}),"2026-11-13");
  const three=tile(world.render(base,{layout}),"2026-11-13");
  for(const item of [one,two,three])assert.match(item,/data-art-level="4"/);
  assert.match(one,/data-art-detail="1"/);
  assert.match(two,/data-art-detail="2"/);
  assert.match(three,/data-art-detail="3"/);
 }
});
test("visual history playback hides future artwork without mutating source counts",()=>{
 const data=verifiedSample(),date="2026-11-11";
 for(const layout of ["archipelago","village"]){
  const before=world.render(data,{layout,revealDate:date,animated:false});
  const full=world.render(data,{layout,animated:false});
  assert.match(tile(before,"2026-11-12"),/data-level="0"/);
  assert.doesNotMatch(tile(before,"2026-11-12"),/data-art-level=/);
  assert.match(tile(full,"2026-11-12"),/data-art-level="3"/);
  assert.equal(world.calendarFor(world.normalise(data)).observed,150);
 }
});
test("synthetic source remains labelled and retains its historical stage mapping",()=>{
 const grid=world.calendarFor(world.normalise(demo));
 assert.equal(grid.observed,20);
 for(const layout of ["archipelago","village"]){
  const svg=world.render(demo,{layout,animated:false});
  assert.match(svg,/SYNTHETIC DEMO/);
  assert.doesNotMatch(svg,/REAL GITHUB CONTRIBUTIONS/);
  assert.match(tile(svg,"2026-10-17"),/data-level="2"/);
  assert.match(tile(svg,"2026-10-17"),/data-art-level="2"/);
  assert.equal((svg.match(/data-date="/g)||[]).length,371);
 }
});
