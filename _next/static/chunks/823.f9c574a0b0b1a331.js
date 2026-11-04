"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[823],{2823:function(e,t,i){let n,r;i.r(t),i.d(t,{AtlasCanvas:function(){return W}});var a=i(7437),s=i(2265),o=i(9285),l=i(6496),d=i(1119),c=i(2079);let f=new c.ZzF,u=new c.Pa4;class p extends c.L5s{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new c.a$l([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new c.a$l([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new c.$TI(t,6,1);return this.setAttribute("instanceStart",new c.kB5(i,3,0)),this.setAttribute("instanceEnd",new c.kB5(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let n=new c.$TI(i,2*t,1);return this.setAttribute("instanceColorStart",new c.kB5(n,t,0)),this.setAttribute("instanceColorEnd",new c.kB5(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new c.Uk6(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new c.ZzF);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),f.setFromBufferAttribute(t),this.boundingBox.union(f))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new c.aLr),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let r=0,a=e.count;r<a;r++)u.fromBufferAttribute(e,r),n=Math.max(n,i.distanceToSquared(u)),u.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(u));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var h=i(1448);let m=parseInt(c.UZH.replace(/\D+/g,""));class v extends c.jyz{constructor(e){super({type:"LineMaterial",uniforms:c.rDY.clone(c.rDY.merge([h.UniformsLib.common,h.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new c.FM8(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
					#include <${m>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let y=m>=125?"uv1":"uv2",g=new c.Ltg,x=new c.Pa4,w=new c.Pa4,S=new c.Ltg,b=new c.Ltg,E=new c.Ltg,_=new c.Pa4,L=new c.yGw,A=new c.Zzh,z=new c.Pa4,M=new c.ZzF,j=new c.aLr,U=new c.Ltg;function P(e,t,i){return U.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),U.multiplyScalar(1/U.w),U.x=r/i.width,U.y=r/i.height,U.applyMatrix4(e.projectionMatrixInverse),U.multiplyScalar(1/U.w),Math.abs(Math.max(U.x,U.y))}class B extends c.Kj0{constructor(e=new p,t=new v({color:16777215*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let e=0,r=0,a=t.count;e<a;e++,r+=2)x.fromBufferAttribute(t,e),w.fromBufferAttribute(i,e),n[r]=0===r?0:n[r-1],n[r+1]=n[r]+x.distanceTo(w);let r=new c.$TI(n,2,1);return e.setAttribute("instanceDistanceStart",new c.kB5(r,1,0)),e.setAttribute("instanceDistanceEnd",new c.kB5(r,1,1)),this}raycast(e,t){let i,a;let s=this.material.worldUnits,o=e.camera;null!==o||s||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let l=void 0!==e.params.Line2&&e.params.Line2.threshold||0;n=e.ray;let d=this.matrixWorld,f=this.geometry,u=this.material;if(r=u.linewidth+l,null===f.boundingSphere&&f.computeBoundingSphere(),j.copy(f.boundingSphere).applyMatrix4(d),s)i=.5*r;else{let e=Math.max(o.near,j.distanceToPoint(n.origin));i=P(o,e,u.resolution)}if(j.radius+=i,!1!==n.intersectsSphere(j)){if(null===f.boundingBox&&f.computeBoundingBox(),M.copy(f.boundingBox).applyMatrix4(d),s)a=.5*r;else{let e=Math.max(o.near,M.distanceToPoint(n.origin));a=P(o,e,u.resolution)}M.expandByScalar(a),!1!==n.intersectsBox(M)&&(s?function(e,t){let i=e.matrixWorld,a=e.geometry,s=a.attributes.instanceStart,o=a.attributes.instanceEnd,l=Math.min(a.instanceCount,s.count);for(let a=0;a<l;a++){A.start.fromBufferAttribute(s,a),A.end.fromBufferAttribute(o,a),A.applyMatrix4(i);let l=new c.Pa4,d=new c.Pa4;n.distanceSqToSegment(A.start,A.end,d,l),d.distanceTo(l)<.5*r&&t.push({point:d,pointOnLine:l,distance:n.origin.distanceTo(d),object:e,face:null,faceIndex:a,uv:null,[y]:null})}}(this,t):function(e,t,i){let a=t.projectionMatrix,s=e.material.resolution,o=e.matrixWorld,l=e.geometry,d=l.attributes.instanceStart,f=l.attributes.instanceEnd,u=Math.min(l.instanceCount,d.count),p=-t.near;n.at(1,E),E.w=1,E.applyMatrix4(t.matrixWorldInverse),E.applyMatrix4(a),E.multiplyScalar(1/E.w),E.x*=s.x/2,E.y*=s.y/2,E.z=0,_.copy(E),L.multiplyMatrices(t.matrixWorldInverse,o);for(let t=0;t<u;t++){if(S.fromBufferAttribute(d,t),b.fromBufferAttribute(f,t),S.w=1,b.w=1,S.applyMatrix4(L),b.applyMatrix4(L),S.z>p&&b.z>p)continue;if(S.z>p){let e=S.z-b.z,t=(S.z-p)/e;S.lerp(b,t)}else if(b.z>p){let e=b.z-S.z,t=(b.z-p)/e;b.lerp(S,t)}S.applyMatrix4(a),b.applyMatrix4(a),S.multiplyScalar(1/S.w),b.multiplyScalar(1/b.w),S.x*=s.x/2,S.y*=s.y/2,b.x*=s.x/2,b.y*=s.y/2,A.start.copy(S),A.start.z=0,A.end.copy(b),A.end.z=0;let l=A.closestPointToPointParameter(_,!0);A.at(l,z);let u=c.M8C.lerp(S.z,b.z,l),h=u>=-1&&u<=1,m=_.distanceTo(z)<.5*r;if(h&&m){A.start.fromBufferAttribute(d,t),A.end.fromBufferAttribute(f,t),A.start.applyMatrix4(o),A.end.applyMatrix4(o);let r=new c.Pa4,a=new c.Pa4;n.distanceSqToSegment(A.start,A.end,a,r),i.push({point:a,pointOnLine:r,distance:n.origin.distanceTo(a),object:e,face:null,faceIndex:t,uv:null,[y]:null})}}}(this,o,t))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(g),this.material.uniforms.resolution.value.set(g.z,g.w))}}class C extends p{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,n=new Float32Array(2*i);if(3===t)for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];else for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5],n[2*r+6]=e[r+6],n[2*r+7]=e[r+7];return super.setColors(n,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class D extends B{constructor(e=new C,t=new v({color:16777215*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let O=s.forwardRef(function({points:e,color:t=16777215,vertexColors:i,linewidth:n,lineWidth:r,segments:a,dashed:l,...f},u){var h,m;let y=(0,o.D)(e=>e.size),g=s.useMemo(()=>a?new B:new D,[a]),[x]=s.useState(()=>new v),w=(null==i||null==(h=i[0])?void 0:h.length)===4?4:3,S=s.useMemo(()=>{let n=a?new p:new C,r=e.map(e=>{let t=Array.isArray(e);return e instanceof c.Pa4||e instanceof c.Ltg?[e.x,e.y,e.z]:e instanceof c.FM8?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(n.setPositions(r.flat()),i){t=16777215;let e=i.map(e=>e instanceof c.Ilk?e.toArray():e);n.setColors(e.flat(),w)}return n},[e,a,i,w]);return s.useLayoutEffect(()=>{g.computeLineDistances()},[e,g]),s.useLayoutEffect(()=>{l?x.defines.USE_DASH="":delete x.defines.USE_DASH,x.needsUpdate=!0},[l,x]),s.useEffect(()=>()=>{S.dispose(),x.dispose()},[S]),s.createElement("primitive",(0,d.Z)({object:g,ref:u},f),s.createElement("primitive",{object:S,attach:"geometry"}),s.createElement("primitive",(0,d.Z)({object:x,attach:"material",color:t,vertexColors:!!i,resolution:[y.width,y.height],linewidth:null!==(m=null!=n?n:r)&&void 0!==m?m:1,dashed:l,transparent:4===w},f)))});var T=i(8328),R=i(5903),I=i(4613),H=i(4519);let N=e=>{let{selectedId:t}=e,{camera:i,controls:n,size:r}=(0,o.D)(),a=(0,s.useRef)(!0),l=r.width<700,d=r.width/Math.max(r.height,1),f=Math.max(22,21/(2*Math.tan(c.M8C.degToRad(23))*d)),u=I.Td.find(e=>e.project.id===t),{desiredPosition:p,desiredTarget:h}=(0,s.useMemo)(()=>{if(!u)return{desiredPosition:new c.Pa4(0,.4,l?f:23),desiredTarget:new c.Pa4(0,0,0)};let[e,t,i]=u.anchor;return{desiredPosition:new c.Pa4(e,t+.8,i+(l?9.5:10.5)),desiredTarget:new c.Pa4(e,t,i)}},[u,l,f]);return(0,s.useEffect)(()=>{a.current=!0},[t,l,r.width,r.height]),(0,o.F)((e,t)=>{if(!a.current)return;let r=1-Math.exp(-(3.6*Math.min(t,.05)));i.position.lerp(p,r),(null==n?void 0:n.target)&&(n.target.lerp(h,r),n.update()),.06>i.position.distanceTo(p)&&(i.position.copy(p),a.current=!1)}),null},G=e=>{let{constellation:t,index:i,selectedId:n,reveal:r,onSelect:o}=e,l=n===t.project.id,d=!!(n&&!l),f=(0,s.useMemo)(()=>(0,H.C)(t.project.id,t.shape,t.commits.length+1,t.anchor),[t]),u=(0,s.useMemo)(()=>[{date:new Date(t.createdAt).getTime(),label:"Repository created"},...t.commits.map(e=>({date:new Date(e.date).getTime(),label:e.message}))],[t]).map(e=>e.date<=r),p=u.some(Boolean),h=l?"#d9ff63":"#f1efe7";return(0,a.jsxs)("group",{children:[(0,a.jsx)(O,{points:f.linePositions,color:h,lineWidth:l?1.15:.65,transparent:!0,opacity:d?.06:l?.5:p?.22:.05}),f.starPositions.map((e,i)=>{if(!u[i])return null;let n=0===i?.082:l?.06:.047;return(0,a.jsxs)("group",{position:e,children:[(0,a.jsxs)("mesh",{children:[(0,a.jsx)("sphereGeometry",{args:[n,10,10]}),(0,a.jsx)("meshBasicMaterial",{color:h,transparent:!0,opacity:d?.18:1})]}),l&&(0,a.jsxs)("mesh",{children:[(0,a.jsx)("sphereGeometry",{args:[3.4*n,10,10]}),(0,a.jsx)("meshBasicMaterial",{color:"#d9ff63",transparent:!0,opacity:.1,blending:c.WMw,depthWrite:!1})]})]},"".concat(t.project.id,"-").concat(i))}),(0,a.jsxs)("mesh",{position:t.anchor,onClick:e=>{e.stopPropagation(),o(t.project.id)},onPointerOver:()=>{document.body.style.cursor="pointer"},onPointerOut:()=>{document.body.style.cursor=""},children:[(0,a.jsx)("sphereGeometry",{args:[2.45,16,16]}),(0,a.jsx)("meshBasicMaterial",{transparent:!0,opacity:0,depthWrite:!1})]}),(0,a.jsx)(T.V,{center:!0,position:f.labelPosition,zIndexRange:[15,0],style:{pointerEvents:"none",opacity:d?.18:l?1:p?.54:.14},children:(0,a.jsxs)("div",{className:"whitespace-nowrap border-l pl-2 font-mono text-[8px] font-semibold uppercase tracking-[0.16em] ".concat(l?"border-signal text-signal":"border-paper/40 text-paper/80"),children:[(0,a.jsxs)("span",{className:"mr-1.5 text-paper/35",children:["0",i+1]}),t.shortTitle]})})]})},k=()=>{let e=(0,s.useRef)(null);return(0,o.F)((t,i)=>{e.current&&(e.current.rotation.y+=.075*i,e.current.rotation.x=.035*Math.sin(.16*t.clock.elapsedTime))}),(0,a.jsxs)("group",{position:[0,-.8,0],children:[(0,a.jsxs)("group",{ref:e,children:[(0,a.jsxs)("mesh",{children:[(0,a.jsx)("sphereGeometry",{args:[.88,36,28]}),(0,a.jsx)("meshBasicMaterial",{color:"#163c43"})]}),(0,a.jsxs)("mesh",{children:[(0,a.jsx)("sphereGeometry",{args:[.895,28,20]}),(0,a.jsx)("meshBasicMaterial",{color:"#a6e5d1",wireframe:!0,transparent:!0,opacity:.2})]}),(0,a.jsxs)("mesh",{rotation:[.42,.1,-.22],children:[(0,a.jsx)("torusGeometry",{args:[1.18,.009,6,120]}),(0,a.jsx)("meshBasicMaterial",{color:"#d9ff63",transparent:!0,opacity:.55})]}),(0,a.jsxs)("mesh",{rotation:[-.68,.35,.4],children:[(0,a.jsx)("torusGeometry",{args:[1.34,.004,4,120]}),(0,a.jsx)("meshBasicMaterial",{color:"#f1efe7",transparent:!0,opacity:.28})]})]}),(0,a.jsx)(T.V,{center:!0,position:[0,-1.42,0],zIndexRange:[10,0],children:(0,a.jsx)("div",{className:"whitespace-nowrap border border-signal/25 bg-ink/75 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.18em] text-signal",children:"Origin / Bezaleel"})})]})},F=e=>{let{selectedId:t,reveal:i,onSelect:n}=e;return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(N,{selectedId:t}),(0,a.jsx)(k,{}),(0,a.jsx)(R.z,{makeDefault:!0,enablePan:!1,enableDamping:!0,dampingFactor:.075,rotateSpeed:.42,zoomSpeed:.65,minDistance:7,maxDistance:34}),I.Td.map((e,r)=>(0,a.jsx)(G,{constellation:e,index:r,selectedId:t,reveal:i,onSelect:n},e.project.id))]})},W=e=>(0,a.jsx)(l.Xz,{camera:{position:[0,.6,23],fov:46,near:.1,far:100},dpr:[1,1.25],gl:{antialias:!0,alpha:!0,powerPreference:"low-power"},onPointerMissed:()=>e.onSelect(null),"aria-hidden":"true",style:{background:"transparent"},children:(0,a.jsx)(F,{...e})})}}]);