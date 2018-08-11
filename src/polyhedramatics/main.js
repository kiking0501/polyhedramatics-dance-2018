var SCENE,
    CAMERA,
    RENDERER,
    CONTAINER,
    CONTROLS,
    TIMELINE = null,
    RESTART = false,
    PAUSE = false;

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
]

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
        });

    }
}


function polyAnimate(inputStart) {
    inputStart = setdefault(inputStart, parseFloat($('#inputStart').val()));

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

    render();
}

function render(timestamp) {
    if (!START) {START = timestamp};
    var progress = ((timestamp - START) / 1000 +
                    parseFloat($("#inputStart").val())).toFixed(2);
    if (!PAUSE){
        $('#timestamp').html(progress);
    }

    RENDERER.render(SCENE, CAMERA);

    if (!RESTART) {
        requestAnimationFrame(render);
    } else if (PAUSE) {
        START = null;
        SOUND.stop();
    } else {
        $('#timestamp').html("");
        START = null;
        SOUND.stop();
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