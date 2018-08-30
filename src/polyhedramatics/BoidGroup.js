/*
    Modification of an excellent implementation of Boid from MeshLine
    https://github.com/spite/THREE.MeshLine/blob/master/demo/birds.html

*/

var BoidGroup = function(boidNum){
    THREE.Group.apply(this, arguments);

    var boids = [];
    for ( var i = 0; i < boidNum; i ++ ) {
        boid = new Boid();
        boid.position.x = Math.random() * 400 - 200;
        boid.position.y = Math.random() * 400 - 200;
        boid.position.z = Math.random() * 400 - 200;
        boid.velocity.x = Math.random() * 2 - 1;
        boid.velocity.y = Math.random() * 2 - 1;
        boid.velocity.z = Math.random() * 2 - 1;
        boid.setAvoidWalls( true );
        boid.setWorldSize( 300, 300, 300 );
        boids.push(boid);
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
        var color = new THREE.Color('white');
        color.r = color.g = color.b = ( 500 - boid.position.z ) / 1000;
        if (boid.trail_initialized)
            boid.trail_material.uniforms.color.value = color;
    }
}

// Based on http://www.openprocessing.org/visuals/?visualID=6910
var Boid = function() {

    THREE.Group.apply(this, arguments);

    var that = this;
    var vector = new THREE.Vector3(),
    _acceleration, _width = 500, _height = 500, _depth = 200, _goal, _neighborhoodRadius = 100,
    _maxSpeed = 4, _maxSteerForce = 0.1, _avoidWalls = false;
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    _acceleration = new THREE.Vector3();
    this.trail_initialized = false;
    // delay so trails grow organically
    setTimeout(function () {
        that.initTrail();
    }, 250);
    this.initTrail = function () {
        // Create the line geometry used for storing verticies
        that.trail_geometry = new THREE.Geometry();
        for (var i = 0; i < 100; i++) {
            // must initialize it to the number of positions it will keep or it will throw an error
            that.trail_geometry.vertices.push(that.position.clone());
        }
        // Create the line mesh
        that.trail_line = new MeshLine();
        that.trail_line.setGeometry( that.trail_geometry,  function( p ) { return p; }  ); // makes width taper
        // Create the line material
        that.trail_material = new MeshLineMaterial( {
            color: new THREE.Color( "rgb(255, 2, 2)" ),
            opacity: 1,
            resolution: new THREE.Vector2( WIDTH, HEIGHT ),
            sizeAttenuation: 1,
            lineWidth: 1,
            near: 1,
            far: 100000,
            depthTest: false,
            blending: THREE.AdditiveBlending,
            transparent: false,
            side: THREE.DoubleSide
        });
        that.trail_mesh = new THREE.Mesh( that.trail_line.geometry, that.trail_material ); // that syntax could definitely be improved!
        that.trail_mesh.frustumCulled = false;
        //!!!!!!!!!!!!! scene.add( that.trail_mesh );
        that.trail_initialized = true;
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
            vector.multiplyScalar( 5 );
            _acceleration.add( vector );
            vector.set( _width, this.position.y, this.position.z );
            vector = this.avoid( vector );
            vector.multiplyScalar( 5 );
            _acceleration.add( vector );
            vector.set( this.position.x, - _height, this.position.z );
            vector = this.avoid( vector );
            vector.multiplyScalar( 5 );
            _acceleration.add( vector );
            vector.set( this.position.x, _height, this.position.z );
            vector = this.avoid( vector );
            vector.multiplyScalar( 5 );
            _acceleration.add( vector );
            vector.set( this.position.x, this.position.y, - _depth );
            vector = this.avoid( vector );
            vector.multiplyScalar( 5 );
            _acceleration.add( vector );
            vector.set( this.position.x, this.position.y, _depth );
            vector = this.avoid( vector );
            vector.multiplyScalar( 5 );
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
        if (this.trail_initialized) this.trail_line.advance( this.position );
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
