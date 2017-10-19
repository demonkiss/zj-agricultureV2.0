/* DockEye Menu 1.0
 * Copyright 2010 Machart Studios
 *
 * Free for private and commercial use
 * Do not remove this copyright message
 * www.machart-studios.de
 */
window.onload = function () {
    var deEl = document.getElementById('dockeye').getElementsByTagName('img');
    deW = deEl[0].width;
    function mmove(evt) {
        var posi = new Object();

        if (!evt) { posi.x = window.event.clientX; posi.y = window.event.clientY; } // IE
        else if (evt == 999) { posi.x = 1; posi.y = 1; }
        else { posi.x = evt.pageX + document.body.scrollLeft; posi.y = evt.pageY + document.body.scrollTop; } // Firefox
        for (var i = 0; i < deEl.length; i++) {
            var c = deW - Math.pow(Math.round(Math.sqrt(Math.pow((posi.x - (deEl[i].offsetLeft + document.getElementById('dockeye').offsetLeft) - deEl[i].offsetWidth / 2), 2) + Math.pow((posi.y - (deEl[i].offsetTop + document.getElementById('dockeye').offsetTop) - deEl[i].offsetHeight / 2), 2))), 2) / (deW * 4);
            deEl[i].style.width = ((c < (deW / 2)) ? (deW / 2) : c) + 'px';
            deEl[i].style.marginTop = deW - deEl[i].offsetHeight + 'px';
            deEl[i].style.visibility = 'visible';
        }
    }

    mmove(999);
    document.onmousemove = mmove;
    document.getElementById("dockeye").style.height = deW + "px";
}



