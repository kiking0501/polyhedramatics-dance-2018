/*
    Modification of an excellent implementation of Boid from MeshLine
    https://github.com/spite/THREE.MeshLine/blob/master/demo/birds.html

*/

var BoidGroup = function(boidNum, majorColor, length, vScalar){
    THREE.Group.apply(this, arguments);
    majorColor = setdefault(majorColor, null);
    length = setdefault(length, 100);
    vScaler = setdefault(vScalar, 5);

    if (majorColor) {
        majorColor = new THREE.Color(majorColor);
    }

    var boids = [];
    for ( var i = 0; i < boidNum; i ++ ) {

        if (majorColor) {
            var color = majorColor.clone();
            color.r = color.r + 0.5 * Math.random();
            color.g = color.g + 0.5 * Math.random();
            color.b = color.b + 0.5 * Math.random();
        } else {
            var color = null;
        }
        var boid = new Boid(color, length, vScalar);
        boid.position.x = Math.random() * 400 - 200;
        boid.position.y = Math.random() * 400 - 200;
        boid.position.z = Math.random() * 400 - 200;
        boid.velocity.x = (Math.random() * 2 - 1);
        boid.velocity.y = (Math.random() * 2 - 1);
        boid.velocity.z = (Math.random() * 2 - 1);
        boid.setAvoidWalls( true );
        boid.setWorldSize( 200, 200, 200 );
        boids.push(boid);
        this.add(boid);
    }
    this.boids = boids;
}


BoidGroup.prototype = Object.create(THREE.Group.prototype);
BoidGroup.prototype.constructor = BoidGroup;


BoidGroup.prototype.repulse = function(x, y) {
    var vector = new THREE.Vector3( x - WIDTH/2.0, - y + HEIGHT/2.0, 0 );
    for ( var i = 0; i < this.boids.length;  i++ ) {
        var boid = this.boids[ i ];
        vector.z = boid.position.z;
        boid.repulse( vector );
    }
}

BoidGroup.prototype.onUpdate = function(scope){
    var that = scope;
    for ( var i = 0; i < that.boids.length; i++ ) {
        var boid = that.boids[ i ];
        boid.run( that.boids );
        // var color = new THREE.Color(Math.random() * 0xffffff);
        // // color.r = color.g = color.b = ( 500 - boid.position.z ) / 1000;
        // if (boid.trail_initialized) {
        //     boid.trail_material.uniforms.color.value = color;
        //     boid.trail_material.needsUpdate = true;
        // }
    }
}

BoidGroup.prototype.changeOpacity = function(from, target, duration) {
    for (var i = 0; i < this.boids.length; i++) {
        changeMaterialOpacity(this.boids[i], 'trail_mesh', duration, from, target);
    }
}


// Based on http://www.openprocessing.org/visuals/?visualID=6910
var Boid = function(color, length, vScalar) {
    length = setdefault(length, 100);
    vScaler = setdefault(vScalar, 5);

    THREE.Group.apply(this, arguments);

    var that = this;
    var vector = new THREE.Vector3(),
    _acceleration, _width = 300, _height = 300, _depth = 150, _goal, _neighborhoodRadius = 100,
    _maxSpeed = 4, _maxSteerForce = 0.1, _avoidWalls = false;
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    _acceleration = new THREE.Vector3();
    this.trail_initialized = false;
    // delay so trails grow organically
    setTimeout(function () {
        that.initTrail();
    }, 250);

    if (!color){
        color = new THREE.Color( Math.random() * 0xffffff );
    }

    this.initTrail = function () {
        // Create the line geometry used for storing verticies
        this.trail_geometry = new THREE.Geometry();
        for (var i = 0; i < length; i++) {
            // must initialize it to the number of positions it will keep or it will throw an error
            this.trail_geometry.vertices.push(that.position.clone());
        }
        // Create the line mesh
        this.trail_line = new MeshLine();
        this.trail_line.setGeometry( this.trail_geometry,  function( p ) { return p; }  ); // makes width taper

        // Create the line material
        this.trail_material = new MeshLineMaterial( {
            color: color,
            opacity: .8,
            resolution: new THREE.Vector2( WIDTH, HEIGHT ),
            sizeAttenuation: 1,
            lineWidth: 1,
            near: 1,
            far: 100000,
            depthTest: false,
            blending: THREE.NormalBlending,
            transparent: true,
            side: THREE.DoubleSide
        });
        this.trail_mesh = new THREE.Mesh( this.trail_line.geometry, this.trail_material ); // that syntax could definitely be improved!
        this.trail_mesh.frustumCulled = false;
        // **** important
        this.add(this.trail_mesh);
        // ****

        this.trail_initialized = true;
    };
    this.setGoal = function ( target ) {
        _goal = target;
    };
    this.setAvoidWalls = function ( value ) {
        _avoidWalls = value;
    };
    this.setWorldSize = function ( width, height, depth ) {
        _width = width;
        _height = height;
        _depth = depth;
    };
    this.run = function ( boids ) {


        if ( _avoidWalls ) {
            vector.set( - _width, this.position.y, this.position.z );
            vector = this.avoid( vector );
            vector.multiplyScalar( vScalar );
            _acceleration.add( vector );
            vector.set( _width, this.position.y, this.position.z );
            vector = this.avoid( vector );
            vector.multiplyScalar( vScalar );
            _acceleration.add( vector );
            vector.set( this.position.x, - _height, this.position.z );
            vector = this.avoid( vector );
            vector.multiplyScalar( vScalar );
            _acceleration.add( vector );
            vector.set( this.position.x, _height, this.position.z );
            vector = this.avoid( vector );
            vector.multiplyScalar( vScalar );
            _acceleration.add( vector );
            vector.set( this.position.x, this.position.y, - _depth );
            vector = this.avoid( vector );
            vector.multiplyScalar( vScalar );
            _acceleration.add( vector );
            vector.set( this.position.x, this.position.y, _depth );
            vector = this.avoid( vector );
            vector.multiplyScalar( vScalar );
            _acceleration.add( vector );
        }/* else {
            this.checkBounds();
        }
        */
        if ( Math.random() > 0.5 ) {
            this.flock( boids );
        }
        this.move();
    };
    this.flock = function ( boids ) {
        if ( _goal ) {
            _acceleration.add( this.reach( _goal, 0.005 ) );
        }
        _acceleration.add( this.alignment( boids ) );
        _acceleration.add( this.cohesion( boids ) );
        _acceleration.add( this.separation( boids ) );
    };
    this.move = function () {
        this.velocity.add( _acceleration );
        var l = this.velocity.length();
        if ( l > _maxSpeed ) {
            this.velocity.divideScalar( l / _maxSpeed );
        }
        this.position.add( this.velocity );
        _acceleration.set( 0, 0, 0 );
        // Advance the trail by one position
        if (this.trail_initialized) {
            this.trail_line.advance( this.position );
        }
    };
    this.checkBounds = function () {
        if ( this.position.x >   _width ) this.position.x = - _width;
        if ( this.position.x < - _width ) this.position.x =   _width;
        if ( this.position.y >   _height ) this.position.y = - _height;
        if ( this.position.y < - _height ) this.position.y =  _height;
        if ( this.position.z >  _depth ) this.position.z = - _depth;
        if ( this.position.z < - _depth ) this.position.z =  _depth;
    };
    //
    this.avoid = function ( target ) {
        var steer = new THREE.Vector3();
        steer.copy( this.position );
        steer.sub( target );
        steer.multiplyScalar( 1 / this.position.distanceToSquared( target ) );
        return steer;
    };
    this.repulse = function ( target ) {
        var distance = this.position.distanceTo( target );
        if ( distance < 150 ) {
            var steer = new THREE.Vector3();
            steer.subVectors( this.position, target );
            steer.multiplyScalar( 0.5 / distance );
            _acceleration.add( steer );
        }
    };
    this.reach = function ( target, amount ) {
        var steer = new THREE.Vector3();
        steer.subVectors( target, this.position );
        steer.multiplyScalar( amount );
        return steer;
    };
    this.alignment = function ( boids ) {
        var boid, velSum = new THREE.Vector3(),
        count = 0;
        for ( var i = 0, il = boids.length; i < il; i++ ) {
            if ( Math.random() > 0.6 ) continue;
            boid = boids[ i ];
            distance = boid.position.distanceTo( this.position );
            if ( distance > 0 && distance <= _neighborhoodRadius ) {
                velSum.add( boid.velocity );
                count++;
            }
        }
        if ( count > 0 ) {
            velSum.divideScalar( count );
            var l = velSum.length();
            if ( l > _maxSteerForce ) {
                velSum.divideScalar( l / _maxSteerForce );
            }
        }
        return velSum;
    };
    this.cohesion = function ( boids ) {
        var boid, distance,
        posSum = new THREE.Vector3(),
        steer = new THREE.Vector3(),
        count = 0;
        for ( var i = 0, il = boids.length; i < il; i ++ ) {
            if ( Math.random() > 0.6 ) continue;
            boid = boids[ i ];
            distance = boid.position.distanceTo( this.position );
            if ( distance > 0 && distance <= _neighborhoodRadius ) {
                posSum.add( boid.position );
                count++;
            }
        }
        if ( count > 0 ) {
            posSum.divideScalar( count );
        }
        steer.subVectors( posSum, this.position );
        var l = steer.length();
        if ( l > _maxSteerForce ) {
            steer.divideScalar( l / _maxSteerForce );
        }
        return steer;
    };
    this.separation = function ( boids ) {
        var boid, distance,
        posSum = new THREE.Vector3(),
        repulse = new THREE.Vector3();
        for ( var i = 0, il = boids.length; i < il; i ++ ) {
            if ( Math.random() > 0.6 ) continue;
            boid = boids[ i ];
            distance = boid.position.distanceTo( this.position );
            if ( distance > 0 && distance <= _neighborhoodRadius ) {
                repulse.subVectors( this.position, boid.position );
                repulse.normalize();
                repulse.divideScalar( distance );
                posSum.add( repulse );
            }
        }
        return posSum;
    }
}

Boid.prototype = Object.create(THREE.Group.prototype);
Boid.prototype.constructor = Boid;
