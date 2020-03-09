let scene, camera, renderer;
let geometry, material, wireframe, terrain, light, edges, line, lines, lineMaterial;
let size = window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight;;
let t = 0;
let noise_x = 1000;
let	noise_z = 1000;
let noise_y = 100;
let perlin = new Perlin();
let origin = new THREE.Vector3(0,0, 0);
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
	renderer = new THREE.WebGLRenderer({ antialias: true});
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
	camera = new THREE.PerspectiveCamera(50, aspectRatio, 2, 10000);
	camera.position.z = size;
	camera.lookAt(origin);

	// create geometry
	geometry  = new THREE.PlaneBufferGeometry(size, size, 100, 100);
	wireframe = new THREE.WireframeGeometry(geometry);
	lineMaterial = new THREE.LineBasicMaterial({color:0x333333});
	line = new THREE.LineSegments(wireframe, lineMaterial);
	line.rotation.x = THREE.Math.degToRad(-90);
	scene.add(line);

	let controls = new function() {
		this.vertical_view = 0;
		this.horizontal_view = 0;
		this.noise_x = 1000;
		this.noise_y = 100;
		this.noise_z = 1000;

		this.rotateViwingAngle = function () {
			let x = size * Math.cos((controls.vertical_view * Math.PI) / 180) * Math.sin((controls.horizontal_view * Math.PI) / 180);
			let y = size * Math.sin((controls.vertical_view * Math.PI) / 180);
			let z = size * Math.cos((controls.vertical_view * Math.PI) / 180) * Math.cos((controls.horizontal_view * Math.PI) / 180);
			camera.position.set(x, y, z);
			camera.lookAt(origin);
		};

		this.update = function () {
			if (noise_x) {
				noise_x = controls.noise_x;
			}
			if (noise_y) {
				noise_y = controls.noise_y;
			}
			if (noise_z) {
				noise_z = controls.noise_z;
			}
			updateVertices(line, noise_x, noise_y, noise_z);
			camera.updateProjectionMatrix();
		};
	};

	let gui = new dat.GUI();
	gui.add(controls, 'horizontal_view', 0, 360).onChange(controls.rotateViwingAngle);
	gui.add(controls, 'vertical_view', 0, 180).onChange(controls.rotateViwingAngle);
	gui.add(controls, 'noise_x', 500, 1000).onChange(controls.update);
	gui.add(controls, 'noise_y', 100, 500).onChange(controls.update);
	gui.add(controls, 'noise_z', 500, 1000).onChange(controls.update);


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
	for (let i = 0; i <= vertices.length; i+=3) {
		vertices[i+2] = perlin.noise(vertices[i] / x + t,  vertices[i + 1] / z + t) * y;
	}
	geom.geometry.attributes.position.needsUpdate = true;
}

function render() {
	t += 0.0025;
	requestAnimationFrame(render);
	updateVertices(line, noise_x, noise_y, noise_z);
	renderer.render(scene, camera);
}

function main() {
	init()
}

window.onload = main;