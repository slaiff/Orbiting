#version 330 compatibility

uniform float uA;
uniform float uP;
uniform float uTol;

uniform float   uNoiseFreq;         //frequency 
uniform float   uNoiseAmp;          //amplitude
uniform sampler3D Noise3;           //GLMan Built-in noise texture (and already built into our broader program for us, defining it in here for use)

in float    vX, vY;
in vec3     vAtmosphereColor;
in vec3     vSurfaceColor;
in float    vLightIntensity;

const vec3 GREEN = vec3( 0.3, 0.7, 0.5 );
void main( ) {

	//Add Noise to our x and y coords -> then plug in (lying about where we are, by noising it)
    
    vec4 nv = texture( Noise3, uNoiseFreq * vec3(vX,vY,0)); //calling the texture function, "sampling" the noise texture
                                                            //pass in the built-in 'Noise3' texture (houses noise values),
                                                            //Using X and Y coords of the fragment.

    float noise = nv.r + nv.g + nv.b + nv.a;     //sum of our noise values
    noise = noise - 2;                           //changing range of the noise to -1 to 1
    noise = noise * uNoiseAmp;                   //noise is ALWAYS some value, but we want it to only be noisy IF toggled in GLman, how?
                                                 //by multiplying against uNoiseAmp, if it's 0 (default), noise is 0, otherwise, hell breaks loose!

	float f = fract(uA*vX * noise);           
	float t = smoothstep( 0.5-uP-uTol, 0.5-uP+uTol, f ) - smoothstep( 0.5+uP-uTol, 0.5+uP+uTol, f );
    vec3 rgb = vLightIntensity * mix( vSurfaceColor, vAtmosphereColor, t );   //if t==0, frag is GREEN, if t==1 frag will be painted XColor. Inbetween? A blend of both.
	gl_FragColor = vec4( rgb, 1. );
}