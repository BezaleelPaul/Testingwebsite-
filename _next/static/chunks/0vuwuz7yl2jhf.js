(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,39823,e=>{"use strict";let t,i;var n=e.i(43476),r=e.i(71645),s=e.i(75056),a=e.i(98903),o=e.i(38408),l=e.i(60099),d=e.i(31067),c=e.i(90072),f=c,u=c;let p=new u.VQ,h=new u.cE;class m extends u.Kx{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new u.ki([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new u.ki([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new u.hC(t,6,1);return this.setAttribute("instanceStart",new u.Zq(i,3,0)),this.setAttribute("instanceEnd",new u.Zq(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let n=new u.hC(i,2*t,1);return this.setAttribute("instanceColorStart",new u.Zq(n,t,0)),this.setAttribute("instanceColorEnd",new u.Zq(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new u.nw(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new u.VQ);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),p.setFromBufferAttribute(t),this.boundingBox.union(p))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new u.L0),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let r=0,s=e.count;r<s;r++)h.fromBufferAttribute(e,r),n=Math.max(n,i.distanceToSquared(h)),h.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(h));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var v=c,y=e.i(8560);let g=parseInt(c.Tu.replace(/\D+/g,""));class x extends v.Zg{constructor(e){super({type:"LineMaterial",uniforms:v.SP.clone(v.SP.merge([y.O.common,y.O.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new v.wq(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${g>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let w=g>=125?"uv1":"uv2",S=new f.$i,b=new f.cE,E=new f.cE,_=new f.$i,A=new f.$i,L=new f.$i,j=new f.cE,z=new f.nd,M=new f._i,U=new f.cE,O=new f.VQ,B=new f.L0,C=new f.$i;function P(e,t,n){return C.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),C.multiplyScalar(1/C.w),C.x=i/n.width,C.y=i/n.height,C.applyMatrix4(e.projectionMatrixInverse),C.multiplyScalar(1/C.w),Math.abs(Math.max(C.x,C.y))}class D extends f.kE{constructor(e=new m,t=new x({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let e=0,r=0,s=t.count;e<s;e++,r+=2)b.fromBufferAttribute(t,e),E.fromBufferAttribute(i,e),n[r]=0===r?0:n[r-1],n[r+1]=n[r]+b.distanceTo(E);let r=new f.hC(n,2,1);return e.setAttribute("instanceDistanceStart",new f.Zq(r,1,0)),e.setAttribute("instanceDistanceEnd",new f.Zq(r,1,1)),this}raycast(e,n){let r,s,a=this.material.worldUnits,o=e.camera;null!==o||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let l=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let d=this.matrixWorld,c=this.geometry,u=this.material;if(i=u.linewidth+l,null===c.boundingSphere&&c.computeBoundingSphere(),B.copy(c.boundingSphere).applyMatrix4(d),a)r=.5*i;else{let e=Math.max(o.near,B.distanceToPoint(t.origin));r=P(o,e,u.resolution)}if(B.radius+=r,!1!==t.intersectsSphere(B)){if(null===c.boundingBox&&c.computeBoundingBox(),O.copy(c.boundingBox).applyMatrix4(d),a)s=.5*i;else{let e=Math.max(o.near,O.distanceToPoint(t.origin));s=P(o,e,u.resolution)}O.expandByScalar(s),!1!==t.intersectsBox(O)&&(a?function(e,n){let r=e.matrixWorld,s=e.geometry,a=s.attributes.instanceStart,o=s.attributes.instanceEnd,l=Math.min(s.instanceCount,a.count);for(let s=0;s<l;s++){M.start.fromBufferAttribute(a,s),M.end.fromBufferAttribute(o,s),M.applyMatrix4(r);let l=new f.cE,d=new f.cE;t.distanceSqToSegment(M.start,M.end,d,l),d.distanceTo(l)<.5*i&&n.push({point:d,pointOnLine:l,distance:t.origin.distanceTo(d),object:e,face:null,faceIndex:s,uv:null,[w]:null})}}(this,n):function(e,n,r){let s=n.projectionMatrix,a=e.material.resolution,o=e.matrixWorld,l=e.geometry,d=l.attributes.instanceStart,c=l.attributes.instanceEnd,u=Math.min(l.instanceCount,d.count),p=-n.near;t.at(1,L),L.w=1,L.applyMatrix4(n.matrixWorldInverse),L.applyMatrix4(s),L.multiplyScalar(1/L.w),L.x*=a.x/2,L.y*=a.y/2,L.z=0,j.copy(L),z.multiplyMatrices(n.matrixWorldInverse,o);for(let n=0;n<u;n++){if(_.fromBufferAttribute(d,n),A.fromBufferAttribute(c,n),_.w=1,A.w=1,_.applyMatrix4(z),A.applyMatrix4(z),_.z>p&&A.z>p)continue;if(_.z>p){let e=_.z-A.z,t=(_.z-p)/e;_.lerp(A,t)}else if(A.z>p){let e=A.z-_.z,t=(A.z-p)/e;A.lerp(_,t)}_.applyMatrix4(s),A.applyMatrix4(s),_.multiplyScalar(1/_.w),A.multiplyScalar(1/A.w),_.x*=a.x/2,_.y*=a.y/2,A.x*=a.x/2,A.y*=a.y/2,M.start.copy(_),M.start.z=0,M.end.copy(A),M.end.z=0;let l=M.closestPointToPointParameter(j,!0);M.at(l,U);let u=f.rB.lerp(_.z,A.z,l),h=u>=-1&&u<=1,m=j.distanceTo(U)<.5*i;if(h&&m){M.start.fromBufferAttribute(d,n),M.end.fromBufferAttribute(c,n),M.start.applyMatrix4(o),M.end.applyMatrix4(o);let i=new f.cE,s=new f.cE;t.distanceSqToSegment(M.start,M.end,s,i),r.push({point:s,pointOnLine:i,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:n,uv:null,[w]:null})}}}(this,o,n))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(S),this.material.uniforms.resolution.value.set(S.z,S.w))}}class T extends m{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,n=new Float32Array(2*i);if(3===t)for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];else for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5],n[2*r+6]=e[r+6],n[2*r+7]=e[r+7];return super.setColors(n,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class R extends D{constructor(e=new T,t=new x({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let H=r.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:n,lineWidth:s,segments:a,dashed:l,...f},u){var p,h;let v=(0,o.f)(e=>e.size),y=r.useMemo(()=>a?new D:new R,[a]),[g]=r.useState(()=>new x),w=(null==i||null==(p=i[0])?void 0:p.length)===4?4:3,S=r.useMemo(()=>{let n=a?new m:new T,r=e.map(e=>{let t=Array.isArray(e);return e instanceof c.cE||e instanceof c.$i?[e.x,e.y,e.z]:e instanceof c.wq?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(n.setPositions(r.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof c.Es?e.toArray():e);n.setColors(e.flat(),w)}return n},[e,a,i,w]);return r.useLayoutEffect(()=>{y.computeLineDistances()},[e,y]),r.useLayoutEffect(()=>{l?g.defines.USE_DASH="":delete g.defines.USE_DASH,g.needsUpdate=!0},[l,g]),r.useEffect(()=>()=>{S.dispose(),g.dispose()},[S]),r.createElement("primitive",(0,d.f)({object:y,ref:u},f),r.createElement("primitive",{object:S,attach:"geometry"}),r.createElement("primitive",(0,d.f)({object:g,attach:"material",color:t,vertexColors:!!i,resolution:[v.width,v.height],linewidth:null!=(h=null!=n?n:s)?h:1,dashed:l,transparent:4===w},f)))});var I=e.i(30297),N=e.i(81214),G=e.i(90881);let W=({selectedId:e})=>{let{camera:t,controls:i,size:n}=(0,o.f)(),s=(0,r.useRef)(!0),l=n.width<700,d=n.width/Math.max(n.height,1),f=Math.max(22,21/(2*Math.tan(c.rB.degToRad(23))*d)),u=N.l.find(t=>t.project.id===e),{desiredPosition:p,desiredTarget:h}=(0,r.useMemo)(()=>{if(!u)return{desiredPosition:new c.cE(0,.4,l?f:23),desiredTarget:new c.cE(0,0,0)};let[e,t,i]=u.anchor;return{desiredPosition:new c.cE(e,t+.8,i+(l?9.5:10.5)),desiredTarget:new c.cE(e,t,i)}},[u,l,f]);return(0,r.useEffect)(()=>{s.current=!0},[e,l,n.width,n.height]),(0,a.f)((e,n)=>{if(!s.current)return;let r=1-Math.exp(-(3.6*Math.min(n,.05)));t.position.lerp(p,r),i?.target&&(i.target.lerp(h,r),i.update()),.06>t.position.distanceTo(p)&&(t.position.copy(p),s.current=!1)}),null},q=({constellation:e,index:t,selectedId:i,reveal:s,onSelect:a})=>{let o=i===e.project.id,d=!!(i&&!o),f=(0,r.useMemo)(()=>(0,G.f)(e.project.id,e.shape,e.commits.length+1,e.anchor),[e]),u=(0,r.useMemo)(()=>[{date:new Date(e.createdAt).getTime(),label:"Repository created"},...e.commits.map(e=>({date:new Date(e.date).getTime(),label:e.message}))],[e]).map(e=>e.date<=s),p=u.some(Boolean),h=o?"#d9ff63":"#f1efe7";return(0,n.jsxs)("group",{children:[(0,n.jsx)(H,{points:f.linePositions,color:h,lineWidth:o?1.15:.65,transparent:!0,opacity:d?.06:o?.5:p?.22:.05}),f.starPositions.map((t,i)=>{if(!u[i])return null;let r=0===i?.082:o?.06:.047;return(0,n.jsxs)("group",{position:t,children:[(0,n.jsxs)("mesh",{children:[(0,n.jsx)("sphereGeometry",{args:[r,10,10]}),(0,n.jsx)("meshBasicMaterial",{color:h,transparent:!0,opacity:d?.18:1})]}),o&&(0,n.jsxs)("mesh",{children:[(0,n.jsx)("sphereGeometry",{args:[3.4*r,10,10]}),(0,n.jsx)("meshBasicMaterial",{color:"#d9ff63",transparent:!0,opacity:.1,blending:c.tq,depthWrite:!1})]})]},`${e.project.id}-${i}`)}),(0,n.jsxs)("mesh",{position:e.anchor,onClick:t=>{t.stopPropagation(),a(e.project.id)},onPointerOver:()=>{document.body.style.cursor="pointer"},onPointerOut:()=>{document.body.style.cursor=""},children:[(0,n.jsx)("sphereGeometry",{args:[2.45,16,16]}),(0,n.jsx)("meshBasicMaterial",{transparent:!0,opacity:0,depthWrite:!1})]}),(0,n.jsx)(l.f,{center:!0,position:f.labelPosition,zIndexRange:[15,0],style:{pointerEvents:"none",opacity:d?.18:o?1:p?.54:.14},children:(0,n.jsxs)("div",{className:`whitespace-nowrap border-l pl-2 font-mono text-[8px] font-semibold uppercase tracking-[0.16em] ${o?"border-signal text-signal":"border-paper/40 text-paper/80"}`,children:[(0,n.jsxs)("span",{className:"mr-1.5 text-paper/35",children:["0",t+1]}),e.shortTitle]})})]})},F=()=>{let e=(0,r.useRef)(null),t=(0,r.useRef)(0);return(0,a.f)((i,n)=>{t.current+=n,e.current&&(e.current.rotation.y+=.075*n,e.current.rotation.x=.035*Math.sin(.16*t.current))}),(0,n.jsxs)("group",{position:[0,-.8,0],children:[(0,n.jsxs)("group",{ref:e,children:[(0,n.jsxs)("mesh",{children:[(0,n.jsx)("sphereGeometry",{args:[.88,36,28]}),(0,n.jsx)("meshBasicMaterial",{color:"#163c43"})]}),(0,n.jsxs)("mesh",{children:[(0,n.jsx)("sphereGeometry",{args:[.895,28,20]}),(0,n.jsx)("meshBasicMaterial",{color:"#a6e5d1",wireframe:!0,transparent:!0,opacity:.2})]}),(0,n.jsxs)("mesh",{rotation:[.42,.1,-.22],children:[(0,n.jsx)("torusGeometry",{args:[1.18,.009,6,120]}),(0,n.jsx)("meshBasicMaterial",{color:"#d9ff63",transparent:!0,opacity:.55})]}),(0,n.jsxs)("mesh",{rotation:[-.68,.35,.4],children:[(0,n.jsx)("torusGeometry",{args:[1.34,.004,4,120]}),(0,n.jsx)("meshBasicMaterial",{color:"#f1efe7",transparent:!0,opacity:.28})]})]}),(0,n.jsx)(l.f,{center:!0,position:[0,-1.42,0],zIndexRange:[10,0],children:(0,n.jsx)("div",{className:"whitespace-nowrap border border-signal/25 bg-ink/75 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.18em] text-signal",children:"Origin / Bezaleel"})})]})},V=({selectedId:e,reveal:t,onSelect:i})=>(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(W,{selectedId:e}),(0,n.jsx)(F,{}),(0,n.jsx)(I.f,{makeDefault:!0,enablePan:!1,enableDamping:!0,dampingFactor:.075,rotateSpeed:.42,zoomSpeed:.65,minDistance:7,maxDistance:34}),N.l.map((r,s)=>(0,n.jsx)(q,{constellation:r,index:s,selectedId:e,reveal:t,onSelect:i},r.project.id))]});e.s(["AtlasCanvas",0,e=>(0,n.jsx)(s.f,{camera:{position:[0,.6,23],fov:46,near:.1,far:100},dpr:[1,1.1],gl:{antialias:!1,alpha:!0,powerPreference:"low-power"},onPointerMissed:()=>e.onSelect(null),"aria-hidden":"true",style:{background:"transparent"},children:(0,n.jsx)(V,{...e})})],39823)},80220,function(e){e.n(e.i(39823))}]);