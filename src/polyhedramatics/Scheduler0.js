var Scheduler0 = function() {

    var that = this;
    this.START = 0;

    this.introProgram = [
        'initCamera',
        'loadIntroText',
        'simpleAnimation',
        'endIntro',
        'restart',
    ];

    this.introStartSecond = [
        this.START,
        this.START,
        this.START,
        this.START + 29.8,
        this.START + 29.8,
    ];

    this.program = [
    ];

    this.startSecond = [
    ];


    this.initCamera = function(){
        CAMERA.position.set(0, 0, 1000);
        CAMERA.lookAt(0, 0, 0);
    }

    this.textSettings = [
        ['Polyhedramatics - The Dance',
         {
            size: 160,
            pos: [-1550, 800, 0],
         }
        ],
        ['What Could I Leave For The World?',
         {
            size: 100,
            pos: [-1450, 500, 0],
         },
        ],
        ['Excerpt (Up to H)',
         {
            size: 50,
            pos: [850, 510, 0],
         },
        ],
        ['Animation by:  kiking',
         {
            size: 60,
            pos: [850, 300, 0],
         },
        ],
        ['(Original Music by:  Ching Nam Cheng)',
         {
            size: 45,
            pos: [850, 150, 0],
         },
        ],
    ]

    this.loadIntroText = function(){

        var that = this;

        var textLoader = new THREE.FontLoader()
        textLoader.load(
            '../fonts/gentilis_bold.typeface.json', function(font) {

                var textSettings = that.textSettings;
                for (var i = 0; i < textSettings.length; i++) {

                    var r = textSettings[i][1]['size'];

                    var textGeom = new THREE.TextGeometry(
                        textSettings[i][0],
                        {
                            font: font,
                            size: r,
                            height: .01,
                        }
                    )

                    var mesh = new THREE.Mesh(
                        textGeom,
                        new THREE.MeshBasicMaterial({
                             color: new THREE.Color("white"),
                             side: THREE.DoubleSide,
                        })
                    )

                    var pos = textSettings[i][1]['pos'];

                    mesh.position.set(pos[0], pos[1], pos[2]);
                    mesh.rotation.set(0, 0, 0);
                    mesh.scale.set(1, 1, 1);
                    mesh.name = 'introText' + i;
                    SCENE.add(mesh);

                }
            }
        )

    }
    this.simpleAnimation = function(){
        var center_pos = [0, -150, 0];
            size = 400;

        var classTypes = ['woodBlock', 'polyhedra'];
        var shapeTypes = [
            ["tetrahedron", "cube", "octahedron", "dodecahedron",
             "icosahedron", "icosahedron1", "woodCube"],
            ["flute", "oboe", "engHorn", "clarinet", "bassoon",
             "trumpet", "frenchHorn", "trombone"
            ]
        ]

        var colors = [
            'pink', 'violet', 'purple', 'blue', 'lightblue', 'marine',
            'green', 'darkgreen', 'yellow3', 'salmon', 'coral', 'red', 'grey'
        ];

        var t = new TimelineLite();
        for (var i = 0; i < 10; i++) {
            t = t.call(
                function(i){
                    var dice = Math.round(Math.random());

                    if (dice == 0) {
                        var majorColor_ind = Math.round(Math.random()*12);
                        var shapeType_ind = Math.round(Math.random()*7);

                        var poly = new WoodBlock(center_pos, size + 5*Math.random(), 3,
                                                 colors[majorColor_ind],
                                                 shapeTypes[dice][shapeType_ind],
                                                 3);
                    } else {
                        var majorColor_ind = Math.round(Math.random()*12);
                        var shapeType_ind = Math.round(Math.random()*7);

                        var polyType = shapeTypes[dice][shapeType_ind];
                        var poly = new Polyhedra(center_pos, size + 5*Math.random(),
                                                 POLYHEDRA[instruMap[polyType]['solidName']],
                                                 instruMap[polyType]['faceColors']);

                    }
                    poly.name = "polyIntro" + i;
                    SCENE.add(poly);
                    poly.polyRotateDuration([0.01* Math.random(), 0.01 * Math.random(), 0.01 * Math.random()], 3);
                    // }
                },
                [i], this,
            ).call(
                function(i){
                    var poly = SCENE.getObjectByName("polyIntro" + i);
                    SCENE.remove(poly);
                    disposeHierarchy(poly);
                },
                [i], this,
                "+=2.9",
            )

        }


    }

    this.endIntro = function(){


        for (var i = 0; i < this.textSettings.length; i++){
            var obj = SCENE.getObjectByName("introText" + i);
            SCENE.remove(obj);
            disposeHierarchy(obj);
        }

    }

    this.restart = function(){
        clean();
    }
}