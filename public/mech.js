import createScene from 'gl-plot3d';
import createSurfacePlot from 'gl-surface3d';
import ndarray from 'ndarray';
import fill from 'ndarray-fill';

let button = document.body.getElementsByClassName('count')[0];

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
    document.body.appendChild(DAnswer);

    const f0 = Math.PI / (2 * Math.pow(len, 2)) * (1 + Math.pow(len, 2) / Math.pow(wid, 2)) * Math.sqrt(D * len * wid / weight);

    let f0Answer = document.createElement('div');
    f0Answer.innerText = `Собственная частота: ${f0}`;

    document.body.appendChild(f0Answer);

    const counts = 45;
    let field = ndarray(new Float32Array(counts * counts), [counts, counts]);

    const w = 2 * Math.PI * f0;

    const a0 = 5 * 9.8; // амлитуда виброускорения краев пластины
    const E0 = a0 / Math.pow(w, 2);//амплитуда виброперемещения
    const nu11 = 1; //коэффициент расстройки
    const decrZatuh = 600; // декремент хатухания
    // const e11 = decrZatuh / Math.PI; // показатель затухания
    const e11 = Math.pow(Math.PI, 2) * 1.81 * Math.pow(10, -5) / Math.sqrt(D * weight); // показатель затухания
    console.log(e11)
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
            // console.info(Kx, Ky, Kx * Ky);
            // console.log((Math.pow((1 + (Kx * Ky - 1)), 2) + Math.pow(e11, 2)), (Math.pow(e11, 2)))
            gamma[index].push(Math.sqrt((Math.pow((1 + (Kx * Ky - 1)), 2) + Math.pow(e11, 2)) /
                (Math.pow(e11, 2)))); //коэффициент передачи по ускорению
            av[index].push(a0 * gamma[index]);
            Sv[index].push(E0 * gamma[index]);
        })
    })

    let scene = createScene({
        // bounds: [[0, 0, 0], [counts, counts, 8000]],
        axes: {
            bounds: [[0, 0, 0], [9, 9, 10000]],
            tickSpacing: [0.05, 0.05, 2000]
        },
        // spikes: {bounds: [[0, 0, 0], [9, 9, 10000]]},
        // autoBounds: false,
    });

    fill(field, function (x, y) {
        return gamma[x][y] / 100
    });

    console.info(scene.axes.update);
    console.info(scene.redraw);

    console.info(field);

    let surface = createSurfacePlot({
        gl: scene.gl,
        field: field,
        contourProject: true
    });

    console.info(surface)
    scene.add(surface);
    debugger
    // scene.axes.update({
    //     bounds: [[0, 0, 0], [9, 9, 8]],
    //     tickSpacing: [1, 1, 2],
    //     lineTickLength : [10, 10, 10],
    //     lineTickEnable: true
    // })
    console.info(scene)
});
