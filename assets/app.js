function createWorld(name, options) {

    Object.defineProperty(options, 'fileCells', {
        enumerable: false,
    });

    var world = document.getElementById(name);
    var log_container = document.getElementById('log');
    var genCount = document.getElementById('genCount');

    addLog('Start ...');

    if(world){
        addLog('Canvas OK');
    } else {
        addLog('Canvas Not Found! Exiting ...', 'red');
        return false;
    }

    for(var key in options){
        addLog(`&nbsp;&nbsp;&nbsp;<b>${key} = ${options[key]}</b>`);
    }

    log_container.style.height = `${options.height}px`;

    var pixelCells = {};
    var pixelCellsTemp = {};
    
    return {
        
        state: 'stop',
        generations: 0,
        cellsRow: 0,
        cellsCol: 0,

        initialize: function(){
            addLog('Initializing ...');

            this.cellsRow = options.width/options.cellsize;
            this.cellsCol = options.height/options.cellsize

            world.width = options.width;
            world.height = options.height;
            world.style.width = `${options.width}px`;
            world.style.height = `${options.height}px`;

            if(options.fileCells) {
                pixelCells = options.fileCells;
            } else {
                for(var x = 1; x <= this.cellsRow; x++){
                    pixelCells[x] = {};
                    for(var y = 1; y <= this.cellsCol; y++){
                        pixelCells[x][y] = (options.randomize === true ? Math.floor(Math.random() * 9) % 2 : 0);
                    }
                }
            }

            addLog((this.cellsRow*this.cellsCol).toString() + ' cells OK');

            return this;
        },

        run: function(){
            this.evolve();

            if(this.state === 'start'){
                setTimeout(function() {
                    requestAnimationFrame(this.run.bind(this));
                }.bind(this), options.speed);
            }
            
        },

        control: function(btn){
            this.state = (this.state == 'stop' ? 'start' : 'stop');

            if(this.state === 'start'){
                addLog('Auto Run - On!', '#216f21');
                btn.innerHTML = 'Stop';
                this.run();
            } else {
                addLog('Auto Run - Off!', '#ff0000');
                btn.innerHTML = 'Start';
            }
        },

        render: function(){

            var world_context = world.getContext("2d");
            world_context.clearRect(0, 0, options.width, options.height);
            for (var x = 1; x <= this.cellsRow; x++) {
                for (var y = 1; y <= this.cellsCol; y++) {
                    if (pixelCells[x][y] === 1) {
                        world_context.fillStyle = "#000000";
                        world_context.fillRect(x*options.cellsize, y*options.cellsize, options.cellsize, options.cellsize);
                    }
                }
            }

            genCount.innerHTML = parseInt(++this.generations);

            return this;
        },

        evolve: function(){

            for (var x = 1; x <= this.cellsRow; x++) {
                
                pixelCellsTemp[x] = {};
                
                for (var y = 1; y < this.cellsRow; y++) {
                    
                     pixelCellsTemp[x][y] = pixelCells[x][y];

                    condition = this.calc(x, y);

                    if(pixelCells[x][y] === 0 && condition === 3){
                        pixelCellsTemp[x][y] = 1;
                    }

                    if(pixelCells[x][y] === 1){
                        if(condition > 1 && condition <= 3){
                            pixelCellsTemp[x][y] = 1;
                        } else {
                            pixelCellsTemp[x][y] = 0;
                        }
                    }

                }
            }

            pixelCells = pixelCellsTemp;
            pixelCellsTemp = {};

            this.render();

            return;
        },

        calc: function(x, y){
            var condition = 0;

            condition += this.getElement(x-1, y-1);
            condition += this.getElement(x,y-1); 
            condition += this.getElement(x+1,y-1);
            

            condition += this.getElement(x+1,y);

            condition += this.getElement(x+1,y+1);
            condition += this.getElement(x,y+1);
            condition += this.getElement(x-1,y+1);

            condition += this.getElement(x-1,y);

            return condition;
        },

        getElement: function(tx,ty){

            if(typeof pixelCells[tx] != 'undefined' && typeof pixelCells[tx][ty] != 'undefined'){
                return pixelCells[tx][ty];
            }

            return 0;
        },

    }

    function addLog(message, color='#333'){
        log_container.innerHTML += `<p style="color:${color}">${message}</p>`;
        log_container.scrollTop = log_container.scrollHeight;
    }
}

