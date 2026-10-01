(()=>{
 'use strict';
 const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const KEY='name-forest-game-v1';let game=null,route='home',storageOK=true,busy=false,audioContext;
 let config={players:['プレイヤー1','プレイヤー2','プレイヤー3','プレイヤー4'],first:0,short:false,sound:true};
 try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved&&ForestGame.valid(saved)){game=saved;config=JSON.parse(JSON.stringify(saved.config));}}catch{storageOK=false;}
 const colors=['#d8ad73','#8fb7a1','#a0b3cc','#d39995','#b3a6c6','#c7bb81'];
 function creature(id){
  const fills=['#dbb461','#97bea6','#9daed1','#ce998c','#ac9fc6','#a6bc77','#e2bd9c','#7faead','#c8b578','#a9bdd8','#cf9da9','#bad0a7'];
  const bodies=[
   '<path d="M68 164V105q0-67 52-67t52 67v59q-52 32-104 0Z"/>',
   '<path d="M44 153 65 67l42 18 33-45 57 119q-71 47-153-6Z"/>',
   '<path d="M64 79q-16-40 9-49t35 40q39-51 57-25t-11 44q45 19 28 66t-65 37q-77 7-74-54 0-29 21-59Z"/>',
   '<path d="M47 136q-20-42 11-62t62 6q20-45 51-23t14 55q43 23 23 58t-60 9q-30 36-62 15t-19-35q-24 8-20-23Z"/>',
   '<path d="M53 162Q36 98 88 74l-8-29 27 11 24-28 15 34q64 29 53 97-69 54-146 3Z"/>',
   '<path d="M47 153q-2-70 72-99 81 27 75 100l-25 34-25-21-24 28-29-26-22 20Z"/>',
   '<path d="M49 151q-20-20-4-43t36-13q-13-60 41-63t47 61q43-11 38 29t-41 47q-41 41-78 0-28 8-39-18Z"/>',
   '<path d="M69 174q-49-59-2-100t103-8q46 57-4 107l-14 29-25-20-25 23-11-25Z"/>',
   '<path d="m49 155 22-96 25 17 26-35 29 36 27-19 19 98q-64 50-148-1Z"/>',
   '<path d="M38 153q0-35 36-35-10-81 60-76t64 76q28 16 20 41-102 46-180-6Z"/>',
   '<path d="M46 124q-5-71 68-76t80 64q28 38-4 60-11 28-34 6-32 35-51 4-43 26-45-13-23-10-14-45Z"/>',
   '<path d="M59 158q-36-80 33-109l27 18 30-25q76 49 33 121-67 33-123-5Z"/>'
  ];
  const details=[
   '<path d="M91 48q25-37 44-18" fill="none" stroke="#638b5f" stroke-width="9"/>',
   '<path d="m69 76 22 17m64-21 20 20" stroke="#638c74" stroke-width="6"/>',
   '<path d="M71 37 92 72m65-22-20 32" stroke="#7b88b2" stroke-width="7"/>',
   '<circle cx="67" cy="76" r="9" fill="#e9d3a0"/><circle cx="175" cy="68" r="9" fill="#e9d3a0"/>',
   '<path d="m98 75 16-12 16 11" fill="none" stroke="#7e729c" stroke-width="6"/>',
   '<path d="m93 80 26 21 24-20" fill="none" stroke="#7a9455" stroke-width="7"/>',
   '<circle cx="121" cy="48" r="10" fill="#d69073"/>',
   '<path d="M76 72q-10-27-31-29m115 24q17-30 40-20" fill="none" stroke="#567c71" stroke-width="7"/><circle cx="43" cy="41" r="9" fill="#e5be76"/><circle cx="199" cy="45" r="9" fill="#e5be76"/>',
   '<path d="m77 91 7-13 10 15m55-1 8-14 11 12" fill="none" stroke="#a08c54" stroke-width="5"/>',
   '<path d="M153 57q27 25 5 46t-47-9q-10-27 18-28t20 24" fill="none" stroke="#778eae" stroke-width="6"/>',
   '<path d="m90 60 5-18 13 12m25 0 14-14 5 21" fill="#956784"/>',
   '<path d="M89 63 73 39m77 20 19-22" fill="none" stroke="#7d9f71" stroke-width="8"/><circle cx="72" cy="37" r="10" fill="#e0ba6b"/><circle cx="170" cy="35" r="10" fill="#e0ba6b"/>'
  ];
  const ey=id===9?132:110,mouth=id===9?155:143;
  return `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ふしぎなキャラクター"><ellipse cx="120" cy="208" rx="69" ry="9" fill="#e5e7d9"/><g stroke="#355246" stroke-width="4" stroke-linejoin="round"><path d="M87 174 80 201m70-27 8 27" stroke="${fills[id]}" stroke-width="13" stroke-linecap="round"/><g fill="${fills[id]}">${bodies[id]}</g></g>${details[id]}<circle cx="93" cy="${ey}" r="14" fill="#fffdf5"/><circle cx="148" cy="${ey}" r="14" fill="#fffdf5"/><circle cx="96" cy="${ey+1}" r="6" fill="#294b3f"/><circle cx="145" cy="${ey+1}" r="6" fill="#294b3f"/><ellipse cx="74" cy="${ey+23}" rx="9" ry="5" fill="#d58676" opacity=".55"/><ellipse cx="167" cy="${ey+23}" rx="9" ry="5" fill="#d58676" opacity=".55"/><path d="M107 ${mouth}q14 14 27 0" fill="none" stroke="#355246" stroke-width="5" stroke-linecap="round"/></svg>`;
 }
 function notify(message){const el=$('#notice');el.textContent=message;el.style.display='block';clearTimeout(notify.timer);notify.timer=setTimeout(()=>el.style.display='none',4500);}
 function save(){try{localStorage.setItem(KEY,JSON.stringify(game));}catch{storageOK=false;notify('この端末では続きから再開できません。今のゲームは遊べます。');}}
 function sound(){if(!game?.config.sound)return;try{audioContext??=new(window.AudioContext||window.webkitAudioContext)();audioContext.resume();const o=audioContext.createOscillator(),g=audioContext.createGain();o.connect(g);g.connect(audioContext.destination);o.frequency.setValueAtTime(520,audioContext.currentTime);o.frequency.exponentialRampToValueAtTime(780,audioContext.currentTime+.12);g.gain.setValueAtTime(.04,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.16);o.start();o.stop(audioContext.currentTime+.17);}catch{}}
 function act(type,value){const next=ForestGame.apply(game,type,value);if(next===game)return;game=next;save();if(type==='award'||type==='name')sound();if(game.phase==='result')route='result';render();}
 const btn=(label,action,cls='',extra='')=>`<button class="btn ${cls}" data-action="${action}" ${extra}>${label}</button>`;
 function shell(body){$('#app').innerHTML=`<header><button class="brand" data-action="brand"><img src="icon.svg" alt="">なまえの森</button><span class="kicker">A LITTLE FOREST, A LOT OF LAUGHTER</span></header><main>${!storageOK?'<div class="save-warning">この端末では続きから再開できません。今のゲームはそのまま遊べます。</div>':''}${body}</main><footer><span>2〜6人 · 端末1台 · 声であそぶ</span><span>名前をつけたら、もう仲間。</span></footer><dialog id="dialog"></dialog>`;}
 function home(){return `<section class="hero"><div><span class="tag">みんなで囲む、記憶のあそび</span><h1>きみの名前、<br>なんだっけ？</h1><p class="lead">ふしぎな仲間に、へんてこな名前を。<br>また会えたら、だれより早く呼んでみよう。<br>用意するのは、みんなとタブレット1台。</p><div class="actions">${btn('森へあそびにいく →','setup')}${game&&game.phase!=='result'?btn('続きから','continue','secondary'):''}</div><button class="text-btn" data-action="rules">遊び方をみる</button></div><div class="showcase" aria-hidden="true"><div class="sample-card back"></div><div class="sample-card">${creature(0)}<small>どんな名前にする？</small></div><div class="bubble">「ぷりん隊長！」</div><div class="bubble second">覚えた？ じゃあ、次！</div></div></section><section class="steps"><div class="step"><span>01</span><h3>名前をつける</h3><p>初めて会った仲間に、好きな名前を。</p></div><div class="step"><span>02</span><h3>みんなで覚える</h3><p>声に出して、ちょっと笑って、覚えよう。</p></div><div class="step"><span>03</span><h3>早く呼ぶ</h3><p>また出たら名前を呼んで、カードを獲得！</p></div></section>`;}
 function setup(){return `<div class="page-title"><div><div class="phase-label">LET’S GATHER</div><h2>だれと、あそぶ？</h2><p class="muted">画面の周りに、時計回りで座ろう。</p></div><button class="text-btn" data-action="home">戻る</button></div><form id="setup-form"><div class="setup-grid"><section class="panel"><h3>あそぶ人数</h3><div class="count-row">${[2,3,4,5,6].map(n=>`<button type="button" data-action="count" data-value="${n}" class="${config.players.length===n?'active':''}" aria-pressed="${config.players.length===n}">${n}人</button>`).join('')}</div><div class="players-form">${config.players.map((p,i)=>`<label>${i+1}番の席<input type="text" name="player-${i}" maxlength="12" value="${esc(p)}" required autocomplete="off"></label>`).join('')}</div><p class="note">番号は座席の順番です。名前の入力は大人が手伝ってもOK。</p><label style="margin-top:22px">最初にめくる人<select name="first">${config.players.map((p,i)=>`<option value="${i}" ${config.first===i?'selected':''}>${i+1}番 · ${esc(p)}</option>`).join('')}</select></label></section><section class="panel"><h3>森の大きさ</h3><label class="option"><input type="radio" name="length" value="normal" ${!config.short?'checked':''}>じっくり · 60枚<p>12種類の仲間。名前が増えるほど、楽しい！</p></label><label class="option"><input type="radio" name="length" value="short" ${config.short?'checked':''}>さくっと · 30枚<p>6種類の仲間。初めて遊ぶときにおすすめ。</p></label><label class="option"><input type="checkbox" name="sound" ${config.sound?'checked':''}>効果音を鳴らす</label><p class="note">声で呼んだ順番は、みんなで判断します。画面のボタンは得点を登録するためのものです。</p>${btn('このメンバーではじめる →','start','full','type="submit"')}</section></div></form>`;}
 function collectConfig(){const f=$('#setup-form');if(!f)return;config.players=config.players.map((_,i)=>f.elements['player-'+i].value.trim()||'プレイヤー'+(i+1));config.first=Number(f.elements.first.value);config.short=f.elements.namedItem('length').value==='short';config.sound=f.elements.sound.checked;}
 function seats(){const n=game.players.length,positions=n===2?[['bottom',50],['top',50]]:n===3?[['bottom',50],['right',0],['top',50]]:n===4?[['bottom',50],['right',0],['top',50],['left',0]]:n===5?[['bottom',33],['bottom',67],['right',0],['top',50],['left',0]]:[['bottom',33],['bottom',67],['right',0],['top',67],['top',33],['left',0]];
  return game.players.map((p,i)=>{const [pos,x]=positions[i],active=game.phase==='answer'&&!game.revealed;return `<button class="seat ${pos} ${i===game.turn?'turn':''} ${active?'answerable':''}" ${x?`style="left:${x}%"`:''} ${active?`data-action="pick" data-value="${i}"`: 'disabled'} aria-label="${esc(p.name)}を獲得者に選ぶ、${p.score}枚"><span class="seat-name"><span style="color:${colors[i]}">●</span> ${i+1} · ${esc(p.name)}</span><span class="seat-score"><b>${p.score}</b> 枚</span></button>`;}).join('');}
 function control(){const p=esc(game.players[game.turn].name),name=game.current?esc(game.names[game.current.kind]||''):'';
  switch(game.phase){
   case 'ready':return `<div class="phase-label">NEXT CARD</div><h2>${p}さんの番</h2><p class="muted">みんな、絵が見える？<br>準備ができたらめくろう。</p>${btn('カードをめくる','flip','full')}<p class="note">名前が付いた仲間が出たら、声で呼んでね。</p>`;
   case 'naming':return `<div class="phase-label">HELLO, NEW FRIEND</div><h2>はじめて！</h2><p>${p}さんが名前をつけて、<br>みんなに声で教えてね。</p><form id="name-form"><label for="new-name">この子の名前<input id="new-name" name="name" type="text" maxlength="30" required autocomplete="off" placeholder="例：ぷりん隊長"></label>${btn('この名前にする','name','full','type="submit"')}</form>`;
   case 'sharing':return `<div class="phase-label">REMEMBER ME</div><h2>みんな、覚えた？</h2><div class="answer-name">${name}</div><p class="muted">一緒に声に出してみよう。<br>次に出たときは、この名前で！</p>${btn('覚えた・次へ','next','full')}`;
   case 'answer':return game.revealed?`<div class="phase-label">THAT’S MY NAME</div><h2>名前は…</h2><div class="answer-name">${name}</div><p class="muted">今回は獲得者なし。<br>カードは場に残します。</p>${btn('獲得者なし・次へ','skip','full')}`:`<div class="phase-label">SAY MY NAME!</div><h2>この子の名前は？</h2><p>声で呼ぼう！ 最初に正しく<br>呼んだ人を、みんなで決めてね。</p><div class="player-picks">${game.players.map((p,i)=>`<button data-action="pick" data-value="${i}">${i+1} · ${esc(p.name)}</button>`).join('')}</div><p class="note">選ぶと答えが表示されます。</p><button class="text-btn" data-action="hold">同時で決まらない・判定保留</button>${btn('思い出せない・答えを見る','reveal','outline full')}`;
   case 'confirm':return `<div class="phase-label">CHECK TOGETHER</div><h2>正しい名前だった？</h2><div class="answer-name">${name}</div><p><b>${esc(game.players[game.selected].name)}</b>さんが<br><b>${game.pile.length}枚</b>を獲得します。</p>${btn('正解！ 獲得を確定','award','full')}${btn('選び直す','cancel','outline full')}<p class="note">答えを見たあとの再開は、みんなの合意で。</p>`;
  }
 }
 function gameView(){return `<div class="game-header"><div class="stats"><span>山札 <strong>${game.deck.length-game.pos}</strong> 枚</span><span>場のカード <strong>${game.pile.length}</strong> 枚</span></div>${btn('一時停止','pause','outline')}</div><div class="game-layout"><section class="table" aria-label="みんなのテーブル">${seats()}<div class="card ${game.current?'flip-in':'cover'}">${game.current?creature(game.current.kind):'<span>?</span>'}</div></section><section class="control" aria-live="polite">${control()}</section></div><p class="note" style="text-align:center">オレンジの枠が、めくる人。席の番号は時計回りです。</p>`;}
 function pauseView(){return `<div class="page-title"><div><div class="phase-label">TAKE A LITTLE BREAK</div><h2>ただいま、一時停止中</h2><p class="muted">再開は、みんなの準備ができてから。</p></div>${btn('ゲームに戻る','resume')}</div><section class="panel"><div class="actions">${btn('直前の操作を戻す','undo','outline',game.undo?'':'disabled')}${btn('ゲームを終了する','end','danger')}</div><p class="note">取り消しは1件です。一度見た名前は、記憶から戻せないので全員で確認してね。</p><hr style="border:0;border-top:1px solid var(--line);margin:24px 0"><h3>名前を確認・訂正する</h3><p class="muted">訂正した名前は、必ず全員に声で知らせてね。</p><div class="pause-list">${Object.entries(game.names).map(([id,name])=>`<form class="name-edit" data-kind="${id}">${creature(Number(id))}<label>登録した名前<input type="text" name="edited" maxlength="30" required value="${esc(name)}"></label>${btn('訂正して共有','edit','outline','type="submit"')}</form>`).join('')||'<p class="muted">まだ名前は付いていません。</p>'}</div></section>`;}
 function resultView(){const max=Math.max(...game.players.map(p=>p.score)),winners=game.players.filter(p=>p.score===max),sorted=[...game.players].sort((a,b)=>b.score-a.score);return `<section class="result-wrap panel"><div class="result-symbol">✷</div><div class="phase-label">WELL PLAYED, EVERYONE</div><h2>${winners.length>1?'みんなで同率優勝！':'おめでとう！'}</h2><p style="font-size:21px;font-weight:800;overflow-wrap:anywhere">${winners.map(p=>esc(p.name)).join('・')}さん${winners.length>1?'たち':''}</p><p class="muted">今日の仲間の名前、いくつ覚えてる？</p><ol class="ranking">${sorted.map((p,i)=>`<li><span class="rank">${sorted.findIndex(q=>q.score===p.score)+1}</span><span class="name">${esc(p.name)}</span><strong>${p.score}</strong><span>枚</span></li>`).join('')}</ol><p class="note">未獲得の場札：${game.pile.length}枚 ／ 合計：${game.deck.length}枚</p><div class="actions" style="justify-content:center;margin-top:22px">${btn('同じメンバーでもう一度','again')}${btn('ホームへ','home','outline')}</div>${btn('最後の操作を戻す','result-undo','outline full',game.undo?'':'disabled')}</section>`;}
 function rulesView(){return `<div class="page-title"><div><div class="phase-label">HOW TO PLAY</div><h2>名前をつけて、覚えて、呼ぼう。</h2></div>${btn('戻る','rules-back','outline')}</div><section class="panel"><div class="steps" style="margin-top:0"><div class="step"><span>01</span><h3>めくる & 名前をつける</h3><p>時計回りに1枚ずつ。初めての絵なら、めくった人が名前をつけてみんなに教えます。</p></div><div class="step"><span>02</span><h3>同じ絵が出たら、呼ぶ！</h3><p>全員参加。最初に正しい名前を呼んだ人を、みんなで判断して画面で選びます。</p></div><div class="step"><span>03</span><h3>場のカードをまとめて獲得</h3><p>答えを確認して得点登録。山札がなくなったら、集めた枚数が多い人の勝ち！</p></div></div><h3 style="margin-top:30px">こんなときは？</h3><p>間違えて呼んでも減点はありません。同時で決まらなければ「判定保留」で場札を残して次へ。誰も思い出せなければ「答えを見る」で確認して、獲得者なしで次へ進めます。</p><p>山札の最後も、名前の登録や回答を終えてから結果を出します。残った場札は未獲得。同点なら同率優勝です。</p><h3>タブレットを囲んで</h3><p>横向きに置くと遊びやすいです。席のボタンも得点登録用なので、早押しする必要はありません。操作係も回答に参加できます。</p><h3>名前を見たい・操作を間違えた</h3><p>「一時停止」から名前の一覧・訂正・直前操作の取り消しができます。名前を見るときや訂正するときは、全員に共有しましょう。</p><p class="note">「なまえの森」は独自イラストの名前記憶ゲームです。ナンジャモンジャの基本的な遊び方を参考にしています。同時回答などの扱いは、このアプリの取り決めです。</p></section>`;}
 let rulesFrom='home';
 function render(){shell(route==='home'?home():route==='setup'?setup():route==='rules'?rulesView():route==='pause'?pauseView():route==='result'?resultView():gameView());}
 function modal(title,message,yes,callback){const d=$('#dialog');d.innerHTML=`<h2>${esc(title)}</h2><p>${esc(message)}</p><div class="actions"><button class="btn" id="dialog-yes">${esc(yes)}</button><button class="btn outline" id="dialog-no">戻る</button></div>`;d.showModal();$('#dialog-no').onclick=()=>d.close();$('#dialog-yes').onclick=()=>{d.close();callback();};}
 function start(){const run=()=>{game=ForestGame.create(config);route='game';save();render();};if(game&&game.phase!=='result')modal('新しいゲームをはじめる？','保存しているゲームは、新しいゲームに置き換わります。','はじめる',run);else run();}
 document.addEventListener('submit',e=>{e.preventDefault();if(e.target.id==='setup-form'){collectConfig();start();}if(e.target.id==='name-form'){const name=e.target.elements.name.value.trim();if(!name){notify('名前を入力してね。');return;}if(Array.from(name).length>30)return;const apply=()=>act('name',name);if(Object.values(game.names).includes(name))modal('同じ名前の仲間がいるよ','同じ名前でも登録できます。この名前でいい？','この名前にする',apply);else apply();}if(e.target.matches('.name-edit')){const name=e.target.elements.edited.value.trim();if(!name){notify('名前を入力してね。');return;}act('edit',{kind:Number(e.target.dataset.kind),name});notify('名前を訂正しました。「'+name+'」と全員に声で知らせてね。');}});
 document.addEventListener('click',async e=>{const b=e.target.closest('[data-action]');if(!b||b.disabled||busy)return;const a=b.dataset.action;if(['start','name','edit'].includes(a))return;
  switch(a){
   case 'brand':if(route==='game')route='pause';else if(route==='pause')return;else route='home';render();break;
   case 'home':route='home';render();break;
   case 'setup':route='setup';render();break;
   case 'count':collectConfig();{const n=Number(b.dataset.value);config.players=Array.from({length:n},(_,i)=>config.players[i]||'プレイヤー'+(i+1));config.first=Math.min(config.first,n-1);}render();break;
   case 'rules':rulesFrom=route;route='rules';render();break;
   case 'rules-back':route=rulesFrom;render();break;
   case 'continue':route='pause';render();break;
   case 'pause':route='pause';render();break;
   case 'resume':route=game.phase==='result'?'result':'game';render();break;
   case 'flip':if(game.phase!=='ready')return;busy=true;b.disabled=true;b.textContent='めくっています…';await new Promise(r=>setTimeout(r,300));act('flip');busy=false;break;
   case 'pick':act('select',Number(b.dataset.value));break;
   case 'next':case 'award':case 'cancel':case 'skip':act(a);break;
   case 'hold':modal('判定を保留する？','答えを見せず、場のカードを残して次に進みます。','保留して次へ',()=>act('hold'));break;
   case 'reveal':modal('答えを見る？','今回はカードを獲得できません。名前を確認して、次に進みます。','答えを見る',()=>act('reveal'));break;
   case 'undo':modal('直前の操作を戻す？','全員で確認してから、戻った状態で再開しましょう。','操作を戻す',()=>{act('undo');route='pause';render();});break;
   case 'result-undo':route='pause';render();break;
   case 'end':modal('このゲームを終了する？','途中のゲームを終了します。保存している続きも削除されます。','終了する',()=>{game=null;try{localStorage.removeItem(KEY);}catch{}route='home';render();});break;
   case 'again':config=JSON.parse(JSON.stringify(game.config));game=ForestGame.create(config);route='game';save();render();break;
  }
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&route==='game'){route='pause';render();}});
 render();
 if('serviceWorker'in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').then(()=>navigator.serviceWorker.ready).then(()=>{const show=()=>notify('オフラインで遊ぶ準備ができました。');if(navigator.serviceWorker.controller)show();else navigator.serviceWorker.addEventListener('controllerchange',show,{once:true});}).catch(()=>notify('オフライン準備に失敗しました。接続中は遊べます。'));
})();
