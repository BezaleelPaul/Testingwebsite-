'use client';
import { useEffect, useRef } from 'react';
const VERTEX = `attribute vec2 position; varying vec2 uv; void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const FRAGMENT = `precision mediump float; varying vec2 uv; uniform sampler2D portrait; uniform vec2 pointer; uniform float time; uniform float aspect; void main(){vec2 p=uv;vec4 source=texture2D(portrait,p);float lum=dot(source.rgb,vec3(.299,.587,.114));float depth=clamp(lum*.72+.18,0.,1.);p+=(pointer*.014)*(depth-.42);source=texture2D(portrait,p);float d=distance((uv-.5)*vec2(aspect,1.),(pointer+vec2(.5))*vec2(aspect,1.));float ripple=sin(atan(uv.y-pointer.y,uv.x-pointer.x)*3.0+time*1.1)*.012;float reveal=1.0-smoothstep(.22+ripple,.39+ripple,d);float gray=dot(source.rgb,vec3(.28,.58,.14))*.82;vec3 color=mix(vec3(gray),vec3(1.,.29,.08)*(0.35+lum*.72),reveal*.88);gl_FragColor=vec4(color,source.a);}`;
export function PortraitDepth(){
 const portraitSrc = `${process.env.NEXT_PUBLIC_SITE_BASE_PATH || ''}/assets/portrait-processed.webp`;
 const canvas=useRef<HTMLCanvasElement>(null); const image=useRef<HTMLImageElement>(null);
 useEffect(()=>{
  const el=canvas.current,img=image.current;if(!el||!img)return;
  const fine=matchMedia('(hover: hover) and (pointer: fine)').matches,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,memory=(navigator as Navigator&{deviceMemory?:number}).deviceMemory;
  if(!fine||reduced||(memory&&memory<=4))return;
  const gl=el.getContext('webgl',{alpha:true,antialias:false,powerPreference:'low-power'});if(!gl)return;
  let raf=0,active=true,texture:WebGLTexture|null=null;let px=0,py=0;
  try{
   const compile=(type:number,source:string)=>{const shader=gl.createShader(type);if(!shader)throw Error('shader unavailable');gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(shader)||'compile failed');return shader;};
   const program=gl.createProgram();if(!program)return;gl.attachShader(program,compile(gl.VERTEX_SHADER,VERTEX));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,FRAGMENT));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('link failed');gl.useProgram(program);
   const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const pos=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
   texture=gl.createTexture();if(!texture)throw Error('texture unavailable');gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
   const u={pointer:gl.getUniformLocation(program,'pointer'),time:gl.getUniformLocation(program,'time'),aspect:gl.getUniformLocation(program,'aspect'),portrait:gl.getUniformLocation(program,'portrait')};gl.uniform1i(u.portrait,0);
   const upload=()=>{if(img.complete&&img.naturalWidth){gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);}};if(img.complete)upload();else img.addEventListener('load',upload,{once:true});
   const move=(e:PointerEvent)=>{const r=el.getBoundingClientRect();px=(e.clientX-r.left)/Math.max(1,r.width)-.5;py=.5-(e.clientY-r.top)/Math.max(1,r.height);};window.addEventListener('pointermove',move,{passive:true});
   const observer=new IntersectionObserver(([entry])=>{active=entry.isIntersecting;if(active&&!raf)raf=requestAnimationFrame(draw);});observer.observe(el);
   const draw=(now:number)=>{raf=0;if(!active)return;const r=el.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.35),w=Math.max(1,Math.round(r.width*dpr)),h=Math.max(1,Math.round(r.height*dpr));if(el.width!==w||el.height!==h){el.width=w;el.height=h;gl.viewport(0,0,w,h);}gl.uniform2f(u.pointer,px,py);gl.uniform1f(u.time,now*.001);gl.uniform1f(u.aspect,r.width/Math.max(1,r.height));gl.drawArrays(gl.TRIANGLE_STRIP,0,4);raf=requestAnimationFrame(draw);};raf=requestAnimationFrame(draw);
   return()=>{active=false;observer.disconnect();window.removeEventListener('pointermove',move);img.removeEventListener('load',upload);cancelAnimationFrame(raf);gl.getExtension('WEBGL_lose_context')?.loseContext();};
  }catch{el.classList.add('portrait-gl-failed');}
 },[]);
 return <div className="portrait-depth" aria-hidden="true"><img ref={image} src={portraitSrc} alt="" crossOrigin="anonymous"/><canvas ref={canvas}/></div>;
}
