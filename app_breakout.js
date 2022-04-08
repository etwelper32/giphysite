var canvas = document.getElementById("my_canvas");
//var increment_button = document.getElementById("increment");
var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height - 20;
var dx = 0;
var dy = 0; // defined in mouse listener
var ball_radius = 10;
var paddle_height = 10;
var paddle_width = 75;
// var paddle_x;
// var paddle_y;
var paddle_x = (canvas.width - paddle_width) / 2;
var paddle_y = canvas.height - paddle_height;
// paddle vars at the bottom in mouse listener
var right_pressed = false;
var left_pressed = false;
var brick_row_count = 3;
var brick_column_count = 5;
var brick_width = 75; //Math.floor(canvas.width / (brick_column_count + 2));
var brick_height = 20;
var brick_padding = 10;
var brick_offset_top = 30;
var brick_offset_left = 30;
var bricks = [];
var score = 0;
var lives = 3; // make it start on position and click then move on to tetris
var hit_second_row = false; // for incrementing speed
var hit_third_row = false;

function main() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw_bricks();
    draw_ball();
    draw_paddle();
    collision_detection();
    draw_score();
    draw_lives();
    key_movements();
    ball_movements();
    requestAnimationFrame(main);
}

for (var col = 0; col < brick_column_count; col++) {
    bricks[col] = [];
    for (var row = 0; row < brick_row_count; row++) {
        bricks[col][row] = { x: 0, y: 0, status: 1 };
    }
}
function draw_lives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095dd";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}
function draw_score() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score " + score, 8, 20);
}
function collision_detection() {
    for (var col = 0; col < brick_column_count; col++) {
        for (var row = 0; row < brick_row_count; row++) {
            var b = bricks[col][row];
            if (x > b.x && x < b.x + brick_width && y > b.y && y < b.y + brick_height && b.status == 1) {
                if (row == 1 && !hit_second_row) {
                    dy *= 1.2;
                    dx *= 1.2;
                    hit_second_row = true;
                }
                if (row == 2 && !hit_third_row) {
                    dy *= 1.2;
                    dx *= 1.2;
                    hit_third_row = true;
                }
                dy = -dy;
                b.status = 0;
                score++;
                if (score == brick_column_count * brick_row_count) {
                    alert("YOU WIN, Congratulations.");
                    document.location.reload();
                    clearInterval(interval);
                }
            }
        }
    }
}
function draw_bricks() {
    for (var col = 0; col < brick_column_count; col++) {
        for (var row = 0; row < brick_row_count; row++) {
            if (bricks[col][row].status == 1) {
                var brick_x = col * (brick_width + brick_padding) + brick_offset_left;
                var brick_y = row * (brick_height + brick_padding) + brick_offset_top;
                bricks[col][row].x = brick_x;
                bricks[col][row].y = brick_y;
                ctx.beginPath();
                ctx.rect(brick_x, brick_y, brick_width, brick_height);
                if (row == 0) {
                    ctx.fillStyle = "#02c900";
                }
                else if (row == 1) {
                    ctx.fillStyle = "#e20000"
                }
                else if (row == 2) {
                    ctx.fillStyle = "#ffa500"
                }
                else {
                    ctx.fillStyle = "#fabcbc"
                }
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function draw_paddle() {
    ctx.beginPath();
    ctx.rect(paddle_x, paddle_y, paddle_width, paddle_height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw_ball() {
    ctx.beginPath();
    ctx.arc(x, y, ball_radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function ball_movements() {
    if (x + dx > canvas.width - ball_radius || x + dx < ball_radius) {
        dx = -dx;
    }
    if (y + dy < ball_radius) {
        dy = -dy;
    }
    else if (y + dy > canvas.height - ball_radius) {
        if (x > paddle_x && x < paddle_x + paddle_width) {
            dy = -dy;
        }
        else {
            lives--;
            if (lives == 0) {
                alert("GAME OVER");
                document.location.reload();
                clearInterval(interval);
            }
            initial_position();
        }
    }
    x += dx;
    y += dy;
}
function initial_position() {
    x = canvas.width / 2;
    y = canvas.height - 20;
    dx = 0;
    dy = 0; // start over
    paddle_x = (canvas.width - paddle_width) / 2;
}
function key_movements() {
    if (right_pressed) {
        paddle_x += 7;
        if (paddle_x + paddle_width > canvas.width) {
            paddle_x = canvas.width - paddle_width;
        }
    }
    else if (left_pressed) {
        paddle_x -= 7;
        if (paddle_x < 0) {
            paddle_x = 0;
        }
    }
}
function key_down_handler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        right_pressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        left_pressed = true;
    }
}

function key_up_handler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        right_pressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        left_pressed = false;
    }
}
function mouse_move_handler(e) {
    var relative_x = e.clientX - canvas.offsetLeft;
    var relative_y = e.clientY;
    if (relative_x > 0 && relative_x < canvas.width && relative_y > 0 && relative_y < canvas.height) {
        if (relative_x > 0 + paddle_width / 2 && relative_x < canvas.width - paddle_width / 2) {
            paddle_x = relative_x - paddle_width / 2;
            // initial movement
            if (dx == 0 && dy == 0) {
                var ball_relative_x = e.clientX - canvas.offsetLeft;
                if (ball_relative_x > 0 + paddle_width / 2 && ball_relative_x < canvas.width - paddle_width / 2) {
                    x = ball_relative_x - ball_radius + 10;
                }
            }
        }
    }
}
function mouse_click_handler(e) {
    var relative_x = e.clientX - canvas.offsetLeft;
    var relative_y = e.clientY;
    if (dx == 0 && dy == 0 && relative_x > 0 && relative_x < canvas.width && relative_y > 0 && relative_y < canvas.height) {
        if (Math.round(Math.random())) {
            dx = 4;
        }
        else {
            dx = -4;
        }
        dy = 4;
    }
}
var btn_click_count = 0;
function increment_click_handler() {
    brick_row_count++;
    for (var col = 0; col < brick_column_count; col++) {
        bricks[col] = [];
        for (var row = 0; row < brick_row_count; row++) {
            bricks[col][row] = { x: 0, y: 0, status: 1 };
        }
    }
    initial_position();
}
// var interval = setInterval(draw, 10);
main();
document.addEventListener("keydown", key_down_handler, false);
document.addEventListener("keyup", key_up_handler, false);
document.addEventListener("mousemove", mouse_move_handler, false);
document.addEventListener("click", mouse_click_handler, false);
document.getElementById("increment_btn").addEventListener("click", increment_click_handler, false);