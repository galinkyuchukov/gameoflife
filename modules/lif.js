var fs  = require('fs');

function lifParser(options){

    var defaults = {
        width: 600,
        height:400,
        speed:40,
        cellsize: 2,
        randomize: true,
    };

    options = Object.assign({}, defaults, options);

    var rawArray = [];

    var cellsRow;
    var cellsCol;
    var middleWidth;
    var middleHeight;

    var cells = {};

    return {

        load: function(filename){
            var liftxt = fs.readFileSync(filename, 'utf8');
            rawArray = liftxt.split('#P').slice(1);

            return this;
        },

        prepare: function(){
            cellsRow = Math.round(options.width/options.cellsize);
            cellsCol = Math.round(options.height/options.cellsize);
            middleWidth = Math.round(cellsRow/2);
            middleHeight = Math.round(cellsCol/2);

            return;
        },

        makeRawArray: function(){
            for(let x = 1; x <= cellsRow; x++){
                    cells[x] = {};
                for(let y = 1; y <= cellsCol; y++){
                    cells[x][y] = 0;
                }
            }

            return;
        },

        parseCellBlocks: function(){

            this.prepare();
            this.makeRawArray();

            rawArray.forEach(function(element, index){
                
                var rawLines = element.split('\n');
                var rawCoordinates = rawLines[0].trim().split(' ');
                var blockContent = rawLines.slice(1).filter(function(str){ return str.length > 0 });

                var coordinates = [middleWidth + parseInt(rawCoordinates[0]), middleHeight + parseInt(rawCoordinates[1])];

                this.populateBlock(coordinates, blockContent);

            }.bind(this));

            return this;
        },

        populateBlock: function(coordinates, blockContent){
            
            var y = coordinates[1];

            blockContent.forEach(function(row, ci){

                var x = coordinates[0];

                row.split('').forEach(function(col, ri){
                    
                    if(typeof cells[x] != 'undefined' && typeof cells[x][y] != 'undefined'){
                        if(col == '.'){
                            cells[x][y] = 0;
                        } else if (col == '*') {
                            cells[x][y] = 1
                        } else {
                            cells[x][y] = 0;
                        }
                    }
                    
                    x += 1;
                });

                y += 1;

            });

            return;
        },

        result: function(){
            return cells;
        }
        
    }
}

module.exports = lifParser;