      var pinsFormation = [];
      var pins = [6];

      pinsFormation.push( pins );

      pins = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
      pinsFormation.push( pins );

      pins = [ 0 ];
      pinsFormation.push( pins );

      pins = []; // cut the rope ;)
      pinsFormation.push( pins );

      pins = [ 0, cloth.w ]; // classic 2 pins
      pinsFormation.push( pins );

      pins = pinsFormation[ 1 ];

      

      var container, stats;
      var camera, scene, renderer;

      var clothGeometry;
      var sphere;
      var object, arrow;
      var new_uniforms;

      var rotate = true;
      function setup() {
        container = document.createElement( 'div' );
        document.body.appendChild( container );

        // scene

        scene = new THREE.Scene();

        // scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

        // camera

        // camera = new THREE.PerspectiveCamera( 15, window.innerWidth / window.innerHeight, 1, 10000 );
        // // camera = new THREE.PerspectiveCamera( 15, window.innerWidth / window.innerHeight, 1, 10000 );
        // camera.position.y = 200;
        // camera.position.z = 9000;
        // scene.add( camera );

        camera = new THREE.PerspectiveCamera( 15, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.y = 50;
        camera.position.z = 1500;
        scene.add( camera );


// lights

        var light, materials;

        scene.add( new THREE.AmbientLight( 0x666666 ) );

        light = new THREE.DirectionalLight( 0xdfebff, 1.75 );
        light.position.set( 50, 200, 100 );
        light.position.multiplyScalar( 1.3 );

        light.castShadow = true;
        //light.shadowCameraVisible = true;

        light.shadowMapWidth = 2048;
        light.shadowMapHeight = 2048;

        var d = 300;

        light.shadowCameraLeft = -d;
        light.shadowCameraRight = d;
        light.shadowCameraTop = d;
        light.shadowCameraBottom = -d;

        light.shadowCameraFar = 1000;
        light.shadowDarkness = 0.5;

        scene.add( light );

        light = new THREE.DirectionalLight( 0x3dff0c, 0.35 );
        light.position.set( 0, -1, 0 );

        scene.add( light );


        new_uniforms = {
            u_time: { type: "f", value: 1.0 },
            u_resolution: { type: "v2", value: new THREE.Vector2() }
        };


// uniform vec3      iResolution;           // viewport resolution (in pixels)
// uniform float     iGlobalTime;           // shader playback time (in seconds)
// uniform float     iChannelTime[4];       // channel playback time (in seconds)
// uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
// uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
// uniform samplerXX iChannel0..3;          // input channel. XX = 2D/Cube
// uniform vec4      iDate;                 // (year, month, day, time in seconds)
// uniform float     iSampleRate;           // sound sample rate (i.e., 44100)

var matg = new THREE.ShaderMaterial( {

            uniforms: new_uniforms,
            vertexShader: document.getElementById('simpleVertex').textContent,
            fragmentShader: document.getElementById('mainImage').textContent,

        } );
              var geometry = new THREE.PlaneBufferGeometry( 1, 1 );
        // matg.wrapS = matg.wrapT = THREE.RepeatWrapping;
        // var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 20000, 20000 ), matg );
        var mesh = new THREE.Mesh( geometry, matg );

        // mesh.position.z = -700;
        mesh.position.set(0, 0, 0);
        // mesh.rotation.x = - Math.PI / 2;
        // mesh.receiveShadow = true;
        scene.add( mesh );

        // cloth material

        var clothTexture = THREE.ImageUtils.loadTexture( "./eIBV3iy.png" );
        clothTexture.wrapS = clothTexture.wrapT = THREE.RepeatWrapping;
        clothTexture.anisotropy = 16;

        var clothMaterial = new THREE.MeshPhongMaterial( { alphaTest: 0.5, ambient: 0xffffff, color: 0xffffff, specular: 0x030303, emissive: 0x111111, shiness: 10, map: clothTexture, side: THREE.DoubleSide } );

        // cloth geometry
        clothGeometry = new THREE.ParametricGeometry( clothFunction, cloth.w, cloth.h, true );
        clothGeometry.dynamic = true;
        clothGeometry.computeFaceNormals();

        var uniforms = { texture:  { type: "t", value: clothTexture } };
        var vertexShader = document.getElementById( 'vertexShaderDepth' ).textContent;
        var fragmentShader = document.getElementById( 'fragmentShaderDepth' ).textContent;


        // cloth mesh

        // object = new THREE.Mesh( clothGeometry, clothMaterial );
        object = new THREE.Mesh( clothGeometry, clothMaterial );
        object.position.set( 0, 0, 0 );
        object.position.z = 100;
        object.castShadow = true;
        object.receiveShadow = true;
        scene.add( object );

        object.customDepthMaterial = new THREE.ShaderMaterial( { uniforms: uniforms, vertexShader: vertexShader, fragmentShader: fragmentShader } );
        // object.customDepthMaterial = matg;

        // sphere

        var ballGeo = new THREE.SphereGeometry( ballSize, 20, 20 );
        var ballMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

        sphere = new THREE.Mesh( ballGeo, ballMaterial );
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        // scene.add( sphere );

        // arrow

        arrow = new THREE.ArrowHelper( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 0 ), 50, 0xff0000 );
        arrow.position.set( -200, 0, -200 );
        // scene.add( arrow );

        // ground

        var initColor = new THREE.Color( 0xffffff );
        var initTexture = THREE.ImageUtils.generateDataTexture( 0, 0, initColor );

        var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xff0000, map: initTexture } );


// uniforms = {
//   iResolution: {type: 'v3', value: new THREE.Vector3() },
//   iGlobalTime: {type: 'f', value: new Number() },
//   iChannelTime: [
//     {type: 'f', value: new Number() },
//     {type: 'f', value: new Number() },
//     {type: 'f', value: new Number() },
//     {type: 'f', value: new Number() }
//   ],
//   iChannelResolution: [
//     {type: 'v3', value: new THREE.Vector3() },
//     {type: 'v3', value: new THREE.Vector3() },
//     {type: 'v3', value: new THREE.Vector3() },
//     {type: 'v3', value: new THREE.Vector3() }
//   ],
//   iMouse: {type: 'v4', value: new THREE.Vector4() },
//   iDate: {type: 'v4', value: new THREE.Vector4() },
//   iChannel0: {type: 't', value: new THREE.Texture() },
//   iChannel1: {type: 't', value: new THREE.Texture() },
//   iChannel2: {type: 't', value: new THREE.Texture() },
//   iChannel3: {type: 't', value: new THREE.Texture() },
//   iSampleRate: {type: 'f', value: new Number() }

// }


        // var groundTexture = THREE.ImageUtils.loadTexture( "http://placehold.it/250/e3e3e3/e3e3e3", undefined, function() { groundMaterial.map = groundTexture } );
        // var groundTexture = THREE.ImageUtils.loadTexture( "http://placehold.it/250/e3e3e3/e3e3e3", undefined, function() { groundMaterial.map = matg } );
        // var groundTexture = matg;
        // groundMaterial.map = matg;
        // groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        // groundTexture.repeat.set( 1, 1 );
        // groundTexture.anisotropy = 0;
        //       var geometry = new THREE.PlaneBufferGeometry( 1, 1 );
        // // matg.wrapS = matg.wrapT = THREE.RepeatWrapping;
        // // var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 20000, 20000 ), matg );
        // var mesh = new THREE.Mesh( geometry, matg );

        // mesh.position.z = -200;
        // mesh.rotation.x = - Math.PI / 2;
        // // mesh.receiveShadow = true;
        // scene.add( mesh );

        // poles

        // var poleGeo = new THREE.CubeGeometry( 5, 375, 5 );
        // var poleMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, shiness: 100 } );

        // var mesh = new THREE.Mesh( poleGeo, poleMat );
        // mesh.position.x = -125;
        // mesh.position.y = -62;
        // mesh.receiveShadow = true;
        // mesh.castShadow = true;
        // scene.add( mesh );

        // var mesh = new THREE.Mesh( poleGeo, poleMat );
        // mesh.position.x = 125;
        // mesh.position.y = -62;
        // mesh.receiveShadow = true;
        // mesh.castShadow = true;
        // scene.add( mesh );

        // var mesh = new THREE.Mesh( new THREE.CubeGeometry( 255, 5, 5 ), poleMat );
        // mesh.position.y = -250 + 750/2;
        // mesh.position.x = 0;
        // mesh.receiveShadow = true;
        // mesh.castShadow = true;
        // scene.add( mesh );

        // var gg = new THREE.CubeGeometry( 10, 10, 10 );
        // var mesh = new THREE.Mesh( gg, poleMat );
        // mesh.position.y = -250;
        // mesh.position.x = 125;
        // mesh.receiveShadow = true;
        // mesh.castShadow = true;
        // scene.add( mesh );

        // var mesh = new THREE.Mesh( gg, poleMat );
        // mesh.position.y = -250;
        // mesh.position.x = -125;
        // mesh.receiveShadow = true;
        // mesh.castShadow = true;
        // scene.add( mesh );

        


        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( window.innerWidth, window.innerHeight );
        // renderer.setClearColor( scene.fog.color );
            renderer.setPixelRatio( window.devicePixelRatio );

        container.appendChild( renderer.domElement );

        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.physicallyBasedShading = true;

        renderer.shadowMapEnabled = true;
        renderer.setSize( window.innerWidth, window.innerHeight );
        new_uniforms.u_resolution.value.x = renderer.domElement.width;
        new_uniforms.u_resolution.value.y = renderer.domElement.height;

      }

      function draw() {

        requestAnimationFrame( draw );
        

        var time = Date.now();

        windStrength = Math.cos( time / 7000 ) * 20 + 40;
        windForce.set( Math.sin( time / 2000 ), Math.cos( time / 30000 ), Math.sin( time / 10000 ) ).normalize().multiplyScalar( windStrength );

        simulate(time);
        render();
        renderer.render( scene, camera );


      }

      function onWindowResize( event ) {
          renderer.setSize( window.innerWidth, window.innerHeight );
          uniforms.u_resolution.value.x = renderer.domElement.width;
          uniforms.u_resolution.value.y = renderer.domElement.height;
      }


      function render() {

        var timer = Date.now() * 0.0002;

        var p = cloth.particles;

        for ( var i = 0, il = p.length; i < il; i ++ ) {

          clothGeometry.vertices[ i ].copy( p[ i ].position );

        }

        clothGeometry.computeFaceNormals();
        clothGeometry.computeVertexNormals();

        clothGeometry.normalsNeedUpdate = true;
        clothGeometry.verticesNeedUpdate = true;

        sphere.position.copy( ballPosition );
        if ( rotate ) {

          camera.position.x = Math.cos( timer ) * 1500;
          camera.position.z = Math.sin( timer ) * 1500;

        }
        camera.position.x = camera.position.z = 1000;
        camera.position.y = 100;

        camera.lookAt( scene.position );

        renderer.render( scene, camera );
        new_uniforms.u_time.value += 0.05;

      }

      setup();
      draw();
