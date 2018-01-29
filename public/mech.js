import createScene from 'gl-plot3d';
import createSurfacePlot from 'gl-surface3d';
import ndarray from 'ndarray';
import fill from 'ndarray-fill';

let button = document.body.getElementsByClassName('count')[0];
let result = document.body.getElementsByClassName('result')[0];

const counts = 45;

let formVibrate = document.body.getElementsByClassName('form-vibrate')[0];
let fieldFormVibrate = ndarray(new Float32Array(counts * counts), [counts, counts]);

let vibroAcceler = document.body.getElementsByClassName('vibro-acceler')[0];
let fieldVibroAcceler = ndarray(new Float32Array(counts * counts), [counts, counts]);

let vibroMove = document.body.getElementsByClassName('vibro-move')[0];
let fieldVibroMove = ndarray(new Float32Array(counts * counts), [counts, counts]);

button.addEventListener('click', (event) => {
    event.preventDefault();
    const len = +document.getElementById('len').value;
    const wid = +document.getElementById('wid').value;
    const thin = +document.getElementById('thin').value;
    const weight = +document.getElementById('weight').value;
    const bounce = +document.getElementById('bounce').value;
    const puas = +document.getElementById('puas').value;

    const D = bounce * Math.pow(10, 10) * Math.pow(thin, 3) / (12 * (1 - Math.pow(puas, 2)));

    let DAnswer = document.createElement('div');
    DAnswer.innerText = `Цилиндрическая жесткость: ${D}`;
    result.appendChild(DAnswer);

    const f0 = Math.PI / (2 * Math.pow(len, 2)) * (1 + Math.pow(len, 2) / Math.pow(wid, 2)) * Math.sqrt(D * len * wid / weight);

    let f0Answer = document.createElement('div');
    f0Answer.innerText = `Собственная частота: ${f0}`;

    result.appendChild(f0Answer);

    const w = 2 * Math.PI * f0;

    const a0 = 5 * 9.8; // амлитуда виброускорения краев пластины
    const E0 = a0 / Math.pow(w, 2);//амплитуда виброперемещения
    const nu11 = 1; //коэффициент расстройки
    // const decrZatuh = 600; // декремент хатухания
    // const e11 = decrZatuh / Math.PI; // показатель затухания
    const e11 = Math.pow(Math.PI, 2) * 1.81 * Math.pow(10, -5) / Math.sqrt(D * weight); // показатель затухания

    let e11Answer = document.createElement('div');
    e11Answer.innerText = `Показатель затухания: ${e11}`;
    result.appendChild(e11Answer);

    let x = Array.apply(null, {length: counts}).map((num, index) => index * len / counts);
    let y = Array.apply(null, {length: counts}).map((num, index) => index * len / counts);
    let gamma = [],
        av = [],
        Sv = [];
    x.forEach((numx, index) => {
        numx /= len;
        const Kx = 0.00711504 + 1.05143 * numx - 22.44 * Math.pow(numx, 2) + 364.434 * Math.pow(numx, 3)
            - 1646.47 * Math.pow(numx, 4) + 3574.17 * Math.pow(numx, 5) - 4174.28 * Math.pow(numx, 6)
            + 2517.49 * Math.pow(numx, 7) - 613.95 * Math.pow(numx, 8); // коэффициент формы колебнания
        av.push([]);
        Sv.push([]);
        gamma.push([]);
        y.forEach(numy => {
            numy /= wid;
            const Ky = 0.00711504 + 1.05143 * numy - 22.44 * Math.pow(numx, 2) + 364.434 * Math.pow(numx, 3)
                - 1646.47 * Math.pow(numx, 4) + 3574.17 * Math.pow(numx, 5) - 4174.28 * Math.pow(numx, 6)
                + 2517.49 * Math.pow(numx, 7) - 613.95 * Math.pow(numx, 8); // коэффициент формы колебнания
            gamma[index].push(Math.sqrt((Math.pow((1 + (Kx * Ky - 1)), 2) + Math.pow(e11, 2)) /
                (Math.pow(e11, 2)))); //коэффициент передачи по ускорению
            av[index].push(a0 * gamma[index][gamma[index].length - 1]);
            Sv[index].push(E0 * gamma[index][gamma[index].length - 1]);
        })
    })

    let sceneFormVibrate = createScene({
        // bounds: [[0, 0, 0], [counts, counts, 8000]],
        canvas: formVibrate,
        axes: {
            bounds: [[0, 0, 0], [9, 9, 10000]],
            tickSpacing: [0.05, 0.05, 2000]
        },
        autoResize: false,
    });

    let sceneVibroAcceler = createScene({
        // bounds: [[0, 0, 0], [counts, counts, 8000]],
        canvas: vibroAcceler,
        axes: {
            bounds: [[0, 0, 0], [9, 9, 10000]],
            tickSpacing: [0.05, 0.05, 2000]
        },
        autoResize: false,
    });

    let sceneVibroMove = createScene({
        // bounds: [[0, 0, 0], [counts, counts, 8000]],
        canvas: vibroMove,
        axes: {
            bounds: [[0, 0, 0], [9, 9, 10000]],
            tickSpacing: [0.05, 0.05, 2000]
        },
        autoResize: false,
    });

    fill(fieldFormVibrate, function (x, y) {
        return gamma[x][y] / 1000
    });

    fill(fieldVibroAcceler, function (x, y) {
        return av[x][y] / 10000
    });

    fill(fieldVibroMove, function (x, y) {
        return Sv[x][y] * 100
    });

    let surfaceFormVibrate = createSurfacePlot({
        gl: sceneFormVibrate.gl,
        field: fieldFormVibrate,
        contourProject: true
    });

    sceneFormVibrate.add(surfaceFormVibrate);

    let surfaceVibroAcceler = createSurfacePlot({
        gl: sceneVibroAcceler.gl,
        field: fieldVibroAcceler,
        contourProject: true
    });

    sceneVibroAcceler.add(surfaceVibroAcceler);

    let surfaceVibroMove = createSurfacePlot({
        gl: sceneVibroMove.gl,
        field: fieldVibroMove,
        contourProject: true
    });

    sceneVibroMove.add(surfaceVibroMove);
    debugger
    sceneFormVibrate.axes.update({
        ticks: [[{
            x: 10,
            text: '20'
        }], [{
            x: 10,
            text: '20'
        }], [{
            x: 10,
            text: '20'
        }]]
    })

    sceneVibroAcceler.axes.update({
        ticks: [[{
            x: 20,
            text: '20'
        }], [{
            x: 20,
            text: '20'
        }], [{
            x: 20,
            text: '20'
        }]]
        //     bounds: [[0, 0, 0], [9, 9, 8]],
        //     tickSpacing: [1, 1, 2],
        //     lineTickLength : [10, 10, 10],
        //     lineTickEnable: true

    })
});
