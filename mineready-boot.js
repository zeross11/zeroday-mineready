(function(){
'use strict';
var RELEASE='11.7.0';
var app=document.getElementById('app');
function recovery(message){
 if(!app||app.querySelector('.app'))return;
 var main=document.createElement('main'),box=document.createElement('div'),logo=document.createElement('img'),title=document.createElement('h1'),copy=document.createElement('p'),link=document.createElement('a');
 main.className='boot';main.setAttribute('role','alert');logo.src='./assets/icon.svg?v='+RELEASE;logo.alt='Zeroday';title.textContent='MineReady could not start';copy.textContent=String(message||'Application file did not load').slice(0,240);link.href='?reset=1';link.textContent='Reset demo and reload';
 box.appendChild(logo);box.appendChild(title);box.appendChild(copy);box.appendChild(link);main.appendChild(box);app.replaceChildren(main);
}
window.MR_START_FAIL=recovery;
try{
 if(window.top!==window.self){window.MR_BLOCKED=true;recovery('For your protection, MineReady cannot run inside another website. Open the demo directly.');return;}
}catch(frameError){window.MR_BLOCKED=true;recovery('For your protection, MineReady cannot run inside another website. Open the demo directly.');return;}
window.addEventListener('error',function(event){
 var target=event&&event.target;
 if(target&&target!==window){if((target.tagName==='SCRIPT'||target.tagName==='LINK')&&!target.hasAttribute('data-optional'))recovery('A required local application file did not load.');return;}
 recovery(event&&event.message);
},true);
window.addEventListener('unhandledrejection',function(){recovery('Application startup error');});
try{
 if(navigator.serviceWorker&&navigator.serviceWorker.getRegistrations)navigator.serviceWorker.getRegistrations().then(function(list){list.forEach(function(reg){reg.unregister();});});
 if(window.caches)caches.keys().then(function(keys){keys.forEach(function(key){if(key.indexOf('mineready-')===0)caches.delete(key);});});
}catch(cleanupError){}
window.setTimeout(function(){if(!document.querySelector('.app'))recovery('Startup timed out.');},8000);
function setRelease(){var pill=document.querySelector('.demo-pill');if(pill&&pill.textContent!=='v'+RELEASE)pill.textContent='v'+RELEASE;}
setRelease();new MutationObserver(setRelease).observe(app,{childList:true,subtree:true});
})();
