class canvasBase {
  constructor(options) {
    this.options = options;
  }
}
export default class canvas extends canvasBase {
  constructor(options) {
    super(options);
    this.el = {
      $curCanvas: $('#canvas'),
    };
    this.__createCanvas();
  }
  __createCanvas() {
    let x = $('#canvas')[0].getContext('2d');
    // x.fillRect(50, 40, 55, 55);
    // x. strokeRect(150, 70, 55, 55);
    // x.clearRect(68, 57, 20, 20);

    // x.beginPath();
    // x.moveTo(20, 20,);
    // x.lineTo(70,70);
    // x.lineTo(20,70);
    // x.closePath();
    // x.fill();

    // x.fillStyle="green";
    // x.fillRect(10,40,65,65);
    // x.strokeStyle="#FF45FF"
    // x.strokeRect(100,40,65,65);
    // x.fillStyle="rgb(255,73,73)"
    // x.fillRect(190,40,65,65);

    // x.beginPath()
    // x.moveTo(10,10);
    // x.lineWidth=15;
    // x.lineJoin='round';
    // x.lineTo(50,50);
    // x.lineTo(100,10);
    // x.lineTo(170,80);
    // x.lineTo(210,40);
    //

    // var grad = x.createLinearGradient(50,50,150,150);
    // grad.addColorStop(0.0,'#d2006b');
    // grad.addColorStop(0.5,'#00a779');
    // grad.addColorStop(1.0,'#ffe800');
    // x.fillStyle=grad;
    // x.fillRect(20,20,190,150);

    // x.shadowOffsetX=3;
    // x.shadowOffsetY=3;
    // x.shadowBlur=5;
    // x.shadowColor='black';
    // x.fillStyle='#ffaa00';
    // x.fillRect(50,40,55,55);

    x.font = '15px Verdana';
    x.fillStyle = '#60016d';
    x.fillText('Теперь Вы можете отображать', 10, 40);
    x.font = '25px Arial';
    x.fillStyle = '#007439';
    x.fillText('произвольный текст', 10, 80);
    x.fillStyle = '#a67800';
    x.font = '20px Comic Sans MS';
    x.fillText('в элементе canvas.', 50, 120);
  }
}
