/*

  For displaying Intro Page / Ending Page

*/

var Scheduler0 = function(inputStart) {

    var that = this;
    this.START = setdefault(inputStart, 358);

    this.introProgram = [
        'initCamera',
        'createIntroText',
        'simpleAnimation',
        'endIntro',
        'restart',
    ];

    this.introStartSecond = [
        0,
        0,
        0 ,
        29.8,
        29.8,
    ];

    this.program = [
        'cleanScene',
        'cityScape',
        'cleanCityScape',
    ];

    this.startSecond = [
        this.START + 0.3,
        this.START + 1,
        this.START + 1.5,
    ];


    this.initCamera = function(){
        CAMERA.position.set(0, 0, 1000);
        CAMERA.lookAt(0, 0, 0);
    }

    this.chiTextSettings = [
        ['多面體狂想。舞 （我可以為這個世界留下甚麼?）',
         {
            size: 80,
            pos: [-1400, 900, 0],
         }
        ],
    ]

    this.textSettings = [
        ['- 2018',
        {
            size: 80,
            pos: [1020, 910, 0]
        }
        ],
        ['Polyhedramatics - The Dance  ( What Could I Leave for the World? ) - 2018',
         {
            size: 80,
            pos: [-1900, 700, 0],
            color: 'white',
         }
        ],
        ['Excerpt',
         {
            size: 80,
            pos: [350, 480, 0],
            color: 'orange',
         },
        ],
        [' - Up to letter H of the music',

          {
            size: 50,
            pos: [750, 490, 0],
            color: 'orange',
          }
        ],
        ['Animation |  kiking (Ng Yin-ki)',
         {
            size: 90,
            pos: [300, 20, 0],
         },
        ],
        ['Original Music |  Hippocrates Cheng',
         {
            size: 65,
            pos: [400, -150, 0],
         },
        ],
    ]

    this._getText = function(font, settings) {

        var r = settings[1]['size'];

        var textGeom = new THREE.TextGeometry(
            settings[0],
            {
                font: font,
                size: r,
                height: .01,
            }
        )

        var mesh = new THREE.Mesh(
            textGeom,
            new THREE.MeshBasicMaterial({
                 color: new THREE.Color(setdefault(settings[1]['color'], 'white')),
                 side: THREE.DoubleSide,
            })
        )

        var pos = settings[1]['pos'];

        mesh.position.set(pos[0], pos[1], pos[2]);
        mesh.rotation.set(0, 0, 0);
        mesh.scale.set(1, 1, 1);

        return mesh;

    }

    this.createIntroText = function(){

        var that = this;

        var textGroup = new THREE.Group();

        var textLoader = new THREE.FontLoader();
        textLoader.load(
            '../fonts/gentilis_bold.typeface.json', function(font) {

                var textSettings = that.textSettings;
                for (var i = 0; i < textSettings.length; i++) {
                    var mesh = that._getText(font, textSettings[i]);
                    mesh.name = "introText" + i;
                    textGroup.add(mesh);

                }
            }
        )

        textLoader.load(
            '../fonts/FKKaikaisho-AriakeStd-W4_Regular_restricted.json', function(font) {

                var textSettings = that.chiTextSettings;

                for (var i = 0; i < textSettings.length; i++) {

                    var mesh = that._getText(font, textSettings[i]);
                    mesh.name = "introChiText" + i;
                    textGroup.add(mesh);

                }
            }
        )
        textGroup.name = "textGroup";
        this.textGroup = textGroup;

    }
    this.simpleAnimation = function(){

        var that = this;

        var t = new TimelineLite();
        t = t.call(
            function(){
                SCENE.add(that.textGroup);
            },
            [], this
        )

        var center_pos = [-300, 0, 0];
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

        var obj = SCENE.getObjectByName("textGroup");
        SCENE.remove(obj);
        disposeHierarchy(obj);

    }

    this.restart = function(){
        clean();
    }

    this.cleanScene = function(){
        this.initCamera();
        SCENE.background = new THREE.Color('black');

    }
    this.cityScape = function(){
        var that = this;

        var chiTextSettings = [
            ['我城藝術展',
             {
                size: 300,
                pos: [-1150, 500, 0],
             }
            ]
        ];


        var engTextSettings = [
            ['The City Art Exhibition',
             {
                size: 200,
                pos: [-1500, 0, 0],
             }
            ]
        ];


        var textLoader = new THREE.FontLoader();
        textLoader.load(
            '../fonts/gentilis_bold.typeface.json', function(font) {

                var textSettings = engTextSettings;
                for (var i = 0; i < textSettings.length; i++) {
                    var mesh = that._getText(font, textSettings[i]);
                    mesh.name = "introText" + i;
                    SCENE.add(mesh);

                }
            }
        )

        textLoader.load(
            '../fonts/FKKaikaisho-AriakeStd-W4_Regular_restricted.json', function(font) {

                var textSettings = chiTextSettings;

                for (var i = 0; i < textSettings.length; i++) {

                    var mesh = that._getText(font, textSettings[i]);
                    mesh.name = "introChiText" + i;
                    SCENE.add(mesh);

                }
            }
        )
    }
    this.cleanCityScape = function(){
        pause()
    }
}