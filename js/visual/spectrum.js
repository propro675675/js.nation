let Spectrum = new function() {

    this.setUp = function() {
        Nodes.addCallback(drawCallback);
    }

    let drawCallback = function(spectrum) {
        let baseRad = Emblem.getRadius();

        let points = [];

        Canvas.context.beginPath();

        let len = spectrum.length;
        for (let i = 0; i < len; i++) {
            t = Math.PI * (i / len) - (Math.PI / 2);
            r = baseRad + spectrum[i] * Config.spectrumHeightScalar;
            x = r * Math.cos(t);
            y = r * Math.sin(t);
            points.push({x: x, y: y});
        }

        drawPoints(points, false);
        drawPoints(points, true);
    }

    let drawPoints = function(points, neg) {
        let halfWidth = $(window).width() / 2;
        let halfHeight = $(window).height() / 2;

        let xMult = neg ? -1 : 1;

        Canvas.context.moveTo(xMult * points[0].x + halfWidth, points[0].y + halfHeight);

        let len = points.length;
        for (let i = 1; i < len - 2; i++) {
            let c = xMult * (points[i].x + points[i + 1].x) / 2 + halfWidth;
            let d = (points[i].y + points[i + 1].y) / 2 + halfHeight;
            Canvas.context.quadraticCurveTo(xMult * points[i].x + halfWidth, points[i].y + halfHeight, c, d);
        }
        Canvas.context.quadraticCurveTo(xMult * points[len - 2].x + halfWidth, points[len - 2].y + halfHeight,
                xMult * points[len - 1].x + halfWidth, points[len - 1].y + halfHeight);
        Canvas.context.fill();
        Canvas.context.closePath();
    }

}