var SCENE,
    CAMERA,
    RENDERER,
    CONTAINER,
    CONTROLS,
    TIMELINE = null,
    RESTART = false,
    PAUSE = false,
    WITH_INTRO = false,
    INTRO_TIME = 30;

var LISTENER,
    SOUND = null,
    AUDIOLOADER;

var HEIGHT,
    WIDTH;

var START = null;
var SCHEDULER = new Scheduler1(0.0);
var SCHEDULE_LIST = [
    new Scheduler1(),
    new Scheduler2(),
    new Scheduler3(),
    new Scheduler4(),
    new Scheduler5(),
    new Scheduler6(),
    new Scheduler7(),
    new Scheduler0(),
]

var TOTALSEC = 711;

function initProgressBar(){
    var session = [
        ['A', 37.5],
        ['B', 71],
        ['C', 120],
        ['D', 158],
        ['E', 184],
        ['F', 281],
        ['G', 323],
        ['H', 358],
        ['I', 433],
        ['J', 463],
        ['CUE1', 490],
        ['CUE2', 581],
        ['CUE3', 600]
    ]
    var total = TOTALSEC;

    var marks = $("#progress_marks");
    marks.html("");

    for (var i = 0; i < session.length; i++) {

        var progress = Math.round(session[i][1] * 1.0 / total * 100);

        if (i == session.length -1) {
            marks.append(
                '<div class="bar-step" style="left: ' + progress + '%">' +
                '<div class="label-percent">' + session[i][0] + '</div>' +
                '<div class="label-line"></div>'
            )
        } else {
            marks.append(
                '<div class="bar-step" style="left: ' + progress + '%">' +
                '<div class="label-txt">' + session[i][0] + '</div>' +
                '<div class="label-line"></div>'
            )
        }
    }

    var bar = $("#progress_bar");
    bar.css("width", "0%");

}

function changeInputStart(ele){
    var inputStart = parseFloat($(ele).val());
    if (SOUND) {
        if (!PAUSE){
            clean();
        }
        setTimeout(
            polyAnimate(inputStart),
            500
        );
    } else {
        playAudio(inputStart);
    };
}

function playWithIntro() {
    WITH_INTRO = true;

    var scheduler = new Scheduler0();
    var t = new TimelineLite();

    for (var i = 0; i < scheduler.introProgram.length; i++) {
        var name = scheduler.introProgram[i];
        var startSecond = scheduler.introStartSecond[i];
        t = t.call(scheduler[name], [], scheduler, startSecond);
    }

    $("#intro_text").show();

    render();
    setTimeout(
        function(){

            playAudio();
        },
        INTRO_TIME * 1000
    )
}



function playAudio(inputStart) {
    if (PAUSE) {
        setTimeout(
            function() {
                var text = $("#timestamp").html();
                $("#inputStart").val(text);
                $("#inputStart").trigger("change");
                PAUSE = false;
            },
            500
        );

    } else {

        $("#loading_block").html("Loading... (it might take long)")
        LISTENER = new THREE.AudioListener();
        CAMERA.add( LISTENER );
        SOUND = new THREE.Audio( LISTENER );

        // load a sound and set it as the Audio object's buffer
        AUDIOLOADER = new THREE.AudioLoader();
        AUDIOLOADER.load( 'audio.mp3', function( buffer ) {
            SOUND.setBuffer( buffer );
            // sound.setLoop( true );
            SOUND.setVolume( 2.0 );
            polyAnimate(inputStart);
            $("#loading_block").html("");
            $("#intro_box").hide();
            $('#progress_box').show();
        });

    }
}


function polyAnimate(inputStart) {
    inputStart = setdefault(inputStart, parseFloat($('#inputStart').val()));
    if (!parseFloat($('#inputStart').val())) {
        $('#inputStart').val(inputStart);
    }

    if (TIMELINE) {
        TIMELINE.clear();
    };

    TIMELINE = new TimelineLite({paused: true});

    for (var s = 0; s < SCHEDULE_LIST.length; s++) {
        var scheduler = SCHEDULE_LIST[s];
        for (var i = 0; i < scheduler.program.length; i++) {
            var name = scheduler.program[i];
            var startSecond = scheduler.startSecond[i];
            TIMELINE = TIMELINE.call(scheduler[name], [], scheduler, startSecond);
        }
    }


    RESTART = false;
    TIMELINE.play(inputStart);

    setTimeout(
        function(){
            SOUND.offset = inputStart;
            SOUND.play();
        },
        200
    );

    WITH_INTRO = false;
    START = null;

    render();
}

function render(timestamp) {
    var inputStart = parseFloat($("#inputStart").val());

    if (!isFinite(inputStart)) {
        console.log('warning for inputStart', inputStart);
    } else {

        if (!START) {START = timestamp};
        var progress = ((timestamp - START) / 1000 + inputStart).toFixed(2);
        if (!PAUSE){
            if (! WITH_INTRO) {
                $('#timestamp').html(progress);

                var bar = $("#progress_bar");
                bar.css("width", (progress * 1.0 / TOTALSEC * 100) + "%");

                $("#time_lapsed").html(
                    ('0' + Math.floor(progress / 60.0)).slice(-2) + ':' +
                    ('0' + Math.round(progress) % 60).slice(-2)
                )
            } else {
                var remain_time = INTRO_TIME - Math.round(progress) % 60;
                if (remain_time < 0){
                    remain_time = "..."
                }
                $("#remain_time").html(
                    remain_time
                )
            }
        }

        RENDERER.render(SCENE, CAMERA);

        if (!RESTART) {
            requestAnimationFrame(render);
        } else if (PAUSE) {
            START = null;
            SOUND.pause();
        } else {
            $('#timestamp').html("");
            START = null;
            if (SOUND) SOUND.stop();
        }

    }
    // CONTROLS.update(); // FIXME: affect camera rotation
}

function pause() {
    if (SOUND) {
        PAUSE = true;
        RESTART = true;
    }
}

function clean() {
    PAUSE = false;
    RESTART = true;
    restoreScene();
}

function restoreScene() {
    disposeHierarchy(SCENE);
    init();
    initScene();
}

function init() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    var fieldOfView = 100,
        aspectRatio = WIDTH / HEIGHT,
        nearClippingPane = 0.1,
        farClippingPane = 10000;

    var cameraPosition = [0, 0, 1000],
        cameraLookAt = [0, 0, 0];
    /////////////
    // set CAMERA

    // turn this on to see funny effect
    // CAMERA = new THREE.OrthographicCamera(
    //     -WIDTH, // / 2,
    //     WIDTH, // / 2,
    //     HEIGHT, // / 2,
    //     -HEIGHT, // / 2,
    //     nearClippingPane,
    //     farClippingPane
    // )

    CAMERA = new THREE.PerspectiveCamera(
        fieldOfView, aspectRatio, nearClippingPane, farClippingPane
    );

    // x, y, z
    CAMERA.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
    // CAMERA.rotation.set(0, 0, 0);
    CAMERA.lookAt(pos2v(cameraLookAt));

    ///////////////
    // set RENDERER
    RENDERER = new THREE.WebGLRenderer({ antialias: true});
    RENDERER.setSize(WIDTH, HEIGHT);

    ///////////////
    CONTAINER = $('#main');
    CONTAINER.html("");
    CONTAINER.append( RENDERER.domElement );

    window.addEventListener( 'resize', onWindowResize, false );


    CONTROLS = new THREE.OrbitControls( CAMERA,  RENDERER.domElement  );
    // // CONTROLS.enableDamping = true;
    // // CONTROLS.dampingFactor = 0.25;
    CONTROLS.enableZoom = true;

}

function initScene() {

    SCENE = new THREE.Scene();

    // var pointLight = new THREE.PointLight(
    //     ColorMap['grey'][0], 0.8
    // );

    // SCENE.add(pointLight);

    // var ambientLight = new THREE.PointLight(
    //     ColorMap['grey'][0], 0.3
    // );

    // SCENE.add(ambientLight);

    var hemisphereLight = new THREE.HemisphereLight(
        ColorMap['grey'][0], ColorMap['grey'][5],
    )
    hemisphereLight.position.set(0, 0, 0)
    SCENE.add(hemisphereLight);

    // SCENE.fog = new THREE.Fog(new THREE.Color("black"), 0.1, 0.2);
}

function onWindowResize() {

    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    CAMERA.aspect = WIDTH / HEIGHT;
    CAMERA.updateProjectionMatrix()
    RENDERER.setSize( WIDTH, HEIGHT );

}

// $(window).focus(function() {
//     if (SOUND && !PAUSE) {
//         SOUND.play();
//     }
// });

// $(window).blur(function() {
//     pause()
//     // if (SOUND){

//     //     SOUND.pause();
//     // }
// });