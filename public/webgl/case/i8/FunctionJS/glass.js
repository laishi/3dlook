pc.script.attribute('onlyMaterial', 'string', "");

pc.script.create('glass', function (app) {
    var Glass = function (entity) {
        this.entity = entity;
    };

    Glass.prototype = {
        initialize: function () {
            var meshes = this.entity.model.model.meshInstances;
            var chunks = pc.shaderChunks;
            for(var i=0; i<meshes.length; i++) {
                var mat = meshes[i].material;
                if (this.onlyMaterial !== "" && this.onlyMaterial !== mat.name) continue;
                
                // Make bright things less transparent
                mat.chunks.endPS = 
                "gl_FragColor.rgb = combineColor(data);\
                gl_FragColor.rgb += getEmission(data);\
                gl_FragColor.rgb = addFog(data, gl_FragColor.rgb);\
                float aboveOne = dot(gl_FragColor.rgb, vec3(0.2125, 0.7154, 0.0721)) + 1.0;\
                gl_FragColor.rgb = toneMap(gl_FragColor.rgb);\
                gl_FragColor.rgb = gammaCorrectOutput(gl_FragColor.rgb);"
                
                // mask glossiness
                mat.chunks.glossTexConstPS =
                "uniform sampler2D texture_glossMap;\
                uniform float material_shininess;\
                void getGlossiness(inout psInternalData data) {\
                    data.glossiness = saturate(material_shininess + texture2D(texture_glossMap, $UV).$CH);\
                }";

                mat.chunks.endPS += "data.alpha *= aboveOne;";
                
                mat.update();
            }
            
        }
    };

    return Glass;
});