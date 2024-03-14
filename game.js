document.addEventListener('DOMContentLoaded', function() {
    const boardSize = 50; // 网格的大小
    let board = document.getElementById('gameBoard');
    let resetButton = document.getElementById('resetButton');
    let nextStepButton = document.getElementById('nextStepButton');
    let runButton = document.getElementById('runButton');
    let cells = []; // 用于存储细胞状态
    let intervalId = null; // 用于存储周期性更新的ID

    // 初始化或重置游戏板
    function initializeBoard() {
        board.innerHTML = '';
        cells = [];
        for (let i = 0; i < boardSize * boardSize; i++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.addEventListener('click', function() {
                this.classList.toggle('alive');
                cells[i] = !cells[i]; // 更新细胞状态
            });
            board.appendChild(cell);
            cells.push(false); // 默认所有细胞都是死的
        }
    }

    // 游戏逻辑：计算下一个状态
    function nextGeneration() {
        let newCells = [];
        for (let i = 0; i < cells.length; i++) {
            const x = i % boardSize;
            const y = Math.floor(i / boardSize);
            const neighbors = getAliveNeighbors(x, y);
            if (cells[i]) {
                newCells[i] = neighbors === 2 || neighbors === 3;
            } else {
                newCells[i] = neighbors === 3;
            }
        }
        cells = newCells.slice();
        updateBoard();
    }

    // 更新游戏板
    function updateBoard() {
        for (let i = 0; i < boardSize * boardSize; i++) {
            if (cells[i]) {
                board.children[i].classList.add('alive');
            } else {
                board.children[i].classList.remove('alive');
            }
        }
    }

    // 获取活邻居的数量
    function getAliveNeighbors(x, y) {
        let count = 0;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue; // 跳过自己
                const nx = x + dx, ny = y + dy;
                if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && cells[nx + ny * boardSize]) {
                    count++;
                }
            }
        }
        return count;
    }

    nextStepButton.addEventListener('click', function() {
        nextGeneration(); // 更新到下一代
    });

    // 绑定运行按钮事件
    runButton.addEventListener('click', function() {
        // 如果游戏已经在运行，则停止
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
            runButton.textContent = '运行'; // 更改按钮文本为“运行”
        } else {
            intervalId = setInterval(nextGeneration, 500); // 每1000毫秒（1秒）更新一次
            runButton.textContent = '停止'; // 更改按钮文本为“停止”
        }
    });
    
    resetButton.addEventListener('click', function() {
        // 如果游戏正在自动运行，则停止
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
            runButton.textContent = '运行'; // 更改运行按钮文本回到“运行”
        }
        
        // 清除游戏板并重新初始化细胞状态
        initializeBoard();
    });
});



