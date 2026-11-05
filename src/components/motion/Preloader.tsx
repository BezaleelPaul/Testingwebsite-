'use client';
import { useEffect,useState } from 'react';
export function Preloader(){
 const [visible,setVisible]=useState(false),[progress,setProgress]=useState(0);
 useEffect(()=>{const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let seen=false;try{seen=sessionStorage.getItem('portfolio-preloader-seen')==='1';}catch{}if(reduced||seen)return;setVisible(true);const start=performance.now();let frame=0,hideTimer=0;const tick=(now:number)=>{const value=Math.min(1,(now-start)/900);setProgress(Math.round(value*100));if(value<1)frame=requestAnimationFrame(tick);else{try{sessionStorage.setItem('portfolio-preloader-seen','1');}catch{}hideTimer=window.setTimeout(()=>setVisible(false),420);}};frame=requestAnimationFrame(tick);return()=>{cancelAnimationFrame(frame);clearTimeout(hideTimer);};},[]);
 if(!visible)return null;return <div className="portfolio-preloader" role="status" aria-label="Loading portfolio"><div className="portfolio-preloader-mark">BP<span>.</span></div><div className="portfolio-preloader-bottom"><span>INITIALIZING EXPERIENCE</span><span>{String(progress).padStart(2,'0')}%</span></div><div className="portfolio-preloader-track"><span style={{width:progress+'%'}}/></div></div>;
}
