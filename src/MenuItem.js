/**
 * Created by Razor <renze1983@163.com> on 2016/1/1.
 */
var MenuItem = function (text, handler, target) {
    var menuItem = new cc.MenuItemImage('res/btnNormal.png', 'res/btnActive.png', 'res/btnDisable.png', handler, target);

    text = text || '';
    var label = new cc.LabelTTF(text, "microsoft yahei", 36);
    label.setColor(cc.color(255, 255, 255));
    label.setPosition(menuItem.width / 2, menuItem.height /2 + 2);
    menuItem.addChild(label);

    return menuItem;
};