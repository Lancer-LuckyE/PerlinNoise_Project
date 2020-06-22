# PerlinNoise_Project
Implement a perlin noise wave with Three.js and webgl

Description of the project
	Perlin noise is an algorithm to create a gradient noise, which can generate noise according to the others neighbouring. In this project, a simple demo is developed to present a Perlin wave, with detail controls on the environment, model, and the camera. The Perlin wave is developed by Three.js and the Perlin.js class is referring to an external JavaScript source which is implemented by David Johnson [1]. In the demo of the Perlin wave, we create a plane with dynamically defining the width, breadth, and the segments of them. The Perlin.js class handles the construction of the Perlin noise. With these two working together, the wireframe of the Perlin wave can be created and animated. The controls of the model attributions is provided via dat.gui control panel, while the controls of the camera is via the OrbitControls in Three.js as well the dat.gui panel. In addition, for the lighting and material part, all attributes of the light can be adjusted by the user. WaterWav.jpg and water.jpg is loaded in the  mesh. This will make the entire object look more like real waves,because of the shininess effect of the lights, the waves are more realistic.

Controls:
	The OrbitControl.js from Three.js provides a mouse option to control the viewing of the scene.
1.	Holding the left click and drag: Rotation of the world view with a fixed pivot point.
2.	Holding the right click and drag: Translation of the world view and translation of the pivot point.
3.	Scroll up / down: Zoom in / out.
	The camera control folder provides all controls needed for camera:
1.	Switch camera: Switch cameras between perspective projection and orthographic projection.
2.	Horizontal / Vertical view: Rotate the camera in a horizontal / vertical direction.
3.	Camera distance:  Zoom in / out.
	The plane control folder contains all controls of the attributions of the plane:
1.	Plane width / breadth: Modify the width / breadth of the plane.
2.	X-Segment / Z-Segment: The segment number of the width / breadth.
3.	Noise_x, Noise_z: Number of crests and troughs in X / Z direction.
4.	Noise_Y: The amplitude of the wave.
5.	Speed: The waving speed.
	The lighting folder gethers all the lighting and material related controls:
1.	Opacity: The lower the value, the more transparent the object, and the more opaque it is.
2.	Transparent: Turn on / off the transparent of the texture.
3.	Ambient / diffuse / specular: The  ambient / diffuse / specular light color.
4.	Emissive: emissive light color
5.	Shininess: The strength of the light bouncing off the wave surface.
6.	Visible: The visibility of the model.
7.	Color: The color of the wave plane material.
Animation Switch: The switch to turn on / off the animation.
PointLight: The checkbox to turn on / off the spotlight.

Achievement: 
Experimenting with perlin noise in the vertex and fragment shaders, using WebGL with three.js. A lot of displacement mapping by using 3D noise in the vertex shader. First, random noise is generated on a plane. The place where the noise is generated will drive its surrounding planes to move in accordance with the noise function. In addition, users can change the horizontal and vertical movement of the camera to observe from different angles.The maximum and minimum values of noise can also be changed between certain values, such as (0-500) for X, (0-100) for Y and (0-500) for Z. The speed of animation also can be modified from 0.0025 to 0.1. Under the establishment of material coordinates, suitable mapping is also added. The additional adjustable lights and materials also make the entire noise wave look more realistic, making the entire animation look like real waves.

Steps to perform: 
There are two main methods to run this program.
1. Using firefox: You don’t have to set the server environment. Just open the firefox and type in the block about:config. Then the setting will be shown on the page. Find the security.fileuri.strict_origin_policy. The final step is to change this value to false. Then you can run this program with firefox. (perlinNoise.html)
2. Using Chrome or other browsers: You need to open the Command Line and find the path to the project location. Install the http server package via: npm-install http-server-g. Run the http server by typing in the command: http-server -c-1 . -p 8000. The c-1 option means always reload. With hosting the server, the project is able to run on Google Chrome at http://localhost:8000/. Find the path to the perlinNoise.html file and run it.

Reference:
[1] David, J (2018) Perlin Noise Mesh (THREE.js) (Version 1.0) [Source code]. https://codepen.io/struct/pen/eLPbrL
