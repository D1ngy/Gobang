/**
 * DOM 版五子棋 视图类
 * Author: D1ngy
 * Created: 2017-02-22
 */
//棋盘
var ChessBoard = {
	'canvas' : document.getElementsByClassName('wrapper')[0],
	'boardSize' : 15,//棋盘格数
	'gridSize' : 40,//格子大小
	'createGrid' :function(){//创建格子
		var bSize = this.boardSize;
		var rSize = this.gridSize;
		var grid = document.createElement('div');
		ChessBoard.canvas.setAttribute('style','width:'+bSize*rSize+'px;height:'+bSize*rSize+'px');
		grid.setAttribute('class','grid');
		grid.setAttribute('style','width:'+(rSize-2)+'px;height:'+(rSize-2)+'px');
		ChessBoard.canvas.appendChild(grid);
		return ChessBoard.canvas;
	},
	'createChessboard' :function(){//创建棋盘
		ChessBoard.canvas.innerHTML = '';
		Rule.createBoardArr();
		for(var i = 0; i<this.boardSize*this.boardSize; i++){
			this.createGrid();
		}
	}
};

//棋子
var Chess = {
	'isBlack' : true,//是否为黑子
	'createChess' : function(x,y){//创建棋子
		var chess = document.createElement('div');
		if(this.isBlack){
			chess.setAttribute('class','black');
		}else{
			chess.setAttribute('class','white');
		}
		var chessSize = ChessBoard.gridSize;
		chess.setAttribute('style','left:'+(x*chessSize-chessSize/2)+'px;top:'+(y*chessSize-chessSize/2)+'px; width:'+(chessSize-5)+'px;height:'+(chessSize-5)+'px;border-radius:'+(chessSize-5)+'px;');
		ChessBoard.canvas.appendChild(chess);
		return ChessBoard.canvas;
	},
	'delChess': function(){//删除最后一颗棋子		
		ChessBoard.canvas.removeChild(ChessBoard.canvas.lastChild);
	}
};