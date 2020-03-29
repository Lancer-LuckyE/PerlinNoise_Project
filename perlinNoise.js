let scene, camera, renderer;
let geometry, meshMaterial, plane;
let length = 1200;
let breadth = 1200;
let camDistance = 1500;
let t = 0;
let animationOn = true;
let speed = 0.0025;
let noise_x = 1000;
let noise_z = 1000;
let noise_y = 100;
let widthSeg = 100;
let heightSeg = 100;
let perlin = new Perlin();
const origin = new THREE.Vector3(0, 0, 0);

function init() {
	// Check if WebGL is available see Three/examples
	// No need for webgl2 here - change as appropriate
	if (THREE.WEBGL.isWebGLAvailable() === false) {
		// if not print error on console and exit
		document.body.appendChild(THREE.WEBGL.getWebGLErrorMessage());
	}
	// add our rendering surface and initialize the renderer
	let container = document.createElement('div');
	document.body.appendChild(container);
	// WebGL2 examples suggest we need a canvas
	// canvas = document.createElement( 'canvas' );
	// let context = canvas.getContext( 'webgl2' );
	// let renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );

	// create scene instance
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer({antialias: true});
	// set some state - here just clear color
	renderer.setClearColor(new THREE.Color(0xffffff));
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	// add the output of the renderer to the html element
	container.appendChild(renderer.domElement);
	//add a axes helper
	let axes = new THREE.AxesHelper(10000);
	scene.add(axes);


	// need a camera to look at the object
	// calculate aspectRatio
	let aspectRatio = window.innerWidth / window.innerHeight;
	// camera
	camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 10000);
	camera.position.z = camDistance;
	camera.lookAt(origin);
	//texture loader
	var texture = new THREE.TextureLoader().load("water.jpg");
	var texturenormal = new THREE.TextureLoader().load("WaterWav.jpg");

	//This defines how the texture is wrapped vertically and corresponds to V in UV mapping.
	//one time the texture is repeated across the surface
	//https://threejs.org/docs/#api/en/textures/Texture.repeat
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(1, 1);
	texturenormal.wrapS = texturenormal.wrapT = THREE.RepeatWrapping;
	texturenormal.repeat.set(1, 1);
	// create geometry
	plane = initPlaneModel(length, breadth, widthSeg, heightSeg, texture, texturenormal);
	scene.add(plane);

	controls = new THREE.OrbitControls(camera, renderer.domElement);

	let datControls = new function() {
		// camera options
		this.cameraType = "Perspective";
		this.vertical_view = 0;
		this.horizontal_view = 0;
		this.camDistance = 1500;
		// mesh options
		this.length = 1200;
		this.breadth = 1200;
		this.widthSeg = 100;
		this.heightSeg = 100;
		this.noise_x = 1000;
		this.noise_y = 100;
		this.noise_z = 1000;
		this.speed = 0.0025;

		this.onSwitchCamera = function () {
			let camPos = camera.position.copy(camera.position);
			if (camera instanceof THREE.PerspectiveCamera) {
				camera = new THREE.OrthographicCamera(-window.innerWidth / 2.0, window.innerWidth / 2.0,
					window.innerHeight / 2.0, -window.innerHeight / 2.0, 0.1, 10000);
				camera.position.set(camPos.x, camPos.y, camPos.z);
				camera.lookAt(origin);
				this.cameraType = 'Orthographic';
			} else {
				camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 10000);
				camera.position.set(camPos.x, camPos.y, camPos.z);
				camera.lookAt(origin);
				this.cameraType = 'Perspective';
			}
			camera.updateProjectionMatrix();
		};

		this.cameraZooming = function () {
			if (camDistance) {
				camDistance = datControls.camDistance;
				datControls.rotateViwingAngle();
			}
		};

		this.rotateViwingAngle = function () {
			let x = camDistance * Math.cos((datControls.vertical_view * Math.PI) / 180) * Math.sin((datControls.horizontal_view * Math.PI) / 180);
			let y = camDistance * Math.sin((datControls.vertical_view * Math.PI) / 180);
			let z = camDistance * Math.cos((datControls.vertical_view * Math.PI) / 180) * Math.cos((datControls.horizontal_view * Math.PI) / 180);
			camera.position.set(x, y, z);
			camera.lookAt(origin);
		};

		this.onSegmentChange = function () {
			scene.remove(plane);
			plane = initPlaneModel(datControls.length, datControls.breadth, datControls.widthSeg, datControls.heightSeg, texture, texturenormal);
			scene.add(plane);
			updateVertices(plane, noise_x, noise_y, noise_z);
			camera.updateProjectionMatrix();
		};

		this.update = function () {
			if (noise_x) {
				noise_x = datControls.noise_x;
			}
			if (noise_y) {
				noise_y = datControls.noise_y;
			}
			if (noise_z) {
				noise_z = datControls.noise_z;
			}
			if (speed) {
				speed = datControls.speed;
			}
			updateVertices(plane, noise_x, noise_y, noise_z);
			camera.updateProjectionMatrix();
		};

		this.animationOn = function () {
			if (animationOn) {
				animationOn = false;
			} else {
				animationOn = true;
			}
		};

	};

	let gui = new dat.GUI({width:300});
	let folder1 = gui.addFolder('Camera controls');
	let folder2 = gui.addFolder('Plane Controls');

	folder1.add(datControls, 'onSwitchCamera').name("Switch Camera");
	folder1.add(datControls, 'cameraType').name("Camera type").listen();
	folder1.add(datControls, 'horizontal_view', 0, 360).name("Horizontal view").onChange(datControls.rotateViwingAngle);
	folder1.add(datControls, 'vertical_view', 0, 180).name("Vertical view").onChange(datControls.rotateViwingAngle);
	folder1.add(datControls, 'camDistance', 200, 3000).name("Camera Distance").onChange(datControls.cameraZooming);

	gui.add(datControls, 'animationOn').name("Animation Switch");

	folder2.add(datControls, 'length', 500, 2800).name("Plane width").onChange(datControls.onSegmentChange);
	folder2.add(datControls, 'breadth', 500, 2800).name("Plane breadth").onChange(datControls.onSegmentChange);
	folder2.add(datControls, 'widthSeg', 10, 250).name("X Segment").onChange(datControls.onSegmentChange);
	folder2.add(datControls, 'heightSeg', 10, 250).name("Z Segment").onChange(datControls.onSegmentChange);
	folder2.add(datControls, 'noise_x', 500, 1000).onChange(datControls.update);
	folder2.add(datControls, 'noise_y', 100, 500).onChange(datControls.update);
	folder2.add(datControls, 'noise_z', 500, 1000).onChange(datControls.update);
	folder2.add(datControls, 'speed', 0.0025, 0.1).onChange(datControls.update);

	var ambient = new THREE.AmbientLight(0x888888);
	scene.add(ambient); //Adding ambient light to the scene

	var pointLight = new THREE.PointLight(0xffffff, 0.54);
	pointLight.castShadow = true;
	pointLight.position.set(50, 200, 20);
	scene.add(pointLight);


	/** Used to save those variables that need to be modified */
	let guiParams = new function () {
		this.rotationSpeed = 0.02;
		this.opacity = meshMaterial.opacity;
		this.transparent = meshMaterial.transparent;
		this.visible = meshMaterial.visible;//turn on/turn off
		this.ambient = '#9999ff';//ambient light
		this.emissive = '#111111';//emissive light
		this.specular = '#ffffff';//specular light
		this.diffuse = '#9999ff';//diffuse light
		//How shiny the .specular highlight is; a higher value gives a sharper highlight. Default is 30.
		//Looks more like ocean and waves in the sun
		//https://threejs.org/docs/#api/en/materials/MeshPhongMaterial
		this.shininess = meshMaterial.shininess;

		this.color = '#ffffff';

		this.pointLight = true;

		this.updateMaterial = function () {
			meshMaterial.opacity = this.opacity;
			meshMaterial.transparent = this.transparent;
			meshMaterial.visible = this.visible;
			meshMaterial.ambient = new THREE.Color(this.ambient);
			meshMaterial.diffuse = new THREE.Color(this.diffuse);
			meshMaterial.emissive = new THREE.Color(this.emissive);
			meshMaterial.specular = new THREE.Color(this.specular);
			meshMaterial.shininess = this.shininess;
			meshMaterial.color = new THREE.Color(this.color);

			meshMaterial.needsUpdate = true;
		}
	};
	/** Define dat.GUI object and bind several properties of guiParams */

	var folder = gui.addFolder('Lighting');
	folder.open();
	folder.add(guiParams, 'opacity', 0.1, 1.0).onChange(function (e) {
		guiParams.updateMaterial();
	});
	folder.add(guiParams, 'transparent').onChange(function (e) {
		guiParams.updateMaterial();
	});
	folder.addColor(guiParams, 'ambient').onChange(function (e) {
		guiParams.updateMaterial();
	});
	folder.addColor(guiParams, 'diffuse').onChange(function (e) {
		guiParams.updateMaterial();
	});
	folder.addColor(guiParams, 'emissive').onChange(function (e) {
		guiParams.updateMaterial();
	});
	folder.addColor(guiParams, 'specular').onChange(function (e) {
		guiParams.updateMaterial();
	});
	//The larger the number, the more shiny
	folder.add(guiParams, 'shininess', 1, 200).onChange(function (e) {
		guiParams.updateMaterial();
	});
	folder.add(guiParams, 'visible').onChange(function (e) {
		guiParams.updateMaterial();
	});

	folder.addColor(guiParams, 'color').onChange(function (e) {
		guiParams.updateMaterial();
	});

	gui.add(guiParams, 'pointLight').onChange(function (e) {
		scene.remove(pointLight);

		if (e) {
			scene.add(pointLight);

		}
	});

	guiParams.updateMaterial();


	render();
	window.addEventListener('resize', onResize, true);
}

function onResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	// If we use a canvas then we also have to worry of resizing it
	renderer.setSize(window.innerWidth, window.innerHeight);
}


function updateVertices(geom, x, y, z) {
	let vertices = geom.geometry.attributes.position.array;
	for (let i = 0; i <= vertices.length; i += 3) {
		vertices[i + 2] = perlin.noise(vertices[i] / x + t, vertices[i + 1] / z + t) * y;
	}
	geom.geometry.attributes.position.needsUpdate = true;
//geom.geometry.attributes.normal.computeFaceNormals();
	geom.geometry.computeVertexNormals();
	geom.geometry.computeFaceNormals();

	geom.geometry.attributes.normal.needsUpdate = true;
}

function render() {
	if (animationOn) {
		t += speed;
	}
	requestAnimationFrame(render);
	updateVertices(plane, noise_x, noise_y, noise_z);
	renderer.render(scene, camera);
}

function main() {
	init()
}

function initPlaneModel(width, height, widthSeg, heightSeg, texture, texturenormal){
	geometry = new THREE.PlaneBufferGeometry(width, height, widthSeg, heightSeg);
	meshMaterial = new THREE.MeshPhongMaterial({
		color: 0x4654ff,
		map: texture,
		normalMap: texturenormal,
		side: THREE.DoubleSide, transparent: true, opacity: 0.7
	});
	var plane = new THREE.Mesh(geometry, meshMaterial);
	plane.rotation.x = THREE.Math.degToRad(-90);
	return plane;
}

window.onload = main;