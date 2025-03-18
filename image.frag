#version 330 compatibility
uniform sampler2D uTexUnit;
in vec2 vST;

//Define variables for Texturing
ivec2 ires = textureSize( uTexUnit, 0 );
float ResS = float( ires.s );
float ResT = float( ires.t );

uniform float uTolerance;		//the tolerance of the edge detection

void
main( )
{
	vec3 irgb = texture( uTexUnit, vST ).rgb;


	const vec3 LUMCOEFFS = vec3( 0.2125,0.7154,0.0721 );
	
	vec2 stp0 = vec2(1./ResS, 0. );
	vec2 st0p = vec2(0. , 1./ResT);
	vec2 stpp = vec2(1./ResS, 1./ResT);
	vec2 stpm = vec2(1./ResS, -1./ResT);

	float i00 = dot( texture( uTexUnit, vST ).rgb , LUMCOEFFS );
	float im1m1 = dot( texture( uTexUnit, vST-stpp ).rgb, LUMCOEFFS );
	float ip1p1 = dot( texture( uTexUnit, vST+stpp ).rgb, LUMCOEFFS );
	float im1p1 = dot( texture( uTexUnit, vST-stpm ).rgb, LUMCOEFFS );
	float ip1m1 = dot( texture( uTexUnit, vST+stpm ).rgb, LUMCOEFFS );
	float im10 = dot( texture( uTexUnit, vST-stp0 ).rgb, LUMCOEFFS );
	float ip10 = dot( texture( uTexUnit, vST+stp0 ).rgb, LUMCOEFFS );
	float i0m1 = dot( texture( uTexUnit, vST-st0p ).rgb, LUMCOEFFS );
	float i0p1 = dot( texture( uTexUnit, vST+st0p ).rgb, LUMCOEFFS );

	float h = -1.*im1p1 - 2.*i0p1 - 1.*ip1p1 + 1.*im1m1 + 2.*i0m1 + 1.*ip1m1;
	float v = -1.*im1m1 - 2.*im10 - 1.*im1p1 + 1.*ip1m1 + 2.*ip10 + 1.*ip1p1;
	float mag = sqrt( h*h + v*v );

	vec3 target = vec3( mag,mag,mag );
	vec4 color = vec4( mix( irgb, target, uTolerance ), 1. );

	//Dont draw the quad/background of two-pass render
	if(color.rgb == 0){
		discard;
	}
	else{
		gl_FragColor = color;
	}
	

}