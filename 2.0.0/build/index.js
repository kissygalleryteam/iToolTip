/*
combined files : 

kg/iToolTip/2.0.0/index

*/
﻿/**
 * @fileoverview 为图片添加图钉说明
 * @author Letao<mailzwj@126.com>
 * @module iToolTip
 **/
KISSY.add('kg/iToolTip/2.0.0/index',function (S, Node,Base) {
    var EMPTY = '';
    var $ = Node.all, D = S.DOM, E = S.Event;
    /**
     * 为图片添加图钉说明
     * @class IToolTip
     * @constructor
     * @extends Base
     */
    function IToolTip(cfg) {
        var self = this;
        //调用父类构造函数
        // IToolTip.superclass.constructor.call(self, cfg);
        /**
         * 参数说明
         * @thumbtack 图钉元素，使用kissy selector
         * @expandWidth 信息展开宽度，默认值225
         */
        self.tt = $(cfg.thumbtack);
        self.ew = cfg.expandWidth || 225;
        self.bcls = cfg.bodyClass || ".itt-body";
        self.init();
    }
    S.extend(IToolTip, Base, /** @lends IToolTip.prototype*/{
        init: function(){
            var _this = this;
            _this.tt.each(function(node, index){
                node.defaultWidth = node.width();
                node.parentWidth = node.parent().width();
                node.defaultLeft = parseInt(node.css("left"));
                _this.bindEvent(node);
            });
        },
        bindEvent: function(n){
            var _this = this;
            n.on("mouseenter", function(e){
                if(n.status && n.status.isRunning()){
                    n.status.stop();
                }
                //如果展开后会超出父容器右边界
                //则向左移回超出宽度
                var delta = {"width": _this.ew};
                if(n.defaultLeft + _this.ew > n.parentWidth){
                    delta.left = n.defaultLeft + (n.parentWidth - (n.defaultLeft + _this.ew));
                }
                n.status = new S.Anim(n, delta, 0.2, "easeOut", function(){
                    var nchild = n.one(_this.bcls);
                    if(nchild){
                        nchild.css("display", "block");
                        var h = nchild.height();
                        nchild.css("height", "0");
                        new S.Anim(nchild, {"height": h}, 0.15, "easeOut", function(){}).run();
                    }
                });
                n.status.run();
            }).on("mouseleave", function(e){
                if(n.status && n.status.isRunning()){
                    n.status.stop();
                }
                var delta = {"width": n.defaultWidth, "left": n.defaultLeft};
                n.status = new S.Anim(n, delta, 0.2, "easeOut", function(){
                    var nchild = n.one(_this.bcls);
                    if(nchild){
                        new S.Anim(nchild, {"height": 0}, 0.15, "easeOut", function(){
                            nchild.css({"height": "auto", "display": "none"});
                        }).run();
                    }
                });
                n.status.run();
            });
        }
    }, {ATTRS : /** @lends IToolTip*/{

    }});
    return IToolTip;
}, {requires:['node', 'base']});




