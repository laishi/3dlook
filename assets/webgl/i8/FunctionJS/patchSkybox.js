pc.script.create('patchSkybox', function (app) {
    // Creates a new PatchSkybox instance
    var PatchSkybox = function (entity) {
        this.entity = entity;
    };

    PatchSkybox.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            
            // Original version, but a bit darker
            pc.shaderChunks.skyboxHDRPS = "\
            varying vec3 vViewDir;\
            uniform samplerCube texture_cubeMap;\
            void main(void) {\
                vec3 color = processEnvironment($textureCubeSAMPLE(texture_cubeMap, fixSeamsStatic(vViewDir, $FIXCONST)).rgb);\
                color = toneMap(color * 0.2);\
                color = gammaCorrectOutput(color);\
                gl_FragColor = vec4(color, 1.0);\
            }";
            
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return PatchSkybox;
});