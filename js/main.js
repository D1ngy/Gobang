/**
 * 五子棋 规则操作类
 * Author: D1ngy
 * Created: 2017-02-22
 */

//提示信息
var Message = {
	'blackWin' : '恭喜黑子获胜！',
	'whiteWin' : '恭喜白子获胜！',
	'unlawfulness' : '不能在此位置下棋',
	'gameOver' : '游戏已结束，请重新开始',
	'blackNext' : '黑子请下棋',
	'whiteNext' : '白子请下棋',
	'noRetraction' : '不可以悔棋',
	'noRecall' : '没有可撤销的悔棋',
	'isReset' : '确定重新开始吗？',
	'hint' : function(){
		//提示信息
		var hint = document.getElementById('hint');
		hint.innerHTML = Chess.isBlack?this.blackNext:this.whiteNext;
	}
};

//规则
var Rule = {
	'isOver' : false,//游戏是否结束
	'steps' : 0,//当前步数
	'boardArr' : new Array(15),//棋盘信息数组
	'createBoardArr' : function(){
		var size = ChessBoard.boardSize+1;
		var arr = this.boardArr;
		for(var i = 0; i<size; i++){
			arr[i] = new Array(size);
			//初始化棋盘信息，未下的位置为0，黑子为1，白子为2
			for(var k = 0; k<size; k++){
				arr[i][k] = 0;
			}
		}
		return arr;
	},
	'isOutside' : function(x,y){ //判断是否为边缘
		if(x ==0 || y == 0 || x>=ChessBoard.boardSize || y>=ChessBoard.boardSize){
			alert(Message.unlawfulness);
			return true;
		}else{
			return false;
		}
	},
	'isChess' : function(x,y){//位置是否能下
		if(Rule.boardArr[x][y] != 0){
			alert(Message.unlawfulness);
			return true;
		}else{
			return false;
		}
	},
	'isWin' : function(type,x,y){//是否胜利
		var leng = ChessBoard.boardSize;
		//左
		var alignCount = 1;
		for(var i = 1; i<=x; i++){
			if(Rule.boardArr[x-i][y] != type) break;
			alignCount++;
		}
		//右
		for(var i = 1; i<=leng; i++){
			if(Rule.boardArr[x+i][y] != type) break;
			alignCount++;
		}

		//上
		var verticalCount = 1;
		for(var i = 1; i<=y; i++){
			if(Rule.boardArr[x][y-i] != type) break;
			verticalCount++;
		}
		//下
		for(var i = 1; i<=leng; i++){ 
			if(Rule.boardArr[x][y+i] != type) break;
			verticalCount++;
		}

		//左上方向
		var bevelLeftCount = 1;
		for(var i = 1; i<=y; i++){
			if(Rule.boardArr[x-i][y-i] != type) break;
			bevelLeftCount++;
		}
		//右下方向
		for(var i = 1; i<=leng; i++){
			if(Rule.boardArr[x+i][y+i] != type) break;
			bevelLeftCount++;
		}

		//右上方向
		var bevelRightCount = 1;
		for(var i = 1; i<=y; i++){
			if(Rule.boardArr[x+i][y-i] != type) break;
			bevelRightCount++;
		}
		//左下方向
		for(var i = 1; i<=leng; i++){
			if(Rule.boardArr[x-i][y+i] != type) break;
			bevelRightCount++;
		}

		//判断是否五子相连
		if(alignCount >= 5 || verticalCount >= 5 || bevelLeftCount >=5 || bevelRightCount >=5){
			var hint = document.getElementById('hint');
			if(type == 1){//黑子胜利
				hint.innerHTML = Message.blackWin;
				alert(Message.blackWin);
			}else{//白子胜利
				hint.innerHTML = Message.whiteWin;
				alert(Message.whiteWin);
			}
			//游戏结束
			Rule.isOver = true;
		}		
	},
	//悔棋
	'history' : new Array(),//历史记录
	'record' : function(steps,x,y){//记录
		//产生新记录时删除数组后面历史记录
		this.history.splice(steps,(this.history.length-steps));
		//设置坐标记录
		if(steps == this.history.length){//当撤销悔棋时替换记录坐标
			this.history[steps-1] = [x,y];
		}else{//正常下棋时追加数组记录
			this.history.push([x,y]);				
		}
	},
};

//操作
var Control = {
	'play':function(e){
		//判断游戏是否结束
		if(Rule.isOver){
			alert(Message.gameOver);
			return;
		}

		var size = ChessBoard.gridSize;
		//获取点击坐标
		var x = Math.round((e.clientX-10)/size);//10为左外边距
		var y = Math.round((e.clientY-58)/size);//58为上外边距

		//判断是否为边缘
		if (Rule.isOutside(x,y))  return;	

		//判断坐标是否已有棋子
		if (Rule.isChess(x,y))	return;	

		//创建黑or白子
		Chess.createChess(x,y);

		//判断黑or白子
		if(Chess.isBlack){
			//记录坐标棋子类型
			Rule.boardArr[x][y] = 1;
			//记录步数
			Rule.steps++;
			//下棋记录
			Rule.record(Rule.steps,x,y);
			//判断是否结束
			Rule.isWin(1,x,y);
		}else{
			Rule.boardArr[x][y] = 2;
			Rule.steps++;
			Rule.record(Rule.steps,x,y);
			Rule.isWin(2,x,y);
		}

		if(Rule.isOver) return;

		//下次点击棋子类型
		Chess.isBlack = !Chess.isBlack;
		//提示信息
		Message.hint();
	},
	'reset' :function(){//重新开始
		if(confirm(Message.isReset)){
			Rule.isOver = false;
			Chess.isBlack = true;
			Rule.steps = 0;
			Rule.history = new Array();
			document.getElementById('hint').innerHTML = Message.blackNext;
			ChessBoard.createChessboard();
		}
	},
	'retraction' :function(steps){//悔棋
		var history = Rule.history;
		if(Rule.isOver){
			alert(Message.gameOver);
			return;
		}
		if(steps <= 0 || history.length==0){
			alert(Message.noRetraction);
			return;
		}
		//上一步坐标棋子类型为0
		Rule.boardArr[history[steps-1][0]][history[steps-1][1]] = 0;
		//步数-1
		Rule.steps--;
		Chess.isBlack = !Chess.isBlack;
		//移除棋子
		Chess.delChess(history[steps-1][0],history[steps-1][1]);
		//提示信息
		Message.hint();
	},
	'recallRetraction' :function(steps){//撤销悔棋
		if(Rule.isOver){
			alert(Message.gameOver);
			return;
		}
		var history = Rule.history;
		if(Rule.steps >= history.length){
			alert(Message.noRecall);
			return;
		}
		//撤回下一步坐标棋子类型
		Rule.boardArr[history[steps][0]][history[steps][1]] = Chess.isBlack?1:2;
		//步数-1
		Rule.steps++;
		//还原棋子
		Chess.createChess(history[steps][0],history[steps][1]);
		Chess.isBlack = !Chess.isBlack;			
		//提示信息
		Message.hint();
	}
};


//绑定事件
function addEvent(obj,ev,fn) {   //obj为要绑定事件的元素，ev为要绑定的事件，fn为绑定事件的函数
    if(obj.addEventListener){
        obj.addEventListener(ev,fn,false);
    }else{
        obj.attachEvent("on" + ev,fn);
    }
};

//下棋
addEvent(ChessBoard.canvas,'click',function(e){
	Control.play(e);
});

//重新开始
addEvent(document.getElementById('reset'),'click',function(){
	Control.reset();
});

//悔棋
addEvent(document.getElementById('retraction'),'click',function(){
	Control.retraction(Rule.steps);
});

//撤销悔棋
addEvent(document.getElementById('recallRetraction'),'click',function(){
	Control.recallRetraction(Rule.steps);
});

//初始化
ChessBoard.createChessboard();