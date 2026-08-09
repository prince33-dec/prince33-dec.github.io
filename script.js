(function(){
  "use strict";

  document.body.classList.add("js-ready");

  function ready(fn){
    if(document.readyState === "loading"){
      document.addEventListener("DOMContentLoaded", fn);
    }else{
      fn();
    }
  }

  ready(function(){
    const loader = document.getElementById("loader");
    if(loader){
      window.addEventListener("load", function(){
        setTimeout(function(){ loader.classList.add("hide"); }, 500);
      });
      setTimeout(function(){ loader.classList.add("hide"); }, 1800);
    }

    // Scroll reveal
    const revealItems = document.querySelectorAll(".reveal");
    if("IntersectionObserver" in window){
      const observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      }, {threshold:0.08, rootMargin:"0px 0px -30px 0px"});
      revealItems.forEach(function(el){ observer.observe(el); });
    }else{
      revealItems.forEach(function(el){ el.classList.add("visible"); });
    }

    // Scroll progress
    const progress = document.querySelector(".progress");
    function updateProgress(){
      if(!progress) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    }
    window.addEventListener("scroll", updateProgress, {passive:true});
    updateProgress();

    // Active navigation
    const navLinks = Array.from(document.querySelectorAll(".nav nav a"));
    const sections = Array.from(document.querySelectorAll("section[id]"));
    function updateNav(){
      const y = window.scrollY + 180;
      sections.forEach(function(section){
        if(y >= section.offsetTop && y < section.offsetTop + section.offsetHeight){
          navLinks.forEach(function(link){
            link.classList.toggle("active", link.getAttribute("href") === "#" + section.id);
          });
        }
      });
    }
    window.addEventListener("scroll", updateNav, {passive:true});
    updateNav();

    // Smooth internal links
    document.querySelectorAll('a[href^="#"]').forEach(function(link){
      link.addEventListener("click", function(e){
        const target = document.querySelector(link.getAttribute("href"));
        if(target){
          e.preventDefault();
          target.scrollIntoView({behavior:"smooth", block:"start"});
        }
      });
    });

    // Number counters
    document.querySelectorAll("[data-count]").forEach(function(el){
      const target = Number(el.getAttribute("data-count")) || 0;
      let started = false;
      function startCounter(){
        if(started) return;
        started = true;
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 30));
        const timer = setInterval(function(){
          current += step;
          if(current >= target){
            current = target;
            clearInterval(timer);
          }
          el.textContent = current;
        }, 35);
      }
      if("IntersectionObserver" in window){
        const counterObserver = new IntersectionObserver(function(entries){
          if(entries[0].isIntersecting){
            startCounter();
            counterObserver.disconnect();
          }
        }, {threshold:.5});
        counterObserver.observe(el);
      }else{
        startCounter();
      }
    });

    // Mouse glow and hero parallax
    const cursor = document.querySelector(".cursor");
    const cursorDot = document.querySelector(".cursor-dot");
    const glow = document.querySelector(".mouse-glow");
    const scene = document.querySelector(".scene");
    let mx = window.innerWidth/2, my = window.innerHeight/2;
    let cx = mx, cy = my;

    window.addEventListener("mousemove", function(e){
      mx = e.clientX; my = e.clientY;
      if(cursorDot){
        cursorDot.style.left = mx + "px";
        cursorDot.style.top = my + "px";
      }
      if(glow){
        glow.style.left = mx + "px";
        glow.style.top = my + "px";
      }
    }, {passive:true});

    function cursorLoop(){
      cx += (mx-cx)*.13;
      cy += (my-cy)*.13;
      if(cursor){
        cursor.style.left = cx + "px";
        cursor.style.top = cy + "px";
      }
      requestAnimationFrame(cursorLoop);
    }
    if(cursor) cursorLoop();

    if(scene){
      window.addEventListener("mousemove", function(e){
        const x = e.clientX / window.innerWidth - .5;
        const y = e.clientY / window.innerHeight - .5;
        scene.style.transform = "perspective(1200px) rotateY("+(x*5)+"deg) rotateX("+(-y*4)+"deg)";
      }, {passive:true});
    }

    // Subtle card tilt
    document.querySelectorAll(".skill,.project").forEach(function(card){
      card.addEventListener("mousemove", function(e){
        const r = card.getBoundingClientRect();
        const x = (e.clientX-r.left)/r.width-.5;
        const y = (e.clientY-r.top)/r.height-.5;
        card.style.transform = "perspective(900px) rotateX("+(-y*2)+"deg) rotateY("+(x*3)+"deg) translateY(-5px)";
      });
      card.addEventListener("mouseleave", function(){
        card.style.transform = "";
      });
    });
  });
})();