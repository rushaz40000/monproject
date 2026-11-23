(function(){
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  /* ---------- меню ---------- */
  var bar=$('.navbar'),tog=$('#menu-toggle');
  if(tog)tog.addEventListener('click',function(){
    var o=bar.classList.toggle('open');tog.setAttribute('aria-expanded',o?'true':'false');
  });
  $$('.sub-toggle').forEach(function(b){b.addEventListener('click',function(){
    var li=b.parentNode,o=li.classList.toggle('expanded');b.setAttribute('aria-expanded',o?'true':'false');
  })});

  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- слайдер: листается свайпом, мышью, стрелками, точками ---------- */
  var slider=$('.slider');
  if(slider){
    var track=$('.slides',slider),slides=$$('.slide',slider),dots=$$('.dots button',slider),prog=$('.prog',slider);
    var cur=0,raf=0,dragging=false,moved=false,sx=0,sl=0,sid=null;
    var w=function(){return track.clientWidth||1};
    var goTo=function(i){i=(i+slides.length)%slides.length;track.scrollTo({left:i*w(),behavior:reduce?'auto':'smooth'})};
    var restart=function(){if(!prog)return;prog.classList.remove('run');void prog.offsetWidth;prog.classList.add('run')};
    var mark=function(i,anim){
      cur=i;
      slides.forEach(function(s,k){s.classList.toggle('on',k===i);s.setAttribute('aria-hidden',k===i?'false':'true');if(k!==i)s.classList.remove('anim-in')});
      dots.forEach(function(d,k){d.setAttribute('aria-current',k===i?'true':'false')});
      if(anim)slides[i].classList.add('anim-in');
    };
    track.addEventListener('scroll',function(){
      if(raf)return;
      raf=requestAnimationFrame(function(){
        raf=0;var i=Math.max(0,Math.min(slides.length-1,Math.round(track.scrollLeft/w())));
        if(i!==cur){mark(i,true);restart()}
      });
    },{passive:true});
    dots.forEach(function(d,k){d.addEventListener('click',function(){goTo(k)})});
    var pv=$('.arrow.prev',slider),nx=$('.arrow.next',slider);
    if(pv)pv.addEventListener('click',function(){goTo(cur-1)});
    if(nx)nx.addEventListener('click',function(){goTo(cur+1)});
    if(prog)prog.addEventListener('animationend',function(){goTo(cur+1)});
    /* мышь: перетаскивание */
    track.addEventListener('pointerdown',function(e){
      if(e.pointerType!=='mouse'||e.button!==0)return;
      dragging=true;moved=false;sx=e.clientX;sl=track.scrollLeft;sid=e.pointerId;slider.classList.add('holding');
    });
    track.addEventListener('pointermove',function(e){
      if(!dragging||e.pointerId!==sid)return;
      var dx=e.clientX-sx;
      if(!moved&&Math.abs(dx)>5){moved=true;track.classList.add('dragging');try{track.setPointerCapture(sid)}catch(_){}}
      if(moved)track.scrollLeft=sl-dx;
    });
    var endDrag=function(e){
      if(!dragging)return;dragging=false;slider.classList.remove('holding');
      if(!moved)return;
      var dx=e.clientX-sx;track.classList.remove('dragging');
      var t=cur;if(dx<-60)t=Math.min(cur+1,slides.length-1);else if(dx>60)t=Math.max(cur-1,0);
      track.scrollTo({left:t*w(),behavior:reduce?'auto':'smooth'});
      try{track.releasePointerCapture(sid)}catch(_){}
    };
    track.addEventListener('pointerup',endDrag);track.addEventListener('pointercancel',endDrag);
    track.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
    /* касание: на время жеста ставим автопрокрутку на паузу */
    track.addEventListener('touchstart',function(){slider.classList.add('holding')},{passive:true});
    var rel=function(){setTimeout(function(){slider.classList.remove('holding')},1200)};
    track.addEventListener('touchend',rel,{passive:true});track.addEventListener('touchcancel',rel,{passive:true});
    window.addEventListener('resize',function(){track.scrollLeft=cur*w()});
    mark(0,false);restart();
  }

  /* ---------- звонок: если телефон не открывается (страница во встроенном окне), показываем номер ---------- */
  var cdlg=$('#call-dialog');
  if(cdlg){
    var embedded=false;try{embedded=window.self!==window.top}catch(_){embedded=true}
    $$('a[href^="tel:"]').forEach(function(a){
      if(cdlg.contains(a))return;
      a.addEventListener('click',function(e){
        if(!embedded)return;
        e.preventDefault();if(cdlg.showModal&&!cdlg.open)cdlg.showModal();
      });
    });
    $$('[data-close]',cdlg).forEach(function(b){b.addEventListener('click',function(){cdlg.close()})});
    cdlg.addEventListener('click',function(e){if(e.target===cdlg)cdlg.close()});
    var cc=$('#call-copy'),cm=$('#call-msg');
    if(cc)cc.addEventListener('click',function(){
      var n=$('.call-num',cdlg).textContent;
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(n).then(function(){cm.textContent='Номер скопирован.'},function(){cm.textContent='Номер: '+n})}
      else cm.textContent='Номер: '+n;
    });
  }

  /* ---------- плавное появление блоков при прокрутке ---------- */
  if('IntersectionObserver' in window&&!reduce){
    document.documentElement.classList.add('anim');
    var sel='.cards>*,.steps>li,.sec-title,.facts-box,.prose>*,.checks li,.gallery>*,.slot-grid>*,.form-box,.faq details,.cinfo>div,.tbl-wrap,.reqs,.side,.content>div,.cta .wrap>div,.foot-grid>div,.facts,.contact-grid>*';
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    var vh=window.innerHeight||800;
    $$(sel).forEach(function(el){
      var par=el.parentNode;par._rv=par._rv||0;el.style.setProperty('--d',Math.min(par._rv,6));par._rv++;
      el.classList.add('reveal');
      if(el.getBoundingClientRect().top<vh*0.92)el.classList.add('in');else io.observe(el);
    });
  }
})();
