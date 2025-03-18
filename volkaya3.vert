#version 330 compatibility

uniform float uAmp; // amplitude of sine wave
uniform float uFreq; // frequency of sine wave
uniform vec4  uAtmosphereColor; //color
uniform	vec4  uSurfaceColor;
out vec3 vAtmosphereColor;
out vec3 vSurfaceColor;
out float vX, vY;
out float vLightIntensity;

const vec3 LIGHTPOS = vec3( 0., 0., 10. ); // light position

void main( )
{
	vec3 tnorm = normalize( gl_NormalMatrix * gl_Normal );
	vec3 ECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;
	vLightIntensity = abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) );
	vAtmosphereColor = uAtmosphereColor.rgb;
	vSurfaceColor = uSurfaceColor.rgb;
	vec3 MCposition = gl_Vertex.xyz; // model coordinates
	vX = MCposition.x;
	vY = MCposition.y;
	vX = vX + uAmp * sin( uFreq * vY );
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}