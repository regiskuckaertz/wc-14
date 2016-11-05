// Size of a step forward
let step = 10;

export default function draw(container, rules, rotation, translation, angle) {
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
