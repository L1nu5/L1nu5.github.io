const TL = '╔', TR = '╗', BL = '╚', BR = '╝', HZ = '═', VT = '║';
const HEAD = '●', BODY = '○', FOOD = '◉';
const G    = s => `\x1b[32m${s}\x1b[0m`;
const DIM  = s => `\x1b[2m${s}\x1b[0m`;
const Y    = s => `\x1b[33m${s}\x1b[0m`;
const R    = s => `\x1b[31;1m${s}\x1b[0m`;

const mv   = (r, c) => `\x1b[${r};${c}H`;
const HIDE = '\x1b[?25l';
const SHOW = '\x1b[?25h';
const CLR  = '\x1b[2J\x1b[H';

function randFood(snake, W, H) {
  while (true) {
    const pos = { x: Math.floor(Math.random() * W), y: Math.floor(Math.random() * H) };
    if (!snake.some(s => s.x === pos.x && s.y === pos.y)) return pos;
  }
}

export function startSnake(term, setGameHandler, onDone) {
  const W = Math.min(term.cols - 6, 52);
  const H = Math.min(term.rows - 8, 22);
  const OR = 3; // border row offset (1-indexed)
  const OC = 3; // border col offset

  let snake   = [{ x: Math.floor(W / 2), y: Math.floor(H / 2) }];
  let dir     = { x: 1, y: 0 };
  let nextDir = { x: 1, y: 0 };
  let food    = randFood(snake, W, H);
  let score   = 0;
  let alive   = true;

  const cell  = (x, y, ch, col = G) => mv(OR + 1 + y, OC + 1 + x) + col(ch);
  const blank = (x, y)              => mv(OR + 1 + y, OC + 1 + x) + ' ';

  function drawBoard() {
    let b = CLR + HIDE;
    b += mv(1, OC) + DIM('  SNAKE  ');
    b += mv(2, OC) + DIM(`  ${W}×${H} · WASD or arrows · Q to quit`);
    b += mv(OR, OC) + G(TL + HZ.repeat(W) + TR);
    for (let y = 0; y < H; y++) {
      b += mv(OR + 1 + y, OC) + G(VT) + ' '.repeat(W) + G(VT);
    }
    b += mv(OR + H + 1, OC) + G(BL + HZ.repeat(W) + BR);
    return b;
  }

  function scoreStr(s) {
    return mv(1, OC + 12) + DIM('score: ') + G(String(s));
  }

  function draw() {
    const buf = drawBoard()
      + cell(food.x, food.y, FOOD, Y)
      + cell(snake[0].x, snake[0].y, HEAD)
      + scoreStr(score)
      + HIDE;
    term.write(buf);
  }

  draw();

  const loop = setInterval(() => {
    if (!alive) return;
    dir = { ...nextDir };

    const h = snake[0];
    const nh = { x: h.x + dir.x, y: h.y + dir.y };

    if (nh.x < 0 || nh.x >= W || nh.y < 0 || nh.y >= H ||
        snake.some(s => s.x === nh.x && s.y === nh.y)) {
      alive = false;
      clearInterval(loop);
      setGameHandler(null);

      const mr = OR + 1 + Math.floor(H / 2);
      const mc = OC + 1 + Math.floor(W / 2);
      term.write(
        mv(mr - 1, mc - 6) + R(' GAME OVER ') +
        mv(mr,     mc - 8) + DIM(` Final score: ${score} `) +
        SHOW
      );
      setTimeout(() => { term.write(CLR + SHOW); onDone(); }, 2000);
      return;
    }

    snake.unshift(nh);
    const ateFood = nh.x === food.x && nh.y === food.y;

    let buf = cell(nh.x, nh.y, HEAD);
    if (snake.length > 1) buf += cell(snake[1].x, snake[1].y, BODY, s => `\x1b[38;2;0;180;40m${s}\x1b[0m`);

    if (ateFood) {
      score++;
      food = randFood(snake, W, H);
      buf += cell(food.x, food.y, FOOD, Y) + scoreStr(score);
    } else {
      const tail = snake.pop();
      buf += blank(tail.x, tail.y);
    }

    buf += HIDE;
    term.write(buf);
  }, 130);

  setGameHandler(({ domEvent }) => {
    const k = domEvent.key;
    if      ((k === 'ArrowUp'    || k === 'w' || k === 'W') && dir.y !== 1)  nextDir = { x: 0, y: -1 };
    else if ((k === 'ArrowDown'  || k === 's' || k === 'S') && dir.y !== -1) nextDir = { x: 0, y:  1 };
    else if ((k === 'ArrowLeft'  || k === 'a' || k === 'A') && dir.x !== 1)  nextDir = { x: -1, y: 0 };
    else if ((k === 'ArrowRight' || k === 'd' || k === 'D') && dir.x !== -1) nextDir = { x:  1, y: 0 };
    else if (k === 'q' || k === 'Q' || k === 'Escape') {
      alive = false;
      clearInterval(loop);
      setGameHandler(null);
      term.write(CLR + SHOW);
      onDone();
    }
  });
}
