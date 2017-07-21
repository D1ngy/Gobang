/**
 * canvas版五子棋
 * Author: D1ngy
 * Created: 2017-02-23
 */
var canvas = document.getElementById('board');
var board = canvas.getContext('2d');
//棋盘
var ChessBoard = {
	'canvas' : canvas,
	'boardSize' : 15,//棋盘格数
	'gridSize' : 40,//格子大小
	'createLine' :function(i){//创建格子线
		board.beginPath();
		//水平线
		board.moveTo(0,ChessBoard.gridSize*i);
		board.lineTo(ChessBoard.boardSize*ChessBoard.gridSize,ChessBoard.gridSize*i);
		//垂直线
		board.moveTo(ChessBoard.gridSize*i,0);
		board.lineTo(ChessBoard.gridSize*i,ChessBoard.boardSize*ChessBoard.gridSize);
		board.stroke();
	},
	'createChessboard' : function(){//创建棋盘
		board.fillStyle = "#DB8900";
		board.fillRect(0,0,ChessBoard.boardSize*ChessBoard.gridSize,ChessBoard.boardSize*ChessBoard.gridSize);
		//描画格子线
		for(var i = 0; i<=ChessBoard.boardSize; i++){
			this.createLine(i);
		}
		Rule.createBoardArr();
	},
};

//棋子
var Chess = {
	'isBlack' : true,//是否为黑子
	'createChess':function(x,y){
		board.beginPath();
		board.fillStyle = this.isBlack?'#333':'#fff';
		board.arc(x*ChessBoard.gridSize,y*ChessBoard.gridSize,(ChessBoard.gridSize/2)-2,0,Math.PI*2);
		board.closePath();
		board.fill();
	},
	'delChess' : function(x,y){	//移除棋子	
		var s = ChessBoard.gridSize;
		var left = ChessBoard.gridSize*x;
		var top = ChessBoard.gridSize*y;
		board.clearRect(left-s/2,top-s/2,s,s);
		board.fillStyle = '#DB8900';
		board.fillRect(left-s/2,top-s/2,s,s);
		board.beginPath();
		//水平线
		board.moveTo(left-s/2,top);
		board.lineTo(left+s/2,top);
		//垂直线
		board.moveTo(left,top-s/2);
		board.lineTo(left,top+s/2);
		//完成
		board.stroke();
	},
};