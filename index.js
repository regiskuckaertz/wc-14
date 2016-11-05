import system from './pattern';
import draw from './draw';

let systems = {
    koch: {
        // Variables and constants of the L-system
        V: {
            'F': 'forward',
            '+': 'left',
            '-': 'right',
            'C': 'color'
        },
        // Initial pattern
        ω: 'CF',
        // Production rules
        P: {
            F: 'CF+CF-CF-CF+CF'
        },
        // Canvas rotation
        R: 90,
        // Canvas translation ratios
        T: { X: 1, Y: 1 },
        // Turn angle
        A: 90
    },
    sierpinski: {
        V: {
            'F': 'forward',
            'G': 'forward',
            '+': 'left',
            '-': 'right',
            'C': 'color'
        },
        ω: 'CF-G-G',
        P: {
            F: 'CF-G+CF+G-CF',
            G: 'GG'
        },
        R: -90,
        T: { X: 0, Y: 1 },
        A: 120
    },
    sierpinski2: {
        V: {
            'F': 'forward',
            'G': 'forward',
            '+': 'left',
            '-': 'right',
            'C': 'color'
        },
        ω: 'CF',
        P: {
            F: '+G-F-G+',
            G: '-CF+G+CF-'
        },
        R: 90,
        T: { X: 1, Y: 1 },
        A: 60
    },
    dragon: {
        V: {
            'X': null,
            'Y': null,
            '+': 'right',
            '-': 'left',
            'F': 'forward',
            'C': 'color'
        },
        ω: 'CFX',
        P: {
            X: 'X+YCF+',
            Y: '-CFX-Y'
        },
        R: 0,
        T: { X: .5, Y: .5 },
        A: 90
    },
    plant: {
        V: {
            'X': null,
            'F': 'forward',
            '-': 'left',
            '+': 'right',
            '[': 'save',
            ']': 'restore',
            'C': 'color'
        },
        ω: 'X',
        P: {
            X: 'CF-[[X]+X]+CF[+CFX]-X',
            F: 'CFCF'
        },
        R: 225,
        T: { X: 0, Y: 1 },
        A: 25
    }
}

export default function Fractal() {
    let S = document.getElementById('System');
    let rules = systems[S.value];
    let generator = system(rules.V, rules.P);
    let canvas = document.getElementById('Canvas');
    let drawer = draw(canvas, rules.V, rules.R, rules.T, rules.A);
    let stepper = document.getElementById('Next');
    let pattern = rules.ω;

    stepper.onclick = () => {
        drawer(pattern);
        pattern = generator(pattern);
    }

    S.onchange = () => {
        level = 0;
        rules = systems[S.value];
        generator = system(rules.V, rules.P);
        drawer = draw(canvas, rules.V, rules.R, rules.T, rules.A);
        pattern = rules.ω;
    }
}
