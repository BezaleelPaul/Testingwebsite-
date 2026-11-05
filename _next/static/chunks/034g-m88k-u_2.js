(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,27651,46013,44930,46223,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(90072),o=e.i(98903),n=e.i(60099);function i(e,t){if(0===e.semiMajorAxis)return new a.cE(0,0,0);let r=2*Math.PI/e.orbitalPeriodDays,o=function(e,t){let r=t>.8?Math.PI:e;for(let a=0;a<30;a++){let a=r-t*Math.sin(r)-e;if(1e-6>Math.abs(a))break;let o=1-t*Math.cos(r);r-=a/o}return r}((e.meanAnomalyEpochDeg*Math.PI/180+r*t)%(2*Math.PI),e.eccentricity),n=e.semiMajorAxis,i=e.eccentricity,s=n*(Math.cos(o)-i),l=n*Math.sqrt(1-i*i)*Math.sin(o),u=e.inclinationDeg*Math.PI/180,c=e.argumentOfPeriapsisDeg*Math.PI/180,p=e.longitudeOfAscendingNodeDeg*Math.PI/180,d=Math.cos(p),m=Math.sin(p),h=Math.cos(u),f=Math.sin(u),g=Math.cos(c),v=Math.sin(c);return new a.cE(s*(d*g-m*v*h)+l*(-d*v-m*g*h),v*f*s+g*f*l,s*(m*g+d*v*h)+l*(-m*v+d*g*h))}function s(e,t=180){if(0===e.semiMajorAxis)return[];let r=[],o=e.semiMajorAxis,n=e.eccentricity,i=e.inclinationDeg*Math.PI/180,l=e.argumentOfPeriapsisDeg*Math.PI/180,u=e.longitudeOfAscendingNodeDeg*Math.PI/180,c=Math.cos(u),p=Math.sin(u),d=Math.cos(i),m=Math.sin(i),h=Math.cos(l),f=Math.sin(l),g=c*h-p*f*d,v=f*m,M=p*h+c*f*d,x=-c*f-p*h*d,w=h*m,y=-p*f+c*h*d;for(let e=0;e<=t;e++){let i=e/t*2*Math.PI,s=o*(Math.cos(i)-n),l=o*Math.sqrt(1-n*n)*Math.sin(i),u=s*g+l*x,c=s*v+l*w,p=s*M+l*y;r.push(new a.cE(u,c,p))}return r}e.s(["D",0,i,"R",0,s],46013);let l={vertexShader:`
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vNormal = normalize(mat3(modelMatrix) * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,fragmentShader:`
    uniform vec3 uSunPosition;
    uniform vec3 uAtmosphereColor;
    uniform vec3 uSunsetTint;
    uniform float uAtmosphereScale;
    uniform float uIntensity;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vec3 lightDir = normalize(uSunPosition - vWorldPosition);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 normal = normalize(vNormal);

      float NdotL = dot(normal, lightDir);
      float NdotV = max(0.0, dot(normal, viewDir));

      // Rayleigh grazing limb falloff
      float limb = pow(1.0 - NdotV, 3.2);

      // Sunlit hemisphere mask with soft terminator falloff
      float sunMask = smoothstep(-0.15, 0.35, NdotL);

      // Sunset / Twilight amber tint at the terminator line (NdotL ~ 0)
      float terminator = smoothstep(-0.1, 0.15, NdotL) * smoothstep(0.4, 0.05, NdotL);
      vec3 scatterColor = mix(uAtmosphereColor, uSunsetTint, terminator * 0.7);

      float alpha = limb * sunMask * uIntensity;
      
      // Zero scattering on the night side (true physics of space)
      if (alpha <= 0.001) discard;

      gl_FragColor = vec4(scatterColor, clamp(alpha, 0.0, 0.95));
    }
  `},u={vertexShader:`
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform vec3 uStarColor;
    uniform vec3 uLimbColor;
    uniform float uTime;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    // Simple pseudo-random hash for solar plasma granulation
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    void main() {
      vec3 viewDir = vec3(0.0, 0.0, 1.0);
      float cosTheta = max(0.0, dot(vNormal, viewDir));

      // Astrophysical Eddington solar limb darkening
      float limbDarkening = 0.42 + 0.58 * pow(cosTheta, 0.72);

      // Flowing solar plasma granulation noise
      vec2 uvNoise = vUv * 36.0 + vec2(uTime * 0.04, uTime * 0.02);
      float gran = noise(uvNoise) * 0.14;

      vec3 finalColor = mix(uLimbColor, uStarColor, limbDarkening + gran);
      gl_FragColor = vec4(finalColor * 1.35, 1.0);
    }
  `};var c=e.i(72286);let p={earth:{map:"/textures/planets/earth_day_2k.jpg",normalMap:"/textures/planets/earth_normal_2k.jpg",specularMap:"/textures/planets/earth_specular_2k.jpg",cloudsMap:"/textures/planets/earth_clouds_1k.png"},moon:{map:"/textures/planets/moon_1k.jpg"},mars:{map:"/textures/planets/mars_1k.jpg"},jupiter:{map:"/textures/planets/jupiter_1k.jpg"},saturn:{map:"/textures/planets/saturn_1k.jpg",ringMap:"/textures/planets/saturn_ring.png"},venus:{map:"/textures/planets/venus_1k.jpg"},mercury:{map:"/textures/planets/mercury_1k.jpg"},sun:{map:"/textures/planets/sun_1k.jpg"},uranus:{map:"/textures/planets/uranus_1k.jpg",ringMap:"/textures/planets/uranus_ring.png"},neptune:{map:"/textures/planets/neptune_1k.jpg"},pluto:{map:"/textures/planets/pluto_1k.jpg"}},d=new Map,m=null;function h(e,t=!0){if(d.has(e))return d.get(e);let r=(!m&&(m=new a.H5),m).load(e,e=>{t&&(e.colorSpace=a.nj),e.anisotropy=8,e.needsUpdate=!0},void 0,()=>{});return t&&(r.colorSpace=a.nj),d.set(e,r),r}var f=e.i(55517);let g=new Map;e.s(["f",0,({data:e,parentPosition:s,elapsedDays:d,isSelected:m,onSelect:v,onPositionUpdate:M})=>{let x=(0,r.useRef)(null),w=(0,r.useRef)(null),y=(0,r.useRef)(null),j=(0,r.useRef)(null),b=(0,r.useRef)(null),S=(0,r.useRef)(0),P=(0,r.useMemo)(()=>{if(e.atmosphere&&e.atmosphereColor&&!e.emissive){let t="earth"===e.id?"#f97316":e.glowColor||"#ea580c";return function(e,t="#f97316",r=new a.cE(0,0,0),o=1){return new a.Zg({vertexShader:l.vertexShader,fragmentShader:l.fragmentShader,uniforms:{uSunPosition:{value:r},uAtmosphereColor:{value:new a.Es(e)},uSunsetTint:{value:new a.Es(t)},uAtmosphereScale:{value:1.05},uIntensity:{value:o}},blending:a.tq,side:a.tw,transparent:!0,depthWrite:!1})}(e.atmosphereColor,t,new a.cE(0,0,0),"earth"===e.id?1.15:.95)}return null},[e.atmosphere,e.atmosphereColor,e.glowColor,e.id,e.emissive]),C=(0,r.useMemo)(()=>{if(e.emissive){var t,r;let o=(t=e.color,r=e.glowColor||"#ff4500",new a.Zg({vertexShader:u.vertexShader,fragmentShader:u.fragmentShader,uniforms:{uStarColor:{value:new a.Es(t)},uLimbColor:{value:new a.Es(r)},uTime:{value:0}}}));return b.current=o,o}return null},[e.emissive,e.color,e.glowColor]),E=(0,r.useMemo)(()=>{let t=p[e.id];if(t)return{map:t.map?h(t.map,!0):null,normalMap:t.normalMap?h(t.normalMap,!1):null,specularMap:t.specularMap?h(t.specularMap,!1):null,cloudsMap:t.cloudsMap?h(t.cloudsMap,!0):null,ringMap:t.ringMap?h(t.ringMap,!0):null};if(!e.emissive){let t=e.hasRings||e.radius>2.2;return{map:function(e,t,r,o){let n=`${e}_${t}_${o}`;if(g.has(n))return g.get(n);if("u"<typeof document)return new a.Sk;let i=document.createElement("canvas");i.width=1024,i.height=512;let s=i.getContext("2d"),l=s.createImageData(1024,512),u=l.data,c=100*(0,f.l)(e)(),p=new a.Es(t),d=new a.Es(r),m=p.clone().multiplyScalar(.4),h=d.clone().lerp(new a.Es("#ffffff"),.4);function v(e,t,r){return(Math.sin(3.1*e+1.7*c)*Math.cos(3.1*t+2.3*c)+.5*Math.sin(6.2*e+4.1*t+3.1*c)*Math.cos(6.2*r+4.1*c)+.25*Math.sin(12.3*e+8.3*r+5.7*c)*Math.cos(12.3*t+7.9*c))/1.75}for(let e=0;e<512;e++){let t=(e/512-.5)*Math.PI,r=Math.sin(t),n=Math.cos(t);for(let i=0;i<1024;i++){let s=i/1024*Math.PI*2,l=n*Math.cos(s),c=n*Math.sin(s),d=0;if(o)d=(Math.sin(24*t+3.2*v(2*l,2*r,2*c))+1)/2;else{let e=v(l,r,c);e+=.5*v(2.4*l,2.4*r,2.4*c),e+=.25*v(5.1*l,5.1*r,5.1*c),d=Math.max(0,Math.min(1,(e+1.1)/2.2))}let f=new a.Es;d<.45?f.lerpColors(m,p,d/.45):f.lerpColors(p,h,(d-.45)/.55);let g=(1024*e+i)*4;u[g]=Math.round(255*f.r),u[g+1]=Math.round(255*f.g),u[g+2]=Math.round(255*f.b),u[g+3]=255}}s.putImageData(l,0,0);let M=new a.Nk(i);return M.colorSpace=a.nj,M.wrapS=a.FP,M.wrapT=a.Jr,M.generateMipmaps=!0,M.minFilter=a.Q4,M.magFilter=a.VV,M.anisotropy=8,g.set(n,M),M}(e.id,e.color,e.glowColor||"#38bdf8",t),normalMap:null,specularMap:null,cloudsMap:null,ringMap:null}}return null},[e.id,e.color,e.glowColor,e.hasRings,e.radius,e.emissive]);(0,o.f)((t,r)=>{if(S.current+=r,void 0!==d){let t=i(e,d),r=s?t.clone().add(s):t;x.current&&x.current.position.copy(r),M&&M(e.id,r)}if(w.current){let t=0!==e.rotationPeriodHours?2*Math.PI/(3600*Math.abs(e.rotationPeriodHours)):0;w.current.rotation.y+=(e.rotationPeriodHours<0?-1:1)*t*r*4320}y.current&&(y.current.rotation.y+=.028*r),b.current&&b.current.uniforms.uTime&&(b.current.uniforms.uTime.value=S.current),P&&x.current&&P.uniforms.uSunPosition.value.set(0,0,0)});let _=t=>{t.stopPropagation(),c.f.playTelemetryBeep(1200),v(e)};return(0,t.jsxs)("group",{ref:x,children:[(0,t.jsxs)("group",{rotation:[0,0,e.axialTiltDeg*Math.PI/180],children:[(0,t.jsxs)("mesh",{ref:w,onClick:_,castShadow:!e.emissive,receiveShadow:!e.emissive,children:[(0,t.jsx)("sphereGeometry",{args:[e.radius,64,64]}),e.emissive&&C?(0,t.jsx)("primitive",{object:C,attach:"material"}):(0,t.jsx)("meshStandardMaterial",{map:E?.map||void 0,color:E?.map?"#ffffff":e.color,normalMap:E?.normalMap||void 0,normalScale:E?.normalMap?new a.wq(.8,.8):void 0,roughnessMap:E?.specularMap||void 0,roughness:"earth"===e.id?.5:e.hasRings?.8:.72,metalness:"earth"===e.id?.15:.05})]}),"earth"===e.id&&(0,t.jsxs)("mesh",{ref:y,scale:[1.022,1.022,1.022],children:[(0,t.jsx)("sphereGeometry",{args:[e.radius,64,64]}),(0,t.jsx)("meshStandardMaterial",{map:E?.cloudsMap||void 0,alphaMap:E?.cloudsMap||void 0,transparent:!0,opacity:.85,roughness:.9,blending:a.F_,depthWrite:!1})]}),e.atmosphere&&P&&!e.emissive&&(0,t.jsx)("mesh",{material:P,children:(0,t.jsx)("sphereGeometry",{args:[1.06*e.radius,64,64]})}),e.hasRings&&(0,t.jsxs)("group",{ref:j,rotation:[Math.PI/2,0,0],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("ringGeometry",{args:[1.35*e.radius,2.05*e.radius,64]}),(0,t.jsx)("meshStandardMaterial",{map:E?.ringMap||void 0,color:E?.ringMap?"#ffffff":"#d4b76a",side:a.Vs,transparent:!0,opacity:.88,roughness:.7})]}),(0,t.jsxs)("mesh",{children:[(0,t.jsx)("ringGeometry",{args:[2.14*e.radius,2.55*e.radius,64]}),(0,t.jsx)("meshStandardMaterial",{map:E?.ringMap||void 0,color:E?.ringMap?"#ffffff":"#bfa254",side:a.Vs,transparent:!0,opacity:.55,roughness:.8})]})]})]}),(0,t.jsx)(n.f,{distanceFactor:45,position:[0,1.45*e.radius,0],center:!0,children:(0,t.jsxs)("div",{onClick:_,className:`cursor-pointer px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider transition-all select-none whitespace-nowrap flex items-center gap-1.5 backdrop-blur-md shadow-md ${m?"bg-hud-cyan text-space-950 font-bold border border-hud-cyan shadow-[0_0_15px_#00f3ff]":"bg-space-950/85 text-slate-200 border border-slate-700/80 hover:border-hud-cyan hover:text-white"}`,children:[e.emissive&&(0,t.jsx)("span",{className:"w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"}),"earth"===e.id&&(0,t.jsx)("span",{className:"text-[10px]",children:"🌍"}),(0,t.jsx)("span",{children:m?`[ TARGET: ${e.name.toUpperCase()} ]`:e.name})]})})]})}],27651);var v=a;e.s(["f",0,({body:e,parentPosition:a=new v.cE(0,0,0),isSelected:o=!1})=>{let n=(0,r.useMemo)(()=>s(e,180),[e]),i=(0,r.useMemo)(()=>0===n.length?null:new v.ld().setFromPoints(n),[n]);return i?(0,t.jsx)("group",{position:a,children:(0,t.jsx)("lineLoop",{geometry:i,children:(0,t.jsx)("lineBasicMaterial",{color:o?"#00f3ff":e.color,opacity:o?.75:.22,transparent:!0,linewidth:o?2:1})})}):null}],44930),e.s(["f",0,({count:e=6500})=>{let n=(0,r.useRef)(null),[i,s]=(0,r.useMemo)(()=>{let t=new Float32Array(3*e),r=new Float32Array(3*e),o=[new a.Es("#9bb0ff"),new a.Es("#bbccff"),new a.Es("#f8f9fa"),new a.Es("#fff4e8"),new a.Es("#ffd2a1"),new a.Es("#ffcc6f"),new a.Es("#cbd5e1")];for(let a=0;a<e;a++){let e=240+500*Math.random(),n=2*Math.PI*Math.random(),i=Math.acos(2*Math.random()-1);t[3*a]=e*Math.sin(i)*Math.cos(n),t[3*a+1]=e*Math.sin(i)*Math.sin(n),t[3*a+2]=e*Math.cos(i);let s=o[Math.floor(Math.random()*o.length)];r[3*a]=s.r,r[3*a+1]=s.g,r[3*a+2]=s.b}return[t,r]},[e]),[l,u]=(0,r.useMemo)(()=>{let e=new Float32Array(2550),t=new Float32Array(2550),r=[new a.Es("#0369a1"),new a.Es("#4338ca"),new a.Es("#701a75"),new a.Es("#0f172a")];for(let a=0;a<850;a++){let o=260+250*Math.random(),n=.8*Math.PI*(Math.random()-.5),i=.6*Math.PI*(Math.random()-.5);e[3*a]=o*Math.cos(n)*Math.sin(i),e[3*a+1]=o*Math.sin(n)*.6,e[3*a+2]=o*Math.cos(i)-80;let s=r[Math.floor(Math.random()*r.length)];t[3*a]=s.r,t[3*a+1]=s.g,t[3*a+2]=s.b}return[e,t]},[]),c=(0,r.useMemo)(()=>{let e=new a.ld;return e.setAttribute("position",new a.f5(i,3)),e.setAttribute("color",new a.f5(s,3)),e},[i,s]),p=(0,r.useMemo)(()=>{let e=new a.ld;return e.setAttribute("position",new a.f5(l,3)),e.setAttribute("color",new a.f5(u,3)),e},[l,u]);return(0,o.f)((e,t)=>{n.current&&(n.current.rotation.y+=.002*t)}),(0,t.jsxs)("group",{children:[(0,t.jsx)("points",{geometry:c,children:(0,t.jsx)("pointsMaterial",{size:.95,vertexColors:!0,transparent:!0,opacity:.88,sizeAttenuation:!0})}),(0,t.jsx)("group",{ref:n,children:(0,t.jsx)("points",{geometry:p,children:(0,t.jsx)("pointsMaterial",{size:20,vertexColors:!0,transparent:!0,opacity:.08,blending:a.tq,depthWrite:!1,sizeAttenuation:!0})})})]})}],46223)},18664,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(90072),o=e.i(75056),n=e.i(98903),i=e.i(30297),s=e.i(27651),l=e.i(44930),u=e.i(46223),c=e.i(46013);function p({system:e,selectedBodyId:o,onSelectBody:i,isFullJourney:u}){let d=(0,r.useRef)(null),m=(0,r.useRef)(0),h=e.bodies.filter(e=>!e.parentBodyId),f=e.bodies.filter(e=>!!e.parentBodyId),g=(0,r.useRef)({}),v=(0,r.useRef)({});return(0,n.f)((e,t)=>{m.current+=1.6*t;let r=m.current,o={};if(h.forEach(e=>{let t=(0,c.D)(e,r);o[e.id]=t;let a=g.current[e.id];a&&a.position.copy(t)}),f.forEach(e=>{let t=e.parentBodyId?o[e.parentBodyId]:void 0,a=(0,c.D)(e,r),n=t?a.clone().add(t):a,i=g.current[e.id];i&&i.position.copy(n);let s=v.current[e.id];s&&t&&s.position.copy(t)}),!u&&d.current){let t=.1*e.pointer.x,r=.06*e.pointer.y;d.current.rotation.y=a.rB.lerp(d.current.rotation.y,t+.08,.035),d.current.rotation.x=a.rB.lerp(d.current.rotation.x,-r-.28,.035)}}),(0,t.jsxs)("group",{ref:d,position:[0,-2,0],rotation:u?[0,0,0]:[-.32,.15,0],children:[(0,t.jsx)("pointLight",{position:[0,0,0],intensity:1050*e.star.coronaIntensity,color:e.star.colorHex,distance:2500,decay:1.15}),(0,t.jsx)("ambientLight",{intensity:.08,color:"#475569"}),h.filter(e=>"star"!==e.type).map(r=>(0,t.jsx)(l.f,{body:r,isSelected:o===r.id},`orbit-${e.id}-${r.id}`)),h.map(r=>(0,t.jsx)("group",{ref:e=>{g.current[r.id]=e},children:(0,t.jsx)(s.f,{data:r,isSelected:o===r.id,onSelect:e=>i?.(e)})},`${e.id}-${r.id}`)),f.map(r=>(0,t.jsx)("group",{ref:e=>{v.current[r.id]=e},children:(0,t.jsx)(l.f,{body:r,isSelected:o===r.id})},`moon-orbit-${e.id}-${r.id}`)),f.map(r=>(0,t.jsx)("group",{ref:e=>{g.current[r.id]=e},children:(0,t.jsx)(s.f,{data:r,isSelected:o===r.id,onSelect:e=>i?.(e)})},`${e.id}-${r.id}`))]})}e.s(["HeroCelestialHorizon",0,({system:e,selectedBodyId:n,onSelectBody:s,isWarping:l=!1,isFullJourney:c=!1})=>{let[d,m]=(0,r.useState)(!1);return((0,r.useEffect)(()=>{m(!0)},[]),d)?(0,t.jsxs)("div",{className:"absolute inset-0 z-0 select-none overflow-hidden pointer-events-auto cursor-grab active:cursor-grabbing","aria-label":"Interactive 3D Solar System simulation - drag to rotate, scroll to zoom",children:[(0,t.jsxs)(o.f,{camera:{position:c?[0,32,75]:[0,26,68],fov:45,near:.1,far:3500},dpr:[1,c?1.25:1.1],gl:{antialias:!1,toneMapping:a.c2,toneMappingExposure:1.35,powerPreference:"low-power",alpha:!0},children:[(0,t.jsx)(u.f,{count:c?5200:3200}),(0,t.jsx)(i.f,{makeDefault:!0,enableDamping:!0,dampingFactor:.06,minDistance:10,maxDistance:400,rotateSpeed:.75,zoomSpeed:.85,enableZoom:!0,panSpeed:.7,maxPolarAngle:Math.PI/2+.12}),(0,t.jsx)(p,{system:e,selectedBodyId:n,onSelectBody:s,isWarping:l,isFullJourney:c})]}),(0,t.jsx)("div",{className:"pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/35 to-transparent","aria-hidden":"true"})]}):(0,t.jsx)("div",{className:"absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-950/40 via-space-950/90 to-space-950","aria-hidden":"true"})}])},88314,function(e){e.n(e.i(18664))}]);