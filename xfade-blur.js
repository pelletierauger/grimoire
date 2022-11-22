ssss = new Uint8Array(109 * 25 * 7 * 9);
for (let i = 0; i < sss.length; i++) {
            let nA = sss[i];
            let nB = Math.floor(Math.random() * 256);
            let nC = Math.floor(lerp(nA, nB, 0.25));
            ssss[i] = nC;
}

GrimoireEditor.prototype.xFadeCanvases = function(cA, xA0, yA0, xA1, yA1, cB, xB, yB, cC, xC, yC, interpolation) {
    cA = this.getTab(cA).canvas.data;
    cB = this.getTab(cB).canvas.data;
    cC = this.getTab(cC).canvas.data;
    interpolation = Math.floor(interpolation * 256);
    for (let i = yA0; i < yA1; i++) {
        for (let j = xA0; j < xA1; j++) {
            for (let k = 0; k < 7 * 9; k++) {
                let x = (j - xA0) * 7 + (k % 7);
                let y = (i - yA0) * 9 + Math.floor(k / 7);
                let oneD = x + (y * 109 * 7);
                let n = ssss[oneD];
                if ((Math.floor(n  * Math.random())) > interpolation) {
                    cC[yC + i - yA0][xC + j - xA0][k] = cA[i][j][k];
                } else {
                    cC[yC + i - yA0][xC + j - xA0][k] = cB[yB + i - yA0][xB + j - xA0][k];
                }
            }
        }
    }
};