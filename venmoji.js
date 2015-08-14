Transactions = new Mongo.Collection("transactions"); //all transaction details
Emojis = new Mongo.Collection("emojis"); //emoji counts
Times = new Mongo.Collection("times"); //emoji counts

var INTERVAL = 4*1000;//how many milliseconds to wait between each update

if (Meteor.isClient) {
	Meteor.subscribe("emojis");
	Template.body.helpers({
		emojis: function(){
			var emojis = Emojis.find({});
			return emojis;
		}
	});
	//highlight emojis when they change
	Template.emoji.rendered = function(){
		this.count = this.data.count;
		var that = this;

		Deps.autorun(function() {
			var emoji = Emojis.findOne(that.data._id);

			if(that.count !== emoji.count){
				that.count = emoji.count;

				var $emoji = $('.emoji[data-emoji="' + emoji._id + '"');
				$emoji.addClass('flash');
				setTimeout(function(){
					$emoji.removeClass('flash');
				}, 1000);
			}

		});
		emojie.path = "images/emoji";
		if(!Emojie.canRender("\ud83d\ude04")){
			emojie(document.querySelector(".emojis"));
		}
	}
}

if(Meteor.isServer){
	Meteor.publish("emojis", function(){
		return Emojis.find({}, {sort: {count: -1} });
	});
	Meteor.startup(function(){
		Meteor.setInterval(update, INTERVAL);
	});
	function update(){
		var nextTime = Times.findOne({$query:{}, $orderby:{time: -1}}).time;//"https://venmo.com/api/v5/public";
		HTTP.get("https://venmo.com/api/v5/public?until="+nextTime, {}, function(error, result){
			if(!error && result){
				result = result.data;
				Timexs.insert({time: (new Date()).getTime()});
				if(result.data){
					_.each(result.data, function(transaction){
						addTransaction(transaction);
					});
				}
			}
		});
	}
	function addTransaction(transaction){
		if(!Transactions.findOne({payment_id:transaction.payment_id})){ //if the transaction doesn't exist
			Transactions.insert(transaction);
			increaseEmojis(transaction);
		}
	}
	function increaseEmojis(transaction){
		var emojiRegex = /\uD83C(?:\uDDE6\uD83C(?:\uDDEB|\uDDFD|\uDDF1|\uDDF8|\uDDE9|\uDDF4|\uDDEE|\uDDF6|\uDDEC|\uDDF7|\uDDF2|\uDDFC|\uDDE8|\uDDFA|\uDDF9|\uDDFF|\uDDEA)|\uDDE9\uD83C(?:\uDDFF|\uDDF0|\uDDEC|\uDDEF|\uDDF2|\uDDF4|\uDDEA)|\uDDE7\uD83C(?:\uDDF8|\uDDED|\uDDE9|\uDDE7|\uDDFE|\uDDEA|\uDDFF|\uDDEF|\uDDF2|\uDDF9|\uDDF4|\uDDE6|\uDDFC|\uDDFB|\uDDF7|\uDDF3|\uDDEC|\uDDEB|\uDDEE|\uDDF6|\uDDF1)|\uDDEE\uD83C(?:\uDDF4|\uDDE8|\uDDF8|\uDDF3|\uDDE9|\uDDF7|\uDDF6|\uDDEA|\uDDF2|\uDDF1|\uDDF9)|\uDDFB\uD83C(?:\uDDEC|\uDDE8|\uDDEE|\uDDFA|\uDDE6|\uDDEA|\uDDF3)|\uDDF0\uD83C(?:\uDDED|\uDDFE|\uDDF2|\uDDFF|\uDDEA|\uDDEE|\uDDFC|\uDDEC|\uDDF5|\uDDF7|\uDDF3)|\uDDE8\uD83C(?:\uDDF2|\uDDE6|\uDDFB|\uDDEB|\uDDF1|\uDDF3|\uDDFD|\uDDF5|\uDDE8|\uDDF4|\uDDEC|\uDDE9|\uDDF0|\uDDF7|\uDDEE|\uDDFA|\uDDFC|\uDDFE|\uDDFF|\uDDED)|\uDDEA\uD83C(?:\uDDE6|\uDDE8|\uDDEC|\uDDF7|\uDDEA|\uDDF9|\uDDFA|\uDDF8|\uDDED)|\uDDF9\uD83C(?:\uDDE9|\uDDEB|\uDDFC|\uDDEF|\uDDFF|\uDDED|\uDDF1|\uDDEC|\uDDF0|\uDDF4|\uDDF9|\uDDE6|\uDDF3|\uDDF7|\uDDF2|\uDDE8|\uDDFB)|\uDDED\uD83C(?:\uDDF7|\uDDF9|\uDDF2|\uDDF3|\uDDF0|\uDDFA)|\uDDF8\uD83C(?:\uDDFB|\uDDF2|\uDDF9|\uDDE6|\uDDF3|\uDDE8|\uDDF1|\uDDEC|\uDDFD|\uDDF0|\uDDEE|\uDDE7|\uDDF4|\uDDF8|\uDDED|\uDDE9|\uDDF7|\uDDEF|\uDDFF|\uDDEA|\uDDFE)|\uDDEC\uD83C(?:\uDDF6|\uDDEB|\uDDE6|\uDDF2|\uDDEA|\uDDED|\uDDEE|\uDDF7|\uDDF1|\uDDE9|\uDDF5|\uDDFA|\uDDF9|\uDDEC|\uDDF3|\uDDFC|\uDDFE|\uDDF8|\uDDE7)|\uDDEB\uD83C(?:\uDDF0|\uDDF4|\uDDEF|\uDDEE|\uDDF7|\uDDF2)|\uDDF5\uD83C(?:\uDDEB|\uDDF0|\uDDFC|\uDDF8|\uDDE6|\uDDEC|\uDDFE|\uDDEA|\uDDED|\uDDF3|\uDDF1|\uDDF9|\uDDF7|\uDDF2)|\uDDEF\uD83C(?:\uDDF2|\uDDF5|\uDDEA|\uDDF4)|\uDDFD\uD83C\uDDF0|\uDDF1\uD83C(?:\uDDE6|\uDDFB|\uDDE7|\uDDF8|\uDDF7|\uDDFE|\uDDEE|\uDDF9|\uDDFA|\uDDF0|\uDDE8)|\uDDF2\uD83C(?:\uDDF4|\uDDF0|\uDDEC|\uDDFC|\uDDFE|\uDDFB|\uDDF1|\uDDF9|\uDDED|\uDDF6|\uDDF7|\uDDFA|\uDDFD|\uDDE9|\uDDE8|\uDDF3|\uDDEA|\uDDF8|\uDDE6|\uDDFF|\uDDF2|\uDDF5|\uDDEB)|\uDDFE\uD83C(?:\uDDF9|\uDDEA)|\uDDF3\uD83C(?:\uDDE6|\uDDF7|\uDDF5|\uDDF1|\uDDE8|\uDDFF|\uDDEE|\uDDEA|\uDDEC|\uDDFA|\uDDEB|\uDDF4)|\uDDF4\uD83C\uDDF2|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C(?:\uDDEA|\uDDF4|\uDDFA|\uDDFC|\uDDF8)|\uDDFC\uD83C(?:\uDDF8|\uDDEB)|\uDDFF\uD83C(?:\uDDE6|\uDDF2|\uDDFC)|\uDDFA\uD83C(?:\uDDEC|\uDDE6|\uDDF8|\uDDFE|\uDDF2|\uDDFF))|[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD95\uDD96\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0\uDEEB\uDEEC]|\uD83E[\uDD10-\uDD18\uDD80-\uDD84\uDDC0]/g;
		var uniqueMessageCharacters = transaction.message.replace(/(.)(?=.*\1)/g, "");
		var emojis = uniqueMessageCharacters.match(emojiRegex);
		_.each(emojis, function(emoji){
			if(Emojis.findOne({_id:emoji})){
				Emojis.update(emoji, {$inc: {count: 1} });
			}else{
				Emojis.insert({ _id: emoji, count: 1 });
			}
		});
	}
}