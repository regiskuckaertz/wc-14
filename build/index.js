var Fractal = (function () {
'use strict';

/*
 * All the production rules do is replace each character with its expansion.
 * In other words, a global wildcard character regex replacement.
 * This is not a very efficient implementation thought. Given the recursive
 * nature of an L-system, dynamic programming by means of memoization and
 * lazy evaluation will yield much faster implementations.
 */
function fractal(V, P) {
    return (pattern) => pattern.replace(/./g, ($1) => replace($1, P));
}

function replace(symbol, rules) {
    return rules[symbol] || symbol;
}

// Size of a step forward
let step = 10;

function draw(container, rules, rotation, translation, angle) {
    let canvas = container.getContext('2d');
    let { width, height } = container.getBoundingClientRect();

    canvas.strokeStyle = 'black';

    // We give the canvas fixed dimensions otherwise the browser will apply
    // default values and skew the drawings
    container.width = width;
    container.height = height;

    return (pattern) => {
        let [ x, y ] = [ 0, 0 ];
        let stack = [];
        let direction = 0;

        canvas.clearRect(0, 0, width, height);
        canvas.save();
        canvas.translate( width * translation.X | 0, height * translation.Y | 0);
        canvas.rotate(rotation * Math.PI / 180);

        let charIndex = 0;
        let patternLength = pattern.length;

        // Drawing the pattern is an FSM, and so we walk over each character
        // and interpret its meaning.
        for( let char of pattern ) {
            switch( rules[char] ) {
            case 'forward':
                [ x, y ] = moveForward(canvas, direction, x, y);
                break;
            case 'right':
                direction = turnRight(direction, angle);
                break;
            case 'left':
                direction = turnLeft(direction, angle);
                break;
            case 'save':
                stack.push([ x, y, direction ]);
                break;
            case 'restore':
                [ x, y, direction ] = stack.pop();
                break;
            case 'color':
                changeColor(canvas, charIndex / patternLength);
                break;
            }
            charIndex += 1;
        }

        canvas.restore();
    }
}

function moveForward(canvas, direction, sX, sY) {
    let θ = direction * Math.PI / 180;
    let dX = sX + Math.sin(θ) * step;
    let dY = sY + Math.cos(θ) * step;

    canvas.beginPath();
    canvas.moveTo(sX, sY);
    canvas.lineTo(dX, dY);
    canvas.stroke();

    return [ dX, dY ];
}

function turnLeft(direction, angle) {
    return (direction - angle) % 360;
}

function turnRight(direction, angle) {
    return (direction + angle) % 360;
}

function changeColor(canvas, progress) {
    canvas.strokeStyle = `hsl(${progress * 360 | 0}, 50%, 50%)`;
}

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
};

function Fractal() {
    let S = document.getElementById('System');
    let rules = systems[S.value];
    let generator = fractal(rules.V, rules.P);
    let canvas = document.getElementById('Canvas');
    let drawer = draw(canvas, rules.V, rules.R, rules.T, rules.A);
    let stepper = document.getElementById('Next');
    let pattern = rules.ω;

    stepper.onclick = () => {
        drawer(pattern);
        pattern = generator(pattern);
    };

    S.onchange = () => {
        level = 0;
        rules = systems[S.value];
        generator = fractal(rules.V, rules.P);
        drawer = draw(canvas, rules.V, rules.R, rules.T, rules.A);
        pattern = rules.ω;
    };
}

return Fractal;

}());
