/* Pure game rules shared by the UI and tests. */
(function(root){
 'use strict';
 const copy=x=>JSON.parse(JSON.stringify(x));
 function create(config,random=Math.random){
  const ids=Array.from({length:12},(_,i)=>i);
  for(let i=ids.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]];}
  const kinds=ids.slice(0,config.short?6:12);
  const deck=kinds.flatMap(kind=>Array.from({length:5},(_,i)=>({id:kind+'-'+i,kind})));
  for(let i=deck.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}
  return {version:1,config:copy(config),players:config.players.map((name,i)=>({id:i,name,score:0})),deck,pos:0,pile:[],names:{},turn:config.first||0,phase:'ready',current:null,selected:null,revealed:false,undo:null,updated:Date.now()};
 }
 function snapshot(s){const n=copy(s);n.undo=null;return n;}
 function apply(s,type,value){
  let allowed=false;
  if(type==='flip')allowed=s.phase==='ready';
  if(type==='name')allowed=s.phase==='naming'&&typeof value==='string'&&value.trim().length>0&&Array.from(value.trim()).length<=30;
  if(type==='next')allowed=s.phase==='sharing';
  if(type==='select')allowed=s.phase==='answer'&&!s.revealed&&Number.isInteger(value)&&!!s.players[value];
  if(type==='cancel')allowed=s.phase==='confirm';
  if(type==='award')allowed=s.phase==='confirm'&&s.selected!==null;
  if(type==='reveal'||type==='hold')allowed=s.phase==='answer'&&!s.revealed;
  if(type==='skip')allowed=s.phase==='answer'&&s.revealed;
  if(type==='edit')allowed=!!value&&Object.hasOwn(s.names,value.kind)&&typeof value.name==='string'&&value.name.trim().length>0&&Array.from(value.name.trim()).length<=30;
  if(type==='undo')return s.undo?copy(s.undo):s;
  if(!allowed)return s;
  const n=copy(s);n.undo=snapshot(s);n.updated=Date.now();
  function finish(){n.selected=null;n.revealed=false;n.turn=(n.turn+1)%n.players.length;n.current=null;n.phase=n.pos===n.deck.length?'result':'ready';}
  switch(type){
   case 'flip':n.current=n.deck[n.pos++];n.pile.push(n.current);n.revealed=false;n.phase=Object.hasOwn(n.names,n.current.kind)?'answer':'naming';break;
   case 'name':n.names[n.current.kind]=value.trim();n.phase='sharing';break;
   case 'next':finish();break;
   case 'select':n.selected=value;n.phase='confirm';break;
   case 'cancel':n.selected=null;n.phase='answer';break;
   case 'award':n.players[n.selected].score+=n.pile.length;n.pile=[];finish();break;
   case 'reveal':n.revealed=true;break;
   case 'hold':case 'skip':finish();break;
   case 'edit':n.names[value.kind]=value.name.trim();break;
  }
  return n;
 }
 function valid(s){
  try{return s.version===1&&['ready','naming','sharing','answer','confirm','result'].includes(s.phase)&&s.players.length>=2&&s.players.length<=6&&[30,60].includes(s.deck.length)&&s.pos>=0&&s.pos<=s.deck.length&&s.turn>=0&&s.turn<s.players.length&&s.deck.length-s.pos+s.pile.length+s.players.reduce((a,p)=>a+p.score,0)===s.deck.length;}catch{return false;}
 }
 const api={create,apply,valid};if(typeof module!=='undefined')module.exports=api;root.ForestGame=api;
})(typeof globalThis!=='undefined'?globalThis:this);
