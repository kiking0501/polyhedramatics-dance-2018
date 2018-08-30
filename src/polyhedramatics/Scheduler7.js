/* [281- sec] Quintet Polyhedra World!

*/


var Scheduler7 = function(startTime) {

    var that = this;
    this.START = setdefault(startTime, 281);
    this.END = 354;   2// 281 + 73

    this.program = [
        'initCamera',
        'createBoids',
        'singEngHorn',
        'singClarinet',
        'singOboe',
        'singFlute',
        'singBassoon',
        'tuneOpacity',
        'orbitCamera',
    ]

    this.startSecond = [
        this.START,
        this.START, // createBoids
        this.START,      //Quintet1, 281
        this.START + 14, //Quintet2, 295
        this.START + 18, //Quintet3, 299
        this.START + 23, //Quintet4, 304
        this.START + 27, //Quintet5, 308
        this.START + 29, //tune opacity
        this.START + 29, // OrbitCamera
    ]


    // SCENE background color 0xefd1b5
    // SCENE fog degree 0.1
    this.initCamera = function(){
        SCENE.background = new THREE.Color(0xefd1b5);

        CAMERA.position.set(0, 50, 200);
        CAMERA.lookAt(0, 0, 0);
        CAMERA.rotation.set(0, 0, 0);
    }

    this.createBoids = function(){
        var boidGroup = new BoidGroup(100);
        for (var i = 0; i < boidGroup.boids.length; i++){
            console.log(boidGroup.boids[i])
            SCENE.add(boidGroup.boids[i]);
        }
        TweenLite.to(
            boidGroup, 30,
            {
                onUpdate: boidGroup.onUpdate,
                onUpdateParams: [boidGroup],
            }
        )
    }

    this.singEngHorn = function(initOnly){
        // start at 281, end at 295+
        initOnly = setdefault(initOnly, false);

        var localPlane = new THREE.Plane(
            pos2v([0, .8, .2]), 0.8
        )

        var center_pos = [-80, 0, 0],
            size = 120,
            polyType = 'engHorn';

        var polyData = POLYHEDRA[instruMap[polyType]['solidName']];
        var poly = new Polyhedra(center_pos,
                                 size,
                                 polyData,
                                 instruMap[polyType]['faceColors'],
                                 [localPlane]
                                )
        poly.name = 'engHorn';
        poly.castShadow = true;
        poly.receiveShadow = true;

        SCENE.add(poly);

        if (!initOnly) {
            var t = new TimelineLite();
            t.from(
                poly.position, 10,
                {
                    y: -125,
                    ease: Linear.easeNone,
                }
            ).call(
                poly.polyRotateDuration,
                [[0.01, 0.0, -0.05], 3.3],
                poly
            )
            .to(
                poly.position, 30,
                {
                    y: 100,
                    ease: Linear.easeNone,
                }
            ).call(
                poly.polyRotateDuration,
                [[0.008, 0.003, 0.003], 73],
                poly,
                "13.3"
            ).call(
                poly.changeOpacity,
                [0.0, 1.0, 4],
                poly,
                "0"
            ).call(
                poly.changeOpacity,
                [1.0, 0.1, 4],
                poly,
                "15"
            ).call(
                poly.changeOpacity,
                [0.1, 1.0, 4],
                poly,
                "19"
            )
        }

    }

    this.singClarinet = function(initOnly){
        // start at 295, end at 299 +
        initOnly = setdefault(initOnly, false);

        var localPlane = new THREE.Plane(
            pos2v([0, .8, .2]), 0.8
        )

        var center_pos = [-80, 40, 30],
            size = 30,
            polyType = 'clarinet';

        var polyData = POLYHEDRA[instruMap[polyType]['solidName']];
        var poly = new Polyhedra(center_pos,
                                 size,
                                 polyData,
                                 instruMap[polyType]['faceColors'],
                                 [localPlane]
                                )
        poly.name = 'clarinet';
        poly.castShadow = true;
        poly.receiveShadow = true;

        SCENE.add(poly);

        if (!initOnly) {
            poly.polyRotateDuration([0.001, 0.000, 0.001], 73-14)

            var t = new TimelineLite();
            t.from(
                poly.position, 5,
                {
                    y: -60,
                    ease: Bounce.easeOut,
                }
            )
            .to(
                poly.position, 9,
                {
                    y: 20,
                    ease: Linear.easeNone,
                }
            ).call(
                poly.changeOpacity,
                [0.0, 1.0, 1],
                poly,
                "0"
            )
        }

    }
    this.singOboe = function(initOnly){
        // start at 299, end at 304+
        initOnly = setdefault(initOnly, false);

        var localPlane = new THREE.Plane(
            pos2v([0, .8, .2]), 0.8
        )
        localPlane.translate(pos2v(0, 50, 0));

        var center_pos = [80, 30, 40],
            size = 50,
            polyType = 'oboe';

        var polyData = POLYHEDRA[instruMap[polyType]['solidName']];
        var poly = new Polyhedra(center_pos,
                                 size,
                                 polyData,
                                 instruMap[polyType]['faceColors'],
                                 [localPlane]
                                )
        poly.name = 'oboe';
        poly.castShadow = true;
        poly.receiveShadow = true;

        SCENE.add(poly);

        if (!initOnly){
            poly.polyRotateDuration([0.000, 0.001, 0.000], 73-18)

            var t = new TimelineLite();
            t.from(
                poly.position, 5,
                {
                    y: 50,
                    ease: Bounce.easeOut,
                }
            )
            .to(
                poly.position, 9,
                {
                    y: 20,
                    ease: Linear.easeNone,
                }
            ).call(
                poly.changeOpacity,
                [0.0, 1.0, 1],
                poly,
                "0"
            )
        }

    }

    this.singFlute = function(initOnly){
        //304 to 308+
        initOnly = setdefault(initOnly, false);

        var localPlane = new THREE.Plane(
            pos2v([0, .8, .2]), 0.8
        )
        localPlane.translate(pos2v(0, -50, 0));

        var center_pos = [30, 5, 40],
            size = 40,
            polyType = 'flute';

        var polyData = POLYHEDRA[instruMap[polyType]['solidName']];
        var poly = new Polyhedra(center_pos,
                                 size,
                                 polyData,
                                 instruMap[polyType]['faceColors'],
                                 [localPlane]
                                )
        poly.name = 'flute';
        poly.castShadow = true;
        poly.receiveShadow = true;

        SCENE.add(poly);

        if (!initOnly){
            poly.polyRotateDuration([0.00, -0.0, 0.001], 73-23)

            var t = new TimelineLite();
            t.from(
                poly.position, 2,
                {
                    y: -80,
                    ease: Bounce.easeOut,
                }
            )
            .to(
                poly.position, 9,
                {
                    y: 20,
                    ease: Linear.easeNone,
                }
            ).call(
                poly.changeOpacity,
                [0.0, 1.0, 1],
                poly,
                "0"
            )
        }
    }

    this.singBassoon = function(initOnly){
        //308 to 310+
        initOnly = setdefault(initOnly, false);

        var center_pos = [200, 20, -100],
            size = 350,
            polyType = 'bassoon';

        var polyData = POLYHEDRA[instruMap[polyType]['solidName']];
        var poly = new Polyhedra(center_pos,
                                 size,
                                 polyData,
                                 instruMap[polyType]['faceColors'],
                                )
        poly.name = 'bassoon';
        poly.castShadow = true;
        poly.receiveShadow = true;

        SCENE.add(poly);

        if (!initOnly){
            poly.polyRotateDuration([0.00, 0.001, 0.000], 73-27)

            var t = new TimelineLite();
            t.from(
                poly.position, 2,
                {
                    y: -80,
                }
            )
            .to(
                poly.position, 9,
                {
                    y: 20,
                    ease: Linear.easeNone,
                }
            ).call(
                poly.changeOpacity,
                [0.0, 1.0, .5],
                poly,
                "0"
            )
        }
    }

    this.tuneOpacity = function(){

        var quintet = [
            'flute', 'oboe', 'engHorn', 'clarinet', 'bassoon'
        ];

        for (var i = 0; i < quintet.length; i++) {
            var poly = SCENE.getObjectByName(quintet[i]);
            poly.changeOpacity(1.0, 0.5, 5);
        }

    }

    this.orbitCamera = function(){
        // start from 310

        RENDERER.localClippingEnabled = false;

        var scale = .001;
        var dist = 150;

        var t = new TimelineLite();
        var dt = Date.now();
        var x = Math.cos(scale * dt) * dist;
        var z = Math.sin(scale * dt) * dist;

        t.to(
            CAMERA.position, 1,
            {
                x: x,
                z: z,
            }
        ).to(
            CAMERA.position, 73,
            {
                onUpdate: function(){
                    var dt = Date.now();
                    var x = Math.cos(scale * dt) * dist;
                    var z = Math.sin(scale * dt) * dist;
                    CAMERA.position.set(x, 50, z);
                    CAMERA.lookAt(0, 0, 0)
                }
            }

        )

    }
        // // testing code on light
        // var ground = new THREE.Mesh(
        //         new THREE.PlaneBufferGeometry( 500, 500, 1, 1 ),
        //         new THREE.MeshStandardMaterial( {
        //             color: new THREE.Color(0xefd1b5),
        //             shininess: 150
        //         } )
        //     );
        // ground.rotation.x = - Math.PI / 2; // rotates X/Y to X/Z
        // ground.receiveShadow = true;
        // ground.position.set(0, -100, 0);
        // SCENE.add( ground );


        // var spotLight = new THREE.SpotLight( 0x55505a, 2 );
        // spotLight.castShadow = true;
        // spotLight.shadow.camera.near = 10;
        // spotLight.shadow.camera.far = 500;
        // spotLight.shadow.camera.fov = 50;

        // spotLight.shadowDarkness = 1.0;
        // spotLight.shadowCameraVisible = true;

        // SCENE.add(spotLight);

        // spotLight.position.set(0, 500, 0);
        // lightHelper1 = new THREE.SpotLightHelper( spotLight );

        // SCENE.add(lightHelper1);


}