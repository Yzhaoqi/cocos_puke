cc.Class({
    extends: cc.Component,

    properties: {
        button: cc.Button
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        cc.director.preloadScene('pukeScene.fire', function(err, res){
            cc.log('Next Scene preloaded');
        })
    },

    jump_callback: function(event) {
        cc.director.loadScene('pukeScene.fire');
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
