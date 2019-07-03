'use strict';

(function() {
    const pointsDiv = document.querySelector('.j-points');
    const statusDiv = document.querySelector('.j-status');
    const counterDiv = document.querySelector('.j-status');

    const config = {
        width: 10,
        height: 10,
        fieldColor: '#dca6d1',
        snakeColor: '#000',
        speedInit: 300,
        speedIncrease: 50,
        appleColor: '#dc5c61',
    };

    const field = {
        apple: false,
        apples: [],
        addApple: () => {
            const apple = {
                x: Math.floor(Math.random() * config.width),
                y: Math.floor(Math.random() * config.height),
            };

            if (snake.containsCoordinates(apple)) {
                console.log('Apple on Snake');
                field.addApple();
            } else if (!field.apple) {
                console.log('Apple added');
                field.apples.push(apple);
                const appleCell = document.querySelector(
                    `.rect[data-x="${apple.x}"][data-y="${apple.y}"]`
                );
                appleCell.style.backgroundColor = config.appleColor;
                field.apple = true;
            }
        },
        removeApple: toRemove => {
            field.apples = field.apples.filter(apple => {
                return apple.x !== toRemove.x && apple.y !== toRemove.y;
            });
        },
        outOfMap: coords => {
            return (
                coords.x < 0 ||
                coords.x >= config.width ||
                coords.y < 0 ||
                coords.y >= config.width
            );
        },
        init: () => {
            const field = document.querySelector('.j-field');
            field.innerHTML = ' ';

            for (let i = 0; i < config.height; i++) {
                var rowField = document.createElement('div');
                rowField.className = 'row';

                for (let j = 0; j < config.width; j++) {
                    var rect = document.createElement('div');
                    rect.className = 'rect';

                    rect.dataset.x = i;
                    rect.dataset.y = j;

                    rowField.appendChild(rect);
                }

                field.appendChild(rowField);
            }
        },
    };

    const snake = {
        body: [],
        init: () => {
            snake.body = [{ x: 5, y: 5 }];
            game.points = 0;
            pointsDiv.innerText = game.points;
            snake.draw();
            field.addApple();
        },
        containsCoordinates: coords => {
            return snake.body.filter(item => {
                return item.x === coords.x && item.y === coords.y;
            }).length;
        },
        draw: () => {
            snake.body.forEach(item => {
                const snakeBody = document.querySelector(
                    `.rect[data-x="${item.x}"][data-y="${item.y}"]`
                );
                snakeBody.style.backgroundColor = config.snakeColor;
            });
        },
        move: direction => {
            const head = Object.assign({}, snake.body[0]);

            switch (direction) {
                case 'up':
                    head.x = head.x - 1;
                    break;
                case 'down':
                    head.x = head.x + 1;
                    break;
                case 'left':
                    head.y = head.y - 1;
                    break;
                case 'right':
                    head.y = head.y + 1;
                    break;
            }

            if (field.outOfMap(head) || snake.containsCoordinates(head)) {
                game.gameOver();
            } else {
                snake.body.unshift(head);

                let snakeMove = (document.querySelector(
                    `.rect[data-x="${head.x}"][data-y="${head.y}"]`
                ).style.backgroundColor = config.snakeColor);

                if (!snake.eat()) {
                    const mapCoordinates = snake.body.pop();
                    snakeMove = document.querySelector(
                        `.rect[data-x="${mapCoordinates.x}"][data-y="${mapCoordinates.y}"]`
                    );
                    snakeMove.style.backgroundColor = config.fieldColor;
                }
            }
        },
        eat: () => {
            if (
                field.apples.filter(item => {
                    return (
                        item.x === snake.body[0].x && item.y === snake.body[0].y
                    );
                }).length
            ) {
                game.points++;
                game.pointsPrev = game.points;
                pointsDiv.innerText = game.points;
                console.log('Apple eaten');
                field.removeApple(snake.body[0]);
                field.apple = false;
                field.addApple();
                return true;
            }
        },
    };

    const game = {
        points: 0,
        pointsPrev: 0,
        counter: 0,
        speed: 0,
        state: 'paused',
        direction: 'right',
        timeout: undefined,
        timeoutAlt: undefined,
        run: () => {
            snake.move(game.direction);
        },
        setListeners: () => {
            document.addEventListener('keydown', e => {
                switch (e.key) {
                    case 'ArrowUp':
                        game.direction =
                            game.direction === 'down' || game.state === 'paused'
                                ? game.direction
                                : 'up';
                        break;
                    case 'ArrowDown':
                        game.direction =
                            game.direction === 'up' || game.state === 'paused'
                                ? game.direction
                                : 'down';
                        break;
                    case 'ArrowLeft':
                        game.direction =
                            game.direction === 'right' ||
                            game.state === 'paused'
                                ? game.direction
                                : 'left';
                        break;
                    case 'ArrowRight':
                        game.direction =
                            game.direction === 'left' || game.state === 'paused'
                                ? game.direction
                                : 'right';
                        break;
                    case ' ':
                        if (game.state === 'paused') {
                            game.state = 'started';
                            pointsDiv.innerText = '0';
                            console.log('started');
                            game.timeout = setInterval(() => {
                                game.counter++;
                                game.run();
                            }, config.speedInit);
                        }
                }

                if (
                    [
                        ' ',
                        'ArrowUp',
                        'ArrowDown',
                        'ArrowLeft',
                        'ArrowRight',
                    ].indexOf(e.key) > -1
                ) {
                    e.preventDefault();
                }
            });
        },
        init: () => {
            game.reset();
            game.setListeners();
        },
        reset: () => {
            game.counter = 0;
            game.direction = 'right';
            field.apple = false;
            field.init();
            snake.init();
            pointsDiv.innerText = game.pointsPrev;
        },
        logResult: () => {
            pointsDiv.innerText = game.points;
        },
        gameOver: () => {
            console.log('Game over');
            game.state = 'paused';
            clearInterval(game.timeout);
            game.timeout = undefined;
            game.logResult();
            game.init();
            console.clear();
        },
    };

    game.init();

    window.snake = snake;
    window.field = field;
    window.game = game;
})();
