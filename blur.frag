#version 330 compatibility
uniform sampler2D uTexUnit;
in vec2 vST;

//Define variables for Texturing
ivec2 ires = textureSize( uTexUnit, 0 );
float ResS = float( ires.s );
float ResT = float( ires.t );

uniform float uBlurTol;		//the tolerance of the blur

void
main( )
{
	vec3 irgb = texture(uTexUnit, vST).rgb;

	vec2 stp0 = vec2(1./ResS, 0. );
	vec2 st0p = vec2(0. , 1./ResT);
	vec2 stpp = vec2(1./ResS, 1./ResT);
	vec2 stpm = vec2(1./ResS, -1./ResT);

	//3x3 matrix
	vec3 i00 = texture( uTexUnit, vST ).rgb;
	vec3 im1m1 = texture( uTexUnit, vST-stpp ).rgb;
	vec3 ip1p1 = texture( uTexUnit, vST+stpp ).rgb;
	vec3 im1p1 = texture( uTexUnit, vST-stpm ).rgb;
	vec3 ip1m1 = texture( uTexUnit, vST+stpm ).rgb;
	vec3 im10 = texture( uTexUnit, vST-stp0 ).rgb;
	vec3 ip10 = texture( uTexUnit, vST+stp0 ).rgb;
	vec3 i0m1 = texture( uTexUnit, vST-st0p ).rgb;
	vec3 i0p1 = texture( uTexUnit, vST+st0p ).rgb;

	vec3 blur = vec3(0.,0.,0.);
	blur += 1.*(im1m1+ip1m1+ip1p1+im1p1);
	blur += 2.*(im10+ip10+i0m1+i0p1);
	blur += 4.*(i00);
	blur /= 16.;


	vec4 color = vec4(mix(irgb,blur, uBlurTol), 1. );

	//Dont draw the quad/background of two-pass render
	if(color.rgb == 0){
		discard;
	}
	else{
		gl_FragColor = color;
	}
	

}