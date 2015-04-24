#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec2 fragCoord;

uniform vec3      iResolution;           // viewport resolution (in pixels)
uniform float     iGlobalTime;           // shader playback time (in seconds)
uniform float     iChannelTime[4];       // channel playback time (in seconds)
uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
// uniform samplerXX iChannel0..3;          // input channel. XX = 2D/Cube
uniform vec4      iDate;                 // (year, month, day, time in seconds)
uniform float     iSampleRate;      
uniform vec3 color;

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) - 
          smoothstep( pct, pct+0.02, st.y);
}

int imod(int a, int b)
{
  return a - a / b * b;
}
int xor(int a, int b)
{
  int result = 0;
  int x = 1;
  for(int i = 0; i <= 8; ++i)
    {
        if (imod(a,2) != imod(b,2))
            result += x;
        a /= 2;
        b /= 2;
        x *= 2;
  }
  return result;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;

    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 xy = uv * vec2(320.0,200.0);
    float z;
    vec2 dist;
    // for(int i = 0; i < 100 ; ++i) // originally 256
    for(int i = 0; i < 140 ; ++i)
    {
    z = float(i) / 255.0;
    dist = (xy - vec2(160.0,100.0)) * z;    
    z = mod(z + u_time/4.0, 1.0);
    dist.x += sin(u_time*3.14)*15.0;   
    int zz = int(z * 2.0);
    if (zz == 0) dist.x -= 10.0;
    else dist.x += 10.0;    
    if ( (abs(dist.x) >= 25.0 && (imod(int(z*8.0),2)==0)) || abs(dist.y) >= 16.0)
            break;
    }
  //   // Smooth interpolation between 0.1 and 0.9
  //   float y = smoothstep(0.1,0.9,st.x);

  //   vec3 color = vec3(y);
    
  //   float pct = plot(st,y);
    // color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);
      int texel = xor(xor(int(dist.x), int(dist.y)), int(mod(z, 0.25)*255.0));
    texel = imod(texel, 16);
    float c = float(texel) / 16.0;
  // gl_FragColor = vec4(c,c,c,1.0);
  // gl_FragColor = vec4(z,z,z,1.0);
  // gl_FragColor = vec4(c/z,z,z/c,1.0);
  // gl_FragColor = vec4(dist.x*c/z,z,z/c,1.0);
  // gl_FragColor = vec4(c/z*u_time*.5,z/c,z/c,1.0);
  // gl_FragColor = vec4(c/z*u_time*.5,z/c*u_time*0.3,z/c,1.0);
    // gl_FragColor = vec4(z/c*u_time*.5,z/c*u_time*0.3,c/z,0.5);
    // gl_FragColor = vec4(z/c*u_time*.5,c/z*u_time*0.3,c/z,0.5);
    // gl_FragColor = vec4(z/c*.6,c/z*u_time*0.3,c/z,0.5);
  // gl_FragColor = vec4(z/c*u_time/.10,c/z*0.3,c/z,0.5);
// gl_FragColor = vec4(z/c*u_time/.10,c/c/z*0.3,c/z,0.5);
gl_FragColor = vec4(z/c*u_time/.10/.4,c/c/z*0.3,c,0.5);
// gl_FragColor = vec4(c/z*u_time/.10/.4,c/c/z*0.4,c,0.9);
// gl_FragColor = vec4(color,1.0);
}